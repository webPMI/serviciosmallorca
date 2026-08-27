/**
 * Tests para src/lib/validateTaxonomy.ts
 *
 * Validador de integridad estructural de la taxonomía v2:
 *   - Ejecuta el validador contra los catálogos REALES del proyecto
 *     (GR-11 Zero Fake Data: si esto falla, la web está rota de verdad)
 *   - Valida las ramas de detección ante catálogos rotos vía inyección
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateTaxonomyIntegrity, type TaxonomyIntegrityResult } from "../../src/lib/validateTaxonomy";
import type { SuperSector, ServiceCategory } from "../../src/data/categories";

function makeSector(overrides: Partial<SuperSector> = {}): SuperSector {
  return {
    id: "sector-test",
    code: "SS-99",
    icon: "🧪",
    name: { es: "S", en: "S", ca: "S", de: "S" },
    description: { es: "", en: "", ca: "", de: "" },
    ...overrides,
  };
}

function makeCategory(overrides: Partial<ServiceCategory> = {}): ServiceCategory {
  return {
    id: "cat-test",
    slug: "cat-test",
    sectorId: "sector-test",
    icon: "🧪",
    name: { es: "C", en: "C", ca: "C", de: "C" },
    description: { es: "", en: "", ca: "", de: "" },
    synonyms: ["sinonimo"],
    color: "#000000",
    ...overrides,
  };
}

describe("validateTaxonomyIntegrity · integridad REAL del proyecto (GR-11)", () => {
  it("ejecuta sin lanzar y expone el contrato completo del resultado", () => {
    let result!: TaxonomyIntegrityResult;
    expect(() => {
      result = validateTaxonomyIntegrity();
    }).not.toThrow();
    expect(result).toHaveProperty("valid");
    expect(result).toHaveProperty("errors");
    expect(result).toHaveProperty("warnings");
    expect(Array.isArray(result.errors)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it("NO registra errores críticos con los catálogos en producción", () => {
    const current = validateTaxonomyIntegrity();
    expect(current.errors).toEqual([]);
    expect(current.valid).toBe(true);
  });

  it("los catálogos vivos de zonas y etiquetas no se han vaciado", () => {
    // El validador exige MALLORCA_ZONES.length > 0 y TAG_CATALOG.length > 0.
    const current = validateTaxonomyIntegrity();
    expect(current.errors.some((e) => e.includes("MALLORCA_ZONES"))).toBe(false);
    expect(current.errors.some((e) => e.includes("TAG_CATALOG"))).toBe(false);
  });
});

describe("validateTaxonomyIntegrity · ramas de detección con catálogos sintéticos (DI)", () => {
  /**
   * Re-importa el módulo con catálogos inyectados para poder provocar
   * estados de corrupción imposible en producción.
   */
  async function runWith(catalogs: {
    sectors?: SuperSector[];
    categories?: ServiceCategory[];
    zones?: unknown[];
    tags?: unknown[];
  }): Promise<TaxonomyIntegrityResult> {
    vi.resetModules();
    vi.doMock("../../src/data/categories.ts", () => ({
      SUPER_SECTORS: catalogs.sectors ?? [],
      CATEGORIES: catalogs.categories ?? [],
    }));
    vi.doMock("../../src/data/zones.ts", () => ({
      MALLORCA_ZONES: catalogs.zones ?? [{ id: "zona-1" }, { id: "zona-2" }],
    }));
    vi.doMock("../../src/data/tags.ts", () => ({
      TAG_CATALOG: catalogs.tags ?? [{ id: "tag-1" }, { id: "tag-2" }],
    }));
    const mod = await import("../../src/lib/validateTaxonomy");
    return mod.validateTaxonomyIntegrity();
  }

  beforeEach(() => {
    vi.doUnmock("../../src/data/categories.ts");
    vi.doUnmock("../../src/data/zones.ts");
    vi.doUnmock("../../src/data/tags.ts");
  });

  it("detecta super-sector sin ID", async () => {
    const result = await runWith({ sectors: [makeSector({ id: "" })] });
    expect(result.errors.some((e) => e.includes("SuperSector sin ID"))).toBe(true);
    expect(result.valid).toBe(false);
  });

  it("detecta IDs duplicados de super-sectores y categorías", async () => {
    const sector = makeSector({ id: "duplicado" });
    const category = makeCategory({ id: "cat-dup", sectorId: "duplicado" });
    const result = await runWith({
      sectors: [sector, { ...sector }],
      categories: [category, { ...category }],
    });
    expect(result.errors.filter((e) => e.includes("SuperSector ID duplicado")).length).toBe(1);
    expect(result.errors.filter((e) => e.includes("Categoría ID duplicada")).length).toBe(1);
  });

  it("exige traducciones trilingües completas (es/en/ca) en super-sectores", async () => {
    const broken = makeSector({ name: { es: "ok", en: "", ca: "ok", de: "ok" } });
    const result = await runWith({ sectors: [broken] });
    expect(result.errors.some((e) => e.includes("trilingües completas"))).toBe(true);
  });

  it("detecta categorías huérfanas que referencian sectores inexistentes", async () => {
    const orphan = makeCategory({ sectorId: "sector-fantasma" });
    const result = await runWith({ sectors: [makeSector()], categories: [orphan] });
    expect(result.errors.some((e) => e.includes("referencia un sector inexistente"))).toBe(true);
  });

  it("emite warning (no error) cuando una categoría carece de sinónimos de búsqueda", async () => {
    const noSyn = makeCategory({ synonyms: [] });
    const result = await runWith({ sectors: [makeSector()], categories: [noSyn] });
    expect(result.warnings.some((w) => w.includes("no tiene sinónimos"))).toBe(true);
    expect(result.valid).toBe(true); // los warnings no bloquean el despliegue
  });

  it("falla si MALLORCA_ZONES o TAG_CATALOG quedan vacíos", async () => {
    const emptyZones = await runWith({ zones: [] });
    expect(emptyZones.errors.some((e) => e.includes("MALLORCA_ZONES está vacío"))).toBe(true);

    const emptyTags = await runWith({ tags: [] });
    expect(emptyTags.errors.some((e) => e.includes("TAG_CATALOG está vacío"))).toBe(true);
  });

  it("un taxonomy perfecta produce valid=true sin errores", async () => {
    const result = await runWith({
      sectors: [makeSector(), makeSector({ id: "sector-b" })],
      categories: [makeCategory(), makeCategory({ id: "cat-b", slug: "cat-b", sectorId: "sector-b" })],
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
