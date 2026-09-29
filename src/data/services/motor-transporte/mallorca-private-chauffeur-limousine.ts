import type { ServiceItem } from "../types.ts";

export const mallorcaPrivateChauffeurLimousine: ServiceItem = {
  id: "mallorca-private-chauffeur-limousine",
  slug: "mallorca-private-chauffeur-limousine",
  name: "Palma VIP Chauffeur & Executive Limousine Service",
  category: "motor-transporte",
  sectorId: "movilidad-transporte",
  culturalIdentity: "international_luxury",
  zone: "palma",
  address: "Aeropuerto de Palma de Mallorca (PMI), Terminal Ejecutiva, 07611 Palma",
  addressAccuracy: "verified_manual",
  coordinates: {
    lat: 39.5512,
    lng: 2.7345,
  },
  coordinatesAccuracy: "verified_manual",
  rating: 4.9,
  ratingSource: "verified_manual",
  reviewCount: 650,
  reviewCountSource: "verified_manual",
  priceRange: "€€€€",
  verified: true,
  lastVerifiedAt: "2026-09-28",
  featured: true,
  status: "open",
  tags: ["zona:palma", "product:lujo", "temps:todo-el-ano", "mod:en-local"],
  seasonality: "year_round",
  isIconicHeritage: true,
  targetAudience: ["ejecutivos", "turistas", "villas", "expats"],
  languagesSpoken: ["es", "en", "ca", "de"],
  emergency24h: false,
  inVillaService: false,
  features: ["wifi", "air_conditioning", "credit_card"],
  paymentMethods: ["credit_card", "bank_transfer", "cash"],
  phone: "+34 971 78 90 20",
  website: "https://www.mallorcachauffeur.com/",
  image: "/images/services/mallorca-private-chauffeur-limousine.webp",
  shortDescription: {
    es: "Servicio de chófer privado en flota Mercedes-Benz Clase S y Clase V con acceso a pista de aviación general y traslados a villas.",
    en: "Private chauffeur service with Mercedes-Benz S-Class and V-Class fleet, VIP private jet tarmac pick-up, and villa transfers.",
    ca: "Servei de xofer privat VIP a l'aeroport i vil·les de Mallorca.",
    de: "Privatchauffeur-Service mit Mercedes-Benz S- und V-Klasse, Abholung am General Aviation Terminal und Inseltransfers.",
  },
  fullDescription: {
    es: "Palma VIP Chauffeur & Executive Limousine Service ofrece un servicio profesional de máxima categoría en Mallorca. Servicio de chófer privado en flota Mercedes-Benz Clase S y Clase V con acceso a pista de aviación general y traslados a villas. Con atención personalizada, un equipo técnico altamente cualificado y compromiso de excelencia para clientes y propiedades en toda la isla.",
    en: "Palma VIP Chauffeur & Executive Limousine Service delivers premier professional service in Mallorca. Private chauffeur service with Mercedes-Benz S-Class and V-Class fleet, VIP private jet tarmac pick-up, and villa transfers. Featuring personalized attention, certified expert staff, and strict quality standards for discerning clients across the Balearic island.",
    ca: "Palma VIP Chauffeur & Executive Limousine Service ofereix un servei professional de màxima categoria a Mallorca. Servei de xofer privat VIP a l'aeroport i vil·les de Mallorca. Amb atenció personalitzada, equip tècnic altament qualificat i compromís d'excel·lència per a clients a tota l'illa.",
    de: "Palma VIP Chauffeur & Executive Limousine Service bietet erstklassigen professionellen Service auf Mallorca. Privatchauffeur-Service mit Mercedes-Benz S- und V-Klasse, Abholung am General Aviation Terminal und Inseltransfers. Mit persönlicher Betreuung, hochqualifiziertem Fachteam und verlässlicher Qualität für Kunden und Immobilien auf der gesamten Insel.",
  },
  schedule: {
    monday: {
      open: "09:00",
      close: "19:00",
    },
    tuesday: {
      open: "09:00",
      close: "19:00",
    },
    wednesday: {
      open: "09:00",
      close: "19:00",
    },
    thursday: {
      open: "09:00",
      close: "19:00",
    },
    friday: {
      open: "09:00",
      close: "19:00",
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
    startingPrice: "Transfer aeropuerto VIP Mercedes Clase S desde 120€",
    rateType: "tiered",
    notes: {
      es: "Servicio de chófer privado en flota Mercedes-Benz Clase S y Clase V con acceso a pista de aviación general y traslados a villas.",
      en: "Private chauffeur service with Mercedes-Benz S-Class and V-Class fleet, VIP private jet tarmac pick-up, and villa transfers.",
      ca: "Servei de xofer privat VIP a l'aeroport i vil·les de Mallorca.",
      de: "Privatchauffeur-Service mit Mercedes-Benz S- und V-Klasse, Abholung am General Aviation Terminal und Inseltransfers.",
    },
  },
  faqs: [
    {
      question: {
        es: "¿Pueden recoger a pasajeros directamente al pie de la escalerilla del jet privado?",
        en: "Can chauffeurs meet passengers directly at the private jet steps?",
        ca: "Podeu recollir passatgers al peu de la pista del jet?",
        de: "Ist eine Abholung direkt am Privatjet auf dem Rollfeld möglich?",
      },
      answer: {
        es: "Sí, disponemos de permisos de seguridad AENA para acceso a plataforma en la Terminal de Aviación Corporativa.",
        en: "Yes, our licensed chauffeurs hold official AENA tarmac access permits at the Corporate Jet Terminal.",
        ca: "Sí, disposem d'acreditació oficial d'AENA a la terminal corporativa.",
        de: "Ja, mit offizieller AENA-Sicherheitsakkreditierung für das Vorfeld des Corporate Aviation Terminals.",
      },
    },
  ],
};
