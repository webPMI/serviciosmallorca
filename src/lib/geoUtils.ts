import type { ServiceItem } from "../data/services/types.ts";
import type { Locale } from "../i18n";

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface NearbyServiceItem extends ServiceItem {
  distanceKm: number;
  formattedDistance: string;
}

const EARTH_RADIUS_KM = 6371;

/**
 * Calcula la distancia ortodrómica en kilómetros entre dos coordenadas
 * geográficas utilizando la fórmula de Haversine (precisión métrica).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (angle: number) => (angle * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
}

/**
 * Formatea una distancia en formato amigable para el usuario:
 * - < 1 km: "850 m"
 * - >= 1 km: "3.2 km"
 */
export function formatDistance(distanceKm: number, _locale: Locale = "es"): string {
  if (distanceKm < 1.0) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Filtra y ordena los servicios del catálogo de más cercano a más lejano
 * a partir de las coordenadas del usuario o de un punto geográfico.
 */
export function getServicesNearLocation(
  services: ServiceItem[],
  userLocation: GeoCoordinates,
  maxDistanceKm?: number,
  locale: Locale = "es"
): NearbyServiceItem[] {
  const withDistance: NearbyServiceItem[] = [];

  for (const service of services) {
    if (!service.coordinates || typeof service.coordinates.lat !== "number" || typeof service.coordinates.lng !== "number") {
      continue;
    }

    const distanceKm = calculateHaversineDistance(
      userLocation.lat,
      userLocation.lng,
      service.coordinates.lat,
      service.coordinates.lng
    );

    if (maxDistanceKm !== undefined && distanceKm > maxDistanceKm) {
      continue;
    }

    withDistance.push({
      ...service,
      distanceKm,
      formattedDistance: formatDistance(distanceKm, locale),
    });
  }

  // Ordenar de más cercano a más lejano
  return withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
}
