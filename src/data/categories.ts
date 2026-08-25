export interface SuperSector {
  id: string;
  code: string;
  icon: string;
  name: {
    es: string;
    en: string;
    ca: string;
  };
  description: {
    es: string;
    en: string;
    ca: string;
  };
}

export interface ServiceCategory {
  id: string;
  slug: string;
  sectorId: string;
  icon: string;
  name: {
    es: string;
    en: string;
    ca: string;
  };
  description: {
    es: string;
    en: string;
    ca: string;
  };
  synonyms: string[];
  popularSpecialties?: {
    es: string[];
    en: string[];
    ca: string[];
  };
  color: string;
}

/**
 * 20 Super-Sectores Macroeconómicos de Mallorca (Nivel 1).
 */
export const SUPER_SECTORS: SuperSector[] = [
  {
    id: "arte-estilo-cultura",
    code: "SS-01",
    icon: "🎨",
    name: {
      es: "Arte, Estilo & Cultura",
      en: "Art, Style & Culture",
      ca: "Art, Estil & Cultura",
    },
    description: {
      es: "Tatuajes de autor, piercings, galerías de arte, exposiciones y estudios creativos.",
      en: "Bespoke tattoo studios, piercing, art galleries, exhibitions, and creative spaces.",
      ca: "Tatuatges d'autor, pírcings, galeries d'art, exposicions i estudis creatius.",
    },
  },
  {
    id: "nautica-maritimo",
    code: "SS-02",
    icon: "⛵",
    name: {
      es: "Náutica & Actividades Marítimas",
      en: "Yachting & Maritime",
      ca: "Nàutica & Activitats Marítimes",
    },
    description: {
      es: "Chárter de yates, lanchas con patrón, mantenimiento de embarcaciones y deportes acuáticos.",
      en: "Luxury yacht charter, motorboat rentals, vessel maintenance, and water sports.",
      ca: "Xàrter de iots, llanxes amb patró, manteniment d'embarcacions i esports aquàtics.",
    },
  },
  {
    id: "construccion-reformas",
    code: "SS-03",
    icon: "🏗️",
    name: {
      es: "Construcción, Reformas & Hogar",
      en: "Building, Renovations & Home",
      ca: "Construcció, Reformes & Llar",
    },
    description: {
      es: "Reformas integrales, fontanería, electricidad, climatización y mantenimiento de fincas.",
      en: "Comprehensive renovations, plumbing, HVAC, electrical, and estate maintenance.",
      ca: "Reformes integrals, fontaneria, electricitat, climatització i manteniment de finques.",
    },
  },
  {
    id: "inmobiliario-fincas",
    code: "SS-04",
    icon: "🏡",
    name: {
      es: "Inmobiliario, Villas & Fincas",
      en: "Real Estate & Luxury Estates",
      ca: "Immobiliari, Vil·les & Finques",
    },
    description: {
      es: "Compraventa de villas exclusivas, alquileres vacacionales y gestión patrimonial.",
      en: "Luxury villa sales, holiday estates, and property portfolio management.",
      ca: "Compravenda de vil·les exclusives, lloguers vacacionals i gestió patrimonial.",
    },
  },
  {
    id: "salud-bienestar-belleza",
    code: "SS-05",
    icon: "🧘",
    name: {
      es: "Salud, Bienestar & Belleza",
      en: "Health, Wellness & Beauty",
      ca: "Salut, Benestar & Bellesa",
    },
    description: {
      es: "Spas, fisioterapia, clínicas de estética, medicina privada y yoga.",
      en: "Spas, physiotherapy, aesthetic clinics, private medicine, and yoga retreat centers.",
      ca: "Spas, fisioteràpia, clíniques d'estètica, medicina privada i ioga.",
    },
  },
  {
    id: "hosteleria-gastronomia",
    code: "SS-06",
    icon: "🍽️",
    name: {
      es: "Hostelería, Gastronomía & Chefs",
      en: "Hospitality & Private Chefs",
      ca: "Hostaleria, Gastronomia & Xefs",
    },
    description: {
      es: "Chefs privados en villas, catering para eventos, bodegas y restaurantes de alta cocina.",
      en: "In-villa private chefs, event catering, wine bodegas, and fine dining.",
      ca: "Xefs privats a vil·les, càtering per a esdeveniments, cellers i alta cuina.",
    },
  },
  {
    id: "movilidad-transporte",
    code: "SS-07",
    icon: "🚗",
    name: {
      es: "Movilidad, Transporte VIP & Motor",
      en: "VIP Mobility & Transport",
      ca: "Mobilitat, Transport VIP & Motor",
    },
    description: {
      es: "Chófer privado, traslados aeropuerto VIP, alquiler de vehículos de lujo y talleres.",
      en: "Private chauffeurs, VIP airport transfers, luxury car hire, and specialty garages.",
      ca: "Xofer privat, trasllats aeroport VIP, lloguer de vehicles de luxe i tallers.",
    },
  },
  {
    id: "servicios-profesionales-legal",
    code: "SS-08",
    icon: "💼",
    name: {
      es: "Servicios Profesionales, Legal & Fiscal",
      en: "Legal, Tax & Professional Services",
      ca: "Serveis Professionals, Legal & Fiscal",
    },
    description: {
      es: "Abogados internacionales, asesoría fiscal, notarios, consultoría y traducción jurada.",
      en: "International law firms, tax advisory, notary services, consulting, and sworn translations.",
      ca: "Advocats internacionals, assessoria fiscal, notaris, consultoria i traducció jurada.",
    },
  },
  {
    id: "jardineria-paisajismo-piscinas",
    code: "SS-09",
    icon: "🌴",
    name: {
      es: "Jardinería, Paisajismo & Piscinas",
      en: "Gardening, Landscaping & Pools",
      ca: "Jardineria, Paisatgisme & Piscines",
    },
    description: {
      es: "Mantenimiento de jardines mediterráneos, diseño paisajístico y tratamiento de piscinas.",
      en: "Mediterranean garden maintenance, landscape architecture, and pool care.",
      ca: "Manteniment de jardins mediterranis, disseny paisatgístic i cura de piscines.",
    },
  },
  {
    id: "tecnologia-seguridad-domotica",
    code: "SS-10",
    icon: "🛡️",
    name: {
      es: "Seguridad, Domótica & Tecnología",
      en: "Security, Smart Home & IT",
      ca: "Seguretat, Domòtica & Tecnologia",
    },
    description: {
      es: "Sistemas de videovigilancia, alarmas, domótica residencial e instalaciones de red de alta velocidad.",
      en: "CCTV surveillance, alarm systems, smart home automation, and high-speed networks.",
      ca: "Sistemes de videovigilància, alarmes, domòtica residencial i xarxes d'alta velocitat.",
    },
  },
  {
    id: "alojamiento-turismo",
    code: "SS-11",
    icon: "🏨",
    name: {
      es: "Alojamiento & Turismo",
      en: "Accommodation & Tourism",
      ca: "Allotjament & Turisme",
    },
    description: {
      es: "Hoteles boutique, agroturismos, villas vacacionales, campings y experiencias turísticas guiadas.",
      en: "Boutique hotels, agrotourism stays, holiday villas, campsites, and guided tourism experiences.",
      ca: "Hotels boutique, agroturismes, vil·les vacacionals, càmpings i experiències turístiques guiades.",
    },
  },
  {
    id: "retail-comercio",
    code: "SS-12",
    icon: "🛍️",
    name: {
      es: "Retail, Moda & Comercio",
      en: "Retail, Fashion & Shopping",
      ca: "Retail, Moda & Comerç",
    },
    description: {
      es: "Moda y complementos, comercio local, mercados gourmet y compras de lujo.",
      en: "Fashion & accessories, local shops, gourmet markets, and luxury shopping.",
      ca: "Moda i complements, comerç local, mercats gurmet i compres de luxe.",
    },
  },
  {
    id: "educacion-formacion",
    code: "SS-13",
    icon: "🎓",
    name: {
      es: "Educación & Formación",
      en: "Education & Training",
      ca: "Educació & Formació",
    },
    description: {
      es: "Academias de idiomas, escuelas de negocios, formación náutica y clases particulares.",
      en: "Language academies, business schools, nautical training, and private tutoring.",
      ca: "Acadèmies d'idiomes, escoles de negocis, formació nàutica i classes particulars.",
    },
  },
  {
    id: "entretenimiento-ocio",
    code: "SS-14",
    icon: "🎭",
    name: {
      es: "Entretenimiento, Cultura & Ocio",
      en: "Entertainment, Culture & Leisure",
      ca: "Entreteniment, Cultura & Oci",
    },
    description: {
      es: "Teatros, cines, salas de conciertos, ocio nocturno y eventos culturales.",
      en: "Theaters, cinemas, concert venues, nightlife, and cultural events.",
      ca: "Teatres, cinemes, sales de concerts, oci nocturn i esdeveniments culturals.",
    },
  },
  {
    id: "deportes-aire-libre",
    code: "SS-15",
    icon: "⚽",
    name: {
      es: "Deportes & Aire Libre",
      en: "Sports & Outdoors",
      ca: "Esports & Aire Lliure",
    },
    description: {
      es: "Clubs deportivos, golf, tenis y pádel, ciclismo, senderismo y deportes de aventura.",
      en: "Sports clubs, golf, tennis & padel, cycling, hiking, and adventure sports.",
      ca: "Clubs esportius, golf, tennis i pàdel, ciclisme, senderisme i esports d'aventura.",
    },
  },
  {
    id: "hogar-limpieza",
    code: "SS-16",
    icon: "🧹",
    name: {
      es: "Hogar, Limpieza & Mantenimiento",
      en: "Home, Cleaning & Maintenance",
      ca: "Llar, Neteja & Manteniment",
    },
    description: {
      es: "Limpieza de viviendas y fincas, mantenimiento integral y gestión de comunidades.",
      en: "Home & estate cleaning, comprehensive maintenance, and community management.",
      ca: "Neteja de llars i finques, manteniment integral i gestió de comunitats.",
    },
  },
  {
    id: "mascotas-veterinaria",
    code: "SS-17",
    icon: "🐾",
    name: {
      es: "Mascotas & Veterinaria",
      en: "Pets & Veterinary",
      ca: "Mascotes & Veterinària",
    },
    description: {
      es: "Clínicas veterinarias, peluquería canina, adiestramiento y residencias de mascotas.",
      en: "Veterinary clinics, pet grooming, dog training, and boarding kennels.",
      ca: "Clíniques veterinaris, perruqueria canina, ensinistrament i residències de mascotes.",
    },
  },
  {
    id: "agricultura-productores",
    code: "SS-18",
    icon: "🌾",
    name: {
      es: "Agricultura & Productores Locales",
      en: "Agriculture & Local Producers",
      ca: "Agricultura & Productors Locals",
    },
    description: {
      es: "Bodegas, almazaras, productores ecológicos, sobrasada y mercado agroalimentario local.",
      en: "Wineries, olive oil mills, organic producers, sobrassada, and the local food market.",
      ca: "Cellers, molins d'oli, productors ecològics, sobrassada i mercat agroalimentari local.",
    },
  },
  {
    id: "artesania-manufactura",
    code: "SS-19",
    icon: "🏺",
    name: {
      es: "Artesanía, Manufactura & Piedra",
      en: "Craftsmanship, Manufacturing & Stone",
      ca: "Artesania, Manufactura & Pedra",
    },
    description: {
      es: "Piedra de Santanyí, cerámica, vidrio soplado, textiles tradicionales y talleres artesanos.",
      en: "Santanyí stone, ceramics, blown glass, traditional textiles, and artisan workshops.",
      ca: "Pedra de Santanyí, ceràmica, vidre bufat, tèxtils tradicionals i tallers artesans.",
    },
  },
  {
    id: "servicios-sociales",
    code: "SS-20",
    icon: "🤝",
    name: {
      es: "Servicios Sociales & Asistencia",
      en: "Social & Care Services",
      ca: "Serveis Socials & Assistència",
    },
    description: {
      es: "Cuidado a domicilio, residencias de mayores, canguros y servicios de asistencia.",
      en: "Home care, senior residences, babysitting, and assistance services.",
      ca: "Atenció a domicili, residències de majors, cangurs i serveis d'assistència.",
    },
  },
  {
    id: "finanzas-seguros",
    code: "SS-21",
    icon: "💰",
    name: {
      es: "Finanzas & Seguros",
      en: "Finance & Insurance",
      ca: "Finances & Assegurances",
    },
    description: {
      es: "Asesoría financiera, corredurías de seguros, brokers hipotecarios y banca privada.",
      en: "Financial advisory, insurance brokerages, mortgage brokers, and private banking.",
      ca: "Assessoria financera, corredories d'assegurances, brokers hipotecaris i banca privada.",
    },
  },
];

/**
 * Taxonomía Completa de Categorías con Sinónimos y Vinculación a Super-Sectores.
 */
export const CATEGORIES: ServiceCategory[] = [
  {
    id: "arte-tatuajes",
    slug: "arte-tatuajes",
    sectorId: "arte-estilo-cultura",
    icon: "🎨",
    name: {
      es: "Arte, Tatuajes & Piercing",
      en: "Art, Tattoo Studios & Piercing",
      ca: "Art, Tatuatges & Pírcing",
    },
    description: {
      es: "Estudios profesionales de tatuaje, artistas residentes, realismo, fine line, traditional y piercing higiénico en Mallorca.",
      en: "Professional tattoo studios, resident artists, realism, fine line, traditional, and hygienic piercing in Mallorca.",
      ca: "Estudis professionals de tatuatge, artistes residents, realisme, fine line, traditional i pírcing higiènic a Mallorca.",
    },
    synonyms: [
      "tatuajes",
      "tattoo",
      "tatu",
      "tattoos",
      "tatuador",
      "tatuadora",
      "piercing",
      "piercings",
      "anillado",
      "fine line",
      "microrealismo",
      "blackwork",
      "old school",
      "neotradicional",
      "lettering",
      "ink",
      "tatuajes palma",
      "estudio de tatuajes",
      "body art",
      "cover up",
      "tinte vegano",
    ],
    popularSpecialties: {
      es: ["Microrealismo", "Fine Line", "Black & Grey", "Old School", "Piercing Titanio", "Cover-up"],
      en: ["Microrealism", "Fine Line", "Black & Grey", "Old School", "Titanium Piercing", "Cover-up"],
      ca: ["Microrealisme", "Fine Line", "Black & Grey", "Old School", "Pírcing Titani", "Cover-up"],
    },
    color: "#e11d48",
  },
  {
    id: "nautica-charter",
    slug: "nautica-charter",
    sectorId: "nautica-maritimo",
    icon: "⛵",
    name: {
      es: "Náutica & Charters",
      en: "Boating & Yacht Charter",
      ca: "Nàutica & Xàrters",
    },
    description: {
      es: "Alquiler de barcos, yates de lujo, patrones profesionales, mantenimiento náutico y excursiones marítimas.",
      en: "Boat rentals, luxury yacht charters, professional skippers, marine maintenance, and sea excursions.",
      ca: "Lloguer d'embarcacions, iots de luxe, patrons professionals, manteniment nàutic i excursions marítimes.",
    },
    synonyms: [
      "barcos",
      "yates",
      "charter",
      "alquiler barco",
      "catamaran",
      "lancha",
      "velero",
      "patron",
      "skipper",
      "puerto portals",
      "club de mar",
      "puerto andratx",
      "paseo en barco",
      "seabob",
    ],
    color: "#0284c7",
  },
  {
    id: "reformas-hogar",
    slug: "reformas-hogar",
    sectorId: "construccion-reformas",
    icon: "🔨",
    name: {
      es: "Reformas & Construcción",
      en: "Renovations & Building",
      ca: "Reformes & Construcció",
    },
    description: {
      es: "Fontanería, electricidad, climatización, albañilería, carpintería y reformas integrales de viviendas y fincas.",
      en: "Plumbing, electrical, HVAC, masonry, carpentry, and comprehensive home & finca renovations in Mallorca.",
      ca: "Fontaneria, electricitat, climatització, paleteria, fusteria i reformes integrals d'habitatges i finques.",
    },
    synonyms: [
      "reformas",
      "obras",
      "fontanero",
      "electricista",
      "aire acondicionado",
      "climatizacion",
      "albanil",
      "carpintero",
      "pintor",
      "reforma integral",
      "rehabilitacion fincas",
    ],
    color: "#2563eb",
  },
  {
    id: "inmobiliaria-villas",
    slug: "inmobiliaria-villas",
    sectorId: "inmobiliario-fincas",
    icon: "🏡",
    name: {
      es: "Inmobiliaria & Fincas",
      en: "Real Estate & Villas",
      ca: "Immobiliària & Finques",
    },
    description: {
      es: "Agencias inmobiliarias premium, gestión patrimonial, compraventa de villas y alquileres de temporada.",
      en: "Premium real estate agencies, estate management, luxury villa sales, and holiday rentals.",
      ca: "Agències immobiliàries premium, gestió patrimonial, compravenda de vil·les i lloguers de temporada.",
    },
    synonyms: [
      "inmobiliaria",
      "real estate",
      "villas",
      "fincas",
      "chalet",
      "comprar casa mallorca",
      "alquiler villa",
      "propiedades lujo",
    ],
    color: "#059669",
  },
  {
    id: "salud-bienestar",
    slug: "salud-bienestar",
    sectorId: "salud-bienestar-belleza",
    icon: "🧘",
    name: {
      es: "Salud & Bienestar",
      en: "Health & Wellness",
      ca: "Salut & Benestar",
    },
    description: {
      es: "Fisioterapia, spas exclusivos, medicina estética, yoga, nutrición y clínicas especializadas.",
      en: "Physiotherapy, luxury spas, aesthetic medicine, yoga, nutrition, and wellness clinics.",
      ca: "Fisioteràpia, spas exclusius, medicina estètica, ioga, nutrició i clíniques especialitzades.",
    },
    synonyms: [
      "spa",
      "masaje",
      "fisioterapia",
      "fisioterapeuta",
      "yoga",
      "nutricionista",
      "medico privado",
      "clinica estetica",
      "wellness",
    ],
    color: "#10b981",
  },
  {
    id: "gastronomia-catering",
    slug: "gastronomia-catering",
    sectorId: "hosteleria-gastronomia",
    icon: "🍽️",
    name: {
      es: "Gastronomía & Chefs Privados",
      en: "Gastronomy & Private Chefs",
      ca: "Gastronomia & Xefs Privats",
    },
    description: {
      es: "Chefs a domicilio en villas, catering gourmet para eventos, catas de vino y restaurantes destacados.",
      en: "In-villa private chefs, gourmet event catering, wine tastings, and premier restaurants.",
      ca: "Xefs a domicili a vil·les, càtering gurmet per a esdeveniments, tasts de vins i restaurants destacats.",
    },
    synonyms: [
      "chef privado",
      "cocinero villa",
      "catering",
      "eventos gourmet",
      "bodega",
      "cata de vinos",
      "restaurante",
      "private chef",
    ],
    color: "#d97706",
  },
  {
    id: "motor-transporte",
    slug: "motor-transporte",
    sectorId: "movilidad-transporte",
    icon: "🚗",
    name: {
      es: "Transporte VIP & Chófer",
      en: "VIP Transfers & Chauffeur",
      ca: "Transport VIP & Xofer",
    },
    description: {
      es: "Transfers aeropuerto, chófer privado, alquiler de vehículos de alta gama y traslados ejecutivos.",
      en: "Airport transfers, private chauffeurs, high-end car rental, and executive transport.",
      ca: "Trasllats aeroport, xofer privat, lloguer de vehicles d'alta gamma i trasllats executius.",
    },
    synonyms: [
      "transfer aeropuerto",
      "chofer privado",
      "alquiler coche lujo",
      "transporte vip",
      "limusina",
      "chauffeur mallorca",
    ],
    color: "#dc2626",
  },
  {
    id: "servicios-profesionales",
    slug: "servicios-profesionales",
    sectorId: "servicios-profesionales-legal",
    icon: "💼",
    name: {
      es: "Abogados & Asesoría Fiscal",
      en: "Legal & Tax Advisory",
      ca: "Advocats & Assessoria Fiscal",
    },
    description: {
      es: "Bufetes de abogados, asesoría jurídica internacional, gestorías fiscales y consultoría empresarial.",
      en: "Law firms, international legal advice, tax consultancy, and business management in Mallorca.",
      ca: "Bufets d'advocats, assessoria jurídica internacional, gestories fiscals i consultoria empresarial.",
    },
    synonyms: [
      "abogado",
      "asesoria fiscal",
      "gestoria",
      "tax advisor",
      "lawyer",
      "notario",
      "consultoria",
      "abogado inmobiliario",
    ],
    color: "#7c3aed",
  },
  {
    id: "jardineria-piscinas",
    slug: "jardineria-piscinas",
    sectorId: "jardineria-paisajismo-piscinas",
    icon: "🌴",
    name: {
      es: "Jardinería & Piscinas",
      en: "Gardening & Pools",
      ca: "Jardineria & Piscines",
    },
    description: {
      es: "Diseño y mantenimiento de jardines mediterráneos, paisajismo, limpieza y cloración de piscinas.",
      en: "Mediterranean garden design & maintenance, landscaping, pool cleaning and water treatment.",
      ca: "Disseny i manteniment de jardins mediterranis, paisatgisme, neteja i manteniment de piscines.",
    },
    synonyms: [
      "jardinero",
      "mantenimiento piscinas",
      "paisajismo",
      "jardineria",
      "cloro piscinas",
      "piscina limpia",
      "pool maintenance",
    ],
    color: "#16a34a",
  },
  {
    id: "tecnologia-seguridad",
    slug: "tecnologia-seguridad",
    sectorId: "tecnologia-seguridad-domotica",
    icon: "🛡️",
    name: {
      es: "Seguridad & Domótica",
      en: "Security & Smart Home",
      ca: "Seguretat & Domòtica",
    },
    description: {
      es: "Sistemas de alarma, videovigilancia, domótica residencial, redes Wi-Fi de alta velocidad e instalaciones inteligentes.",
      en: "Alarm systems, CCTV surveillance, smart home automation, high-speed Wi-Fi, and smart installations.",
      ca: "Sistemes d'alarma, videovigilància, domòtica residencial, xarxes Wi-Fi d'alta velocitat i instal·lacions intel·ligents.",
    },
    synonyms: [
      "alarmas",
      "seguridad",
      "camaras vigilancia",
      "cctv",
      "domotica",
      "smart home",
      "wifi villas",
      "redes informatica",
    ],
    color: "#4f46e5",
  },
];

/**
 * Filtra y devuelve exclusivamente las categorías que tienen al menos un negocio activo.
 */
export function getActiveCategories(
  servicesList: Array<{ category: string; secondaryCategories?: string[]; status?: string }> = [],
): ServiceCategory[] {
  const activeIds = new Set<string>();

  servicesList
    .filter((s) => s.status !== "permanently_closed")
    .forEach((s) => {
      if (s.category) activeIds.add(s.category);
      if (s.secondaryCategories && Array.isArray(s.secondaryCategories)) {
        s.secondaryCategories.forEach((sec) => activeIds.add(sec));
      }
    });

  return CATEGORIES.filter((cat) => activeIds.has(cat.id));
}

/**
 * Filtra y devuelve exclusivamente los super-sectores que tienen categorías activas.
 */
export function getActiveSuperSectors(
  servicesList: Array<{ category: string; secondaryCategories?: string[]; status?: string }> = [],
): SuperSector[] {
  const activeCats = getActiveCategories(servicesList);
  const activeSectorIds = new Set(activeCats.map((c) => c.sectorId));
  return SUPER_SECTORS.filter((sec) => activeSectorIds.has(sec.id));
}

/** Resuelve un super-sector por id. */
export function getSuperSectorById(id: string): SuperSector | undefined {
  return SUPER_SECTORS.find((sec) => sec.id === id);
}

/** Resuelve una categoría por slug (URLs SEO estables). */
export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

/** Devuelve todas las categorías que pertenecen a un super-sector. */
export function getCategoriesBySector(sectorId: string): ServiceCategory[] {
  return CATEGORIES.filter((cat) => cat.sectorId === sectorId);
}

/** Normaliza texto libre para búsqueda: minúsculas ASCII sin diacríticos (à→a, ñ→n…). */
function normalizeForSearch(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Búsqueda tolerante de categorías por sinónimo/nombre (matching Maps → taxonomía,
 * usado en curación — docs/WORKFLOW_CURATION.md). Insensible a mayúsculas y acentos.
 */
export function searchCategoriesBySynonym(query: string): ServiceCategory[] {
  const q = normalizeForSearch(query);
  if (!q) return [];
  return CATEGORIES.filter((cat) => {
    const haystacks = [cat.id, cat.name.es, cat.name.en, cat.name.ca, ...cat.synonyms].map(normalizeForSearch);
    return haystacks.some((h) => h.includes(q) || q.includes(h));
  });
}
