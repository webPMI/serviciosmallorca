/**
 * honorBoardEngine.ts
 *
 * Motor del Cuadro de Honor y Subastas de Reconocimiento Comunitario.
 * Gestiona listas de honor dinámicas, cálculo de pujas incrementales por puesto (1€ base + 1€ incremental),
 * y validación estricta de aptitud de negocio (Zero Fake Data: solo negocios verificados con score >= 80%).
 */

import type { ServiceItem } from "../data/services";
import { createDisplacementAlert, type DisplacementAlert } from "./displacementNotificationEngine.ts";

export type HonorCategory =
  | "elite-general"
  | "maestros-instalaciones"
  | "artesanos-sabor"
  | "excelencia-nautica"
  | "bienestar-salud"
  | "emprendimientos-emergentes";

export interface HonorBackerInfo {
  backerUid?: string;
  backerName: string;
  amountEuros: number;
  message?: string;
  backedAt: string;
}

export interface HonorSpotEntry {
  id: string;
  position: number; // 1, 2, 3...
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  category: string;
  zone: string;
  honorTitle: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  currentBidEuros: number; // Precio alcanzado o acumulado comunitario
  sponsorName: string; // Nombre del usuario o colectivo ("Comunidad de Mallorca")
  sponsorMessage?: string; // Motivo o dedicatoria
  nominatedAt: string; // ISO Date
  confidenceScore: number;
  isVerified: boolean;
  avatarImage?: string;
  isCommunityCrowdfunded?: boolean;
  communityBackersCount?: number;
  backersList?: HonorBackerInfo[];
}

export interface HonorListDefinition {
  id: HonorCategory;
  icon: string;
  title: { es: string; en: string; ca: string; de: string };
  subtitle: { es: string; en: string; ca: string; de: string };
  categoryFilter?: string[];
  basePriceEuros: number;
  bidIncrementEuros: number;
}

export const HONOR_LISTS: HonorListDefinition[] = [
  {
    id: "elite-general",
    icon: "🏆",
    title: {
      es: "Élite Balear: Referentes de Confianza",
      en: "Balearic Elite: Trusted Benchmarks",
      ca: "Èlit Balear: Referents de Confiança",
      de: "Balearen-Elite: Vertrauenswürdige Referenzen",
    },
    subtitle: {
      es: "Los servicios más aclamados y respaldados por la comunidad de Mallorca.",
      en: "The most acclaimed and community-backed services across Mallorca.",
      ca: "Els serveis més aclamats i recolzats per la comunitat de Mallorca.",
      de: "Die am meisten geschätzten und von der Community unterstützten Dienstleister Mallorcas.",
    },
    basePriceEuros: 1.0,
    bidIncrementEuros: 1.0,
  },
  {
    id: "maestros-instalaciones",
    icon: "⚡",
    title: {
      es: "Maestros del Gremio & Instalaciones",
      en: "Guild Masters & Technical Installations",
      ca: "Mestres del Gremi & Instal·lacions",
      de: "Handwerksmeister & Technische Installationen",
    },
    subtitle: {
      es: "Profesionales de fontanería, electricidad y reformas con compromiso de excelencia.",
      en: "Plumbing, electrical and renovation experts with proven craftsmanship.",
      ca: "Professionals de lampisteria, electricitat i reformes d'alta solvència.",
      de: "Fachbetriebe für Sanitär, Elektrik und Renovierung mit höchster Zuverlässigkeit.",
    },
    categoryFilter: ["reformas-construccion", "servicios-profesionales"],
    basePriceEuros: 1.0,
    bidIncrementEuros: 1.0,
  },
  {
    id: "artesanos-sabor",
    icon: "🍷",
    title: {
      es: "Artesanos del Sabor & Producto Local",
      en: "Artisans of Taste & Km0 Produce",
      ca: "Artesans del Sabor & Producte Local",
      de: "Handwerker des Geschmacks & Lokale Produkte",
    },
    subtitle: {
      es: "Bodegas históricas, hornos tradicionales y gastronomía de identidad mallorquina.",
      en: "Historic wineries, traditional bakeries and authentic Mallorcan gastronomy.",
      ca: "Bodegues històriques, forns tradicionals i gastronomia d'arrel mallorquina.",
      de: "Historische Bodegas, traditionelle Bäckereien und mallorquinische Gastronomie.",
    },
    categoryFilter: ["gastronomia-restaurantes"],
    basePriceEuros: 1.0,
    bidIncrementEuros: 1.0,
  },
  {
    id: "excelencia-nautica",
    icon: "⚓",
    title: {
      es: "Excelencia Náutica & Chárter",
      en: "Nautical Excellence & Yacht Charter",
      ca: "Excel·lència Nàutica & Xàrter",
      de: "Nautische Exzellenz & Yacht-Charter",
    },
    subtitle: {
      es: "Marinas de primer nivel, chárter y clubes de navegación de la costa balear.",
      en: "Top marinas, yacht charters and sailing clubs of the Balearic coast.",
      ca: "Marines de primer nivell, xàrter i clubs de navegació de la costa balear.",
      de: "Erstklassige Marinas, Charterflotten und Segelclubs an Mallorcas Küste.",
    },
    categoryFilter: ["nautica-charter"],
    basePriceEuros: 1.0,
    bidIncrementEuros: 1.0,
  },
  {
    id: "bienestar-salud",
    icon: "🌿",
    title: {
      es: "Santuarios de Bienestar & Salud",
      en: "Wellness Sanctuaries & Healthy Living",
      ca: "Santuaris de Benestar & Salut",
      de: "Wellness-Oasen & Gesunder Lebensstil",
    },
    subtitle: {
      es: "Spas, centros deportivos y espacios dedicados al cuidado integral.",
      en: "Spas, premium fitness centers and integrated wellness retreats.",
      ca: "Spas, centres esportius i espais dedicats a la salut integral.",
      de: "Spas, Premium-Fitnessclubs und ganzheitliche Erholungszentren.",
    },
    categoryFilter: ["spas-bienestar"],
    basePriceEuros: 1.0,
    bidIncrementEuros: 1.0,
  },
  {
    id: "emprendimientos-emergentes",
    icon: "🚀",
    title: {
      es: "Emprendimientos Emergentes de Mallorca",
      en: "Emerging Mallorcan Ventures",
      ca: "Emprenedories Emergents de Mallorca",
      de: "Aufstrebende Startups & Neugründungen",
    },
    subtitle: {
      es: "Nuevas iniciativas y negocios jóvenes que impulsan el desarrollo sostenible de la isla.",
      en: "Fresh initiatives and young businesses driving sustainable local growth.",
      ca: "Noves iniciatives i negocis joves que impulsen el desenvolupament sostenible.",
      de: "Neue Projekte und junge Unternehmen für nachhaltigen Fortschritt auf Mallorca.",
    },
    basePriceEuros: 1.0,
    bidIncrementEuros: 1.0,
  },
];

/**
 * Calcula el precio necesario para superar el puesto actual.
 * Base 1€ si está vacío; si ya existe un récord, requiere +1€ (o incremento configurado).
 */
export function calculateNextBidPrice(currentTopBid: number, increment: number = 1.0): number {
  if (currentTopBid <= 0) return 1.0;
  return Number((currentTopBid + increment).toFixed(2));
}

/**
 * Filtro Ético & Zero Fake Data:
 * Solo negocios reales, abiertos y con confidenceScore >= 80% pueden participar en el Cuadro de Honor.
 */
export function isEligibleForHonorSpot(service: ServiceItem): { eligible: boolean; reason?: string } {
  if (!service) {
    return { eligible: false, reason: "El servicio no existe o no fue encontrado." };
  }

  if (service.status === "permanently_closed" || service.status === "incomplete_admin_only") {
    return { eligible: false, reason: "No se pueden nominar servicios inactivos o no disponibles." };
  }

  const score = service.confidenceScore ?? (service.verified ? 90 : 50);
  if (score < 80) {
    return {
      eligible: false,
      reason: `El negocio cuenta con un índice de confianza del ${score}%, inferior al umbral ético mínimo requerido (80%).`,
    };
  }

  return { eligible: true };
}

/**
 * Ordena y asigna posiciones a las candidaturas del Cuadro de Honor.
 */
export function rankHonorList(entries: HonorSpotEntry[]): HonorSpotEntry[] {
  const sorted = [...entries].sort((a, b) => {
    if (b.currentBidEuros !== a.currentBidEuros) {
      return b.currentBidEuros - a.currentBidEuros; // Mayor puja primero
    }
    // A empate, el más antiguo mantiene la preferencia
    return new Date(a.nominatedAt).getTime() - new Date(b.nominatedAt).getTime();
  });

  return sorted.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
}

/**
 * Devuelve el catálogo inicial de puestos de honor comunitarios con negocios verificados de Mallorca.
 */
export function getDefaultHonorSpots(): Record<HonorCategory, HonorSpotEntry[]> {
  return {
    "elite-general": [
      {
        id: "h-elite-1",
        position: 1,
        serviceId: "puerto-portals-marina",
        serviceName: "Puerto Portals Marina",
        serviceSlug: "puerto-portals-marina",
        category: "nautica-charter",
        zone: "calvia",
        honorTitle: {
          es: "Referente Internacional de Excelencia Balear",
          en: "International Benchmark of Balearic Excellence",
          ca: "Referent Internacional d'Excel·lència Balear",
          de: "Internationaler Maßstab für Balearen-Exzellenz",
        },
        currentBidEuros: 12.0,
        sponsorName: "Comunidad Náutica Balear",
        sponsorMessage: "Más de 35 años proyectando el prestigio y la sostenibilidad del litoral mallorquín.",
        nominatedAt: "2026-08-01T10:00:00Z",
        confidenceScore: 100,
        isVerified: true,
        avatarImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "h-elite-2",
        position: 2,
        serviceId: "bodegas-macia-batle",
        serviceName: "Bodegas Macià Batle",
        serviceSlug: "bodegas-macia-batle",
        category: "gastronomia-restaurantes",
        zone: "santa-maria-del-cami",
        honorTitle: {
          es: "Guardián de la Tradición Vinícola Mallorquina",
          en: "Guardian of Mallorcan Winemaking Heritage",
          ca: "Guardià de la Tradició Vinícola Mallorquina",
          de: "Hüter der mallorquinischen Weinbautradition",
        },
        currentBidEuros: 9.0,
        sponsorName: "Amigos del Vino de Binissalem",
        sponsorMessage: "Pasión artesanal y arraigo a la tierra desde 1851.",
        nominatedAt: "2026-08-05T12:00:00Z",
        confidenceScore: 98,
        isVerified: true,
        avatarImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
      },
    ],
    "maestros-instalaciones": [],
    "artesanos-sabor": [
      {
        id: "h-sabor-1",
        position: 1,
        serviceId: "forn-sant-francesc-inca",
        serviceName: "Forn Sant Francesc Inca",
        serviceSlug: "forn-sant-francesc-inca",
        category: "gastronomia-restaurantes",
        zone: "inca",
        honorTitle: {
          es: "Maestro Pastelero y Ensaimada de Autor",
          en: "Master Pastry & Signature Ensaimada",
          ca: "Mestre Pastisser i Ensaïmada d'Autor",
          de: "Meister-Konditorei & Ensaimada-Kunst",
        },
        currentBidEuros: 8.0,
        sponsorName: "Vecinos del Raiguer",
        sponsorMessage: "Premio a la mejor ensaimada del mundo y amor por el producto tradicional.",
        nominatedAt: "2026-08-10T09:30:00Z",
        confidenceScore: 100,
        isVerified: true,
        avatarImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      },
    ],
    "excelencia-nautica": [
      {
        id: "h-nautica-1",
        position: 1,
        serviceId: "rib-club-mallorca",
        serviceName: "Rib Club Mallorca",
        serviceSlug: "rib-club-mallorca",
        category: "nautica-charter",
        zone: "palma",
        honorTitle: {
          es: "Innovación en Navegación y Club Náutico Flexible",
          en: "Innovation in Flexible Yachting & Boat Club",
          ca: "Innovació en Navegació i Club Nàutic Flexible",
          de: "Innovation im flexiblen Bootssport",
        },
        currentBidEuros: 6.0,
        sponsorName: "Socios Navegantes Palma",
        sponsorMessage: "Accesibilidad al mar con flota moderna y atención premium.",
        nominatedAt: "2026-08-12T15:00:00Z",
        confidenceScore: 95,
        isVerified: true,
        avatarImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80",
      },
    ],
    "bienestar-salud": [
      {
        id: "h-bienestar-1",
        position: 1,
        serviceId: "palma-sport-tennis-club",
        serviceName: "Palma Sport & Tennis Club",
        serviceSlug: "palma-sport-tennis-club",
        category: "spas-bienestar",
        zone: "palma",
        honorTitle: {
          es: "Emblema del Deporte y la Salud en Santa Catalina",
          en: "Emblem of Sport & Health in Santa Catalina",
          ca: "Emblema de l'Esport i la Salut a Santa Catalina",
          de: "Emblem für Sport und Gesundheit in Santa Catalina",
        },
        currentBidEuros: 7.0,
        sponsorName: "Comunidad de Vida Saludable",
        sponsorMessage: "Instalaciones históricas convertidas en templo del bienestar moderno.",
        nominatedAt: "2026-08-15T08:00:00Z",
        confidenceScore: 98,
        isVerified: true,
        avatarImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      },
    ],
    "emprendimientos-emergentes": [],
  };
}

export type HonorTier = "DIAMOND" | "GOLD" | "SILVER" | "BRONZE" | "HONOR_SCROLL";

/**
 * Devuelve la insignia o medalla según la posición en la cola de honor.
 */
export function getHonorTier(position: number): HonorTier {
  if (position === 1) return "DIAMOND";
  if (position === 2) return "GOLD";
  if (position === 3) return "SILVER";
  if (position === 4) return "BRONZE";
  return "HONOR_SCROLL";
}

export interface HonorInvoice {
  bidAmountEuros: number;
  subtotalEuros: number;
  taxRatePercent: number; // 21%
  taxAmountEuros: number;
  currency: "EUR";
  invoiceNumber: string;
  issuedAt: string;
}

/**
 * Calcula el desglose fiscal e IVA (21% balear/español) para la facturación instantánea.
 */
export function calculateHonorInvoice(bidAmountEuros: number, taxRate: number = 0.21): HonorInvoice {
  const safeBid = Math.max(0, Number(bidAmountEuros) || 0);
  const subtotal = Number((safeBid / (1 + taxRate)).toFixed(2));
  const tax = Number((safeBid - subtotal).toFixed(2));

  return {
    bidAmountEuros: safeBid,
    subtotalEuros: subtotal,
    taxRatePercent: Math.round(taxRate * 100),
    taxAmountEuros: tax,
    currency: "EUR",
    invoiceNumber: `INV-HONOR-${Date.now().toString(36).toUpperCase()}`,
    issuedAt: new Date().toISOString(),
  };
}

export interface HonorBidSubmission {
  serviceId: string;
  sponsorName: string;
  sponsorMessage?: string;
  bidAmountEuros: number;
  honorTitle?: {
    es?: string;
    en?: string;
    ca?: string;
    de?: string;
  };
  nominatedAt?: string;
}

export interface ProcessBidResult {
  success: boolean;
  error?: string;
  newPosition?: number;
  tier?: HonorTier;
  updatedList: HonorSpotEntry[];
  displacedCount: number;
  displacementAlert?: DisplacementAlert;
}

/**
 * Procesa una nueva puja en la cola de honor ejecutando el desplazamiento en cadena (+1€ Infinito).
 */
export function processHonorBid(
  currentList: HonorSpotEntry[],
  submission: HonorBidSubmission,
  listCategory: HonorCategory,
  service: ServiceItem,
): ProcessBidResult {
  // 1. Validar elegibilidad del negocio (Zero Fake Data & GR-11)
  const eligibility = isEligibleForHonorSpot(service);
  if (!eligibility.eligible) {
    return {
      success: false,
      error: eligibility.reason || "El negocio no es apto para el Cuadro de Honor.",
      updatedList: currentList,
      displacedCount: 0,
    };
  }

  // 2. Validar aislamiento de categoría gremial
  const listDef = HONOR_LISTS.find((l) => l.id === listCategory);
  if (!listDef) {
    return {
      success: false,
      error: `La categoría de honor "${listCategory}" no existe.`,
      updatedList: currentList,
      displacedCount: 0,
    };
  }

  if (listDef.categoryFilter && listDef.categoryFilter.length > 0) {
    if (!listDef.categoryFilter.includes(service.category)) {
      return {
        success: false,
        error: `El negocio pertenece a la categoría "${service.category}", incompatible con la lista gremial "${listDef.title.es}".`,
        updatedList: currentList,
        displacedCount: 0,
      };
    }
  }

  // 3. Validar importe de puja requerido (+1€ sobre el líder actual)
  const sortedList = rankHonorList(currentList);
  const currentTopBid = sortedList.length > 0 ? sortedList[0].currentBidEuros : 0;
  const requiredMinBid = calculateNextBidPrice(currentTopBid, listDef.bidIncrementEuros);
  const safeBid = Number(submission.bidAmountEuros);

  if (isNaN(safeBid) || !isFinite(safeBid) || safeBid < requiredMinBid) {
    return {
      success: false,
      error: `La puja de ${submission.bidAmountEuros}€ es insuficiente o inválida. Se requiere un mínimo de ${requiredMinBid}€ (+${listDef.bidIncrementEuros}€ sobre el récord actual de ${currentTopBid}€).`,
      updatedList: sortedList,
      displacedCount: 0,
    };
  }

  // 4. Validar unicidad estricta de importe (No-Colisión en Cuadro de Honor)
  const normalizedSafeBid = Number(safeBid.toFixed(2));
  const collision = sortedList.find(
    (spot) => Math.abs(spot.currentBidEuros - normalizedSafeBid) < 0.009 && spot.serviceId !== service.id,
  );
  if (collision) {
    return {
      success: false,
      error: `Ya existe un comercio con exactamente ${normalizedSafeBid}€ (${collision.serviceName}). En el Cuadro de Honor cada importe debe ser único; aporta al menos +${listDef.bidIncrementEuros}€ para superarlo.`,
      updatedList: sortedList,
      displacedCount: 0,
    };
  }

  // 5. Crear nueva entrada de honor y desplazar la cola
  const newEntry: HonorSpotEntry = {
    id: `spot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    position: 1,
    serviceId: service.id,
    serviceName: service.name,
    serviceSlug: service.slug,
    category: service.category,
    zone: service.zone,
    honorTitle: {
      es: submission.honorTitle?.es || `Referente Destacado: ${service.name}`,
      en: submission.honorTitle?.en || `Top Benchmark: ${service.name}`,
      ca: submission.honorTitle?.ca || `Referent Destacat: ${service.name}`,
      de: submission.honorTitle?.de || `Hervorragende Referenz: ${service.name}`,
    },
    currentBidEuros: Number(safeBid.toFixed(2)),
    sponsorName: submission.sponsorName.trim(),
    sponsorMessage: submission.sponsorMessage?.trim(),
    nominatedAt: submission.nominatedAt || new Date().toISOString(),
    confidenceScore: service.confidenceScore ?? (service.verified ? 90 : 50),
    isVerified: Boolean(service.verified),
    avatarImage: service.image,
  };

  const updatedList = rankHonorList([newEntry, ...sortedList]);
  const newPosition = updatedList.findIndex((e) => e.id === newEntry.id) + 1;
  const displacedCount = sortedList.length;

  // 6. Generar alerta de desplazamiento para el líder anterior si es superado
  let displacementAlert = undefined;
  if (sortedList.length > 0 && sortedList[0].serviceId !== service.id) {
    const previousLeader = sortedList[0];
    displacementAlert = createDisplacementAlert({
      category: listCategory,
      categoryTitle: listDef.title.es,
      displacedServiceId: previousLeader.serviceId,
      displacedServiceName: previousLeader.serviceName,
      newLeaderServiceId: service.id,
      newLeaderServiceName: service.name,
      newLeaderBidEuros: Number(safeBid.toFixed(2)),
    });
  }

  return {
    success: true,
    newPosition,
    tier: getHonorTier(newPosition),
    updatedList,
    displacedCount,
    displacementAlert,
  };
}

export interface CommunityBoostSubmission {
  serviceId: string;
  backerUid?: string;
  backerName: string;
  amountEuros: number;
  message?: string;
  nominatedAt?: string;
}

export interface CommunityBoostResult {
  success: boolean;
  error?: string;
  newPosition?: number;
  tier?: HonorTier;
  updatedList: HonorSpotEntry[];
  totalCumulativeEuros: number;
  backersCount: number;
  isNewLeader: boolean;
}

/**
 * Procesa un impulso comunitario popular (Crowdfunded Boost Acumulativo).
 * Múltiples vecinos pueden sumar micro-aportaciones (>= 1.00€) que se acumulan
 * en una bolsa colectiva para competir por el podio de honor.
 */
export function processCommunityBoost(
  currentList: HonorSpotEntry[],
  submission: CommunityBoostSubmission,
  listCategory: HonorCategory,
  service: ServiceItem,
): CommunityBoostResult {
  // 1. Validar elegibilidad del negocio (Zero Fake Data & GR-11)
  const eligibility = isEligibleForHonorSpot(service);
  if (!eligibility.eligible) {
    return {
      success: false,
      error: eligibility.reason || "El negocio no es apto para el Cuadro de Honor.",
      updatedList: currentList,
      totalCumulativeEuros: 0,
      backersCount: 0,
      isNewLeader: false,
    };
  }

  // 2. Validar aislamiento de categoría gremial
  const listDef = HONOR_LISTS.find((l) => l.id === listCategory);
  if (!listDef) {
    return {
      success: false,
      error: `La categoría de honor "${listCategory}" no existe.`,
      updatedList: currentList,
      totalCumulativeEuros: 0,
      backersCount: 0,
      isNewLeader: false,
    };
  }

  if (listDef.categoryFilter && listDef.categoryFilter.length > 0) {
    if (!listDef.categoryFilter.includes(service.category)) {
      return {
        success: false,
        error: `El negocio pertenece a "${service.category}", incompatible con la lista gremial "${listDef.title.es}".`,
        updatedList: currentList,
        totalCumulativeEuros: 0,
        backersCount: 0,
        isNewLeader: false,
      };
    }
  }

  // 3. Validar importe mínimo de aportación (mínimo 1.00€)
  const safeAmount = Number(submission.amountEuros);
  if (isNaN(safeAmount) || !isFinite(safeAmount) || safeAmount < 1.0) {
    return {
      success: false,
      error: `La aportación comunitaria mínima es de 1.00€.`,
      updatedList: currentList,
      totalCumulativeEuros: 0,
      backersCount: 0,
      isNewLeader: false,
    };
  }

  const sortedList = rankHonorList(currentList);
  const existingEntryIndex = sortedList.findIndex((e) => e.serviceId === service.id);

  const backerRecord: HonorBackerInfo = {
    backerUid: submission.backerUid,
    backerName: submission.backerName.trim() || "Vecino de Mallorca",
    amountEuros: Number(safeAmount.toFixed(2)),
    message: submission.message?.trim(),
    backedAt: submission.nominatedAt || new Date().toISOString(),
  };

  let updatedList: HonorSpotEntry[];
  let totalCumulativeEuros = 0;
  let backersCount = 0;

  if (existingEntryIndex !== -1) {
    const existing = sortedList[existingEntryIndex];
    const previousBackers = existing.backersList || [];
    const newBackers = [backerRecord, ...previousBackers];
    backersCount = newBackers.length;
    totalCumulativeEuros = Number((existing.currentBidEuros + safeAmount).toFixed(2));

    const updatedEntry: HonorSpotEntry = {
      ...existing,
      currentBidEuros: totalCumulativeEuros,
      isCommunityCrowdfunded: true,
      communityBackersCount: backersCount,
      backersList: newBackers,
      sponsorName: `Comunidad de Mallorca (${backersCount} apoyos)`,
      sponsorMessage: submission.message || existing.sponsorMessage,
    };

    const remaining = sortedList.filter((_, idx) => idx !== existingEntryIndex);
    updatedList = rankHonorList([updatedEntry, ...remaining]);
  } else {
    totalCumulativeEuros = Number(safeAmount.toFixed(2));
    backersCount = 1;
    const newEntry: HonorSpotEntry = {
      id: `spot-comm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      position: 1,
      serviceId: service.id,
      serviceName: service.name,
      serviceSlug: service.slug,
      category: service.category,
      zone: service.zone,
      honorTitle: {
        es: `Favorito Popular: ${service.name}`,
        en: `Community Favorite: ${service.name}`,
        ca: `Favorit Popular: ${service.name}`,
        de: `Community-Favorit: ${service.name}`,
      },
      currentBidEuros: totalCumulativeEuros,
      sponsorName: `${submission.backerName.trim() || "Vecino de Mallorca"} (Impulso Popular)`,
      sponsorMessage: submission.message?.trim(),
      nominatedAt: submission.nominatedAt || new Date().toISOString(),
      confidenceScore: service.confidenceScore ?? (service.verified ? 90 : 50),
      isVerified: Boolean(service.verified),
      avatarImage: service.image,
      isCommunityCrowdfunded: true,
      communityBackersCount: 1,
      backersList: [backerRecord],
    };
    updatedList = rankHonorList([newEntry, ...sortedList]);
  }

  const newPosition = updatedList.findIndex((e) => e.serviceId === service.id) + 1;

  return {
    success: true,
    newPosition,
    tier: getHonorTier(newPosition),
    updatedList,
    totalCumulativeEuros,
    backersCount,
    isNewLeader: newPosition === 1,
  };
}
