import type { ServiceItem } from "../types.ts";

export const florDeSalEsTrenc: ServiceItem = {
  id: "flor-de-sal-es-trenc",
  slug: "flor-de-sal-es-trenc",
  name: "Flor de Sal d'Es Trenc",
  category: "queserias-producto-km0",
  sectorId: "agricultura-productores",
  culturalIdentity: "mallorquin_heritage",
  zone: "santanyi-migjorn",
  address: "Ctra. Campos a Colònia de Sant Jordi, Km 8,7, 07630 Campos, Illes Balears",
  addressAccuracy: "verified_manual",
  coordinates: {
    lat: 39.3512,
    lng: 3.0184,
  },
  coordinatesAccuracy: "verified_manual",
  rating: 4.6,
  ratingSource: "verified_manual",
  reviewCount: 950,
  reviewCountSource: "verified_manual",
  priceRange: "€€",
  verified: true,
  confidenceScore: 85,
  lastVerifiedAt: "2026-09-28",
  featured: true,
  status: "open",
  tags: ["zona:santanyi-migjorn", "product:accesible", "temps:todo-el-ano", "mod:en-local"],
  seasonality: "year_round",
  isIconicHeritage: true,
  targetAudience: ["gourmets", "turistas", "residentes", "familias"],
  languagesSpoken: ["es", "en", "ca", "de"],
  emergency24h: false,
  inVillaService: false,
  features: ["parking", "credit_card"],
  paymentMethods: ["credit_card", "bank_transfer", "cash"],
  phone: "+34 971 65 53 06",
  website: "https://flordesaldestrenc.com/",
  image: "/images/services/flor-de-sal-es-trenc.jpg",
  shortDescription: {
    es: "Salinas naturales protegidas y cosecha artesanal de Flor de Sal marina.",
    en: "Protected natural salt flats harvesting pure Flor de Sal sea salt flakes.",
    ca: "Salines naturals protegides i collita artesanal de Flor de Sal.",
    de: "Natürliche Salinen mit handgeschöpftem Flor de Sal Meersalz.",
  },
  fullDescription: {
    es: "Flor de Sal d ofrece un servicio profesional de máxima categoría en Mallorca. Cosecha manual de cristales de sal marina en el Parque Natural de Es Trenc con visitas guiadas. Con atención personalizada, un equipo técnico altamente cualificado y compromiso de excelencia para clientes y propiedades en toda la isla.",
    en: "Flor de Sal d delivers premier professional service in Mallorca. Hand-harvested sea salt in Es Trenc Natural Park with educational guided walks. Featuring personalized attention, certified expert staff, and strict quality standards for discerning clients across the Balearic island.",
    ca: "Flor de Sal d ofereix un servei professional de màxima categoria a Mallorca. Collita manual de sal al Parc Natural des Trenc amb visites guiades. Amb atenció personalitzada, equip tècnic altament qualificat i compromís d'excel·lència per a clients a tota l'illa.",
    de: "Flor de Sal d bietet erstklassigen professionellen Service auf Mallorca. Traditionelle Salzgewinnung von Hand im Naturschutzgebiet Es Trenc mit Führungen. Mit persönlicher Betreuung, hochqualifiziertem Fachteam und verlässlicher Qualität für Kunden und Immobilien auf der gesamten Insel.",
  },
  schedule: {
    monday: {
      open: "09:00",
      close: "19:30",
    },
    tuesday: {
      open: "09:00",
      close: "19:30",
    },
    wednesday: {
      open: "09:00",
      close: "19:30",
    },
    thursday: {
      open: "09:00",
      close: "19:30",
    },
    friday: {
      open: "09:00",
      close: "19:30",
    },
    saturday: {
      open: "10:00",
      close: "14:00",
    },
    sunday: {
      open: "closed",
      close: "closed",
    },
  },
  pricing: {
    startingPrice: "Visita guiada desde 10€",
    rateType: "fixed",
    notes: {
      es: "Visitas guiadas de 45 minutos por las balsas cristalizadoras.",
      en: "45-minute guided tours around the crystallization pans.",
      ca: "Visites guiades de 45 minuts per les salines.",
      de: "45-minütige Führungen durch die Salzbecken.",
    },
  },
  faqs: [
    {
      question: {
        es: "¿Se pueden avistar aves flamencos en las salinas?",
        en: "Can flamingos be seen at the salt flats?",
        ca: "Es poden veure flamencs a les salines?",
        de: "Können Flamingos in den Salinen beobachtet werden?",
      },
      answer: {
        es: "Sí, es un humedal protegido donde habitan flamencos durante gran parte del año.",
        en: "Yes, it is a protected wetland hosting flamingos throughout much of the year.",
        ca: "Sí, és una zona humida protegida amb presència de flamencs.",
        de: "Ja, das Feuchtgebiet bietet Lebensraum für zahlreiche Flamingos.",
      },
    },
  ],
};
