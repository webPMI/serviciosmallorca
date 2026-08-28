/**
 * src/lib/taxonomyTree.ts
 *
 * 🌳 ÁRBOL JERÁRQUICO DE CATEGORÍAS & NICHOS (100+ Especialidades)
 *
 * Estructura jerárquica de 3 niveles:
 * 1. Macro-Bloques / SuperSectores
 * 2. Categorías Principales
 * 3. Especialidades / Subcategorías de Nicho (Tags de Producto)
 */

import type { Locale } from "../i18n";
import type { ServiceItem } from "../data/services/types.ts";

export interface TaxonomyNiche {
  id: string;
  tag: string; // e.g. "product:fine-line"
  name: Record<Locale, string>;
  keywords: string[];
}

export interface TaxonomyCategoryNode {
  id: string;
  slug: string;
  icon: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  subcategories: TaxonomyNiche[];
}

export interface TaxonomyBlockNode {
  id: string;
  icon: string;
  name: Record<Locale, string>;
  categories: TaxonomyCategoryNode[];
}

export const TAXONOMY_TREE: TaxonomyBlockNode[] = [
  // BLOQUE 1: Estética & Body Art
  {
    id: "estetica-body-art",
    icon: "✒️",
    name: {
      es: "Estética, Tatuaje & Cuidado Personal",
      en: "Aesthetics, Tattoo & Body Art",
      ca: "Estètica, Tatuatge i Cura Personal",
      de: "Ästhetik, Tattoo & Körperkunst",
    },
    categories: [
      {
        id: "tatuajes-piercing",
        slug: "tatuajes-piercing",
        icon: "💉",
        name: {
          es: "Estudios de Tatuaje & Piercing",
          en: "Tattoo & Piercing Studios",
          ca: "Estudis de Tatuatge i Pírcing",
          de: "Tattoo- & Piercing-Studios",
        },
        description: {
          es: "Estudios de autor con artistas residentes e higiénico-sanitarios oficiales.",
          en: "Author studios featuring resident artists and official hygiene standards.",
          ca: "Estudis d'autor amb artistes residents i registres sanitaris oficials.",
          de: "Autorstudios mit Resident-Künstlern und zertifizierten Hygienestandards.",
        },
        subcategories: [
          {
            id: "fine-line",
            tag: "product:fine-line",
            name: { es: "Tatuaje Fine-Line", en: "Fine Line Tattoo", ca: "Tatuatge Fine-Line", de: "Fine-Line-Tattoo" },
            keywords: ["fine-line", "fine line", "fineline", "linea fina", "línea fina", "minimalista", "microtatuaje"],
          },
          {
            id: "micro-tatuaje",
            tag: "product:micro-tatuaje",
            name: {
              es: "Micro-Tatuajes & Minimalismo",
              en: "Micro-Tattoos & Minimalism",
              ca: "Micro-Tatuatges",
              de: "Mikro-Tattoos",
            },
            keywords: ["microtatuaje", "micro tattoo", "minimalista", "discreto"],
          },
          {
            id: "realismo",
            tag: "product:realismo",
            name: {
              es: "Micro-realismo & Realismo",
              en: "Micro-realism & Realism",
              ca: "Micro-realisme",
              de: "Mikro-Realismus",
            },
            keywords: ["realismo", "realista", "micro-realismo", "retrato", "black and grey"],
          },
          {
            id: "anime-manga",
            tag: "product:anime-manga",
            name: {
              es: "Anime & Manga Tattoo",
              en: "Anime & Manga Tattoo",
              ca: "Anime i Manga Tattoo",
              de: "Anime- & Manga-Tattoo",
            },
            keywords: ["anime", "manga", "otaku", "comic", "animacion japonesa"],
          },
          {
            id: "traditional",
            tag: "product:traditional",
            name: {
              es: "Tatuaje Tradicional / Old School",
              en: "Traditional / Old School",
              ca: "Tradicional Old School",
              de: "Traditional Old School",
            },
            keywords: ["traditional", "old school", "tradicional", "sailor"],
          },
          {
            id: "piercing-titanio",
            tag: "product:piercing-titanio",
            name: {
              es: "Piercing & Joyería en Titanio",
              en: "Titanium Piercing & Jewelry",
              ca: "Pírcing de Titani",
              de: "Titan-Piercing",
            },
            keywords: ["piercing", "titanio", "joyeria corporal", "perforacion", "anillado"],
          },
        ],
      },
      {
        id: "estetica-belleza",
        slug: "estetica-belleza",
        icon: "✨",
        name: {
          es: "Estética & Belleza",
          en: "Beauty & Aesthetics",
          ca: "Estètica i Bellesa",
          de: "Kosmetik & Ästhetik",
        },
        description: {
          es: "Tratamientos faciales, corporales y salones de uñas de alto nivel.",
          en: "Facial and body treatments alongside premier nail salons.",
          ca: "Tractaments facials, corporals i salons d'ungles.",
          de: "Gesichts- und Körperbehandlungen sowie erstklassige Nagelstudios.",
        },
        subcategories: [
          {
            id: "estetica-facial",
            tag: "product:estetica-facial",
            name: {
              es: "Estética Facial & Corporal",
              en: "Facial & Body Care",
              ca: "Estètica Facial",
              de: "Gesichtsbehandlungen",
            },
            keywords: ["facial", "corporal", "higiene facial", "estetica", "masaje"],
          },
          {
            id: "unas-pestanas",
            tag: "product:unas-pestanas",
            name: {
              es: "Salón de Uñas & Pestañas",
              en: "Nails & Lashes Studio",
              ca: "Ungles i Pestanyes",
              de: "Nagel- & Wimpernstudio",
            },
            keywords: ["uñas", "manicura", "pedicura", "pestañas", "lifting", "cejas"],
          },
        ],
      },
    ],
  },

  // BLOQUE 2: Artes Visuales & Artesanía
  {
    id: "artes-visuales-artesania",
    icon: "🏛️",
    name: {
      es: "Artes Visuales, Galerías & Artesanía",
      en: "Fine Arts, Galleries & Heritage Crafts",
      ca: "Arts Visuals, Galeries i Artesania",
      de: "Bildende Kunst, Galerien & Kunsthandwerk",
    },
    categories: [
      {
        id: "galerias-museos",
        slug: "galerias-museos",
        icon: "🖼️",
        name: {
          es: "Galerías de Arte & Museos",
          en: "Art Galleries & Museums",
          ca: "Galeries d'Art i Museus",
          de: "Kunstgalerien & Museen",
        },
        description: {
          es: "Espacios de exhibición contemporánea, oratorios históricos y museos.",
          en: "Contemporary art venues, historic chapels, and landmark museums.",
          ca: "Espais d'art contemporani, oratoris històrics i museus.",
          de: "Räume für Gegenwartskunst, historische Kapellen und Museen.",
        },
        subcategories: [
          {
            id: "arte-contemporaneo",
            tag: "product:arte-contemporaneo",
            name: {
              es: "Arte Contemporáneo & Vanguardias",
              en: "Contemporary & Avant-Garde Art",
              ca: "Art Contemporani",
              de: "Gegenwartskunst",
            },
            keywords: ["arte contemporaneo", "galeria", "exposicion", "vanguardia", "bienal"],
          },
          {
            id: "escultura",
            tag: "product:escultura",
            name: {
              es: "Escultura & Parques de Arte",
              en: "Sculpture & Art Parks",
              ca: "Escultura i Parcs d'Art",
              de: "Skulpturenparks",
            },
            keywords: ["escultura", "bronce", "parque de arte", "instalacion", "monumento"],
          },
        ],
      },
      {
        id: "artesania-viva",
        slug: "artesania-viva",
        icon: "🏺",
        name: {
          es: "Artesanía Tradicional & Vidrio Soplado",
          en: "Traditional Crafts & Blown Glass",
          ca: "Artesania Tradicional i Vidre Bufat",
          de: "Traditionelles Handwerk & Glasbläserei",
        },
        description: {
          es: "Maestros del vidrio soplado, alfarería de barro y telas de lenguas.",
          en: "Masters of hand-blown glass, pottery, and traditional ikat textiles.",
          ca: "Mestres del vidre bufat, terrisseria de fang i teles de llengües.",
          de: "Meister der Glasbläserkunst, Tonkeramik und traditioneller Ikat-Stoffe.",
        },
        subcategories: [
          {
            id: "vidrio-soplado",
            tag: "product:vidrio-soplado",
            name: {
              es: "Vidrio Soplado Artesanal",
              en: "Hand-Blown Glass",
              ca: "Vidre Bufat",
              de: "Mundgeblasenes Glas",
            },
            keywords: ["vidrio soplado", "gordiola", "lafiore", "horno de vidrio", "cristal"],
          },
          {
            id: "ceramica-balear",
            tag: "product:ceramica-balear",
            name: {
              es: "Cerámica Balear & Siurells",
              en: "Balearic Ceramics & Siurells",
              ca: "Ceràmica Balear",
              de: "Balearische Keramik",
            },
            keywords: ["ceramica", "alfareria", "portol", "siurell", "barro", "terra cuita"],
          },
          {
            id: "joyeria-artesanal",
            tag: "product:joyeria-artesanal",
            name: {
              es: "Joyería de Autor & Lujo",
              en: "Artisan Jewelry & Luxury",
              ca: "Joieria d'Autor",
              de: "Autorenschmuck",
            },
            keywords: ["joyeria", "joyas", "orfebreria", "artesania de lujo", "plata", "oro"],
          },
        ],
      },
    ],
  },

  // BLOQUE 3: Gastronomía Epicúrea
  {
    id: "gastronomia-epicurean",
    icon: "🍷",
    name: {
      es: "Gastronomía Epicúrea & Enoturismo",
      en: "Epicurean Dining & Wine Culture",
      ca: "Gastronomia Epicúria i Enoturisme",
      de: "Kulinarik & Weinkultur",
    },
    categories: [
      {
        id: "restaurantes-mar-tapas",
        slug: "restaurantes-mar-tapas",
        icon: "🦞",
        name: {
          es: "Pescados, Paellas, Sushi & Tapas",
          en: "Seafood, Paellas, Sushi & Tapas",
          ca: "Peix fresc, Paelles, Sushi i Tapes",
          de: "Fisch, Paellas, Sushi & Tapas",
        },
        description: {
          es: "Pescados frescos del día, paellas marineras, sushi japonés y tapas de autor.",
          en: "Fresh daily catch, seafood paellas, Japanese sushi, and signature tapas.",
          ca: "Peix fresc del dia, paelles marineres, sushi japonès i tapes d'autor.",
          de: "Tagesfrischer Fisch, Paellas, japanisches Sushi und Signature-Tapas.",
        },
        subcategories: [
          {
            id: "paellas-arroces",
            tag: "product:paellas-arroces",
            name: {
              es: "Paellas & Arroces Marineros",
              en: "Paellas & Seafood Rice",
              ca: "Paelles i Arrossos",
              de: "Paellas & Reisgerichte",
            },
            keywords: ["paella", "arroz ciego", "arroz caldoso", "fideua", "arroz negro"],
          },
          {
            id: "pescados-mariscos",
            tag: "product:pescados-mariscos",
            name: {
              es: "Pescados & Mariscos de Lonja",
              en: "Fresh Seafood & Fish",
              ca: "Peixos de Llotja",
              de: "Fangfrischer Fisch",
            },
            keywords: ["pescado", "marisco", "lonja", "caldereta", "lubina", "gamba de soller"],
          },
          {
            id: "sushi-japones",
            tag: "product:sushi-japones",
            name: {
              es: "Sushi & Cocina Japonesa",
              en: "Sushi & Japanese Cuisine",
              ca: "Sushi i Japonès",
              de: "Sushi & Japanisch",
            },
            keywords: ["sushi", "sashimi", "nigiri", "uramaki", "omakase", "japones"],
          },
          {
            id: "cocina-asiatica",
            tag: "product:cocina-asiatica",
            name: {
              es: "Cocina Asiática & Fusión",
              en: "Asian & Fusion Cuisine",
              ca: "Cuina Asiàtica",
              de: "Asiatische Fusionsküche",
            },
            keywords: ["asiatico", "thai", "dim sum", "ramen", "wok", "fusion"],
          },
          {
            id: "cocina-espanola",
            tag: "product:cocina-espanola",
            name: {
              es: "Cocina Española & Tradicional",
              en: "Spanish & Traditional",
              ca: "Cuina Espanyola",
              de: "Spanische Küche",
            },
            keywords: ["española", "tradicional", "asador", "lechal", "jamon iberico"],
          },
          {
            id: "cocina-mediterranea",
            tag: "product:cocina-mediterranea",
            name: {
              es: "Cocina Mediterránea & Km0",
              en: "Mediterranean & Local Km0",
              ca: "Cuina Mediterrània",
              de: "Mediterrane Km0-Küche",
            },
            keywords: ["mediterranea", "km0", "producto local", "mallorquina", "tumbet"],
          },
          {
            id: "tapas-autor",
            tag: "product:tapas-autor",
            name: {
              es: "Tapas de Autor & Tradición",
              en: "Signature & Classic Tapas",
              ca: "Tapes d'Autor",
              de: "Signature-Tapas",
            },
            keywords: ["tapas", "tapes", "platillos", "variat", "tapas de autor"],
          },
        ],
      },
      {
        id: "bodegas-cafes-hornos",
        slug: "bodegas-cafes-hornos",
        icon: "☕",
        name: {
          es: "Bodegas, Cafés & Panaderías",
          en: "Wineries, Specialty Coffee & Bakeries",
          ca: "Bodegues, Cafès i Forns",
          de: "Weingüter, Kaffeeröstereien & Bäckereien",
        },
        description: {
          es: "Viñedos con D.O. Binissalem/Pla i Llevant, cafés de especialidad y hornos centenarios.",
          en: "D.O. vineyards, third wave specialty coffee roasters, and centenary bakeries.",
          ca: "Vinyes amb D.O., cafè d'especialitat i forns centenaris d'ensaïmades.",
          de: "Weingüter mit D.O., Specialty Coffee und traditionsreiche Bäckereien.",
        },
        subcategories: [
          {
            id: "enoturismo",
            tag: "product:enoturismo",
            name: {
              es: "Bodegas & Enoturismo",
              en: "Wineries & Wine Tasting",
              ca: "Bodegues i Enoturisme",
              de: "Weingüter & Weinproben",
            },
            keywords: ["bodega", "vino", "enoturismo", "cata de vino", "vinos de mallorca", "binissalem"],
          },
          {
            id: "cafe-especialidad",
            tag: "product:cafe-especialidad",
            name: {
              es: "Café de Especialidad (Third Wave)",
              en: "Specialty Coffee",
              ca: "Cafè d'Especialitat",
              de: "Specialty Coffee",
            },
            keywords: ["cafe", "cafe de especialidad", "specialty coffee", "flat white", "barista"],
          },
          {
            id: "pasteleria-artesanal",
            tag: "product:pasteleria-artesanal",
            name: {
              es: "Hornos Artesanales & Ensaïmades",
              en: "Artisan Bakeries & Pastry",
              ca: "Forns i Ensaïmades",
              de: "Handwerksbäckerei & Ensaïmadas",
            },
            keywords: ["ensaimada", "horno", "forn", "pasteleria", "panaderia", "cocarroi"],
          },
        ],
      },
    ],
  },

  // BLOQUE 4: Náutica, Deportes & Aventura
  {
    id: "nautica-deportes-aventura",
    icon: "⛵",
    name: {
      es: "Náutica, Deportes & Aventura",
      en: "Nautical, Sports & Adventure",
      ca: "Nàutica, Esports i Aventura",
      de: "Nautik, Sport & Abenteuer",
    },
    categories: [
      {
        id: "charter-puertos",
        slug: "charter-puertos",
        icon: "⚓",
        name: {
          es: "Puertos Deportivos, Yates & Veleros",
          en: "Marinas, Yachts & Sailing Charters",
          ca: "Ports Esportius, Iots i Velers",
          de: "Marinas, Yachten & Segelcharter",
        },
        description: {
          es: "Marinas de superyates, chárter privado de veleros, catamaranes, motos de agua y llauts tradicionales.",
          en: "Superyacht marinas, private sailing and motor yacht charters, catamarans, and traditional llaüts.",
          ca: "Marines de superiots, xàrter privat de velers, catamarans i llaüts tradicionals.",
          de: "Superyacht-Marinas, privater Segel- und Motoryacht-Charter, Katamarane und Llaüts.",
        },
        subcategories: [
          {
            id: "charter-yates",
            tag: "product:charter-yates",
            name: {
              es: "Chárter de Superyates & Lujo",
              en: "Superyacht & Luxury Charter",
              ca: "Xàrter de Superiots",
              de: "Superyacht-Charter",
            },
            keywords: ["yate", "superyate", "charter", "alquiler de yates", "yacht"],
          },
          {
            id: "veleros",
            tag: "product:veleros",
            name: {
              es: "Alquiler de Veleros",
              en: "Sailing Boats & Sailboats",
              ca: "Lloguer de Velers",
              de: "Segelboote",
            },
            keywords: ["velero", "vela", "sailboat", "monocasco", "crucero a vela"],
          },
          {
            id: "catamaranes",
            tag: "product:catamaranes",
            name: {
              es: "Catamaranes & Day Charters",
              en: "Catamarans & Day Charters",
              ca: "Catamarans",
              de: "Katamarane",
            },
            keywords: ["catamaran", "catamaranes", "multicasco", "day charter"],
          },
          {
            id: "llauts-tradicionales",
            tag: "product:llauts-tradicionales",
            name: {
              es: "Llaüts Tradicionales de Madera",
              en: "Traditional Wooden Llaüts",
              ca: "Llaüts Tradicionals",
              de: "Llaüts",
            },
            keywords: ["llaut", "llaüt", "barca tradicional", "madera", "pesca tradicional"],
          },
          {
            id: "alquiler-barcos",
            tag: "product:alquiler-barcos",
            name: {
              es: "Alquiler de Barcos & Lanchas",
              en: "Day Boat & Speedboat Rental",
              ca: "Lloguer de Barques",
              de: "Bootsverleih",
            },
            keywords: ["barco", "lancha", "barca", "alquiler barco", "sin titulacion"],
          },
          {
            id: "motos-agua",
            tag: "product:motos-agua",
            name: { es: "Motos de Agua & Jet Ski", en: "Jet Ski & Water Bikes", ca: "Motos d'Aigua", de: "Jetski" },
            keywords: ["moto de agua", "jet ski", "jetski", "moto de agua calvia"],
          },
        ],
      },
      {
        id: "buceo-deportes-aire-libre",
        slug: "buceo-deportes-aire-libre",
        icon: "🤿",
        name: {
          es: "Buceo, Tenis & Actividades al Aire Libre",
          en: "Diving, Tennis & Outdoor Activities",
          ca: "Submarinisme, Tennis i Aire Lliure",
          de: "Tauchen, Tennis & Outdoor",
        },
        description: {
          es: "Inmersiones en reservas marinas, pistas de pádel y rutas de montaña en la Tramuntana.",
          en: "Marine reserve dives, padel tennis clubs, and mountain hiking trails.",
          ca: "Immersions en reserves marines, clubs de pàdel i senderisme a la Tramuntana.",
          de: "Tauchgänge in Meeresschutzgebieten, Padel-Tennis und Bergwanderungen.",
        },
        subcategories: [
          {
            id: "buceo",
            tag: "product:buceo",
            name: { es: "Buceo & Reservas Marinas", en: "Scuba Diving & Reserves", ca: "Submarinisme", de: "Tauchen" },
            keywords: ["buceo", "submarinismo", "padi", "inmersion", "toro", "malgrats"],
          },
          {
            id: "padel-tenis",
            tag: "product:padel-tenis",
            name: { es: "Pádel & Tenis", en: "Padel & Tennis", ca: "Pàdel i Tennis", de: "Padel & Tennis" },
            keywords: ["padel", "pádel", "pàdel", "tenis", "tennis", "pista", "raqueta", "partido"],
          },
          {
            id: "senderismo-rutas",
            tag: "product:senderismo-rutas",
            name: {
              es: "Senderismo & Rutas de Montaña",
              en: "Hiking & Mountain Trails",
              ca: "Senderisme",
              de: "Bergwandern",
            },
            keywords: ["senderismo", "trail", "montaña", "tramuntana", "excursion", "excursión"],
          },
          {
            id: "yoga-bienestar",
            tag: "product:yoga-bienestar",
            name: {
              es: "Yoga & Bienestar Holístico",
              en: "Yoga & Holistic Wellness",
              ca: "Ioga i Benestar",
              de: "Yoga & Wellness",
            },
            keywords: ["yoga", "pilates", "meditacion", "meditación", "bienestar", "asanas"],
          },
        ],
      },
    ],
  },
];

/**
 * Infiere automáticamente los tags de nicho a partir de los datos de un negocio.
 */
export function inferNicheTags(service: ServiceItem): string[] {
  const currentTags = new Set<string>(service.tags || []);
  const searchableText = [
    service.name || "",
    service.category || "",
    service.shortDescription?.es || "",
    service.shortDescription?.en || "",
    service.shortDescription?.ca || "",
    service.shortDescription?.de || "",
    service.fullDescription?.es || "",
    service.fullDescription?.en || "",
    ...(service.highlights?.es || []),
    ...(service.highlights?.en || []),
    ...(service.servicesProvided?.es || []),
    ...(service.servicesProvided?.en || []),
  ]
    .join(" ")
    .toLowerCase();

  for (const block of TAXONOMY_TREE) {
    for (const cat of block.categories) {
      for (const sub of cat.subcategories) {
        if (sub.keywords.some((kw) => searchableText.includes(kw.toLowerCase()))) {
          currentTags.add(sub.tag);
        }
      }
    }
  }

  return Array.from(currentTags);
}
