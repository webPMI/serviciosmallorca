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
    title: {
      es: "Guía Definitiva: Cómo Alquilar un Barco o Yate en Mallorca este Año",
      en: "Ultimate Guide: How to Charter a Boat or Yacht in Mallorca This Year",
      ca: "Guia Definitiva: Com Llogar una Embarcació o Iot a Mallorca Aquest Any",
    },
    excerpt: {
      es: "Descubre las mejores zonas de navegación (Puerto Portals, Andratx, Cabrera), precios medios, consejos con patrón y cómo elegir la embarcación ideal.",
      en: "Discover top sailing grounds (Puerto Portals, Andratx, Cabrera), average charter rates, skipper tips, and how to pick the perfect yacht.",
      ca: "Descobreix les millors zones de navegació (Puerto Portals, Andratx, Cabrera), preus mitjans i consells per llogar amb patró.",
    },
    content: {
      es: `
Mallorca es uno de los destinos náuticos más codiciados del Mediterráneo. Con más de 550 kilómetros de costa y más de 200 calas y playas, recorrer la isla desde el mar es una experiencia inigualable.

### 1. ¿Qué tipo de embarcación elegir?
- **Lanchas a motor (6-10m):** Ideales para excursiones de día rápido entre calas cercanas como Cala Fornells o Illetes.
- **Veleros:** Para quienes buscan la tranquilidad del viento y una travesía relajada recorriendo la costa de la Serra de Tramuntana.
- **Catamaranes:** Perfectos para familias o grupos de amigos gracias a su enorme habitabilidad, estabilidad y zona de solárium.
- **Yates a motor de lujo:** Máximo confort, tripulación profesional completa y juguetes acuáticos como Seabob o motos de agua.

### 2. Los mejores puertos de salida en Mallorca
- **Puerto Portals & Port Adriano:** Puertos de referencia en el suroeste con embarcaciones de alta gama y acceso directo a calas cristalinas.
- **Port de Sóller:** La puerta de entrada para explorar los impresionantes acantilados de Sa Calobra y Cala Tuent.
- **Port de Pollença & Alcúdia:** Perfectos para navegar hacia la península de Formentor y calas del norte.

### 3. Recomendación Verificada de Servicios Mallorca
Para una experiencia 100% segura y transparente, recomendamos acudir siempre a empresas consolidadas con licencias oficiales y patrones experimentados como **Mallorca Global Charter**.
      `,
      en: `
Mallorca is globally celebrated as one of the prime yacht charter destinations in the Mediterranean. With over 550 km of coast and 200+ coves, experiencing Mallorca by sea is unmatched.

### 1. Choosing the right boat
- **Day motorboats (6-10m):** Best for quick bay-hopping to nearby coves like Illetes and Portals Vells.
- **Sailing yachts:** Ideal for a peaceful experience along the dramatic cliffs of the Serra de Tramuntana.
- **Catamarans:** Excellent for families and groups due to deck space, stability, and spacious trampolines.
- **Luxury superyachts:** Supreme comfort with dedicated captain, private chef, and high-end water toys (Seabobs, e-foils).

### 2. Best departure marinas
- **Puerto Portals & Port Adriano:** Southwest luxury hubs with swift access to turquoise coves.
- **Port de Sóller:** The gateway to Sa Calobra and Cala Tuent.
- **Port de Pollença:** Ideal for navigating towards the scenic Cap de Formentor.

### 3. Servicios Mallorca Verified Recommendation
Always choose licensed operators with verified nautical safety records and full insurance such as **Mallorca Global Charter**.
      `,
      ca: `
Mallorca és una de les destinacions nàutiques més desitjades del Mediterrani. Amb més de 550 km de costa i més de 200 cales, navegar per l'illa és una vivència inoblidable.

### 1. Quin tipus d'embarcació triar?
- **Llanxes a motor:** Ideals per a sortides de dia a cales properes.
- **Velers:** Per a qui busca la pau de la navegació tradicional vora la Serra de Tramuntana.
- **Catamarans:** Perfectes per a famílies i grups per la seva estabilitat i amplitud.
- **Iots de luxe:** Màxim confort, tripulació professional i esports aquàtics.

### 2. Principals ports de sortida
- **Puerto Portals i Port Adriano:** Referents al sud-oest de l'illa.
- **Port de Sóller:** Punt de partida cap a Sa Calobra i Cala Tuent.
- **Port de Pollença:** Ideal per a la badia i el Cap de Formentor.
      `,
    },
    category: "nautica-charter",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Guía Náutica Oficial",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-01-15",
    readTime: "5 min",
    coverImage: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80",
    tags: ["Náutica", "Yates", "Mallorca", "Puerto Portals", "Guía"],
    relatedServiceIds: ["mallorca-global-charter"],
    featured: true,
  },
  {
    id: "mejores-instaladores-climatizacion-palma",
    slug: "mejores-instaladores-climatizacion-palma",
    title: {
      es: "Cómo Elegir el Mejor Servicio de Climatización y Aerotermia en Mallorca",
      en: "How to Choose the Best AC and Aerothermal Heating Services in Mallorca",
      ca: "Com Triar el Millor Servei de Climatització i Aerotèrmia a Mallorca",
    },
    excerpt: {
      es: "Análisis de sistemas de eficiencia energética para viviendas en Baleares, mantenimiento preventivo y cómo ahorrar hasta un 60% en tu factura eléctrica.",
      en: "Energy efficiency analysis for Balearic homes, preventive maintenance tips, and how to save up to 60% on electricity bills.",
      ca: "Anàlisi de sistemes d'eficiència energètica per a habitatges a Balears, manteniment preventiu i estalvi energètic.",
    },
    content: {
      es: `
El clima de Mallorca combina veranos muy cálidos con inviernos húmedos. Contar con un sistema de climatización eficiente no solo garantiza el confort, sino que puede reducir radicalmente la factura de luz.

### 1. ¿Por qué la Aerotermia es la reina en Mallorca?
La aerotermia extrae hasta el 75% de la energía del aire exterior. En climas templados como el balear, su rendimiento (COP) es máximo durante todo el año, permitiendo alimentar tanto el aire acondicionado en verano como el suelo radiante en invierno y el agua caliente sanitaria (ACS).

### 2. Claves para elegir instalador en la isla
- **Homologación oficial RITE:** Asegúrate de que la empresa emita el certificado oficial de instalación.
- **Servicio técnico propio:** Evita subcontratas que demoran semanas ante averías en plena ola de calor.
- **Recomendación:** Empresas autorizadas como **Instalia Mallorca** ofrecen presupuestos técnicos claros y cumplimiento de la normativa balear.
      `,
      en: `
Mallorca's climate features hot, sunny summers and humid winters. A high-efficiency climate control system is essential for year-round comfort and massive energy savings.

### 1. Why Heat Pump Aerothermal systems lead in Mallorca
Aerothermal technology draws up to 75% of its energy from the outdoor air. In mild island climates, efficiency (COP) is exceptionally high for cooling, radiant underfloor heating, and domestic hot water.

### 2. What to look for in a contractor
- **Official RITE certification** and authorized installation warranty.
- **In-house technical maintenance** to ensure fast response times during summer peak months.
- **Recommendation:** Licensed contractors such as **Instalia Mallorca** provide transparent quotes and certified compliance.
      `,
      ca: `
El clima de Mallorca combina estius calorosos amb hiverns humits. Disposar d'un bon sistema de climatització és clau per al confort i l'estalvi en el consum elèctric.

### 1. Per què l'aerotèrmia és la millor opció a Mallorca?
Extreu gran part de l'energia de l'aire exterior amb una eficiència òptima a les Balears per a fred, calor i aigua calenta sanitària.

### 2. Consells per triar instal·lador
- Comprovar certificació i homologació oficial RITE.
- Servei de manteniment preventiu i instal·ladors acreditats com **Instalia Mallorca**.
      `,
    },
    category: "reformas-hogar",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Especialistas en Reformas y Eficiencia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-01-20",
    readTime: "4 min",
    coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    tags: ["Climatización", "Aerotermia", "Reformas", "Ahorro Energético", "Palma"],
    relatedServiceIds: ["instalia-mallorca"],
    featured: true,
  },
  {
    id: "alta-gastronomia-catering-villas-mallorca",
    slug: "alta-gastronomia-catering-villas-mallorca",
    title: {
      es: "La Alta Gastronomía y el Catering en Villas Exclusivas de Mallorca",
      en: "Haute Cuisine & Bespoke Catering in Mallorca's Luxury Villas",
      ca: "L'Alta Gastronomia i el Càtering a Vil·les Exclusives de Mallorca",
    },
    excerpt: {
      es: "Descubre cómo los servicios de catering y chefs privados con raíces de autor elevan las celebraciones y estancias vacacionales en la isla.",
      en: "Discover how private dining and Michelin-inspired catering elevate celebrations and villa stays across the island.",
      ca: "Descobreix com els serveis de càtering i xefs privats d'autor transformen les celebracions i estades a l'illa.",
    },
    content: {
      es: `
La gastronomía mallorquina es rica en contrastes, producto de temporada y tradición mediterránea. Durante las vacaciones o celebraciones familiares, contar con un catering de alta cocina transforma una comida en una experiencia inolvidable.

### Ventajas de un catering de autor en villa
1. **Personalización absoluta:** Menús diseñados a medida según intolerancias, gustos y preferencias gastronómicas.
2. **Producto local de lonja y huerto:** Pescado fresco del día, verduras ecológicas de fincas locales y maridaje con vinos de la tierra.
3. **Servicio integral:** El equipo se encarga de la compra, servicio de mesa con camareros y deja la villa impecable.

Destacamos servicios de referencia como **Fosh Catering**, con menús mediterráneos de vanguardia avalados por el prestigioso chef Marc Fosh.
      `,
      en: `
Mallorca's culinary scene is a vibrant tribute to Mediterranean heritage. Hiring an in-villa catering brigade turns any vacation or celebration into a five-star dining event.

### Key Benefits
1. **Full customization:** Tailored menus catering to every dietary requirement and culinary style.
2. **Market-fresh ingredients:** Fresh catch of the day, organic farm produce, and local artisanal cheeses.
3. **Effortless experience:** Complete service covering grocery shopping, cooking, tableside presentation, wine pairing, and spotless cleanup.

We highlight premier services like **Fosh Catering**, led by acclaimed chef Marc Fosh.
      `,
      ca: `
La gastronomia de Mallorca destaca pel seu producte d'excel·lència i la seva tradició mediterrània. Un servei de càtering d'autor converteix qualsevol celebració en un record únic.

### Avantatges
1. Menús fets a mida amb producte de mercat i llotja.
2. Servei integral de cuina, servei de taula i neteja total com el que ofereix **Fosh Catering**.
      `,
    },
    category: "gastronomia-catering",
    author: {
      name: "Equipo Editorial Servicios Mallorca",
      role: "Gastronomía Balear",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    publishDate: "2025-01-28",
    readTime: "4 min",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Catering", "Gastronomía", "Villas Mallorca", "Marc Fosh", "Palma"],
    relatedServiceIds: ["fosh-catering-mallorca"],
    featured: true,
  },
  {
    id: "guia-mejores-estudios-tatuaje-mallorca",
    slug: "guia-mejores-estudios-tatuaje-mallorca",
    title: {
      es: "Guía de los Mejores Estudios de Tatuaje en Mallorca: Estilos, Zonas y Consejos Sanitarios",
      en: "Guide to the Best Tattoo Studios in Mallorca: Styles, Zones, and Hygiene Tips",
      ca: "Guia dels Millors Estudis de Tatuatge a Mallorca: Estils, Zones i Consells Sanitaris",
    },
    excerpt: {
      es: "Analizamos los estudios de tatuaje y piercing más destacados de Palma, Calvià, Inca, Alcúdia y Manacor. Consejos para elegir artista, estilos (Fine Line, Realismo, Tradicional) y normativas sanitarias.",
      en: "We review top-rated tattoo and piercing studios across Palma, Calvià, Inca, Alcúdia, and Manacor. Tips on choosing artists, styles, and hygiene standards.",
      ca: "Analitzem els estudis de tatuatge més destacats de Palma, Calvià, Inca, Alcúdia i Manacor. Consells per triar artista, estils i normativa sanitària.",
    },
    content: {
      es: `
Mallorca cuenta con una escena artística de tatuaje de primer nivel europeo. Desde el emblemático Casco Antiguo de Palma hasta localidades como Santa Catalina, Palmanova, Inca o Alcúdia, la isla reúne a reconocidos artistas internacionales y maestros del trazo.

### 1. Estilos más demandados en la isla
- **Fine Line & Minimalismo:** Diseños sutiles, microtatuajes botánicos y geometría de alta precisión. Destacan estudios como **Good Luck Tattoo Palma**.
- **Realismo & Black and Grey:** Retratos, esculturas clásicas y sombras hiperrealistas. El referente galardonado es **Cota Gallery Tattoo Studio** en Santa Catalina (5.0 estrellas con +1.600 reseñas).
- **Old School & Tradicional:** Líneas sólidas, colores vivos e iconografía marinera clásica con pioneros como **Old Town Tattoos Palma** (desde 2009) y **Castter Tattoo Parlor** en Puerto de Alcúdia (desde 2000).
- **Neotradicional e Ilustrativo:** Piezas de autor botánicas y de fantasía en **Miskatonic Tattoo Manacor**.

### 2. Normativas y Seguridad Sanitaria
Todos los estudios certificados en Baleares cumplen con la normativa del Govern Balear: material 100% estéril desechable, tintas homologadas por la Agencia Europea de Sustancias Químicas (REACH) y profesionales con titulación higiénico-sanitaria oficial.
      `,
      en: `
Mallorca features a world-class tattoo scene. From historic Old Town alleys to the trendsetting Santa Catalina and coastal hubs in Calvià and Alcúdia, the island hosts elite resident and international guest artists.

### 1. Popular Tattoo Styles in Mallorca
- **Fine Line & Micro Realism:** High-precision subtle tattoos spearheaded by **Good Luck Tattoo Palma**.
- **Hyperrealism & Black & Grey:** Masterpiece portraits and conceptual sleeves found at **Cota Gallery Tattoo Studio** (5.0 stars with 1,600+ reviews).
- **American Traditional & Japanese:** Bold, timeless iconography with veterans like **Old Town Tattoos Palma** (est. 2009) and **Castter Tattoo Parlor** in Port d'Alcúdia (est. 2000).
- **Neotraditional & Illustrative:** Creative bespoke artworks at **Miskatonic Tattoo Manacor**.

### 2. Health & Safety Standards
All reputable Balearic studios follow rigorous sanitary regulations including EU REACH-compliant pigments and autoclave hospital sterilization.
      `,
      ca: `
Mallorca té una escena de tatuatge professional d'alt nivell. Des del centre històric de Palma fins a Santa Catalina, Calvià, Inca o Alcúdia, l'illa compta amb estudis i artistes de gran prestigi.

### 1. Estils destacats a Mallorca
- **Fine Line & Minimalisme:** Dissenys subtils i elegants a **Good Luck Tattoo Palma**.
- **Realisme en Ombres:** Retrats i composicions a **Cota Gallery Tattoo Studio** a Santa Catalina.
- **Tradicional & Old School:** Dissenys clàssics a **Old Town Tattoos Palma** i **Castter Tattoo Parlor** al Port d'Alcúdia.
- **Il·lustració i Neotradicional:** Creacions d'autor a **Miskatonic Tattoo Manacor**.
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
    tags: ["Tatuajes Mallorca", "Tattoo Palma", "Fine Line", "Santa Catalina", "Arte Balear"],
    relatedServiceIds: [
      "good-luck-tattoo-palma",
      "cota-gallery-tattoo",
      "old-town-tattoos-palma",
      "castter-tattoo-alcudia",
      "gm-tattoo-inca",
      "tattoo-nation-palmanova",
      "miskatonic-tattoo-manacor",
    ],
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
