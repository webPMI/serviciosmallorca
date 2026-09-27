/**
 * directoryPagination.ts
 *
 * 📄 Paginación SSR del directorio `/servicios`.
 *
 * Motivo (medido en producción el 2026-09-27): renderizar las ~953 fichas en un
 * único HTML generaba 5,5 MB y 6 s por petición sin caché, lo que provoca
 * `error 1102` (límite de CPU del Worker) en cuanto hay tráfico o crawlers.
 * Con paginación real cada URL es un documento pequeño, cacheable de forma
 * independiente y, además, crawlable por los buscadores y agentes de IA (GEO).
 *
 * Lógica pura y testeada (GR-05); el template solo la compone.
 */

/** Fichas por página en el directorio. 48 ≈ 6 filas en escritorio, 12 en móvil. */
export const SERVICES_PER_PAGE = 48;

/** Convierte el parámetro `?pagina=` en un entero seguro (1..∞). */
export function parsePageParam(raw: string | null | undefined): number {
  const parsed = Number.parseInt((raw ?? "").trim(), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

export interface PaginationResult<T> {
  /** Fichas de la página actual. */
  slice: T[];
  /** Página efectiva (siempre dentro de rango). */
  page: number;
  perPage: number;
  totalItems: number;
  /** Mínimo 1, incluso sin resultados (evita paginación vacía). */
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  /** Índices 1-based para el texto "Mostrando X-Y de Z". */
  from: number;
  to: number;
}

/** Corta la colección en páginas y normaliza la página solicitada. */
export function paginate<T>(items: T[], page: number = 1, perPage: number = SERVICES_PER_PAGE): PaginationResult<T> {
  const safePerPage = Math.max(1, Math.trunc(perPage) || SERVICES_PER_PAGE);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePerPage));
  const safePage = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const start = (safePage - 1) * safePerPage;
  const slice = items.slice(start, start + safePerPage);

  return {
    slice,
    page: safePage,
    perPage: safePerPage,
    totalItems,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
    from: totalItems === 0 ? 0 : start + 1,
    to: totalItems === 0 ? 0 : start + slice.length,
  };
}

export type DirectoryParams = Record<string, string | undefined | null>;

/**
 * Construye la URL de una página del directorio conservando los filtros activos
 * (`categoria`, `zona`, `q`, `intencion`): paginar nunca debe perder el contexto.
 * La página 1 se deja sin `?pagina=` para que la URL canónica sea la limpia.
 */
export function buildDirectoryHref(basePath: string, params: DirectoryParams, page: number): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (key === "pagina") continue;
    if (value === undefined || value === null) continue;
    const trimmed = String(value).trim();
    if (trimmed) search.set(key, trimmed);
  }

  if (page > 1) search.set("pagina", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Lista de páginas a pintar con huecos (`"gap"`), como `1 … 4 5 6 … 20`. */
export function buildPageList(page: number, totalPages: number, maxVisible = 7): Array<number | "gap"> {
  if (totalPages <= 1) return [1];
  if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set<number>([1, totalPages, page]);
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) pages.add(i);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const list: Array<number | "gap"> = [];
  let previous = 0;
  for (const value of sorted) {
    if (previous && value - previous > 1) list.push("gap");
    list.push(value);
    previous = value;
  }
  return list;
}
