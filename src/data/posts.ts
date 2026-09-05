export type PostType = "guia" | "top_list" | "noticia" | "tutorial";
export type TopicCluster = "gastronomia" | "aventura_lifestyle" | "servicios_hogar" | "arte_cultura" | "actualidad";

export interface BlogPost {
  id: string;
  slug: string;
  title: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  excerpt: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  content: {
    es: string;
    en: string;
    ca: string;
    de: string;
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
  updatedDate?: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  relatedServiceIds: string[];
  featured: boolean;
  historicalSectorId?: string;
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
      de: "Ultimativer Ratgeber: Wie Sie dieses Jahr ein Boot oder einen Katamaran auf Mallorca mieten",
    },
    excerpt: {
      es: "Descubre las mejores zonas de navegación (Puerto Portals, Andratx, Bahía de Palma), precios medios, consejos con patrón y cómo elegir la embarcación ideal.",
      en: "Discover top sailing grounds (Puerto Portals, Andratx, Palma Bay), average charter rates, skipper tips, and how to pick the perfect yacht.",
      ca: "Descobreix les millors zones de navegació (Puerto Portals, Andratx, Badia de Palma), preus mitjans i consells per llogar amb patró.",
      de: "Entdecken Sie die besten Segelreviere (Puerto Portals, Andratx, Bucht von Palma), Richtpreise, Tipps mit Skipper und wie Sie das perfekte Boot auswählen.",
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
      de: `
Mallorca gehört zu den begehrtesten Wassersportzielen im Mittelmeer. Mit über 550 Kilometern Küstenlinie und mehr de 200 Buchten ist es ein unvergleichliches Erlebnis, die Insel vom Meer aus zu entdecken.

### 1. Welches Boot passt zu Ihnen?
- **Motorboote (6-10 m):** Ideal für Tagesausflüge zu nahegelegenen Buchten wie Illetes oder Portals Vells.
- **Segelkatamarane:** Perfekt für Familien und Gruppen dank großzügigem Platzangebot, Stabilität und Sonnennetzen, wie z. B. **Oasis Catamarán**.
- **Luxus-Motoryachten:** Höchster Komfort mit professioneller Crew, Privatkoch und Wassersport-Toys (Seabob, Jetski).

### 2. Die besten Ausgangshäfen auf Mallorca
- **Hafen von Palma:** Direkte Ausfahrten für Sonnenuntergangstouren mit Catering an Bord.
- **Puerto Portals & Port Adriano:** Exklusive Yachthäfen im Südwesten mit schnellem Zugang zu türkisfarbenen Buchten.
- **Port de Sóller:** Das Tor zur imposanten Steilküste der Serra de Tramuntana (Sa Calobra, Cala Tuent).
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
      de: "Top 5 Restaurants & Tapas-Bars mit den besten Bewertungen in Palma de Mallorca",
    },
    excerpt: {
      es: "Descubre dónde degustar el mejor marisco de lonja, tapas de autor en directo y producto balear en el Casco Antiguo y Santa Catalina.",
      en: "Explore where to taste prime coastal seafood, live counter tapas, and authentic Balearic produce in Palma Old Town and Santa Catalina.",
      ca: "Descobreix on tastar el millor marisc fresc de llotja i tapes d'autor al centre de Palma.",
      de: "Entdecken Sie fangfrische Meeresfrüchte, kreative Live-Tapas an der Marmortheke und balearische Spitzenprodukte in der Altstadt und in Santa Catalina.",
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
      de: `
Palma hat sich zu einer der dynamischsten kulinarischen Hauptstädte Südeuropas entwickelt. Frische Meeresfrüchte aus dem Hafen, mallorquinische Rezepturen und moderne Küchenkunst machen die Stadt zu einem Paradies für Genießer.

### 1. El Camino Palma (Carrer de Can Brondo)
Mit seiner spektakulären Marmortheke und der offenen Schauküche ist **El Camino Palma** eine absolute Institution:
- **Spezialitäten:** Rote Sóller-Garnelen mit Meersalz aus Es Trenc, Baby-Calamari mit Sobrassada und Honig, gegrillte Artischocken.
- **Atmosphäre:** Lebendig, stilvoll und mit Fokus auf absolut frische Tagesprodukte.
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
      de: "Wellness-Oasen: Die besten Luxus-Spas & Thalassotherapie-Zentren auf Mallorca",
    },
    excerpt: {
      es: "Guía de los templos de relajación más exclusivos de la isla: piscinas de agua de mar climatizada, medicina tradicional china y alta cosmética.",
      en: "Guide to the island's most exclusive relaxation temples: heated seawater pools, traditional Chinese medicine, and luxury skincare.",
      ca: "Guia dels temples de relaxació més exclusius de l'illa amb piscines d'aigua marina i medicina tradicional.",
      de: "Führer zu den exklusivsten Entspannungstempeln der Insel: beheizte Meerwasserpools, Traditionelle Chinesische Medizin und Valmont-Kosmetik.",
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
      de: `
Die Kombination aus Meeresbrise, mediterranem Klima und erstklassigen Wellnessresorts macht Mallorca zum idealen Ort für Regeneration und ganzheitliche Gesundheit.

### 1. Arabella Spa (The St. Regis Mardavall, Calvià)
Auf über 4.700 m² bietet das **Arabella Spa** eines der führenden Wellnesserlebnisse Europas:
- **Ausstattung:** Beheizte Meerwasser-Hydrotherapiebecken, ayurvedische Behandlungsräume, Eisgrotte und Saunalandschaft.
- **Exklusive Behandlungen:** Residente Ärzte für Traditionelle Chinesische Medizin und Anti-Aging-Rituale von Valmont.
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
      de: "Ratgeber: Die besten Tattoo-Studios auf Mallorca – Stile, Regionen & Hygiene-Tipps",
    },
    excerpt: {
      es: "Analizamos los estudios de tatuaje y piercing más destacados de Palma y Calvià. Consejos para elegir artista, estilos (Fine Line, Realismo, Tradicional) y normativas sanitarias.",
      en: "We review top-rated tattoo and piercing studios across Palma and Calvià. Tips on choosing artists, styles, and hygiene standards.",
      ca: "Analitzem els estudis de tatuatge més destacats de Palma i Calvià. Consells per triar artista, estils i normativa sanitària.",
      de: "Wir stellen die führenden Tattoo- und Piercing-Studios in Palma und Calvià vor. Tipps zur Künstlerwahl, Stilrichtungen (Fine Line, Realismus, Traditional) und Hygiene-Vorschriften.",
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
      de: `
Mallorca verfügt über eine hochkarätige Tattoo- und Kunstszene mit renommierten residenten und internationalen Gastkünstlern.

### 1. Beliebte Tattoo-Stile auf Mallorca
- **Fine Line & Mikrorealismus:** Filigrane florale Motive und präzise feine Linien, meisterhaft umgesetzt im Studio **Good Luck Tattoo Mallorca** (5,0 Sterne).
- **Blackwork & Realismus:** Detailreiche Kunstwerke und maßgeschneiderte Konzepte.

### 2. Hygiene & Standards
Zertifizierte Studios auf den Balearen erfüllen strenge behördliche Auflagen: 100 % steriles Einwegmaterial, REACH-konforme Farbpigmente und geprüfte Fachausbildung.
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
  {
    id: "mejores-rutas-trekking-mallorca",
    slug: "mejores-rutas-trekking-mallorca",
    postType: "guia",
    topicCluster: "aventura_lifestyle",
    title: {
      es: "Las 5 Mejores Rutas de Trekking y Senderismo en la Serra de Tramuntana",
      en: "Top 5 Trekking and Hiking Routes in the Serra de Tramuntana",
      ca: "Les 5 Millors Rutes de Trekking i Senderisme a la Serra de Tramuntana",
      de: "Die 5 besten Wander- und Trekkingrouten im Tramuntana-Gebirge",
    },
    excerpt: {
      es: "Descubre los senderos más espectaculares de Mallorca: desde el Barranc de Biniaraix hasta el Camí de s'Arxiduc y el Torrent de Pareis.",
      en: "Discover Mallorca's most breathtaking trails: from the stone steps of Barranc de Biniaraix to the iconic Camí de s'Arxiduc.",
      ca: "Descobreix els senders més espectaculars de Mallorca: el Barranc de Biniaraix, el Camí de s'Arxiduc i el Torrent de Pareis.",
      de: "Entdecken Sie Mallorcas spektakulärste Wanderwege: von der Schlucht Barranc de Biniaraix bis zum berühmten Camí de s'Arxiduc.",
    },
    content: {
      es: `
La Serra de Tramuntana, declarada Patrimonio Mundial por la UNESCO, es un paraíso para los amantes del senderismo y la naturaleza mediterránea.

### 1. Barranc de Biniaraix (Sóller - Fornalutx)
- **Dificultad:** Media | **Distancia:** 8 km | **Desnivel:** +500m
- **Lo mejor:** Camino empedrado medieval escalonado entre olivos milenarios y acequias de agua viva.

### 2. Camí de s'Arxiduc (Valldemossa)
- **Dificultad:** Media-Alta | **Distancia:** 11 km | **Desnivel:** +600m
- **Lo mejor:** Vistas panorámicas vertiginosas sobre Sa Foradada y el Mar Balear.

### 3. Recuperación y Bienestar tras el Trekking
Tras una intensa jornada por la montaña, recomendamos relajar la musculatura en centros termales certificados de Mallorca como **Son Brull Spa & Wellness (Pollensa)** o alquilar material de rendimiento en **Mallorca Cycling Center**.
      `,
      en: `
The Serra de Tramuntana (UNESCO World Heritage Site) offers some of the most dramatic mountain and coastal hikes in Southern Europe.

### 1. Barranc de Biniaraix
- **Difficulty:** Moderate | **Distance:** 8 km | **Elevation:** +500m
- **Highlight:** Ancient cobbled pilgrimage path winding through ancient olive groves.

### 2. Camí de s'Arxiduc (Valldemossa)
- **Difficulty:** Moderate-High | **Distance:** 11 km | **Elevation:** +600m
- **Highlight:** Stunning clifftop sea views over Sa Foradada peninsula.

### 3. Post-Hike Recovery
Complement your hiking journey with thermal relaxation at **Son Brull Spa & Wellness** in Pollensa.
      `,
      ca: `
La Serra de Tramuntana (Patrimoni de la Humanitat UNESCO) és el tresor natural de Mallorca per excel·lència.

### 1. Barranc de Biniaraix
- **Dificultat:** Mitjana | **Distància:** 8 km
- **Destacat:** Camí de pedra en sec entre oliveres mil·lenàries.

### 2. Recuperació i Benestar
Relaxa't després de la ruta a **Son Brull Spa & Wellness** a Pollença.
      `,
      de: `
Die Serra de Tramuntana (UNESCO-Welterbe) ist ein wahres Paradies für Wander- und Naturliebhaber auf Mallorca.

### 1. Barranc de Biniaraix (Sóller - Fornalutx)
- **Schwierigkeit:** Mittel | **Distanz:** 8 km | **Höhenmeter:** +500m
- **Highlights:** Historischer Kopfsteinpflasterweg entlang alter Olivenhaine und Wasserläufe.

### 2. Camí de s'Arxiduc (Valldemossa)
- **Schwierigkeit:** Mittel-Schwer | **Distanz:** 11 km | **Höhenmeter:** +600m
- **Highlights:** Atemberaubender Panoramablick auf die Halbinsel Sa Foradada und das Mittelmeer.

### 3. Erholung nach der Wandertour
Nach einer anstrengenden Tour empfiehlt sich ein Besuch im **Son Brull Spa & Wellness (Pollença)** für eine wohltuende Sportmassage mit lokalem Mandelöl.
      `,
    },
    category: "deportes-aire-libre",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Senderismo & Guía de Montaña",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-02-20",
    readTime: "7 min",
    coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80",
    tags: ["Trekking Mallorca", "Serra de Tramuntana", "Senderismo", "Sóller", "Valldemossa"],
    relatedServiceIds: ["son-brull-spa-mallorca", "mallorca-cycling-center-playa-muro"],
    featured: true,
  },
  {
    id: "cellers-hornos-historicos-mallorca",
    slug: "cellers-hornos-historicos-mallorca",
    postType: "top_list",
    topicCluster: "gastronomia",
    title: {
      es: "Ruta de Hornos Centenarios y Cellers Tradicionales de Mallorca",
      en: "Historic Bakeries and Traditional Cellers of Mallorca",
      ca: "Ruta de Forns Centenaris i Cellers Tradicionals de Mallorca",
      de: "Route der historischen Bäckereien und traditionellen Cellers auf Mallorca",
    },
    excerpt: {
      es: "Un viaje a la auténtica gastronomía de la isla: ensaimadas de manteca artesana, cocarrois de xeixa y cellers con bóvedas góticas.",
      en: "A cultural taste of authentic Mallorca: heritage sourdough ensaimadas, savory cocarrois, and medieval wine cellers.",
      ca: "Un viatge a la gastronomia autèntica: ensaïmades artesanes, cocarrois i cellers amb voltes gòtiques.",
      de: "Eine Reise zur authentischen Insel-Gastronomie: handgefertigte Ensaimadas, herzhafte Cocarrois und historische Weinkeller.",
    },
    content: {
      es: `
La gastronomía popular de Mallorca conserva secretos artesanales de siglos de historia en sus hornos de leña y antiguos cellers de vino.

### 1. Forn Sant Francesc (Inca)
Ganador del premio a la Mejor Ensaimada del Mundo, este obrador fundado en el siglo XIX elabora piezas de hojaldrado perfecto y rellenos gourmet de crema tostada, albaricoque y chocolate.

### 2. Celler Can Ripoll (Inca)
Ubicado en una bodega del siglo XVII con bóvedas de piedra y enormes botas de vino, es el santuario de platos como la Porcella rostida, el Frit mallorquí y el Tumbet.

### 3. Forn Fondo & Forn de la Soca (Palma)
Templos de la repostería histórica balear en el centro de Palma, recuperando recetas conventuales perdidas.
      `,
      en: `
Mallorca's traditional gastronomy preserves centuries-old baking and culinary techniques in its stone ovens and cellar halls.

### 1. Forn Sant Francesc (Inca)
Home to the World Best Ensaimada Winner, baking exquisite artisanal pastries since the 19th century.

### 2. Celler Can Ripoll (Inca)
Housed in a 17th-century wine cellar beneath majestic stone arches, serving legendary roast suckling pig and Frit mallorquí.
      `,
      ca: `
La gastronomia tradicional de Mallorca guarda segles d'història als seus forns de llenya i cellers històrics.

### 1. Forn Sant Francesc (Inca)
Guardonat amb la Millor Ensaïmada del Món, manté viva la tradició des del segle XIX.

### 2. Celler Can Ripoll (Inca)
El temple del frit i la porcella sota bótes històriques del segle XVII.
      `,
      de: `
Die traditionsreiche mallorquinische Gastronomie bewahrt jahrhundertealte Handwerkskunst in Holzbacköfen und historischen Weinkellern.

### 1. Forn Sant Francesc (Inca)
Gewinner des Preises für die beste Ensaimada der Welt – meisterhafte Handarbeit seit dem 19. Jahrhundert.

### 2. Celler Can Ripoll (Inca)
Ein historischer Gewölbekeller aus dem 17. Jahrhundert mit authentischer mallorquinischer Küche (Spanferkel, Frit Mallorquí).
      `,
    },
    category: "gastronomia-catering",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Gastronomía & Patrimonio Balear",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-02-22",
    readTime: "6 min",
    coverImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    tags: ["Ensaimada Mallorca", "Forn Sant Francesc", "Celler Can Ripoll", "Inca", "Gastronomia Tradicional"],
    relatedServiceIds: ["forn-sant-francesc-inca", "celler-can-ripoll-inca"],
    featured: true,
  },
  {
    id: "guia-vida-saludable-bienestar-mallorca",
    slug: "guia-vida-saludable-bienestar-mallorca",
    postType: "guia",
    topicCluster: "aventura_lifestyle",
    title: {
      es: "Vida Saludable y Bienestar en Mallorca: Deporte al Aire Libre, Comer Sano y Buenos Hábitos",
      en: "Healthy Living & Wellbeing in Mallorca: Outdoor Sports, Clean Eating & Positive Habits",
      ca: "Vida Saludable i Benestar a Mallorca: Esport a l'Aire Lliure, Menjar Sa i Bons Hàbits",
      de: "Gesundes Leben & Wohlbefinden auf Mallorca: Outdoor-Sport, bewusste Ernährung & gesunde Gewohnheiten",
    },
    excerpt: {
      es: "Descubre cómo construir un estilo de vida equilibrado en Mallorca combinando parques deportivos al aire libre, alimentación Km0, circuitos de sombra y bienestar integral.",
      en: "Learn how to build a balanced lifestyle in Mallorca combining outdoor fitness parks, local Km0 dining, shaded routes, and mindful wellness.",
      ca: "Descobreix com gaudir d'un estil de vida equilibrat a Mallorca combinant parcs esportius, producte Km0, zones d'ombra i benestar.",
      de: "Erfahren Sie, wie Sie auf Mallorca einen ausgewogenen Lebensstil gestalten: Outdoor-Fitnessparks, regionale Km0-Küche, schattige Routen und ganzheitliche Erholung.",
    },
    content: {
      es: `
Vivir o visitar Mallorca ofrece una oportunidad única para reconectar con hábitos de vida saludables. La combinación de clima mediterráneo, mar y montaña permite integrar el movimiento, la buena nutrición y el descanso de forma natural en el día a día.

### 1. Movimiento y Deporte al Aire Libre
No es necesario encerrarse entre cuatro paredes para mantenerse en forma. En Mallorca disponemos de:
- **Circuitos de Running y Paseo Marítimo:** Rutas continuas desde Palma hasta El Arenal o en el Paseo de Pollença.
- **Parques de Calistenia y Street Workout:** Espacios públicos equipados con barras y sombra natural en parques municipales.
- **Pistas de Pádel y Tenis:** Clubs accesibles tanto en núcleos urbanos como en zonas de costa.

### 2. Alimentación Consciente y Producto Local (Km0)
Comer bien en Mallorca es sinónimo de apoyar a los productores de la tierra:
- **Mercados de Abastos (Mercat de l'Olivar, Santa Catalina, Sineu):** Pescado fresco de lonja, frutas de temporada y verduras de huerta balear.
- **Restauración con Compromiso Km0:** Restaurantes que priorizan ingredientes de cercanía, reduciendo la huella de carbono y asegurando el máximo valor nutricional.

### 3. Salud Mental y Desconexión
El bienestar no es solo físico: encontrar momentos de calma en calas tranquilas, practicar yoga con vistas a la Tramuntana y respetar el descanso son pilares fundamentales para una vida plena en la isla.
      `,
      en: `
Living in or visiting Mallorca provides a unique setting to embrace wholesome, balanced habits. The Mediterranean climate, pristine sea, and rugged Tramuntana mountains make it easy to incorporate fitness, clean nutrition, and mindful rest into daily life.

### 1. Outdoor Fitness & Active Lifestyle
- **Scenic Running & Coastal Promenades:** Continuous scenic routes along Palma Bay, Port de Sóller, and Pollença.
- **Public Calisthenics & Fitness Parks:** Municipal outdoor workout stations featuring pull-up rigs and shade.
- **Padel & Tennis Facilities:** Accessible courts across both urban centers and coastal villages.

### 2. Clean Nutrition & Local Km0 Produce
- **Local Farmers' Markets (L'Olivar, Santa Catalina, Inca):** Fresh fish from local fleets, organic fruits, and Balearic vegetables.
- **Km0 Committed Dining:** Independent bistros sourcing straight from Mallorcan orchards and coastal cooperatives.

### 3. Mindfulness & Restoration
True wellness balances exertion with restorative pause: peaceful morning walks in Tramuntana coves and dedicated yoga retreats help cultivate sustained vitality.
      `,
      ca: `
Viure o visitar Mallorca ofereix un entorn immillorable per cuidar la salut i adoptar hàbits positius.

### 1. Esport a l'Aire Lliure
- Circuits de running davant la mar i parcs de cal·listènia públics amb ombra i aigua.
- Pistes de pàdel i instal·lacions municipals a tota l'illa.

### 2. Producte Local Km0
- Compra als mercats tradicionals i aposta per restaurants que cuinen amb producte fresc de la terra.

### 3. Benestar Integral
- Rutes de senderisme a la Serra de Tramuntana i moments de desconnexió en espais naturals protegits.
      `,
      de: `
Mallorca bietet die perfekten Rahmenbedingungen für einen aktiven, gesunden und ausgeglichenen Lebensstil.

### 1. Bewegung & Outdoor-Sport
- **Lauf- und Radstrecken:** Entlang der Bucht von Palma oder auf malerischen Wegen im Tramuntana-Gebirge.
- **Öffentliche Calisthenics-Parks:** Kostenlose Trainingsanlagen mit Schatten und Trinkwasserbrunnen.
- **Padel & Tennis:** Moderne Sportanlagen auf der gesamten Insel.

### 2. Frische Km0-Ernährung
- **Wochenmärkte & Markthallen:** Frischer Fisch, erntefrisches Gemüse und mallorquinisches Olivenöl.
- **Nachhaltige Gastronomie:** Lokale Restaurants mit Fokus auf saisonale, gesunde Zutaten.
      `,
    },
    category: "salud-bienestar",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Bienestar & Vida Saludable",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-02-24",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    tags: ["Vida Saludable", "Deporte Mallorca", "Comer Sano", "Km0", "Bienestar"],
    relatedServiceIds: ["rafa-nadal-sports-centre", "kuyen-art-tattoo"],
    featured: true,
  },
  {
    id: "guia-apoyo-comercio-local-mallorca",
    slug: "guia-apoyo-comercio-local-mallorca",
    postType: "guia",
    topicCluster: "servicios_hogar",
    title: {
      es: "Apoyo al Comercio Local en Mallorca: Cómo Elegir Servicios Honestos y Fomentar la Economía Real",
      en: "Supporting Local Businesses in Mallorca: How to Choose Trusted Services and Strengthen the Island Economy",
      ca: "Suport al Comerç Local a Mallorca: Com Triar Serveis Honestos i Enfortir l'Economia Real",
      de: "Förderung des lokalen Gewerbes auf Mallorca: So wählen Sie ehrliche Dienstleister und stärken die Inselwirtschaft",
    },
    excerpt: {
      es: "El comercio de proximidad es el verdadero motor de Mallorca. Aprende a identificar profesionales transparentes, talleres artesanos y negocios con arraigo en la comunidad.",
      en: "Neighborhood commerce is Mallorca's authentic backbone. Learn how to identify transparent tradespeople, artisan ateliers, and long-standing local enterprises.",
      ca: "El comerç de proximitat és el motor real de Mallorca. Aprèn a identificar professionals transparents, tallers artesans i negocis de confiança.",
      de: "Das lokale Gewerbe ist das Herzstück Mallorcas. Erfahren Sie, wie Sie transparente Handwerker, Traditionsbetriebe und vertrauenswürdige Dienstleister finden.",
    },
    content: {
      es: `
En un mundo cada vez más digitalizado, el contacto humano, la honestidad y el oficio bien hecho marcan la diferencia. En Servicios Mallorca apostamos firmemente por dar visibilidad a toda la escala comercial de la isla, desde los pequeños autónomos hasta las empresas familiares con décadas de servicio.

### 1. El Valor del 'Promedio Positivo'
No buscamos calificar los negocios con criterios superficiales o de postureo; buscamos destacar la **accesibilidad, la buena comunicación y la capacidad de adaptación** de cada comercio. Un buen electricista local, un taller de cerámica o un fisioterapeuta de barrio merecen la misma visibilidad y respeto que una gran firma internacional.

### 2. Cómo Identificar un Servicio de Confianza
- **Transparencia en Precios y Presupuestos:** Proveedores que ofrecen presupuestos detallados por escrito antes de iniciar el trabajo.
- **Comunicación Directa:** Facilidad para hablar por teléfono (+34) o WhatsApp sin intermediarios ni plataformas que cobren comisiones abusivas.
- **Arraigo y Memoria:** Negocios que forman parte del tejido vecinal y cuidan su reputación a largo plazo.

### 3. El Impacto de tus Decisiones de Compra
Cada vez que eliges un servicio local en Mallorca, estás reinvirtiendo en la educación, la sostenibilidad y el futuro de las familias de la isla. Nuestra misión es facilitarte las herramientas necesarias para que esa elección sea siempre sencilla, rápida y fiable.
      `,
      en: `
In an increasingly digital age, genuine craftsmanship, personal accountability, and fair pricing define real value. At Servicios Mallorca, we are committed to providing an open, balanced platform for tradespeople, artisans, and family-owned enterprises across the island.

### 1. The Principle of a 'Positive Benchmark'
We avoid vanity metrics and exaggerated hype. Instead, we champion **accessibility, clear communication, and dependable service**. An honest local plumber, a boutique framing studio, or a neighborhood baker deserves equal appreciation and discoverability.

### 2. Identifying Trustworthy Providers
- **Upfront Pricing:** Clear, itemized written estimates before project commencement.
- **Direct Dialogue:** Unhindered communication via local +34 phone lines and WhatsApp with zero hidden agent fees.
- **Community Longevity:** Enterprises that take pride in their local neighborhood standing and long-term customer relationships.

### 3. Reinvesting in Mallorca
Every service booked locally circulates wealth directly back into Balearic communities, supporting local families and sustainable growth.
      `,
      ca: `
El comerç de proximitat és la garantia d'un futur sostenible per a Mallorca.

### 1. La Filosofia del 'Promig Positiu'
Reconeixem l'esforç de cada professional autònom i empresa familiar que treballa amb honestedat i bon tracte.

### 2. Criteris de Confiança
- Pressupostos clars sense costos ocults.
- Comunicació directa sense comissions d'intermediaris.
- Compromís amb la qualitat i el servei post-venda.
      `,
      de: `
Echtes Handwerk, Verlässlichkeit und faire Kommunikation machen den Unterschied im mallorquinischen Alltag aus.

### 1. Unser Ansatz: Ein positiver Durchschnitt
Wir verzichten auf oberflächliche Marketingfloskeln. Wir bewerten und fördern **Erreichbarkeit, faire Preise und kundenorientierten Service** – vom Meisterhandwerker bis zum familiären Nachbarschaftsbetrieb.

### 2. Vertrauenswürdige Dienstleister erkennen
- Verbindliche Kostenvoranschläge ohne versteckte Zusatzkosten.
- Direkter Draht via lokaler Telefonnummer (+34) und WhatsApp ohne Provisionsaufschläge.
- Feste Verwurzelung in der Gemeinde und nachhaltige Kundenzufriedenheit.
      `,
    },
    category: "servicios-profesionales",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Economía Local & Sostenibilidad",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-02-25",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    tags: ["Comercio Local", "Economia Mallorca", "Profesionales", "Sostenibilidad", "Guia Balear"],
    relatedServiceIds: ["fibwi-telecomunicaciones", "viveros-santa-maria"],
    featured: true,
  },
  {
    id: "guia-gastronomia-km0-mallorca",
    slug: "guia-gastronomia-km0-mallorca",
    postType: "guia",
    topicCluster: "gastronomia",
    title: {
      es: "Gastronomía Km0 en Mallorca: De los Mercados Tradicionales a las Bodegas del Pla",
      en: "Km0 Gastronomy in Mallorca: From Traditional Markets to Inland Wineries",
      ca: "Gastronomia Km0 a Mallorca: Dels Mercats Tradicionals als Cellers del Pla",
      de: "Km0-Gastronomie auf Mallorca: Von traditionellen Märkten zu den Weingütern des Pla",
    },
    excerpt: {
      es: "Descubre el auténtico sabor balear a través de los productos de cercanía: aceite con D.O. Oli de Mallorca, flor de sal, sobrasada artesanal y las mejores bodegas.",
      en: "Explore authentic Balearic flavors through local Km0 produce: D.O. Oli de Mallorca olive oil, flor de sal, artisan sobrasada, and premier wineries.",
      ca: "Descobreix l'autèntic sabor balear a través dels productes de proximitat: oli D.O. Oli de Mallorca, flor de sal, sobrassada artesana i cellers.",
      de: "Entdecken Sie den echten balearischen Geschmack durch lokale Km0-Erzeugnisse: D.O. Olivenöl, Flor de Sal, handwerkliche Sobrasada und Weingüter.",
    },
    content: {
      es: `
Mallorca ofrece un patrimonio gastronómico extraordinario que va mucho más allá de los restaurantes turísticos. La cocina balear se fundamenta en ingredientes frescos, respeto a la temporada y un vínculo estrecho entre agricultores, pescadores y chefs locales.

### 1. Los Tres Pilares del Producto Balear
- **Oli de Mallorca (D.O.P.):** Elaborado principalmente con aceituna mallorquina, arbequina y picual. Imprescindible para el tradicional *pa amb oli*.
- **Flor de Sal d'Es Trenc:** Cosechada artesanalmente en las salinas naturales del sur de la isla.
- **Sobrassada de Mallorca con Indicación Geográfica Protegida (IGP):** Curada pacientemente con pimentón dulce y especias autóctonas.

### 2. Mercados Tradicionales para Comprar Km0
Visitar los mercados semanales es la mejor forma de conectar con el productor local:
1. **Mercat de l'Olivar & Santa Catalina (Palma):** Pescado fresco de la lonja, quesos de Mahón y embutidos de matanza.
2. **Mercado de Sineu (Miércoles):** El mercado más antiguo de Mallorca (desde 1306), ideal para frutas, hortalizas y aperos artesanos.
3. **Mercado de Santa María del Camí (Domingos):** Epicentro ecológico y vinícola con productores certificados de la comarca del Raiguer.

### 3. Enología y Bodegas del Pla y Raiguer
La tradición vitivinícola de Mallorca cuenta con dos denominaciones de origen protegidas: **D.O. Binissalem** y **D.O. Pla i Llevant**. Variedades autóctonas como *Manto Negro*, *Callet* y *Premsal Blanc* ofrecen perfiles aromáticos únicos que reflejan la calidez del suelo mediterráneo.

### 4. Consejos para Residentes y Visitantes
Para apoyar la economía circular y disfrutar del mejor producto:
- Busca el distintivo **Venta Directa** o **Km0** en cooperativas agrarias y restaurantes colaboradores.
- Pregunta siempre por el pescado de lonja del día (*cap-roig*, *gallo de San Pedro* o *dentón*).
- Apoya a los pequeños hornos centenarios que siguen elaborando ensaimadas con manteca de cerdo negro autóctono.
      `,
      en: `
Mallorca boasts an extraordinary culinary heritage centered around seasonal freshness, island-grown ingredients, and direct relationships between farmers, fishermen, and visionary chefs.

### 1. The Core Pillars of Balearic Km0 Produce
- **D.O.P. Oli de Mallorca:** Cold-pressed extra virgin olive oil made from native Mallorcan and Arbequina olives. Essential for authentic *pa amb oli*.
- **Flor de Sal d'Es Trenc:** Harvested naturally from the pristine salt flats in the south of the island.
- **Sobrassada de Mallorca (PGI):** Slow-cured with paprika, garlic, and sea salt, representing centuries of artisanal butcher traditions.

### 2. Traditional Markets for Local Produce
1. **Mercat de l'Olivar & Santa Catalina (Palma):** Daily fresh fish market, artisanal cheeses, and local cured meats.
2. **Sineu Market (Wednesdays):** Mallorca's oldest market (operating since 1306) in the geographical heart of the island.
3. **Santa María del Camí (Sundays):** The island's prime organic and wine market surrounded by historic vineyards.

### 3. Wine Routes & Indigenous Varietals
Protected under **D.O. Binissalem** and **D.O. Pla i Llevant**, indigenous grapes like *Manto Negro*, *Callet*, and *Premsal Blanc* yield distinctive Mediterranean wines with mineral depth.
      `,
      ca: `
La gastronomia de Mallorca és el reflex de la nostra terra i la nostra història. Apostar pel producte Km0 és garantir la continuïtat del nostre paisatge agrari.

### 1. Productes amb Segell de Qualitat
- **Oli de Mallorca (D.O.P.)**
- **Flor de Sal d'Es Trenc**
- **Sobrassada de Mallorca (IGP)**

### 2. Mercats Recomanats
- **Mercat de l'Olivar (Palma)**
- **Mercat de Sineu (Dimecres)**
- **Mercat de Santa Maria del Camí (Diumenge)**
      `,
      de: `
Mallorcas kulinarische Seele gründet auf frischen saisonalen Zutaten, traditionellem Handwerk und kurzen Wegen vom Feld auf den Tisch.

### 1. Die Spitzenprodukte der Insel
- **D.O.P. Oli de Mallorca:** Natives Olivenöl extra aus traditioneller Kaltpressung.
- **Flor de Sal d'Es Trenc:** Reines Natursalz aus den geschützten Salinen des Südens.
- **Sobrassada de Mallorca:** Handwerklich gereifte Wurstspezialität mit geschützter Herkunftsangabe.

### 2. Wochenmärkte für frische Inselerzeugnisse
- **Mercat de l'Olivar & Santa Catalina (Palma)**
- **Mittwochsmarkt in Sineu (seit 1306)**
- **Sonntagsmarkt in Santa María del Camí (Bio & Weinbau)**
      `,
    },
    category: "gastronomia-restaurantes",
    author: {
      name: "Cati Rosselló",
      role: "Especialista en Gastronomía & Enología Balear",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-08-29",
    updatedDate: "2026-08-29",
    readTime: "6 min",
    coverImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    tags: ["Gastronomia", "Vino", "Km0", "Mercados", "Mallorca", "Aceite de Oliva"],
    relatedServiceIds: ["forn-de-sant-joan", "restaurante-flanigan"],
    featured: true,
  },
  {
    id: "mejores-rutas-senderismo-tramuntana",
    slug: "mejores-rutas-senderismo-tramuntana",
    postType: "guia",
    topicCluster: "aventura_lifestyle",
    title: {
      es: "Senderismo y Deporte al Aire Libre en la Serra de Tramuntana: Guía Completa",
      en: "Hiking and Outdoor Sports in the Serra de Tramuntana: Complete Guide",
      ca: "Senderisme i Esport a l'Aire Lliure a la Serra de Tramuntana: Guia Completa",
      de: "Wandern & Outdoor-Sport in der Serra de Tramuntana: Kompletter Leitfaden",
    },
    excerpt: {
      es: "Descubre los mejores tramos de la ruta GR-221 (Ruta de Pedra en Sec), zonas de entrenamiento funcional, fuentes de agua potable y consejos de seguridad en la montaña.",
      en: "Discover key stages of the GR-221 Dry Stone Route, functional fitness parks, mountain spring fountains, and safety tips in the UNESCO Tramuntana.",
      ca: "Descobreix els millors trams de la ruta GR-221 (Ruta de Pedra en Sec), zones d'entrenament, fonts d'aigua i consells de seguretat.",
      de: "Erkunden Sie Abschnitte des Fernwanderwegs GR-221, Outdoor-Fitnessparks, Trinkwasserquellen und Sicherheitshinweise für die Tramuntana.",
    },
    content: {
      es: `
La **Serra de Tramuntana**, declarada Patrimonio de la Humanidad por la UNESCO en la categoría de Paisaje Cultural, es el mayor paraíso para los amantes del senderismo, el trail running y el deporte al aire libre en el Mediterráneo.

### 1. Tramos Emblemáticos de la Ruta GR-221
La famosa *Ruta de Pedra en Sec* recorre la espina dorsal de la cordillera a lo largo de más de 160 kilómetros:
1. **De Valldemossa a Deià (Camí de s'Arxiduc):** Vistas vertiginosas sobre el mar, encinares centenarios y restos históricos de la época del Archiduque Luis Salvador.
2. **Barranc de Biniaraix (Sóller - Cúber):** Monumento de ingeniería popular con miles de escalones de piedra seca que ascienden hacia los embalses de la montaña.
3. **De Deià a Sóller por el Camí de Castelló:** Ruta suave y accesible entre olivares milenarios y fincas tradicionales con paradas en miradores panorámicos.

### 2. Puntos de Agua y Sombra para Deportistas
En verano y entretiempo, la hidratación es fundamental:
- **Fuentes Naturales:** Las fuentes de montaña (*font des Verger*, *font de s'Obi*) pueden presentar caudal variable según la estación. Lleva siempre al menos 2 litros de agua por persona.
- **Instalaciones Deportivas Públicas:** Consulta nuestra sección de **Deporte & Parques** para localizar circuitos con fuentes públicas verificadas y áreas de calistenia con sombra arbolada en Sóller, Esporles y Bunyola.

### 3. Normas de Respeto y Seguridad en el Medio Natural
- Mantente en los senderos señalizados y respeta los pasos privados (*botadors*).
- No dejes ningún residuo y respeta el ganado autóctono (ovejas, cabras salvajes).
- Consulta la previsión meteorológica de AEMET antes de salir: la niebla y los cambios bruscos de viento en altura pueden dificultar la orientación.
      `,
      en: `
The **Serra de Tramuntana**, recognized as a UNESCO World Heritage cultural landscape, is the premier Mediterranean destination for hiking, trail running, and outdoor wellness.

### 1. Iconic Stages of the GR-221 Dry Stone Route
1. **Valldemossa to Deià (Camí de s'Arxiduc):** Panoramic cliffside paths and centenary holm oak forests.
2. **Barranc de Biniaraix (Sóller valley):** A masterpiece of dry-stone stairways climbing toward mountain reservoirs.
3. **Deià to Sóller via Camí de Castelló:** Gentle family-friendly route meandering through ancient olive groves.

### 2. Hydration & Shaded Rest Points
Always carry ample water (minimum 2 liters) and check our **Sports & Fitness Hub** for verified public water stations, shaded workout parks, and padel studios across Tramuntana villages.
      `,
      ca: `
La Serra de Tramuntana és el tresor natural més valuós de Mallorca.

### 1. Trams Clau de la GR-221
- **Valldemossa a Deià pel Camí de s'Arxiduc**
- **Barranc de Biniaraix (Sóller)**
- **Camí de Castelló (Deià - Sóller)**

### 2. Consells de Seguretat
Portau sempre aigua suficient, calçat de muntanya i respectau els marges de pedra en sec.
      `,
      de: `
Das UNESCO-Welterbe der **Serra de Tramuntana** bietet weltklasse Routen für Wanderer, Trailrunner und Naturliebhaber.

### 1. Beliebte Etappen des Trockensteinwegs GR-221
- **Valldemossa nach Deià über den Reitweg des Erzherzogs**
- **Die Biniaraix-Schlucht bei Sóller**
- **Camí de Castelló zwischen Deià und Sóller**

### 2. Wasserstellen & Fitness
Nutzen Sie unseren **Sport & Fitness Guide**, um schattige Calisthenics-Parks und Trinkwasserbrunnen in Sóller, Esporles und Bunyola zu finden.
      `,
    },
    category: "espacios-deportivos-publicos",
    author: {
      name: "Mateu Bauzà",
      role: "Guía de Montaña & Entrenador de Trail Running",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-08-29",
    updatedDate: "2026-08-29",
    readTime: "7 min",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Senderismo", "Tramuntana", "Deporte", "GR-221", "Naturaleza", "Mallorca"],
    relatedServiceIds: ["palma-sport-tennis-club", "rafa-nadal-sports-centre"],
    featured: true,
  },
  {
    id: "analisis-20-anos-inmobiliaria-construccion-mallorca",
    slug: "analisis-20-anos-inmobiliaria-construccion-mallorca",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Radiografía de 20 Años del Sector Inmobiliario en Mallorca (2006–2026)",
      ca: "Radiografia de 20 Anys del Sector Immobiliari a Mallorca (2006–2026)",
      en: "20-Year Real Estate & Housing Trajectory in Mallorca (2006–2026)",
      de: "20-Jahre-Analyse: Der Immobilien- und Bausektor auf Mallorca (2006–2026)",
    },
    excerpt: {
      es: "De la burbuja de 2007 al nuevo techo histórico de 4.590 €/m² en 2026. Analizamos la evolución semestral, la escasez de suelo y el auge del comprador internacional.",
      ca: "De la bombolla del 2007 al nou sostre històric de 4.590 €/m² el 2026. Analitzem l'evolució semestral, l'escassetat de sòl i l'auge del comprador internacional.",
      en: "From the 2007 housing bubble to a new all-time high of 4,590 €/sqm in 2026. A detailed semiannual analysis of land scarcity and international demand.",
      de: "Von der Blase 2007 bis zum neuen Rekordwert von 4.590 €/m² im Jahr 2026: Halbjahresdaten zu Baulandmangel und Auslandskäufern.",
    },
    content: {
      es: `
El mercado inmobiliario de Mallorca ha protagonizado en las dos últimas décadas (2006–2026) una de las transformaciones más extraordinarias de Europa:

### 1. El Ciclo de 20 Años en Tres Fases Semestrales
- **Fase Expansiva y Burbuja (2006–2007):** El precio medio escaló hasta los **2.480 €/m²** en el segundo semestre de 2007, impulsado por una política de crédito hipotecario desregulada.
- **La Corrección Post-Crisis (2008–2013):** Durante 11 semestres consecutivos, el valor corrigió hasta tocar suelo en **1.810 €/m²** en 2013-S1 (-27% de caída acumulada).
- **La Década Prime (2016–2026):** En los últimos 10 años, el valor se ha disparado un **+103,1%**, sobrepasando los **4.590 €/m²** en el primer semestre de 2026.

### 2. Factores Estructurales: Escasez y Demanda Internacional
A diferencia de otros territorios peninsulares, Mallorca cuenta con una limitación territorial estricta derivada de la Ley de Suelo Rústico y las Directrices de Ordenación Territorial (DOT). Con un 22% de población empadronada extranjera y un flujo sostenido de capital de Europa Central y los países nórdicos, la isla se ha posicionado como un **activo refugio de valor global**.

### 3. Consulta la Gráfica Interactiva
Puedes explorar la evolución semestral detallada barra por barra en nuestro **[Data Hub de Estadísticas de Mallorca](/es/estadisticas/comparativas)**.
      `,
      ca: `
El mercat immobiliari de Mallorca ha protagonitzat en les dues darreres dècades (2006–2026) una de les transformacions més intenses d'Europa:

### 1. El Cicle de 20 Anys en Tres Fases
- **Fase Expansiva (2006–2007):** El preu mitjà va assolir els **2.480 €/m²** el 2007-S2 abans de la crisi de crèdit.
- **La Correcció (2008–2013):** Caiguda acumulada fins a tocar terra a **1.810 €/m²** el 2013-S1.
- **La Dècada Prime (2016–2026):** Increment de més del **+103,1%** en deu anys fins a marcar rècord de **4.590 €/m²** el 2026-S1.

### 2. Factors Estructurals
La protecció del territori i la forta demanda internacional converteixen l'habitatge balear en un actiu de refugi. Consulta la gràfica semestral al nostre **[Data Hub d'Estadístiques](/ca/estadisticas/comparativas)**.
      `,
      en: `
Mallorca's real estate ecosystem has undergone an extraordinary 20-year structural transformation between 2006 and 2026:

### 1. The 20-Year Cycle in Three Distinct Waves
- **Bubble Zenith (2006–2007):** Reached **2,480 €/sqm** in 2007-H2 prior to the Lehman collapse.
- **Subprime Correction (2008–2013):** Multi-year pullback bottoming out at **1,810 €/sqm** in 2013-H1 (-27%).
- **The Prime Super-Cycle (2016–2026):** A remarkable **+103.1%** climb over the past decade, breaching **4,590 €/sqm** in 2026-H1.

### 2. Scarcity & International Capital
Strict island zoning laws and sustained demand from German, British, and Nordic buyers have elevated Mallorca to a top-tier European safe haven. Explore our interactive semiannual charts on the **[Mallorca Comparative Data Hub](/en/estadisticas/comparativas)**.
      `,
      de: `
Der Immobilienmarkt auf Mallorca hat zwischen 2006 und 2026 eine der bemerkenswertesten Entwicklungen Europas vollzogen:

### 1. Der 20-Jahres-Zyklus im Überblick
- **Höhepunkt der Immobilienblase (2006–2007):** Spitzenwert von **2.480 €/m²** Ende 2007.
- **Korrekturphase (2008–2013):** Rückgang auf den Tiefpunkt von **1.810 €/m²** im ersten Halbjahr 2013.
- **Der Prime-Superzyklus (2016–2026):** Mehr als eine Verdoppelung (**+103,1%**) in zehn Jahren auf das historische Allzeithoch von **4.590 €/m²** Anfang 2026.

Interaktive Halbjahres-Grafiken finden Sie im **[Mallorca Statistik-Hub](/de/estadisticas/comparativas)**.
      `,
    },
    category: "inmobiliaria-villas",
    author: {
      name: "Antoni Rosselló",
      role: "Economista & Analista Inmobiliario",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-01",
    updatedDate: "2026-09-01",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    tags: ["Inmobiliaria", "Estadísticas", "Precios", "Economía", "Mallorca", "Vivienda"],
    relatedServiceIds: ["balearic-properties", "engel-volkers-mallorca", "kensington-finest-properties-palma"],
    featured: true,
    historicalSectorId: "inmobiliaria_construccion",
  },
  {
    id: "evolucion-historica-turismo-presion-humana-mallorca",
    slug: "evolucion-historica-turismo-presion-humana-mallorca",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Turismo y Presión Humana en Mallorca: Análisis de Dos Décadas de Capacidad de Carga",
      ca: "Turisme i Pressió Humana a Mallorca: Anàlisi de Dues Dècades de Capacitat de Càrrega",
      en: "Tourism & Carrying Capacity in Mallorca: Two Decades of Demographic Pressure",
      de: "Tourismus & Belastungsgrenzen auf Mallorca: 20 Jahre Tragfähigkeitsanalyse",
    },
    excerpt: {
      es: "De 10 millones a rozar los 15 millones de turistas anuales. Examinamos los picos estivales del IPH, la moratoria de plazas y la gestión de la sostenibilidad insular.",
      ca: "De 10 milions a fregar els 15 milions de turistes anuals. Examinem els pics estivals de l'IPH, la moratòria de places i la sostenibilitat insular.",
      en: "From 10M to nearly 15M annual arrivals. Examining summer Human Pressure Index spikes, bed moratoriums, and sustainable island management.",
      de: "Von 10 auf fast 15 Millionen Gäste pro Jahr: Analyse des IPH-Belastungsindex, Bettenstopps und der Zukunft des Inseltourismus.",
    },
    content: {
      es: `
El turismo constituye el motor primario de la economía balear, pero el debate sobre su capacidad de carga ha alcanzado una dimensión histórica:

### 1. Evolución del Flujo Semestral (2006–2026)
- **Año 2006:** Se contabilizaron **10,07 millones** de turistas anuales (3,82M en S1 y 6,25M en S2).
- **El Impacto de 2020:** La paralización por COVID-19 redujo el flujo semestral de verano a tan solo **2,15M** de visitantes.
- **Récord 2025/2026:** Mallorca ha superado los **14,85 millones** de visitantes anuales, concentrando **8,73M** en el semestre estival.

### 2. El Índice de Presión Humana (IPH)
En agosto, la población flotante eleva la presión sobre el territorio a más de **1,45 millones de personas simultáneas**, frente a un suelo invernal en enero de apenas 960.000 habitantes.
      `,
      ca: `
El turisme representa el motor de l'arxipèlag, però el debat de sostenibilitat territorial és més vigent que mai:

### 1. Dades Clau en 20 Anys
- El volum turístic ha crescut un **+49,1%** des del 2006 fins al 2026.
- El pic estival concentra més de 8,7 milions de visitants en el segon semestre.
- L'Índex de Pressió Humana (IPH) supera les 1.450.000 persones simultànies a l'agost.
      `,
      en: `
Tourism drives the Balearic economy, yet carrying capacity has become the central public policy debate:

### 1. Key 20-Year Trends (2006–2026)
- Inbound visitors increased **+49.1%** from 10.07M in 2006 to 14.85M in 2025/2026.
- The 2020 pandemic trough saw an unprecedented reduction to 2.15M summer tourists.
- The peak summer Human Pressure Index (HPI) logs over **1.45 million simultaneous people** on the island in August.
      `,
      de: `
Der Tourismus ist der Herzschlag Mallorcas, doch die Tragfähigkeit der Insel steht im Fokus:

### 1. Die Zahlen der letzten 20 Jahre
- Besucheranstieg um **+49,1%** zwischen 2006 (10,07 Mio.) und 2025/2026 (14,85 Mio.).
- Der sommerliche Belastungsindex (IPH) klettert im August auf über **1,45 Millionen gleichzeitige Menschen**.
      `,
    },
    category: "hoteles-boutique-agroturismo",
    author: {
      name: "Maria Antònia Gelabert",
      role: "Investigadora en Geografía y Sostenibilidad Balear",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-02",
    updatedDate: "2026-09-02",
    readTime: "9 min",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Turismo", "Sostenibilidad", "IPH", "Estadísticas", "Mallorca"],
    relatedServiceIds: ["hotel-palacio-ca-sa-galesa", "finca-serena-mallorca-montuiri"],
    featured: true,
    historicalSectorId: "turismo_afluencia",
  },
  {
    id: "radiografia-empresas-empleo-mallorca-2006-2026",
    slug: "radiografia-empresas-empleo-mallorca-2006-2026",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Radiografía Empresarial y Laboral de Mallorca: 20 Años de Creación de Negocios",
      ca: "Radiografia Empresarial i Laboral de Mallorca: 20 Anys de Creació de Negocis",
      en: "Business & Employment Landscape in Mallorca: 20 Years of Enterprise Formation",
      de: "Unternehmenslandschaft & Arbeitsmarkt auf Mallorca: 20 Jahre Betriebsentwicklung",
    },
    excerpt: {
      es: "Cómo sobrevivió el tejido balear a la crisis bancaria de 2012 y cómo alcanzó en 2026 el récord histórico de 44.150 empresas inscritas en la Seguridad Social.",
      ca: "Com va sobreviure el teixit balear a la crisi de 2012 i com va assolir el 2026 el rècord de 44.150 empreses inscrites a la Seguretat Social.",
      en: "How local businesses navigated the 2012 credit crisis and soared to an all-time record of 44,150 registered companies in 2026.",
      de: "Wie Mallorcas Wirtschaft die Bankenkrise 2012 meisterte und 2026 den Rekordwert von 44.150 aktiven Arbeitgeberbetrieben erreichte.",
    },
    content: {
      es: `
El tejido empresarial de Mallorca ha demostrado una capacidad de adaptación encomiable:

### 1. La Travesía del Desierto y el Rebote (2006–2026)
- **2006–2007:** Con una economía boyante, operaban **37.210 empresas cotizantes**.
- **El Mínimo de 2012:** La crisis redujo el parque empresarial a **31.250 empresas** (-16% de pérdida de tejido societario).
- **Récord en 2026:** El censo de empleadores escala a **44.150 empresas activas**, un +41,2% por encima del mínimo histórico.

### 2. Diversificación hacia Servicios y Tecnología
Aunque la hostelería y el comercio lideran en volumen bruto, los sectores que mayor crecimiento porcentual han experimentado son el legal-financiero, el náutico de refit y el sector TIC.
      `,
      ca: `
El teixit empresarial mallorquí ha mostrat una notable resiliència:

### 1. Evolució Empresarial
- De les 37.210 empreses del 2007 es va passar al mínim de 31.250 el 2012.
- El 2026 s'ha assolit el màxim històric de **44.150 empreses actives**.
      `,
      en: `
Mallorca's business ecosystem demonstrates impressive structural resilience:

### 1. The 20-Year Business Arc
- From 37,210 registered employers in 2007 to a low of 31,250 in 2012.
- Robust rebound achieving an all-time high of **44,150 active firms** in 2026 (+41.2% above the 2012 floor).
      `,
      de: `
Die mallorquinische Wirtschaft zeichnet sich durch enorme Wandlungsfähigkeit aus:

### 1. Meilensteine des Unternehmensbestands
- Von 37.210 Firmen im Jahr 2007 fiel der Bestand bis 2012 auf 31.250 Betriebe.
- 2026 markiert das historische Allzeithoch mit **44.150 aktiv gemeldeten Unternehmen**.
      `,
    },
    category: "servicios-profesionales",
    author: {
      name: "Joan Carles Ribas",
      role: "Consultor de Desarrollo Empresarial en Baleares",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-03",
    updatedDate: "2026-09-03",
    readTime: "7 min",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    tags: ["Empresas", "Economía", "Seguridad Social", "Emprendimiento", "Mallorca"],
    relatedServiceIds: ["gestoria-administrativa-asesoria-marroig-palma", "bufete-buades-abogados-palma", "cuatrecasas-palma"],
    featured: true,
    historicalSectorId: "empresas_laboral",
  },
  {
    id: "transformacion-movilidad-conectividad-mallorca",
    slug: "transformacion-movilidad-conectividad-mallorca",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "La Revolución de la Movilidad en Mallorca: 20 Años de Conectividad Aérea y Terrestre",
      ca: "La Revolució de la Mobilitat a Mallorca: 20 Anys de Connectivitat Aèria i Terrestre",
      en: "Mobility Revolution in Mallorca: 20 Years of Air Transit & Ground Connectivity",
      de: "Mobilitätswandel auf Mallorca: 20 Jahre Flug- und Nahverkehrsentwicklung",
    },
    excerpt: {
      es: "De los 22 millones a más de 31 millones de pasajeros en el Aeropuerto de Palma Son Sant Joan. El auge del transporte público TIB/SFM y los retos de descongestión.",
      ca: "Dels 22 milions a més de 31 milions de passatgers a l'Aeroport de Palma Son Sant Joan. L'auge del transport públic TIB/SFM i els reptes de mobilitat.",
      en: "From 22M to over 31M passengers at Palma Son Sant Joan Airport. The rise of public transit networks and island congestion challenges.",
      de: "Von 22 auf über 31 Millionen Fluggäste am Airport Palma: Der Ausbau des TIB-Bahnnetzes und Lösungen für den Inselfahrverkehr.",
    },
    content: {
      es: `
La movilidad en una isla de 3.640 km² supone uno de los desafíos logísticos más complejos del Mediterráneo:

### 1. El Tráfico en Son Sant Joan AENA (2006–2026)
- **2006:** 22,4 millones de pasajeros transitados al año.
- **2019:** Récord previo de 29,7 millones de pasajeros.
- **2025/2026:** Nueva cota histórica por encima de los **31,8 millones de pasajeros anuales**, con 13,62M en el primer semestre y 18,55M en el segundo.

### 2. Transporte Terrestre y Sostenibilidad
La gratuidad del transporte público autonómico para residentes (TIB, Metro y Tren SFM) ha impulsado récords de demanda, incentivando la reducción del vehículo privado.
      `,
      ca: `
La mobilitat a Mallorca és un repte constant de planificació territorial:

### 1. Dades de l'Aeroport de Palma
- Trànsit semestral en ascens constant: de 8,85M el 2006-S1 a més de 13,6M el 2026-S1.
- Consolidació de Son Sant Joan com a tercer aeroport més important d'Espanya.
      `,
      en: `
Navigating mobility across 3,640 square kilometres presents critical infrastructure challenges:

### 1. Palma Airport Air Traffic Trends
- Passenger volume increased **+53.9%** across two decades, exceeding **31.8 million** annual transits in 2025/2026.
- Strategic expansions in concourses and sustainable bus links have transformed inter-island connectivity.
      `,
      de: `
Die Mobilität auf 3.640 km² Inselfläche erfordert hochmoderne Verkehrsinfrastruktur:

### 1. Passagierzahlen Flughafen Palma (AENA)
- Steigerung des Halbjahresverkehrs um **+53,9%** von 8,85 Mio. (2006-S1) auf über 13,6 Mio. (2026-S1).
- Der Airport Palma festigt seinen Rang als drittgrößter Flughafen Spaniens.
      `,
    },
    category: "motor-transporte",
    author: {
      name: "Bernat Vives",
      role: "Especialista en Movilidad y Logística del Transporte",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-04",
    updatedDate: "2026-09-04",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    tags: ["Transporte", "Movilidad", "Aeropuerto", "AENA", "Mallorca"],
    relatedServiceIds: ["mallorca-taxi-transfer-aeropuerto-palma-service", "autocares-transunion", "roig-premium-transfers"],
    featured: true,
    historicalSectorId: "movilidad_aena",
  },
  {
    id: "dos-decadas-economia-azul-nautica-mallorca",
    slug: "dos-decadas-economia-azul-nautica-mallorca",
    postType: "guia",
    topicCluster: "aventura_lifestyle",
    title: {
      es: "Dos Décadas de Economía Azul: Cómo Mallorca se Convirtió en la Capital Náutica del Mediterráneo",
      ca: "Dues Dècades d'Economia Blava: Com Mallorca es va Convertir en la Capital Nàutica del Mediterrani",
      en: "Two Decades of Blue Economy: How Mallorca Became the Mediterranean's Yachting Capital",
      de: "Zwei Jahrzehnte Blaue Wirtschaft: Wie Mallorca zur Yachting-Hauptstadt des Mittelmeers wurde",
    },
    excerpt: {
      es: "La flota de chárter comercial se ha más que triplicado (+220%) entre 2006 y 2026. El papel de los varaderos de STP, la exención fiscal de 2013 y el auge del turismo náutico prémium.",
      ca: "La flota de xàrter comercial s'ha més que triplicat (+220%) entre 2006 i 2026. El paper de les drassanes de l'STP i l'auge del turisme nàutic prémium.",
      en: "Commercial charter fleet expanded +220% between 2006 and 2026. The pivotal role of STP refit shipyards and the 2013 tax exemption reform.",
      de: "Die gewerbliche Charterflotte wuchs zwischen 2006 und 2026 um über 220%. Mallorcas Aufstieg zum weltweiten Refit-Zentrum für Megayachten.",
    },
    content: {
      es: `
La industria náutica y la economía azul representan uno de los mayores éxitos de diversificación económica de Mallorca:

### 1. De 1.380 a Más de 4.400 Embarcaciones Comerciales (2006–2026)
- **2006:** Apenas **1.380 embarcaciones** contaban con despacho oficial para chárter.
- **La Reforma Fiscal de 2013:** La exención del impuesto de matriculación para yates de chárter detonó el desembarco masivo de esloras de más de 20 metros.
- **2026:** Mallorca cuenta con una flota autorizada de **4.420 embarcaciones** (+220,3% de crecimiento).

### 2. El Epicentro de Refit y Mantenimiento de Superyates
Con instalaciones de referencia global como **STP Shipyard Palma**, Puerto Portals, Port Adriano y Portocolom, la isla genera más de 950 millones de euros anuales y sostiene a cientos de ingenieros, tapiceros navales y especialistas técnicos locales.
      `,
      ca: `
La indústria nàutica és un dels pilars de major valor afegit a les Illes Balears:

### 1. Creixement de la Flota
- La flota comercial de lloguer d'embarcacions s'ha multiplicat per 3,2 en dues dècades.
- Les drassanes i serveis de varador de Palma concentren la major activitat de reparació del Mediterrani.
      `,
      en: `
The marine leisure industry represents Mallorca's highest value-added economic success:

### 1. Charter Fleet Expansion (+220.3%)
- From 1,380 licensed charter yachts in 2006 to over **4,420 vessels** in 2026.
- The 2013 matriculation tax reform unlocked massive superyacht arrivals.
- Palma's shipyards lead Western Mediterranean refit and repair turnover.
      `,
      de: `
Die maritime Wirtschaft ist einer der stärksten Treiber für hochwertige Arbeitsplätze auf Mallorca:

### 1. Wachstum der Charterflotte
- Von 1.380 lizenzierten Schiffen im Jahr 2006 auf über **4.420 Yachten** im Jahr 2026 (+220,3%).
- Die Werften in Palma und die exklusiven Marinas machen Mallorca zum führenden nautischen Hub Europas.
      `,
    },
    category: "nautica-charter",
    author: {
      name: "Sebastià Palmer",
      role: "Capitán de Yate & Consultor Marítimo Balear",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    tags: ["Náutica", "Chárter", "Economía Azul", "Yates", "Mallorca"],
    relatedServiceIds: ["oasis-catamaran-palma", "easy-boats-mallorca", "puerto-portals-marina-yacht-club"],
    featured: true,
    historicalSectorId: "nautica_maritimo",
  },
  {
    id: "dos-decadas-demografia-presion-humana-mallorca-2006-2026",
    slug: "dos-decadas-demografia-presion-humana-mallorca-2006-2026",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Dos Décadas de Presión Demográfica en Mallorca: Del Censo de 785.000 a Rozar el Millón de Residentes",
      ca: "Dues Dècades de Pressió Demogràfica a Mallorca: Del Cens de 785.000 a Fregar el Milió de Residents",
      en: "Two Decades of Demographic Growth in Mallorca: From 785,000 to Approaching One Million Residents",
      de: "Zwei Jahrzehnte Demografie-Wachstum auf Mallorca: Von 785.000 auf fast eine Million Einwohner",
    },
    excerpt: {
      es: "Mallorca ha sumado más de 182.000 residentes empadronados entre 2006 y 2026 (+23,2%). Analizamos el impacto territorial, la atracción de talento europeo y los retos de equipamientos.",
      ca: "Mallorca ha sumat més de 182.000 residents empadronats entre 2006 i 2026 (+23,2%). Analitzem l'impacte territorial i els reptes d'equipaments públics.",
      en: "Mallorca gained over 182,000 registered residents between 2006 and 2026 (+23.2%). Examining urban migration, European talent attraction, and public services strain.",
      de: "Mallorcas Einwohnerzahl stieg zwischen 2006 und 2026 um 182.000 (+23,2%). Ursachen des Zuzugs, europäische Residenten und die Folgen für Schulen und Kliniken.",
    },
    content: {
      es: `
El crecimiento de la población residente en Mallorca constituye uno de los fenómenos socioeconómicos más determinantes de los últimos 20 años:

### 1. Evolución del Censo Oficial (2006–2026)
- **2006:** La isla contabilizaba **785.400 habitantes empadronados** según el INE.
- **2018:** Se superó por primera vez en la historia el umbral psicológico de los **900.000 residentes**.
- **2026:** El censo oficial alcanza los **967.500 residentes** (+23,2% acumulado).

### 2. Diversidad y Concentración Territorial
Palma concentra el **53,4%** del padrón insular, si bien los mayores ritmos porcentuales de incremento se han dado en la comarca del Raiguer (Marratxí, Inca) y en municipios costeros como Calvià y Llucmajor. Un 22% de la población empadronada procede de estados miembros de la UE u otros países, convirtiendo a Mallorca en un modelo de convivencia multicultural.

### 3. Tensión sobre los Servicios Básicos
El aumento censal constante ha exigido un sobresfuerzo en la red de centros de salud de Ib-Salut, plazas escolares de primaria y secundaria, y en la gestión del tratamiento de aguas y recogida de residuos.
      `,
      ca: `
El creixement continuat del cens és clau per entendre el model balear actual:

### 1. Fites Demogràfiques
- Increment de més de 182.000 habitants en vint anys (+23,2%).
- Palma i la seva conurbació metropolitana concentren la major part del nou veïnatge.
- El 22% dels residents censats té orígens internacionals.
      `,
      en: `
Mallorca's population boom has redefined the island's economic and urban landscape:

### 1. Key Census Milestones
- Sustained rise from 785,400 residents in 2006 to **967,500 in 2026** (+23.2%).
- International residents constitute over 22% of the registered census.
- Rapid municipal growth across Palma, Marratxí, Calvià, and Inca.
      `,
      de: `
Das Bevölkerungswachstum prägt den Alltag und die Infrastruktur Mallorcas nachhaltig:

### 1. Meilensteine des Zensus (2006–2026)
- Zuwachs von 785.400 auf **967.500 Einwohner** (+23,2%).
- Über 22% der Inselbewohner besitzen eine ausländische Staatsbürgerschaft (EU und Übersee).
- Höchste Zuwachsraten im Großraum Palma, in Marratxí und Calvià.
      `,
    },
    category: "servicios-profesionales",
    author: {
      name: "Maria Antònia Gelabert",
      role: "Investigadora en Geografía y Sostenibilidad Balear",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-03",
    updatedDate: "2026-09-03",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    tags: ["Demografía", "Padrón", "Población", "Estadísticas", "Sociedad", "Mallorca"],
    relatedServiceIds: ["gestoria-administrativa-asesoria-marroig-palma", "bufete-buades-abogados-palma"],
    featured: true,
    historicalSectorId: "demografia_presion",
  },
  {
    id: "evolucion-20-anos-hosteleria-restauracion-gastronomia-mallorca",
    slug: "evolucion-20-anos-hosteleria-restauracion-gastronomia-mallorca",
    postType: "guia",
    topicCluster: "gastronomia",
    title: {
      es: "Evolución de 20 Años de la Restauración en Mallorca: De 3.650 a Más de 5.700 Locales Gastronómicos",
      ca: "Evolució de 20 Anys de la Restauració a Mallorca: De 3.650 a Més de 5.700 Locals Gastronòmics",
      en: "20-Year Evolution of Dining & Restaurants in Mallorca: From 3,650 to Over 5,700 Venues",
      de: "20 Jahre Gastronomie auf Mallorca: Vom traditionellen Lokal zur Gourmet-Destination mit 5.700 Betrieben",
    },
    excerpt: {
      es: "El sector de la restauración en Mallorca ha crecido un +56,7% en dos décadas. Analizamos la eclosión de la alta gastronomía, el producto balear Km 0 y la profesionalización del sector.",
      ca: "La restauració a Mallorca ha crescut un +56,7% en dues dècades. L'eclosió de l'alta cuina, el producte d'origen balear i la modernització dels establiments.",
      en: "Mallorca's restaurant sector expanded +56.7% across 20 years. Reviewing Michelin-star dining, local Km 0 terroir sourcing, and year-round culinary culture.",
      de: "Mallorcas Gastronomieszene wuchs um +56,7% in 20 Jahren. Sternerestaurants, traditionelle Celler und der Trend zu lokalen Km-0-Produkten im Fokus.",
    },
    content: {
      es: `
La gastronomía de Mallorca ha dejado de ser un mero complemento vacacional para convertirse en un emblema cultural y motor económico de primer orden:

### 1. Evolución del Número de Establecimientos (2006–2026)
- **2006:** Mallorca albergaba **3.650 locales de restauración** dados de alta en el censo empresarial.
- **La Crisis de 2012:** El sector sufrió un reajuste coyuntural tocando un mínimo de **3.390 locales** en 2012-S2.
- **Expansión y Calidad (2016–2026):** De 4.110 locales en 2016 se pasa a superar los **5.720 establecimientos activos** en 2026-S1 (+39,2% en diez años y +56,7% en veinte años).

### 2. La Revolución del Producto Local y Estrellas Michelin
La cocina balear ha vivido una edad de oro impulsada por chefs autóctonos e internacionales que rescatan variedades locales autóctonas (porc negre, tomàtiga de ramellet, oli de Mallorca DOP) combinadas con técnicas vanguardistas.
      `,
      ca: `
La gastronomia balear viu el seu moment de màxim prestigi internacional:

### 1. Dades Clau
- Creixement d'establiments en actiu: de 3.650 el 2006 a més de 5.720 locals el 2026 (+56,7%).
- Resiliència notable i aposta decidida pel producte agroalimentari de proximitat.
      `,
      en: `
Mallorcan dining has evolved from seasonal tourism support to an internationally celebrated culinary hub:

### 1. Restaurant Population Growth
- From 3,650 operating restaurant establishments in 2006 to **5,720 venues in 2026** (+56.7%).
- Explosive growth in Michelin recognitions, boutique wine pairings, and Mediterranean farm-to-table cuisine.
      `,
      de: `
Mallorcas Gastronomie gehört heute zu den vielfältigsten und spannendsten Europas:

### 1. Daten und Fakten (2006–2026)
- Zunahme der registrierten Gastro-Betriebe von 3.650 auf **5.720 Lokale** (+56,7%).
- Rekordzahl an Gourmet- und Michelin-Restaurants neben authentischen Dorflokalen mit Km-0-Fokus.
      `,
    },
    category: "gastronomia-restaurantes",
    author: {
      name: "Marc Sendra",
      role: "Crítico Gastronómico & Sommelier Balear",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-04",
    updatedDate: "2026-09-04",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tags: ["Gastronomía", "Restaurantes", "Hostelería", "Estadísticas", "Mallorca"],
    relatedServiceIds: ["ca-n-eduardo", "ca-na-toneta", "can-boqueta-soller"],
    featured: true,
    historicalSectorId: "hosteleria_restauracion",
  },
  {
    id: "transicion-energetica-recursos-hidricos-mallorca-20-anos",
    slug: "transicion-energetica-recursos-hidricos-mallorca-20-anos",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Transición Verde y Ciclo del Agua en Mallorca: 20 Años de Energías Renovables y Desalación",
      ca: "Transició Verda i Cicle de l'Aigua a Mallorca: 20 Anys d'Energies Renovables i Desalinització",
      en: "Green Transition & Water Resilience in Mallorca: 20 Years of Renewables & Desalination",
      de: "Energiewende & Wasserwirtschaft auf Mallorca: 20 Jahre Solarenergie und Meerwasserentsalzung",
    },
    excerpt: {
      es: "La generación renovable ha pasado de representar apenas un 1,4% del mix eléctrico en 2006 a superar el 28,5% en 2026. Analizamos la inversión solar, el cable submarino y la garantía hídrica insular.",
      ca: "La generació renovable ha passat d'un 1,4% el 2006 a més del 28,5% el 2026. L'aposta solar, l'enllaç elèctric submarí i la gestió hídrica d'ABAQUA.",
      en: "Renewable energy share soared from 1.4% in 2006 to over 28.5% of the island's electricity mix in 2026. The impact of solar parks, subsea grid cable, and desalination plants.",
      de: "Der Anteil erneuerbarer Energien stieg von 1,4% (2006) auf über 28,5% (2026). Ausbau von Photovoltaik, Unterwasserkabel zum Festland und moderne Entsalzungsanlagen.",
    },
    content: {
      es: `
La sostenibilidad energética e hídrica es el mayor desafío ecológico de un territorio insular sin recursos fósiles propios:

### 1. Del 1,4% al 28,5% de Generación Renovable en Mallorca
- **2006:** Apenas el **1,4%** de la electricidad consumida provenía de fuentes renovables, con una dependencia casi total del carbón en la central de Es Murterar.
- **La Ley de Cambio Climático (2019):** Fijó el cierre progresivo de grupos térmicos y aceleró las autorizaciones de parques fotovoltaicos en suelo no protegido y tejados urbanos.
- **2026:** Mallorca genera el **28,5%** de su electricidad con tecnología solar limpia (+1.935% respecto a 2006) y cuenta con el respaldo del enlace eléctrico submarino con la Península.

### 2. El Ciclo del Agua y la Capacidad de Desalación
Las plantas desalinizadoras de Palma, Alcúdia y Andratx, gestionadas por ABAQUA, garantizan hoy más del 30% del abastecimiento humano en meses de estiaje, protegiendo los acuíferos subterráneos de la salinización y preservando los embalses de Cúber y Gorg Blau en la Serra de Tramuntana.
      `,
      ca: `
La transició ecològica és una realitat indiscutible a l'arxipèlag:

### 1. Generació Renovable
- Multiplicació per més de 20 de la potència solar fotovoltaica instal·lada des del 2006 fins al 2026.
- Reducció històrica d'emissions gràcies a la descarbonització d'Es Murterar.
- Garantia hídrica a través de la xarxa de dessaladores d'ABAQUA.
      `,
      en: `
Energy transition and water management are fundamental to island resilience:

### 1. Clean Energy Trajectory
- Clean renewable generation share rose from **1.4% in 2006 to 28.5% in 2026**.
- Decommissioning of coal units at Es Murterar paired with major solar developments across inland plains.
- Desalination plants ensure drinking water safety during peak summer demand.
      `,
      de: `
Die ökologische Modernisierung Mallorcas ist eine der eindrucksvollsten Entwicklungen der Insel:

### 1. Solarenergie und Dekarbonisierung
- Sprung des Ökostrom-Anteils von **1,4% (2006) auf 28,5% (2026)**.
- Stilllegung des alten Kohlekraftwerks Es Murterar und massiver Ausbau von Dachanlagen und Solarparks.
- Drei große Entsalzungsanlagen (Palma, Alcúdia, Andratx) sichern das Trinkwasser in Trockenzeiten.
      `,
    },
    category: "reformas-construccion",
    author: {
      name: "Bernat Vives",
      role: "Especialista en Medio Ambiente y Sostenibilidad Balear",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    tags: ["Energía", "Renovables", "Solar", "Agua", "Sostenibilidad", "Mallorca"],
    relatedServiceIds: ["espacio-solar-mallorca-fotovoltaica", "energia-solar-fotovoltaica-balear-sun-palma"],
    featured: true,
    historicalSectorId: "energia_sostenibilidad_agua",
  },
  {
    id: "veinte-anos-educacion-internacional-mallorca-colegios-bilingues",
    slug: "veinte-anos-educacion-internacional-mallorca-colegios-bilingues",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Dos Décadas de Educación Internacional en Mallorca: De 3.200 a Más de 8.900 Alumnos Multilingües",
      ca: "Dues Dècades d'Educació Internacional a Mallorca: De 3.200 a Més de 8.900 Alumnes Multilingües",
      en: "Two Decades of International Education in Mallorca: From 3,200 to Over 8,900 Multilingual Students",
      de: "Zwei Jahrzehnte Internationale Schulen auf Mallorca: Von 3.200 auf über 8.900 Schüler",
    },
    excerpt: {
      es: "Las matriculaciones en colegios británicos, alemanes y bilingües se han casi triplicado (+175%) en 20 años. El auge de las familias expats, el currículo IB y la atracción de talento global.",
      ca: "Les matriculacions a col·legis britànics, alemanys i bilingües s'han gairebé triplicat (+175%) en vint anys. L'atracció de famílies internacionals i el batxillerat IB.",
      en: "Enrollment across British, German, and multilingual schools nearly tripled (+175%) over 20 years. Examining expat family relocations, IB diploma curricula, and global talent attraction.",
      de: "Die Schülerzahlen an britischen, deutschen und internationalen Schulen haben sich fast verdreifacht (+175%). Ursachen des Familien-Zuzugs und das Renommee der Abschlüsse.",
    },
    content: {
      es: `
La oferta educativa internacional se ha erigido en uno de los mayores polos de atracción de inversión familiar y talento cualificado hacia Mallorca:

### 1. Evolución del Alumnado Internacional (2006–2026)
- **2006:** Apenas **3.240 alumnos** cursaban estudios en centros extranjeros autorizados en la isla.
- **La Década de Expansión (2016–2026):** De 5.480 alumnos en 2016 se escala hasta los **8.920 estudiantes matriculados** en el curso 2025/2026 (+62,8% en diez años y +175,3% en dos décadas).

### 2. Diversidad de Modelos Pedagógicos
Desde el currículo británico (Queen's College, Bellver, BIC) hasta el sistema alemán (Eurocampus), francés (Lycée Français) y propuestas holísticas en Parc Bit (Escola Global), Mallorca ofrece hoy uno de los ecosistemas educativos más cosmopolitas del sur de Europa.
      `,
      ca: `
L'ecosistema d'escoles internacionals és clau per a la radicació de noves famílies a Mallorca:

### 1. Dades Històriques
- Creixement continuat de l'alumnat: de 3.240 el 2006 a més de 8.920 el 2026 (+175,3%).
- Propostes educatives de primer nivell internacional amb doble titulació i batxillerat internacional (IB).
      `,
      en: `
International schooling has transformed Mallorca into a premier global family relocation hub:

### 1. Enrollment Trajectory
- Ramped up from 3,240 pupils in 2006 to **8,920 registered students in 2026** (+175.3%).
- Exceptional academic standards across British IGCSE/A-Levels, German Abitur, French Baccalauréat, and the International Baccalaureate (IB).
      `,
      de: `
Das Angebot an Privatschulen auf Mallorca gehört zu den besten im Mittelmeerraum:

### 1. Zahlen und Fakten
- Steigerung der Schülerzahl von 3.240 (2006) auf **8.920 Schüler** (2026).
- Anerkannte britische, deutsche und internationale Abschlüsse garantieren weltweiten Hochschulzugang.
      `,
    },
    category: "escuelas-internacionales",
    author: {
      name: "Maria Antònia Gelabert",
      role: "Investigadora en Geografía y Sostenibilidad Balear",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    tags: ["Educación", "Colegios", "Internacional", "Expats", "Mallorca"],
    relatedServiceIds: ["baleares-international-college-sa-porrassa", "bellver-international-college-palma", "queens-college-mallorca-palma", "escola-global-international-school-mallorca"],
    featured: true,
    historicalSectorId: "educacion_internacional",
  },
  {
    id: "dos-decadas-sanidad-privada-turismo-salud-mallorca",
    slug: "dos-decadas-sanidad-privada-turismo-salud-mallorca",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Dos Décadas de Sanidad Privada en Mallorca: De 185.000 a Más de 420.000 Consultas y Cirugías Semestrales",
      ca: "Dues Dècades de Sanitat Privada a Mallorca: De 185.000 a Més de 420.000 Consultes i Cirurgies Semestrals",
      en: "Two Decades of Private Healthcare in Mallorca: From 185,000 to Over 420,000 Semiannual Treatments",
      de: "Zwei Jahrzehnte Privatmedizin auf Mallorca: Von 185.000 auf über 420.000 Behandlungen pro Halbjahr",
    },
    excerpt: {
      es: "La atención sanitaria privada se ha más que duplicado (+130%) entre 2006 y 2026. Analizamos la modernización de los hospitales clínicos, la atención multilingüe y el auge del bienestar prémium.",
      ca: "L'atenció sanitària privada s'ha més que duplicat (+130%) en dues dècades. La modernització hospitalària, els equips multilingües i la salut d'avantguarda.",
      en: "Private medical care more than doubled (+130%) over 20 years. Exploring cutting-edge clinic upgrades, multilingual medical care, and medical travel prestige.",
      de: "Die private Gesundheitsversorgung verdoppelte ihr Volumen (+130%). Modernste Kliniken, mehrsprachige Fachärzte und exzellenter Patientenservice im Porträt.",
    },
    content: {
      es: `
El sector sanitario privado y los servicios médicos de alta especialización han alcanzado un estándar de excelencia de calibre europeo en Mallorca:

### 1. Volumen de Asistencias y Cirugías (2006–2026)
- **2006:** Se registraron **185.400 asistencias médicas y consultas** en la red privada durante el primer semestre.
- **La Década de Consolidación (2016–2026):** De 295.600 consultas semestrales en 2016 se pasa a superar las **426.500 atenciones semestrales** en 2026-S1 (+44,3% en diez años y +130,0% en dos décadas).

### 2. Infraestructuras y Polos Sanitarios de Vanguardia
Clínicas de referencia como Quirónsalud Palmaplanas, Hospital Juaneda Miramar, Clínica Rotger y el Hospital de Llevant en Manacor/Porto Cristo ofrecen atención médica inmediata en inglés, alemán, francés y español, con tecnología diagnóstica de resonancia magnética 3T y cirugía robótica Da Vinci.
      `,
      ca: `
La medicina privada a les Illes Balears és referent de qualitat assistencial:

### 1. Creixement Assistencial
- Increment constant d'atencions mèdiques semestrals: de 185.400 el 2006 a més de 426.500 el 2026 (+130%).
- Atenció multilingüe integral i tecnologia mèdica d'última generació.
      `,
      en: `
Mallorca's private healthcare system delivers world-class medical standards:

### 1. Key Trends
- Semiannual appointments expanded from 185,400 in 2006 to **426,500 in 2026** (+130.0%).
- State-of-the-art robotic surgery, multilingual medical teams, and premier wellness clinics across the island.
      `,
      de: `
Das private Gesundheitswesen auf Mallorca bietet erstklassige medizinische Betreuung auf höchstem europäischem Niveau:

### 1. Behandlungszahlen im Überblick
- Anstieg von 185.400 Behandlungen pro Halbjahr (2006) auf über **426.500 Behandlungen** (2026) (+130,0%).
- Führende Fachkliniken mit deutsch- und englischsprachigen Ärzten sowie modernster Medizintechnik.
      `,
    },
    category: "salud-bienestar",
    author: {
      name: "Marc Sendra",
      role: "Especialista en Salud y Calidad de Vida Balear",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Salud", "Medicina", "Hospitales", "Sanidad", "Bienestar", "Mallorca"],
    relatedServiceIds: ["hospital-de-llevant-porto-cristo", "farmacia-plaza-de-espana-24h-palma", "farmacia-son-caliu-24h-calvia"],
    featured: true,
    historicalSectorId: "salud_sanidad_privada",
  },
  {
    id: "veinte-anos-gestion-residuos-economia-circular-mallorca",
    slug: "veinte-anos-gestion-residuos-economia-circular-mallorca",
    postType: "guia",
    topicCluster: "servicios_hogar",
    title: {
      es: "Veinte Años de Economía Circular y Residuos en Mallorca: De un 12% a Casi el 45% de Reciclaje",
      ca: "Vint Anys d'Economia Circular i Residus a Mallorca: D'un 12% a Quasi el 45% de Reciclatge",
      en: "Twenty Years of Circular Economy & Waste in Mallorca: From 12% to Nearly 45% Recycling",
      de: "Zwanzig Jahre Kreislaufwirtschaft auf Mallorca: Von 12 % auf fast 45 % Recyclingquote",
    },
    excerpt: {
      es: "La tasa de recogida selectiva en Mallorca se multiplicó por más de 3,6 veces entre 2006 y 2026. Analizamos la clausura de vertederos, el contenedor marrón y el pionero veto balear a los plásticos de un solo uso.",
      ca: "La taxa de recollida selectiva a Mallorca es va multiplicar per més de 3,6 vegades en dues dècades. La clausura d'abocadors, la matèria orgànica i la llei balear de residus.",
      en: "Mallorca's selective recycling rate surged 3.6-fold over 20 years. Examining zero-landfill milestones, organic composting, and landmark single-use plastic regulations.",
      de: "Mallorcas Recyclingquote verdreifachte sich von 12,4 % auf 44,8 %. Eine Analyse über Müllverbrennung mit Energierückgewinnung, Biomülltonnen und das Verbot von Einwegplastik.",
    },
    content: {
      es: `
La gestión de residuos en un territorio insular de recursos finitos como Mallorca representa uno de los mayores desafíos logísticos y ambientales del sur de Europa:

### 1. Evolución de la Recogida Selectiva (2006–2026)
- **2006:** Apenas el **12,4%** de las basuras urbanas generadas en la isla se separaban en origen. Gran parte del residuo acababa en valorización energética o tratamientos rudimentarios.
- **La Década de Aceleración (2016–2026):** De una tasa del 21,6% en 2016-S1 se ha escalado hasta el **44,8% en 2026-S1**, lo que supone un avance estructural del +107,4% en 10 años y +261,3% en dos décadas.

### 2. Hitos Normativos e Infraestructuras: TIRME y la Ley Balear 8/2019
1. **Valorización Energética en Son Reus:** La ampliación de la planta de TIRME en 2008 permitió a Mallorca alcanzar el objetivo de "Vertedero Cero" de residuos sin tratar.
2. **Ley Balear de Residuos (2019):** Baleares se adelantó a la Unión Europea prohibiendo la comercialización de plásticos de un solo uso (platos, cubiertos, pajitas y bolsas ligeras).
3. **El Quinto Contenedor (Orgánica):** La implantación paulatina del contenedor marrón en los 53 municipios permite transformar más de 50.000 toneladas anuales de biorresiduos en compost de alta calidad para la agricultura y jardinería balear.
      `,
      ca: `
La gestió de residus a Mallorca ha experimentat una transformació estructural exemplar:

### 1. Dades Clau de Reciclatge
- Increment de la recollida selectiva: del 12,4% el 2006 al **44,8% el 2026** (+261,3% en 20 anys).
- Implantació de la recollida porta a porta i del cinquè contenidor de matèria orgànica a tota la geografia insular.
      `,
      en: `
Island waste management in Mallorca has evolved into a European benchmark of circularity:

### 1. Key Highlights
- Recycling rates expanded from 12.4% in 2006 to **44.8% in 2026** (+261.3% growth).
- Brown organic composting containers and strict single-use plastic bans have driven massive reduction in residual municipal waste.
      `,
      de: `
Die Abfallwirtschaft auf Mallorca gilt heute als mediterranes Vorbild für Kreislaufwirtschaft und Nachhaltigkeit:

### 1. Zentrale Entwicklungen
- Die getrennte Wertstoffsammlung wuchs von 12,4 % (2006) auf **44,8 % (2026)** (+261,3 % in 20 Jahren).
- Flächendeckende Einführung der braunen Biotonne sowie konsequentes Verbot von Einwegplastik auf der gesamten Insel.
      `,
    },
    category: "servicios-hogar",
    author: {
      name: "Joan Miquel Llodrà",
      role: "Consultor de Medio Ambiente y Sostenibilidad Insular",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "9 min",
    coverImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Reciclaje", "Sostenibilidad", "Residuos", "Medio Ambiente", "TIRME", "Mallorca"],
    relatedServiceIds: ["balear-de-limpiezas-y-servicios-palma", "limpiezas-mallorca-brill-palma", "servicios-integrales-fincas-tramuntana"],
    featured: true,
    historicalSectorId: "residuos_reciclaje",
  },
  {
    id: "veinte-anos-revolucion-digital-parcbit-empresas-tech-mallorca",
    slug: "veinte-anos-revolucion-digital-parcbit-empresas-tech-mallorca",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Dos Décadas de Revolución Digital en Mallorca: Del Parque Tecnológico ParcBit a Más de 17.000 Empleos TIC",
      ca: "Dues Dècades de Revolució Digital a Mallorca: Del ParcBit a Més de 17.000 Feines TIC",
      en: "Two Decades of Digital Innovation in Mallorca: From ParcBit to Over 17,000 Tech Jobs",
      de: "Zwei Jahrzehnte IT-Boom auf Mallorca: Vom ParcBit zu über 17.000 Technologie-Arbeitsplätzen",
    },
    excerpt: {
      es: "El empleo tecnológico en Mallorca creció un extraordinario +456% entre 2006 y 2026. Conoce cómo Palma y el ParcBit se convirtieron en la capital mundial de Travel-Tech, hotelería inteligente y nómadas digitales.",
      ca: "L'ocupació tecnològica a Mallorca es va multiplicar per cinc (+456%) en dues dècades. Palma i el ParcBit com a capital mundial de Travel-Tech i nòmades digitals.",
      en: "Tech and software jobs across Mallorca exploded by +456% over 20 years. How Palma and ParcBit became the Mediterranean hub for Travel-Tech and international tech talent.",
      de: "Die IT-Beschäftigung auf Mallorca stieg um +456 % von 3.120 auf über 17.300 Experten. ParcBit und Palma als globale Hochburg für Travel-Tech und digitale Nomaden.",
    },
    content: {
      es: `
Mallorca ya no es solo turismo de sol y playa; en dos décadas se ha consolidado como uno de los polos tecnológicos de software más especializados de Europa:

### 1. Crecimiento Imparable del Empleo Tecnológico (2006–2026)
- **2006:** En el primer semestre de 2006 había apenas **3.120 profesionales** dados de alta en el sector de las Tecnologías de la Información y las Comunicaciones (TIC).
- **2016:** La plantilla del sector ascendía a 6.350 empleos (+103,5% en 10 años).
- **2026:** En el arranque de 2026, el empleo TIC registrado supera los **17.350 afiliados** (+173,2% en diez años y +456,1% en dos décadas con una tasa anual compuesta CAGR del 9,0%).

### 2. Por qué Palma es la Capital Global del Travel-Tech
1. **Sede Central de Software Hotelero:** Plataformas globales de gestión de reservas, bedbanks, motores de Revenue Management y PMS tienen sus equipos principales de I+D en Palma y ParcBit.
2. **Conectividad 100% Fibra Óptica:** El despliegue de redes gigabit y 5G facilitó el desembarco masivo de empresas nórdicas, británicas y alemanas con centros de ingeniería distribuida.
3. **Calidad de Vida y Retención de Talento:** La combinación única de vuelos directos con las principales capitales europeas, clima mediterráneo e infraestructuras bilingües convierte a Mallorca en el imán definitivo de talento tecnológico cualificado.
      `,
      ca: `
La tecnologia i la innovació digital a Mallorca han multiplicat la seva presència per més de cinc:

### 1. Dades Clau del Sector TIC
- Creixement de l'afiliació TIC: de 3.120 persones el 2006 a **més de 17.350 el 2026** (+456,1%).
- Consolidació del ParcBit com a hub de primer nivell en gestió turística intel·ligent i programari avançat.
      `,
      en: `
Mallorca's technology economy represents one of the Mediterranean's biggest success stories:

### 1. Key Statistics
- Tech employment increased from 3,120 in 2006 to **17,350 registered specialists in 2026** (+456.1%).
- High-speed gigabit fiber, international air connections, and ParcBit have cemented Mallorca's role as a global travel-tech powerhouse.
      `,
      de: `
Mallorcas Technologiesektor gehört zu den am stärksten wachsenden Wirtschaftszweigen der Balearen:

### 1. Eckdaten zur IT-Wirtschaft
- Anstieg der IT-Fachkräfte von 3.120 im Jahr 2006 auf **über 17.350 im Jahr 2026** (+456,1 %).
- Der Technologiepark ParcBit und Palma gelten heute als globale Vorreiter für Hotel-Management-Software, Reservierungssysteme und Smart-Tourism.
      `,
    },
    category: "servicios-profesionales",
    author: {
      name: "Elena Rosselló",
      role: "Analista de Ecosistemas Tecnológicos e Innovación",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Tecnologia", "ParcBit", "Innovacion", "TIC", "Startups", "Mallorca"],
    relatedServiceIds: ["fibwi-telecomunicaciones", "balear-redes-fibra-wifi-mallorca", "digital-cinema-mallorca"],
    featured: true,
    historicalSectorId: "tecnologia_innovacion",
  },
  {
    id: "dos-decadas-agricultura-ecologica-vino-producto-local-mallorca",
    slug: "dos-decadas-agricultura-ecologica-vino-producto-local-mallorca",
    postType: "guia",
    topicCluster: "gastronomia",
    title: {
      es: "Dos Décadas de Revolución Agraria en Mallorca: De 16.400 a Más de 44.000 Hectáreas de Cultivo Ecológico",
      ca: "Dues Dècades de Revolució Agrària a Mallorca: De 16.400 a Més de 44.000 Hectàrees de Cultiu Ecològic",
      en: "Two Decades of Agricultural Renaissance in Mallorca: From 16,400 to Over 44,000 Organic Hectares",
      de: "Zwei Jahrzehnte Agrar-Renaissance auf Mallorca: Von 16.400 auf über 44.000 Hektar Bio-Anbau",
    },
    excerpt: {
      es: "La superficie agrícola ecológica certificada creció un +169% en 20 años en Mallorca. La explosión de los vinos DO Binissalem y Pla i Llevant, el aceite de oliva virgen extra y la sobrasada de Porc Negre.",
      ca: "La superfície agrícola ecològica certificada va créixer un +169% en 20 anys a Mallorca. El vi DO, l'oli d'oliva verge extra i el producte local de proximitat.",
      en: "Certified organic farmland surged +169% over two decades in Mallorca. Boutique wineries, PDO olive oil, and the revival of native culinary heritage.",
      de: "Die zertifizierte Öko-Fläche wuchs auf Mallorca in 20 Jahren um +169 %. Spitzenweine mit DO-Siegel, natives Olivenöl und autochthone Delikatessen im Porträt.",
    },
    content: {
      es: `
El campo mallorquín ha experimentado un renacimiento sin precedentes, pasando de una agricultura residual a liderar las tasas europeas de cultivo ecológico:

### 1. Evolución de la Superficie Certificada (2006–2026)
- **2006:** Apenas existían **16.400 hectáreas** bajo sello de certificación ecológica CBPAE.
- **La Década de Expansión (2016–2026):** De 28.200 ha en 2016-S1 se ha escalado a más de **44.150 hectáreas en 2026-S1** (+56,6% en 10 años y +169,2% en dos décadas).

### 2. Los Tres Pilares de la Identidad Gastronómica Insular
1. **La Vitivinicultura de Autor:** Bodegas como Ànima Negra, 4 Kilos, Ribas o Macià Batle han situado variedades autóctonas como Manto Negro y Callet en las cartas de los restaurantes con estrella Michelin de todo el mundo.
2. **Aceite de Oliva DOP Oli de Mallorca:** Miles de hectáreas de olivares centenarios en la Serra de Tramuntana y el Raiguer producen uno de los aceites más aromáticos del Mediterráneo.
3. **Economía de Proximidad:** Hoteles boutique y restaurantes de alta gama se abastecen directamente de huertos locales, cerrando el ciclo entre turismo y sector primario.
      `,
      ca: `
El camp mallorquí ha viscut un renaixement sense precedents cap a l'excel·lència sostenible:

### 1. Dades Clau de Producció Ecològica
- Creixement de la superfície certificada: de 16.400 ha el 2006 a **més de 44.150 ha el 2026** (+169,2% en 20 anys).
- Recuperació de varietats autòctones de raïm (Manto Negre, Callet) i consolidació de l'enoturisme d'autor.
      `,
      en: `
Mallorca's agricultural landscape has undergone a remarkable ecological transformation:

### 1. Key Metrics
- Certified organic farmland increased from 16,400 ha in 2006 to **44,150 ha in 2026** (+169.2%).
- Revival of native grape varietals (Manto Negro, Callet) and surge in boutique olive oil mills across the Tramuntana range.
      `,
      de: `
Mallorcas ländlicher Raum erlebte eine beispiellose ökologische Renaissance:

### 1. Die Zahlen im Überblick
- Anstieg der zertifizierten Bio-Fläche von 16.400 ha (2006) auf **über 44.150 ha (2026)** (+169,2 %).
- Renommierte Weingüter und Olivenölmühlen machen Mallorcas Terroir international zum Qualitätsmaßstab.
      `,
    },
    category: "agricultura-productores",
    author: {
      name: "Bernat Alcover",
      role: "Ingeniero Agrónomo y Catador de Vinos Baleares",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80",
    tags: ["Agricultura", "Vino", "Ecológico", "Oli de Mallorca", "Gastronomía", "Mallorca"],
    relatedServiceIds: ["bodegas-anima-negra-felanitx", "galletas-quely-fabrica-inca", "galletes-gori-de-muro-tradicion"],
    featured: true,
    historicalSectorId: "agricultura_producto_local",
  },
  {
    id: "veinte-anos-transporte-publico-tib-tren-sfm-mallorca",
    slug: "veinte-anos-transporte-publico-tib-tren-sfm-mallorca",
    postType: "guia",
    topicCluster: "actualidad",
    title: {
      es: "Veinte Años de Transporte Público en Mallorca: De 5,8 a Más de 24 Millones de Viajes Semestrales",
      ca: "Vint Anys de Transport Públic a Mallorca: De 5,8 a Més de 24 Milions de Viatges Semestrals",
      en: "Twenty Years of Public Transit in Mallorca: From 5.8M to Over 24M Semiannual Rides",
      de: "Zwanzig Jahre Nahverkehr auf Mallorca: Von 5,8 auf über 24 Millionen Fahrten pro Halbjahr",
    },
    excerpt: {
      es: "El uso del transporte colectivo se cuadruplicó (+323%) en dos décadas. La electrificación de los ferrocarriles SFM, la moderna red de buses TIB y el impacto histórico de la gratuidad de los viajes.",
      ca: "L'ús del transport públic es va quadruplicar (+323%) en vint anys. L'electrificació del tren, la flota TIB de baixes emissions i la targeta intermodal.",
      en: "Public transit usage quadrupled (+323%) over 20 years across Mallorca. Rail electrification, next-gen CNG/electric TIB buses, and subsidized fares.",
      de: "Die Fahrgastzahlen im Nahverkehr vervierfachten sich (+323 %). Elektrifizierung der SFM-Bahnen, emissionsarme TIB-Busse und kostenlose Mobilität im Test.",
    },
    content: {
      es: `
La movilidad colectiva en Mallorca ha experimentado el mayor salto de calidad y cobertura de su historia moderna:

### 1. La Transformación del Pasaje (2006–2026)
- **2006:** La red de trenes diésel y autobuses interurbanos transportaba apenas **5,82 millones de pasajeros** en el primer semestre del año.
- **La Década de Revolución (2016–2026):** De 8,94 millones en 2016-S1 se ha escalado a más de **24,65 millones de viajes semestrales en 2026-S1** (+175,7% en diez años y +323,5% en dos décadas).

### 2. Infraestructuras Clave que Cambiaron la Isla
1. **La Estación Intermodal de Palma:** Inaugurada en 2007 bajo la Plaça d'Espanya, unificó tren, metro y autobuses en un nodo subterráneo moderno.
2. **Electrificación Completa SFM:** En 2018 se culminó la electrificación de las líneas a Inca, Sa Pobla y Manacor, eliminando el gasóleo y reduciendo tiempos de viaje.
3. **Buses TIB Ecológicos y Pago Contactless:** Desde 2020, toda la flota interurbana funciona con gas natural comprimido y propulsión 100% eléctrica.
      `,
      ca: `
La mobilitat pública a les Illes Balears s'ha consolidat com una alternativa real i eficient al vehicle privat:

### 1. Evolució de Viatgers
- Increment espectacular: de 5,82 milions de viatges el 2006 a **més de 24,65 milions el 2026** (+323,5%).
- Electrificació ferroviària total i gratuïtat universal amb la Targeta Intermodal.
      `,
      en: `
Public transit across Mallorca has evolved into a sustainable European showcase:

### 1. Ridership Growth
- Semiannual passengers climbed from 5.82 million in 2006 to **24.65 million in 2026** (+323.5%).
- Total rail electrification, tap-and-ride contactless payment, and subsidized fares have unlocked record-breaking transit adoption.
      `,
      de: `
Der öffentliche Nahverkehr auf Mallorca bietet heute ein dichtes, modernes und umweltfreundliches Netz:

### 1. Rekordwachstum der Fahrgastzahlen
- Anstieg von 5,82 Millionen Fahrten (2006) auf **über 24,65 Millionen (2026)** (+323,5 % in 20 Jahren).
- Moderne Elektrozüge, umweltfreundliche Erdgasbusse und nahtloses kontaktloses Bezahlen.
      `,
    },
    category: "motor-transporte",
    author: {
      name: "Mateu Font",
      role: "Especialista en Movilidad e Infraestructuras de Baleares",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    tags: ["Transporte", "Tren", "TIB", "Movilidad", "Sostenibilidad", "Mallorca"],
    relatedServiceIds: ["mallorca-vtc-chauffeur-transporte-vip-palma", "talleres-son-castello-reparaciones-palma"],
    featured: true,
    historicalSectorId: "transporte_publico_ferrocarril",
  },
  {
    id: "dos-decadas-cultura-museos-patrimonio-unesco-mallorca",
    slug: "dos-decadas-cultura-museos-patrimonio-unesco-mallorca",
    postType: "guia",
    topicCluster: "arte_cultura",
    title: {
      es: "Dos Décadas de Cultura y Patrimonio en Mallorca: De 1,2 a Casi 3 Millones de Visitas Monumentales",
      ca: "Dues Dècades de Cultura i Patrimoni a Mallorca: D'1,2 a Quasi 3 Milions de Visites Monumentals",
      en: "Two Decades of Heritage & Culture in Mallorca: From 1.2M to Nearly 3M Cultural Visitors",
      de: "Zwei Jahrzehnte Kultur & Welterbe auf Mallorca: Von 1,2 auf fast 3 Millionen Kulturbesucher",
    },
    excerpt: {
      es: "Las visitas a museos, monumentos y espacios protegidos crecieron un +120% en 20 años. La declaración de la Serra de Tramuntana por la UNESCO, La Seu gótica y la vanguardia de Es Baluard.",
      ca: "Les visites a museus i monuments es van duplicar (+120%) en dues dècades. La Serra de Tramuntana UNESCO, la Seu i l'art d'Es Baluard.",
      en: "Cultural attendance at heritage monuments and art museums surged +120% over 20 years. UNESCO Tramuntana landscape, Gothic cathedral roof tours, and modern arts.",
      de: "Die Besucherzahlen in Mallorcas Kulturstätten verdoppelten sich (+120 %). Das UNESCO-Welterbe der Tramuntana, Palmas Kathedrale und moderne Kunstmuseen.",
    },
    content: {
      es: `
El patrimonio histórico, monumental y artístico de Mallorca se ha consolidado como un potente motor de desestacionalización turística y orgullo ciudadano:

### 1. Evolución de Visitantes Culturales (2006–2026)
- **2006:** Se registraban **1,28 millones de visitas** a monumentos y centros culturales en el primer semestre.
- **2016–2026:** De 1,84 millones de visitantes en 2016-S1 se ha escalado a **2,82 millones de visitas semestrales en 2026-S1** (+53,3% en diez años y +120,3% en dos décadas).

### 2. Los Grandes Hitos Monumentales
1. **La Catedral de Mallorca (La Seu):** Con la restauración de sus bóvedas y la apertura de sus terrazas panorámicas góticas, atrae a más de 1,2 millones de personas al año.
2. **Serra de Tramuntana Patrimonio de la Humanidad (2011):** La UNESCO reconoció el valor universal excepcional de los bancales de piedra en seco y los canales de agua árabes.
3. **Es Baluard y Fundación Miró:** Palma se sitúa en el mapa europeo de colecciones de arte contemporáneo con exposiciones de resonancia internacional.
      `,
      ca: `
El patrimoni històric i cultural de Mallorca és un pilar fonamental de la identitat insular:

### 1. Dades de Visitants Culturals
- Creixement continuat: d'1,28 milions el 2006 a **més de 2,82 milions de visites el 2026** (+120,3%).
- Declaració de la Serra de Tramuntana com a Patrimoni Mundial de la UNESCO el 2011.
      `,
      en: `
Mallorca's rich cultural heritage and historic architecture stand as world-class attractions:

### 1. Key Metrics
- Semiannual visitors expanded from 1.28 million in 2006 to **2.82 million in 2026** (+120.3%).
- UNESCO recognition for Serra de Tramuntana and Gothic architectural restoration at Palma Cathedral.
      `,
      de: `
Mallorcas kulturelles Erbe begeistert internationale Kulturliebhaber das ganze Jahr über:

### 1. Besucherentwicklung
- Zuwachs von 1,28 Millionen Besuchern (2006) auf **über 2,82 Millionen (2026)** (+120,3 % in 20 Jahren).
- UNESCO-Welterbe Serra de Tramuntana und weltberühmte Monumente wie die Kathedrale La Seu und Schloss Bellver.
      `,
    },
    category: "entretenimiento-ocio",
    author: {
      name: "Clara Miralles",
      role: "Historiadora del Arte y Conservadora de Patrimonio",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "9 min",
    coverImage: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Cultura", "Patrimonio", "UNESCO", "Catedral", "Museos", "Mallorca"],
    relatedServiceIds: ["castell-de-bellver-palma-museu", "coves-del-drach-porto-cristo-cuevas", "coves-d-arta-capdepera-marinas"],
    featured: true,
    historicalSectorId: "cultura_patrimonio_museos",
  },
  {
    id: "dos-decadas-deporte-golf-cicloturismo-mallorca",
    slug: "dos-decadas-deporte-golf-cicloturismo-mallorca",
    postType: "guia",
    topicCluster: "aventura_lifestyle",
    title: {
      es: "Dos Décadas de Deporte y Cicloturismo en Mallorca: De 140.000 a Más de 400.000 Atletas Acreditados",
      ca: "Dues Dècades d'Esport i Cicloturisme a Mallorca: De 140.000 a Més de 400.000 Atletes Acreditats",
      en: "Two Decades of Sports & Cycling in Mallorca: From 140K to Over 400K Accredited Athletes",
      de: "Zwei Jahrzehnte Sport & Radtourismus auf Mallorca: Von 140.000 auf über 400.000 Sportler",
    },
    excerpt: {
      es: "El turismo deportivo, el golf y el cicloturismo crecieron un +193% en Mallorca en 20 años. Los equipos WorldTour de invierno, los 23 campos de golf con agua 100% regenerada y el hito Mallorca 312.",
      ca: "El turisme actiu, el golf i el ciclisme van créixer un +193% en dues dècades. Els equips professionals a l'hivern, els camps de golf sostenibles i la Mallorca 312.",
      en: "Active sports, cycling, and golf expanded by +193% over two decades. Pro WorldTour winter camps, 23 golf courses irrigated with recycled water, and mass cyclosportives.",
      de: "Aktivsport, Golf und Radtourismus wuchsen auf Mallorca um +193 %. UCI-Profiteams, 23 nachhaltige Golfanlagen und legendäre Sportevents wie Mallorca 312 im Porträt.",
    },
    content: {
      es: `
Mallorca se ha convertido indiscutiblemente en el mayor centro neurálgico de Europa para el entrenamiento deportivo al aire libre durante los meses de otoño, invierno y primavera:

### 1. Evolución de Deportistas Registrados (2006–2026)
- **2006:** Se contabilizaban **142.500 deportistas y golfistas** acreditados en el primer semestre.
- **La Década de Consolidación (2016–2026):** De 248.000 deportistas en 2016-S1 se ha escalado a **418.500 deportistas semestrales en 2026-S1** (+68,8% en diez años y +193,7% en dos décadas con un CAGR anual del 5,5%).

### 2. Tres Pilares de Excelencia Deportiva Internacional
1. **La Meca del Ciclismo de Carretera:** Más de 150.000 cicloturistas europeos y los equipos ciclistas profesionales de élite (Ineos, UAE, Visma) eligen el Coll de Sóller, Sa Calobra y Formentor para sus concentraciones.
2. **Campos de Golf 100% Sostenibles:** Los 23 campos de golf de la isla cumplen la estricta directiva balear de riego exclusivo con aguas depuradas regeneradas.
3. **Eventos Internacionales Masivos:** Pruebas como la marcha cicloturista Mallorca 312 y el Ironman 70.3 Alcúdia agotan miles de plazas en cuestión de horas.
      `,
      ca: `
Mallorca és la capital europea de l'esport a l'aire lliure i de l'entrenament ciclista d'elit:

### 1. Dades Clau
- Creixement continuat: de 142.500 esportistes el 2006 a **més de 418.500 atletes el 2026** (+193,7%).
- Rutes mítiques de carretera a la Serra de Tramuntana i 23 camps de golf regats amb aigua 100% regenerada.
      `,
      en: `
Mallorca represents Europe's ultimate outdoor sports playground and winter training sanctuary:

### 1. Key Growth Data
- Semiannual participants increased from 142,500 in 2006 to **418,500 athletes in 2026** (+193.7%).
- Elite cycling training camps across Sa Calobra and Formentor, alongside 23 championship golf courses.
      `,
      de: `
Mallorca ist Europas unbestrittene Hochburg für Aktivurlaub und Trainingslager im milden Winter:

### 1. Entwicklung der Sportlerzahlen
- Anstieg von 142.500 Sportlern (2006) auf **über 418.500 aktive Teilnehmer (2026)** (+193,7 % in 20 Jahren).
- Legendäre Passstraßen wie Sa Calobra und 23 Golfplätze mit umweltfreundlicher Brauchwasserbewässerung.
      `,
    },
    category: "deportes-fitness",
    author: {
      name: "Guillem Bauzà",
      role: "Entrenador de Alto Rendimiento y Guía Cicloturista",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2026-09-05",
    updatedDate: "2026-09-05",
    readTime: "8 min",
    coverImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    tags: ["Deporte", "Ciclismo", "Golf", "Mallorca 312", "Ironman", "Mallorca"],
    relatedServiceIds: ["arabella-golf-mallorca-son-vida-son-muntaner", "altafit-palma-gimnasio-centro-deportivo", "club-natacio-palma-instalaciones-deportivas"],
    featured: true,
    historicalSectorId: "deporte_golf_nautica_activo",
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
