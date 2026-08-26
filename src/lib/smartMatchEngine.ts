import { SERVICES } from "../data/services";
import type { ServiceItem, GeoCoordinates } from "../data/services/types";
import { calculateHaversineDistance, formatDistance } from "./geoUtils";
import type { Locale } from "../i18n";

export interface SmartMatchRecommendation {
  service: ServiceItem;
  distanceKm?: number;
  formattedDistance?: string;
  crossSellReason: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  relevanceScore: number;
}

// Matriz de afinidad intersectorial de alta conversión
const CROSS_SECTOR_AFFINITY: Record<string, string[]> = {
  "arte-tatuajes": ["gastronomia-restaurantes", "gastronomia-catering", "spas-bienestar"],
  "gastronomia-restaurantes": ["spas-bienestar", "nautica-charter", "arte-tatuajes"],
  "gastronomia-catering": ["spas-bienestar", "nautica-charter", "inmobiliaria-villas"],
  "nautica-charter": ["gastronomia-restaurantes", "motor-transporte", "spas-bienestar"],
  "spas-bienestar": ["gastronomia-restaurantes", "nautica-charter", "servicios-profesionales"],
  "reformas-construccion": ["jardineria-piscinas", "tecnologia-seguridad", "inmobiliaria-villas"],
  "inmobiliaria-villas": ["reformas-construccion", "jardineria-piscinas", "servicios-profesionales"],
  "motor-transporte": ["gastronomia-restaurantes", "nautica-charter", "spas-bienestar"],
  "jardineria-piscinas": ["reformas-construccion", "inmobiliaria-villas", "tecnologia-seguridad"],
  "tecnologia-seguridad": ["reformas-construccion", "inmobiliaria-villas", "servicios-profesionales"],
  "servicios-profesionales": ["inmobiliaria-villas", "reformas-construccion", "gastronomia-restaurantes"],
};

/**
 * Genera el texto justificativo de la recomendación según los sectores cruzados.
 */
function generateCrossSellReason(
  sourceCategory: string,
  targetCategory: string,
  businessName: string,
): { es: string; en: string; ca: string; de: string } {
  if (sourceCategory.includes("nautica") && targetCategory.includes("gastronomia")) {
    return {
      es: `Cena mediterránea ideal en ${businessName} tras tu jornada en alta mar.`,
      en: `Ideal Mediterranean dinner at ${businessName} after your yacht charter.`,
      ca: `Sopar mediterrani ideal a ${businessName} després del teu dia al mar.`,
      de: `Perfektes mediterranes Dinner im ${businessName} nach Ihrem Yachtcharter.`,
    };
  }

  if (sourceCategory.includes("tatuaje") && targetCategory.includes("gastronomia")) {
    return {
      es: `Café y gastronomía de especialidad en ${businessName} en el mismo barrio.`,
      en: `Specialty coffee & gastronomy at ${businessName} in the same neighborhood.`,
      ca: `Cafè i gastronomia d'especialitat a ${businessName} al mateix barri.`,
      de: `Spezialitätenkaffee & Gastronomie im ${businessName} im selben Viertel.`,
    };
  }

  if (sourceCategory.includes("inmobiliaria") && targetCategory.includes("reformas")) {
    return {
      es: `Estudio técnico de arquitectura y reformas recomendado por ${businessName}.`,
      en: `Architecture and renovation studio recommended alongside ${businessName}.`,
      ca: `Estudi d'arquitectura i reformes recomanat per ${businessName}.`,
      de: `Renovierungs- und Architekturberatung empfohlen für Ihre Immobilie bei ${businessName}.`,
    };
  }

  if (targetCategory.includes("spas")) {
    return {
      es: `Relajación y masajes terapéuticos de alta gama en ${businessName}.`,
      en: `High-end relaxation and wellness therapy at ${businessName}.`,
      ca: `Relaxació i massatges de gamma alta a ${businessName}.`,
      de: `Erstklassige Entspannung und Wellness-Anwendungen im ${businessName}.`,
    };
  }

  return {
    es: `Servicio complementario de máxima puntuación y proximidad: ${businessName}.`,
    en: `Top-rated complementary verified local service: ${businessName}.`,
    ca: `Servei complementari de màxima puntuació i proximitat: ${businessName}.`,
    de: `Erstklassiger komplementärer Partnerbetrieb in Ihrer Nähe: ${businessName}.`,
  };
}

/**
 * Motor Smart-Match: Obtiene recomendaciones intersectoriales de proximidad y alta reputación.
 */
export function getSmartMatchCrossSell(
  source: {
    id?: string;
    slug?: string;
    category: string;
    zone: string;
    coordinates?: GeoCoordinates;
  },
  limit = 3,
  locale: Locale = "es",
): SmartMatchRecommendation[] {
  const targetCategories = CROSS_SECTOR_AFFINITY[source.category] || ["gastronomia-restaurantes", "spas-bienestar"];

  const candidates = SERVICES.filter(
    (s) =>
      s.id !== source.id &&
      s.slug !== source.slug &&
      s.status !== "permanently_closed" &&
      targetCategories.includes(s.category),
  );

  const scoredCandidates = candidates.map((service) => {
    let distanceKm: number | undefined;
    let distanceScore = 50; // default si no hay coordenadas

    if (source.coordinates && service.coordinates) {
      distanceKm = calculateHaversineDistance(
        source.coordinates.lat,
        source.coordinates.lng,
        service.coordinates.lat,
        service.coordinates.lng,
      );

      if (distanceKm < 2.0) distanceScore = 100;
      else if (distanceKm < 5.0) distanceScore = 85;
      else if (distanceKm < 15.0) distanceScore = 65;
      else distanceScore = 30;
    } else if (service.zone === source.zone) {
      distanceScore = 80;
    }

    const ratingScore = ((service.rating ?? 4.0) / 5.0) * 100;
    const confidenceScore = service.confidenceScore ?? (service.verified ? 90 : 60);

    const relevanceScore = distanceScore * 0.45 + ratingScore * 0.35 + confidenceScore * 0.2;

    return {
      service,
      distanceKm,
      formattedDistance: distanceKm !== undefined ? formatDistance(distanceKm, locale) : undefined,
      crossSellReason: generateCrossSellReason(source.category, service.category, service.name),
      relevanceScore,
    };
  });

  scoredCandidates.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scoredCandidates.slice(0, limit);
}
