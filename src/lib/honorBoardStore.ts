/**
 * honorBoardStore.ts
 *
 * 💎 CAPA DE PERSISTENCIA DEL CUADRO DE HONOR EN CLOUDFLARE D1
 *
 * Hasta ahora el Cuadro de Honor renderizaba siempre listas vacías porque
 * `getDefaultHonorSpots()` devolvía catálogos hardcodeados en memoria. Este módulo
 * aterriz los puestos y el libro de pujas en D1 para que:
 *
 *   1. La página SSR (`/cuadro-de-honor`) muestre los líderes reales.
 *   2. El webhook de Stripe aplique la puja confirmada y reescriba el podio.
 *   3. La validación `+1€` del servidor compare contra el récord REAL.
 *   4. La idempotencia sobreviva a reinicios de isolate (el ledger en memoria no).
 *
 * Diseño híbrido: columnas relacionales para indexar/ordenar y `entry_json` para
 * conservar el `HonorSpotEntry` completo (títulos cuatrilingües, backers, citas).
 *
 * GR-11: solo se persisten pujas confirmadas por pasarela real. El modo sandbox
 * registra la intención pero NUNCA altera el podio público.
 */

import {
  HONOR_LISTS,
  processHonorBid,
  processCommunityBoost,
  rankHonorList,
  type HonorCategory,
  type HonorSpotEntry,
  type CommunityBoostResult,
  type ProcessBidResult,
} from "./honorBoardEngine";
import type { ServiceItem } from "../data/services";
import { getD1Binding } from "./d1Logger";

/**
 * Esquema D1 del Cuadro de Honor.
 * `INSERT ... ON CONFLICT` + `db.batch()` garantizan escrituras atómicas (INV-05).
 */
export const HONOR_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS honor_spots (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  position INTEGER NOT NULL,
  current_bid_eur REAL NOT NULL,
  sponsor_name TEXT NOT NULL,
  entry_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_honor_spots_cat_service ON honor_spots(category, service_id);
CREATE INDEX IF NOT EXISTS idx_honor_spots_cat_pos ON honor_spots(category, position);

CREATE TABLE IF NOT EXISTS honor_bids (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  amount_eur REAL NOT NULL,
  sponsor_name TEXT,
  sponsor_message TEXT,
  invoice_id TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_honor_bids_cat ON honor_bids(category, created_at DESC);
`;

/** Estados posibles de una puja en el libro mayor. */
export type HonorBidStatus = "sandbox_recorded" | "confirmed" | "rejected";

let isHonorSchemaInitialized = false;

/** Reinicia el flag de inicialización (uso exclusivo de tests · GR-05). */
export function _resetHonorSchemaForTesting(): void {
  isHonorSchemaInitialized = false;
}

function isD1Ready(db: any): boolean {
  return Boolean(db) && typeof db.prepare === "function";
}

/** Fila cruda de `honor_spots` tal y como la devuelve D1. */
interface HonorSpotRow {
  entry_json: string;
  current_bid_eur: number;
  service_id: string;
  service_slug: string;
}

/**
 * Crea el esquema de forma perezosa y tolerante a fallos.
 * Si D1 no está disponible (dev local sin binding) se degrada sin romper el render.
 */
export async function ensureHonorSchema(db: any): Promise<boolean> {
  const d1 = getD1Binding(db);
  if (!isD1Ready(d1)) return false;
  if (isHonorSchemaInitialized) return true;

  try {
    if (typeof d1.exec === "function") {
      await d1.exec(HONOR_SCHEMA_SQL);
    }
    isHonorSchemaInitialized = true;
    return true;
  } catch (err) {
    // GR-15: nunca silencioso
    console.error("[HonorStore] No se pudo inicializar el esquema D1 del Cuadro de Honor:", err);
    return false;
  }
}

/** Catálogo vacío tipado (respaldo honesto cuando no hay binding D1). */
export function emptyHonorCatalog(): Record<HonorCategory, HonorSpotEntry[]> {
  return {
    "elite-general": [],
    "maestros-instalaciones": [],
    "artesanos-sabor": [],
    "excelencia-nautica": [],
    "bienestar-salud": [],
    "emprendimientos-emergentes": [],
  };
}

function parseEntry(row: any): HonorSpotEntry | null {
  if (!row?.entry_json) return null;
  try {
    const parsed = JSON.parse(row.entry_json) as HonorSpotEntry;
    return {
      ...parsed,
      // El ranking se recalcula en memoria: la columna `position` es solo un índice de lectura.
      currentBidEuros: Number(row.current_bid_eur ?? parsed.currentBidEuros ?? 0),
      serviceId: row.service_id ?? parsed.serviceId,
      serviceSlug: row.service_slug ?? parsed.serviceSlug,
    };
  } catch (err) {
    console.error("[HonorStore] entry_json corrupto en honor_spots:", err);
    return null;
  }
}


/**
 * Carga los puestos de una categoría concreta, ordenados por puja (rank determinista).
 * Retorna `[]` si D1 no está disponible o la tabla está vacía (Zero Fake Data: nunca inventa).
 */
export async function loadCategorySpots(db: any, category: HonorCategory): Promise<HonorSpotEntry[]> {
  const d1 = getD1Binding(db);
  if (!isD1Ready(d1)) return [];
  if (!(await ensureHonorSchema(d1))) return [];

  try {
    const result = (await d1
      .prepare(`SELECT entry_json, current_bid_eur, service_id, service_slug FROM honor_spots WHERE category = ?`)
      .bind(category)
      .all()) as { results?: HonorSpotRow[] } | undefined;

    const rows: HonorSpotRow[] = result?.results || [];
    const entries: HonorSpotEntry[] = rows
      .map((row: HonorSpotRow): HonorSpotEntry | null => parseEntry(row))
      .filter((entry: HonorSpotEntry | null): entry is HonorSpotEntry => entry !== null);

    return rankHonorList(entries);
  } catch (err) {
    // GR-15: registrar el fallo y devolver catálogo vacío, nunca datos inventados
    console.error(`[HonorStore] Fallo al leer la categoría "${category}":`, err);
    return [];
  }
}

/** Carga las 6 listas de honor del Cuadro de Mallorca desde D1. */
export async function loadAllHonorSpots(db: any): Promise<Record<HonorCategory, HonorSpotEntry[]>> {
  const catalog = emptyHonorCatalog();
  for (const list of HONOR_LISTS) {
    catalog[list.id] = await loadCategorySpots(db, list.id);
  }
  return catalog;
}

/**
 * Reescribe atómicamente el podio de una categoría.
 * Usa `db.batch()` (transacción de D1) para evitar estados parciales (INV-05).
 */
export async function replaceCategorySpots(
  db: any,
  category: HonorCategory,
  entries: HonorSpotEntry[],
): Promise<boolean> {
  const d1 = getD1Binding(db);
  if (!isD1Ready(d1)) return false;
  if (!(await ensureHonorSchema(d1))) return false;

  const now = new Date().toISOString();
  const ranked = rankHonorList(entries);

  const statements: any[] = [d1.prepare(`DELETE FROM honor_spots WHERE category = ?`).bind(category)];

  for (const entry of ranked) {
    statements.push(
      d1
        .prepare(
          `INSERT INTO honor_spots
            (id, category, service_id, service_slug, position, current_bid_eur, sponsor_name, entry_json, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             position = excluded.position,
             current_bid_eur = excluded.current_bid_eur,
             sponsor_name = excluded.sponsor_name,
             entry_json = excluded.entry_json,
             updated_at = excluded.updated_at`,
        )
        .bind(
          entry.id,
          category,
          entry.serviceId,
          entry.serviceSlug,
          entry.position,
          entry.currentBidEuros,
          entry.sponsorName,
          JSON.stringify(entry),
          entry.nominatedAt || now,
          now,
        ),
    );
  }

  try {
    if (typeof d1.batch === "function") {
      await d1.batch(statements);
    } else {
      for (const stmt of statements) await stmt.run();
    }
    return true;
  } catch (err) {
    // GR-15: fallo de escritura crítico debe ser visible
    console.error(`[HonorStore] Fallo al persistir el podio de "${category}":`, err);
    return false;
  }
}

/**
 * Idempotencia DURABLE: comprueba en D1 si la clave ya fue procesada.
 * El ledger en memoria de `paymentSecurityEngine` se pierde entre isolates de
 * Cloudflare Workers, por lo que esta consulta es la barrera real anti-replay.
 */
export async function isBidAlreadyProcessed(db: any, idempotencyKey: string): Promise<boolean> {
  const d1 = getD1Binding(db);
  if (!isD1Ready(d1)) return false;
  if (!(await ensureHonorSchema(d1))) return false;

  try {
    const row = await d1
      .prepare(`SELECT id FROM honor_bids WHERE idempotency_key = ? AND status = 'confirmed'`)
      .bind(idempotencyKey)
      .first();
    return Boolean(row);
  } catch (err) {
    console.error("[HonorStore] Fallo al comprobar idempotencia de puja:", err);
    return false;
  }
}

export interface RecordHonorBidParams {
  idempotencyKey: string;
  category: HonorCategory;
  serviceId: string;
  mode: string;
  amountEuros: number;
  sponsorName?: string;
  sponsorMessage?: string;
  invoiceId?: string;
  status: HonorBidStatus;
}

/** Inserta (o actualiza) una fila del libro mayor de pujas. */
export async function recordHonorBid(db: any, params: RecordHonorBidParams): Promise<boolean> {
  const d1 = getD1Binding(db);
  if (!isD1Ready(d1)) return false;
  if (!(await ensureHonorSchema(d1))) return false;

  try {
    await d1
      .prepare(
        `INSERT INTO honor_bids
          (id, idempotency_key, category, service_id, mode, amount_eur, sponsor_name, sponsor_message, invoice_id, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(idempotency_key) DO UPDATE SET
           status = excluded.status,
           amount_eur = excluded.amount_eur,
           sponsor_message = excluded.sponsor_message,
           invoice_id = excluded.invoice_id`,
      )
      .bind(
        `bid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        params.idempotencyKey,
        params.category,
        params.serviceId,
        params.mode,
        Number(params.amountEuros.toFixed(2)),
        params.sponsorName || null,
        params.sponsorMessage || null,
        params.invoiceId || null,
        params.status,
        new Date().toISOString(),
      )
      .run();
    return true;
  } catch (err) {
    console.error("[HonorStore] Fallo al registrar la puja en el libro mayor:", err);
    return false;
  }
}

export interface ApplyConfirmedBidParams {
  category: HonorCategory;
  service: ServiceItem;
  mode: "owner_bid" | "community_boost";
  amountEuros: number;
  sponsorName: string;
  sponsorMessage?: string;
  idempotencyKey: string;
  invoiceId?: string;
}

export type ApplyConfirmedBidOutcome =
  | { applied: true; result: ProcessBidResult | CommunityBoostResult }
  | { applied: false; error: string; alreadyProcessed?: boolean };

/**
 * Aplica una puja YA CONFIRMADA por la pasarela al podio persistido en D1.
 *
 * Orden transaccional (INV-05, sin efectos parciales):
 *   1. Guarda la puja en el libro mayor (`confirmed`).
 *   2. Ejecuta el motor (`processHonorBid` / `processCommunityBoost`).
 *   3. Reescribe el podio completo solo si el motor aceptó.
 *   4. Si el motor rechaza, marca la puja como `rejected` (queda auditada).
 */
export async function applyConfirmedBid(db: any, params: ApplyConfirmedBidParams): Promise<ApplyConfirmedBidOutcome> {
  if (await isBidAlreadyProcessed(db, params.idempotencyKey)) {
    return { applied: false, error: "Transacción ya aplicada previamente (idempotente).", alreadyProcessed: true };
  }

  const currentList = await loadCategorySpots(db, params.category);
  const isCommunity = params.mode === "community_boost";

  const outcome: ApplyConfirmedBidOutcome = isCommunity
    ? (() => {
        const result = processCommunityBoost(
          currentList,
          {
            serviceId: params.service.id,
            backerName: params.sponsorName,
            amountEuros: params.amountEuros,
            message: params.sponsorMessage,
          },
          params.category,
          params.service,
        );
        return result.success
          ? { applied: true, result }
          : { applied: false, error: result.error || "Aportación no válida para el Cuadro de Honor." };
      })()
    : (() => {
        const result = processHonorBid(
          currentList,
          {
            serviceId: params.service.id,
            sponsorName: params.sponsorName,
            sponsorMessage: params.sponsorMessage,
            bidAmountEuros: params.amountEuros,
          },
          params.category,
          params.service,
          db,
        );
        return result.success
          ? { applied: true, result }
          : { applied: false, error: result.error || "Puja no válida para el Cuadro de Honor." };
      })();

  if (!outcome.applied) {
    // La puja queda auditada como rechazada: nunca se pierde el rastro financiero.
    await recordHonorBid(db, {
      idempotencyKey: params.idempotencyKey,
      category: params.category,
      serviceId: params.service.id,
      mode: params.mode,
      amountEuros: params.amountEuros,
      sponsorName: params.sponsorName,
      sponsorMessage: params.sponsorMessage,
      invoiceId: params.invoiceId,
      status: "rejected",
    });
    return outcome;
  }

  const persisted = await replaceCategorySpots(db, params.category, outcome.result.updatedList);
  if (!persisted) return { applied: false, error: "No se pudo persistir el podio en D1." };

  await recordHonorBid(db, {
    idempotencyKey: params.idempotencyKey,
    category: params.category,
    serviceId: params.service.id,
    mode: params.mode,
    amountEuros: params.amountEuros,
    sponsorName: params.sponsorName,
    sponsorMessage: params.sponsorMessage,
    invoiceId: params.invoiceId,
    status: "confirmed",
  });

  return outcome;
}

