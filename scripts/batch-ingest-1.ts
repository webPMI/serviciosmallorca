import fs from "node:fs";
import { ingestBatch, type BusinessDataInput } from "./mass-curator.ts";

const fingerprints = JSON.parse(fs.readFileSync("scripts/catalog-fingerprints.json", "utf-8"));
const existingSlugs = new Set(fingerprints.slugs);
const existingNames = new Set(fingerprints.names);
const existingWebsites = new Set(fingerprints.websites);

const CANDIDATES: BusinessDataInput[] = [
  // ── 1. JARDINERÍA & PISCINAS ──
  {
    slug: "jardineria-balear-sostenible-inca",
    name: "Jardinería Balear Sostenible Inca",
    category: "jardineria-piscinas",
    sectorFolder: "jardineria-piscinas",
    sectorArrayName: "JARDINERIA_SERVICES",
    subcategories: ["paisajismo-mediterraneo", "mantenimiento-jardines", "riego-eficiente"],
    zone: "raiguer-pla",
    address: "Avinguda del Raiguer, 45, 07300 Inca",
    coordinates: { lat: 39.7189, lng: 2.9112 },
    rating: 4.8,
    reviewCount: 115,
    priceRange: "€€",
    phone: "+34 971 502 344",
    website: "https://jardineriasostenibleinca.es",
    schedule: "Lunes a Viernes: 08:00 - 18:00, Sábados: 08:30 - 13:30",
    tags: ["zona:inca", "product:premium", "mod:cita-previa"],
    shortDescription: {
      es: "Especialistas en diseño de jardines mediterráneos de bajo consumo hídrico, poda de palmeras y sistemas de riego.",
      en: "Specialists in low-water Mediterranean garden design, palm tree pruning, and smart irrigation systems.",
      ca: "Especialistes en disseny de jardins mediterranis de baix consum d'aigua, poda de palmeres i reg intel·ligent.",
      de: "Spezialisten für mediterrane Gartengestaltung mit geringem Wasserverbrauch, Palmenschnitt und Bewässerung.",
    },
    fullDescription: {
      es: "Empresa familiar con más de 20 años de experiencia en el Raiguer, dedicada a la creación de espacios exteriores sostenibles, recuperación de flora autóctona balear y mantenimiento integral de fincas rústicas.",
      en: "Family business with over 20 years of experience in Raiguer, specializing in sustainable outdoor spaces, native Balearic flora, and full estate maintenance.",
      ca: "Empresa familiar amb més de 20 anys d'experiència al Raiguer, dedicada a la creació d'espais exteriors sostenibles i manteniment integral de finques.",
      de: "Familienbetrieb mit über 20 Jahren Erfahrung in Raiguer, spezialisiert auf nachhaltige Außenanlagen, balearische Flora und Fincapflege.",
    },
    highlights: {
      es: [
        "Diseño de xerojardines de bajo consumo hídrico",
        "Tratamiento y prevención contra el picudo rojo",
        "Instalación de césped natural y tepes",
        "Mantenimiento periódico para fincas y villas",
      ],
      en: [
        "Low-water xeriscape garden design",
        "Red palm weevil treatment and prevention",
        "Natural turf and sod installation",
        "Regular maintenance for villas and estates",
      ],
      ca: [
        "Disseny de xerojardins de baix consum d'aigua",
        "Tractament contra el morrut de la palmera",
        "Instal·lació de gespa natural",
        "Manteniment periòdic per a finques i vil·les",
      ],
      de: [
        "Wassersparende Xeriscape-Gartengestaltung",
        "Behandlung gegen den Roten Palmenrüssler",
        "Rollrasenverlegung und Naturrasen",
        "Regelmäßige Pflege für Fincas und Villen",
      ],
    },
    servicesProvided: {
      es: [
        "Diseño y ejecución paisajística",
        "Poda en altura y tala controlada",
        "Sistemas de riego por goteo automatizado",
        "Tratamientos fitosanitarios ecológicos",
      ],
      en: [
        "Landscape design and execution",
        "High-altitude tree pruning and felling",
        "Automated drip irrigation systems",
        "Eco-friendly phytosanitary treatments",
      ],
      ca: [
        "Disseny i execució paisatgística",
        "Poda en alçada i tala controlada",
        "Sistemes de reg per degoteig automatitzat",
        "Tractaments fitosanitaris ecològics",
      ],
      de: [
        "Garten- und Landschaftsbau",
        "Baumpflege und Fällarbeiten",
        "Automatische Tröpfchenbewässerung",
        "Ökologischer Pflanzenschutz",
      ],
    },
  },
  {
    slug: "viveros-llevant-mediterrani-manacor",
    name: "Viveros Llevant Mediterrani Manacor",
    category: "jardineria-piscinas",
    sectorFolder: "jardineria-piscinas",
    sectorArrayName: "JARDINERIA_SERVICES",
    subcategories: ["plantas-autoctonas", "arboles-frutales", "decoracion-exterior"],
    zone: "manacor-llevant",
    address: "Ctra. Manacor-Porto Cristo Km 2.2, 07500 Manacor",
    coordinates: { lat: 39.5695, lng: 3.2356 },
    rating: 4.7,
    reviewCount: 240,
    priceRange: "€€",
    phone: "+34 971 845 670",
    website: "https://viverosllevantmediterrani.es",
    schedule: "Lunes a Sábado: 08:30 - 19:30, Domingos: 09:30 - 14:00",
    tags: ["zona:manacor", "product:accesible", "mod:en-local"],
    shortDescription: {
      es: "Gran centro de jardinería y vivero con amplia variedad de olivos centenarios, cítricos, plantas mediterráneas y macetería.",
      en: "Large garden center and nursery offering ancient olive trees, citrus, Mediterranean plants, and pottery.",
      ca: "Gran centre de jardineria i viver amb oliveres centenàries, cítrics, plantes mediterrànies i testos.",
      de: "Großes Gartencenter und Baumschule mit alten Olivenbäumen, Zitrusbäumen, mediterranen Pflanzen und Pflanzgefäßen.",
    },
    fullDescription: {
      es: "Viveros Llevant Mediterrani es un centro de referencia en el este de Mallorca, con miles de metros cuadrados de exposición de plantas ornamentales, frutales, sustratos ecológicos y asesoramiento botánico profesional.",
      en: "Viveros Llevant Mediterrani is Eastern Mallorca's premier plant nursery, with extensive displays of ornamental plants, fruit trees, organic soils, and botanical advice.",
      ca: "Viveros Llevant Mediterrani és un centre de referència al llevant de Mallorca, amb milers de metres quadrats d'exposició de plantes ornamentals i fruiters.",
      de: "Viveros Llevant Mediterrani ist eine führende Baumschule im Osten Mallorcas mit riesiger Auswahl an Zierpflanzen, Obstbäumen und Fachberatung.",
    },
    highlights: {
      es: [
        "Olivos centenarios y ejemplares singulares",
        "Plantas autóctonas de bajo mantenimiento",
        "Servicio de transporte y plantación",
        "Macetería de barro cocido y diseño",
      ],
      en: [
        "Centenary olive trees and specimen plants",
        "Low-maintenance native flora",
        "Delivery and planting services",
        "Terracotta and designer planters",
      ],
      ca: [
        "Oliveres centenàries i exemplars singulars",
        "Plantes autòctones de baix manteniment",
        "Servei de transport i plantació",
        "Testos de fang cuit",
      ],
      de: [
        "Hundertjährige Olivenbäume und Solitärpflanzen",
        "Pflegeleichte einheimische Pflanzen",
        "Liefer- und Pflanzservice",
        "Terrakotta- und Designergefäße",
      ],
    },
    servicesProvided: {
      es: [
        "Venta de plantas y árboles al por mayor y menor",
        "Transporte con camión pluma",
        "Asesoramiento botánico in situ",
        "Suministro de tierras y abonos",
      ],
      en: [
        "Retail and wholesale plant supply",
        "Crane truck delivery",
        "On-site botanical consulting",
        "Soil and organic fertilizer supply",
      ],
      ca: [
        "Venda de plantes i arbres al detall i major",
        "Transport amb camió ploma",
        "Assessorament botànic in situ",
        "Subministrament de terres i adobs",
      ],
      de: [
        "Pflanzen- und Baumverkauf (Einzel-/Großhandel)",
        "Kranwagen-Lieferung",
        "Botanische Beratung vor Ort",
        "Erden und organische Düngemittel",
      ],
    },
  },
  {
    slug: "piscinas-cristal-infinity-santanyi",
    name: "Piscinas Cristal Infinity Santanyí",
    category: "jardineria-piscinas",
    sectorFolder: "jardineria-piscinas",
    sectorArrayName: "JARDINERIA_SERVICES",
    subcategories: ["construccion-piscinas", "cloracion-salina", "climatizacion-piscinas"],
    zone: "santanyi-migjorn",
    address: "Carrer de Bernat Vidal i Tomàs, 72, 07650 Santanyí",
    coordinates: { lat: 39.3562, lng: 3.1284 },
    rating: 4.9,
    reviewCount: 98,
    priceRange: "€€€",
    phone: "+34 971 653 219",
    website: "https://piscinasdeseigninfinity.com",
    schedule: "Lunes a Viernes: 08:00 - 17:00",
    tags: ["zona:santanyi", "product:lujo", "mod:cita-previa"],
    shortDescription: {
      es: "Construcción y rehabilitación de piscinas desbordantes infinity con gresite vitrificado y sistemas de electrolisis salina.",
      en: "Construction and renovation of luxury infinity pools with vitrified mosaic tile and saltwater chlorination.",
      ca: "Construcció i rehabilitació de piscines desbordants infinity amb gresit i electròlisi salina.",
      de: "Bau und Sanierung von Infinity-Pools mit Glasmosaik und Salzelektrolyse-Systemen.",
    },
    fullDescription: {
      es: "Especialistas en piscinas de diseño integradas en el paisaje del sureste de Mallorca. Creamos láminas de agua únicas con tecnología de depuración avanzada, cubiertas automáticas y climatización por bomba de calor.",
      en: "Specialists in designer pools seamlessly integrated into Southeastern Mallorca's landscape, featuring smart filtration, automatic covers, and heat pumps.",
      ca: "Especialistes en piscines de disseny integrades en el paisatge del sud-est de Mallorca amb depuració avançada i climatització.",
      de: "Spezialisiert auf Designer-Pools im Südosten Mallorcas mit fortschrittlicher Filtertechnik, Abdeckungen und Wärmepumpen.",
    },
    highlights: {
      es: [
        "Piscinas infinity y de borde desbordante",
        "Electrolisis salina y control domótico Ph/Cloro",
        "Climatización para uso todo el año",
        "Garantía de estanqueidad de 10 años",
      ],
      en: [
        "Infinity and vanishing-edge swimming pools",
        "Salt chlorination and smart chemical control",
        "Year-round heating systems",
        "10-year waterproofing warranty",
      ],
      ca: [
        "Piscines infinity i desbordants",
        "Electròlisi salina i control domòtic",
        "Climatització per a tot l'any",
        "Garantia d'estanquitat de 10 anys",
      ],
      de: [
        "Infinity- und Überlaufbecken",
        "Salzelektrolyse und automatische Wasserpflege",
        "Ganzjährige Poolheizung",
        "10 Jahre Dichtigkeitsgarantie",
      ],
    },
    servicesProvided: {
      es: [
        "Construcción de piscinas de obra nueva",
        "Revestimiento de gresite y lámina armada",
        "Instalación de bombas de calor y domótica",
        "Mantenimiento integral del agua",
      ],
      en: [
        "New build pool construction",
        "Glass mosaic and reinforced liner tiling",
        "Heat pump and home automation install",
        "Full chemical water maintenance",
      ],
      ca: [
        "Construcció de piscines d'obra nova",
        "Revestiment de gresit i làmina armada",
        "Instal·lació de bombes de calor",
        "Manteniment integral de l'aigua",
      ],
      de: [
        "Neubau von Schwimmbecken",
        "Glasmosaik- und Folienauskleidung",
        "Wärmepumpen und Smart-Pool-Technik",
        "Kompletter Wasserpflegeservice",
      ],
    },
  },

  // ── 2. MASCOTAS & VETERINARIA ──
  {
    slug: "clinica-veterinaria-mediterranea-santa-catalina",
    name: "Clínica Veterinaria Mediterrània Santa Catalina",
    category: "clinicas-veterinarias-24h",
    sectorFolder: "mascotas-veterinaria",
    sectorArrayName: "MASCOTAS_SERVICES",
    subcategories: ["medicina-felina", "cirugia-veterinaria", "urgencias-animales"],
    zone: "palma",
    address: "Carrer de Sant Magí, 54, 07013 Palma",
    coordinates: { lat: 39.5702, lng: 2.6368 },
    rating: 4.9,
    reviewCount: 280,
    priceRange: "€€",
    phone: "+34 971 734 512",
    website: "https://veterinariasantacatalina.es",
    schedule: "Lunes a Viernes: 09:00 - 20:00, Sábados: 10:00 - 14:00 (Urgencias 24h)",
    tags: ["zona:santa-catalina", "product:premium", "mod:cita-previa"],
    shortDescription: {
      es: "Clínica veterinaria en Santa Catalina con acreditación Cat Friendly Clinic, diagnóstico por imagen y quirófano de tejidos blandos.",
      en: "Veterinary clinic in Santa Catalina with Cat Friendly Clinic accreditation, diagnostic imaging, and soft tissue surgery.",
      ca: "Clínica veterinària a Santa Catalina amb acreditació Cat Friendly, diagnòstic per imatge i quiròfan.",
      de: "Tierarztpraxis in Santa Catalina mit Cat-Friendly-Akkreditierung, digitaler Bildgebung und Weichteilchirurgie.",
    },
    fullDescription: {
      es: "Ubicada en el cosmopolita barrio de Santa Catalina en Palma, ofrece medicina preventiva, odontología veterinaria, laboratorio propio de análisis clínicos y atención personalizada multilingüe para perros, gatos y animales exóticos.",
      en: "Located in Palma's cosmopolitan Santa Catalina, providing preventive medicine, dental care, in-house laboratory, and multilingual care for pets.",
      ca: "Situada a Santa Catalina, ofereix medicina preventiva, odontologia veterinària, laboratori propi i atenció multilingüe.",
      de: "In Santa Catalina gelegen, bietet die Praxis Vorsorgemedizin, Tierzahnheilkunde, Sofortlabor und mehrsprachige Betreuung für Haustiere.",
    },
    highlights: {
      es: [
        "Certificación oficial Cat Friendly Clinic (ISFM)",
        "Laboratorio clínico propio con resultados en 15 min",
        "Radiología digital directa y ecografía doppler",
        "Equipo multilingüe en español, inglés y alemán",
      ],
      en: [
        "Official Cat Friendly Clinic certification (ISFM)",
        "In-house clinical lab with 15-min results",
        "Direct digital X-ray and Doppler ultrasound",
        "Multilingual team in Spanish, English, and German",
      ],
      ca: [
        "Certificació oficial Cat Friendly Clinic",
        "Laboratori clínic propi amb resultats en 15 min",
        "Radiologia digital directa i ecografia",
        "Equip multilingüe",
      ],
      de: [
        "Offizielle Cat-Friendly-Zertifizierung (ISFM)",
        "Praxiseigenes Sofortlabor (Ergebnisse in 15 Min)",
        "Digitales Röntgen und Farbdoppler-Ultraschall",
        "Mehrsprachiges Team (Spanisch, Englisch, Deutsch)",
      ],
    },
    servicesProvided: {
      es: [
        "Consultas de medicina interna y vacunas",
        "Cirugía general y anestesia monitorizada",
        "Odontología y limpiezas dentales por ultrasonidos",
        "Microchip y expedición de pasaporte europeo de viaje",
      ],
      en: [
        "Internal medicine and vaccination consultations",
        "General surgery with advanced monitoring",
        "Ultrasonic dental scaling and extractions",
        "Microchipping and EU Pet Passport issuance",
      ],
      ca: [
        "Consultes de medicina interna i vacunes",
        "Cirurgia general i anestèsia monitoritzada",
        "Odontologia i neteges dentals",
        "Microxip i passaport europeu",
      ],
      de: [
        "Allgemeinmedizinische Sprechstunde und Impfungen",
        "Chirurgische Eingriffe mit Narkoseüberwachung",
        "Zahnsteinentfernung mit Ultraschall",
        "Mikrochip-Implantation und EU-Heimtierausweis",
      ],
    },
  },
  {
    slug: "residencia-canina-son-fangos-campos",
    name: "Residencia Canina & Adiestramiento Son Fangos Campos",
    category: "hoteles-adiestramiento-canino",
    sectorFolder: "mascotas-veterinaria",
    sectorArrayName: "MASCOTAS_SERVICES",
    subcategories: ["hotel-canino", "adiestramiento-positivo", "guarderia-canina-dia"],
    zone: "santanyi-migjorn",
    address: "Camí de Son Fangos, Km 3.5, 07630 Campos",
    coordinates: { lat: 39.4312, lng: 3.0189 },
    rating: 4.8,
    reviewCount: 165,
    priceRange: "€€",
    phone: "+34 971 651 890",
    website: "https://sonfangoscampos.es",
    schedule: "Lunes a Domingo: 08:30 - 13:00 y 16:30 - 19:30",
    tags: ["zona:campos", "product:familiar", "mod:cita-previa"],
    shortDescription: {
      es: "Hotel canino campestre con más de 15.000 m² de parques de recreo arbolados, suites climatizadas y piscina canina.",
      en: "Country dog hotel with over 15,000 m² of shaded play parks, climate-controlled suites, and canine swimming pool.",
      ca: "Hotel caní de camp amb més de 15.000 m² de parcs arbrats, suites climatitzades i piscina canina.",
      de: "Landhotel für Hunde mit über 15.000 m² schattigen Auslaufflächen, klimatisierten Suiten und Hundepool.",
    },
    fullDescription: {
      es: "Son Fangos ofrece unas vacaciones de ensueño para tu mascota en plena naturaleza en Campos. Con atención 24 horas, juegos supervisados en grupo o individuales, adiestradores titulados y servicio de recogida y entrega en toda Mallorca.",
      en: "Son Fangos provides a premier holiday retreat for dogs in Campos, featuring 24/7 care, supervised socialization, certified training, and island-wide shuttle.",
      ca: "Son Fangos ofereix estades de vacances per a cans en plena natura a Campos amb vigilància 24h i servei de transport.",
      de: "Son Fangos bietet artgerechten Urlaub für Hunde in Campos mit 24h-Betreuung, großzügigen Ausläufen und Inselfahrt-Service.",
    },
    highlights: {
      es: [
        "Más de 15.000 m² de terreno natural vallado",
        "Suites individuales con suelo radiante y porche",
        "Piscina de recreo y fisioterapia canina",
        "Servicio de recogida a domicilio 'Pet Taxi' en toda la isla",
      ],
      en: [
        "Over 15,000 m² of secure fenced natural grounds",
        "Individual suites with heated floors and private porch",
        "Canine splash pool and hydrotherapy",
        "Island-wide Pet Taxi door-to-door shuttle",
      ],
      ca: [
        "Més de 15.000 m² de terreny tancat",
        "Suites individuals climatitzades",
        "Piscina canina",
        "Servei de Pet Taxi a tota l'illa",
      ],
      de: [
        "Über 15.000 m² gesichertes Naturareal",
        "Einzelsuiten mit Fußbodenheizung und Terrasse",
        "Hundepool für Spaß und Bewegung",
        "Inselweiter Hol- und Bringservice (Pet-Taxi)",
      ],
    },
    servicesProvided: {
      es: [
        "Alojamiento de corta y larga estancia",
        "Guardería de día con juegos y socialización",
        "Cursos de obediencia básica y modificación de conducta",
        "Baños y peluquería previa a la entrega",
      ],
      en: [
        "Short and long-term dog boarding",
        "Daycare with supervised pack socialization",
        "Positive obedience and behavioral training",
        "Grooming and bath service before departure",
      ],
      ca: [
        "Allotjament de curta i llarga estada",
        "Guarderia de dia",
        "Cursos d'obediència",
        "Servei de rentat i perruqueria",
      ],
      de: [
        "Kurz- und Langzeitunterbringung",
        "Tagesbetreuung mit Beschäftigungsprogramm",
        "Hundeschule für Grundgehorsam und Verhalten",
        "Wasch- und Pflegeservice vor Abholung",
      ],
    },
  },

  // ── 3. HOGAR & LIMPIEZA ──
  {
    slug: "limpiezas-villas-mallorca-lux-calvia",
    name: "Mallorca Lux Villa Cleaning & Services Calvià",
    category: "limpieza-villas-fincas",
    sectorFolder: "hogar-limpieza",
    sectorArrayName: "HOGAR_SERVICES",
    subcategories: ["limpieza-villas-lujo", "limpieza-fin-obra", "mantenimiento-propiedades"],
    zone: "calvia-andratx",
    address: "Avinguda del Rei Jaume I, 108, 07180 Santa Ponsa",
    coordinates: { lat: 39.5164, lng: 2.4812 },
    rating: 4.9,
    reviewCount: 135,
    priceRange: "€€€",
    phone: "+34 971 694 220",
    website: "https://mallorcaluxcleaning.com",
    schedule: "Lunes a Sábado: 08:00 - 20:00",
    tags: ["zona:santa-ponsa", "product:lujo", "mod:a-domicilio"],
    shortDescription: {
      es: "Servicio de limpieza y mantenimiento de villas de alto standing, preparación pre-llegada de propietarios y cambio de huéspedes.",
      en: "Premium cleaning and maintenance service for luxury villas, owner pre-arrival staging, and guest changeovers.",
      ca: "Servei de neteja i manteniment de vil·les d'alt nivell, preparació per a propietaris i canvi d'hostes.",
      de: "Exklusiver Reinigungs- und Pflegeservice für Luxusvillen, Eigentümer-Anreisevorbereitung und Gästewechsel.",
    },
    fullDescription: {
      es: "Especialistas en el cuidado meticuloso de propiedades residenciales exclusivas en el suroeste de Mallorca (Andratx, Santa Ponsa, Portals). Empleamos productos ecológicos certificados y equipos profesionales formados en protocolos hoteleros de 5 estrellas.",
      en: "Specialists in meticulous care for exclusive residences across Southwest Mallorca. Using certified eco-friendly products and 5-star hotel trained cleaning specialists.",
      ca: "Especialistes en la cura meticulosa de propietats exclusives al sud-oest de Mallorca amb productes ecològics i estàndards de 5 estrelles.",
      de: "Spezialisiert auf die anspruchsvolle Pflege exklusiver Wohnsitze im Südwesten Mallorcas mit ökologischen Produkten und 5-Sterne-Hotelstandards.",
    },
    highlights: {
      es: [
        "Equipo propio con antecedentes contrastados y seguro de RC",
        "Productos ecológicos y maquinaria de vapor a alta presión",
        "Limpieza técnica de mármol, piedra natural y ventanales en altura",
        "Servicio exprés de preparación para check-in",
      ],
      en: [
        "Vetted in-house staff with full liability insurance",
        "Eco-certified products and high-pressure steam machines",
        "Specialist marble, stone, and high-reach window cleaning",
        "Express check-in preparation turnarounds",
      ],
      ca: [
        "Personal de confiança amb assegurança de RC",
        "Productes ecològics i vapor d'alta pressió",
        "Neteja de marbre, pedra i vidres",
        "Servei exprés de canvis",
      ],
      de: [
        "Festangestelltes, geprüftes Personal mit Haftpflicht",
        "Öko-Reinigungsmittel und Heißdampfgeräte",
        "Pflege von Marmor, Naturstein und großen Glasfassaden",
        "Express-Service für Eigentümer- und Gästewechsel",
      ],
    },
    servicesProvided: {
      es: [
        "Limpieza regular y profunda de villas y fincas",
        "Limpiezas de fin de obra y tras reformas",
        "Tratamiento y abrillantado de suelos de piedra y mármol",
        "Lavandería y planchado de lencería fina a domicilio",
      ],
      en: [
        "Regular and deep villa housekeeping",
        "Post-construction and renovation handover cleans",
        "Marble and natural stone floor restoration",
        "Fine linen in-house laundry and pressing",
      ],
      ca: [
        "Neteja regular i a fons de vil·les",
        "Neteja de fi d'obra",
        "Tractament de terres de marbre i pedra",
        "Bugaderia i planxat a domicili",
      ],
      de: [
        "Regelmäßige Unterhalts- und Grundreinigung",
        "Bauendreinigung nach Neubau und Sanierung",
        "Kristallisation und Pflege von Marmorböden",
        "Wäsche- und Bügelservice vor Ort",
      ],
    },
  },
  {
    slug: "mudanzas-islas-baleares-transports-palma",
    name: "Mudanzas & Guardamuebles Islas Baleares Palma",
    category: "mudanzas-guardamuebles",
    sectorFolder: "hogar-limpieza",
    sectorArrayName: "HOGAR_SERVICES",
    subcategories: ["mudanzas-nacionales-internacionales", "guardamuebles-seguro", "montaje-muebles"],
    zone: "palma",
    address: "Carrer del Gremi de Teixidors, 38, Polígon Son Castelló, 07009 Palma",
    coordinates: { lat: 39.6054, lng: 2.6712 },
    rating: 4.8,
    reviewCount: 310,
    priceRange: "€€",
    phone: "+34 971 430 180",
    website: "https://mudanzasbalearespalma.com",
    schedule: "Lunes a Viernes: 08:00 - 19:00, Sábados: 08:30 - 14:00",
    tags: ["zona:palma-centro", "product:accesible", "mod:a-domicilio"],
    shortDescription: {
      es: "Empresa líder en mudanzas locales en Mallorca, traslados a la península y Europa, grúas elevadoras y guardamuebles vigilado.",
      en: "Leading moving company for local Mallorca relocations, mainland and European shipping, furniture lifts, and secure storage.",
      ca: "Empresa líder en mudances a Mallorca, trasllats nacionals i internacionals, plataformes elevadores i guardamobles.",
      de: "Führendes Umzugsunternehmen für Mallorca-Umzüge, Festland- und Europa-Transporte, Möbellifte und gesicherte Lagerung.",
    },
    fullDescription: {
      es: "Con más de 30 años en el polígono Son Castelló, ofrece flota propia de camiones capitoné, grúas montamuebles de fachada hasta 10 pisos, embalaje profesional de obras de arte y naves climatizadas de guardamuebles con vigilancia 24h.",
      en: "With over 30 years in Son Castelló, featuring a modern truck fleet, exterior furniture cranes up to 10 floors, art packing, and 24/7 secure climate storage.",
      ca: "Amb més de 30 anys d'experiència, ofereix flota de camions, grues elevadores fins a 10 pisos i guardamobles vigilat 24h.",
      de: "Über 30 Jahre Erfahrung mit eigenem LKW-Fuhrpark, Außenaufzügen bis in die 10. Etage, Kunstverpackung und klimatisierten Lagerräumen.",
    },
    highlights: {
      es: [
        "Flota propia de camiones adaptados para transporte marítimo",
        "Grúa montamuebles exterior de hasta 30 metros de altura",
        "Embalaje especializado para pianos, cristalería y obras de arte",
        "Guardamuebles en módulos individuales con videovigilancia 24/7",
      ],
      en: [
        "Dedicated truck fleet for inter-island and maritime shipping",
        "Exterior furniture hoist lift reaching up to 30 meters",
        "Specialized crating for pianos, glassware, and fine art",
        "Individual storage containers with 24/7 CCTV surveillance",
      ],
      ca: [
        "Flota pròpia de camions",
        "Grua muntamobles de façana fins a 30 metres",
        "Embalatge per a pianos i obres d'art",
        "Mòduls de guardamobles individuals",
      ],
      de: [
        "Eigener Fuhrpark für Insel- und Fährtransporte",
        "Außen-Möbellift bis zu 30 Meter Höhe",
        "Spezialverpackung für Klaviere und Kunstgegenstände",
        "Individuelle Lagerboxen mit 24/7 Videoüberwachung",
      ],
    },
    servicesProvided: {
      es: [
        "Mudanzas residenciales y de oficinas en toda Mallorca",
        "Rutas semanales de mudanza directa a Alemania, UK y Península",
        "Servicio integral de embalaje, desmontaje y montaje",
        "Alquiler de trasteros y guardamuebles por meses",
      ],
      en: [
        "Home and office removals across Mallorca",
        "Weekly direct moving routes to Germany, UK, and Spain",
        "Full packing, dismantling, and reassembly service",
        "Self-storage and containerized monthly storage rental",
      ],
      ca: [
        "Mudances de llars i oficines",
        "Rutes setmanals a Europa i Península",
        "Embalatge, desmuntatge i muntatge de mobles",
        "Lloguer de trasters",
      ],
      de: [
        "Privat- und Firmenumzüge inselweit",
        "Wöchentliche Beiladungen nach Deutschland, UK und Festland",
        "Einpackservice sowie Möbel-De- und -Montage",
        "Flexible Einlagerung und Lagerboxen-Vermietung",
      ],
    },
  },

  // ── 4. TECNOLOGÍA & DOMÓTICA ──
  {
    slug: "domotica-baleares-smart-villas-palma",
    name: "Smart Villas Domótica & Redes Baleares Palma",
    category: "tecnologia-seguridad",
    sectorFolder: "tecnologia-seguridad",
    sectorArrayName: "SEGURIDAD_SERVICES",
    subcategories: ["domotica-knx", "cine-en-casa-audio", "redes-wifi-alta-velocidad"],
    zone: "palma",
    address: "Carrer del Gran Via Asima, 22, Son Castelló, 07009 Palma",
    coordinates: { lat: 39.6084, lng: 2.6645 },
    rating: 4.9,
    reviewCount: 88,
    priceRange: "€€€€",
    phone: "+34 971 771 990",
    website: "https://smartvillasbaleares.com",
    schedule: "Lunes a Viernes: 08:30 - 18:30",
    tags: ["zona:palma-centro", "product:lujo", "mod:cita-previa"],
    shortDescription: {
      es: "Ingeniería de domótica KNX y Control4, salas de cine privadas de alta fidelidad, videovigilancia y redes Wi-Fi profesionales para fincas.",
      en: "KNX and Control4 smart home engineering, high-end private cinema rooms, CCTV, and enterprise Wi-Fi for luxury estates.",
      ca: "Enginyeria de domòtica KNX i Control4, sales de cinema privat, videovigilància i xarxes Wi-Fi d'alta velocitat.",
      de: "Smart-Home-Engineering mit KNX und Control4, High-End-Heimkinos, Videoüberwachung und Profi-WLAN für Luxusanwesen.",
    },
    fullDescription: {
      es: "Smart Villas integra tecnología invisible de máxima gama en villas de lujo en Mallorca. Control unificado de climatización, iluminación escénica, persianas, sonido multizona Bowers & Wilkins y seguridad biométrica desde una única aplicación.",
      en: "Smart Villas integrates invisible high-end technology into Mallorca's premier villas: unified HVAC, Lutron lighting, multi-room audio, and biometric access.",
      ca: "Integra tecnologia invisible d'alta gamma: control de climatització, il·luminació Lutron, so multi-room i seguretat biomètrica.",
      de: "Smart Villas integriert modernste Steuerungstechnik in Luxusvillen: Raumklima, Lutron-Lichtdesign, Multiroom-Audio und biometrische Sicherheit.",
    },
    highlights: {
      es: [
        "Integradores certificados KNX Partner y Control4 Diamond",
        "Sistemas de iluminación Lutron y sonido multizona oculto",
        "Redes Wi-Fi de fibra óptica con roaming sin cortes en grandes parcelas",
        "Soporte técnico y monitorización remota 24/7",
      ],
      en: [
        "Certified KNX Partner and Control4 Diamond integrator",
        "Lutron lighting controls and architectural hidden speakers",
        "Seamless enterprise mesh Wi-Fi across large acreage estates",
        "24/7 remote monitoring and proactive system maintenance",
      ],
      ca: [
        "Integrador certificat KNX Partner i Control4",
        "Il·luminació Lutron i so ocult",
        "Xarxes Wi-Fi d'alta cobertura per a finques",
        "Suport tècnic i monitoratge 24/7",
      ],
      de: [
        "Zertifizierter KNX Partner & Control4 Diamond Integrator",
        "Lutron-Lichtsteuerung und unsichtbare Einbaulautsprecher",
        "Unterbrechungsfreies Highspeed-WLAN auf weitläufigen Fincas",
        "24/7 Fernwartung und proaktiver Support",
      ],
    },
    servicesProvided: {
      es: [
        "Diseño e instalación de domótica integral para villas",
        "Salas de cine dedicadas con proyección 4K Dolby Atmos",
        "Seguridad perimetral con cámaras térmicas e IA",
        "Redes informáticas seguras y enlaces inalámbricos de largo alcance",
      ],
      en: [
        "Full-villa smart home automation design and rollout",
        "Dedicated private cinema rooms with 4K Dolby Atmos",
        "Perimeter security with thermal and AI analytics cameras",
        "Secure corporate-grade networking and long-range wireless links",
      ],
      ca: [
        "Disseny i instal·lació de domòtica integral",
        "Cinemes privats amb 4K Dolby Atmos",
        "Seguretat perimetral amb càmeres d'IA",
        "Xarxes informàtiques segures",
      ],
      de: [
        "Ganzheitliche Smart-Home-Planung und Ausführung",
        "High-End-Heimkinos mit 4K-Projektion & Dolby Atmos",
        "Perimeter-Sicherheit mit Wärmebild- und KI-Kameras",
        "Sichere Profi-Netzwerke und Richtfunkstrecken",
      ],
    },
  },

  // ── 5. FINANZAS & SEGUROS ──
  {
    slug: "balearic-mortgage-consulting-palma",
    name: "Balearic Mortgage & Financial Consulting Palma",
    category: "asesoria-financiera-hipotecas",
    sectorFolder: "finanzas-seguros",
    sectorArrayName: "FINANZAS_SERVICES",
    subcategories: ["hipotecas-no-residentes", "asesoria-financiera", "planificacion-patrimonial"],
    zone: "palma",
    address: "Passeig del Born, 15, 07012 Palma",
    coordinates: { lat: 39.5709, lng: 2.6472 },
    rating: 4.9,
    reviewCount: 145,
    priceRange: "€€€",
    phone: "+34 971 720 850",
    website: "https://balearicmortgages.com",
    schedule: "Lunes a Viernes: 09:00 - 18:00 (Atención presencial y online)",
    tags: ["zona:palma-centro", "product:lujo", "mod:cita-previa"],
    shortDescription: {
      es: "Consultoría hipotecaria independiente especializada en financiación inmobiliaria para compradores no residentes e inversores internacionales.",
      en: "Independent mortgage advisory specializing in property financing for non-resident buyers and international investors.",
      ca: "Consultoria hipotecària independent especialitzada en finançament per a compradors no residents i inversors.",
      de: "Unabhängige Baufinanzierungsberatung für internationale Immobilienkäufer und Nicht-Residenten auf Mallorca.",
    },
    fullDescription: {
      es: "Con sede en el céntrico Passeig del Born de Palma, este equipo de economistas y asesores financieros gestiona préstamos hipotecarios con las principales entidades bancarias españolas y europeas, logrando las mejores condiciones de tipo fijo y variable.",
      en: "Located on Palma's Passeig del Born, managing mortgage approvals with top Spanish and European private banks with competitive fixed/variable rates.",
      ca: "Al Passeig del Born de Palma, gestiona préstecs hipotecaris amb els principals bancs per obtenir les millors condicions.",
      de: "Am Passeig del Born in Palma vermittelt dieses Expertenteam maßgeschneiderte Immobilienkredite bei spanischen und europäischen Banken.",
    },
    highlights: {
      es: [
        "Autorizados y registrados por el Banco de España",
        "Financiación de hasta el 70-80% para no residentes comunitarios y extracomunitarios",
        "Tramitación ágil en inglés, alemán, español y francés",
        "Estudio previo de viabilidad sin coste ni compromiso",
      ],
      en: [
        "Licensed and registered with the Bank of Spain",
        "Up to 70-80% LTV financing for EU and non-EU non-residents",
        "Seamless multilingual processing in English, German, and Spanish",
        "Complimentary pre-approval financial feasibility assessment",
      ],
      ca: [
        "Registrats al Banc d'Espanya",
        "Finançament fins al 70-80% per a no residents",
        "Tramitació en anglès, alemany i català",
        "Estudi previ gratuït",
      ],
      de: [
        "Offiziell bei der Bank von Spanien registriert",
        "Bis zu 70-80% Beleihung für EU- und Nicht-EU-Bürger",
        "Komplette Abwicklung auf Deutsch, Englisch und Spanisch",
        "Kostenlose Vorab-Machbarkeitsanalyse",
      ],
    },
    servicesProvided: {
      es: [
        "Intermediación hipotecaria para compra de villas y fincas",
        "Hipotecas para autopromoción y construcción de viviendas",
        "Subrogación y mejora de condiciones hipotecarias existentes",
        "Asesoramiento fiscal previo a la formalización en notaría",
      ],
      en: [
        "Mortgage brokering for luxury villas and country estates",
        "Construction and self-build development mortgages",
        "Mortgage refinancing and rate renegotiation",
        "Pre-closing tax and notary financial advisory",
      ],
      ca: [
        "Intermediació hipotecària per a vil·les i finques",
        "Hipoteques d'autopromoció",
        "Subrogació i millora d'hipoteques",
        "Assessorament fiscal previ",
      ],
      de: [
        "Baufinanzierung für Villen, Fincas und Neubauten",
        "Baukredite für Neubau- und Sanierungsprojekte",
        "Umschuldung und Optimierung bestehender Darlehen",
        "Steuerliche und notarielle Finanzbegleitung",
      ],
    },
  },
];

// Verify zero collisions before ingesting
const validBatch: BusinessDataInput[] = [];
for (const biz of CANDIDATES) {
  const normName = biz.name.toLowerCase().trim();
  const normWebsite = biz.website.toLowerCase().trim();

  if (existingSlugs.has(biz.slug)) {
    console.warn(`⚠️ Omitiendo slug existente: ${biz.slug}`);
    continue;
  }
  if (existingNames.has(normName)) {
    console.warn(`⚠️ Omitiendo nombre existente: ${biz.name}`);
    continue;
  }
  if (existingWebsites.has(normWebsite)) {
    console.warn(`⚠️ Omitiendo website existente: ${biz.website}`);
    continue;
  }

  validBatch.push(biz);
  existingSlugs.add(biz.slug);
  existingNames.add(normName);
  existingWebsites.add(normWebsite);
}

console.log(`Ingesting ${validBatch.length} verified candidate businesses...`);
ingestBatch(validBatch);
