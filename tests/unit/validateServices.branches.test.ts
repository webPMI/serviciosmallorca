/**
 * validateServices.branches.test.ts
 *
 * ✅ COBERTURA DE RAMAS DE VALIDACIÓN DE DATOS (GR-11 / GR-13)
 */

import { describe, it, expect } from "vitest";
import type { ServiceItem } from "../../src/data/services/index.ts";
import { validateServicesList, validateTaxonomyRefs } from "../../src/lib/validateServices.ts";

function makeService(overrides: Partial<ServiceItem> = {}): ServiceItem {
  return {
    id: "svc-test",
    slug: "svc-test",
    name: "Negocio Test",
    category: "arte-tatuajes",
    zone: "palma",
    phone: "+34 971 000 000",
    address: "Carrer de Prova 1, Palma",
    schedule: "Lun - Sáb: 10:00 - 20:00",
    coordinates: { lat: 39.57, lng: 2.65 },
    rating: 4.5,
    reviewCount: 10,
    status: "open",
    image: "/images/services/sample.webp",
    googleMapsUrl: "https://maps.google.com/?id=test",
    appleMapsUrl: "https://maps.apple.com/?id=test",
    bingMapsUrl: "https://www.bing.com/maps?id=test",
    ...overrides,
  } as unknown as ServiceItem;
}

describe("✅ validateTaxonomyRefs — referencias taxonómicas cerradas", () => {
  it("referencias válidas → sin errores", () => {
    expect(validateTaxonomyRefs({ category: "arte-tatuajes", zone: "palma" })).toEqual([]);
  });

  it("categoría, zona y secundarias desconocidas generan errores etiquetados", () => {
    const errors = validateTaxonomyRefs({
      name: "Mi Negocio",
      category: "categoria-inexistente",
      secondaryCategories: ["secundaria-falsa"],
      zone: "zona-falsa",
    });
    expect(errors.some((e) => e.includes('Categoría desconocida en "Mi Negocio"'))).toBe(true);
    expect(errors.some((e) => e.includes("Categoría secundaria desconocida"))).toBe(true);
    expect(errors.some((e) => e.includes("Zona desconocida"))).toBe(true);
  });

  it("tags fuera de catálogo se detectan; sin nombre usa etiqueta genérica", () => {
    const errors = validateTaxonomyRefs({
      category: "arte-tatuajes",
      zone: "palma",
      tags: ["tag-fuera-de-catalogo-xyz"],
    });
    expect(errors.some((e) => e.includes("Etiqueta fuera de catálogo") && e.includes("(registro sin nombre)"))).toBe(
      true,
    );
  });
});

describe("✅ validateServicesList — integridad de la lista de comercios", () => {
  it("valida lista limpia sin errores", () => {
    const list = [makeService({ id: "svc-1", slug: "svc-1" })];
    const result = validateServicesList(list);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("detecta IDs y slugs duplicados", () => {
    const list = [makeService({ id: "dup-id", slug: "slug-a" }), makeService({ id: "dup-id", slug: "slug-a" })];
    const result = validateServicesList(list);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes("ID duplicado") || e.includes("Slug duplicado"))).toBe(true);
  });
});
