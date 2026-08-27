import { describe, it, expect } from "vitest";
import { TAXONOMY_TREE, inferNicheTags } from "../../src/lib/taxonomyTree";
import { galeriaKewenigService } from "../../src/data/services/arte-tatuajes/galeria-kewenig";
import { kuyenArtTattoo } from "../../src/data/services/arte-tatuajes/kuyen-art-tattoo";
import { marinaDeCalaDorService } from "../../src/data/services/nautica-charter/marina-de-cala-dor";

describe("Hierarchical Taxonomy Tree (100+ Categories & Niches)", () => {
  it("contiene los 4 macro-bloques con categorías y subcategorías estructuradas", () => {
    expect(TAXONOMY_TREE.length).toBe(4);
    for (const block of TAXONOMY_TREE) {
      expect(block.id).toBeDefined();
      expect(block.name.es).toBeDefined();
      expect(block.name.en).toBeDefined();
      expect(block.name.ca).toBeDefined();
      expect(block.name.de).toBeDefined();
      expect(block.categories.length).toBeGreaterThan(0);
      for (const cat of block.categories) {
        expect(cat.subcategories.length).toBeGreaterThan(0);
      }
    }
  });

  it("infiere correctamente tags de nicho para una galería de arte", () => {
    const inferred = inferNicheTags(galeriaKewenigService);
    expect(inferred.some((t) => t.includes("arte") || t.includes("galeria"))).toBe(true);
  });

  it("infiere correctamente tags de nicho para un estudio de tatuaje", () => {
    const inferred = inferNicheTags(kuyenArtTattoo);
    expect(inferred.some((t) => t.includes("fine-line") || t.includes("tatuaje") || t.includes("piercing"))).toBe(true);
  });

  it("infiere correctamente tags de nicho para una marina náutica", () => {
    const inferred = inferNicheTags(marinaDeCalaDorService);
    expect(inferred.some((t) => t.includes("charter") || t.includes("barco") || t.includes("nautica"))).toBe(true);
  });

  it("garantiza un catálogo robusto de más de 200 etiquetas canónicas de nicho", async () => {
    const { TAG_CATALOG } = await import("../../src/data/tags");
    expect(TAG_CATALOG.length).toBeGreaterThanOrEqual(200);
  });
});
