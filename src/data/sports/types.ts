import type { GeoCoordinates } from "../services/types.ts";

export type SportActivityType =
  | "padel"
  | "tenis"
  | "running"
  | "ciclismo"
  | "calistenia"
  | "yoga_pilates"
  | "fitness_gym"
  | "natacion"
  | "golf"
  | "senderismo_trail"
  | "deportes_acuaticos";

export type FacilityManagementType = "publica_ayuntamiento" | "club_privado" | "parque_publico" | "complejo_deportivo";

export type FacilityStatus = "open" | "maintenance" | "seasonal_closure" | "renovation";

export type SurfaceType =
  | "cesped_sintetico"
  | "tierra_batida"
  | "asfalto"
  | "arena_playa"
  | "caucho_tartán"
  | "parque_madera"
  | "cemento_pulido"
  | "sendero_natural";

export interface NearbyCrossSellService {
  serviceSlug: string;
  name: string;
  category: string;
  reason: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
}

export interface SportsFacilityPOI {
  id: string;
  slug: string;
  name: string;
  activityTypes: SportActivityType[];
  management: FacilityManagementType;
  status: FacilityStatus;
  zone: string; // "palma", "calvia", "raiguer", "tramuntana", "nord", "llevant", "migjorn"
  address: string;
  coordinates: GeoCoordinates;
  surfaceType: SurfaceType;
  surfaceLabel: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  amenities: {
    accesiblePmr: boolean;
    tieneSombra: boolean;
    fuenteAgua: boolean;
    iluminacionNocturna: boolean;
    petFriendly: boolean;
    vestuariosDuchas: boolean;
    parkingGratuito: boolean;
    alquilerMaterial: boolean;
  };
  schedule: string;
  pricing: {
    isFree: boolean;
    priceDetails?: {
      es: string;
      en: string;
      ca: string;
      de: string;
    };
  };
  rating: number;
  reviewCount: number;
  confidenceScore: number;
  verifiedOfficialSource: string; // "Ajuntament de Palma", "IME Palma", "Federació Balear", "Official Club"
  image: string;
  gallery?: string[];
  description: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  highlights: {
    es: string[];
    en: string[];
    ca: string[];
    de: string[];
  };
  bookingUrl?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  crossSellRecommendations?: NearbyCrossSellService[];
}
