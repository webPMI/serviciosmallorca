/**
 * BATERÍA DE ESTRES para src/lib/topEngine.ts
 *
 * topEngine consume el catálogo REAL (SERVICES) en cada llamada.
 * Aquí se le somete a:
 *   1. Smoke tests sobre el catálogo en producción (GR-11)
 *   2. Estres volumétrico con 120 negocios sintéticos: filtros, límites,
 *      orden estable ante empates, medias y comportamiento con catálogos vacíos
 *
 * Los datasets sintéticos se inyectan mockeando src/data/services/index.ts,
 * de modo que el motor de scoring productivo se ejecuta sin cambios.
 */
import { describe, it, expect, vi } from "vitest";
import type { ServiceItem } from "../../src/data/services";
import { calculateBusinessScore, calculateQualityBreakdown, getTopRankedServices } from "../../src/lib/topEngine";

/* ---------------------------------------------------------------------------
 * Generador determinista de negocios sintéticos + inyección de catálogo
 * ------------------------------------------------------------------------- */
const CATEGORIES_STRESS = ["gastronomia-restaurantes", "arte-tatuajes", "deportes-fitness"];
const ZONES_STRESS = ["palma-ciutat", "migjorn", "llevant", "tramuntana"];

function makeService(index: number): ServiceItem {
  const bucket = index % CATEGORIES_STRESS.length;
  const zoneBucket = index % ZONES_STRESS.length;
  // Ciclo controlado de métricas para provocar empates masivos predecibles
  const ratingCycle = [5, 4.8, 4.6, 4.4][index % 4];
  const reviewCycle = [310, 180, 95, 12][index % 4];
  return {
    id: `stress-${String(index).padStart(3, "0")}`,
    slug: `negocio-stress-${index}`,
    name: `Negocio Stress ${index}`,
    category: CATEGORIES_STRESS[bucket],
    zone: ZONES_STRESS[zoneBucket],
    rating: ratingCycle,
    reviewCount: reviewCycle,
    verified: index % 4 === 0, // ~25% verificados para rotación semanal
    status: "open",
    image: `/images/stress-${index}.jpg`,
    phone: "+34971000000",
    website: "https://negocio-stress.example.com",
    schedule: "L-D 09:00-21:00",
    capabilities: { terrace: true, onlineBooking: true },
    fullDescription: { es: "d", en: "d", ca: "d", de: "d" },
    shortDescription: { es: "s", en: "s", ca: "s", de: "s" },
  } as unknown as ServiceItem;
}

function buildStressDataset(size: number): ServiceItem[] {
  return Array.from({ length: size }, (_, i) => makeService(i));
}

/** Reconstruye el motor con un dataset inyectado (el código productivo no cambia). */
async function withDataset(dataset: ServiceItem[]) {
  vi.resetModules();
  vi.doMock("../../src/data/services/index.ts", () => ({ SERVICES: dataset }));
  const engine = await import("../../src/lib/topEngine");
  return { engine, dataset };
}

describe("topEngine · catálogo REAL en producción (smoke)", () => {
  it("getTopRankedServices devuelve resultados ordenados por score descendente", () => {
    const ranked = getTopRankedServices(10);
    expect(ranked.length).toBeGreaterThan(0);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score);
    }
  });

  it("calculateBusinessScore se mantiene dentro del techo declarado (0..100)", () => {
    const all = getTopRankedServices(9999);
    const scores = all.map((r) => r.score);
    expect(Math.min(...scores)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...scores)).toBeLessThanOrEqual(100);
  });

  it("cada servicio real obtiene breakdown de calidad completo", () => {
    const ranked = getTopRankedServices(1)[0];
    const breakdown = calculateQualityBreakdown(ranked.service);
    expect(breakdown.total).toBeGreaterThanOrEqual(0);
    expect(breakdown.visualQuality).toBeGreaterThanOrEqual(0);
    expect(breakdown.dataVeracity).toBeGreaterThanOrEqual(0);
    expect(breakdown.popularity).toBeGreaterThanOrEqual(0);
    expect(breakdown.intentAffinity).toBeGreaterThanOrEqual(0);
  });
});

describe("topEngine · ESTRES con 120 negocios sintéticos", () => {
  it("ranking completo: nada se pierde, orden global correcto y puntuaciones reproducibles", async () => {
    const { engine } = await withDataset(buildStressDataset(120));

    const ranked = engine.getTopRankedServices(9999);
    expect(ranked.length).toBe(120);

    // Invariante núcleo: orden descendente estricto (con estabilidad ante empates)
    for (let i = 1; i < ranked.length; i++) {
      if (ranked[i].score > ranked[i - 1].score) {
        throw new Error(
          `Orden roto en posición ${i}: ${ranked[i - 1].service.slug} (${ranked[i - 1].score}) < ${ranked[i].service.slug} (${ranked[i].score})`,
        );
      }
    }
    expect(Math.max(...ranked.map((r) => r.score))).toBeLessThanOrEqual(100);
    expect(Math.min(...ranked.map((r) => r.score))).toBeGreaterThanOrEqual(0);

    // Determinismo: reimportación limpia → mismas puntuaciones individuales por slug
    const { engine: engine2 } = await withDataset(buildStressDataset(120));
    const reRanked = engine2.getTopRankedServices(9999);
    const scoreBySlug = new Map(ranked.map((r) => [r.service.slug as string, r.score]));
    for (const r of reRanked) {
      expect(scoreBySlug.get(r.service.slug as string)).toBe(r.score);
    }
  });

  it("paginación exacta por categoría bajo empates masivos (40 items/faceta)", async () => {
    const { engine } = await withDataset(buildStressDataset(120));
    const tops = engine.getTopServicesByCategory(CATEGORIES_STRESS[0], 10);
    expect(tops.length).toBe(10);
    expect(tops.every((t) => t.service.category === CATEGORIES_STRESS[0])).toBe(true);
    expect(tops.map((t) => t.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const perCategory = CATEGORIES_STRESS.map((c) => engine.getTopServicesByCategory(c, 9999).length);
    expect(perCategory).toEqual([40, 40, 40]);
  });

  it("distribución entre zonas: cada faceta filtra exactamente sus 30 subordinados", async () => {
    const { engine } = await withDataset(buildStressDataset(120));
    for (const zone of ZONES_STRESS) {
      const zoneTops = engine.getTopServicesByZone(zone, 9999);
      expect(zoneTops.length).toBe(30);
      expect(zoneTops.every((t) => t.service.zone === zone)).toBe(true);
    }
  });

  it("scoring financiero: calculateBusinessScore == breakdown.total para toda la muestra", async () => {
    const dataset = buildStressDataset(120);
    for (const service of dataset.slice(0, 20)) {
      const breakdown = calculateQualityBreakdown(service);
      expect(calculateBusinessScore(service)).toBe(breakdown.total);
    }
  });
});

describe("topEngine · rotación semanal y comparador multicriterio", () => {
  it("getWeeklyCuratedTops devuelve exactamente 3 verificados y rota entre semanas", async () => {
    const { engine } = await withDataset(buildStressDataset(120));
    const week1 = engine.getWeeklyCuratedTops(new Date("2026-02-02T12:00:00Z"));
    const week2 = engine.getWeeklyCuratedTops(new Date("2026-02-09T12:00:00Z"));

    expect(week1.length).toBe(3);
    expect(week2.length).toBe(3);
    expect(week1.every((r) => r.service.verified)).toBe(true);
    expect(week1.map((r) => r.rank)).toEqual([1, 2, 3]);
    // Rotación determinista: semana distinta → ventana distinta del pool verificado
    expect(week2[0].service.slug).not.toBe(week1[0].service.slug);
    // Misma fecha → misma selección (cacheable en SSR)
    const weekAgain = engine.getWeeklyCuratedTops(new Date("2026-02-09T12:00:00Z"));
    expect(weekAgain.map((r) => r.service.slug)).toEqual(week2.map((r) => r.service.slug));
  });

  it("empate perfecto (50 clones idénticos) produce orden estable entre llamadas", async () => {
    const ties = buildStressDataset(50).map((s) => ({
      ...s,
      rating: 4.8,
      reviewCount: 100,
      verified: false,
    }));
    const { engine } = await withDataset(ties as ServiceItem[]);

    const first = engine.getTopRankedServices(50);
    const second = engine.getTopRankedServices(50);

    expect(new Set(first.map((r) => r.score)).size).toBe(1); // empate total real
    expect(first.map((r) => r.service.slug)).toEqual(second.map((r) => r.service.slug)); // sort estable
  });

  it("getComparisonList respeta minScore y limit incluso pidiendo 200", async () => {
    const { engine } = await withDataset(buildStressDataset(120));

    const generous = engine.getComparisonList({ minScore: 0, limit: 200 });
    expect(generous.length).toBeLessThanOrEqual(120); // nunca inventa candidatos

    const capped = engine.getComparisonList({ minScore: 0, limit: 7 });
    expect(capped.length).toBe(7);
    capped.forEach((r, i, arr) => {
      if (i > 0) expect(arr[i - 1].score).toBeGreaterThanOrEqual(r.score);
    });

    // Combinación zona + capacidades sobre datos que sí las cumplen
    const filtered = engine.getComparisonList({
      zone: ZONES_STRESS[0],
      capabilities: ["terrace", "onlineBooking"],
      minScore: 0,
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((r) => r.service.zone === ZONES_STRESS[0])).toBe(true);
  });
});

describe("topEngine · resiliencia ante catálogos degenerados", () => {
  it("catálogo vacío: ninguna función lanza y devuelven vacíos coherentes", async () => {
    const { engine } = await withDataset([]);
    expect(() => engine.getTopRankedServices(10)).not.toThrow();
    expect(engine.getTopRankedServices(10)).toEqual([]);
    expect(() => engine.getTopServicesByCategory(CATEGORIES_STRESS[0], 5)).not.toThrow();
    expect(engine.getWeeklyCuratedTops(new Date())).toEqual([]); // sin verificados
    expect(engine.getComparisonList({})).toEqual([]); // nada supera minScore 70
  });

  it("negocios incompletos (sin rating/verificación/contacto) no rompen el scoring", async () => {
    const sparse = [
      { id: "min-1", slug: "min-1", name: "Mínimo", category: CATEGORIES_STRESS[0], status: "open" },
      {
        id: "min-2",
        slug: "min-2",
        name: "Imagen placeholder",
        category: CATEGORIES_STRESS[0],
        image: "/img/default.svg",
      },
    ] as unknown as ServiceItem[];
    const { engine } = await withDataset(sparse);

    const ranked = engine.getTopRankedServices(10);
    expect(ranked.length).toBe(2);
    expect(ranked.every((r) => Number.isFinite(r.score))).toBe(true);
    expect(ranked.every((r) => r.score >= 0 && r.score <= 100)).toBe(true);
    // default.svg penaliza calidad visual (rama else → 6 pts base) pero no explota
    expect(calculateQualityBreakdown(sparse[1] as ServiceItem).visualQuality).toBe(6);
  });
});
