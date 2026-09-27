/**
 * directoryFeatured.test.ts
 *
 * 🧠 Tests del bloque "Servicios Destacados" del directorio /servicios.
 * Regla de producto: los destacados se muestran SOLO cuando el visitante
 * no tiene filtros activos (categoría, zona, búsqueda o chips de intención).
 */
import { describe, it, expect } from "vitest";
import {
  isDirectoryFiltered,
  shouldShowFeaturedServices,
  pickDirectoryFeatured,
  pinServiceFirst,
  PINNED_FEATURED_SERVICE_ID,
  MIN_FEATURED_SERVICES,
} from "../../src/lib/directoryFeatured";
import type { ServiceItem } from "../../src/data/services";

function svc(slug: string, status: ServiceItem["status"] = "open"): ServiceItem {
  return { slug, name: slug, status } as ServiceItem;
}

describe("isDirectoryFiltered · detección de filtros del directorio", () => {
  it("sin filtros: no está filtrando", () => {
    expect(isDirectoryFiltered({})).toBe(false);
    expect(isDirectoryFiltered({ category: "", zone: "", query: "" })).toBe(false);
    expect(isDirectoryFiltered({ category: "   ", query: null, zone: undefined })).toBe(false);
  });

  it("detecta categoría, zona, búsqueda e intención", () => {
    expect(isDirectoryFiltered({ category: "gastronomia-restaurantes" })).toBe(true);
    expect(isDirectoryFiltered({ zone: "palma" })).toBe(true);
    expect(isDirectoryFiltered({ query: "tattoo" })).toBe(true);
    expect(isDirectoryFiltered({ intentActive: true })).toBe(true);
  });
});

describe("shouldShowFeaturedServices · los destacados ceden ante los filtros", () => {
  it("se muestran sin filtros y con contenido suficiente", () => {
    expect(shouldShowFeaturedServices({}, MIN_FEATURED_SERVICES)).toBe(true);
    expect(shouldShowFeaturedServices({}, 8)).toBe(true);
  });

  it("NO se muestran si hay cualquier filtro activo (ni SSR ni cliente)", () => {
    expect(shouldShowFeaturedServices({ category: "na" }, 8)).toBe(false);
    expect(shouldShowFeaturedServices({ zone: "manacor" }, 8)).toBe(false);
    expect(shouldShowFeaturedServices({ query: "bar" }, 8)).toBe(false);
    expect(shouldShowFeaturedServices({ intentActive: true }, 8)).toBe(false);
  });

  it("NO se muestran si hay menos fichas que el mínimo útil", () => {
    expect(shouldShowFeaturedServices({}, 2)).toBe(false);
    expect(shouldShowFeaturedServices({}, 0)).toBe(false);
  });
});

describe("pickDirectoryFeatured · selección de fichas del bloque", () => {
  it("respeta el límite y prioriza la selección editorial", () => {
    const featured = [svc("a"), svc("b"), svc("c")];
    const ranked = [svc("r1"), svc("r2")];
    const picked = pickDirectoryFeatured(featured, ranked, 3);

    expect(picked.map((s) => s.slug)).toEqual(["a", "b", "c"]);
  });

  it("completa con los mejor valorados cuando los destacados no llegan al mínimo", () => {
    const featured = [svc("a")];
    const ranked = [svc("r1"), svc("r2"), svc("r3")];
    const picked = pickDirectoryFeatured(featured, ranked, 8);

    expect(picked.map((s) => s.slug)).toEqual(["a", "r1", "r2", "r3"]);
    expect(shouldShowFeaturedServices({}, picked.length)).toBe(true);
  });

  it("nunca duplica fichas ni incluye negocios cerrados permanentemente", () => {
    const featured = [svc("dup"), svc("cerrado", "permanently_closed")];
    const ranked = [svc("dup"), svc("nuevo"), svc("temporal", "seasonal_closure")];
    const picked = pickDirectoryFeatured(featured, ranked, 8);

    expect(picked.map((s) => s.slug)).toEqual(["dup", "nuevo", "temporal"]);
    expect(picked.some((s) => s.status === "permanently_closed")).toBe(false);
  });

  it("devuelve lista vacía sin fuentes (no rompe la página)", () => {
    expect(pickDirectoryFeatured([], [], 8)).toEqual([]);
  });
});

describe("pinServiceFirst · fija inkEnzo en 1ª posición (home y directorio)", () => {
  it("coloca el negocio fijado en primera posición sin duplicarlo", () => {
    const list = [svc("a"), svc("ink-enzo-tattoo-mallorca"), svc("b")];
    const pinned = pinServiceFirst(list);

    expect(pinned[0].slug).toBe("ink-enzo-tattoo-mallorca");
    expect(pinned).toHaveLength(3);
    expect(pinned.filter((s) => s.slug === "ink-enzo-tattoo-mallorca")).toHaveLength(1);
  });

  it("empuja el resto de fichas manteniendo su orden relativo", () => {
    const list = [svc("a"), svc("b"), svc("c"), svc("ink-enzo-tattoo-mallorca")];
    const pinned = pinServiceFirst(list);

    expect(pinned.map((s) => s.slug)).toEqual(["ink-enzo-tattoo-mallorca", "a", "b", "c"]);
  });

  it("acepta el id canónico y también el slug como clave", () => {
    const byId = pinServiceFirst([
      svc("x"),
      { id: PINNED_FEATURED_SERVICE_ID, slug: "other", status: "open" } as ServiceItem,
    ]);
    expect(byId[0].id).toBe(PINNED_FEATURED_SERVICE_ID);

    const bySlug = pinServiceFirst([svc("x"), svc(PINNED_FEATURED_SERVICE_ID)]);
    expect(bySlug[0].slug).toBe(PINNED_FEATURED_SERVICE_ID);
  });

  it("devuelve la lista intacta si el negocio fijado no está presente", () => {
    const list = [svc("a"), svc("b")];
    expect(pinServiceFirst(list)).toEqual(list);
    expect(pinServiceFirst([])).toEqual([]);
  });
});
