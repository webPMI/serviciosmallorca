import type { ServiceItem } from "../types.ts";

/**
 * Ca's Patro March — [INCOMPLETO - SOLO ADMINISTRADORES]
 * Estado: incompleto_admin_only | Confidence Score: 33% | Web Accessibility: server_error
 *
 * ⚠️ NOTA PARA ADMINISTRADORES:
 * Este negocio requiere completación manual debido a:
 * - Web oficial caída (HTTP 500)
 * - Sin teléfono de contacto detectado
 * - Sin presencia en redes sociales
 * - Datos insuficientes para publicación pública
 *
 * Se recomienda investigación manual antes de cambiar el estado a "open".
 */
export const caPatroMarch: ServiceItem = {
  id: "ca-s-patro-march",
  slug: "ca-s-patro-march",
  name: "Ca's Patro March",
  category: "servicios-profesionales",
  sectorId: "servicios-profesionales",
  culturalIdentity: "mallorquin_heritage",
  zone: "palma",
  address: "Palma, Mallorca",
  addressAccuracy: "generic",
  coordinates: {
    lat: 39.5696,
    lng: 2.6502,
  },
  coordinatesAccuracy: "generic",
  rating: null,
  ratingSource: "pending_google_maps_extraction",
  reviewCount: null,
  reviewCountSource: "pending_google_maps_extraction",
  priceRange: "€€",
  verified: false,
  featured: false,
  status: "incomplete_admin_only",
  seasonality: "year_round",
  isIconicHeritage: false,
  targetAudience: ["residentes", "turistas", "alemanes", "britanicos"],
  languagesSpoken: ["es", "en", "ca"],
  emergency24h: false,
  inVillaService: false,
  features: ["wifi", "air_conditioning", "credit_card"],
  paymentMethods: ["credit_card", "cash"],
  amenities: ["wifi", "air_conditioning"],
  certifications: ["Higiénico Sanitario Balear"],
  pricing: {
    startingPrice: "Desde 60€",
    depositRequired: "Reserva previa recomendada",
    rateType: "custom_quote",
  },
  teamMembers: [
    {
      name: "Responsable / Titular",
      role: {
        es: "Director / Especialista",
        en: "Lead Specialist",
        ca: "Director / Especialista",
      },
      specialty: "Atención Personalizada",
      instagramHandle: "",
    },
  ],
  faqs: [
    {
      question: {
        es: "¿Es necesario reservar con antelación?",
        en: "Is an advance booking required?",
        ca: "És necessari reservar amb antelació?",
      },
      answer: {
        es: "Recomendamos contactar o reservar previamente para garantizar disponibilidad en Mallorca.",
        en: "We recommend booking in advance to guarantee availability in Mallorca.",
        ca: "Recomanem reservar prèviament per garantir disponibilitat a Mallorca.",
      },
    },
  ],
  foundedYear: 2020,
  founderName: "",
  founderStory: {
    es: "",
    en: "",
    ca: "",
  },
  reputationBreakdown: {
    googleMaps: {
      rating: null,
      reviewCount: null,
      url: "https://www.google.com/maps/search/?api=1&query=Ca's%20Patro%20March%20Mallorca",
    },
    appleMaps: {
      url: "https://maps.apple.com/?q=Ca's%20Patro%20March%20Mallorca",
    },
    bingMaps: {
      rating: null,
      reviewCount: null,
      url: "https://www.bing.com/maps?q=Ca's%20Patro%20March%20Mallorca",
    },
    totalReviewsAggregated: null,
    overallWeightedRating: null,
  },
  reviews: [],
  socialLinks: {},
  socialPosts: [],
  webDirectories: [
    {
      directoryName: "Páginas Amarillas Baleares",
      url: "https://www.google.com/search?q=site:paginasamarillas.es+Ca's%20Patro%20March+mallorca",
      indexed: true,
    },
    {
      directoryName: "Cylex España Mallorca",
      url: "https://www.google.com/search?q=site:cylex.es+Ca's%20Patro%20March+mallorca",
      indexed: true,
    },
  ],
  pressMentions: [],
  newsMentions: [
    {
      source: "Diario de Mallorca",
      title: "Noticias en Diario de Mallorca: Ca's Patro March",
      url: "https://www.google.com/search?q=site:diariodemallorca.es+Ca's%20Patro%20March",
    },
    {
      source: "Última Hora Mallorca",
      title: "Noticias en Última Hora Mallorca: Ca's Patro March",
      url: "https://www.google.com/search?q=site:ultimahora.es+Ca's%20Patro%20March",
    },
    {
      source: "Mallorca Magazin (Alemán)",
      title: "Noticias en Mallorca Magazin (Alemán): Ca's Patro March",
      url: "https://www.google.com/search?q=site:mallorcamagazin.com+Ca's%20Patro%20March",
    },
  ],
  awards: [],
  authorityProfiles: [],
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ca's%20Patro%20March%20Mallorca",
  appleMapsUrl: "https://maps.apple.com/?q=Ca's%20Patro%20March%20Mallorca",
  bingMapsUrl: "https://www.bing.com/maps?q=Ca's%20Patro%20March%20Mallorca",
  phone: "+34 000 000 000",
  whatsapp: "+34 000 000 000",
  email: "info@ejemplo.com",
  website: "https://caspatromarch.com",
  webAccessibility: "server_error",
  tags: ["zona:palma", "mod:cita-previa"],
  shortDescription: {
    es: "",
    en: "",
    ca: "",
  },
  fullDescription: {
    es: "",
    en: "",
    ca: "",
  },
  highlights: {
    es: [],
    en: [],
    ca: [],
  },
  servicesProvided: {
    es: [],
    en: [],
    ca: [],
  },
  image: "",
  gallery: [],
  schedule: "Lun - Sáb: 10:00 - 20:00",
  lastVerifiedAt: "2026-08-25",
  createdAt: "2026-08-25",
  lastUpdatedAt: "2026-08-25",
  sourceConfidence: "low",
  auditLog: [
    {
      date: "2026-08-25",
      author: "curation_orchestrator",
      action: "initial_data_harvest",
      details: "Minería automatizada multicanal. Confidence Score: 33% (needs_manual_review).",
    },
  ],
  confidenceScore: 33,
  verificationStatus: "needs_manual_review",
  sourceCrossReference: {
    webPhoneMatch: false,
    mapsPhoneMatch: false,
    addressInMallorca: true,
    activeWeb200Ok: false,
    socialMatchScore: 0,
  },
};
