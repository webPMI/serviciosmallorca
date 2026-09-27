/**
 * directoryFeatured.ts
 *
 * 🧠 Lógica pura del bloque "Servicios Destacados" del directorio `/servicios`.
 *
 * Regla de UX: los destacados solo se muestran cuando el visitante **no está filtrando**
 * (ni categoría, ni zona, ni búsqueda, ni chips de intención). En cuanto aplica un filtro,
 * ceden el protagonismo a los resultados. Vive aquí (y no en el template) para poder
 * testearla y reutilizarla en servidor y cliente sin duplicar lógica (GR-05, GR-08).
 */
import type { ServiceItem } from "../data/services";

export interface DirectoryFilterState {
  category?: string | null;
  zone?: string | null;
  query?: string | null;
  /** Al menos un chip de intención activo (solo detectable en el cliente). */
  intentActive?: boolean;
}

/** ¿El visitante tiene algún filtro activo en el directorio? */
export function isDirectoryFiltered(state: DirectoryFilterState): boolean {
  return Boolean(
    (state.category && state.category.trim()) ||
      (state.zone && state.zone.trim()) ||
      (state.query && state.query.trim()) ||
      state.intentActive,
  );
}

/** Mínimo de fichas necesarias para que el bloque de destacados tenga sentido. */
export const MIN_FEATURED_SERVICES = 3;

/**
 * El bloque se renderiza (SSR) solo si no hay filtros y hay contenido suficiente.
 * Si el visitante llega con `?categoria=…` / `?zona=…` / `?q=…`, no se emite HTML.
 */
export function shouldShowFeaturedServices(
  state: DirectoryFilterState,
  featuredCount: number,
  minFeatured: number = MIN_FEATURED_SERVICES,
): boolean {
  return !isDirectoryFiltered(state) && featuredCount >= minFeatured;
}

/**
 * Selección de destacados del directorio: primero la selección editorial (`featured`) y,
 * si no alcanza el mínimo, se completa con los mejor valorados (`ranked`).
 * Nunca incluye negocios cerrados de forma permanente ni fichas duplicadas.
 */
export function pickDirectoryFeatured(featured: ServiceItem[], ranked: ServiceItem[], limit: number = 8): ServiceItem[] {
  const selected: ServiceItem[] = [];
  const seen = new Set<string>();

  const add = (service: ServiceItem): void => {
    if (!service || service.status === "permanently_closed") return;
    const key = service.slug || service.id || service.name;
    if (!key || seen.has(key)) return;
    seen.add(key);
    selected.push(service);
  };

  for (const service of featured) {
    if (selected.length >= limit) break;
    add(service);
  }
  for (const service of ranked) {
    if (selected.length >= limit) break;
    add(service);
  }

  return selected;
}
