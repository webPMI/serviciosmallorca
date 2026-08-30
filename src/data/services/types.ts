export type ServiceStatus = "open" | "seasonal_closure" | "permanently_closed" | "incomplete_admin_only";
export type SeasonalityType = "year_round" | "summer_season" | "winter_season";

export type TrustLevel =
  | "level_1_discovery" // Nivel 1: Observación Pública (Discovery Mode)
  | "level_2_community" // Nivel 2: Verificación Comunitaria (Community Trust)
  | "level_3_official"; // Nivel 3: Verificación Oficial (Premium Trust)

export type ExtendedVerificationStatus =
  "unverified" | "pending_audit" | "verified_community" | "verified_official" | "needs_review" | "needs_manual_review";

export interface DetailedAuditTrailEntry {
  id: string;
  timestamp: string;
  action: "created" | "updated" | "verified" | "claimed" | "decayed" | "status_change" | "purged" | "audited";
  fieldChanged?: string;
  oldValue?: unknown;
  newValue?: unknown;
  authorRole: "system" | "curator" | "manager" | "admin";
  authorUid?: string;
  reason?: string;
}

export interface ClosureHistoryRecord {
  date: string;
  previousStatus: ServiceStatus;
  newStatus: ServiceStatus;
  reason?: ClosureReason | string;
  documentedBy: string;
}

export type CulturalIdentity =
  | "mallorquin_heritage" // Clásico Mallorquín de siempre / Tradición e historia de la isla
  | "german_oriented" // Orientado a comunidad y turismo alemán (Deutsche Community)
  | "british_oriented" // Orientado a comunidad y visitantes británicos (UK / English Speaking)
  | "scandinavian_oriented" // Orientado a comunidad nórdica / escandinava (Nordic Standards)
  | "french_oriented" // Orientado a comunidad francófona
  | "international_luxury" // Enfoque internacional cosmopolita y de lujo
  | "local_spanish"; // Nacional / Peninsular

export type ClosureReason =
  | "retirement" // Jubilación sin relevo generacional
  | "economic" // Inviabilidad económica o cambios de mercado
  | "relocation" // Traslado de sede o cambio de municipio
  | "gentrification_lease" // Finalización de contrato de alquiler / incremento de renta
  | "acquisition" // Venta o absorción por grupo empresarial
  | "generational_gap" // Falta de continuidad familiar
  | "urban_reform" // Obras urbanísticas o cambio de uso del inmueble
  | "unknown"; // Cierre confirmado sin motivo documentado

export type HistoricalSignificance =
  | "centenary_heritage" // Negocio centenario emblemático (+100 años)
  | "historical_landmark" // Hito comercial e histórico (+30 a +50 años)
  | "commercial_pioneer" // Pionero en su sector en Mallorca (+10 a +20 años)
  | "standard";

export interface PressMention {
  mediaName: string; // "Diario de Mallorca", "Mallorca Magazin", "ABC Mallorca", "Forbes", etc.
  title: string;
  url?: string;
  date?: string;
  quote?: string;
}

export interface BusinessAward {
  title: string; // "1er Premio Mejor Tatuaje Black & Grey" / "Sol Repsol 2025"
  issuer: string; // Entidad otorgante
  year?: number;
  category?: string;
  url?: string; // Enlace a la noticia, acta del jurado o web oficial del premio
  certificateUrl?: string; // Imagen o PDF del diploma acreditativo
}

export interface TeamMember {
  name: string;
  role: { es: string; en: string; ca: string; de?: string };
  specialty?: string;
  instagramHandle?: string;
  avatarUrl?: string;
}

export interface PricingDetail {
  startingPrice?: string; // "Desde 60€" / "From 60€"
  depositRequired?: string; // "Señal de reserva: 30€"
  rateType?: "fixed" | "hourly" | "custom_quote" | "tiered" | "daily";
  pricingType?: "fixed" | "hourly" | "custom_quote" | "tiered" | "daily";
  notes?: { es?: string; en?: string; ca?: string; de?: string };
}

export interface StoreProduct {
  id: string;
  name: { es: string; en: string; ca: string; de?: string };
  price: string; // "25,00€" / "Desde 15€"
  description?: { es?: string; en?: string; ca?: string; de?: string };
  category?: string; // "Merchandise" | "Cuidado Posterior" | "Joyería Titanio" | "Prints de Arte" | "Tarjetas Regalo"
  imageUrl?: string;
  url?: string; // Enlace directo a comprar en su tienda
  inStock?: boolean;
  badge?: string; // "Bestseller" | "Edición Limitada" | "Vegano" | "Exclusivo"
}

export interface OnlineStoreInfo {
  hasOnlineStore: boolean;
  url?: string; // "https://urbansoul.club/shop"
  platform?: "shopify" | "woocommerce" | "prestashop" | "custom" | "etsy" | "other";
  shippingToBalearics?: boolean;
  pickupInStore?: boolean;
}

export interface BusinessFAQ {
  question: { es: string; en: string; ca: string; de?: string };
  answer: { es: string; en: string; ca: string; de?: string };
}

export interface CustomerReview {
  id: string;
  authorName: string;
  rating: number; // 1 a 5
  date: string; // "2025-06-12"
  platform: "google_maps" | "tripadvisor" | "trustpilot" | "thefork" | "treatwell" | "bing_maps" | "direct";
  language: "es" | "en" | "de" | "ca" | "fr" | "sv" | "it";
  comment: string;
  verifiedCustomer?: boolean;
  isHighlight?: boolean;
  quoteHighlight?: string;
}

export interface PlatformScore {
  rating: number | null; // Permite null cuando no hay datos disponibles
  reviewCount: number | null; // Permite null cuando no hay datos disponibles
  url: string;
}

export interface ReputationBreakdown {
  googleMaps?: PlatformScore;
  appleMaps?: { rating?: number | null; reviewCount?: number | null; url: string };
  bingMaps?: PlatformScore;
  tripadvisor?: PlatformScore;
  trustpilot?: PlatformScore;
  thefork?: PlatformScore;
  treatwell?: PlatformScore;
  totalReviewsAggregated?: number | null;
  overallWeightedRating?: number | null;
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  pinterest?: string;
  linkedin?: string;
  twitter?: string;
  whatsappChannel?: string;
}

export interface SocialMediaPost {
  id: string;
  platform: "instagram" | "tiktok" | "facebook" | "pinterest";
  url: string;
  imageUrl: string;
  caption?: string;
  date?: string;
  likesCount?: number;
}

export interface WebIndexPresence {
  directoryName: string; // "Páginas Amarillas", "Cylex", "ABC Mallorca", "Bodas.net", "TripAdvisor"
  url: string;
  indexed: boolean;
}

export interface AuthorityProfile {
  platform: "tripadvisor" | "thefork" | "treatwell" | "trustpilot" | "yelp" | "instagram" | "tiktok";
  url: string;
  rating?: number;
  reviewCount?: number;
  handle?: string;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface AuditLogEntry {
  date: string;
  author: string;
  action: string;
  details?: string;
}

export type EvolutionAction = "preserve_history" | "purge_erroneous" | "direct_update";

export type EvolutionType =
  | "address_change"
  | "rebranding"
  | "expansion"
  | "ownership_transfer"
  | "century_milestone"
  | "service_update"
  | "schedule_update"
  | "correction_purged";

export interface ServiceEvolutionEntry {
  id?: string;
  date: string; // e.g. "2026-08", "2024-05", "1998"
  type: EvolutionType;
  action: EvolutionAction;
  title: { es: string; en: string; ca: string; de: string };
  description: { es: string; en: string; ca: string; de: string };
  previousValue?: string | Record<string, unknown>;
  newValue?: string | Record<string, unknown>;
  isObsoleteHistorical?: boolean; // Si es true, representa historia real pasada y se preserva en la línea de tiempo
  verifiedBy?: string; // e.g. "Editorial Team", "Manager Verified"
}

export interface BusinessCapabilities {
  petFriendly?: boolean; // Admite mascotas
  wheelchairAccessible?: boolean; // Apto para personas con movilidad reducida (PMR)
  kidsArea?: boolean; // Zona infantil o de juegos
  terrace?: boolean; // Terraza al aire libre
  seaViews?: boolean; // Vistas al mar
  parkingAvailable?: boolean; // Aparcamiento propio o cercano
  onlineBooking?: boolean; // Reserva directa online
  inVillaService?: boolean; // Servicio a domicilio / en villa
  emergency24h?: boolean; // Servicio de urgencia 24 horas
  wifi?: boolean; // Conexión WiFi
  takeaway?: boolean; // Servicio para llevar / delivery
  privateRooms?: boolean; // Salas privadas o eventos
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categories?: string[]; // Múltiples categorías transversales
  subcategories?: string[]; // Especialidades y nichos específicos
  sectorId?: string;
  sectors?: string[]; // Array de sectores macroeconómicos vinculados
  capabilities?: BusinessCapabilities; // Matriz de capacidades e intención de usuario
  secondaryCategories?: string[];
  zone: string;
  address: string;
  addressAccuracy?: "extracted_from_html" | "generic" | "verified_manual"; // Flag para precisión de dirección
  coordinates: GeoCoordinates;
  coordinatesAccuracy?: "extracted_from_html" | "generic" | "verified_manual"; // Flag para precisión de coordenadas
  rating: number | null; // Permite null cuando no hay rating disponible aún
  ratingSource?: "extracted_from_html" | "pending_google_maps_extraction" | "verified_manual"; // Flag para origen del rating
  reviewCount: number | null; // Permite null cuando no hay reseñas disponibles aún
  reviewCountSource?: "extracted_from_html" | "pending_google_maps_extraction" | "verified_manual"; // Flag para origen de reseñas
  priceRange: "€" | "€€" | "€€€" | "€€€€";
  verified: boolean;
  featured: boolean;
  status: ServiceStatus;
  webAccessibility?: "active" | "not_found" | "server_error" | "timeout" | "error"; // Estado de accesibilidad de la web
  seasonality?: SeasonalityType;
  culturalIdentity?: CulturalIdentity;
  isIconicHeritage?: boolean; // Negocio emblemático histórico que toda persona que visita Mallorca debe conocer
  isNewOpening?: boolean; // Nueva apertura / Negocio reciente sin histórico previo de reseñas
  targetAudience?: string[]; // ["alemanes", "britanicos", "residentes", "turistas", "familias"]
  languagesSpoken?: string[]; // ["es", "en", "de", "ca", "fr", "sv", "it"]
  emergency24h?: boolean;
  inVillaService?: boolean;
  features?: string[];
  paymentMethods?: string[]; // ["credit_card", "cash", "bizum", "apple_pay", "crypto"]
  amenities?: string[]; // ["wifi", "air_conditioning", "wheelchair_accessible", "parking_nearby", "pet_friendly"]
  certifications?: string[]; // ["Higiénico Sanitario Balear", "Titanio ASTM F-136", "Registro Sanitario"]
  pricing?: PricingDetail;
  teamMembers?: TeamMember[];
  faqs?: BusinessFAQ[];
  foundedYear?: number;
  closureYear?: number; // Año de cese de actividad oficial
  closureReason?: ClosureReason; // Motivo clasificado de cierre para Business Intelligence
  closureDetails?: {
    es?: string;
    en?: string;
    ca?: string;
    de?: string;
  };
  yearsInOperation?: number; // Años totales de actividad en Mallorca
  historicalSignificance?: HistoricalSignificance; // Valor patrimonial o histórico del comercio
  founderName?: string;
  founderStory?: {
    es?: string;
    en?: string;
    ca?: string;
    de?: string;
  };
  pressMentions?: PressMention[];
  awards?: BusinessAward[];
  authorityProfiles?: AuthorityProfile[];
  reputationBreakdown?: ReputationBreakdown;
  reviews?: CustomerReview[];
  socialLinks?: SocialMediaLinks;
  socialPosts?: SocialMediaPost[];
  webDirectories?: WebIndexPresence[];
  lastVerifiedAt?: string;
  createdAt?: string;
  lastUpdatedAt?: string;
  googleMapsUrl: string;
  appleMapsUrl: string;
  bingMapsUrl: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website: string;
  tags?: string[];
  description?:
    | string
    | {
        es: string;
        en: string;
        ca: string;
        de?: string;
      };
  shortDescription: {
    es: string;
    en: string;
    ca: string;
    de?: string;
  };
  fullDescription?: {
    es: string;
    en: string;
    ca: string;
    de?: string;
  };
  highlights?: {
    es: string[];
    en: string[];
    ca: string[];
    de?: string[];
  };
  servicesProvided?: {
    es: string[];
    en: string[];
    ca: string[];
    de?: string[];
  };
  image: string;
  images?: string[];
  gallery?: string[];
  schedule: string | Record<string, unknown>;
  onlineStore?: OnlineStoreInfo;
  products?: StoreProduct[];
  menuUrl?: string; // Enlace directo a la carta digital o PDF del menú
  specialties?:
    | string[]
    | {
        es: string[];
        en: string[];
        ca: string[];
        de?: string[];
      };
  newsMentions?: Array<{
    title: string;
    date?: string;
    url: string;
    source: string;
  }>;
  authorityScore?: number; // 0 - 100% basado en apariciones en prensa y directorios
  verificationStatus?: ExtendedVerificationStatus | "verified";
  trustLevel?: TrustLevel; // Nivel de Confianza: 1 (Descubrimiento), 2 (Comunidad), 3 (Oficial)
  lastValidatedAt?: string; // Fecha ISO de la última verificación activa
  sourceConfidence?: "high" | "medium" | "low";
  confidenceScore?: number; // 0 - 100%
  auditLog?: AuditLogEntry[];
  auditTrail?: DetailedAuditTrailEntry[]; // Registro de auditoría granular
  closureHistory?: ClosureHistoryRecord[]; // Historial de transiciones de estado
  sourceCrossReference?: {
    webPhoneMatch?: boolean;
    mapsPhoneMatch?: boolean;
    addressConsistency?: boolean;
    addressInMallorca?: boolean;
    activeWeb200Ok?: boolean;
    socialMatchScore?: number;
    googleMapsConfirmed?: boolean;
    socialPresenceActive?: boolean;
    taxIdVerified?: boolean;
  };
  allowLiveEdits?: boolean; // Permite o restringe ediciones directas desde BD/Manager
  isClaimed?: boolean; // True si el negocio ha sido formalmente reclamado y cedido a su titular
  claimedByUid?: string; // UID del titular verificado que ostenta el mando
  claimedAt?: string; // Fecha ISO de cesión oficial de la ficha
  communityBoostTotal?: number; // Total acumulado en euros (€) aportado por la comunidad
  communityBackersCount?: number; // Cantidad de vecinos/fans que han aupado este negocio
  evolutionHistory?: ServiceEvolutionEntry[]; // Memoria histórica de la evolución del servicio
  socialProofBadges?: Array<{
    icon?: string;
    label: { es: string; en: string; ca: string; de?: string } | string;
  }>;
  localSeoKeywords?: {
    primary: string;
    secondary?: string[];
    locationKeywords?: string[];
  };
}
