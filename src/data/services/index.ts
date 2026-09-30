/**
 * src/data/services/index.ts
 *
 * Agregador Modular del Catálogo Oficial de Servicios de Mallorca.
 * Diseñado para escalar a miles de negocios organizados por módulos sectoriales.
 */

import type { ServiceItem } from "./types.ts";
import { TATTOO_SERVICES } from "./arte-tatuajes/index.ts";
import { GALERIAS_MUSEOS_SERVICES } from "./galerias-museos/index.ts";
import { RESTAURANT_SERVICES } from "./gastronomia-restaurantes/index.ts";
import { NAUTICA_SERVICES } from "./nautica-charter/index.ts";
import { SPAS_SERVICES } from "./spas-bienestar/index.ts";
import { REFORMAS_SERVICES } from "./reformas-construccion/index.ts";
import { PROFESIONALES_SERVICES } from "./servicios-profesionales/index.ts";
import { INMOBILIARIA_SERVICES } from "./inmobiliaria-villas/index.ts";
import { TRANSPORTE_SERVICES } from "./motor-transporte/index.ts";
import { JARDINERIA_SERVICES } from "./jardineria-piscinas/index.ts";
import { SEGURIDAD_SERVICES } from "./tecnologia-seguridad/index.ts";
import { ALOJAMIENTO_SERVICES } from "./alojamiento-turismo/index.ts";
import { RETAIL_SERVICES } from "./retail-comercio/index.ts";
import { EDUCACION_SERVICES } from "./educacion-formacion/index.ts";
import { ENTRETENIMIENTO_SERVICES } from "./entretenimiento-ocio/index.ts";
import { DEPORTES_SERVICES } from "./deportes-fitness/index.ts";
import { HOGAR_SERVICES } from "./hogar-limpieza/index.ts";
import { MASCOTAS_SERVICES } from "./mascotas-veterinaria/index.ts";
import { AGRICULTURA_SERVICES } from "./agricultura-productores/index.ts";
import { ARTESANIA_SERVICES } from "./artesania-manufactura/index.ts";
import { SOCIALES_SERVICES } from "./servicios-sociales/index.ts";
import { FINANZAS_SERVICES } from "./finanzas-seguros/index.ts";
import { SALUD_SERVICES } from "./salud-bienestar/index.ts";

export * from "./types.ts";
export { TATTOO_SERVICES } from "./arte-tatuajes/index.ts";
export { GALERIAS_MUSEOS_SERVICES } from "./galerias-museos/index.ts";
export { RESTAURANT_SERVICES } from "./gastronomia-restaurantes/index.ts";
export { NAUTICA_SERVICES } from "./nautica-charter/index.ts";
export { SPAS_SERVICES } from "./spas-bienestar/index.ts";
export { REFORMAS_SERVICES } from "./reformas-construccion/index.ts";
export { PROFESIONALES_SERVICES } from "./servicios-profesionales/index.ts";
export { INMOBILIARIA_SERVICES } from "./inmobiliaria-villas/index.ts";
export { TRANSPORTE_SERVICES } from "./motor-transporte/index.ts";
export { JARDINERIA_SERVICES } from "./jardineria-piscinas/index.ts";
export { SEGURIDAD_SERVICES } from "./tecnologia-seguridad/index.ts";
export { ALOJAMIENTO_SERVICES } from "./alojamiento-turismo/index.ts";
export { RETAIL_SERVICES } from "./retail-comercio/index.ts";
export { EDUCACION_SERVICES } from "./educacion-formacion/index.ts";
export { ENTRETENIMIENTO_SERVICES } from "./entretenimiento-ocio/index.ts";
export { DEPORTES_SERVICES } from "./deportes-fitness/index.ts";
export { HOGAR_SERVICES } from "./hogar-limpieza/index.ts";
export { MASCOTAS_SERVICES } from "./mascotas-veterinaria/index.ts";
export { AGRICULTURA_SERVICES } from "./agricultura-productores/index.ts";
export { ARTESANIA_SERVICES } from "./artesania-manufactura/index.ts";
export { SOCIALES_SERVICES } from "./servicios-sociales/index.ts";
export { FINANZAS_SERVICES } from "./finanzas-seguros/index.ts";
export { SALUD_SERVICES } from "./salud-bienestar/index.ts";

/**
 * Catálogo Unificado Global (Agregación de todos los módulos sectoriales).
 * Incluye TODOS los servicios, incluso los incompletos (para administradores).
 */
export const SERVICES: ServiceItem[] = [
  ...TATTOO_SERVICES,
  ...GALERIAS_MUSEOS_SERVICES,
  ...RESTAURANT_SERVICES,
  ...NAUTICA_SERVICES,
  ...SPAS_SERVICES,
  ...REFORMAS_SERVICES,
  ...PROFESIONALES_SERVICES,
  ...INMOBILIARIA_SERVICES,
  ...TRANSPORTE_SERVICES,
  ...JARDINERIA_SERVICES,
  ...SEGURIDAD_SERVICES,
  ...ALOJAMIENTO_SERVICES,
  ...RETAIL_SERVICES,
  ...EDUCACION_SERVICES,
  ...ENTRETENIMIENTO_SERVICES,
  ...DEPORTES_SERVICES,
  ...HOGAR_SERVICES,
  ...MASCOTAS_SERVICES,
  ...AGRICULTURA_SERVICES,
  ...ARTESANIA_SERVICES,
  ...SOCIALES_SERVICES,
  ...FINANZAS_SERVICES,
  ...SALUD_SERVICES,
].filter((s): s is ServiceItem => Boolean(s && s.id && s.slug));

/**
 * Catálogo Público (Solo servicios completos y verificados para usuarios).
 * Excluye negocios con status "incomplete_admin_only".
 */
export const PUBLIC_SERVICES: ServiceItem[] = SERVICES.filter((s) => s.status !== "incomplete_admin_only");

// ── Índices en memoria O(1) para eliminar latencia y consumo excesivo de CPU ──
const SERVICE_BY_ID_OR_SLUG = new Map<string, ServiceItem>();
for (const s of SERVICES) {
  if (s.id) SERVICE_BY_ID_OR_SLUG.set(s.id, s);
  if (s.slug && s.slug !== s.id) SERVICE_BY_ID_OR_SLUG.set(s.slug, s);
}

const FEATURED_SERVICES_CACHE: ServiceItem[] = SERVICES.filter((s) => s.featured && s.status === "open");

const CATEGORY_SERVICES_CACHE = new Map<string, ServiceItem[]>();
const ZONE_SERVICES_CACHE = new Map<string, ServiceItem[]>();

/**
 * Busca un negocio por su ID o slug canónico en O(1).
 */
export function getServiceById(id: string): ServiceItem | undefined {
  if (!id) return undefined;
  return SERVICE_BY_ID_OR_SLUG.get(id);
}

/**
 * Obtiene los servicios destacados y activos (precalculado).
 */
export function getFeaturedServices(): ServiceItem[] {
  return FEATURED_SERVICES_CACHE;
}

/**
 * Filtra servicios por categoría canónica (memoizado).
 */
export function getServicesByCategory(categoryId: string): ServiceItem[] {
  const cached = CATEGORY_SERVICES_CACHE.get(categoryId);
  if (cached) return cached;

  const result = SERVICES.filter(
    (s) =>
      (s.category === categoryId || s.secondaryCategories?.includes(categoryId)) && s.status !== "permanently_closed",
  );
  CATEGORY_SERVICES_CACHE.set(categoryId, result);
  return result;
}

/**
 * Filtra servicios por zona geográfica de Mallorca (memoizado).
 */
export function getServicesByZone(zoneId: string): ServiceItem[] {
  const cached = ZONE_SERVICES_CACHE.get(zoneId);
  if (cached) return cached;

  const result = SERVICES.filter((s) => s.zone === zoneId && s.status !== "permanently_closed");
  ZONE_SERVICES_CACHE.set(zoneId, result);
  return result;
}

export {
  calculateHaversineDistance,
  formatDistance,
  getServicesNearLocation,
  type GeoCoordinates,
  type NearbyServiceItem,
} from "../../lib/geoUtils.ts";
