import { describe, it, expect } from "vitest";
import { SERVICES } from "../../src/data/services/index.ts";
import { CATEGORIES, SUPER_SECTORS } from "../../src/data/categories.ts";

describe("Catalog Integrity & Categorization Sanity", () => {
  it("contiene exactamente 930 servicios con IDs y slugs únicos", () => {
    expect(SERVICES.length).toBe(930);
    const ids = new Set<string>();
    for (const s of SERVICES) {
      expect(ids.has(s.id)).toBe(false);
      ids.add(s.id);
      expect(s.slug).toBeDefined();
      expect(s.name).toBeDefined();
      expect(s.phone).toBeDefined();
      expect(s.website).toBeDefined();
    }
  });

  it("garantiza que todas las categorías de servicios pertenecen a la taxonomía oficial", () => {
    const validCategoryIds = new Set(CATEGORIES.map((c) => c.id));
    for (const s of SERVICES) {
      expect(validCategoryIds.has(s.category)).toBe(true);
    }
  });

  it("garantiza que arte-tatuajes contiene solo estudios de tatuaje y piercing auténticos", () => {
    const tattooServices = SERVICES.filter((s) => s.category === "arte-tatuajes");
    expect(tattooServices.length).toBe(11);
    const nonTattooNames = ["Es Baluard", "Miró", "Gordiola", "Caxígalos", "Cerería", "CCA Andratx", "Pelaires"];
    for (const s of tattooServices) {
      for (const forbidden of nonTattooNames) {
        expect(s.name.includes(forbidden)).toBe(false);
      }
    }
  });

  it("clasifica museos y galerías de arte en su categoría dedicada 'galerias-arte-exposiciones'", () => {
    const artGalleries = SERVICES.filter((s) => s.category === "galerias-arte-exposiciones");
    expect(artGalleries.length).toBe(10);
    const galleryIds = artGalleries.map((s) => s.id);
    expect(galleryIds).toContain("es-baluard-museu-palma");
    expect(galleryIds).toContain("fundacio-miro-mallorca");
    expect(galleryIds).toContain("cca-andratx-arte-contemporaneo");
    expect(galleryIds).toContain("galeria-pelaires-palma");
    expect(galleryIds).toContain("galeria-kewenig-palma");
  });

  it("clasifica Vidrios Gordiola en 'vidrio-ceramica-artesanal' bajo 'artesania-manufactura'", () => {
    const gordiola = SERVICES.find((s) => s.id === "vidrios-gordiola-algaida");
    expect(gordiola).toBeDefined();
    expect(gordiola?.category).toBe("vidrio-ceramica-artesanal");
    expect(gordiola?.sectorId).toBe("artesania-manufactura");
  });

  it("todas las 40 categorías están vinculadas a un Super-Sector válido", () => {
    expect(CATEGORIES.length).toBe(40);
    const validSectorIds = new Set(SUPER_SECTORS.map((s) => s.id));
    for (const cat of CATEGORIES) {
      expect(validSectorIds.has(cat.sectorId)).toBe(true);
    }
  });
});
