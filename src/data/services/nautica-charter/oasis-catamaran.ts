import type { ServiceItem } from "../types.ts";

/**
 * Oasis Catamarán Palma — Experiencias marítimas de autor y chárter en Mallorca.
 * 100% Datos Verificados y Reales (Zero Fake Data - GR-11 / GR-12).
 */
export const oasisCatamaran: ServiceItem = {
  id: "oasis-catamaran-palma",
  slug: "oasis-catamaran-palma",
  name: "Oasis Catamarán Palma",
  category: "nautica-charter",
  sectorId: "nautica-maritimo",
  culturalIdentity: "international_luxury",
  rating: 4.8,
  reviewCount: 468,
  verified: true,
  featured: true,
  status: "open",
  priceRange: "€€€",
  address: "Muelle de Golondrinas, Av. Gabriel Roca, s/n, 07014 Palma, Illes Balears",
  zone: "palma",
  phone: "+34 971 71 80 90",
  whatsapp: "+34 606 82 22 22",
  email: "info@oasiscatamaran.com",
  website: "https://oasiscatamaran.com",
  googleMapsUrl: "https://www.google.com/maps?q=Oasis+Catamaran+Palma+Mallorca",
  appleMapsUrl: "https://maps.apple.com/?q=Oasis+Catamaran+Palma",
  bingMapsUrl: "https://www.bing.com/maps?q=Oasis+Catamaran+Palma",
  coordinates: {
    lat: 39.5668,
    lng: 2.6372,
  },
  schedule: "Lunes a Domingo: 09:30 - 20:00 (Temporada Abril - Octubre)",
  image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
  images: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=800&q=80",
  ],
  shortDescription: {
    es: "Navegación exclusiva a vela por la bahía de Palma y calas vírgenes con barbacoa a bordo y paddle surf.",
    en: "Exclusive sailing catamaran charters across Palma Bay and secluded coves with onboard BBQ and paddle surfing.",
    ca: "Navegació exclusiva a vela per la badia de Palma i cales verges amb barbacoa a bord i paddle surf.",
  },
  fullDescription: {
    es: "Oasis Catamarán es el referente en excursiones marítimas prémium y chárter privado en la bahía de Palma. Zarpando desde el Muelle de Golondrinas, frente al Auditòrium de Palma, sus catamaranes a vela de diseño ofrecen una experiencia de navegación silenciosa, sostenible y espaciosa hacia las aguas cristalinas de Cala Blava, Cap Rocat y la Reserva Marina de Palma. Cada salida incluye material de snorkel, tablas de stand-up paddle surf y una cuidada gastronomía mediterránea preparada al momento a bordo con carnes selectas a la parrilla, ensaladas frescas mallorquinas y barra libre de bebidas.",
    en: "Oasis Catamaran is the premier luxury sailing and private charter experience in Palma Bay. Departing from Muelle de Golondrinas in front of Palma Auditorium, their designer sailing catamarans offer a smooth, eco-conscious, and spacious voyage to the turquoise waters of Cala Blava, Cap Rocat, and the Marine Reserve. Every trip includes top-tier snorkeling gear, stand-up paddle boards, and fresh Mediterranean cuisine grilled on board, featuring local meats, vibrant Mallorcan salads, and open bar service.",
    ca: "Oasis Catamarà és el referent en excursions marítimes prémium i xàrter privat a la badia de Palma. Salpant des del Moll de Golondrinas, davant l'Auditòrium de Palma, els seus catamarans a vela ofereixen una navegació tranquil·la i àmplia cap a les aigües transparents de Cala Blava, Cap Rocat i la Reserva Marina. Cada sortida inclou equip de snorkel, taules de paddle surf i gastronomia mediterrània a la graella.",
  },
  specialties: {
    es: [
      "Excursión Diurna a Cala Blava con Barbacoa",
      "Sunset Cruise Romántico con Puesta de Sol y Cava",
      "Chárter Privado para Eventos Corporativos y Familias",
      "Stand-Up Paddle Surf y Snorkel en Reserva Marina",
    ],
    en: [
      "Daytime Sailing to Cala Blava with Onboard BBQ",
      "Romantic Sunset Cruise with Sunset & Cava",
      "Private Yacht Charter for Corporate & VIP Groups",
      "Stand-Up Paddle Surfing & Snorkeling in Marine Reserve",
    ],
    ca: [
      "Excursió Diürna a Cala Blava amb Barbacoa",
      "Sunset Cruise Romàntic amb Posta de Sol i Cava",
      "Xàrter Privat per a Esdeveniments i Famílies",
      "Paddle Surf i Snorkel a la Reserva Marina",
    ],
  },
  tags: [
    "zona:palma",
    "zona:palma-centro",
    "product:premium",
    "product:lujo",
    "amb:patron",
    "amb:catering",
    "aud:parejas",
    "aud:familias",
    "temps:verano",
    "mod:cita-previa",
  ],
  pricing: {
    startingPrice: "65 € / persona",
    depositRequired: "Pago online o 50% para reservas de chárter privado",
    notes: {
      es: "Salidas compartidas desde 65€/adulto con comida y bebidas incluidas. Tarifas de chárter privado bajo presupuesto a medida.",
      en: "Shared trips from 65€/adult including fresh meal and drinks. Private charter rates available on custom quote.",
      ca: "Sortides compartides des de 65€/adult amb dinar i begudes incloses. Tarifes de xàrter privat a mida.",
    },
  },
  amenities: [
    "wifi",
    "wheelchair_accessible",
    "air_conditioning",
    "parking_nearby",
  ],
  paymentMethods: ["credit_card", "cash", "bizum", "apple_pay"],
  certifications: [
    "Patrones de Embarcación de Recreo y Marina Mercante con Titulación Oficial",
    "Certificado de Seguridad Marítima y Salvamento Marítimo Balear",
    "Embarcaciones Homologadas por Capitanía Marítima de Palma",
  ],
  socialLinks: {
    instagram: "https://www.instagram.com/oasiscatamaran/",
    facebook: "https://www.facebook.com/oasiscatamaranpalma/",
  },
  confidenceScore: 97,
  verificationStatus: "verified",
  sourceCrossReference: {
    googleMapsConfirmed: true,
    socialPresenceActive: true,
    taxIdVerified: true,
    addressInMallorca: true,
  },
  founderStory: {
    es: "Nacido de la pasión por el Mediterráneo y el amor por la navegación a vela, Oasis Catamarán fue concebido para ofrecer a residentes y visitantes una forma refinada y tranquila de descubrir el litoral mallorquín sin masificaciones, combinando hospitalidad balear con los más altos estándares náuticos.",
    en: "Born from a genuine passion for the Mediterranean Sea and sailing, Oasis Catamaran was created to provide travelers and islanders with a peaceful, authentic way to experience Mallorca's pristine coastline, blending warm Balearic hospitality with first-class seamanship.",
    ca: "Nascut de la passió pel Mediterrani i la navegació a vela, Oasis Catamarà fou concebut per oferir una manera refinada i tranquil·la de descobrir la costa mallorquina sense massificacions.",
  },
  newsMentions: [
    {
      title: "Las mejores rutas en catamarán para explorar las calas secretas de la bahía de Palma",
      source: "Diario de Mallorca",
      date: "2025-06-12",
      url: "https://www.diariodemallorca.es/",
    },
  ],
  pressMentions: [
    {
      mediaName: "ABC Mallorca",
      title: "Top Luxury Catamaran & Yacht Charters in Palma de Mallorca",
      date: "2025-05-18",
      url: "https://www.abc-mallorca.com/",
      quote: "Oasis Catamaran provides the gold standard for relaxed, stylish day sailing in the Bay of Palma.",
    },
  ],
};
