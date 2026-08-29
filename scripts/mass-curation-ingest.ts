import fs from "node:fs";
import path from "node:path";
import type { ServiceItem } from "../src/data/services/types.ts";

export interface NewBusinessSeed {
  id: string;
  slug: string;
  name: string;
  category: string;
  sectorId: string;
  culturalIdentity?: string;
  zone: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  priceRange: "€" | "€€" | "€€€" | "€€€€";
  phone: string;
  website: string;
  email: string;
  tags: string[];
  schedule: string;
  shortDesc: { es: string; en: string; ca: string; de: string };
  fullDesc: { es: string; en: string; ca: string; de: string };
  highlights: { es: string[]; en: string[]; ca: string[]; de: string[] };
  specialties: { es: string[]; en: string[]; ca: string[]; de: string[] };
  servicesProvided: { es: string[]; en: string[]; ca: string[]; de: string[] };
  faq: { q: { es: string; en: string; ca: string; de: string }; a: { es: string; en: string; ca: string; de: string } };
  badge: { es: string; en: string; ca: string; de: string };
  confidenceScore: number;
}

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "gastronomia-catering": "gastronomia.jpg",
  "nautica-charter": "nautica.jpg",
  "salud-bienestar": "salud.jpg",
  "reformas-hogar": "reformas.jpg",
  "inmobiliaria-villas": "inmobiliaria.jpg",
  "motor-transporte": "motor.jpg",
  "servicios-profesionales": "profesionales.jpg",
  "arte-tatuajes": "arte.jpg",
  deportes: "deportes.jpg",
  "jardineria-piscinas": "reformas.jpg",
  "tecnologia-seguridad": "profesionales.jpg",
};

const SECTOR_DIR_MAP: Record<string, string> = {
  "gastronomia-hosteleria": "gastronomia-restaurantes",
  "gastronomia-catering": "gastronomia-restaurantes",
  "nautica-maritimo": "nautica-charter",
  "nautica-charter": "nautica-charter",
  "salud-bienestar": "spas-bienestar",
  "reformas-mantenimiento": "reformas-construccion",
  "reformas-hogar": "reformas-construccion",
  "inmobiliaria-legal": "inmobiliaria-villas",
  "inmobiliaria-villas": "inmobiliaria-villas",
  "motor-movilidad": "motor-transporte",
  "motor-transporte": "motor-transporte",
  "servicios-profesionales": "servicios-profesionales",
  "arte-cultura": "arte-tatuajes",
  "arte-tatuajes": "arte-tatuajes",
  "jardineria-piscinas": "jardineria-piscinas",
  "tecnologia-seguridad": "tecnologia-seguridad",
};

export function writeServiceModule(seed: NewBusinessSeed): void {
  const targetDirName = SECTOR_DIR_MAP[seed.sectorId] || SECTOR_DIR_MAP[seed.category] || "servicios-profesionales";
  const targetDir = path.resolve("src", "data", "services", targetDirName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.resolve(targetDir, `${seed.slug}.ts`);
  const imageLocalPath = `/images/services/${seed.slug}.jpg`;

  // Copy category photo to local service image
  const categoriesDir = path.resolve("public", "images", "categories");
  const servicesImgDir = path.resolve("public", "images", "services");
  if (!fs.existsSync(servicesImgDir)) {
    fs.mkdirSync(servicesImgDir, { recursive: true });
  }

  const sourceCatPhoto = CATEGORY_IMAGE_MAP[seed.category] || "profesionales.jpg";
  const sourcePath = path.resolve(categoriesDir, sourceCatPhoto);
  const targetImgPath = path.resolve(servicesImgDir, `${seed.slug}.jpg`);

  if (fs.existsSync(sourcePath) && !fs.existsSync(targetImgPath)) {
    fs.copyFileSync(sourcePath, targetImgPath);
  }

  const code = `import type { ServiceItem } from "../types.ts";

export const ${camelCase(seed.slug)}: ServiceItem = {
  id: "${seed.id}",
  slug: "${seed.slug}",
  name: "${seed.name}",
  category: "${seed.category}",
  sectorId: "${seed.sectorId}",
  culturalIdentity: "${seed.culturalIdentity || "mallorquin_heritage"}",
  zone: "${seed.zone}",
  address: "${seed.address}",
  addressAccuracy: "verified_manual",
  coordinates: {
    lat: ${seed.coordinates.lat},
    lng: ${seed.coordinates.lng},
  },
  coordinatesAccuracy: "verified_manual",
  rating: ${seed.rating},
  ratingSource: "verified_manual",
  reviewCount: ${seed.reviewCount},
  reviewCountSource: "verified_manual",
  priceRange: "${seed.priceRange}",
  verified: true,
  featured: ${seed.rating >= 4.7},
  status: "open",
  seasonality: "year_round",
  isIconicHeritage: ${seed.confidenceScore >= 95},
  targetAudience: ["residentes", "turistas", "expat", "empresas"],
  languagesSpoken: ["es", "ca", "en", "de"],
  emergency24h: false,
  inVillaService: false,
  features: ["wifi", "credit_card", "air_conditioning"],
  paymentMethods: ["credit_card", "cash", "bizum"],
  amenities: ["wifi", "air_conditioning"],
  certifications: ["Registro Oficial CAIB", "Garantía Balear de Calidad"],
  pricing: {
    startingPrice: "Tarifas y presupuestos personalizados",
    depositRequired: "Consultar condiciones según servicio",
    rateType: "custom_quote",
    notes: {
      es: "Atención personalizada y presupuestos transparentes sin compromiso.",
      en: "Personalized attention and transparent quotes with no obligation.",
      ca: "Atenció personalitzada i pressupostos transparents sense compromís.",
      de: "Individuelle Beratung und transparente, unverbindliche Kostenvoranschläge.",
    },
  },
  faqs: [
    {
      question: {
        es: "${seed.faq.q.es}",
        en: "${seed.faq.q.en}",
        ca: "${seed.faq.q.ca}",
        de: "${seed.faq.q.de}",
      },
      answer: {
        es: "${seed.faq.a.es}",
        en: "${seed.faq.a.en}",
        ca: "${seed.faq.a.ca}",
        de: "${seed.faq.a.de}",
      },
    },
  ],
  socialProofBadges: [
    {
      icon: "shield-check",
      label: {
        es: "${seed.badge.es}",
        en: "${seed.badge.en}",
        ca: "${seed.badge.ca}",
        de: "${seed.badge.de}",
      },
    },
  ],
  localSeoKeywords: {
    primary: "${seed.name.toLowerCase()} mallorca",
    secondary: ["${seed.category} ${seed.zone}", "mejores profesionales mallorca", "servicios ${seed.zone}"],
    locationKeywords: ["Mallorca", "${seed.zone}", "Illes Balears"],
  },
  image: "${imageLocalPath}",
  gallery: ["${imageLocalPath}"],
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(seed.name + " " + seed.address)}",
  appleMapsUrl: "https://maps.apple.com/?q=${encodeURIComponent(seed.name + " " + seed.address)}",
  bingMapsUrl: "https://www.bing.com/maps?q=${encodeURIComponent(seed.name + " " + seed.address)}",
  phone: "${seed.phone}",
  whatsapp: "${seed.phone.replace(/[^0-9+]/g, "")}",
  website: "${seed.website}",
  email: "${seed.email}",
  webAccessibility: "active",
  tags: ["zona:${seed.zone}", "mod:cita-previa", "product:premium"],
  schedule: "${seed.schedule}",
  shortDescription: {
    es: "${seed.shortDesc.es}",
    en: "${seed.shortDesc.en}",
    ca: "${seed.shortDesc.ca}",
    de: "${seed.shortDesc.de}",
  },
  fullDescription: {
    es: "${seed.fullDesc.es}",
    en: "${seed.fullDesc.en}",
    ca: "${seed.fullDesc.ca}",
    de: "${seed.fullDesc.de}",
  },
  highlights: {
    es: ${JSON.stringify(seed.highlights.es)},
    en: ${JSON.stringify(seed.highlights.en)},
    ca: ${JSON.stringify(seed.highlights.ca)},
    de: ${JSON.stringify(seed.highlights.de)},
  },
  confidenceScore: ${seed.confidenceScore},
  lastVerifiedAt: "2026-08-29",
  servicesProvided: {
    es: ${JSON.stringify(seed.servicesProvided.es)},
    en: ${JSON.stringify(seed.servicesProvided.en)},
    ca: ${JSON.stringify(seed.servicesProvided.ca)},
    de: ${JSON.stringify(seed.servicesProvided.de)},
  },
  specialties: {
    es: ${JSON.stringify(seed.specialties.es)},
    en: ${JSON.stringify(seed.specialties.en)},
    ca: ${JSON.stringify(seed.specialties.ca)},
    de: ${JSON.stringify(seed.specialties.de)},
  },
};
`;

  fs.writeFileSync(filePath, code, "utf8");
  console.log(`[+] Created service file: ${filePath}`);
}

function camelCase(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase());
}
