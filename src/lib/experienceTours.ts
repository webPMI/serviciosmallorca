/**
 * src/lib/experienceTours.ts
 *
 * 🗺️ MOTOR DE TOURS DE EXPERIENCIA & RUTAS TEMÁTICAS DINÁMICAS — Servicios Mallorca
 *
 * Conecta negocios de alta autoridad y cercanía geográfica mediante el motor SmartMatch
 * para generar itinerarios interactivos y temáticos en toda la geografía de la isla.
 */

import { SERVICES } from "../data/services/index.ts";
import type { ServiceItem } from "../data/services/types.ts";
import { calculateHaversineDistance, formatDistance } from "./geoUtils.ts";
import { getSmartMatchCrossSell } from "./smartMatchEngine.ts";

export interface TourStop {
  stopNumber: number;
  service: ServiceItem;
  role: "experience_anchor" | "gastronomy" | "wellness_relax" | "nautical_transport" | "shopping_craft";
  recommendedDurationMinutes: number;
  travelDistanceToNextKm?: number;
  formattedDistanceToNext?: string;
  stepDescription: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
}

export interface ExperienceTour {
  id: string;
  slug: string;
  title: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  subtitle: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  zone: string;
  theme: "art_craft" | "nautical_luxury" | "gastronomy_wine" | "wellness_heritage";
  estimatedTotalHours: number;
  totalDistanceKm: number;
  stops: TourStop[];
  highlights: {
    es: string[];
    en: string[];
    ca: string[];
    de: string[];
  };
}

/**
 * Catálogo de Rutas Temáticas de Autor en Mallorca.
 */
export const SIGNATURE_TOURS: ExperienceTour[] = [
  {
    id: "tour-tramuntana-vidrio-arte",
    slug: "ruta-arte-vidrio-tradicion-tramuntana",
    title: {
      es: "Ruta del Vidrio Soplado, Tradición & Paisajes de la Tramuntana",
      en: "Hand-Blown Glass, Heritage & Tramuntana Mountain Route",
      ca: "Ruta del Vidre Bufat, Tradició i Paisatges de la Tramuntana",
      de: "Route der Glasbläserei, Tradition & Tramuntana-Landschaften",
    },
    subtitle: {
      es: "Un viaje sensorial desde los hornos de S'Esgleieta hasta los pueblos de piedra de Valldemossa y Deià.",
      en: "A sensory journey from the furnaces of S'Esgleieta to the stone villages of Valldemossa and Deià.",
      ca: "Un viatge sensorial des dels forns de S'Esgleieta fins als pobles de pedra de Valldemossa i Deià.",
      de: "Eine Entdeckungsreise von den Glasöfen in S'Esgleieta zu den Steindörfern Valldemossa und Deià.",
    },
    zone: "tramuntana",
    theme: "art_craft",
    estimatedTotalHours: 6.5,
    totalDistanceKm: 28.5,
    stops: [], // Se hidrata dinámicamente con los servicios reales
    highlights: {
      es: [
        "Demostración en vivo de maestros vidrieros en hornos tradicionales",
        "Paseo por las calles empedradas de Valldemossa y miradores de Deià",
        "Gastronomía de producto local y descanso con vistas a la montaña",
      ],
      en: [
        "Live master glassblowing demonstration at glowing traditional furnaces",
        "Stroll through the cobblestone streets of Valldemossa and Deià clifftops",
        "Local farm-to-table dining and relaxation with mountain vistas",
      ],
      ca: [
        "Demostració en viu de mestres vidriers a forns tradicionals",
        "Passejada pels carrers empedrats de Valldemossa i miradors de Deià",
        "Gastronomia de producte local i descans amb vistes a la muntanya",
      ],
      de: [
        "Live-Vorführung traditioneller Glasbläser an den Schmelzöfen",
        "Spaziergang durch die Gassen von Valldemossa und Aussichtspunkte in Deià",
        "Mallorquinische Kulinarik und Entspannung mit Bergblick",
      ],
    },
  },
  {
    id: "tour-calvia-nautica-lifestyle",
    slug: "ruta-nautica-marinas-calvia",
    title: {
      es: "Ruta Náutica & Vanguardia de la Costa de Calvià",
      en: "Nautical Elegance & Coastal Lifestyle Route in Calvià",
      ca: "Ruta Nàutica i Avantguarda de la Costa de Calvià",
      de: "Nautische Eleganz & Coastal Lifestyle Route in Calvià",
    },
    subtitle: {
      es: "De los superyates de Puerto Portals al diseño vanguardista de Port Adriano y calas de aguas turquesas.",
      en: "From the superyachts of Puerto Portals to the design of Port Adriano and turquoise coves.",
      ca: "Dels superiots de Puerto Portals al disseny d'avantguarda de Port Adriano i cales d'aigües turqueses.",
      de: "Von den Superyachten in Puerto Portals zum Design-Hafen Port Adriano und türkisblauen Buchten.",
    },
    zone: "calvia-andratx",
    theme: "nautical_luxury",
    estimatedTotalHours: 7.0,
    totalDistanceKm: 22.0,
    stops: [],
    highlights: {
      es: [
        "Recorrido por dos de las marinas más exclusivas del Mediterráneo",
        "Opciones de chárter náutico privado y deportes acuáticos",
        "Paseos marítimos con boutiques exclusivas y terrazas frente al mar",
      ],
      en: [
        "Exploration of two of the Mediterranean's most exclusive marinas",
        "Private yacht charter and premium watersport opportunities",
        "Waterfront boulevards with designer boutiques and sunset terraces",
      ],
      ca: [
        "Recorregut per dues de les marines més exclusives de la Mediterrània",
        "Opcions de xàrter nàutic privat i esports aquàtics",
        "Passejos marítims amb botigues d'autor i terrasses davant del mar",
      ],
      de: [
        "Besuch zweier der exklusivsten Yachthäfen des Mittelmeers",
        "Private Yachtcharter-Angebote und erstklassiger Wassersport",
        "Promenaden mit eleganten Boutiquen und Terrassen direkt am Wasser",
      ],
    },
  },
  {
    id: "tour-raiguer-vinos-artesania",
    slug: "ruta-vinos-artesania-raiguer-pla",
    title: {
      es: "Ruta del Vino DO Binissalem, Cerámica de Pòrtol & Celler Tradicional",
      en: "DO Binissalem Wine Route, Pòrtol Ceramics & Traditional Celler",
      ca: "Ruta del Vi DO Binissalem, Ceràmica de Pòrtol i Celler Tradicional",
      de: "DO Binissalem Weinroute, Pòrtol Keramik & Traditioneller Celler",
    },
    subtitle: {
      es: "Tradición vitivinícola, talleres alfareros de arcilla roja y gastronomía mallorquina en el corazón de la isla.",
      en: "Centenary winemaking tradition, red clay pottery workshops, and authentic Mallorcan gastronomy in the island's heartland.",
      ca: "Tradició vitivinícola, tallers terrissaires d'argila vermella i gastronomia mallorquina al cor de l'illa.",
      de: "Traditionsreiche Weinkultur, rote Tonkeramik-Werkstätten und authentische Inselküche im Herzen Mallorcas.",
    },
    zone: "raiguer-pla",
    theme: "gastronomy_wine",
    estimatedTotalHours: 5.5,
    totalDistanceKm: 34.0,
    stops: [],
    highlights: {
      es: [
        "Cata de vinos autóctonos (Manto Negro, Callet, Moll) en cellers centenarios",
        "Artesanía en vidrio y barro de tradición mallorquina",
        "Gastronomía de producto Km0 en pueblos de interior auténticos",
      ],
      en: [
        "Native wine tastings (Manto Negro, Callet, Moll) in historic cellers",
        "Authentic blown glass and clay pottery crafts",
        "Farm-to-table cuisine in picturesque inland villages",
      ],
      ca: [
        "Tast de vins autòctons (Manto Negro, Callet, Moll) a cellers històrics",
        "Artesania en vidre i fang de tradició mallorquina",
        "Gastronomia de producte Km0 a pobles d'interior autèntics",
      ],
      de: [
        "Verkostung einheimischer Rebsorten (Manto Negro, Callet, Moll) in historischen Kellereien",
        "Traditionelles mallorquinisches Glasbläser- und Töpferhandwerk",
        "Regionale Km0-Küche in authentischen Inseldörfern",
      ],
    },
  },
  {
    id: "tour-palma-cultura-gastronomia",
    slug: "ruta-cultura-museos-alta-gastronomia-palma",
    title: {
      es: "Ruta de Museos, Galerías de Vanguardia & Alta Cocina de Palma",
      en: "Palma Art Galleries, Contemporary Museums & Fine Dining Route",
      ca: "Ruta de Museus, Galeries d'Avantguarda i Alta Cuina de Palma",
      de: "Palma Kunstgalerien, Moderne Museen & Fine Dining Route",
    },
    subtitle: {
      es: "Un recorrido cultural por los grandes baluartes artísticos de Palma con paradas gastronómicas de autor.",
      en: "A cultural exploration of Palma's top artistic landmarks combined with author signature cuisine.",
      ca: "Un recorregut cultural pels grans baluards artístics de Palma amb parades gastronòmiques d'autor.",
      de: "Eine Kulturreise durch Palmas führende Kunstmuseen kombiniert mit exquisiten kulinarischen Highlights.",
    },
    zone: "palma",
    theme: "art_craft",
    estimatedTotalHours: 6.0,
    totalDistanceKm: 8.5,
    stops: [],
    highlights: {
      es: [
        "Arte contemporáneo con vistas a la bahía en Es Baluard y Fundación Miró",
        "Paseo por los patios señoriales del casco antiguo de Palma",
        "Experiencia culinaria Michelin y cocina de autor balear",
      ],
      en: [
        "Contemporary art overlooking the bay at Es Baluard and Fundació Miró",
        "Stroll through the historic palace courtyards of Palma's old town",
        "Michelin-recognized dining and Balearic author gastronomy",
      ],
      ca: [
        "Art contemporani amb vistes a la badia a Es Baluard i Fundació Miró",
        "Passejada pels patis senyorials del casc antic de Palma",
        "Experiència culinària d'autor i cuina balear d'avantguarda",
      ],
      de: [
        "Moderne Kunst mit Blick auf die Bucht im Es Baluard und der Fundació Miró",
        "Spaziergang durch die historischen Innenhöfe der Altstadt von Palma",
        "Prämierte Autorenküche und balearische Spitzengastronomie",
      ],
    },
  },
];

/**
 * Resuelve una ruta e hidrata sus paradas con los negocios reales del catálogo.
 */
export function getHydratedTourBySlug(slug: string): ExperienceTour | undefined {
  const baseTour = SIGNATURE_TOURS.find((t) => t.slug === slug);
  if (!baseTour) return undefined;

  let serviceSlugs: string[] = [];
  if (baseTour.id === "tour-tramuntana-vidrio-arte") {
    serviceSlugs = ["lafiore-vidrio-artesanal", "belmond-la-residencia-spa", "talise-spa-jumeirah-port-soller"];
  } else if (baseTour.id === "tour-calvia-nautica-lifestyle") {
    serviceSlugs = [
      "puerto-portals-marina",
      "easy-boats-mallorca-puerto-portals",
      "port-adriano-boat-charter",
      "arabella-spa-mallorca",
    ];
  } else if (baseTour.id === "tour-raiguer-vinos-artesania") {
    serviceSlugs = ["lafiore-vidrio-artesanal", "celler-can-amer", "ca-na-toneta"];
  } else if (baseTour.id === "tour-palma-cultura-gastronomia") {
    serviceSlugs = ["fundacio-miro-mallorca", "es-baluard-museu", "dins-santi-taura", "vandal-palma"];
  }

  const stops: TourStop[] = [];
  let stopNum = 1;

  for (let i = 0; i < serviceSlugs.length; i++) {
    const slugKey = serviceSlugs[i];
    const s = SERVICES.find((item) => item.slug === slugKey);
    if (!s) continue;

    let distToNext: number | undefined;
    let formattedDist: string | undefined;

    if (i < serviceSlugs.length - 1) {
      const nextSlug = serviceSlugs[i + 1];
      const nextService = SERVICES.find((item) => item.slug === nextSlug);
      if (nextService && s.coordinates && nextService.coordinates) {
        distToNext = calculateHaversineDistance(
          s.coordinates.lat,
          s.coordinates.lng,
          nextService.coordinates.lat,
          nextService.coordinates.lng,
        );
        formattedDist = formatDistance(distToNext);
      }
    }

    stops.push({
      stopNumber: stopNum++,
      service: s,
      role: i === 0 ? "experience_anchor" : s.category.includes("nautica") ? "nautical_transport" : "wellness_relax",
      recommendedDurationMinutes: i === 0 ? 120 : 90,
      travelDistanceToNextKm: distToNext,
      formattedDistanceToNext: formattedDist,
      stepDescription: {
        es: `Parada ${stopNum - 1}: Experiencia contrastada en ${s.name}.`,
        en: `Stop ${stopNum - 1}: Verified signature experience at ${s.name}.`,
        ca: `Parada ${stopNum - 1}: Experiència contrastada a ${s.name}.`,
        de: `Station ${stopNum - 1}: Verifiziertes Erlebnis im ${s.name}.`,
      },
    });
  }

  return {
    ...baseTour,
    stops,
  };
}

/**
 * Genera una ruta dinámica personalizada a partir de cualquier negocio ancla.
 */
export function generateDynamicTourFromAnchor(anchorSlug: string, maxStops = 4): ExperienceTour | undefined {
  const anchor = SERVICES.find((s) => s.slug === anchorSlug);
  if (!anchor) return undefined;

  const recommendations = getSmartMatchCrossSell(anchor, 5);
  const selected = recommendations.slice(0, maxStops - 1);

  const stops: TourStop[] = [
    {
      stopNumber: 1,
      service: anchor,
      role: "experience_anchor",
      recommendedDurationMinutes: 120,
      stepDescription: {
        es: `Punto de partida: Experiencia principal en ${anchor.name}.`,
        en: `Starting point: Core experience at ${anchor.name}.`,
        ca: `Punt de partida: Experiència principal a ${anchor.name}.`,
        de: `Startpunkt: Haupterlebnis im ${anchor.name}.`,
      },
    },
  ];

  let currentService = anchor;
  let totalKm = 0;

  for (let i = 0; i < selected.length; i++) {
    const nextRec = selected[i];
    let dist = 0;
    if (currentService.coordinates && nextRec.service.coordinates) {
      dist = calculateHaversineDistance(
        currentService.coordinates.lat,
        currentService.coordinates.lng,
        nextRec.service.coordinates.lat,
        nextRec.service.coordinates.lng,
      );
    }
    totalKm += dist;

    // Actualizar distancia en parada anterior
    stops[stops.length - 1].travelDistanceToNextKm = dist;
    stops[stops.length - 1].formattedDistanceToNext = formatDistance(dist);

    stops.push({
      stopNumber: i + 2,
      service: nextRec.service,
      role: nextRec.service.category.includes("gastronomia") ? "gastronomy" : "wellness_relax",
      recommendedDurationMinutes: 90,
      stepDescription: nextRec.crossSellReason,
    });

    currentService = nextRec.service;
  }

  return {
    id: `dynamic-tour-${anchor.slug}`,
    slug: `ruta-${anchor.slug}`,
    title: {
      es: `Ruta de Experiencia: ${anchor.name}`,
      en: `Experience Tour: ${anchor.name}`,
      ca: `Ruta d'Experiència: ${anchor.name}`,
      de: `Erlebnisroute: ${anchor.name}`,
    },
    subtitle: {
      es: `Itinerario conectado por cercanía y estilo de vida a partir de ${anchor.name}.`,
      en: `Bespoke lifestyle and proximity connected itinerary starting from ${anchor.name}.`,
      ca: `Itinerari connectat per proximitat i estil de vida a partir de ${anchor.name}.`,
      de: `Maßgeschneiderte Route basierend auf Nähe und Lifestyle ab ${anchor.name}.`,
    },
    zone: anchor.zone,
    theme: "wellness_heritage",
    estimatedTotalHours: Math.round((stops.length * 1.5 + totalKm / 40) * 10) / 10,
    totalDistanceKm: Math.round(totalKm * 10) / 10,
    stops,
    highlights: {
      es: [`Itinerario inteligente generado con SmartMatch desde ${anchor.name}`],
      en: [`SmartMatch algorithmically connected itinerary starting from ${anchor.name}`],
      ca: [`Itinerari intel·ligent generat amb SmartMatch des de ${anchor.name}`],
      de: [`Mit SmartMatch erstellte Reiseroute ab ${anchor.name}`],
    },
  };
}
