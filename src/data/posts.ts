export type PostType = "guia" | "top_list" | "noticia" | "tutorial";
export type TopicCluster = "gastronomia" | "aventura_lifestyle" | "servicios_hogar" | "arte_cultura" | "actualidad";

export interface BlogPost {
  id: string;
  slug: string;
  title: {
    es: string;
    en: string;
    ca: string;
  };
  excerpt: {
    es: string;
    en: string;
    ca: string;
  };
  content: {
    es: string;
    en: string;
    ca: string;
  };
  category: string;
  postType?: PostType;
  topicCluster?: TopicCluster;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  relatedServiceIds: string[];
  featured: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "guia-alquiler-yates-mallorca",
    slug: "guia-alquiler-yates-mallorca",
    postType: "guia",
    topicCluster: "aventura_lifestyle",
    title: {
      es: "Guía Definitiva: Cómo Alquilar un Barco o Catamarán en Mallorca este Año",
      en: "Ultimate Guide: How to Charter a Boat or Catamaran in Mallorca This Year",
      ca: "Guia Definitiva: Com Llogar una Embarcació o Catamarà a Mallorca Aquest Any",
    },
    excerpt: {
      es: "Descubre las mejores zonas de navegación (Puerto Portals, Andratx, Bahía de Palma), precios medios, consejos con patrón y cómo elegir la embarcación ideal.",
      en: "Discover top sailing grounds (Puerto Portals, Andratx, Palma Bay), average charter rates, skipper tips, and how to pick the perfect yacht.",
      ca: "Descobreix les millors zones de navegació (Puerto Portals, Andratx, Badia de Palma), preus mitjans i consells per llogar amb patró.",
    },
    content: {
      es: `
Mallorca es uno de los destinos náuticos más codiciados del Mediterráneo. Con más de 550 kilómetros de costa y más de 200 calas y playas, recorrer la isla desde el mar es una experiencia inigualable.

### 1. ¿Qué tipo de embarcación elegir?
- **Lanchas a motor (6-10m):** Ideales para excursiones de día rápido entre calas cercanas como Cala Fornells o Illetes.
- **Catamaranes de vela:** Perfectos para familias o grupos de amigos gracias a su enorme habitabilidad, estabilidad y zona de solárium como **Oasis Catamarán**.
- **Yates a motor de lujo:** Máximo confort, tripulación profesional completa y juguetes acuáticos como Seabob o motos de agua.

### 2. Los mejores puertos de salida en Mallorca
- **Muelle de Golondrinas & Port de Palma:** Salida directa para disfrutar de puestas de sol con catering a bordo.
- **Puerto Portals & Port Adriano:** Puertos de referencia en el suroeste con embarcaciones de alta gama y acceso directo a calas cristalinas.
- **Port de Sóller:** La puerta de entrada para explorar los impresionantes acantilados de Sa Calobra y Cala Tuent.

### 3. Recomendación Verificada de Servicios Mallorca
Para una experiencia 100% segura y transparente, recomendamos acudir siempre a empresas consolidadas con licencias oficiales y patrones experimentados como **Oasis Catamarán Palma**.
      `,
      en: `
Mallorca is globally celebrated as one of the prime yacht charter destinations in the Mediterranean. With over 550 km of coast and 200+ coves, experiencing Mallorca by sea is unmatched.

### 1. Choosing the right boat
- **Day motorboats (6-10m):** Best for quick bay-hopping to nearby coves like Illetes and Portals Vells.
- **Sailing Catamarans:** Excellent for families and groups due to deck space, stability, and spacious trampolines, like **Oasis Catamarán**.
- **Luxury superyachts:** Supreme comfort with dedicated captain, private chef, and high-end water toys.

### 2. Best departure marinas
- **Palma Harbor:** Prime sunset sail departures with curated catering.
- **Puerto Portals & Port Adriano:** Southwest luxury hubs with swift access to turquoise coves.
- **Port de Sóller:** The gateway to Sa Calobra and Cala Tuent.
      `,
      ca: `
Mallorca és una de les destinacions nàutiques més desitjades del Mediterrani. Amb més de 550 km de costa i més de 200 cales, navegar per l'illa és una vivència inoblidable.

### 1. Quin tipus d'embarcació triar?
- **Catamarans:** Perfectes per a famílies i grups per la seva estabilitat i amplitud com **Oasis Catamarà**.
- **Iots de luxe:** Màxim confort, tripulació professional i esports aquàtics.
      `,
    },
    category: "nautica-charter",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Guía Náutica Oficial",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-01-15",
    readTime: "6 min",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Navegación", "Yates", "Catamarán", "Puerto Portals", "Mallorca"],
    relatedServiceIds: ["oasis-catamaran-palma"],
    featured: true,
  },
  {
    id: "top-restaurantes-tapas-palma",
    slug: "top-restaurantes-tapas-palma",
    postType: "top_list",
    topicCluster: "gastronomia",
    title: {
      es: "Top 5 Restaurantes y Barras Gastronómicas con Mejores Reseñas en Palma de Mallorca",
      en: "Top 5 Tapas Bars & High-End Restaurants with Best Reviews in Palma",
      ca: "Top 5 Restaurants i Barres Gastronòmiques amb Millors Ressenyes a Palma",
    },
    excerpt: {
      es: "Descubre dónde degustar el mejor marisco de lonja, tapas de autor en directo y producto balear en el Casco Antiguo y Santa Catalina.",
      en: "Explore where to taste prime coastal seafood, live counter tapas, and authentic Balearic produce in Palma Old Town and Santa Catalina.",
      ca: "Descobreix on tastar el millor marisc fresc de llotja i tapes d'autor al centre de Palma.",
    },
    content: {
      es: `
Palma se ha consolidado como una de las capitales gastronómicas más dinámicas de Europa. La combinación de producto mediterráneo de lonja, tradición culinaria mallorquina y técnicas de vanguardia convierte a la ciudad en un destino culinario imprescindible.

### 1. El Camino Palma (Carrer de Can Brondo)
Con una espectacular barra continua de mármol y cocina abierta en directo, **El Camino Palma** es un referente indiscutible:
- **Especialidades:** Gamba roja de Sóller con sal de Es Trenc, chipirones con sobrasada y miel, alcachofas confitadas a la brasa.
- **Ambiente:** Dinámico, cosmopolita y enfocado en el producto fresco del día.

### 2. Consejos para Comer como un Local en Palma
- **Reserva con antelación:** Los locales de alta demanda gestionan sus reservas exclusivamente vía web con semanas de antelación.
- **Pide producto de temporada:** No dejes de probar el marisco fresco y los aceites de oliva virgen extra con D.O. Oli de Mallorca.
      `,
      en: `
Palma stands as one of the most vibrant culinary hotspots in Southern Europe, blending pristine Mediterranean catch with cutting-edge counter dining.

### 1. El Camino Palma (Carrer de Can Brondo)
Featuring an iconic illuminated marble counter, **El Camino Palma** offers an unforgettable open-kitchen experience:
- **Signature dishes:** Sweet Sóller red prawns, sautéed baby squid with artisanal sobrasada and honey.
- **Atmosphere:** Lively, chic, and celebrating pure island ingredients.
      `,
      ca: `
Palma és un dels epicentres gastronòmics més potents del Mediterrani.

### 1. El Camino Palma
Amb una barra de marbre espectacular i cuina a la vista, **El Camino Palma** destaca per la seva gamba vermella de Sóller i tapes d'autor excepcionals.
      `,
    },
    category: "gastronomia-catering",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Crítica Gastronómica Balear",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-02-10",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Restaurantes Palma", "Tapas Palma", "El Camino", "Gamba de Sóller", "Gastronomía"],
    relatedServiceIds: ["el-camino-palma"],
    featured: true,
  },
  {
    id: "mejores-spas-talasoterapia-mallorca",
    slug: "mejores-spas-talasoterapia-mallorca",
    postType: "top_list",
    topicCluster: "aventura_lifestyle",
    title: {
      es: "Santuarios de Bienestar: Los Mejores Spas y Centros de Talasoterapia en Mallorca",
      en: "Wellness Sanctuaries: Top Luxury Spas & Thalassotherapy Centers in Mallorca",
      ca: "Santuari de Benestar: Els Millors Spas i Centres de Talassoteràpia a Mallorca",
    },
    excerpt: {
      es: "Guía de los templos de relajación más exclusivos de la isla: piscinas de agua de mar climatizada, medicina tradicional china y alta cosmética.",
      en: "Guide to the island's most exclusive relaxation temples: heated seawater pools, traditional Chinese medicine, and luxury skincare.",
      ca: "Guia dels temples de relaxació més exclusius de l'illa amb piscines d'aigua marina i medicina tradicional.",
    },
    content: {
      es: `
La combinación de la brisa marina, el clima mediterráneo y spas de clase mundial convierten a Mallorca en el destino ideal para una escapada de desconexión y salud holística.

### 1. Arabella Spa (The St. Regis Mardavall, Calvià)
Con más de 4.700 m² dedicados al bienestar, **Arabella Spa** es galardonado como uno de los mejores spas de Europa:
- **Instalaciones:** Piscinas termales de agua de mar natural climatizada, cabinas ayurvédicas, grutas de hielo.
- **Tratamientos de Autor:** Médicos residentes especialistas en Medicina Tradicional China y rituales faciales antiedad de alta cosmética Valmont.
      `,
      en: `
Mallorca is globally acclaimed for holistic wellness and thalassotherapy retreats.

### 1. Arabella Spa (St. Regis Mardavall, Calvià)
Spanning 4,700 m², **Arabella Spa** provides hydrotherapy pools, Traditional Chinese Medicine doctors, and Valmont anti-aging treatments.
      `,
      ca: `
Mallorca és la destinació ideal per a la salut holística i el descans absolut.

### 1. Arabella Spa (Calvià)
Més de 4.700 m² dedicats a la talassoteràpia amb aigua de mar climatitzada i especialistes en Medicina Tradicional Xinesa.
      `,
    },
    category: "salud-bienestar",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Salud & Bienestar",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-02-18",
    readTime: "4 min",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    tags: ["Spa Mallorca", "Talasoterapia", "Arabella Spa", "Calvià", "Bienestar"],
    relatedServiceIds: ["arabella-spa-mallorca"],
    featured: true,
  },
  {
    id: "guia-mejores-estudios-tatuaje-mallorca",
    slug: "guia-mejores-estudios-tatuaje-mallorca",
    postType: "guia",
    topicCluster: "arte_cultura",
    title: {
      es: "Guía de los Mejores Estudios de Tatuaje en Mallorca: Estilos, Zonas y Consejos Sanitarios",
      en: "Guide to the Best Tattoo Studios in Mallorca: Styles, Zones, and Hygiene Tips",
      ca: "Guia dels Millors Estudis de Tatuatge a Mallorca: Estils, Zones i Consells Sanitaris",
    },
    excerpt: {
      es: "Analizamos los estudios de tatuaje y piercing más destacados de Palma y Calvià. Consejos para elegir artista, estilos (Fine Line, Realismo, Tradicional) y normativas sanitarias.",
      en: "We review top-rated tattoo and piercing studios across Palma and Calvià. Tips on choosing artists, styles, and hygiene standards.",
      ca: "Analitzem els estudis de tatuatge més destacats de Palma i Calvià. Consells per triar artista, estils i normativa sanitària.",
    },
    content: {
      es: `
Mallorca cuenta con una escena artística de tatuaje de primer nivel europeo. Desde el emblemático Casco Antiguo de Palma hasta Passeig Mallorca y Santa Catalina, la isla reúne a reconocidos artistas internacionales y maestros del trazo.

### 1. Estilos más demandados en la isla
- **Fine Line & Microrealismo:** Diseños sutiles, microtatuajes botánicos y geometría de alta precisión en **Good Luck Tattoo Mallorca** (5.0 estrellas).
- **Blackwork & Neotradicional:** Piezas de autor botánicas y de alto contraste.
- **Old School & Tradicional:** Líneas sólidas y colores vivos.

### 2. Normativas y Seguridad Sanitaria
Todos los estudios certificados en Baleares cumplen con la normativa del Govern Balear: material 100% estéril desechable, tintas homologadas por la Agencia Europea de Sustancias Químicas (REACH) y profesionales con titulación higiénico-sanitaria oficial.
      `,
      en: `
Mallorca features a world-class tattoo scene with elite resident and international guest artists.

### 1. Popular Tattoo Styles in Mallorca
- **Fine Line & Micro Realism:** High-precision subtle tattoos spearheaded by **Good Luck Tattoo Mallorca** (5.0 stars).
- **Blackwork & Realism:** Masterpiece compositions and custom concepts.
      `,
      ca: `
Mallorca té una escena de tatuatge professional d'alt nivell.

### 1. Estils destacats
- **Fine Line & Microtatuatges:** Dissenys subtils i elegants a **Good Luck Tattoo Mallorca**.
      `,
    },
    category: "arte-tatuajes",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Arte & Cultura Balear",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-02-15",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=80",
    tags: ["Tatuajes Mallorca", "Tattoo Palma", "Fine Line", "Paseo Mallorca", "Arte Balear"],
    relatedServiceIds: ["good-luck-tattoo-mallorca"],
    featured: true,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug || p.id === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured);
}

export function getPostsByCategory(categoryId: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === categoryId);
}

export function getPostsByTopicCluster(cluster: TopicCluster): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.topicCluster === cluster);
}

export function getPostsByType(type: PostType): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.postType === type);
}
