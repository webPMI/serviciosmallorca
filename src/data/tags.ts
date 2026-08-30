/**
 * Catálogo CERRADO de etiquetas (Nivel 4 transversal) — docs/TAXONOMY.md §5.
 *
 * Regla de oro (P-02): una `tag` nunca es texto libre. Siempre `dominio:valor`,
 * en minúsculas kebab-case ASCII, y debe existir en este catálogo para poder
 * asignarse a un `ServiceItem`. Mostrar al usuario vía i18n:
 * `translations[tagI18nKey(tag)]` → `tags.<dominio>.<valor>` (GR-04).
 *
 * Para ampliar un dominio: añade entradas aquí y documenta el cambio en
 * docs/TAXONOMY.md §5.2. Nunca introduzcas tags directamente en services.ts.
 */
import { MALLORCA_ZONES, type LocalizedText } from "./zones.ts";

export const TAG_DOMAINS = ["zona", "product", "mod", "amb", "aud", "temps"] as const;
export type TagDomain = (typeof TAG_DOMAINS)[number];

export interface TagDef {
  /** Id técnico completo: "product:lujo" */
  id: string;
  domain: TagDomain;
  label: LocalizedText;
}

function def(domain: TagDomain, value: string, es: string, en: string, ca: string, de: string): TagDef {
  return { id: `${domain}:${value}`, domain, label: { es, en, ca, de } };
}

/** Normaliza texto libre a slug kebab-case ASCII (translitera à/ñ/ç… → a/n/c). */
export function normalizeToKebabAscii(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------------------------------------------ */
/* Catálogos estáticos (dominios no geográficos)                       */
/* ------------------------------------------------------------------ */

/** Segmento de producto/precio y estilos especializados — docs/TAXONOMY.md §5.2 */
const PRODUCT_TAGS: TagDef[] = [
  // 1. Gama, Precio & Audiencia General
  def("product", "lujo", "Lujo", "Luxury", "Luxe", "Luxus"),
  def("product", "premium", "Premium", "Premium", "Premium", "Premium"),
  def("product", "accesible", "Accesible", "Affordable", "Assequible", "Erschwinglich"),
  def("product", "familiar", "Familiar", "Family-friendly", "Familiar", "Familienfreundlich"),
  def("product", "adultos", "Solo adultos", "Adults only", "Només adults", "Nur für Erwachsene"),

  // 2. Tatuajes, Piercing & Body Art
  def("product", "fine-line", "Fine Line (Línea Fina)", "Fine Line Tattoo", "Tatuatge Fine-Line", "Fine-Line-Tattoo"),
  def(
    "product",
    "micro-tatuaje",
    "Micro-Tatuajes & Minimalismo",
    "Micro-Tattoos & Minimalism",
    "Micro-Tatuatges",
    "Mikro-Tattoos & Minimalismus",
  ),
  def(
    "product",
    "realismo",
    "Realismo Black & Grey",
    "Realism Black & Grey",
    "Realisme Black & Grey",
    "Realismus Black & Grey",
  ),
  def("product", "realismo-color", "Realismo a Color", "Color Realism", "Realisme a Color", "Farbrealismus"),
  def(
    "product",
    "traditional",
    "Tradicional / Old School",
    "Traditional / Old School",
    "Tradicional Old School",
    "Traditional Old School",
  ),
  def("product", "neotradicional", "Neotradicional", "Neotraditional", "Neotradicional", "Neotraditional"),
  def(
    "product",
    "blackwork",
    "Blackwork & Geometría",
    "Blackwork & Geometry",
    "Blackwork i Geometria",
    "Blackwork & Geometrie",
  ),
  def("product", "ornamental", "Ornamental & Mehndi", "Ornamental & Mehndi", "Ornamental", "Ornamental Tattoo"),
  def(
    "product",
    "lettering",
    "Lettering & Caligrafía",
    "Lettering & Calligraphy",
    "Lettering i Cal·ligrafia",
    "Lettering & Kalligrafie",
  ),
  def(
    "product",
    "anime-manga",
    "Anime & Manga Tattoo",
    "Anime & Manga Tattoo",
    "Anime i Manga Tattoo",
    "Anime- & Manga-Tattoo",
  ),
  def("product", "acuarela", "Acuarela & Sketch", "Watercolor & Sketch", "Aquarel·la", "Aquarell-Tattoo"),
  def(
    "product",
    "tribal-polinesio",
    "Tribal & Polinesio",
    "Tribal & Polynesian",
    "Tribal i Polinesi",
    "Tribal & Polynesisch",
  ),
  def("product", "hand-poked", "Hand-Poked (Sin máquina)", "Hand-Poked Tattoo", "Hand-Poked", "Hand-Poked-Tattoo"),
  def(
    "product",
    "coverup-arreglo",
    "Cover-Up & Arreglos",
    "Cover-Up & Reworks",
    "Cover-Up i Cobertes",
    "Cover-Up & Korrekturen",
  ),
  def(
    "product",
    "piercing-titanio",
    "Piercing Titanio Grado Implante",
    "Implant Grade Titanium Piercing",
    "Pírcing Titani Implantable",
    "Implantat-Titan-Piercing",
  ),
  def("product", "microdermal", "Microdermales & Implantes", "Microdermal Anchors", "Microdermals", "Dermal Anchors"),
  def(
    "product",
    "joyeria-oro18k",
    "Joyería Corporal en Oro 18k",
    "18k Solid Gold Body Jewelry",
    "Joieria Corporal en Or 18k",
    "18k Echtgold-Körperschmuck",
  ),

  // 3. Artes Visuales, Museos & Galerías
  def("product", "galeria-arte", "Galería de Arte", "Art Gallery", "Galeria d'Art", "Kunstgalerie"),
  def(
    "product",
    "arte-contemporaneo",
    "Arte Contemporáneo",
    "Contemporary Art",
    "Art Contemporani",
    "Zeitgenössische Kunst",
  ),
  def(
    "product",
    "arte-clasico",
    "Arte Clásico & Antigüedades",
    "Classical Art & Antiques",
    "Art Clàssic i Antiguitats",
    "Klassische Kunst & Antiquitäten",
  ),
  def(
    "product",
    "museo-fundacion",
    "Museos & Fundaciones de Arte",
    "Museums & Art Foundations",
    "Museus i Fundacions",
    "Museen & Kunststiftungen",
  ),
  def(
    "product",
    "escultura",
    "Escultura & Parques de Arte",
    "Sculpture & Art Parks",
    "Escultura i Parcs d'Art",
    "Bildhauerei & Skulpturenparks",
  ),
  def(
    "product",
    "fotografia-autor",
    "Fotografía de Autor",
    "Fine Art Photography",
    "Fotografia d'Autor",
    "Künstlerische Fotografie",
  ),
  def("product", "pintura-oleo", "Pintura al Óleo & Lienzos", "Oil Painting & Canvas", "Pintura a l'Oli", "Ölmalerei"),
  def(
    "product",
    "grabado-serigrafia",
    "Grabado, Litografía & Serigrafía",
    "Printmaking & Silkscreen",
    "Gravat i Serigrafia",
    "Druckgrafik & Siebdruck",
  ),
  def(
    "product",
    "diseno-interiores",
    "Diseño de Interiores & Decoración",
    "Interior Design & Home Decor",
    "Disseny d'Interiors i Decoració",
    "Innenarchitektur & Dekoration",
  ),
  def(
    "product",
    "joyeria-artesanal",
    "Joyería de Autor & Alta Joyería",
    "Artisan Jewelry & High Jewelry",
    "Joieria d'Autor i Alta Joieria",
    "Autorenschmuck & Edelschmuck",
  ),

  // 4. Artesanía Balear & Oficios Tradicionales
  def(
    "product",
    "vidrio-soplado",
    "Vidrio Soplado Artesanal",
    "Hand-Blown Glass",
    "Vidre Bufat Artesanal",
    "Mundgeblasenes Glas",
  ),
  def(
    "product",
    "ceramica-balear",
    "Cerámica Balear & Alfarería",
    "Balearic Ceramics & Pottery",
    "Ceràmica Balear i Terrisseria",
    "Balearische Keramik & Töpferei",
  ),
  def(
    "product",
    "siurells",
    "Siurells Tradicionales de Mallorca",
    "Traditional Mallorcan Siurells",
    "Siurells Tradicionals",
    "Traditionelle Siurells",
  ),
  def(
    "product",
    "teixits-llengues",
    "Robes de Llengües (Telas Ikat)",
    "Ikat Tongue Fabrics",
    "Robes de Llengües",
    "Ikat-Zungenstoffe",
  ),
  def(
    "product",
    "cesteria-llata",
    "Cestería de Palma & Llata",
    "Palm Leaf Basketry (Llata)",
    "Cistelleria de Llata",
    "Palmblatt-Flechthandwerk",
  ),
  def(
    "product",
    "marroquineria-piel",
    "Piel & Marroquinería de Inca",
    "Inca Leathercraft & Bags",
    "Pell i Marroquineria d'Inca",
    "Inca-Lederwaren",
  ),
  def(
    "product",
    "calzado-artesanal",
    "Calzado Artesanal & Abarcas",
    "Artisan Footwear & Abarcas",
    "Calçat Artesanal i Abarques",
    "Handgefertigte Schuhe & Abarcas",
  ),
  def(
    "product",
    "cereria-velas",
    "Cerería Tradicional & Velas",
    "Traditional Candlemaking",
    "Cereria i Espelmes",
    "Traditionelle Wachskunst",
  ),
  def(
    "product",
    "ebanisteria-madera",
    "Ebanistería en Madera de Olivo",
    "Olive Wood Cabinetry",
    "Fusteria en Fusta d'Olivera",
    "Olivenholz-Möbelbau",
  ),
  def(
    "product",
    "canteria-mares",
    "Cantería en Piedra de Marès",
    "Marès Stone Stonemasonry",
    "Picapedrers de Marès",
    "Marès-Natursteinmetz",
  ),

  // 5. Náutica, Chárter & Superyates
  def(
    "product",
    "charter-yates",
    "Chárter de Superyates & Megayates",
    "Superyacht & Megayacht Charter",
    "Xàrter de Superiots i Megaiots",
    "Superyacht- & Megayacht-Charter",
  ),
  def(
    "product",
    "veleros",
    "Alquiler de Veleros & Monocascos",
    "Sailing Yachts & Monohulls",
    "Lloguer de Velers",
    "Segelyachten-Charter",
  ),
  def(
    "product",
    "catamaranes",
    "Catamaranes a Vela & Motor",
    "Sailing & Power Catamarans",
    "Catamarans a Vela i Motor",
    "Katamaran-Charter",
  ),
  def(
    "product",
    "llauts-tradicionales",
    "Llaüts Tradicionales de Madera",
    "Traditional Wooden Llaüts",
    "Llaüts Tradicionals de Fusta",
    "Traditionelle Llaüt-Holzboote",
  ),
  def(
    "product",
    "lanchas-motor",
    "Lanchas a Motor & Day Cruisers",
    "Speedboats & Day Cruisers",
    "Llanxes a Motor",
    "Motorboote & Daycruiser",
  ),
  def(
    "product",
    "semirrigidas-rib",
    "Semirrígidas de Lujo (RIBs)",
    "Luxury Rigid Inflatables (RIBs)",
    "Semirígidies de Gamma Alta",
    "Luxus-RIBs",
  ),
  def(
    "product",
    "alquiler-barcos",
    "Alquiler de Barcos sin Titulación",
    "License-Free Boat Rental",
    "Lloguer de Barques sense Titulació",
    "Führerscheinfreie Boote",
  ),
  def(
    "product",
    "motos-agua",
    "Motos de Agua & Jet Ski Tours",
    "Jet Ski Rentals & Guided Tours",
    "Motos d'Aigua i Jet Ski",
    "Jetski & Wassermotorräder",
  ),
  def(
    "product",
    "embarcaciones-pesca",
    "Barcos de Pesca Deportiva",
    "Sport Fishing Boat Charter",
    "Embarcacions de Pesca Esportiva",
    "Sportfischerboote",
  ),
  def(
    "product",
    "marinas-amarres",
    "Marinas & Alquiler de Amarres",
    "Marinas & Yacht Berth Rentals",
    "Marines i Lloguer d'Amarratges",
    "Marinas & Liegeplätze",
  ),
  def(
    "product",
    "varadero-refit",
    "Varadero Técnico & Refit Naval",
    "Shipyard, Haul-Out & Yacht Refit",
    "Varador Tècnic i Refit Naval",
    "Schiffswerft & Yacht-Refit",
  ),
  def(
    "product",
    "carpinteria-naval",
    "Carpintería Naval (Mestres d'Aixa)",
    "Traditional Shipwrights",
    "Mestres d'Aixa i Fusteria Naval",
    "Traditioneller Holzschiffbau",
  ),
  def(
    "product",
    "mecanica-marina",
    "Mecánica Marina & Motores Fuera-Borda",
    "Marine Mechanics & Outboards",
    "Mecànica Marina i Motors",
    "Schiffsmechanik & Außenborder",
  ),
  def(
    "product",
    "limpieza-barcos",
    "Limpieza & Detailing de Embarcaciones",
    "Yacht Detailing & Cleaning",
    "Neteja i Detailing d'Embarcacions",
    "Yachtreinigung & Pflege",
  ),
  def(
    "product",
    "patron-skipper",
    "Patrones Profesionales & Tripulación",
    "Professional Skippers & Crew",
    "Patrons Professionals i Tripulació",
    "Professionelle Skipper & Crew",
  ),
  def(
    "product",
    "aprovisionamiento-yates",
    "Aprovisionamiento Gourmet para Yates",
    "Yacht Provisions & Gourmet Supply",
    "Proveïment Gourmet per a Iots",
    "Yacht-Proviantierung",
  ),

  // 6. Deportes Acuáticos & Submarinos
  def(
    "product",
    "buceo",
    "Buceo PADI en Reservas Marinas",
    "PADI Scuba Diving in Reserves",
    "Submarinisme PADI en Reserves",
    "PADI-Tauchen in Schutzgebieten",
  ),
  def(
    "product",
    "apnea-freediving",
    "Apnea & Freediving",
    "Freediving & Apnea Courses",
    "Apnea i Freediving",
    "Freitauchen & Apnoe",
  ),
  def(
    "product",
    "snorkel-tours",
    "Snorkel & Cuevas Marinas",
    "Snorkeling & Sea Caves Tours",
    "Snorkel i Coves Marines",
    "Schnorcheltouren & Meereshöhlen",
  ),
  def(
    "product",
    "paddle-surf-sup",
    "Paddle Surf (SUP) & Sunset Tours",
    "Stand Up Paddle & Sunset Tours",
    "Pàdel Surf (SUP)",
    "Stand-Up-Paddling (SUP)",
  ),
  def(
    "product",
    "kayak-mar",
    "Kayak de Mar & Rutas Costeras",
    "Sea Kayaking & Coastal Routes",
    "Caiac de Mar",
    "Seekajak & Küstentouren",
  ),
  def(
    "product",
    "surf-mallorca",
    "Surf & Longboard",
    "Surfing & Longboard",
    "Surf i Longboard",
    "Surfen & Wellenreiten",
  ),
  def("product", "windsurf", "Windsurf & Escuelas", "Windsurfing Academy", "Windsurf", "Windsurfen"),
  def("product", "kitesurf", "Kitesurf en Bahía de Pollença", "Kitesurfing in Pollença Bay", "Kitesurf", "Kitesurfen"),
  def("product", "wing-foil", "Wing Foil & Hydrofoil", "Wing Foil & Hydrofoil", "Wing Foil", "Wingfoiling"),
  def(
    "product",
    "e-foil",
    "Fliteboard & E-Foil Eléctrico",
    "Electric E-Foil & Fliteboards",
    "E-Foil Elèctric",
    "Elektro-Foil & Fliteboard",
  ),
  def(
    "product",
    "esqui-nautico",
    "Esquí Náutico & Wakeboard",
    "Water Skiing & Wakeboarding",
    "Esquí Nàutic i Wakeboard",
    "Wasserski & Wakeboarding",
  ),
  def(
    "product",
    "vela-ligera",
    "Vela Ligera & Escuela Infantil",
    "Dinghy Sailing Academy",
    "Vela Lleugera",
    "Jollensegeln",
  ),
  def(
    "product",
    "coasteering",
    "Coasteering & Saltos de Acantilado",
    "Coasteering & Cliff Jumping",
    "Coasteering",
    "Coasteering & Klippenspringen",
  ),

  // 7. Gastronomía Balear & Española
  def(
    "product",
    "cocina-mallorquina",
    "Cocina Tradicional Mallorquina",
    "Traditional Mallorcan Cuisine",
    "Cuina Tradicional Mallorquina",
    "Traditionelle Mallorquinische Küche",
  ),
  def(
    "product",
    "paellas-arroces",
    "Paellas, Arroz Ciego & Calderetas",
    "Paellas & Seafood Rice Pots",
    "Paelles, Arròs Cec i Calderetes",
    "Paellas & Reisgerichte",
  ),
  def(
    "product",
    "pescados-mariscos",
    "Pescados Frescos de Lonja & Mariscos",
    "Fresh Fish Market Catch & Seafood",
    "Peix Fresc de Llotja i Marisc",
    "Tagesfrischer Fisch & Meeresfrüchte",
  ),
  def(
    "product",
    "carnes-brasas",
    "Carnes Maduradas & Brasas de Carbón",
    "Dry-Aged Steaks & Charcoal Grill",
    "Carns Madurades a la Brasa",
    "Dry-Aged Fleisch & Holzkohlegrill",
  ),
  def(
    "product",
    "cochinillo-lechal",
    "Lechona Asada & Cochinillo",
    "Roast Suckling Pig",
    "Porcella Rostida",
    "Spanferkel aus dem Holzofen",
  ),
  def(
    "product",
    "tapas-autor",
    "Tapas de Autor & Platillos Creativos",
    "Signature & Creative Tapas",
    "Tapes d'Autor i Platets",
    "Signature-Tapas & Kreativküche",
  ),
  def(
    "product",
    "variat-mallorquin",
    "Variat Mallorquí de Bar Tradicional",
    "Traditional Mallorcan 'Variat'",
    "Variat Mallorquí Tradicional",
    "Traditionelles 'Variat'",
  ),
  def(
    "product",
    "cocina-espanola",
    "Cocina Española Clásica & Asadores",
    "Classic Spanish Cuisine & Roasteries",
    "Cuina Espanyola Clàssica",
    "Klassische Spanische Küche",
  ),
  def(
    "product",
    "cocina-mediterranea",
    "Cocina Mediterránea de Temporada Km0",
    "Seasonal Km0 Mediterranean Cuisine",
    "Cuina Mediterrània Km0",
    "Mediterrane Km0-Küche",
  ),

  // 8. Cocina Internacional, Élite & Fusión
  def(
    "product",
    "estrella-michelin",
    "Estrella Michelin & Sol Repsol",
    "Michelin Star & Repsol Sun",
    "Estrella Michelin i Sol Repsol",
    "Michelin-Stern & Repsol-Sonne",
  ),
  def(
    "product",
    "alta-cocina",
    "Alta Cocina de Vanguardia",
    "Fine Dining & Haute Cuisine",
    "Alta Cuina d'Avantguarda",
    "Gehobene Haute Cuisine",
  ),
  def(
    "product",
    "cocina-italiana-pasta",
    "Cocina Italiana & Pasta Fresca",
    "Italian Cuisine & Fresh Pasta",
    "Cuina Italiana i Pasta Fresca",
    "Italienische Küche & Frische Pasta",
  ),
  def(
    "product",
    "pizza-napolitana",
    "Pizza Napolitana al Horno de Leña",
    "Wood-Fired Neapolitan Pizza",
    "Pizza Napolitana a Forn de Llenya",
    "Neapolitanische Holzofenpizza",
  ),
  def(
    "product",
    "sushi-japones",
    "Sushi, Omakase & Cocina Japonesa",
    "Sushi, Omakase & Japanese Dining",
    "Sushi, Omakase i Cuina Japonesa",
    "Sushi, Omakase & Japanische Küche",
  ),
  def(
    "product",
    "ramen-izakaya",
    "Ramen Artesanal & Izakaya",
    "Handmade Ramen & Izakaya",
    "Ramen Artesanal i Izakaya",
    "Handgemachte Ramen & Izakaya",
  ),
  def(
    "product",
    "cocina-asiatica",
    "Cocina Asiática & Street Wok",
    "Pan-Asian & Street Wok",
    "Cuina Asiàtica",
    "Asiatische Wok-Küche",
  ),
  def(
    "product",
    "thai",
    "Cocina Tailandesa Auténtica",
    "Authentic Thai Cuisine",
    "Cuina Tailandesa Autèntica",
    "Authentische Thai-Küche",
  ),
  def(
    "product",
    "cocina-mexicana",
    "Taquerías & Cocina Mexicana",
    "Authentic Mexican & Taquerias",
    "Taqueries i Cuina Mexicana",
    "Mexikanische Küche & Tacos",
  ),
  def(
    "product",
    "cocina-peruana-nikkei",
    "Ceviches & Fusión Peruano-Nikkei",
    "Peruvian-Nikkei & Ceviche",
    "Ceviches i Cuina Nikkei",
    "Peruanische Ceviche & Nikkei",
  ),
  def(
    "product",
    "cocina-francesa",
    "Bistró & Cocina Clásica Francesa",
    "French Bistro & Classic Dining",
    "Bistró i Cuina Francesa",
    "Französisches Bistro",
  ),
  def(
    "product",
    "cocina-vegana",
    "Cocina Vegana & Plant-Based",
    "100% Vegan & Plant-Based Dining",
    "Cuina Vegana i Plant-Based",
    "Vegane & Pflanzliche Küche",
  ),
  def(
    "product",
    "sin-gluten-celiacos",
    "100% Sin Gluten (Celiacos)",
    "100% Gluten-Free Certified",
    "100% Sense Gluten (Celíacs)",
    "100% Glutenfrei Zertifiziert",
  ),

  // 9. Dulces, Café, Bodegas & Bares
  def(
    "product",
    "cafe-especialidad",
    "Café de Especialidad (Third Wave)",
    "Specialty Coffee Roasters",
    "Cafè d'Especialitat",
    "Specialty Coffee Roaster",
  ),
  def(
    "product",
    "pasteleria-artesanal",
    "Pastelería Francesa & Repostería",
    "Artisan French Pastry",
    "Pastisseria Artesanal",
    "Feine Konditorei & Patisserie",
  ),
  def(
    "product",
    "panaderia-masa-madre",
    "Panaderías de Masa Madre",
    "Sourdough Organic Bakeries",
    "Forns de Massa Mare",
    "Sauerteigbäckerei",
  ),
  def(
    "product",
    "forns-ensaimadas",
    "Forns Centenarios & Ensaïmades D.O.",
    "Centenary Bakeries & D.O. Ensaïmades",
    "Forns Centenaris i Ensaïmades D.O.",
    "Traditionsbäckereien & Ensaïmadas",
  ),
  def(
    "product",
    "heladeria-artesanal",
    "Heladerías Artesanales Italianas",
    "Artisan Gelato & Ice Cream",
    "Gelateries Artesanals",
    "Handgemachtes Italienisches Eis",
  ),
  def(
    "product",
    "enoturismo",
    "Bodegas, Viñedos & Catas de Vino",
    "Wineries, Vineyards & Wine Tasting",
    "Bodegues, Vinyes i Tasts de Vins",
    "Weingüter, Weinberge & Verkostungen",
  ),
  def(
    "product",
    "vermuterias",
    "Vermuterías & Aperitivos",
    "Vermouth Bars & Aperitivos",
    "Vermuteries i Aperitius",
    "Wermutbars & Aperitif",
  ),
  def(
    "product",
    "cocteleria-autor",
    "Coctelería de Autor & Mixología",
    "Signature Cocktails & Mixology",
    "Cocteleria d'Autor",
    "Signature-Cocktails & Mixologie",
  ),
  def(
    "product",
    "cerveceria-artesanal",
    "Cervecerías Artesanales & Taprooms",
    "Craft Breweries & Taprooms",
    "Cerveseries Artesanals",
    "Craft-Beer-Brauereien",
  ),
  def(
    "product",
    "bares-playa-chiringuitos",
    "Chiringuitos de Playa & Beach Clubs",
    "Beach Bars & Luxury Beach Clubs",
    "Xiringuitos de Platja i Beach Clubs",
    "Strandbars & Luxus-Beachclubs",
  ),
  def(
    "product",
    "rooftop-bars",
    "Rooftop Bars con Vistas Panorámicas",
    "Panoramic Sunset Rooftop Bars",
    "Rooftops amb Vistes Panoràmiques",
    "Panoramische Rooftop-Bars",
  ),

  // 10. Salud, Terapias & Bienestar Holístico
  def(
    "product",
    "spa-circuitos-termales",
    "Spas de Lujo & Circuitos Termales",
    "Luxury Spas & Thermal Circuits",
    "Spas de Luxe i Circuits Termals",
    "Luxus-Spas & Thermalbäder",
  ),
  def(
    "product",
    "masaje-relajante",
    "Masajes Relajantes & Aromaterapia",
    "Relaxation Massages & Aromatherapy",
    "Massatges Relaxants",
    "Entspannungsmassagen & Aromatherapie",
  ),
  def(
    "product",
    "masaje-descontracturante",
    "Masaje Descontracturante & Deportivo",
    "Deep Tissue & Sports Massage",
    "Massatge Descontracturant",
    "Tiefengewebsmassage",
  ),
  def(
    "product",
    "fisioterapia",
    "Fisioterapia & Rehabilitación",
    "Physiotherapy & Rehabilitation",
    "Fisioteràpia i Rehabilitació",
    "Physiotherapie & Rehabilitation",
  ),
  def(
    "product",
    "osteopatia",
    "Osteopatía Estructural & Craneal",
    "Structural Osteopathy",
    "Osteopatia Estructural",
    "Osteopathie",
  ),
  def("product", "quiropractica", "Quiropráctica", "Chiropractic Care", "Quiropràctica", "Chiropraktik"),
  def(
    "product",
    "acupuntura",
    "Acupuntura & Medicina Tradicional China",
    "Acupuncture & TCM",
    "Acupuntura i MTC",
    "Akupunktur & TCM",
  ),
  def(
    "product",
    "drenaje-linfatico",
    "Drenaje Linfático Manual",
    "Manual Lymphatic Drainage",
    "Drenatge Limfàtic",
    "Manuelle Lymphdrainage",
  ),
  def(
    "product",
    "yoga-bienestar",
    "Yoga (Hatha, Vinyasa & Ashtanga)",
    "Yoga Practice & Studios",
    "Ioga i Benestar",
    "Yoga-Studios & Kurse",
  ),
  def(
    "product",
    "pilates-reformer",
    "Pilates Studio (Máquinas & Reformer)",
    "Pilates Reformer & Studio",
    "Pilates Reformer",
    "Reformer-Pilates-Studios",
  ),
  def(
    "product",
    "meditacion-mindfulness",
    "Meditación, Mindfulness & Sound Healing",
    "Meditation & Sound Healing",
    "Meditació i Mindfulness",
    "Meditation & Klangschalen",
  ),
  def(
    "product",
    "retiros-bienestar",
    "Retiros Holísticos en Fincas Rurales",
    "Holistic Wellness Retreats",
    "Retirs de Benestar",
    "Ganzheitliche Wellness-Retreats",
  ),

  // 11. Belleza, Peluquería & Estética Avanzada
  def(
    "product",
    "estetica-facial",
    "Higiene Facial & Peelings Médicos",
    "Facials & Advanced Skin Care",
    "Higiene Facial i Peelings",
    "Gesichtsbehandlungen & Peelings",
  ),
  def(
    "product",
    "estetica-corporal",
    "Tratamientos Corporales & Maderoterapia",
    "Body Contouring & Wood Therapy",
    "Tractaments Corporals",
    "Körperbehandlungen & Maderotherapie",
  ),
  def(
    "product",
    "unas-pestanas",
    "Manicura Rusa, Uñas Gel & Pestañas",
    "Russian Manicure, Gel Nails & Lashes",
    "Ungles de Gel i Pestanyes",
    "Russische Maniküre, Gelnägel & Wimpern",
  ),
  def(
    "product",
    "depilacion-laser",
    "Depilación Láser Diodo & Alejandrita",
    "Laser Hair Removal",
    "Depilació Làser",
    "Dauerhafte Laserhaarentfernung",
  ),
  def(
    "product",
    "microblading-cejas",
    "Microblading & Micropigmentación",
    "Microblading & Permanent Makeup",
    "Microblading de Celles",
    "Microblading & Permanent Make-up",
  ),
  def(
    "product",
    "peluqueria-autor",
    "Peluquerías de Autor & Balayage",
    "Hairstyling Studios & Balayage",
    "Perruqueries d'Autor",
    "Meisterfriseure & Balayage",
  ),
  def(
    "product",
    "barberia-clasica",
    "Barberías Clásicas & Afeitado a Navaja",
    "Traditional Barbershops & Shaving",
    "Barberies Clàssiques",
    "Klassische Barbiere & Nassrasur",
  ),
  def(
    "product",
    "medicina-estetica",
    "Medicina Estética, Bótox & Hialurónico",
    "Aesthetic Medicine & Fillers",
    "Medicina Estètica",
    "Ästhetische Medizin & Botox",
  ),

  // 12. Deporte, Fitness, Ciclismo & Raqueta
  def(
    "product",
    "padel-tenis",
    "Pistas de Pádel & Clubes de Tenis",
    "Padel & Tennis Courts & Clubs",
    "Pistes de Pàdel i Tennis",
    "Padel- & Tennisclubs",
  ),
  def(
    "product",
    "pickleball",
    "Pickleball & Deportes de Raqueta",
    "Pickleball Courts",
    "Pickleball",
    "Pickleball-Plätze",
  ),
  def(
    "product",
    "fitness-gym",
    "Gimnasios & Centros de Fitness",
    "Gyms & High-Performance Fitness",
    "Gimnasos i Fitness",
    "Fitnessstudios & Gyms",
  ),
  def(
    "product",
    "crossfit",
    "Boxes de CrossFit Oficiales",
    "Official CrossFit Boxes",
    "Boxes de CrossFit",
    "CrossFit-Boxen",
  ),
  def(
    "product",
    "entrenamiento-personal",
    "Entrenadores Personales & En Villa",
    "Personal Trainers & Private Villa Sessions",
    "Entrenadors Personals",
    "Personal Training & Villa-Coaching",
  ),
  def(
    "product",
    "calistenia",
    "Parques de Calistenia & Street Workout",
    "Calisthenics & Street Workout Parks",
    "Parcs de Cal·listènia",
    "Calisthenics & Outdoor-Parks",
  ),
  def(
    "product",
    "cicloturismo-carretera",
    "Alquiler de Bicis de Carretera & Gravel",
    "Road & Gravel Bike Rental",
    "Lloguer de Bicicletes de Carretera",
    "Rennrad- & Gravel-Verleih",
  ),
  def(
    "product",
    "btt-mountainbike",
    "Bicicletas de Montaña (MTB) & E-Bikes",
    "Mountain Bikes (MTB) & E-Bikes",
    "Bicicletes de Muntanya i E-Bikes",
    "Mountainbikes (MTB) & E-Bikes",
  ),
  def(
    "product",
    "senderismo-rutas",
    "Senderismo Guiado en la Tramuntana",
    "Guided Hiking in Tramuntana",
    "Senderisme Guiat a la Tramuntana",
    "Geführte Bergwanderungen",
  ),
  def(
    "product",
    "escalada-roca",
    "Escalada en Roca & Psicobloc (DWS)",
    "Rock Climbing & Deep Water Soloing",
    "Escalada en Roca i Psicobloc",
    "Klettern & Deep Water Soloing (DWS)",
  ),
  def(
    "product",
    "golf",
    "Campos de Golf 18 Hoyos & Academias",
    "18-Hole Championship Golf Courses",
    "Camps de Golf de 18 Forats",
    "18-Loch Golfplätze & Akademien",
  ),
  def(
    "product",
    "equitacion-caballos",
    "Hípica & Rutas a Caballo",
    "Horse Riding & Equestrian Centers",
    "Hípica i Rutes a Cavall",
    "Reitsport & Strandausritte",
  ),
  def(
    "product",
    "padel-mallorca",
    "Pádel & Pistas Panorámicas",
    "Padel & Panoramic Courts",
    "Pàdel i Pistes Panoràmiques",
    "Padel & Panorama-Courts",
  ),
  def(
    "product",
    "tenis-mallorca",
    "Tenis en Tierra Batida & Hierba",
    "Clay & Grass Court Tennis",
    "Tennis en Terra Batuda i Gespa",
    "Sand- & Rasentennis",
  ),
  def(
    "product",
    "yoga-pilates",
    "Yoga, Pilates & Movilidad Consciente",
    "Yoga, Pilates & Mindful Movement",
    "Ioga, Pilates i Movilitat",
    "Yoga, Pilates & Achtsamkeit",
  ),
  def(
    "product",
    "escalada-rocodromo",
    "Rocódromos & Escalada Indoor",
    "Climbing Gyms & Indoor Bouldering",
    "Rocòdroms i Escalada Indoor",
    "Kletterhallen & Bouldern",
  ),
  def(
    "product",
    "deportes-nauticos",
    "Vela, Wingfoil & Deportes Náuticos",
    "Sailing, Wingfoil & Water Sports",
    "Vela, Wingfoil i Esports Nàutics",
    "Segeln, Wingfoil & Wassersport",
  ),
  def(
    "product",
    "polideportivo",
    "Centros Polideportivos & Piscinas",
    "Multi-Sport Centers & Pools",
    "Poliesportius i Piscines",
    "Sportzentren & Bäder",
  ),
  def(
    "product",
    "boxeo-artes-marciales",
    "Boxeo, Fitboxing & Artes Marciales",
    "Boxing, Fitboxing & Martial Arts",
    "Boxa, Fitboxing i Arts Marcials",
    "Boxen, Fitboxing & Kampfsport",
  ),

  // 13. Reformas, Construcción, Energía & Hogar
  def(
    "product",
    "construccion-villas",
    "Construcción de Villas de Lujo",
    "Luxury Villa Construction",
    "Construcció de Viles de Luxe",
    "Luxusvillenbau & Generalunternehmer",
  ),
  def(
    "product",
    "reformas-integrales",
    "Reformas Integrales de Viviendas",
    "Full Home & Apartment Renovations",
    "Reformes Integrals d'Habitatges",
    "Komplettrenovierung & Sanierung",
  ),
  def(
    "product",
    "fontaneria-urgencias",
    "Fontanería, Fugas & Desatascos 24h",
    "24/7 Emergency Plumbing & Leaks",
    "Fontaneria d'Urgències 24h",
    "24h-Sanitärnotdienst & Klempner",
  ),
  def(
    "product",
    "electricidad-boletines",
    "Electricistas Autorizados & Boletines",
    "Certified Electricians & Certifications",
    "Electricistes Autoritzats",
    "Zertifizierte Elektriker & Gutachten",
  ),
  def(
    "product",
    "climatizacion-aerotermia",
    "Climatización, Aerotermia & Suelo Radiante",
    "HVAC, Aerothermal & Underfloor Heating",
    "Climatització i Aerotèrmia",
    "Klimaanlagen & Wärmepumpen",
  ),
  def(
    "product",
    "energia-solar-fotovoltaica",
    "Energía Solar Fotovoltaica & Baterías",
    "Solar Photovoltaic Systems & Batteries",
    "Energia Solar Fotovoltaica",
    "Photovoltaik & Solaranlagen",
  ),
  def(
    "product",
    "piscinas-construccion",
    "Construcción de Piscinas Desbordantes",
    "Infinity Pool Construction",
    "Construcció de Piscines Desbordants",
    "Infinity-Poolbau & Schwimmbecken",
  ),
  def(
    "product",
    "mantenimiento-piscinas",
    "Mantenimiento & Cloración Salina",
    "Pool Maintenance & Salt Systems",
    "Manteniment de Piscines",
    "Poolreinigung & Salzwassersysteme",
  ),
  def(
    "product",
    "jardineria-paisajismo",
    "Jardinería Mediterránea & Paisajismo",
    "Mediterranean Landscaping & Gardens",
    "Jardineria i Paisatgisme",
    "Mediterrane Gartengestaltung",
  ),
  def(
    "product",
    "domotica-smart-home",
    "Domótica, Smart Home & Cine en Casa",
    "Smart Home Automation & Audio-Video",
    "Domòtica i Smart Home",
    "Smart Home Automation & Heimkino",
  ),
  def(
    "product",
    "cerrajeria-24h",
    "Cerrajería de Urgencia 24h",
    "24/7 Locksmith Services",
    "Panyeria d'Urgència 24h",
    "24h-Schlüsseldienst",
  ),

  // 14. Servicios VIP, Bodas, Inmobiliaria & Lifestyle
  def(
    "product",
    "chef-privado",
    "Chefs Privados en Villa",
    "Private Chefs for Luxury Villas",
    "Xefs Privats a Viles",
    "Private Köche für Ferienvillen",
  ),
  def(
    "product",
    "conserjeria-vip",
    "Conserjería VIP & Lifestyle Management",
    "VIP Concierge & Lifestyle Management",
    "Consergeria VIP",
    "VIP-Concierge & Lifestyle Management",
  ),
  def(
    "product",
    "alquiler-coches-lujo",
    "Alquiler de Coches Deportivos & de Lujo",
    "Supercar & Luxury Car Rentals",
    "Lloguer de Cotxes de Luxe",
    "Sportwagen- & Luxusautovermietung",
  ),
  def(
    "product",
    "chofer-privado",
    "Chófer Privado & Transfers Aeropuerto VIP",
    "Private Chauffeur & Airport VIP Transfers",
    "Xòfer Privat i Transfers VIP",
    "Privatchauffeur & VIP-Transfers",
  ),
  def(
    "product",
    "organizacion-bodas-eventos",
    "Wedding Planners & Organización de Eventos",
    "Wedding Planners & Luxury Events",
    "Organització de Casaments i Esdeveniments",
    "Hochzeitsplaner & Luxusevents",
  ),
  def(
    "product",
    "floristerias-diseno",
    "Floristerías de Autor & Decoración Floral",
    "Bespoke Floral Design & Florists",
    "Floristeries d'Autor",
    "Meisterfloristik & Blumendesign",
  ),
  def(
    "product",
    "limpieza-villas",
    "Servicio Doméstico & Limpieza de Villas",
    "Villa Cleaning & Housekeeping",
    "Neteja de Viles i Servei Domèstic",
    "Hauswirtschaft & Villenreinigung",
  ),
  def(
    "product",
    "administracion-fincas",
    "Administración & Custodia de Fincas",
    "Property Management & Estate Care",
    "Administració i Custòdia de Finques",
    "Immobilienverwaltung & Finca-Betreuung",
  ),
  def(
    "product",
    "fotografia-inmobiliaria",
    "Fotografía Inmobiliaria & Dron",
    "Real Estate & Drone Photography",
    "Fotografia Immobiliària i Dron",
    "Immobilien- & Drohnenfotografie",
  ),
  def(
    "product",
    "abogados-extranjeria",
    "Abogados Inmobiliarios & Golden Visa",
    "Real Estate Lawyers & Golden Visa",
    "Advocats Immobiliaris",
    "Immobilienanwälte & Golden Visa",
  ),
  def(
    "product",
    "asesoramiento-fiscal-expats",
    "Asesoría Fiscal para No Residentes (Expats)",
    "International Tax & Expat Advisory",
    "Assessoria Fiscal per a Expats",
    "Internationale Steuerberatung für Expats",
  ),
  def(
    "product",
    "mudanzas-internacionales",
    "Mudanzas Internacionales & Guardamuebles",
    "International Removals & Storage",
    "Mudances Internacionals",
    "Internationale Umzüge & Möbellagerung",
  ),
];

/** Modalidad de prestación */
const MOD_TAGS: TagDef[] = [
  def("mod", "a-domicilio", "A domicilio", "At home", "A domicili", "Hausbesuch / Vor Ort"),
  def("mod", "en-local", "En local", "In-store", "Al local", "Im Geschäft"),
  def("mod", "online", "Online", "Online", "En línia", "Online"),
  def("mod", "hibrido", "Híbrido", "Hybrid", "Híbrid", "Hybrid"),
  def("mod", "cita-previa", "Cita previa", "By appointment", "Cita prèvia", "Nach Terminvereinbarung"),
  def("mod", "walk-in", "Walk-in (Sin cita)", "Walk-in", "Sense cita", "Ohne Termin (Walk-in)"),
];

/** Extras/equipación incluidos */
const AMB_TAGS: TagDef[] = [
  def("amb", "patron", "Con patrón incluido", "Skipper included", "Amb patró inclòs", "Inklusive Skipper"),
  def("amb", "conductor", "Con conductor incluido", "Driver included", "Amb conductor inclòs", "Inklusive Fahrer"),
  def("amb", "catering", "Con catering incluido", "Catering included", "Amb càtering inclòs", "Inklusive Catering"),
];

/** Audiencia objetivo */
const AUD_TAGS: TagDef[] = [
  def("aud", "familias", "Familias", "Families", "Famílies", "Familien"),
  def("aud", "parejas", "Parejas", "Couples", "Parelles", "Paare"),
  def("aud", "expat", "Expatriados", "Expats", "Expatriats", "Expats / Residenten"),
  def("aud", "b2b", "Empresas (B2B)", "Business (B2B)", "Empreses (B2B)", "Unternehmen (B2B)"),
  def("aud", "seniors", "Seniors", "Seniors", "Sèniors", "Senioren"),
];

/** Estacionalidad */
const TEMPS_TAGS: TagDef[] = [
  def("temps", "verano", "Verano", "Summer", "Estiu", "Sommer"),
  def("temps", "invierno", "Invierno", "Winter", "Hivern", "Winter"),
  def("temps", "todo-el-ano", "Todo el año", "All year round", "Tot l'any", "Ganzjährig"),
];

/* ------------------------------------------------------------------ */
/* Etiquetas geográficas derivadas (zona:*)                            */
/* ------------------------------------------------------------------ */

/**
 * Deriva las etiquetas `zona:<slug>` automáticamente desde
 * `MALLORCA_ZONES` (macro-zona) y `popularAreas` (núcleo fino),
 * garantizando paridad entre geografía y taxonomía de etiquetas.
 */
export function buildZoneTags(): TagDef[] {
  const tags: TagDef[] = [];
  for (const zone of MALLORCA_ZONES) {
    tags.push(def("zona", zone.id, zone.name.es, zone.name.en, zone.name.ca, zone.name.de));
    for (const area of zone.popularAreas) {
      const value = normalizeToKebabAscii(area);
      // Los topónimos propios no se traducen (GR-12: fidelidad al nombre oficial)
      tags.push(def("zona", value, area, area, area, area));
    }
  }
  return tags;
}

/* ------------------------------------------------------------------ */
/* Índice y API pública                                                */
/* ------------------------------------------------------------------ */

const TAG_INDEX = new Map<string, TagDef>();
for (const tag of [...PRODUCT_TAGS, ...MOD_TAGS, ...AMB_TAGS, ...AUD_TAGS, ...TEMPS_TAGS, ...buildZoneTags()]) {
  if (!TAG_INDEX.has(tag.id)) TAG_INDEX.set(tag.id, tag);
}

/** Catálogo global deduplicado (única fuente válida de tags). */
export const TAG_CATALOG: TagDef[] = [...TAG_INDEX.values()];

/** Parsea "dominio:valor"; null si el dominio es desconocido o el formato inválido. */
export function parseTag(tag: string): { domain: TagDomain; value: string } | null {
  const sep = tag.indexOf(":");
  if (sep <= 0 || sep === tag.length - 1) return null;
  const rawDomain = tag.slice(0, sep);
  if (!(TAG_DOMAINS as readonly string[]).includes(rawDomain)) return null;
  return { domain: rawDomain as TagDomain, value: tag.slice(sep + 1) };
}

/** Patrón técnico: `^[a-z]+:[a-z0-9]+(-[a-z0-9]+)*$` (kebab-case ASCII). */
export function isTagPattern(tag: string): boolean {
  return /^[a-z]+:[a-z0-9]+(-[a-z0-9]+)*$/.test(tag);
}

/** Una tag es válida si cumple patrón, dominio conocido y existe en el catálogo. */
export function isValidTag(tag: string): boolean {
  return isTagPattern(tag) && parseTag(tag) !== null && TAG_INDEX.has(tag);
}

/** Clave i18n de visualización: "product:lujo" → "tags.product.lujo". */
export function tagI18nKey(tag: string): string | null {
  const parsed = parseTag(tag);
  return parsed ? `tags.${parsed.domain}.${parsed.value}` : null;
}

export function getTagById(id: string): TagDef | undefined {
  return TAG_INDEX.get(id);
}

export function getTagsByDomain(domain: TagDomain): TagDef[] {
  return TAG_CATALOG.filter((t) => t.domain === domain);
}
