/**
 * directoryPagination.test.ts
 *
 * 📄 Tests de la paginación SSR del directorio /servicios.
 * Contexto: sin paginación la página generaba 5,5 MB y 6 s (error 1102 en el Worker).
 */
import { describe, it, expect } from "vitest";
import {
  SERVICES_PER_PAGE,
  parsePageParam,
  paginate,
  buildDirectoryHref,
  buildPageList,
} from "../../src/lib/directoryPagination";

const items = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1);

describe("parsePageParam · saneado del parámetro ?pagina", () => {
  it("acepta enteros positivos", () => {
    expect(parsePageParam("1")).toBe(1);
    expect(parsePageParam("12")).toBe(12);
  });

  it("cae a la página 1 con basura, cero o negativos", () => {
    expect(parsePageParam(null)).toBe(1);
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-3")).toBe(1);
  });
});

describe("paginate · cortes y metadatos", () => {
  it("devuelve exactamente 48 fichas por página (p0) del catálogo completo", () => {
    const result = paginate(items(953));
    expect(SERVICES_PER_PAGE).toBe(48);
    expect(result.slice).toHaveLength(48);
    expect(result.page).toBe(1);
    expect(result.totalItems).toBe(953);
    expect(result.totalPages).toBe(20); // ceil(953 / 48)
    expect(result.hasPrev).toBe(false);
    expect(result.hasNext).toBe(true);
    expect(result.from).toBe(1);
    expect(result.to).toBe(48);
  });

  it("la última página se queda con el resto y no ofrece siguiente", () => {
    const result = paginate(items(953), 20);
    expect(result.slice).toHaveLength(953 - 48 * 19);
    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(false);
    expect(result.from).toBe(913);
    expect(result.to).toBe(953);
  });

  it("normaliza páginas fuera de rango (nunca devuelve vacío por error)", () => {
    expect(paginate(items(100), 999).page).toBe(3);
    expect(paginate(items(100), 999).slice).toHaveLength(4);
    expect(paginate(items(100), 0).page).toBe(1);
    expect(paginate(items(100), -5).page).toBe(1);
  });

  it("sin resultados mantiene una página válida (no NaN ni bucles vacíos)", () => {
    const result = paginate([]);
    expect(result.totalPages).toBe(1);
    expect(result.slice).toEqual([]);
    expect(result.from).toBe(0);
    expect(result.to).toBe(0);
  });

  it("no muta la colección original", () => {
    const original = items(10);
    const copy = [...original];
    paginate(original, 2);
    expect(original).toEqual(copy);
  });
});

describe("buildDirectoryHref · la paginación conserva el contexto", () => {
  it("la página 1 deja la URL canónica limpia", () => {
    expect(buildDirectoryHref("/es/servicios", { categoria: "gastronomia", zona: "palma", q: "bar" }, 1)).toBe(
      "/es/servicios?categoria=gastronomia&zona=palma&q=bar",
    );
  });

  it("añade ?pagina= a partir de la segunda página", () => {
    expect(buildDirectoryHref("/es/servicios", { q: "tattoo" }, 3)).toBe("/es/servicios?q=tattoo&pagina=3");
  });

  it("descarta vacíos y replaces de la URL anterior", () => {
    expect(buildDirectoryHref("/es/servicios", { categoria: "", zona: undefined, q: null }, 2)).toBe(
      "/es/servicios?pagina=2",
    );
    expect(buildDirectoryHref("/es/servicios", { pagina: "7" }, 2)).toBe("/es/servicios?pagina=2");
  });
});

describe("buildPageList · paginación navegable", () => {
  it("una sola página no inventa controles", () => {
    expect(buildPageList(1, 1)).toEqual([1]);
  });

  it("con muchas páginas muestra primera, actual, última y huecos", () => {
    const list = buildPageList(10, 20);
    expect(list[0]).toBe(1);
    expect(list[list.length - 1]).toBe(20);
    expect(list).toContain(10);
    expect(list).toContain("gap");
  });

  it("la lista nunca supera el máximo visible de páginas", () => {
    expect(buildPageList(1, 6).length).toBe(6);
    expect(buildPageList(1, 20, 5).filter((entry) => entry !== "gap").length).toBeLessThanOrEqual(5);
  });
});
