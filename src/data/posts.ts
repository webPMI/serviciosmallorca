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
