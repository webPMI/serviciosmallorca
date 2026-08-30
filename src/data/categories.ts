export interface SuperSector {
  id: string;
  code: string;
  icon: string;
  name: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  description: {
    es: string;
    en: string;
    ca: string;
    de: string;
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
    de: string;
  };
  description: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  synonyms: string[];
  popularSpecialties?: {
    es: string[];
    en: string[];
    ca: string[];
    de: string[];
  };
  color: string;
}

/**
 * 21 Super-Sectores Macroeconómicos de Mallorca (Nivel 1).
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
      de: "Kunst, Stil & Kultur",
    },
    description: {
      es: "Tatuajes de autor, piercings, galerías de arte, exposiciones y estudios creativos.",
      en: "Bespoke tattoo studios, piercing, art galleries, exhibitions, and creative spaces.",
      ca: "Tatuatges d'autor, pírcings, galeries d'art, exposicions i estudis creatius.",
      de: "Individuelle Tattoo-Studios, Piercings, Kunstgalerien, Ausstellungen und Kreativstudios.",
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
      de: "Nautik & Maritim",
    },
    description: {
      es: "Chárter de yates, lanchas con patrón, mantenimiento de embarcaciones y deportes acuáticos.",
      en: "Luxury yacht charter, motorboat rentals, vessel maintenance, and water sports.",
      ca: "Xàrter de iots, llanxes amb patró, manteniment d'embarcacions i esports aquàtics.",
      de: "Luxus-Yachtcharter, Bootsverleih mit Skipper, Bootswartung und Wassersport.",
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
      de: "Bau, Renovierung & Wohnen",
    },
    description: {
      es: "Reformas integrales, fontanería, electricidad, climatización y mantenimiento de fincas.",
      en: "Comprehensive renovations, plumbing, HVAC, electrical, and estate maintenance.",
      ca: "Reformes integrals, fontaneria, electricitat, climatització i manteniment de finques.",
      de: "Komplettsanierungen, Sanitär, Elektrik, Klimatechnik und Finca-Instandhaltung.",
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
      de: "Immobilien, Villen & Fincas",
    },
    description: {
      es: "Compraventa de villas exclusivas, alquileres vacacionales y gestión patrimonial.",
      en: "Luxury villa sales, holiday estates, and property portfolio management.",
      ca: "Compravenda de vil·les exclusives, lloguers vacacionals i gestió patrimonial.",
      de: "Verkauf exklusiver Villen, Ferienvermietung und professionelle Vermögensverwaltung.",
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
      de: "Gesundheit, Wellness & Schönheit",
    },
    description: {
      es: "Spas, fisioterapia, clínicas de estética, medicina privada y yoga.",
      en: "Spas, physiotherapy, aesthetic clinics, private medicine, and yoga retreat centers.",
      ca: "Spas, fisioteràpia, clíniques d'estètica, medicina privada i ioga.",
      de: "Spas, Physiotherapie, Schönheitskliniken, Privatmedizin und Yoga-Zentren.",
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
      de: "Gastronomie & Privatköche",
    },
    description: {
      es: "Chefs privados en villas, catering para eventos, bodegas y restaurantes de alta cocina.",
      en: "In-villa private chefs, event catering, wine bodegas, and fine dining.",
      ca: "Xefs privats a vil·les, càtering per a esdeveniments, cellers i alta cuina.",
      de: "Private Köche in Villen, Gourmet-Catering für Events, Weingüter und gehobene Restaurants.",
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
      de: "VIP-Mobilität, Chauffeur & Motor",
    },
    description: {
      es: "Chófer privado, traslados aeropuerto VIP, alquiler de vehículos de lujo y talleres.",
      en: "Private chauffeurs, VIP airport transfers, luxury car hire, and specialty garages.",
      ca: "Xofer privat, trasllats aeroport VIP, lloguer de vehicles d'alta gamma i tallers.",
      de: "Privatchauffeur, VIP-Flughafentransfers, Luxusautovermietung und Fachwerkstätten.",
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
      de: "Rechts-, Steuer- & Fachberatung",
    },
    description: {
      es: "Abogados internacionales, asesoría fiscal, notarios, consultoría y traducción jurada.",
      en: "International law firms, tax advisory, notary services, consulting, and sworn translations.",
      ca: "Advocats internacionals, assessoria fiscal, notaris, consultoria i traducció jurada.",
      de: "Internationale Rechtsanwälte, Steuerberatung, Notare, Unternehmensberatung und beeidigte Übersetzungen.",
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
      de: "Gartenbau, Landschaft & Pools",
    },
    description: {
      es: "Mantenimiento de jardines mediterráneos, diseño paisajístico y tratamiento de piscinas.",
      en: "Mediterranean garden maintenance, landscape architecture, and pool care.",
      ca: "Manteniment de jardins mediterranis, disseny paisatgístic i cura de piscines.",
      de: "Pflege mediterraner Gärten, Landschaftsarchitektur und Poolpflege.",
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
      de: "Sicherheit, Smart Home & IT",
    },
    description: {
      es: "Sistemas de videovigilancia, alarmas, domótica residencial e instalaciones de red de alta velocidad.",
      en: "CCTV surveillance, alarm systems, smart home automation, and high-speed networks.",
      ca: "Sistemes de videovigilància, alarmes, domòtica residencial i xarxes d'alta velocitat.",
      de: "Videoüberwachung, Alarmanlagen, Smart-Home-Hausautomation und Hochgeschwindigkeitsnetzwerke.",
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
      de: "Unterkunft & Tourismus",
    },
    description: {
      es: "Hoteles boutique, agroturismos, villas vacacionales, campings y experiencias turísticas guiadas.",
      en: "Boutique hotels, agrotourism stays, holiday villas, campsites, and guided tourism experiences.",
      ca: "Hotels boutique, agroturismes, vil·les vacacionals, càmpings i experiències turístiques guiades.",
      de: "Boutique-Hotels, Fincas / Agrotourismus, Ferienvillen und geführte Erlebnisse auf Mallorca.",
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
      de: "Mode, Shopping & Einzelhandel",
    },
    description: {
      es: "Moda y complementos, comercio local, mercados gourmet y compras de lujo.",
      en: "Fashion & accessories, local shops, gourmet markets, and luxury shopping.",
      ca: "Moda i complements, comerç local, mercats gurmet i compres de luxe.",
      de: "Mode & Accessoires, lokale Boutiquen, Gourmetmärkte und Luxus-Shopping.",
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
      de: "Bildung & Ausbildung",
    },
    description: {
      es: "Academias de idiomas, escuelas de negocios, formación náutica y clases particulares.",
      en: "Language academies, business schools, nautical training, and private tutoring.",
      ca: "Acadèmies d'idiomes, escoles de negocis, formació nàutica i classes particulars.",
      de: "Sprachschulen, Business Schools, Bootsführerschein-Ausbildung und Privatunterricht.",
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
      de: "Unterhaltung, Kultur & Freizeit",
    },
    description: {
      es: "Teatros, cines, salas de conciertos, ocio nocturno y eventos culturales.",
      en: "Theaters, cinemas, concert venues, nightlife, and cultural events.",
      ca: "Teatres, cinemes, sales de concerts, oci nocturn i esdeveniments culturals.",
      de: "Theater, Kinos, Konzertveranstalter, Nachtleben und kulturelle Events.",
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
      de: "Sport & Outdoor",
    },
    description: {
      es: "Clubs deportivos, golf, tenis y pádel, ciclismo, senderismo y deportes de aventura.",
      en: "Sports clubs, golf, tennis & padel, cycling, hiking, and adventure sports.",
      ca: "Clubs esportius, golf, tennis i pàdel, ciclisme, senderisme i esports d'aventura.",
      de: "Sportclubs, Golfplätze, Tennis & Padel, Radsport, Wandern und Abenteuersportarten.",
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
      de: "Haushalt, Reinigung & Pflege",
    },
    description: {
      es: "Limpieza de viviendas y fincas, mantenimiento integral y gestión de comunidades.",
      en: "Home & estate cleaning, comprehensive maintenance, and community management.",
      ca: "Neteja de llars i finques, manteniment integral i gestió de comunitats.",
      de: "Reinigung von Villen und Fincas, Objektbetreuung und Hausverwaltungen.",
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
      de: "Haustiere & Tierärzte",
    },
    description: {
      es: "Clínicas veterinarias, peluquería canina, adiestramiento y residencias de mascotas.",
      en: "Veterinary clinics, pet grooming, dog training, and boarding kennels.",
      ca: "Clíniques veterinaris, perruqueria canina, ensinistrament i residències de mascotes.",
      de: "Tierkliniken, Hundesalons, Hundetraining und Tierpensionen auf Mallorca.",
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
      de: "Landwirtschaft & Lokale Erzeuger",
    },
    description: {
      es: "Bodegas, almazaras, productores ecológicos, sobrasada y mercado agroalimentario local.",
      en: "Wineries, olive oil mills, organic producers, sobrassada, and the local food market.",
      ca: "Cellers, molins d'oli, productors ecològics, sobrassada i mercat agroalimentari local.",
      de: "Weingüter, Ölmühlen, Bio-Erzeuger, Sobrassada und traditionelle Inselprodukte.",
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
      de: "Handwerk, Manufaktur & Naturstein",
    },
    description: {
      es: "Piedra de Santanyí, cerámica, vidrio soplado, textiles tradicionales y talleres artesanos.",
      en: "Santanyí stone, ceramics, blown glass, traditional textiles, and artisan workshops.",
      ca: "Pedra de Santanyí, ceràmica, vidre bufat, tèxtils tradicionals i tallers artesans.",
      de: "Santanyí-Naturstein, Keramik, mundgeblasenes Glas, traditionelle Stoffe und Kunsthandwerk.",
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
      de: "Soziale Dienste & Pflege",
    },
    description: {
      es: "Cuidado a domicilio, residencias de mayores, canguros y servicios de asistencia.",
      en: "Home care, senior residences, babysitting, and assistance services.",
      ca: "Atenció a domicili, residències de majors, cangurs i serveis d'assistència.",
      de: "Häusliche Pflege, Seniorenresidenzen, Kinderbetreuung und persönliche Betreuungsdienste.",
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
      de: "Finanzen & Versicherungen",
    },
    description: {
      es: "Asesoría financiera, corredurías de seguros, brokers hipotecarios y banca privada.",
      en: "Financial advisory, insurance brokerages, mortgage brokers, and private banking.",
      ca: "Assessoria financera, corredories d'assegurances, brokers hipotecaris i banca privada.",
      de: "Finanzberatung, Versicherungsmakler, Baufinanzierung und Private Banking.",
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
      de: "Kunst, Tattoo-Studios & Piercing",
    },
    description: {
      es: "Estudios profesionales de tatuaje, artistas residentes, realismo, fine line, traditional y piercing higiénico en Mallorca.",
      en: "Professional tattoo studios, resident artists, realism, fine line, traditional, and hygienic piercing in Mallorca.",
      ca: "Estudis professionals de tatuatge, artistes residents, realisme, fine line, traditional i pírcing higiènic a Mallorca.",
      de: "Professionelle Tattoo-Studios, Gastkünstler, Realismus, Fine Line, Traditional und hygienisches Piercing auf Mallorca.",
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
      de: ["Mikrorealismus", "Fine Line", "Black & Grey", "Old School", "Titan-Piercing", "Cover-up"],
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
      de: "Nautik & Yachtcharter",
    },
    description: {
      es: "Alquiler de barcos, yates de lujo, patrones profesionales, mantenimiento náutico y excursiones marítimas.",
      en: "Boat rentals, luxury yacht charters, professional skippers, marine maintenance, and sea excursions.",
      ca: "Lloguer d'embarcacions, iots de luxe, patrons professionals, manteniment nàutic i excursions marítimes.",
      de: "Bootsverleih, Luxus-Yachtcharter, professionelle Skipper, Bootswartung und maritime Ausflüge auf Mallorca.",
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
    popularSpecialties: {
      es: ["Alquiler de Yates", "Catamaranes de Lujo", "Excursiones Privadas", "Patrón Profesional", "Eventos a Bordo"],
      en: ["Yacht Charter", "Luxury Catamarans", "Private Excursions", "Professional Skipper", "Onboard Events"],
      ca: [
        "Lloguer de Iots",
        "Catamarans de Luxe",
        "Excursions Privades",
        "Patró Professional",
        "Esdeveniments a Bord",
      ],
      de: ["Yachtcharter", "Luxus-Katamarane", "Private Ausflüge", "Professioneller Skipper", "Events an Bord"],
    },
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
      de: "Renovierung & Bau",
    },
    description: {
      es: "Fontanería, electricidad, climatización, albañilería, carpintería y reformas integrales de viviendas y fincas.",
      en: "Plumbing, electrical, HVAC, masonry, carpentry, and comprehensive home & finca renovations in Mallorca.",
      ca: "Fontaneria, electricitat, climatització, paleteria, fusteria i reformes integrals d'habitatges i finques.",
      de: "Sanitär, Elektrik, Klimaanlagen, Maurerarbeiten, Schreinerei und Komplettsanierungen von Häusern und Fincas.",
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
    popularSpecialties: {
      es: [
        "Reformas Integrales",
        "Fontanería & Clima",
        "Baños y Cocinas",
        "Rehabilitación de Fincas",
        "Carpintería a Medida",
      ],
      en: ["Full Renovations", "Plumbing & HVAC", "Kitchen & Bathrooms", "Finca Restoration", "Bespoke Carpentry"],
      ca: ["Reformes Integrals", "Fontaneria & Clima", "Banys i Cuines", "Rehabilitació de Finques", "Fusteria a Mida"],
      de: ["Komplettsanierungen", "Sanitär & Klima", "Bäder & Küchen", "Finca-Restaurierung", "Maßschreinerei"],
    },
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
      de: "Immobilien & Luxusvillen",
    },
    description: {
      es: "Agencias inmobiliarias premium, gestión patrimonial, compraventa de villas y alquileres de temporada.",
      en: "Premium real estate agencies, estate management, luxury villa sales, and holiday rentals.",
      ca: "Agències immobiliàries premium, gestió patrimonial, compravenda de vil·les i lloguers de temporada.",
      de: "Premium-Immobilienagenturen, Vermögensverwaltung, Villenverkauf und saisonale Luxusvermietung.",
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
    popularSpecialties: {
      es: [
        "Venta de Villas de Lujo",
        "Fincas Rústicas",
        "Alquiler Vacacional Premium",
        "Inversión Inmobiliaria",
        "Gestión Patrimonial",
      ],
      en: ["Luxury Villa Sales", "Rustic Fincas", "Premium Holiday Rentals", "Property Investment", "Asset Management"],
      ca: [
        "Venda de Vil·les de Luxe",
        "Finques Rústiques",
        "Lloguer Vacacional Premium",
        "Inversió Immobiliària",
        "Gestió Patrimonial",
      ],
      de: [
        "Verkauf von Luxusvillen",
        "Rustikale Fincas",
        "Premium-Ferienvermietung",
        "Immobilieninvestments",
        "Vermögensverwaltung",
      ],
    },
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
      de: "Gesundheit & Wellness",
    },
    description: {
      es: "Fisioterapia, spas exclusivos, medicina estética, yoga, nutrición y clínicas especializadas.",
      en: "Physiotherapy, luxury spas, aesthetic medicine, yoga, nutrition, and wellness clinics.",
      ca: "Fisioteràpia, spas exclusius, medicina estètica, ioga, nutrició i clíniques especialitzades.",
      de: "Physiotherapie, Luxus-Spas, ästhetische Medizin, Yoga, Ernährungsberatung und Spezialkliniken auf Mallorca.",
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
    popularSpecialties: {
      es: [
        "Circuitos de Spa",
        "Fisioterapia Avanzada",
        "Masajes Relajantes",
        "Medicina Estética",
        "Tratamientos Faciales",
      ],
      en: ["Spa Circuits", "Advanced Physiotherapy", "Relaxing Massages", "Aesthetic Medicine", "Facial Treatments"],
      ca: [
        "Circuits de Spa",
        "Fisioteràpia Avançada",
        "Massatges Relaxants",
        "Medicina Estètica",
        "Tractaments Facials",
      ],
      de: [
        "Spa-Rundgänge",
        "Fortgeschrittene Physiotherapie",
        "Entspannungsmassagen",
        "Ästhetische Medizin",
        "Gesichtsbehandlungen",
      ],
    },
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
      de: "Gastronomie & Privatköche",
    },
    description: {
      es: "Chefs a domicilio en villas, catering gourmet para eventos, catas de vino y restaurantes destacados.",
      en: "In-villa private chefs, gourmet event catering, wine tastings, and premier restaurants.",
      ca: "Xefs a domicili a vil·les, càtering gurmet per a esdeveniments, tasts de vins i restaurants destacats.",
      de: "Privatköche für Fincas und Villen, Gourmet-Catering für Feiern, Weinverkostungen und Spitzenrestaurants.",
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
    popularSpecialties: {
      es: [
        "Chef Privado en Villa",
        "Alta Cocina Mediterránea",
        "Catering para Bodas y Eventos",
        "Catas de Vino Balear",
        "Menús Degustación",
      ],
      en: [
        "In-Villa Private Chef",
        "Mediterranean Fine Dining",
        "Wedding & Event Catering",
        "Balearic Wine Tastings",
        "Tasting Menus",
      ],
      ca: [
        "Xef Privat a Vil·la",
        "Alta Cuina Mediterrània",
        "Càtering per a Casaments",
        "Tasts de Vins Balears",
        "Menús Degustació",
      ],
      de: [
        "Privatkoch in der Villa",
        "Mediterrane Spitzenküche",
        "Hochzeits- & Event-Catering",
        "Mallorquinische Weinproben",
        "Degustationsmenüs",
      ],
    },
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
      de: "VIP-Transfers & Chauffeur",
    },
    description: {
      es: "Transfers aeropuerto, chófer privado, alquiler de vehículos de alta gama y traslados ejecutivos.",
      en: "Airport transfers, private chauffeurs, high-end car rental, and executive transport.",
      ca: "Trasllats aeroport, xofer privat, lloguer de vehicles d'alta gamma i trasllats executius.",
      de: "Flughafentransfers, Privatchauffeur, Luxusautovermietung und Vorstandstransfers auf Mallorca.",
    },
    synonyms: [
      "transfer aeropuerto",
      "chofer privado",
      "alquiler coche lujo",
      "transporte vip",
      "limusina",
      "chauffeur mallorca",
    ],
    popularSpecialties: {
      es: [
        "Transfer Aeropuerto VIP",
        "Chófer Privado por Horas",
        "Alquiler Coches de Lujo",
        "Traslados Ejecutivos",
        "Flota Premium Mercedes",
      ],
      en: [
        "VIP Airport Transfers",
        "Private Chauffeur by the Hour",
        "Luxury Car Rental",
        "Executive Transport",
        "Mercedes Premium Fleet",
      ],
      ca: [
        "Trasllat Aeroport VIP",
        "Xofer Privat per Hores",
        "Lloguer Cotxes de Luxe",
        "Trasllats Executius",
        "Flota Premium Mercedes",
      ],
      de: [
        "VIP-Flughafentransfers",
        "Privatchauffeur auf Stundenbasis",
        "Luxusmietwagen",
        "Executive Transfers",
        "Premium Mercedes-Flotte",
      ],
    },
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
      de: "Anwälte & Steuerberatung",
    },
    description: {
      es: "Bufetes de abogados, asesoría jurídica internacional, gestorías fiscales y consultoría empresarial.",
      en: "Law firms, international legal advice, tax consultancy, and business management in Mallorca.",
      ca: "Bufets d'advocats, assessoria jurídica internacional, gestories fiscals i consultoria empresarial.",
      de: "Rechtsanwaltskanzleien, internationale Rechtsberatung, Steuergestoria und Unternehmensberatung auf Mallorca.",
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
    popularSpecialties: {
      es: [
        "Derecho Inmobiliario",
        "Fiscalidad Internacional",
        "Creación de Empresas",
        "Herencias y Testamentos",
        "Traducción Jurada",
      ],
      en: [
        "Real Estate Law",
        "International Taxation",
        "Company Formation",
        "Inheritance & Wills",
        "Sworn Translation",
      ],
      ca: [
        "Dret Immobiliari",
        "Fiscalitat Internacional",
        "Creació d'Empreses",
        "Herències i Testaments",
        "Traducció Jurada",
      ],
      de: [
        "Immobilienrecht",
        "Internationale Steuerberatung",
        "Firmengründung",
        "Erbrecht & Testamente",
        "Beeidigte Übersetzungen",
      ],
    },
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
      de: "Gartenpflege & Pools",
    },
    description: {
      es: "Diseño y mantenimiento de jardines mediterráneos, paisajismo, limpieza y cloración de piscinas.",
      en: "Mediterranean garden design & maintenance, landscaping, pool cleaning and water treatment.",
      ca: "Disseny i manteniment de jardins mediterranis, paisatgisme, neteja i manteniment de piscines.",
      de: "Planung und Pflege mediterraner Gärten, Landschaftsbau, Poolreinigung und Wasseraufbereitung.",
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
    popularSpecialties: {
      es: [
        "Mantenimiento de Jardines",
        "Diseño Paisajístico",
        "Tratamiento de Piscinas",
        "Riego Automático",
        "Poda de Palmeras",
      ],
      en: ["Garden Maintenance", "Landscape Design", "Pool Water Care", "Smart Irrigation", "Palm Tree Pruning"],
      ca: [
        "Manteniment de Jardins",
        "Disseny Paisatgístic",
        "Tractament de Piscines",
        "Reg Automàtic",
        "Poda de Palmeres",
      ],
      de: [
        "Garteninstandhaltung",
        "Landschaftsdesign",
        "Pool-Wasserpflege",
        "Automatische Bewässerung",
        "Palmenbeschnitt",
      ],
    },
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
      de: "Sicherheit & Smart Home",
    },
    description: {
      es: "Sistemas de alarma, videovigilancia, domótica residencial, redes Wi-Fi de alta velocidad e instalaciones inteligentes.",
      en: "Alarm systems, CCTV surveillance, smart home automation, high-speed Wi-Fi, and smart installations.",
      ca: "Sistemes d'alarma, videovigilància, domòtica residencial, xarxes Wi-Fi d'alta velocitat i instal·lacions intel·ligents.",
      de: "Alarmanlagen, Videoüberwachung (CCTV), Smart-Home-Gebäudeautomation, Highspeed-WLAN für Villen und IT-Installationen.",
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
    popularSpecialties: {
      es: [
        "Alarmas Conectadas a CRA",
        "CCTV Videovigilancia",
        "Domótica KNX / Control4",
        "Wi-Fi de Alta Potencia en Fincas",
        "Control de Accesos",
      ],
      en: [
        "Connected Alarm Systems",
        "CCTV Surveillance",
        "Smart Home KNX / Control4",
        "High-Power Villa Wi-Fi",
        "Access Control",
      ],
      ca: [
        "Alarmes Connectades a CRA",
        "CCTV Videovigilància",
        "Domòtica KNX / Control4",
        "Wi-Fi d'Alta Potència a Finques",
        "Control d'Accessos",
      ],
      de: [
        "Notruf-Aufgeschaltete Alarmanlagen",
        "CCTV Videoüberwachung",
        "Smart Home KNX / Control4",
        "High-Power Villen-WLAN",
        "Zutrittskontrollsysteme",
      ],
    },
    color: "#4f46e5",
  },
  {
    id: "deportes-fitness",
    slug: "deportes-fitness",
    sectorId: "deportes-aire-libre",
    icon: "🏋️",
    name: {
      es: "Deportes, Gimnasios & Fitness",
      en: "Sports, Gyms & Fitness",
      ca: "Esports, Gimnasos & Fitness",
      de: "Sport, Fitness & Gyms",
    },
    description: {
      es: "Centros deportivos, boxes de CrossFit, pistas de pádel y tenis, campos de golf, estudios de yoga y entrenadores personales en Mallorca.",
      en: "Sports clubs, CrossFit boxes, padel & tennis courts, golf courses, yoga studios, and personal trainers in Mallorca.",
      ca: "Centres esportius, boxes de CrossFit, pistes de pàdel i tennis, camps de golf, estudis de ioga i entrenadors personals a Mallorca.",
      de: "Sportzentren, CrossFit-Boxen, Padel- und Tennisplätze, Golfclubs, Yogastudios und Personal Trainer auf Mallorca.",
    },
    synonyms: [
      "gimnasio palma",
      "padel mallorca",
      "tenis mallorca",
      "crossfit",
      "golf mallorca",
      "yoga palma",
      "escalada rocodromo",
      "fitness centre",
      "sports club",
    ],
    popularSpecialties: {
      es: [
        "Pádel & Tenis (Pistas & Clases)",
        "Gimnasios & Musculación Technogym",
        "CrossFit & Entrenamiento Funcional",
        "Campos de Golf Championship 18 Hoyos",
        "Yoga Tradicional & Pilates Reformer",
        "Rocódromos & Escalada en Bloque",
        "Deportes Náuticos & Buceo PADI",
        "Cicloturismo & Alquiler de Bicicletas",
      ],
      en: [
        "Padel & Tennis (Courts & Coaching)",
        "Gyms & Technogym Strength Floors",
        "CrossFit & Functional Training",
        "18-Hole Championship Golf Courses",
        "Traditional Yoga & Reformer Pilates",
        "Bouldering & Indoor Climbing",
        "Water Sports & PADI Diving",
        "Pro Road Cycling & Bike Hire",
      ],
      ca: [
        "Pàdel i Tennis (Pistes i Classes)",
        "Gimnasos i Musculació",
        "CrossFit i Entrenament Funcional",
        "Camps de Golf de 18 Forats",
        "Ioga Tradicional i Pilates",
        "Rocòdroms i Escalada en Bloc",
        "Esports Nàutics i Busseig",
        "Cicloturisme i Lloguer de Bicicletes",
      ],
      de: [
        "Padel & Tennis (Plätze & Training)",
        "Fitnessstudios & Technogym Kraftbereich",
        "CrossFit & Functional Training",
        "18-Loch Meisterschafts-Golfplätze",
        "Traditionelles Yoga & Pilates",
        "Bouldern & Kletterhallen",
        "Wassersport & PADI Tauchkurse",
        "Rennradsport & Leihräder",
      ],
    },
    color: "#059669",
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
    const haystacks = [cat.id, cat.name.es, cat.name.en, cat.name.ca, cat.name.de, ...cat.synonyms].map(
      normalizeForSearch,
    );
    return haystacks.some((h) => h.includes(q) || q.includes(h));
  });
}
