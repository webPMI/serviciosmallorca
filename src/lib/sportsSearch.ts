/**
 * src/lib/sportsSearch.ts
 *
 * 🎾 MOTOR UNIFICADO DE BÚSQUEDA DEPORTIVA (Negocios Verificados + Instalaciones Públicas)
 *
 * Conecta las búsquedas deportivas del usuario ("padel", "yoga", "running", "calistenia", "crossfit", etc.)
 * tanto con los negocios del catálogo oficial (SERVICES) como con las instalaciones públicas
 * geolocalizadas (SPORTS_FACILITIES), permitiendo ver opciones privadas y públicas en paralelo.
 */

import { SERVICES } from "../data/services/index.ts";
import { SPORTS_FACILITIES } from "../data/sports/facilities.ts";
import type { ServiceItem } from "../data/services/types.ts";
import type { SportsFacilityPOI, SportActivityType } from "../data/sports/types.ts";
import { calculateHaversineDistance, formatDistance } from "./geoUtils.ts";
import type { Locale } from "../i18n";

export interface UnifiedSportsSearchResult {
  query: string;
  totalResults: number;
  services: ServiceItem[];
  publicFacilities: SportsFacilityPOI[];
  nearbyFacilitiesWithDistance?: Array<{
    facility: SportsFacilityPOI;
    distanceKm: number;
    formattedDistance: string;
  }>;
}

const ACTIVITY_KEYWORDS: Record<SportActivityType, string[]> = {
  padel: ["padel", "pádel", "pista de padel", "raqueta", "partido padel"],
  tenis: ["tenis", "tennis", "pista de tenis", "club tenis", "tierra batida"],
  running: ["running", "correr", "carrera", "atletismo", "pista atletismo", "tartan", "circuito running"],
  ciclismo: ["ciclismo", "cycling", "bici", "bicicleta", "carril bici", "ruta ciclista", "bike"],
  calistenia: ["calistenia", "calisthenics", "barras", "street workout", "dominadas", "parque barras"],
  yoga_pilates: ["yoga", "pilates", "meditacion", "meditación", "mindfulness", "stretching", "asanas"],
  fitness_gym: ["gimnasio", "gym", "fitness", "crossfit", "pesas", "musculacion", "musculación", "entrenamiento"],
  natacion: ["natacion", "natación", "piscina", "swimming", "piscina olimpica", "piscina cubierta", "aguas abiertas"],
  golf: ["golf", "campo de golf", "green", "putting green", "driving range"],
  senderismo_trail: ["senderismo", "hiking", "trail", "trekking", "ruta montaña", "caminata", "excursion"],
  deportes_acuaticos: ["deportes acuaticos", "surf", "paddle surf", "sup", "kayak", "windsurf", "kitesurf", "vela"],
};

/**
 * Normaliza y detecta la actividad deportiva a partir de una consulta de texto libre.
 */
export function detectSportActivity(query: string): SportActivityType | null {
  const q = query.toLowerCase().trim();
  for (const [activity, keywords] of Object.entries(ACTIVITY_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      return activity as SportActivityType;
    }
  }
  return null;
}

/**
 * Busca de forma unificada en el catálogo de empresas y en las instalaciones públicas municipales.
 */
export function searchUnifiedSports(
  query: string,
  userLocation?: { lat: number; lng: number },
  locale: Locale = "es",
): UnifiedSportsSearchResult {
  const cleanQuery = query.toLowerCase().trim();
  const detectedActivity = detectSportActivity(cleanQuery);

  // 1. Filtrar servicios privados y clubs
  const matchedServices = SERVICES.filter((s) => {
    if (s.category === "deportes-fitness") return true;
    const nameMatch = s.name.toLowerCase().includes(cleanQuery);
    const descMatch = (
      s.shortDescription?.[locale] ||
      s.shortDescription?.es ||
      s.fullDescription?.[locale] ||
      s.fullDescription?.es ||
      ""
    )
      .toLowerCase()
      .includes(cleanQuery);
    const tagMatch = (s.tags || []).some((t) => t.toLowerCase().includes(cleanQuery));
    return nameMatch || descMatch || tagMatch;
  });

  // 2. Filtrar instalaciones públicas y parques municipales
  const matchedFacilities = SPORTS_FACILITIES.filter((f) => {
    if (detectedActivity && f.activityTypes.includes(detectedActivity)) return true;
    const nameMatch = f.name.toLowerCase().includes(cleanQuery);
    const addressMatch = f.address.toLowerCase().includes(cleanQuery);
    const zoneMatch = f.zone.toLowerCase().includes(cleanQuery);
    return nameMatch || addressMatch || zoneMatch;
  });

  // 3. Si se proporciona ubicación del usuario, ordenar instalaciones públicas por proximidad métrica
  let nearbyFacilitiesWithDistance: UnifiedSportsSearchResult["nearbyFacilitiesWithDistance"] | undefined;
  if (userLocation && userLocation.lat && userLocation.lng) {
    nearbyFacilitiesWithDistance = matchedFacilities
      .map((facility) => {
        const dist = calculateHaversineDistance(
          userLocation.lat,
          userLocation.lng,
          facility.coordinates.lat,
          facility.coordinates.lng,
        );
        return {
          facility,
          distanceKm: dist,
          formattedDistance: formatDistance(dist, locale),
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return {
    query,
    totalResults: matchedServices.length + matchedFacilities.length,
    services: matchedServices,
    publicFacilities: matchedFacilities,
    nearbyFacilitiesWithDistance,
  };
}
