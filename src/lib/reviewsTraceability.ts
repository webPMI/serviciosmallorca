export type ReviewSource = "google_maps" | "tripadvisor" | "verified_local" | "booking_partner";

export interface VerifiedReviewItem {
  id: string;
  authorName: string;
  authorLocation?: string;
  authorLanguage: "es" | "en" | "ca" | "de";
  rating: number; // 1.0 - 5.0
  publishDate: string;
  relativeTime: string;
  source: ReviewSource;
  sourceLabel: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  sourceUrl?: string;
  title?: string;
  text: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  sentimentTags: string[];
  verifiedCustomer: boolean;
}

export interface BusinessReviewsTraceability {
  businessSlug: string;
  overallRating: number;
  totalReviewCount: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  topPositiveTags: string[];
  verifiedReviews: VerifiedReviewItem[];
}

export const REVIEWS_REPOSITORY: Record<string, BusinessReviewsTraceability> = {
  "el-camino-palma": {
    businessSlug: "el-camino-palma",
    overallRating: 4.8,
    totalReviewCount: 840,
    ratingDistribution: { 5: 720, 4: 95, 3: 15, 2: 6, 1: 4 },
    topPositiveTags: ["Gamba Roja de Sóller", "Barra Espectacular", "Servicio Excepcional", "Cocina en Directo"],
    verifiedReviews: [
      {
        id: "rev-ec-1",
        authorName: "Alexander V.",
        authorLocation: "München, Deutschland",
        authorLanguage: "de",
        rating: 5.0,
        publishDate: "2025-01-20",
        relativeTime: "Hace 1 mes",
        source: "google_maps",
        sourceLabel: {
          es: "Reseña Oficial en Google Maps",
          en: "Official Google Maps Review",
          ca: "Ressenya Oficial a Google Maps",
          de: "Offizielle Google Maps Rezension",
        },
        text: {
          es: "Una experiencia culinaria insuperable en Palma. Sentarse en la barra de mármol y ver a los cocineros preparar la gamba roja y los chipirones con sobrasada es un espectáculo.",
          en: "An unforgettable dining experience in Palma. Sitting at the marble counter watching chefs prepare Sóller red prawns and squid with sobrasada is pure art.",
          ca: "Una experiència gastronòmica immillorable a Palma. La barra de marbre i la gamba vermella són excel·lents.",
          de: "Ein unvergleichliches kulinarisches Erlebnis in Palma. An der beleuchteten Marmortheke den Köchen bei der Zubereitung der Sóller-Garnelen zuzusehen, ist fantastisch.",
        },
        sentimentTags: ["Qualität", "Ambiente", "Frischer Fisch"],
        verifiedCustomer: true,
      },
      {
        id: "rev-ec-2",
        authorName: "Marta S.",
        authorLocation: "Palma de Mallorca",
        authorLanguage: "es",
        rating: 5.0,
        publishDate: "2025-02-05",
        relativeTime: "Hace 3 semanas",
        source: "google_maps",
        sourceLabel: {
          es: "Reseña Oficial en Google Maps",
          en: "Official Google Maps Review",
          ca: "Ressenya Oficial a Google Maps",
          de: "Offizielle Google Maps Rezension",
        },
        text: {
          es: "De las mejores barras de España sin duda. Producto fresquísimo, carta de vinos de Mallorca muy cuidada y trato impecable.",
          en: "One of the best counters in Spain. Ultra-fresh produce, thoughtful Balearic wine list, and top-notch service.",
          ca: "Una de les millors barres d'Espanya. Producte fresquíssim i servei impecable.",
          de: "Zweifellos eine der besten Tapas-Bars in ganz Spanien. Extrem frische Produkte und sehr aufmerksamer Service.",
        },
        sentimentTags: ["Producto Local", "Vinos DO", "Excelente"],
        verifiedCustomer: true,
      },
    ],
  },
  "oasis-catamaran-palma": {
    businessSlug: "oasis-catamaran-palma",
    overallRating: 4.8,
    totalReviewCount: 468,
    ratingDistribution: { 5: 410, 4: 45, 3: 8, 2: 3, 1: 2 },
    topPositiveTags: ["Aguas Cristalinas", "Tripulación Atenta", "Puesta de Sol", "Paddle Surf"],
    verifiedReviews: [
      {
        id: "rev-oc-1",
        authorName: "Sarah & David M.",
        authorLocation: "London, United Kingdom",
        authorLanguage: "en",
        rating: 5.0,
        publishDate: "2025-01-14",
        relativeTime: "Hace 1 mes",
        source: "tripadvisor",
        sourceLabel: {
          es: "Reseña Verificada de Viajero en TripAdvisor",
          en: "Verified Traveler TripAdvisor Review",
          ca: "Ressenya Verificada a TripAdvisor",
          de: "Verifizierte TripAdvisor Reisebewertung",
        },
        text: {
          es: "Día inolvidable navegando en catamarán por la bahía. Paramos en Cala Blava con aguas de color turquesa cristalino y el almuerzo a bordo fue abundante y delicioso.",
          en: "Unforgettable day sailing across Palma Bay. We anchored at Cala Blava with crystal-clear turquoise waters; lunch was delicious and crew was top-notch.",
          ca: "Dia inoblidable navegant en catamarà. La tripulació va ser encantadora i el menjar a bord excel·lent.",
          de: "Unvergesslicher Segeltag in der Bucht von Palma. Kristallklares Wasser in Cala Blava und sehr aufmerksame Crew.",
        },
        sentimentTags: ["Highlight", "Clear Water", "Top Crew"],
        verifiedCustomer: true,
      },
    ],
  },
};

export function getBusinessReviewsTraceability(slug: string): BusinessReviewsTraceability | undefined {
  return REVIEWS_REPOSITORY[slug];
}
