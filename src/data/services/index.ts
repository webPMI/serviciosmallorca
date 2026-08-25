/**
 * src/data/services/index.ts
 *
 * Agregador Modular del Catálogo Oficial de Servicios de Mallorca.
 * Diseñado para escalar a miles de negocios organizados por módulos sectoriales.
 */

import type { ServiceItem } from "./types.ts";
import { TATTOO_SERVICES } from "./arte-tatuajes/index.ts";
import { RESTAURANT_SERVICES } from "./gastronomia-restaurantes/index.ts";

export * from "./types.ts";
export { TATTOO_SERVICES } from "./arte-tatuajes/index.ts";
export { RESTAURANT_SERVICES } from "./gastronomia-restaurantes/index.ts";

/**
 * Catálogo Unificado Global (Agregación de todos los módulos sectoriales).
 */
export const SERVICES: ServiceItem[] = [
  ...TATTOO_SERVICES,
  ...RESTAURANT_SERVICES,
].filter((s): s is ServiceItem => Boolean(s && s.id && s.slug));

/**
 * Busca un negocio por su ID o slug canónico.
 */
export function getServiceById(id: string): ServiceItem | undefined {
  if (!id) return undefined;
  return SERVICES.find((s) => s && (s.id === id || s.slug === id));
}

/**
 * Obtiene los servicios destacados y activos.
 */
export function getFeaturedServices(): ServiceItem[] {
  return SERVICES.filter((s) => s.featured && s.status === "open");
}

/**
 * Filtra servicios por categoría canónica.
 */
export function getServicesByCategory(categoryId: string): ServiceItem[] {
  return SERVICES.filter(
    (s) =>
      (s.category === categoryId || s.secondaryCategories?.includes(categoryId)) && s.status !== "permanently_closed",
  );
}

/**
 * Filtra servicios por zona geográfica de Mallorca.
 */
export function getServicesByZone(zoneId: string): ServiceItem[] {
  return SERVICES.filter((s) => s.zone === zoneId && s.status !== "permanently_closed");
}

export {
  calculateHaversineDistance,
  formatDistance,
  getServicesNearLocation,
  type GeoCoordinates,
  type NearbyServiceItem,
} from "../../lib/geoUtils.ts";

