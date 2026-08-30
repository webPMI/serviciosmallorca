/**
 * src/data/services/index.ts
 *
 * Agregador Modular del Catálogo Oficial de Servicios de Mallorca.
 * Diseñado para escalar a miles de negocios organizados por módulos sectoriales.
 */

import type { ServiceItem } from "./types.ts";
import { TATTOO_SERVICES } from "./arte-tatuajes/index.ts";
import { RESTAURANT_SERVICES } from "./gastronomia-restaurantes/index.ts";
import { NAUTICA_SERVICES } from "./nautica-charter/index.ts";
import { SPAS_SERVICES } from "./spas-bienestar/index.ts";
import { REFORMAS_SERVICES } from "./reformas-construccion/index.ts";
import { PROFESIONALES_SERVICES } from "./servicios-profesionales/index.ts";
import { INMOBILIARIA_SERVICES } from "./inmobiliaria-villas/index.ts";
import { TRANSPORTE_SERVICES } from "./motor-transporte/index.ts";
import { JARDINERIA_SERVICES } from "./jardineria-piscinas/index.ts";
import { SEGURIDAD_SERVICES } from "./tecnologia-seguridad/index.ts";
import { DEPORTES_SERVICES } from "./deportes-fitness/index.ts";

export * from "./types.ts";
export { TATTOO_SERVICES } from "./arte-tatuajes/index.ts";
export { RESTAURANT_SERVICES } from "./gastronomia-restaurantes/index.ts";
export { NAUTICA_SERVICES } from "./nautica-charter/index.ts";
export { SPAS_SERVICES } from "./spas-bienestar/index.ts";
export { REFORMAS_SERVICES } from "./reformas-construccion/index.ts";
export { PROFESIONALES_SERVICES } from "./servicios-profesionales/index.ts";
export { INMOBILIARIA_SERVICES } from "./inmobiliaria-villas/index.ts";
export { TRANSPORTE_SERVICES } from "./motor-transporte/index.ts";
export { JARDINERIA_SERVICES } from "./jardineria-piscinas/index.ts";
export { SEGURIDAD_SERVICES } from "./tecnologia-seguridad/index.ts";
export { DEPORTES_SERVICES } from "./deportes-fitness/index.ts";

/**
 * Catálogo Unificado Global (Agregación de todos los módulos sectoriales).
 * Incluye TODOS los servicios, incluso los incompletos (para administradores).
 */
export const SERVICES: ServiceItem[] = [
  ...TATTOO_SERVICES,
  ...RESTAURANT_SERVICES,
  ...NAUTICA_SERVICES,
  ...SPAS_SERVICES,
  ...REFORMAS_SERVICES,
  ...PROFESIONALES_SERVICES,
  ...INMOBILIARIA_SERVICES,
  ...TRANSPORTE_SERVICES,
  ...JARDINERIA_SERVICES,
  ...SEGURIDAD_SERVICES,
  ...DEPORTES_SERVICES,
].filter((s): s is ServiceItem => Boolean(s && s.id && s.slug));

/**
 * Catálogo Público (Solo servicios completos y verificados para usuarios).
 * Excluye negocios con status "incomplete_admin_only".
 */
export const PUBLIC_SERVICES: ServiceItem[] = SERVICES.filter((s) => s.status !== "incomplete_admin_only");

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
