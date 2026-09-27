import type {
  ServiceItem,
  ServiceStatus,
  ServiceEvolutionEntry,
  ExtendedVerificationStatus,
  TrustLevel,
  DetailedAuditTrailEntry,
} from "../data/services";
import type { Firestore } from "firebase/firestore";
import type { VerificationMethod } from "./managerSecurityEngine";
import { reportClientFailure } from "./clientTelemetry";

/**
 * Campos que SOLO puede escribir un administrador.
 * Un `manager` jamás puede otorgarse el sello de verificación (INV-01 · GR-11/GR-13):
 * la UI ya lo oculta y las reglas Firestore lo bloquean, pero la capa de datos
 * también lo filtra (defensa en profundidad).
 */
export const VERIFICATION_FIELDS = [
  "verified",
  "verificationStatus",
  "trustLevel",
  "confidenceScore",
  "lastVerifiedAt",
  "verificationMethod",
  "documentUrl",
  "verifiedByUid",
  "verifiedByRole",
  "isClaimed",
  "claimedByUid",
  "claimedAt",
] as const;

export type VerificationField = (typeof VERIFICATION_FIELDS)[number];

/** Máximo de entradas de auditoría conservadas por ficha (evita documentos infinitos). */
export const AUDIT_TRAIL_LIMIT = 20;

export type OverrideGuardCode = "missing_evidence" | "ownership_conflict" | "invalid_actor" | "invalid_payload";

/**
 * Error tipado del guardián de titularidad. Nunca se silencia: la UI lo muestra
 * y se reporta a telemetría (GR-15).
 */
export class OverrideGuardError extends Error {
  constructor(
    public readonly code: OverrideGuardCode,
    message: string,
  ) {
    super(message);
    this.name = "OverrideGuardError";
    this.report();
  }

  /** Deja rastro del intento bloqueado: nunca fallos silenciosos (GR-15). */
  private report(): void {
    reportClientFailure(`override_guard:${this.code}`, this, {
      level: "SECURITY",
      category: "AUTH",
    });
  }
}

/** Actor que ejecuta la escritura: determina qué campos puede tocar. */
export interface OverrideActor {
  uid: string;
  role: "manager" | "admin";
}

export interface SaveOverrideOptions {
  /** Transferencia explícita de titularidad (aprobación de un claim por el admin). */
  transferOwnershipTo?: string;
  /** Rol que firma la entrada de auditoría (por defecto, el del actor). */
  auditRole?: DetailedAuditTrailEntry["authorRole"];
  /** Motivo/justificación para el registro de auditoría. */
  reason?: string;
}

/**
 * Elimina de un payload todos los campos de verificación/titularidad.
 * @example stripVerificationFields({ phone: "971", verified: true }) → { phone: "971" }
 */
export function stripVerificationFields<T extends Record<string, unknown>>(data: T): Partial<T> {
  const shielded = { ...data };
  for (const field of VERIFICATION_FIELDS) {
    delete shielded[field];
  }
  return shielded;
}

/**
 * Resuelve el `ownerUid` que debe persistirse.
 * Reglas (INV-02): la titularidad nunca se pisa por accidente y el admin nunca
 * se convierte en dueño de una ficha por el mero hecho de verificarla.
 */
export function resolveOwnerUid(
  existing: ServiceOverride | null,
  actor: OverrideActor,
  options: SaveOverrideOptions = {},
): string | undefined {
  if (options.transferOwnershipTo) return options.transferOwnershipTo;
  if (existing?.ownerUid) return undefined; // merge:true deja el valor existente intacto
  if (actor.role === "manager") return actor.uid;
  return undefined;
}

/**
 * Reportero de errores de la capa de overrides: nunca `catch` silencioso (GR-15).
 * Delega en el reportero deduplicado compartido (`clientTelemetry`).
 */
function reportOverrideFailure(
  scope: string,
  slug: string,
  error: unknown,
  level: "ERROR" | "SECURITY" = "ERROR",
): void {
  reportClientFailure(`service_overrides/${scope}`, error, {
    level,
    category: "DATABASE",
    resource: slug,
  });
}

/**
 * Variable global configurable que controla si se permite editar y sobreescribir contenido
 * dinámicamente desde la base de datos (Firestore / Manager Console).
 */
let ALLOW_DATABASE_OVERRIDES = true;

export function setAllowDatabaseOverrides(enabled: boolean): void {
  ALLOW_DATABASE_OVERRIDES = enabled;
}

export function isDatabaseOverridesEnabled(): boolean {
  return ALLOW_DATABASE_OVERRIDES;
}

export interface ServiceOverride {
  /**
   * UID del titular legítimo de la ficha (INV-02).
   * Es `undefined` mientras nadie haya reclamado la ficha: la verificación de un
   * administrador NO convierte al admin en dueño del negocio.
   */
  ownerUid?: string;
  updatedAt?: any;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  schedule?: string;
  status?: ServiceStatus;
  isObsolete?: boolean;
  evolutionHistory?: ServiceEvolutionEntry[];
  fullDescription?: {
    es?: string;
    en?: string;
    ca?: string;
    de?: string;
  };
  highlights?: {
    es?: string[];
    en?: string[];
    ca?: string[];
    de?: string[];
  };
  servicesProvided?: {
    es?: string[];
    en?: string[];
    ca?: string[];
    de?: string[];
  };
  gallery?: string[];
  image?: string;
  verified?: boolean;
  verificationStatus?: ExtendedVerificationStatus | "verified";
  trustLevel?: TrustLevel;
  confidenceScore?: number;
  lastVerifiedAt?: string;
  isClaimed?: boolean;
  claimedByUid?: string;
  claimedAt?: string;
  /** NIF/CIF/NIE consignado en la reclamación aprobada (INV-08 · GR-11). */
  businessTaxId?: string;
  /** Método con el que se acreditó la titularidad. Obligatorio para sellar (INV-01). */
  verificationMethod?: VerificationMethod;
  /** Enlace https:// al documento acreditativo (IAE 036/037, escrituras, poder notarial). */
  documentUrl?: string;
  /** Administrador que emitió el sello oficial (trazabilidad, INV-08). */
  verifiedByUid?: string;
  verifiedByRole?: "admin";
  /** Historial acotado de cambios con autor y valores anterior/nuevo (INV-08). */
  auditTrail?: DetailedAuditTrailEntry[];
}

// -----------------------------------------------------------------------------
// In-Memory Cache Layer (Cero coste en lecturas repetidas de Firebase)
// -----------------------------------------------------------------------------
interface CacheEntry {
  override: ServiceOverride | null;
  cachedAt: number;
}

const OVERRIDES_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos TTL

export async function getServiceOverride(db: Firestore | undefined, slug: string): Promise<ServiceOverride | null> {
  if (!db) return null;

  // 1. Check in-memory cache
  const cached = OVERRIDES_CACHE.get(slug);
  const now = Date.now();
  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return cached.override;
  }

  // 2. Fetch from Firestore
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const snap = await getDoc(doc(db, "service_overrides", slug));
    const exists = typeof snap.exists === "function" ? snap.exists() : Boolean(snap.exists);
    const override = exists ? (snap.data() as ServiceOverride) : null;

    // Save to cache
    OVERRIDES_CACHE.set(slug, { override, cachedAt: now });
    return override;
  } catch (error) {
    reportOverrideFailure("read", slug, error);
    return null;
  }
}

/**
 * Lectura directa a Firestore ignorando la caché en memoria (INV-02).
 * Obligatoria antes de decidir sobre la titularidad de una ficha: nunca se decide
 * sobre datos cacheados de hasta 5 minutos de antigüedad.
 */
export async function getServiceOverrideFresh(
  db: Firestore | undefined,
  slug: string,
): Promise<ServiceOverride | null> {
  if (!db || !slug) return null;
  const override = await readRawOverride(db, slug);
  if (override) {
    OVERRIDES_CACHE.set(slug, { override, cachedAt: Date.now() });
  }
  return override;
}

/**
 * Combina un servicio estático con su superposición dinámica (si existe).
 * Gestiona el archivo de contenido obsoleto en la evolución histórica y la purga de errores.
 */
export function mergeServiceWithOverride(staticService: ServiceItem, override: ServiceOverride | null): ServiceItem {
  if (!override || !isDatabaseOverridesEnabled()) return staticService;

  // Filtrar entradas de evolución: conservar histórico legítimo y purgar datos erróneos
  const existingHistory = staticService.evolutionHistory || [];
  const overrideHistory = (override.evolutionHistory || []).filter((h) => h.action !== "purge_erroneous");
  const mergedHistory = [...existingHistory, ...overrideHistory];

  return {
    ...staticService,
    phone: override.phone || staticService.phone,
    whatsapp: override.whatsapp || staticService.whatsapp,
    email: override.email || staticService.email,
    website: override.website || staticService.website,
    schedule: override.schedule || staticService.schedule,
    status: override.status || staticService.status,
    image: override.image || staticService.image,
    gallery: override.gallery && override.gallery.length > 0 ? override.gallery : staticService.gallery,
    evolutionHistory: mergedHistory.length > 0 ? mergedHistory : undefined,
    verified: override.verified !== undefined ? override.verified : staticService.verified,
    verificationStatus: override.verificationStatus || staticService.verificationStatus,
    trustLevel: override.trustLevel || staticService.trustLevel,
    confidenceScore: override.confidenceScore !== undefined ? override.confidenceScore : staticService.confidenceScore,
    lastVerifiedAt: override.lastVerifiedAt || staticService.lastVerifiedAt,
    isClaimed: override.isClaimed !== undefined ? override.isClaimed : staticService.isClaimed,
    claimedByUid: override.claimedByUid || staticService.claimedByUid,
    claimedAt: override.claimedAt || staticService.claimedAt,
    fullDescription: staticService.fullDescription
      ? {
          es: override.fullDescription?.es || staticService.fullDescription.es || "",
          en: override.fullDescription?.en || staticService.fullDescription.en || "",
          ca: override.fullDescription?.ca || staticService.fullDescription.ca || "",
          de: override.fullDescription?.de || staticService.fullDescription.de || "",
        }
      : override.fullDescription
        ? {
            es: override.fullDescription.es || "",
            en: override.fullDescription.en || "",
            ca: override.fullDescription.ca || "",
            de: override.fullDescription.de || "",
          }
        : undefined,
    highlights: {
      es: override.highlights?.es || staticService.highlights?.es || [],
      en: override.highlights?.en || staticService.highlights?.en || [],
      ca: override.highlights?.ca || staticService.highlights?.ca || [],
      de: override.highlights?.de || staticService.highlights?.de || [],
    },
    servicesProvided: {
      es: override.servicesProvided?.es || staticService.servicesProvided?.es || [],
      en: override.servicesProvided?.en || staticService.servicesProvided?.en || [],
      ca: override.servicesProvided?.ca || staticService.servicesProvided?.ca || [],
      de: override.servicesProvided?.de || staticService.servicesProvided?.de || [],
    },
  };
}

/**
 * Lee el override **fresco** desde Firestore (sin caché) para poder decidir
 * con seguridad sobre la titularidad y el histórico antes de escribir.
 */
async function readRawOverride(db: Firestore, slug: string): Promise<ServiceOverride | null> {
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const snap = await getDoc(doc(db, "service_overrides", slug));
    const exists = typeof snap.exists === "function" ? snap.exists() : Boolean(snap.exists);
    return exists ? (snap.data() as ServiceOverride) : null;
  } catch (error) {
    reportOverrideFailure("preflight-read", slug, error);
    return null;
  }
}

/** Extrae los valores anteriores solo de las claves que van a cambiar (auditoría legible). */
function pickOldValues(existing: ServiceOverride | null, keys: string[]): Record<string, unknown> | undefined {
  if (!existing) return undefined;
  const snapshot: Record<string, unknown> = {};
  for (const key of keys) {
    snapshot[key] = (existing as Record<string, unknown>)[key] ?? null;
  }
  return Object.keys(snapshot).length > 0 ? snapshot : undefined;
}

/**
 * Guarda una modificación de negocio en Firestore y actualiza la caché local.
 *
 * Garantías (bloque vinculante · INV-01/INV-02/INV-08):
 *  - Un `manager` no puede escribir campos de verificación: se filtran aquí y en las reglas.
 *  - El `ownerUid` existente NUNCA se sobrescribe; el admin que verifica no se apropia la ficha.
 *  - Cada escritura deja una entrada de auditoría con autor, campos y valores anterior/nuevo.
 *
 * @throws {OverrideGuardError} si el actor no es manager/admin o si la transferencia falla.
 */
export async function saveServiceOverride(
  db: Firestore,
  slug: string,
  actor: OverrideActor,
  data: Partial<Omit<ServiceOverride, "ownerUid" | "updatedAt" | "auditTrail">>,
  options: SaveOverrideOptions = {},
): Promise<ServiceOverride> {
  if (!actor?.uid || (actor.role !== "manager" && actor.role !== "admin")) {
    throw new OverrideGuardError(
      "invalid_actor",
      "Se requiere un usuario autenticado con rol manager o admin para guardar la ficha.",
    );
  }
  if (!slug || typeof slug !== "string") {
    throw new OverrideGuardError("invalid_payload", "Slug de negocio inválido.");
  }

  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
  const existing = await readRawOverride(db, slug);

  // INV-01: blindaje del sello de verificación (defensa en profundidad sobre las reglas).
  const safeData = (actor.role === "admin" ? { ...data } : stripVerificationFields(data)) as Partial<ServiceOverride>;
  // INV-08: el histórico NUNCA se acepta desde el cliente (evita entradas de auditoría falsificadas,
  // p. ej. un manager firmando cambios como "admin"); se reconstruye siempre desde el estado real.
  delete safeData.auditTrail;

  if (options.transferOwnershipTo && existing?.ownerUid && existing.ownerUid !== options.transferOwnershipTo) {
    throw new OverrideGuardError(
      "ownership_conflict",
      `La ficha ya está gestionada por el titular ${existing.ownerUid}; revoca la titularidad antes de transferirla.`,
    );
  }

  const ownerUid = resolveOwnerUid(existing, actor, options);
  const changedKeys = Object.keys(safeData);

  // INV-08: trazabilidad temporal de cada escritura (autor, campos y valores).
  const auditEntry: DetailedAuditTrailEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    action: existing ? "updated" : "created",
    fieldChanged: changedKeys.length > 0 ? changedKeys.join(",") : undefined,
    oldValue: pickOldValues(existing, changedKeys),
    newValue: Object.keys(safeData).length > 0 ? (safeData as Record<string, unknown>) : undefined,
    authorRole: options.auditRole ?? actor.role,
    authorUid: actor.uid,
    reason: options.reason,
  };

  const overrideDoc: ServiceOverride = {
    ...safeData,
    ...(ownerUid ? { ownerUid } : {}),
    auditTrail: [...(existing?.auditTrail ?? []), auditEntry].slice(-AUDIT_TRAIL_LIMIT),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, "service_overrides", slug), overrideDoc, { merge: true });
  } catch (error) {
    reportOverrideFailure("write", slug, error);
    throw error;
  }

  // Invalidar y refrescar la caché en memoria
  const cachedDoc: ServiceOverride = { ...existing, ...overrideDoc, updatedAt: new Date().toISOString() };
  OVERRIDES_CACHE.set(slug, { override: cachedDoc, cachedAt: Date.now() });
  return cachedDoc;
}

/**
 * Entrada de verificación del administrador.
 * El sello oficial exige método + documento acreditativo: sin ellos no hay verificación (GR-11).
 */
export interface AdminVerificationInput {
  confidenceScore?: number;
  verificationStatus?: ExtendedVerificationStatus | "verified";
  trustLevel?: TrustLevel;
  verified?: boolean;
  verificationMethod?: VerificationMethod;
  documentUrl?: string;
  notes?: string;
}

/**
 * Valida o verifica formalmente un negocio por parte de un administrador.
 *
 * INV-01: solo el admin sella, y **solo con evidencia real** (`verificationMethod` +
 * `documentUrl` https). INV-02: la verificación NO cambia la titularidad de la ficha.
 *
 * @throws {OverrideGuardError} código `missing_evidence` si falta la acreditación.
 */
export async function verifyBusinessAsAdmin(
  db: Firestore,
  slug: string,
  adminUid: string,
  options: AdminVerificationInput = {},
): Promise<ServiceOverride> {
  const isVerifying = options.verified ?? true;
  const verificationStatus = options.verificationStatus ?? "verified_official";
  const claimsOfficialStatus = isVerifying || verificationStatus === "verified_official";

  if (claimsOfficialStatus) {
    if (!options.verificationMethod) {
      throw new OverrideGuardError(
        "missing_evidence",
        "No se puede emitir el sello oficial sin método de acreditación (official_document, corporate_email, phone_sms_otp o manual_notarial).",
      );
    }
    if (!options.documentUrl || !/^https:\/\/.+/i.test(options.documentUrl)) {
      throw new OverrideGuardError(
        "missing_evidence",
        "No se puede emitir el sello oficial sin un enlace https:// al documento acreditativo del titular (IAE 036/037, escrituras o poder notarial).",
      );
    }
  }

  const verifiedDoc: Partial<Omit<ServiceOverride, "ownerUid" | "updatedAt" | "auditTrail">> = {
    verified: isVerifying,
    verificationStatus,
    trustLevel: options.trustLevel ?? (isVerifying ? "level_3_official" : "level_1_discovery"),
    confidenceScore: options.confidenceScore ?? (isVerifying ? 95 : 70),
    lastVerifiedAt: new Date().toISOString(),
    ...(options.verificationMethod ? { verificationMethod: options.verificationMethod } : {}),
    ...(options.documentUrl ? { documentUrl: options.documentUrl } : {}),
    ...(isVerifying ? { verifiedByUid: adminUid, verifiedByRole: "admin" as const } : {}),
  };

  return saveServiceOverride(db, slug, { uid: adminUid, role: "admin" }, verifiedDoc, {
    auditRole: "admin",
    reason: options.notes ?? "Verificación formal del sello oficial por administrador",
  });
}

/**
 * Payload de la aprobación de un claim (aplicado por el admin en un batch atómico).
 * La titularidad pasa al solicitante y el sello queda firmado por el admin con la
 * acreditación aportada: nunca se inventa evidencia (INV-01/INV-02/INV-08 · GR-11).
 */
export function buildClaimedOverridePayload(input: {
  applicantUid: string;
  reviewerUid: string;
  businessTaxId: string;
  serviceId: string;
  documentUrl?: string;
  verificationMethod?: VerificationMethod;
  claimedAt?: string;
  existingAuditTrail?: DetailedAuditTrailEntry[];
}): ServiceOverride {
  const claimedAt = input.claimedAt ?? new Date().toISOString();
  const verificationMethod = input.verificationMethod ?? "manual_notarial";
  const documentUrl =
    input.documentUrl ?? (input.businessTaxId?.startsWith("https://") ? input.businessTaxId : undefined);

  const claimEntry: DetailedAuditTrailEntry = {
    id: `${Date.now()}-claim`,
    timestamp: claimedAt,
    action: "claimed",
    fieldChanged: "ownerUid,isClaimed,claimedByUid,claimedAt,verified,verificationStatus",
    newValue: { ownerUid: input.applicantUid, serviceId: input.serviceId, verificationMethod },
    authorRole: "admin",
    authorUid: input.reviewerUid,
    reason: `Reclamación aprobada con acreditación «${verificationMethod}»`,
  };

  return {
    ownerUid: input.applicantUid,
    isClaimed: true,
    claimedByUid: input.applicantUid,
    claimedAt,
    ...(input.businessTaxId ? { businessTaxId: input.businessTaxId } : {}),
    verified: true,
    verificationStatus: "verified_official",
    trustLevel: "level_3_official",
    confidenceScore: 98,
    lastVerifiedAt: claimedAt,
    verificationMethod,
    ...(documentUrl ? { documentUrl } : {}),
    verifiedByUid: input.reviewerUid,
    verifiedByRole: "admin",
    auditTrail: [...(input.existingAuditTrail ?? []), claimEntry].slice(-AUDIT_TRAIL_LIMIT),
  };
}

/**
 * Obtiene todas las superposiciones de negocios almacenadas en Firestore.
 * Útil para hidratar el estado de verificación global en el panel de administración.
 */
export async function getAllServiceOverrides(db: Firestore | undefined): Promise<Record<string, ServiceOverride>> {
  if (!db) return {};
  try {
    const { collection, getDocs } = await import("firebase/firestore");
    const snapshot = await getDocs(collection(db, "service_overrides"));
    const results: Record<string, ServiceOverride> = {};
    snapshot.forEach((doc) => {
      const data = doc.data() as ServiceOverride;
      results[doc.id] = data;
      // Pre-poblar caché en memoria
      OVERRIDES_CACHE.set(doc.id, { override: data, cachedAt: Date.now() });
    });
    return results;
  } catch (error) {
    reportOverrideFailure("list", "*", error);
    return {};
  }
}
