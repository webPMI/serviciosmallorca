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
  {
    id: "hoteles-boutique-agroturismo",
    slug: "hoteles-boutique-agroturismo",
    sectorId: "alojamiento-turismo",
    icon: "🏨",
    name: {
      es: "Hoteles Boutique & Agroturismo",
      en: "Boutique Hotels & Agrotourism",
      ca: "Hotels Boutique & Agroturisme",
      de: "Boutique-Hotels & Fincahotels",
    },
    description: {
      es: "Hoteles boutique exclusivos, fincas rústicas señoriales, retiros de lujo y agroturismos en la naturaleza de Mallorca.",
      en: "Exclusive boutique hotels, historic manor estates, luxury retreats, and authentic agrotourism fincas in Mallorca.",
      ca: "Hotels boutique exclusius, finques rústiques senyorials i agroturismes a la natura de Mallorca.",
      de: "Exklusive Boutiquehotels, herrschaftliche Fincas, Luxusresorts und authentischer Agrotourismus auf Mallorca.",
    },
    synonyms: ["hotel boutique", "agroturismo", "finca hotel", "hotel rural", "finca mallorquina", "luxury retreat"],
    popularSpecialties: {
      es: ["Agroturismo de Lujo", "Hoteles en Palacios Históricos", "Retiros con Spa Privado", "Fincas con Viñedos"],
      en: ["Luxury Agrotourism", "Historic Palace Hotels", "Private Spa Retreats", "Vineyard Fincas"],
      ca: ["Agroturisme de Luxe", "Hotels a Palaus Històrics", "Retirs amb Spa Privat", "Finques amb Vinyes"],
      de: ["Luxus-Fincahotels", "Historische Palasthotels", "Private Spa-Resorts", "Weingut-Fincas"],
    },
    color: "#d97706",
  },
  {
    id: "guias-experiencias-tours",
    slug: "guias-experiencias-tours",
    sectorId: "alojamiento-turismo",
    icon: "🧭",
    name: {
      es: "Guías & Experiencias Turísticas",
      en: "Guides & Tour Experiences",
      ca: "Guies & Experiències Turístiques",
      de: "Guides & Tour-Erlebnisse",
    },
    description: {
      es: "Guías oficiales de montaña, vuelos en globo, paseos en helicóptero, tours culturales y experiencias exclusivas.",
      en: "Official mountain guides, hot air balloon flights, helicopter tours, cultural walks, and VIP private experiences.",
      ca: "Guies oficials de muntanya, vols en globus, helicòpter i experiències culturals a Mallorca.",
      de: "Staatlich geprüfte Bergführer, Ballonfahrten, Helikoptertouren und exklusive Kulturerlebnisse.",
    },
    synonyms: [
      "guias turisticos",
      "globo aerostatico",
      "vuelos en globo",
      "tour privado",
      "senderismo tramuntana",
      "experiencias mallorca",
    ],
    popularSpecialties: {
      es: [
        "Vuelos en Globo al Amanecer",
        "Guías GR-221 Tramuntana",
        "Tours Privados en Helicóptero",
        "Catas & Cultura",
      ],
      en: ["Sunrise Balloon Flights", "GR-221 Mountain Guides", "Private Helicopter Tours", "Tasting & Heritage"],
      ca: ["Vols en Globus a l'Alba", "Guies GR-221 Tramuntana", "Tours Privats en Helicòpter", "Tasts i Cultura"],
      de: ["Sonnenaufgang-Ballonfahrten", "GR-221 Bergführer", "Private Helikopterflüge", "Wein- & Kulturtouren"],
    },
    color: "#0284c7",
  },
  {
    id: "boutiques-moda-mallorca",
    slug: "boutiques-moda-mallorca",
    sectorId: "retail-comercio",
    icon: "👗",
    name: {
      es: "Boutiques, Moda & Joyería",
      en: "Boutiques, Fashion & Jewelry",
      ca: "Boutiques, Moda & Joieria",
      de: "Boutiquen, Mode & Schmuck",
    },
    description: {
      es: "Boutiques de alta costura, concept stores en palacios, joyería artesanal, relojería suiza y moda mediterránea.",
      en: "High-end fashion boutiques, historic palace concept stores, artisan fine jewelry, and Mediterranean designer wear.",
      ca: "Boutiques de moda, concept stores, joieria artesanal i moda mediterrània a Mallorca.",
      de: "Haute-Couture-Boutiquen, Concept-Stores in Stadtpalästen, handgefertigter Schmuck und mediterrane Designermode.",
    },
    synonyms: [
      "boutique moda",
      "joyeria palma",
      "relojeria lujo",
      "concept store",
      "moda mediterranea",
      "rialto living",
    ],
    popularSpecialties: {
      es: ["Concept Stores de Lujo", "Joyería y Relojería de Alta Gama", "Moda Sostenible", "Diseño Balear"],
      en: ["Luxury Concept Stores", "Fine Jewelry & Swiss Watches", "Sustainable Fashion", "Balearic Designers"],
      ca: ["Concept Stores de Luxe", "Joieria i Rellotgeria d'Alta Gamma", "Moda Sostenible", "Disseny Balear"],
      de: ["Luxus-Concept-Stores", "Feiner Schmuck & Schweizer Uhren", "Nachhaltige Mode", "Balearen-Design"],
    },
    color: "#ec4899",
  },
  {
    id: "decoracion-muebles-diseno",
    slug: "decoracion-muebles-diseno",
    sectorId: "retail-comercio",
    icon: "🛋️",
    name: {
      es: "Decoración, Muebles & Interiorismo",
      en: "Home Decor, Furniture & Interior Design",
      ca: "Decoració, Mobles & Interiorisme",
      de: "Wohnkultur, Möbel & Interior Design",
    },
    description: {
      es: "Showrooms de muebles de autor, estudios de interiorismo para villas, baños de lujo y telas de lenguas mallorquinas.",
      en: "Designer furniture showrooms, villa interior styling studios, luxury bathrooms, and bespoke decor.",
      ca: "Showrooms de mobles de disseny, estudis d'interiorisme per a vil·les i banys de luxe.",
      de: "Designermöbel-Showrooms, Innenarchitektur-Studios für Fincas und Luxusbäder.",
    },
    synonyms: ["muebles palma", "decoracion villas", "interiorismo mallorca", "banos de lujo", "telas mallorquinas"],
    popularSpecialties: {
      es: [
        "Mobiliario Exterior para Villas",
        "Baños en Piedra Natural",
        "Interiorismo Llave en Mano",
        "Iluminación Arquitectónica",
      ],
      en: ["Villa Outdoor Furniture", "Natural Stone Bathrooms", "Turnkey Interior Design", "Architectural Lighting"],
      ca: [
        "Mobiliari Exterior per a Vil·les",
        "Banys en Pedra Natural",
        "Interiorisme Claus en Mà",
        "Il·luminació Arquitectònica",
      ],
      de: [
        "Outdoor-Möbel für Villen",
        "Natursteinbäder",
        "Schlüsselfertiges Interior Design",
        "Architekturbeleuchtung",
      ],
    },
    color: "#8b5cf6",
  },
  {
    id: "escuelas-internacionales",
    slug: "escuelas-internacionales",
    sectorId: "educacion-formacion",
    icon: "🎓",
    name: {
      es: "Colegios Internacionales & Bachillerato IB",
      en: "International Schools & IB Diploma",
      ca: "Col·legis Internacionals & Batxillerat IB",
      de: "Internationale Schulen & IB-Abitur",
    },
    description: {
      es: "Colegios privados británicos, alemanes e internacionales con currículo IB, instalaciones deportivas y música.",
      en: "Premier British, German, and International IB schools offering bilingual education and Olympic sports facilities.",
      ca: "Col·legis privats internacionals amb Batxillerat IB i educació multilingüe a Mallorca.",
      de: "Britische, deutsche und internationale Privatschulen mit IB-Programm und Sportanlagen.",
    },
    synonyms: [
      "colegio britanico",
      "deutsche schule",
      "international school mallorca",
      "bachillerato internacional",
      "agora portals",
      "british school",
    ],
    popularSpecialties: {
      es: [
        "Bachillerato Internacional (IB)",
        "Currículo Británico (IGCSE / A-Levels)",
        "Educación Trilingüe",
        "Conservatorio de Música",
      ],
      en: [
        "International Baccalaureate (IB)",
        "British Curriculum (IGCSE / A-Levels)",
        "Trilingual Education",
        "Music Conservatory",
      ],
      ca: [
        "Batxillerat Internacional (IB)",
        "Currículum Britànic (A-Levels)",
        "Educació Trilingüe",
        "Conservatori de Música",
      ],
      de: [
        "Internationales Abitur (IB)",
        "Britisches Curriculum (A-Levels)",
        "Dreisprachiger Unterricht",
        "Musikkonservatorium",
      ],
    },
    color: "#2563eb",
  },
  {
    id: "academias-idiomas-formacion",
    slug: "academias-idiomas-formacion",
    sectorId: "educacion-formacion",
    icon: "📚",
    name: {
      es: "Academias de Idiomas & Formación Ejecutiva",
      en: "Language Academies & Executive Training",
      ca: "Acadèmies d'Idiomes & Formació Executiva",
      de: "Sprachakademien & Führungskräfte-Training",
    },
    description: {
      es: "Cursos intensivos de alemán, inglés y español para extranjeros, escuelas de negocios y másteres ejecutivos.",
      en: "Intensive German, English, and Spanish language schools, business institutes, and executive leadership programs.",
      ca: "Cursos d'alemany, anglès i espanyol per a estrangers i escoles de negocis a Palma.",
      de: "Intensivkurse für Deutsch, Spanisch und Englisch, Business Schools und Management-Weiterbildung.",
    },
    synonyms: [
      "aprender espanol mallorca",
      "deutsche sprachschule palma",
      "academia ingles",
      "business school mallorca",
      "clases aleman",
    ],
    popularSpecialties: {
      es: ["Español para Expats", "Alemán de Negocios", "Cursos Náuticos RYA / STCW", "Formación Directiva"],
      en: ["Spanish for Expats", "Business German", "RYA / STCW Maritime Courses", "Executive Leadership"],
      ca: ["Espanyol per a Residents", "Alemany de Negocis", "Cursos Nàutics RYA", "Formació Directiva"],
      de: ["Spanisch für Residenten", "Wirtschaftsdeutsch", "RYA / STCW Nautik-Kurse", "Executive Management"],
    },
    color: "#3b82f6",
  },
  {
    id: "beach-clubs-rooftops",
    slug: "beach-clubs-rooftops",
    sectorId: "entretenimiento-ocio",
    icon: "🍹",
    name: {
      es: "Beach Clubs & Rooftops Panorámicos",
      en: "Beach Clubs & Panoramic Rooftops",
      ca: "Beach Clubs & Rooftops Panoràmics",
      de: "Beach Clubs & Panorama-Rooftops",
    },
    description: {
      es: "Beach clubs sobre calas cristalinas, terrazas rooftop con vistas a la catedral y coctelería de autor frente al mar.",
      en: "Luxury seaside beach clubs, cathedral-view rooftop lounges, and signature cocktail terraces.",
      ca: "Beach clubs davant la mar, terrasses rooftop panoràmiques i cocteleria d'autor.",
      de: "Exklusive Strandclubs an kristallklaren Buchten, Kathedralen-Rooftops und Signature-Cocktails am Meer.",
    },
    synonyms: ["beach club", "rooftop palma", "purobeach", "gran folies", "camas balinesas", "sunset bar mallorca"],
    popularSpecialties: {
      es: ["Camas Balinesas Frente al Mar", "Sesiones Sunset DJ", "Coctelería de Autor", "Rooftops Históricos"],
      en: ["Seaside Balinese Beds", "Sunset DJ Sessions", "Signature Mixology", "Historic Rooftops"],
      ca: ["Llits Balinesos Davant la Mar", "Sessions Sunset DJ", "Cocteleria d'Autor", "Rooftops Històrics"],
      de: ["Balinesische Betten am Meer", "Sunset-DJ-Sessions", "Signature Cocktails", "Historische Dachterrassen"],
    },
    color: "#f59e0b",
  },
  {
    id: "eventos-bodas-musica",
    slug: "eventos-bodas-musica",
    sectorId: "entretenimiento-ocio",
    icon: "🎉",
    name: {
      es: "Organización de Bodas & Eventos Exclusivos",
      en: "Weddings & Luxury Event Management",
      ca: "Organització de Casaments & Esdeveniments",
      de: "Hochzeiten & Exklusives Eventmanagement",
    },
    description: {
      es: "Wedding planners especialistas en fincas señoriales, sonido e iluminación profesional y producción integral de eventos.",
      en: "Premier wedding planners for private finca ceremonies, concert sound & lighting, and turnkey event styling.",
      ca: "Wedding planners especialistes en finques històriques, so i il·luminació professional per a esdeveniments.",
      de: "Wedding Planner für historische Fincas, professionelle Ton- und Lichttechnik und Eventproduktion.",
    },
    synonyms: [
      "wedding planner mallorca",
      "bodas en fincas",
      "sonido eventos",
      "djs mallorca",
      "organizacion bodas lujo",
    ],
    popularSpecialties: {
      es: [
        "Bodas en Fincas Históricas",
        "Sonido e Iluminación Espectacular",
        "DJs Internacionales",
        "Coordinación Llave en Mano",
      ],
      en: ["Historic Finca Weddings", "Spectacular Sound & Lighting", "International DJs", "Turnkey Coordination"],
      ca: [
        "Casaments a Finques Històriques",
        "So i Il·luminació Espectacular",
        "DJs Internacionals",
        "Coordinació Llave en Mano",
      ],
      de: ["Finca-Hochzeiten", "Professionelle Eventtechnik", "Internationale DJs", "Komplettorganisation"],
    },
    color: "#ec4899",
  },
  {
    id: "golf-clubs-mallorca",
    slug: "golf-clubs-mallorca",
    sectorId: "deportes-aire-libre",
    icon: "⛳",
    name: {
      es: "Campos de Golf & Casas Club",
      en: "Championship Golf Courses & Clubhouses",
      ca: "Camps de Golf & Cases Club",
      de: "Meisterschafts-Golfplätze & Clubhäuser",
    },
    description: {
      es: "Campos de golf de 18 hoyos de nivel campeonato internacional (Alcanada, Son Gual, Son Vida, Andratx) y academias PGA.",
      en: "18-hole championship golf courses (Alcanada, Son Gual, Son Vida, Andratx) and certified PGA golf academies.",
      ca: "Camps de golf de 18 forats de nivell internacional i acadèmies PGA a Mallorca.",
      de: "18-Loch-Meisterschaftsgolfplätze (Alcanada, Son Gual, Son Vida, Andratx) und PGA-Akademien.",
    },
    synonyms: ["golf mallorca", "golf son gual", "golf alcanada", "golf andratx", "green fee mallorca", "pga academy"],
    popularSpecialties: {
      es: ["Green Fees 18 Hoyos Championship", "Buggies con GPS", "Academias de Golf PGA", "Torneos Corporativos"],
      en: ["18-Hole Championship Green Fees", "GPS-Equipped Buggies", "PGA Golf Academies", "Corporate Tournaments"],
      ca: ["Green Fees de 18 Forats", "Buggies amb GPS", "Acadèmies de Golf PGA", "Tornejos Corporatius"],
      de: ["18-Loch Championship Greenfees", "GPS-Golfcarts", "PGA-Golfakademien", "Firmenturniere"],
    },
    color: "#15803d",
  },
  {
    id: "padel-tenis-clubs",
    slug: "padel-tenis-clubs",
    sectorId: "deportes-aire-libre",
    icon: "🎾",
    name: {
      es: "Clubs de Pádel, Tenis & Raqueta",
      en: "Padel & Tennis Racket Clubs",
      ca: "Clubs de Pàdel, Tennis & Raqueta",
      de: "Padel- & Tennisclubs",
    },
    description: {
      es: "Pistas de pádel panorámicas, pistas de tenis de tierra batida, escuelas infantiles y torneos sociales en Mallorca.",
      en: "Panoramic padel courts, red clay tennis courts, coaching academies, and social tournament circuits.",
      ca: "Pistes de pàdel panoràmiques, pistes de tennis de terra batuda i acadèmies de raqueta.",
      de: "Panorama-Padelplätze, Sand-Tennisplätze, Tennisschulen und Clubturniere.",
    },
    synonyms: ["padel palma", "tenis calvia", "pistas padel", "clases tenis", "pins padel", "sporting portals"],
    popularSpecialties: {
      es: [
        "Pistas Panorámicas con Iluminación LED",
        "Tierra Batida de Competición",
        "Clases Particulares",
        "Ligas Sociales",
      ],
      en: ["Panoramic LED Courts", "Tournament Clay Courts", "Private Coaching", "Social Leagues"],
      ca: ["Pistes Panoràmiques LED", "Terra Batuda de Competició", "Classes Particulars", "Lligues Socials"],
      de: ["LED-Panoramaplätze", "Turnier-Sandplätze", "Einzeltraining", "Club-Ligen"],
    },
    color: "#16a34a",
  },
  {
    id: "ciclismo-bike-rental",
    slug: "ciclismo-bike-rental",
    sectorId: "deportes-aire-libre",
    icon: "🚴",
    name: {
      es: "Cicloturismo & Alquiler de Bicicletas Pro",
      en: "Road Cycling & Pro Bike Rentals",
      ca: "Cicloturisme & Lloguer de Bicicletes",
      de: "Radsport & Profi-Fahrradverleih",
    },
    description: {
      es: "Alquiler de bicicletas de carretera de carbono (Pinarello, Specialized), entrega en villas y rutas guiadas por Sa Calobra.",
      en: "High-end carbon road bike rentals (Pinarello, Specialized), villa delivery, and guided Sa Calobra rides.",
      ca: "Lloguer de bicicletes de carboni d'alta gamma, lliurament a vil·les i rutes guiades per Sa Calobra.",
      de: "Carbon-Rennradverleih (Pinarello, Specialized), Insellieferung und geführte Touren nach Sa Calobra.",
    },
    synonyms: [
      "alquiler bicicleta mallorca",
      "bike rental pollensa",
      "pinarello mallorca",
      "ciclismo tramuntana",
      "bicicletas carretera",
    ],
    popularSpecialties: {
      es: [
        "Bicicletas de Carbono con Shimano Di2",
        "Entrega y Recogida en Fincas",
        "Ajuste Biomecánico (Bike Fitting)",
        "Guías para Sa Calobra",
      ],
      en: [
        "Shimano Di2 Carbon Road Bikes",
        "In-Villa Delivery & Pickup",
        "Professional Bike Fitting",
        "Sa Calobra Guided Rides",
      ],
      ca: ["Bicicletes de Carboni Di2", "Lliurament a Finques", "Ajust Biomecànic", "Guies per a Sa Calobra"],
      de: [
        "Shimano Di2 Carbon-Rennräder",
        "Lieferung zur Finca",
        "Professionelles Bike-Fitting",
        "Sa Calobra Tourguides",
      ],
    },
    color: "#059669",
  },
  {
    id: "gimnasios-crossfit-mallorca",
    slug: "gimnasios-crossfit-mallorca",
    sectorId: "deportes-aire-libre",
    icon: "🏋️",
    name: {
      es: "Gimnasios, CrossFit & Pilates Reformer",
      en: "Gyms, CrossFit Boxes & Reformer Pilates",
      ca: "Gimnasos, CrossFit & Pilates Reformer",
      de: "Fitnessstudios, CrossFit & Reformer Pilates",
    },
    description: {
      es: "Boxes oficiales de CrossFit, estudios boutique de Pilates Reformer, equipamiento Technogym y entrenadores personales.",
      en: "Official CrossFit boxes, boutique Reformer Pilates studios, Technogym strength centers, and personal fitness coaching.",
      ca: "Boxes de CrossFit, estudis de Pilates Reformer i gimnasos d'alta gamma a Mallorca.",
      de: "Offizielle CrossFit-Boxen, Reformer-Pilates-Studios, Technogym-Fitnessclubs und Personal Training.",
    },
    synonyms: [
      "crossfit santa ponsa",
      "pilates reformer palma",
      "gimnasio de lujo",
      "entrenador personal",
      "studio reformer",
    ],
    popularSpecialties: {
      es: [
        "Pilates Reformer en Máquinas Allegro",
        "CrossFit Certificado",
        "Entrenamiento Funcional en Villa",
        "Zona de Musculación VIP",
      ],
      en: ["Allegro Reformer Pilates", "Certified CrossFit WODs", "In-Villa Personal Training", "VIP Strength Floor"],
      ca: ["Pilates Reformer amb Màquines", "CrossFit Certificat", "Entrenament Personal a Vil·la", "Gimnàs VIP"],
      de: ["Allegro Reformer Pilates", "Zertifiziertes CrossFit", "Personal Training in der Finca", "VIP-Kraftbereich"],
    },
    color: "#0d9488",
  },
  {
    id: "limpieza-villas-fincas",
    slug: "limpieza-villas-fincas",
    sectorId: "hogar-limpieza",
    icon: "🧹",
    name: {
      es: "Limpieza Integral de Villas & Fincas",
      en: "Luxury Villa & Finca Housekeeping",
      ca: "Neteja Integral de Vil·les & Finques",
      de: "Luxusvillen- & Finca-Reinigung",
    },
    description: {
      es: "Servicio de limpieza profesional para villas de lujo, cambios de huéspedes vacacionales, fin de obra y cuidado de textiles nobles.",
      en: "Professional luxury villa housekeeping, holiday changeovers, post-construction deep cleaning, and fine fabrics care.",
      ca: "Servei de neteja professional per a vil·les d'alt standing, canvis de convidats i final d'obra.",
      de: "Professionelle Villenreinigung, Gästewechsel-Service, Bauendreinigung und Pflege hochwertiger Materialien.",
    },
    synonyms: [
      "limpieza villas",
      "housekeeping mallorca",
      "limpieza fincas",
      "limpieza cristales altura",
      "limpieza fin de obra",
    ],
    popularSpecialties: {
      es: [
        "Turnaround de Huéspedes Vacacionales",
        "Limpieza de Fin de Obra",
        "Tratamiento de Suelos de Piedra y Marès",
        "Personal Uniformado y Asegurado",
      ],
      en: [
        "Holiday Guest Turnarounds",
        "Post-Construction Deep Cleans",
        "Natural Stone & Marès Floor Treatment",
        "Insured Uniformed Staff",
      ],
      ca: [
        "Canvi de Convidats Vacacionals",
        "Neteja de Final d'Obra",
        "Tractament de Marès i Pedra Natural",
        "Personal Assegurat",
      ],
      de: ["Gästewechsel-Service", "Bauendreinigung", "Naturstein- und Marès-Pflege", "Versichertes Fachpersonal"],
    },
    color: "#0284c7",
  },
  {
    id: "mudanzas-guardamuebles",
    slug: "mudanzas-guardamuebles",
    sectorId: "hogar-limpieza",
    icon: "📦",
    name: {
      es: "Mudanzas Nacionales, Internacionales & Guardamuebles",
      en: "Removals, International Relocations & Storage",
      ca: "Mudances & Guardamobles",
      de: "Umzüge, Internationale Spedition & Lagerung",
    },
    description: {
      es: "Mudanzas a Baleares y Europa, transporte de obras de arte, guardamuebles vigilados y embalajes de alta protección.",
      en: "Mainland & international relocations, fine art transport, climate-controlled secure storage, and custom packing.",
      ca: "Mudances nacionals i internacionals, transport d'obres d'art i guardamobles vigilats a Mallorca.",
      de: "Insel- und Auslandsumzüge, Kunsttransporte, videoüberwachte Möbellagerung und Spezialverpackungen.",
    },
    synonyms: [
      "mudanzas mallorca",
      "guardamuebles palma",
      "mudanza internacional",
      "transporte arte",
      "relocation mallorca",
    ],
    popularSpecialties: {
      es: [
        "Mudanzas Europa-Mallorca",
        "Transporte Especializado de Arte",
        "Guardamuebles Climatizado",
        "Grúas Elevadoras de Fachada",
      ],
      en: [
        "Europe-to-Mallorca Relocations",
        "Fine Art Specialized Handling",
        "Climate-Controlled Storage",
        "Facade Furniture Lifts",
      ],
      ca: ["Mudances Europa-Mallorca", "Transport d'Art", "Guardamobles Climatitzat", "Grues Elevadores"],
      de: ["Umzüge Deutschland-Mallorca", "Kunstspedition", "Klimatisierte Möbellagerung", "Möbellift-Einsatz"],
    },
    color: "#6366f1",
  },
  {
    id: "control-plagas-desinfeccion",
    slug: "control-plagas-desinfeccion",
    sectorId: "hogar-limpieza",
    icon: "🌴",
    name: {
      es: "Tratamiento de Palmeras & Control de Plagas",
      en: "Palm Tree Care & Eco Pest Control",
      ca: "Cura de Palmeres & Control de Plagues",
      de: "Palmenpflege & Schädlingsbekämpfung",
    },
    description: {
      es: "Tratamiento fitosanitario contra el picudo rojo en palmeras, endoterapia vegetal, control de plagas en fincas y desinfección.",
      en: "Red palm weevil microinjection treatments, eco-friendly finca pest control, and specialized tree protection.",
      ca: "Tractament contra el morrut roig a palmeres, endoteràpia vegetal i control de plagues a finques.",
      de: "Bekämpfung des Roten Palmrüsslers, Bauminjektionen (Endotherapie) und biologische Schädlingskontrolle.",
    },
    synonyms: [
      "picudo rojo",
      "salvar palmeras mallorca",
      "fumigacion fincas",
      "control de plagas",
      "endoterapia palmeras",
    ],
    popularSpecialties: {
      es: [
        "Endoterapia contra Picudo Rojo",
        "Tratamientos Ecológicos en Jardines",
        "Desinfección de Piscinas y Aljibes",
        "Protección de Pinos contra Procesionaria",
      ],
      en: [
        "Red Palm Weevil Endotherapy",
        "Eco-Friendly Garden Treatments",
        "Water Cistern Disinfection",
        "Pine Processionary Moth Defense",
      ],
      ca: [
        "Endoteràpia contra Morrut Roig",
        "Tractaments Ecològics a Jardins",
        "Desinfecció d'Aljubs",
        "Protecció contra Processonària",
      ],
      de: [
        "Palmrüssler-Endotherapie",
        "Biologische Gartenpflege",
        "Zisternen-Desinfektion",
        "Prozessionsspinner-Bekämpfung",
      ],
    },
    color: "#15803d",
  },
  {
    id: "clinicas-veterinarias-24h",
    slug: "clinicas-veterinarias-24h",
    sectorId: "mascotas-veterinaria",
    icon: "🏥",
    name: {
      es: "Hospitales & Clínicas Veterinarias 24h",
      en: "24/7 Veterinary Hospitals & Clinics",
      ca: "Hospitals & Clíniques Veterinàries 24h",
      de: "24h-Tierkliniken & Tierarztpraxen",
    },
    description: {
      es: "Hospitales veterinarios con urgencias 24 horas, quirófanos de alta tecnología, TAC, UCI y veterinarios multilingües.",
      en: "24/7 emergency animal hospitals equipped with CT scanners, ICU, laparoscopic surgery, and multilingual veterinarians.",
      ca: "Hospitals veterinaris amb urgències 24 hores, TAC, UCI i cirurgia avançada a Mallorca.",
      de: "Tierkliniken mit 24h-Notaufnahme, eigenem CT, Intensivstation und mehrsprachigen Tierärzten.",
    },
    synonyms: [
      "veterinario 24 horas",
      "hospital veterinario palma",
      "urgencias animales",
      "arago veterinari",
      "canis mallorca",
      "veterinario port portals",
    ],
    popularSpecialties: {
      es: [
        "Urgencias Veterinarias 24 Horas",
        "Diagnóstico por Imagen TAC y Ecografía",
        "Traumatología y Cirugía Avanzada",
        "Hospitalización en UCI",
      ],
      en: [
        "24/7 Emergency Veterinary Care",
        "CT & Ultrasound Advanced Diagnostics",
        "Orthopedics & Soft Tissue Surgery",
        "ICU Intensive Inpatient Care",
      ],
      ca: [
        "Urgències Veterinàries 24 Hores",
        "Diagnòstic per TAC i Ecografia",
        "Traumatologia i Cirurgia",
        "Hospitalització a UCI",
      ],
      de: [
        "24-Stunden-Tiernotdienst",
        "CT- und Ultraschalldiagnostik",
        "Orthopädische Chirurgie",
        "Intensivstation-Betreuung",
      ],
    },
    color: "#e11d48",
  },
  {
    id: "hoteles-adiestramiento-canino",
    slug: "hoteles-adiestramiento-canino",
    sectorId: "mascotas-veterinaria",
    icon: "🐕",
    name: {
      es: "Residencias Caninas, Dog Resorts & Adiestramiento",
      en: "Dog Resorts, Boarding Kennels & Training",
      ca: "Residències Canines & Ensinistrament",
      de: "Hundehotels, Hundepensionen & Training",
    },
    description: {
      es: "Residencias caninas de campo con suites individuales, piscina para perros, adiestramiento en positivo y traslados VIP.",
      en: "Luxury countryside dog boarding resorts featuring private suites, doggy pools, positive training, and pet taxi.",
      ca: "Residències canines de camp amb suites individuals, piscina per a cans i ensinistrament en positiu.",
      de: "Hunde-Resorts auf dem Land mit Einzelsuiten, Hundepool, gewaltfreiem Training und Tiertaxi.",
    },
    synonyms: [
      "hotel canino mallorca",
      "residencia perros",
      "adiestrador canino",
      "dog resort llucmajor",
      "guarderia perros",
    ],
    popularSpecialties: {
      es: [
        "Suites Caninas con Jardín Privado",
        "Piscina y Fisioterapia Hidroterápica",
        "Modificación de Conducta y Adiestramiento",
        "Servicio Pet Taxi en Toda la Isla",
      ],
      en: [
        "Private Garden Dog Suites",
        "Canine Hydrotherapy Pool",
        "Behavior Modification & Training",
        "Island-Wide Pet Taxi Service",
      ],
      ca: ["Suites Canines amb Jardí Privat", "Piscina per a Cans", "Ensinistrament en Positiu", "Servei de Pet Taxi"],
      de: [
        "Hundesuiten mit eigenem Garten",
        "Hydrotherapie-Hundepool",
        "Verhaltenstraining",
        "Inselweiter Tiertaxi-Service",
      ],
    },
    color: "#ea580c",
  },
  {
    id: "peluqueria-estetica-canina",
    slug: "peluqueria-estetica-canina",
    sectorId: "mascotas-veterinaria",
    icon: "✂️",
    name: {
      es: "Peluquería Canina & Spa de Mascotas",
      en: "Pet Grooming & Canine Spa",
      ca: "Perruqueria Canina & Spa de Mascotes",
      de: "Hundefriseur & Tier-Spa",
    },
    description: {
      es: "Estilismo canino profesional, corte a tijera y stripping, baños de ozono y cosmética natural vegana para mascotas.",
      en: "Professional breed-standard styling, hand stripping, scissor trims, ozone baths, and organic vegan pet cosmetics.",
      ca: "Estilisme caní professional, tall a tisora, banys d'ozó i cosmètica natural per a mascotes.",
      de: "Fachgerechte Hundepflege, Scherenschnitt, Hand-Stripping, Ozonbäder und Bio-Pflegeprodukte.",
    },
    synonyms: [
      "peluqueria canina palma",
      "pet spa santa catalina",
      "corte pelo perro",
      "bano ozono perros",
      "stripping canino",
    ],
    popularSpecialties: {
      es: [
        "Corte a Tijera según Estándar de Raza",
        "Baños de Ozono para Pieles Sensibles",
        "Hand Stripping Profesional",
        "Tratamientos de Queratina e Hidratación",
      ],
      en: [
        "Breed-Specific Scissor Styling",
        "Ozone Baths for Sensitive Skin",
        "Professional Hand Stripping",
        "Keratin & Hydration Coats",
      ],
      ca: [
        "Tall a Tisora per a Races",
        "Banys d'Ozó per a Pell Sensible",
        "Stripping Professional",
        "Tractaments d'Hidratació",
      ],
      de: [
        "Rassespezifischer Scherenschnitt",
        "Ozonbäder bei Hautproblemen",
        "Professionelles Handstripping",
        "Keratin- & Feuchtigkeitspflege",
      ],
    },
    color: "#f43f5e",
  },
  {
    id: "bodegas-enoturismo",
    slug: "bodegas-enoturismo",
    sectorId: "agricultura-productores",
    icon: "🍷",
    name: {
      es: "Bodegas, Viñedos & Enoturismo",
      en: "Wineries, Vineyards & Enotourism",
      ca: "Cellers, Vinyes & Enoturisme",
      de: "Weingüter, Weinberge & Weintourismus",
    },
    description: {
      es: "Bodegas históricas de Binissalem y Pla i Llevant, vinos de variedades autóctonas (Manto Negro, Callet, Prensal) y catas privadas.",
      en: "Historic wineries in Binissalem and Pla i Llevant crafting indigenous grape wines (Manto Negro, Callet, Prensal) with private tastings.",
      ca: "Cellers històrics de Binissalem i Pla i Llevant, vins de varietats autòctones i tasts privats a Mallorca.",
      de: "Traditionsweingüter in Binissalem und Pla i Llevant mit autochthonen Weinen und privaten Verkostungen.",
    },
    synonyms: [
      "bodegas mallorca",
      "cata de vinos binissalem",
      "enoturismo",
      "bodega ribas",
      "bodegas jose l ferrer",
      "4 kilos vinicola",
    ],
    popularSpecialties: {
      es: [
        "Catas Privadas de Vinos de Autor",
        "Visitas Guiadas por Viñedos Centenarios",
        "Vinos Ecológicos Certificados",
        "Eventos y Maridajes en Bodega",
      ],
      en: [
        "Private Signature Wine Tastings",
        "Centenary Vineyard Guided Tours",
        "Certified Organic Wines",
        "Winery Pairings & Events",
      ],
      ca: [
        "Tasts Privats de Vins d'Autor",
        "Visites a Vinyes Centenàries",
        "Vins Ecològics Certificats",
        "Maridatges al Celler",
      ],
      de: [
        "Exklusive Weinverkostungen",
        "Führungen durch uralte Weinberge",
        "Zertifizierte Bio-Weine",
        "Gourmet-Weinabende auf dem Gut",
      ],
    },
    color: "#be123c",
  },
  {
    id: "aceite-oliva-almazaras",
    slug: "aceite-oliva-almazaras",
    sectorId: "agricultura-productores",
    icon: "🫒",
    name: {
      es: "Almazaras & Aceite de Oliva D.O. Mallorca",
      en: "Olive Oil Mills & D.O. Mallorca Extra Virgin",
      ca: "Molins d'Oli & Oli de Mallorca D.O.",
      de: "Ölmühlen & D.O. Mallorca Olivenöl",
    },
    description: {
      es: "Productores de Aceite de Oliva Virgen Extra con Denominación de Origen Oli de Mallorca, olivares milenarios y catas de aceite.",
      en: "Producers of Extra Virgin Olive Oil with the Oli de Mallorca D.O. seal, ancient olive groves, and oil tasting tours.",
      ca: "Productors d'Oli d'Oliva Verge Extra amb D.O. Oli de Mallorca, oliveres mil·lenàries i tasts d'oli.",
      de: "Hersteller von nativem Olivenöl extra mit geschützter Herkunftsbezeichnung D.O. Oli de Mallorca.",
    },
    synonyms: [
      "aceite de oliva mallorca",
      "oli de mallorca",
      "almazara",
      "oli solivellas",
      "son moragues valldemossa",
      "olivos milenarios",
    ],
    popularSpecialties: {
      es: [
        "Aceite de Oliva Virgen Extra D.O. Oli de Mallorca",
        "Olivares Centenarios de la Serra de Tramuntana",
        "Cosecha Temprana y Prensado en Frío",
        "Catas y Experiencias Oleoturísticas",
      ],
      en: [
        "D.O. Oli de Mallorca Extra Virgin Olive Oil",
        "Centenary Tramuntana Mountain Groves",
        "Early Harvest Cold Extraction",
        "Olive Oil Tasting Tours",
      ],
      ca: [
        "Oli d'Oliva Verge Extra D.O. Oli de Mallorca",
        "Oliverars Centenaris de Tramuntana",
        "Collita Primerenca i Premsat en Fred",
        "Tasts d'Oli",
      ],
      de: [
        "D.O. Oli de Mallorca Natives Olivenöl Extra",
        "Hundertjährige Olivenhaine im Gebirge",
        "Kaltgepresste Frühernte",
        "Olivenöl-Verkostungstouren",
      ],
    },
    color: "#65a30d",
  },
  {
    id: "queserias-producto-km0",
    slug: "queserias-producto-km0",
    sectorId: "agricultura-productores",
    icon: "🧀",
    name: {
      es: "Queserías Artesanas & Productos Km 0",
      en: "Artisan Cheesemakers & Km 0 Island Produce",
      ca: "Formatgeries Artesanes & Productes Km 0",
      de: "Käsereien & Regionale Inselprodukte Km 0",
    },
    description: {
      es: "Quesos artesanos de oveja roja mallorquina, sobrasada de Porc Negre con I.G.P., flor de sal marina y productos de huerta ecológica.",
      en: "Handcrafted cheeses from indigenous red sheep, black pig Sobrassada with P.G.I. seal, sea salt flakes, and organic farm produce.",
      ca: "Formatges artesans d'ovella roja, sobrassada de Porc Negre amb I.G.P., flor de sal marina i productes de la terra.",
      de: "Handwerklicher Schafskäse, traditionelle Porc-Negre-Sobrassada mit g.g.A., Meersalzflocken und Bio-Inselgemüse.",
    },
    synonyms: [
      "sobrasada porc negre",
      "queso mallorca",
      "flor de sal es trenc",
      "can company",
      "producto km0",
      "formatges de mallorca",
    ],
    popularSpecialties: {
      es: [
        "Sobrassada de Porc Negre de Mallorca (I.G.P.)",
        "Formatge d'Ovella Roja Mallorquina",
        "Flor de Sal Marina Natural d'Es Trenc",
        "Embutidos Artesanos Curados",
      ],
      en: [
        "P.G.I. Mallorcan Black Pig Sobrassada",
        "Indigenous Red Sheep Artisan Cheese",
        "Es Trenc Natural Sea Salt Crystals",
        "Traditional Cured Charcuterie",
      ],
      ca: [
        "Sobrassada de Porc Negre de Mallorca (I.G.P.)",
        "Formatge d'Ovella Roja de Mallorca",
        "Flor de Sal d'Es Trenc",
        "Embotits Artesans Curats",
      ],
      de: [
        "Geschützte Porc-Negre-Sobrassada",
        "Mallorquinischer Schafskäse",
        "Flor de Sal d'Es Trenc Meersalz",
        "Handwerkliche Wurstspezialitäten",
      ],
    },
    color: "#ca8a04",
  },
  {
    id: "carpinteria-piedra-tradicional",
    slug: "carpinteria-piedra-tradicional",
    sectorId: "artesania-manufactura",
    icon: "🏛️",
    name: {
      es: "Cantería, Piedra de Santanyí & Marès",
      en: "Stonemasonry, Santanyí Stone & Marès",
      ca: "Picapedrers, Pedra de Santanyí & Marès",
      de: "Steinmetzkunst, Santanyí-Naturstein & Marès",
    },
    description: {
      es: "Maestros picapedrers y canteros especializados en extracción y talla de auténtica piedra dorada de Santanyí y marès para villas.",
      en: "Master stonemasons specializing in authentic golden Santanyí sandstone quarrying, hand carving, and architectural stone arches.",
      ca: "Mestres picapedrers especialitzats en extracció i talla de pedra de Santanyí i marès per a vil·les i finques.",
      de: "Steinmetzmeisterwerkstätten für Abbau und Handbearbeitung des originalen goldenen Santanyí-Natursteins und Marès-Kalksteins.",
    },
    synonyms: [
      "pedra de santanyi",
      "picapedrers mallorca",
      "canteras santanyi",
      "mares mallorca",
      "columnas y arcos piedra",
      "fachadas de piedra",
    ],
    popularSpecialties: {
      es: [
        "Arcos de Medio Punto y Columnas en Piedra de Santanyí",
        "Revestimientos Rústicos de Fachadas",
        "Chimeneas Esculpidas a Medida",
        "Suministro Directo de Cantera",
      ],
      en: [
        "Santanyí Sandstone Arches & Columns",
        "Rustic Exterior Stone Cladding",
        "Custom Hand-Carved Fireplaces",
        "Direct Quarry Supply",
      ],
      ca: [
        "Arcs de Mig Punt i Columnes de Santanyí",
        "Revestiments Rústics de Façanes",
        "Xemeneies Esculpides a Mida",
        "Subministrament de Cantera",
      ],
      de: [
        "Rundbögen und Säulen aus Santanyí-Stein",
        "Rustikale Naturstein-Fassaden",
        "Handbehauene Kaminumrandungen",
        "Direktlieferung aus dem Steinbruch",
      ],
    },
    color: "#78716c",
  },
  {
    id: "vidrio-ceramica-artesanal",
    slug: "vidrio-ceramica-artesanal",
    sectorId: "artesania-manufactura",
    icon: "🏺",
    name: {
      es: "Vidrio Soplado & Cerámica de Pòrtol",
      en: "Blown Glass & Traditional Pòrtol Ceramics",
      ca: "Vidre Bufat & Ceràmica de Pòrtol",
      de: "Mundgeblasenes Glas & Pòrtol-Keramik",
    },
    description: {
      es: "Talleres históricos de vidrio soplado artesanal (Lafiore) y alfarerías tradicionales de barro rojo en Pòrtol y Marratxí.",
      en: "Centenary hand-blown glass studios (Lafiore) and traditional red clay pottery workshops in Pòrtol and Marratxí.",
      ca: "Tallers històrics de vidre bufat artesanal i terrisseries tradicionals a Pòrtol i Marratxí.",
      de: "Traditionelle Glasbläsereien (Lafiore) und Töpfereien für roten Ton in Pòrtol und Marratxí.",
    },
    synonyms: [
      "vidrio soplado mallorca",
      "ceramica portol",
      "lafiore",
      "terra cuita",
      "siurells",
      "alfareria mallorca",
    ],
    popularSpecialties: {
      es: [
        "Piezas de Vidrio Soplado Artístico",
        "Vajillas Rústicas y Greixoneres de Barro",
        "Siurells Tradicionales Pintados a Mano",
        "Talleres Demostrativos en Directo",
      ],
      en: [
        "Artisan Hand-Blown Glass Vases",
        "Traditional Red Clay Cookware (Greixoneres)",
        "Hand-Painted Traditional Siurells",
        "Live Master Glassblowing Workshops",
      ],
      ca: [
        "Peces de Vidre Bufat Artístic",
        "Greixoneres de Fang Tradicionals",
        "Siurells Pintats a Mà",
        "Demostracions al Taller",
      ],
      de: [
        "Mundgeblasene Glaskunst",
        "Traditionelle Greixonera-Tonpfannen",
        "Handbemalte Siurell-Tonpfeifen",
        "Glasbläser-Vorführungen vor Ort",
      ],
    },
    color: "#0891b2",
  },
  {
    id: "calzado-piel-inca-artesania",
    slug: "calzado-piel-inca-artesania",
    sectorId: "artesania-manufactura",
    icon: "👞",
    name: {
      es: "Zapateros Artesanos & Robes de Llengües",
      en: "Bespoke Shoemakers & Ikat Fabrics (Robes de Llengües)",
      ca: "Sabaters Artesans & Robes de Llengües",
      de: "Maßschuhmacher & Mallorquinische Zungenstoffe",
    },
    description: {
      es: "Calzado de lujo cosido Goodyear en Inca (Carmina Shoemaker) y tejidos tradicionales de lenguas mallorquinas con tinte manual (Teixits Vicens).",
      en: "World-class Goodyear-welted leather footwear crafted in Inca (Carmina) and heritage hand-dyed Ikat fabrics (Teixits Vicens).",
      ca: "Sabates de luxe Goodyear fetes a Inca (Carmina) i robes de llengües tenyides a mà a Pollença (Teixits Vicens).",
      de: "Rahmengenähte Luxus-Lederschuhe (Goodyear) aus Inca (Carmina) und handgefärbte Zungenstoffe (Ikat) aus Pollença (Teixits Vicens).",
    },
    synonyms: [
      "carmina shoemaker",
      "teixits vicens",
      "zapatos inca",
      "robes de llengues",
      "telas lenguas pollensa",
      "calzado artesanal mallorca",
    ],
    popularSpecialties: {
      es: [
        "Zapatos Goodyear Welted de Alta Gama",
        "Telas de Lenguas Mallorquinas Tejidas en Telar",
        "Tapicería Tradicional para Villas",
        "Marroquinería Artesanal en Piel Noble",
      ],
      en: [
        "Luxury Goodyear-Welted Shoes",
        "Hand-Woven Ikat Fabrics",
        "Heritage Finca Upholstery",
        "Fine Leather Goods & Accessories",
      ],
      ca: [
        "Sabates Goodyear d'Alta Gamma",
        "Robes de Llengües Fetes al Teler",
        "Tapisseria Tradicional per a Vil·les",
        "Marroquineria de Pell Noble",
      ],
      de: [
        "Rahmengenähte Goodyear-Schuhe",
        "Handgewebte mallorquinische Ikat-Stoffe",
        "Traditionelle Polsterungen für Fincas",
        "Feine Lederwaren",
      ],
    },
    color: "#b45309",
  },
  {
    id: "cuidado-mayores-asistencia",
    slug: "cuidado-mayores-asistencia",
    sectorId: "servicios-sociales",
    icon: "🤝",
    name: {
      es: "Cuidado de Mayores & Enfermería a Domicilio",
      en: "Senior Home Care & Private Nursing",
      ca: "Cura de Majors & Infermeria a Domicili",
      de: "Seniorenbetreuung & Häusliche Krankenpflege",
    },
    description: {
      es: "Cuidadores internos y por horas, enfermería privada a domicilio, acompañamiento médico y residencias senior de alto confort.",
      en: "Live-in and hourly caregivers, private in-home nursing, multilingual medical accompaniment, and luxury senior residences.",
      ca: "Cuidadors interns i per hores, infermeria a domicili i residències de majors d'alt confort a Mallorca.",
      de: "24h-Pflegekräfte, mobile Krankenschwestern, deutschsprachige Arztbegleitung und Premium-Seniorenresidenzen.",
    },
    synonyms: [
      "cuidado mayores mallorca",
      "enfermera domicilio",
      "cuidadora interna",
      "residencia mayores",
      "asistencia domiciliaria",
      "senior care",
    ],
    popularSpecialties: {
      es: [
        "Cuidadores Internos y 24 Horas Multilingües",
        "Enfermería Privada a Domicilio",
        "Acompañamiento a Citas Médicas y Gestiones",
        "Centros Residenciales de Alto Confort",
      ],
      en: [
        "24/7 Multilingual Live-In Caregivers",
        "Private In-Home Nursing Care",
        "Medical Appointment Accompaniment",
        "Luxury Senior Living Facilities",
      ],
      ca: [
        "Cuidadors Interns i 24 Hores Multilingües",
        "Infermeria Privada a Domicili",
        "Acompanyament a Metges",
        "Residències de Majors d'Alt Confort",
      ],
      de: [
        "Mehrsprachige 24h-Pflegekräfte",
        "Häusliche Krankenpflege",
        "Begleitung zu Arztterminen",
        "Exklusive Seniorenresidenzen",
      ],
    },
    color: "#059669",
  },
  {
    id: "guarderias-infantil-canguros",
    slug: "guarderias-infantil-canguros",
    sectorId: "servicios-sociales",
    icon: "👶",
    name: {
      es: "Guarderías Bilingües & Nannies en Villas",
      en: "Bilingual Nurseries & In-Villa Nannies",
      ca: "Escoles Bressol Bilingües & Cangurs a Vil·les",
      de: "Zweisprachige Kitas & Villa-Nannies",
    },
    description: {
      es: "Nannies bilingües cualificadas para cuidado infantil en villas, escuelas infantiles 0-3 años y canguros de confianza.",
      en: "Qualified bilingual nannies for in-villa childcare, certified 0-3 years nurseries, and background-checked babysitters.",
      ca: "Cangurs bilingües titulades per a cura infantil a vil·les i escoles bressol a Palma.",
      de: "Qualifizierte zweisprachige Nannies für die Finca-Kinderbetreuung, Kitas und geprüfte Babysitter.",
    },
    synonyms: ["nanny mallorca", "canguro en villa", "guarderia bilingue", "babysitter palma", "cuidado ninos villas"],
    popularSpecialties: {
      es: [
        "Nannies Bilingües para Fincas y Hoteles",
        "Escuelas Infantiles Bilingües",
        "Cuidado Infantil para Bodas y Eventos",
        "Personal con Certificado de Primeros Auxilios",
      ],
      en: [
        "Bilingual In-Villa & Hotel Nannies",
        "Bilingual Early Learning Centers",
        "Event & Wedding Childcare",
        "First-Aid Certified Childcare Staff",
      ],
      ca: [
        "Cangurs Bilingües per a Finques i Hotels",
        "Escoles Bressol Bilingües",
        "Cura Infantil per a Esdeveniments",
        "Personal amb Primers Auxilis",
      ],
      de: [
        "Mehrsprachige Nannies für Fincas und Hotels",
        "Bilinguale Kindergärten",
        "Kinderbetreuung bei Hochzeiten",
        "Erste-Hilfe-zertifiziertes Personal",
      ],
    },
    color: "#ec4899",
  },
  {
    id: "asesoria-financiera-hipotecas",
    slug: "asesoria-financiera-hipotecas",
    sectorId: "finanzas-seguros",
    icon: "💶",
    name: {
      es: "Hipotecas para No Residentes & Family Office",
      en: "Non-Resident Mortgages & Wealth Management",
      ca: "Hipoteques per a No Residents & Family Office",
      de: "Nicht-Residenten-Baufinanzierung & Family Office",
    },
    description: {
      es: "Brokers hipotecarios especialistas en compradores internacionales, family offices, optimización fiscal balear y banca privada.",
      en: "Mortgage brokers specializing in international buyers, multi-family offices, Balearic tax optimization, and private banking.",
      ca: "Brokers hipotecaris especialistes en compradors internacionals, family offices i banca privada a Palma.",
      de: "Baufinanzierungsberater für internationale Immobilienkäufer, Family Offices und Vermögensverwaltung auf Mallorca.",
    },
    synonyms: [
      "hipotecas no residentes",
      "mortgages mallorca",
      "lionsgate capital",
      "family office palma",
      "asesoria fiscal no residentes",
      "banca privada",
    ],
    popularSpecialties: {
      es: [
        "Financiación Hipotecaria para No Residentes",
        "Estructuración de Patrimonios Familiares",
        "Planificación Fiscal de Compraventa",
        "Conexión con Banca Privada Internacional",
      ],
      en: [
        "Non-Resident Property Financing",
        "Family Wealth Structuring",
        "Real Estate Tax Planning",
        "International Private Banking Access",
      ],
      ca: [
        "Finançament Hipotecari per a No Residents",
        "Estructuració de Patrimonis",
        "Planificació Fiscal de Compravenda",
        "Banca Privada Internacional",
      ],
      de: [
        "Hypotheken für Nicht-Residenten",
        "Strukturierung von Familienvermögen",
        "Steueroptimierung beim Immobilienkauf",
        "Private Banking Kontakte",
      ],
    },
    color: "#0f766e",
  },
  {
    id: "corredurias-seguros",
    slug: "corredurias-seguros",
    sectorId: "finanzas-seguros",
    icon: "🛡️",
    name: {
      es: "Corredurías de Seguros (Yates, Villas & Salud)",
      en: "Insurance Brokers (Yachts, Villas & Expat Health)",
      ca: "Corredories d'Assegurances (Iots, Vil·les & Salut)",
      de: "Versicherungsmakler (Yachten, Villen & Gesundheit)",
    },
    description: {
      es: "Pólizas todo riesgo para superyates, coberturas integrales para villas de alto valor y seguros de salud internacionales para expatriados.",
      en: "Comprehensive superyacht policies, high-value villa coverage, and international expat private medical insurance.",
      ca: "Pòlisses a tot risc per a iots, cobertures per a vil·les de gran valor i assegurances mèdiques internacionals.",
      de: "All-Risk-Versicherungen für Superyachten, Allgefahren-Deckung für Luxusvillen und private Auslandskrankenversicherungen.",
    },
    synonyms: [
      "seguros yates mallorca",
      "seguro villa",
      "sanitas mallorca",
      "seguro salud expats",
      "correduria seguros palma",
    ],
    popularSpecialties: {
      es: [
        "Seguros a Todo Riesgo para Embarcaciones",
        "Cobertura Integral de Villas de Alto Standing",
        "Seguro de Salud con Cuadro Médico Internacional",
        "Gestión Rápida de Siniestros",
      ],
      en: [
        "All-Risk Marine Yacht Insurance",
        "Luxury Villa Multi-Risk Policies",
        "International Health Insurance for Expats",
        "Fast-Track Claims Settlement",
      ],
      ca: [
        "Assegurances a Tot Risc per a Embarcacions",
        "Cobertura Integral de Vil·les",
        "Assegurança Mèdica per a Residents",
        "Gestió de Sinistres",
      ],
      de: [
        "Kasko- und Haftpflicht für Yachten",
        "Vollkaskoschutz für Luxusimmobilien",
        "Internationale Krankenversicherung",
        "Schnelle Schadensabwicklung",
      ],
    },
    color: "#0369a1",
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
