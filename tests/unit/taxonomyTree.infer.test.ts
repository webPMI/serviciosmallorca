/**
 * taxonomyTree.infer.test.ts
 *
 * 🌳 COBERTURA DE RAMAS DE inferNicheTags (taxonomía de nicho 3 niveles)
 *
 * La función tenía ~50% de branches: los fallback de campos opcionales del ServiceItem
 * (tags, fullDescription, highlights, servicesProvided) y el matching case-insensitive
 * contra keywords del árbol. Se verifica:
 *  1. Inferencia desde name/shortDescription (es+en) del árbol TAXONOMY_TREE.
 *  2. Fallback || "" con fullDescription/highlights/servicesProvided ausentes (sin crash).
 *  3. Preservación de tags existentes + adición sin duplicados.
 *  4. Contribución de highlights y servicesProvided al texto searchable.
 *  5. Sin matches → devuelve solo los tags de entrada.
 */

import { describe, it, expect } from "vitest";
import { inferNicheTags } from "../../src/lib/taxonomyTree.ts";
import type { ServiceItem } from "../../src/data/services/types.ts";

function makeService(overrides: Record<string, unknown> = {}): ServiceItem {
  return {
    id: "svc-nicho",
    slug: "svc-nicho",
    name: "Estudio Sin Nicho",
    category: "arte-tatuajes",
    tags: [],
    shortDescription: { es: "Estudio de tatuajes en Palma.", en: "Tattoo studio in Palma." },
    ...overrides,
  } as unknown as ServiceItem;
}

describe("🌳 inferNicheTags — inferencia de nichos", () => {
  it("infiere fine-line y realismo desde shortDescription es/en", () => {
    const tags = inferNicheTags(
      makeService({
        shortDescription: {
          es: "Especialistas en tatuaje linea fina y realismo black and grey.",
          en: "Fine line realism tattoo studio.",
        },
      }),
    );
    expect(tags).toContain("product:fine-line");
    expect(tags).toContain("product:realismo");
  });

  it("no crash con fullDescription, highlights y servicesProvided ausentes (fallback '')", () => {
    const tags = inferNicheTags(makeService());
    expect(Array.isArray(tags)).toBe(true);
    expect(tags).toEqual([]);
  });

  it("preserva tags existentes y añade los inferidos sin duplicar", () => {
    const tags = inferNicheTags(
      makeService({
        tags: ["product:fine-line", "tag-manual"],
        shortDescription: { es: "Tatuajes fine line y buceo guiado.", en: "" },
      }),
    );
    const fineLineCount = tags.filter((t) => t === "product:fine-line").length;
    expect(fineLineCount).toBe(1); // sin duplicados
    expect(tags).toContain("tag-manual");
    expect(tags).toContain("product:buceo");
  });

  it("los highlights y servicesProvided alimentan el texto searchable", () => {
    const tags = inferNicheTags(
      makeService({
        shortDescription: { es: "", en: "" },
        highlights: { es: ["Clases de padel para principiantes"], en: [] },
        servicesProvided: { es: ["Rutas de senderismo por la Tramuntana"], en: [] },
      }),
    );
    expect(tags).toContain("product:padel-tenis");
    expect(tags).toContain("product:senderismo-rutas");
  });

  it("keywords son case-insensitive contra el texto en minúsculas", () => {
    const tags = inferNicheTags(
      makeService({
        name: "YOGA & PILATES RETREAT",
        shortDescription: { es: "", en: "" },
      }),
    );
    expect(tags).toContain("product:yoga-bienestar");
  });
});
