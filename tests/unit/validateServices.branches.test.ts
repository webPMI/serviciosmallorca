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

describe("✅ validateServicesList — ramas avanzadas (GR-11 / GR-12 / GR-13)", () => {
  it("website duplicado: mismo dominio normalizando www y perfiles compartidos", () => {
    const a = makeService({ id: "a", slug: "a", website: "https://negocio-unico.com/a" });
    const b = makeService({ id: "b", slug: "b", website: "https://www.negocio-unico.com/b" });
    expect(validateServicesList([a, b]).errors.some((e) => e.includes("Sitio web o perfil oficial duplicado"))).toBe(
      true,
    );

    const ig1 = makeService({
      id: "ig1",
      slug: "ig1",
      name: "Perfil IG Uno",
      website: "https://instagram.com/miperfil",
    });
    const ig2 = makeService({
      id: "ig2",
      slug: "ig2",
      name: "Perfil IG Dos",
      website: "https://www.instagram.com/miperfil/",
    });
    expect(
      validateServicesList([ig1, ig2]).errors.some((e) => e.includes("Sitio web o perfil oficial duplicado")),
    ).toBe(true);

    const ig3 = makeService({
      id: "ig3",
      slug: "ig3",
      name: "Otro Negocio Distinto",
      image: "/images/services/sample-3.webp",
      website: "https://instagram.com/otro-perfil",
    });
    expect(validateServicesList([ig1, ig3]).valid).toBe(true); // perfiles distintos: sin colisión
  });

  it("URL inválida entra por el catch; esquemas no-HTTP se ignoran", () => {
    const bad = makeService({ id: "bad", slug: "bad", website: "http://url con espacios.com" });
    expect(validateServicesList([bad]).errors.some((e) => e.includes("URL de sitio web inválida"))).toBe(true);

    const ftp = makeService({ id: "ftp", slug: "ftp", website: "ftp://archivos.negocio.com" });
    expect(validateServicesList([ftp]).errors.some((e) => e.includes("URL de sitio web"))).toBe(false);
  });

  it("campos obligatorios ausentes y rating acotado (salvo incomplete_admin_only)", () => {
    const incomplete = makeService({ id: "inc", slug: "inc", phone: "", address: "", schedule: "", rating: 0 });
    const joined = validateServicesList([incomplete]).errors.join(" | ");
    expect(joined).toContain("Teléfono requerido ausente");
    expect(joined).toContain("Dirección requerida ausente");
    expect(joined).toContain("Horario operativo requerido ausente");
    expect(joined).toContain("Rating inválido");

    const draft = makeService({ id: "draft", slug: "draft", status: "incomplete_admin_only", rating: 0 });
    expect(validateServicesList([draft]).errors.some((e) => e.includes("Rating inválido"))).toBe(false);
  });

  it("coordenadas ausentes o fuera del bounding box de Mallorca se rechazan", () => {
    const missing = makeService({
      id: "nogeo",
      slug: "nogeo",
      coordinates: undefined as unknown as ServiceItem["coordinates"],
    });
    expect(validateServicesList([missing]).errors.join(" | ")).toContain("Coordenadas geográficas requeridas");

    const fuera = makeService({ id: "fuera", slug: "fuera", coordinates: { lat: 10.5, lng: -0.4 } });
    expect(validateServicesList([fuera]).errors.join(" | ")).toContain("fuera del rango geográfico de Mallorca");
  });

  it("GR-12: exige Google, Apple y Bing Maps oficiales", () => {
    const sinMaps = makeService({
      id: "sinmaps",
      slug: "sinmaps",
      googleMapsUrl: "",
      appleMapsUrl: undefined,
      bingMapsUrl: undefined,
    });
    const joined = validateServicesList([sinMaps]).errors.join(" | ");
    expect(joined).toContain("Google Maps requerido");
    expect(joined).toContain("Apple Maps requerido");
    expect(joined).toContain("Bing Maps requerido");
  });

  it("GR-11: fotos de stock prohibidas detectadas en image, images, gallery y socialPosts", () => {
    const conStock = makeService({
      id: "stock",
      slug: "stock",
      image: "https://images.unsplash.com/photo-1",
      images: ["https://img.pexels.com/x"],
      gallery: ["https://cdn.pixabay.com/y"],
      socialPosts: [{ imageUrl: "https://placeholder.com/a" }],
    } as unknown as Partial<ServiceItem>);
    const joined = validateServicesList([conStock]).errors.join(" | ");
    expect(joined).toContain("unsplash.com");
    expect(joined).toContain("pexels.com");
    expect(joined).toContain("pixabay.com");
    expect(joined).toContain("placeholder");
  });

  it("GR-13: protocolo http:// inseguro detectado con la etiqueta exacta del campo", () => {
    const inseguro = makeService({
      id: "http",
      slug: "http",
      website: "http://negocio-inseguro.com",
      image: "http://img.negocio-inseguro.com/foto.jpg",
      googleMapsUrl: "http://maps.google.com/?id=inseguro",
    });
    const joined = validateServicesList([inseguro]).errors.join(" | ");
    expect(joined).toContain("Protocolo inseguro HTTP detectado en website");
    expect(joined).toContain("Protocolo inseguro HTTP detectado en image");
    expect(joined).toContain("Protocolo inseguro HTTP detectado en googleMapsUrl");
  });
});
