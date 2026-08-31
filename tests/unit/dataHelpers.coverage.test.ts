import { describe, it, expect } from "vitest";
import { getZoneById, MALLORCA_ZONES } from "../../src/data/zones.ts";
import { parseTag, isTagPattern, isValidTag, tagI18nKey, getTagById, getTagsByDomain } from "../../src/data/tags.ts";
import {
  getActiveSuperSectors,
  getSuperSectorById,
  getCategoryBySlug,
  getCategoriesBySector,
  searchCategoriesBySynonym,
} from "../../src/data/categories.ts";

describe("Data Helpers Coverage Suite", () => {
  describe("src/data/zones.ts", () => {
    it("resolves zone by valid id", () => {
      const palma = getZoneById("palma");
      expect(palma).toBeDefined();
      expect(palma?.name.es).toBe("Palma & Bahía");
      expect(palma?.popularAreas).toContain("Santa Catalina");
    });

    it("returns undefined for unknown zone id", () => {
      const unknown = getZoneById("zona-desconocida-999");
      expect(unknown).toBeUndefined();
    });

    it("ensures all zones have valid popular areas", () => {
      for (const z of MALLORCA_ZONES) {
        expect(z.id).toBeTruthy();
        expect(z.popularAreas.length).toBeGreaterThan(0);
      }
    });
  });

  describe("src/data/tags.ts", () => {
    it("parses valid domain:value tag strings", () => {
      const parsed = parseTag("product:lujo");
      expect(parsed).toEqual({ domain: "product", value: "lujo" });
    });

    it("returns null for malformed or unknown domain tags", () => {
      expect(parseTag("no-colon-tag")).toBeNull();
      expect(parseTag(":solo-valor")).toBeNull();
      expect(parseTag("dominio-invalido:")).toBeNull();
      expect(parseTag("fakeDomain:valor")).toBeNull();
    });

    it("validates tag pattern correctly", () => {
      expect(isTagPattern("product:lujo")).toBe(true);
      expect(isTagPattern("mod:urgencias-24h")).toBe(true);
      expect(isTagPattern("Product:Lujo")).toBe(false);
      expect(isTagPattern("invalid tag with spaces")).toBe(false);
    });

    it("validates full tag validity with catalog existence", () => {
      expect(isValidTag("product:lujo")).toBe(true);
      expect(isValidTag("product:no-existe-en-catalogo-xyz")).toBe(false);
      expect(isValidTag("invalido")).toBe(false);
    });

    it("generates i18n key correctly", () => {
      expect(tagI18nKey("product:lujo")).toBe("tags.product.lujo");
      expect(tagI18nKey("invalido")).toBeNull();
    });

    it("retrieves tag by id", () => {
      const tag = getTagById("product:lujo");
      expect(tag).toBeDefined();
      expect(tag?.domain).toBe("product");

      expect(getTagById("unknown:nonexistent")).toBeUndefined();
    });

    it("retrieves tags by domain", () => {
      const productTags = getTagsByDomain("product");
      expect(productTags.length).toBeGreaterThan(0);
      expect(productTags.every((t) => t.domain === "product")).toBe(true);

      const modTags = getTagsByDomain("mod");
      expect(modTags.length).toBeGreaterThan(0);
      expect(modTags.every((t) => t.domain === "mod")).toBe(true);
    });
  });

  describe("src/data/categories.ts", () => {
    it("resolves super sector by id", () => {
      const art = getSuperSectorById("arte-estilo-cultura");
      expect(art).toBeDefined();
      expect(art?.id).toBe("arte-estilo-cultura");

      expect(getSuperSectorById("unknown-sector")).toBeUndefined();
    });

    it("resolves category by slug", () => {
      const cat = getCategoryBySlug("arte-tatuajes");
      expect(cat).toBeDefined();
      expect(cat?.id).toBe("arte-tatuajes");

      expect(getCategoryBySlug("slug-inexistente")).toBeUndefined();
    });

    it("returns categories belonging to a sector", () => {
      const cats = getCategoriesBySector("arte-estilo-cultura");
      expect(cats.length).toBeGreaterThan(0);
      expect(cats.every((c) => c.sectorId === "arte-estilo-cultura")).toBe(true);

      expect(getCategoriesBySector("sector-fantasma")).toEqual([]);
    });

    it("calculates active super sectors based on active services list", () => {
      const sampleServices = [
        { category: "arte-tatuajes", status: "open" },
        { category: "nautica-charter", status: "open" },
      ];
      const activeSuperSectors = getActiveSuperSectors(sampleServices);
      expect(activeSuperSectors.length).toBeGreaterThan(0);
      const sectorIds = activeSuperSectors.map((s) => s.id);
      expect(sectorIds).toContain("arte-estilo-cultura");
      expect(sectorIds).toContain("nautica-maritimo");
    });

    it("searches categories by synonym with normalized text handling", () => {
      // Búsqueda con acentos / mayúsculas
      const results1 = searchCategoriesBySynonym("TATUAJES");
      expect(results1.length).toBeGreaterThan(0);
      expect(results1.some((c) => c.id === "arte-tatuajes")).toBe(true);

      // Búsqueda con término en inglés
      const results2 = searchCategoriesBySynonym("charter");
      expect(results2.length).toBeGreaterThan(0);
      expect(results2.some((c) => c.id === "nautica-charter")).toBe(true);

      // Búsqueda vacía
      expect(searchCategoriesBySynonym("")).toEqual([]);
      expect(searchCategoriesBySynonym("   ")).toEqual([]);

      // Búsqueda de algo que no existe
      const emptyResults = searchCategoriesBySynonym("términoTotalmenteInexistente123456789");
      expect(emptyResults).toEqual([]);
    });
  });
});
