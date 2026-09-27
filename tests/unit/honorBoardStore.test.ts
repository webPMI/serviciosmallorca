/**
 * 🏆 SUITE DE PERSISTENCIA DEL CUADRO DE HONOR EN CLOUDLARE D1
 *
 * Cubre los invariantes que desbloquearon el sistema de subastas:
 *   - El podio se persiste y se relee desde D1 (no vive solo en memoria).
 *   - La regla +1€ se valida contra el récord REAL, no contra un catálogo vacío.
 *   - La idempotencia es durable (sobrevive a reinicios de isolate).
 *   - Sin binding D1 el sistema degrada a listas vacías, jamás a datos inventados.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  HONOR_SCHEMA_SQL,
  _resetHonorSchemaForTesting,
  emptyHonorCatalog,
  loadCategorySpots,
  loadAllHonorSpots,
  replaceCategorySpots,
  isBidAlreadyProcessed,
  recordHonorBid,
  applyConfirmedBid,
} from "../../src/lib/honorBoardStore";
import { HONOR_LISTS, type HonorSpotEntry } from "../../src/lib/honorBoardEngine";
import { createHonorD1Mock } from "../helpers/honorD1Mock";
import type { ServiceItem } from "../../src/data/services";

const eligibleService = {
  id: "taller-artesano-palma",
  slug: "taller-artesano-palma",
  name: "Taller Artesano Palma",
  category: "reformas-construccion",
  zone: "palma",
  address: "Carrer dels Oms 10, Palma",
  coordinates: { lat: 39.57, lng: 2.65 },
  rating: 4.9,
  reviewCount: 120,
  priceRange: "€€",
  verified: true,
  featured: true,
  status: "open",
  confidenceScore: 95,
  phone: "+34971000000",
  tags: ["Reformas"],
  shortDescription: { es: "Taller", en: "Workshop", ca: "Taller" },
  fullDescription: { es: "Descripción", en: "Description", ca: "Descripció" },
  image: "/images/artesano.jpg",
} as unknown as ServiceItem;

function makeSpot(overrides: Partial<HonorSpotEntry> = {}): HonorSpotEntry {
  return {
    id: "spot-test-1",
    position: 1,
    serviceId: eligibleService.id,
    serviceName: eligibleService.name,
    serviceSlug: eligibleService.slug,
    category: eligibleService.category,
    zone: eligibleService.zone,
    honorTitle: { es: "Referente", en: "Reference", ca: "Referent", de: "Referenz" },
    currentBidEuros: 5,
    sponsorName: "Comunidad Inca",
    nominatedAt: new Date().toISOString(),
    confidenceScore: 95,
    isVerified: true,
    ...overrides,
  };
}

beforeEach(() => {
  _resetHonorSchemaForTesting();
});

describe("💎 honorBoardStore · Esquema D1", () => {
  it("declara las tablas honor_spots y honor_bids con sus índices", () => {
    expect(HONOR_SCHEMA_SQL).toContain("CREATE TABLE IF NOT EXISTS honor_spots");
    expect(HONOR_SCHEMA_SQL).toContain("CREATE TABLE IF NOT EXISTS honor_bids");
    expect(HONOR_SCHEMA_SQL).toContain("idx_honor_spots_cat_pos");
    expect(HONOR_SCHEMA_SQL).toContain("idx_honor_bids_cat");
  });

  it("expone un catálogo vacío para las 6 listas gremiales", () => {
    const catalog = emptyHonorCatalog();
    expect(Object.keys(catalog)).toHaveLength(HONOR_LISTS.length);
    expect(Object.values(catalog).every((list) => list.length === 0)).toBe(true);
  });
});

describe("💎 honorBoardStore · Lectura y escritura del podio", () => {
  it("persiste y relee los puestos desde D1", async () => {
    const { d1 } = createHonorD1Mock();
    const written = await replaceCategorySpots(d1, "maestros-instalaciones", [makeSpot()]);
    expect(written).toBe(true);

    const loaded = await loadCategorySpots(d1, "maestros-instalaciones");
    expect(loaded).toHaveLength(1);
    expect(loaded[0].serviceId).toBe(eligibleService.id);
    expect(loaded[0].currentBidEuros).toBe(5);
    expect(loaded[0].position).toBe(1);
  });

  it("reordena el podio al leer según la puja (ranking determinista)", async () => {
    const { d1 } = createHonorD1Mock();
    await replaceCategorySpots(d1, "elite-general", [
      makeSpot({ id: "spot-b", serviceId: "negocio-b", serviceSlug: "negocio-b", currentBidEuros: 2 }),
      makeSpot({ id: "spot-a", serviceId: "negocio-a", serviceSlug: "negocio-a", currentBidEuros: 9 }),
    ]);

    const loaded = await loadCategorySpots(d1, "elite-general");
    expect(loaded.map((s) => s.serviceId)).toEqual(["negocio-a", "negocio-b"]);
    expect(loaded[0].position).toBe(1);
    expect(loaded[1].position).toBe(2);
  });

  it("reemplaza el podio completo de la categoría sin dejar filas huérfanas", async () => {
    const { d1, spots } = createHonorD1Mock();
    await replaceCategorySpots(d1, "elite-general", [makeSpot({ id: "spot-1" })]);
    await replaceCategorySpots(d1, "elite-general", [makeSpot({ id: "spot-2", currentBidEuros: 3 })]);

    expect(spots.filter((s) => s.category === "elite-general")).toHaveLength(1);
    expect(spots[0].id).toBe("spot-2");
  });

  it("carga las 6 listas del Cuadro de Mallorca", async () => {
    const { d1 } = createHonorD1Mock();
    await replaceCategorySpots(d1, "artesanos-sabor", [makeSpot()]);

    const all = await loadAllHonorSpots(d1);
    expect(Object.keys(all)).toHaveLength(HONOR_LISTS.length);
    expect(all["artesanos-sabor"]).toHaveLength(1);
    expect(all["elite-general"]).toHaveLength(0);
  });

  it("degrada a listas vacías sin binding D1 (nunca inventa datos · GR-11)", async () => {
    const loaded = await loadCategorySpots(undefined, "elite-general");
    expect(loaded).toEqual([]);
  });

  it("degrada a listas vacías si la consulta a D1 falla, sin romper el render", async () => {
    const brokenD1: any = {
      exec: async () => ({ success: true }),
      prepare: () => ({
        bind: () => ({
          all: async () => {
            throw new Error("D1 no disponible");
          },
          run: async () => ({ success: true }),
          first: async () => null,
        }),
      }),
    };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const loaded = await loadCategorySpots(brokenD1, "elite-general");
    expect(loaded).toEqual([]);
    spy.mockRestore();
  });
});


describe("💎 honorBoardStore · Idempotencia durable", () => {
  it("detecta una puja ya confirmada en D1", async () => {
    const { d1 } = createHonorD1Mock();
    await recordHonorBid(d1, {
      idempotencyKey: "idemp_abc",
      category: "elite-general",
      serviceId: eligibleService.id,
      mode: "owner_bid",
      amountEuros: 7,
      status: "confirmed",
    });

    expect(await isBidAlreadyProcessed(d1, "idemp_abc")).toBe(true);
    expect(await isBidAlreadyProcessed(d1, "idemp_otro")).toBe(false);
  });

  it("NO considera procesada una puja registrada solo como sandbox", async () => {
    const { d1 } = createHonorD1Mock();
    await recordHonorBid(d1, {
      idempotencyKey: "idemp_sandbox",
      category: "elite-general",
      serviceId: eligibleService.id,
      mode: "owner_bid",
      amountEuros: 1,
      status: "sandbox_recorded",
    });

    expect(await isBidAlreadyProcessed(d1, "idemp_sandbox")).toBe(false);
  });
});


describe("💎 honorBoardStore · applyConfirmedBid", () => {
  it("persiste la puja confirmada y la convierte en líder #1", async () => {
    const { d1 } = createHonorD1Mock();

    const outcome = await applyConfirmedBid(d1, {
      category: "maestros-instalaciones",
      service: eligibleService,
      mode: "owner_bid",
      amountEuros: 1,
      sponsorName: "Vecino de Mallorca",
      idempotencyKey: "idemp_1",
      invoiceId: "INV-HONOR-1",
    });

    expect(outcome.applied).toBe(true);
    const loaded = await loadCategorySpots(d1, "maestros-instalaciones");
    expect(loaded).toHaveLength(1);
    expect(loaded[0].currentBidEuros).toBe(1);
    expect(loaded[0].position).toBe(1);
  });

  it("rechaza una puja inferior al récord y NO altera el podio (P0-3)", async () => {
    const { d1 } = createHonorD1Mock();
    await replaceCategorySpots(d1, "maestros-instalaciones", [makeSpot({ currentBidEuros: 50 })]);

    const outcome = await applyConfirmedBid(d1, {
      category: "maestros-instalaciones",
      service: eligibleService,
      mode: "owner_bid",
      amountEuros: 1,
      sponsorName: "Intruso",
      idempotencyKey: "idemp_low",
    });

    expect(outcome.applied).toBe(false);
    const loaded = await loadCategorySpots(d1, "maestros-instalaciones");
    expect(loaded[0].currentBidEuros).toBe(50);
  });

  it("desplaza al líder anterior cuando entra una puja mayor", async () => {
    const { d1 } = createHonorD1Mock();
    await replaceCategorySpots(d1, "maestros-instalaciones", [
      makeSpot({ id: "spot-lider", currentBidEuros: 50 }),
    ]);

    const outcome = await applyConfirmedBid(d1, {
      category: "maestros-instalaciones",
      service: eligibleService,
      mode: "owner_bid",
      amountEuros: 51,
      sponsorName: "Nuevo Lider",
      idempotencyKey: "idemp_51",
    });

    expect(outcome.applied).toBe(true);
    const loaded = await loadCategorySpots(d1, "maestros-instalaciones");
    expect(loaded[0].currentBidEuros).toBe(51);
    expect(loaded[0].position).toBe(1);
  });

  it("es idempotente: repetir la misma clave no duplica la entrada", async () => {
    const { d1 } = createHonorD1Mock();
    const params = {
      category: "elite-general" as const,
      service: eligibleService,
      mode: "owner_bid" as const,
      amountEuros: 1,
      sponsorName: "Vecino",
      idempotencyKey: "idemp_dup",
    };

    const first = await applyConfirmedBid(d1, params);
    const second = await applyConfirmedBid(d1, params);

    expect(first.applied).toBe(true);
    expect(second.applied).toBe(false);
    if (!second.applied) expect(second.alreadyProcessed).toBe(true);

    const loaded = await loadCategorySpots(d1, "elite-general");
    expect(loaded).toHaveLength(1);
  });
});


describe("💎 honorBoardStore · Impulso comunitario y trazabilidad", () => {
  it("acumula aportaciones de vecinos sobre la misma entrada", async () => {
    const { d1 } = createHonorD1Mock();

    await applyConfirmedBid(d1, {
      category: "elite-general",
      service: eligibleService,
      mode: "community_boost",
      amountEuros: 2,
      sponsorName: "Vecina Ana",
      idempotencyKey: "idemp_c1",
    });
    await applyConfirmedBid(d1, {
      category: "elite-general",
      service: eligibleService,
      mode: "community_boost",
      amountEuros: 3,
      sponsorName: "Vecino B",
      idempotencyKey: "idemp_c2",
    });

    const loaded = await loadCategorySpots(d1, "elite-general");
    expect(loaded).toHaveLength(1);
    expect(loaded[0].currentBidEuros).toBe(5);
    expect(loaded[0].communityBackersCount).toBe(2);
  });

  it("deja la puja rechazada auditada en el libro mayor (INV-08)", async () => {
    const { d1, bids } = createHonorD1Mock();

    await applyConfirmedBid(d1, {
      category: "maestros-instalaciones",
      service: { ...eligibleService, confidenceScore: 40 } as unknown as ServiceItem,
      mode: "owner_bid",
      amountEuros: 5,
      sponsorName: "Negocio Bajo Confianza",
      idempotencyKey: "idemp_rejected",
    });

    const row = bids.find((b) => b.idempotency_key === "idemp_rejected");
    expect(row).toBeDefined();
    expect(row?.status).toBe("rejected");
  });

  it("no persiste el podio cuando el motor rechaza la aportación", async () => {
    const { d1, spots } = createHonorD1Mock();
    const outcome = await applyConfirmedBid(d1, {
      category: "maestros-instalaciones",
      service: { ...eligibleService, category: "spas-bienestar" } as unknown as ServiceItem,
      mode: "owner_bid",
      amountEuros: 5,
      sponsorName: "Ajeno al gremio",
      idempotencyKey: "idemp_wrong_guild",
    });

    expect(outcome.applied).toBe(false);
    expect(spots).toHaveLength(0);
  });
});

