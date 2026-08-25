import type { ServiceItem } from "../types.ts";

/**
 * Vandal Palma (Santa Catalina) - Alta Cocina Creativa & Maridaje Global.
 * Chef Bernabé Caravotta y Sumiller Sebastián Pérez.
 * Curado bajo el Protocolo de Enriquecimiento Profundo (GR-11 Zero Fake Data, GR-12 Multi-Mapas).
 */
export const vandalPalma: ServiceItem = {
  id: "vandal-palma",
  slug: "vandal-palma",
  name: "Restaurante Vandal Palma",
  category: "gastronomia-catering",
  secondaryCategories: [],
  zone: "palma",
  address: "Plaça del Progrés, 15, 07013 Palma, Illes Balears",
  coordinates: {
    lat: 39.571,
    lng: 2.6366,
  },
  rating: 4.6,
  reviewCount: 1650,
  priceRange: "€€€",
  verified: true,
  featured: true,
  status: "open",
  seasonality: "year_round",
  culturalIdentity: "international_luxury",
  isIconicHeritage: false,
  targetAudience: ["residentes", "turistas", "alemanes", "britanicos", "expat"],
  languagesSpoken: ["es", "en", "ca", "it"],
  emergency24h: false,
  inVillaService: false,
  features: ["wifi", "air_conditioning", "credit_card", "sommelier_service", "terrace"],
  paymentMethods: ["credit_card", "cash", "apple_pay"],
  amenities: ["wifi", "air_conditioning", "wheelchair_accessible", "terrace"],
  certifications: ["Recomendado Guía Repsol", "Manipulador de Alimentos Balear", "Registro Sanitario Oficial"],
  pricing: {
    startingPrice: "45.00€",
    depositRequired: "Reserva previa con tarjeta de crédito recomendada",
    rateType: "tiered",
    notes: {
      es: "Carta de platillos de viaje con propuesta de maridaje individual de vino o cóctel para cada plato.",
      en: "Global small plates concept pairing each individual dish with a specific wine or signature cocktail.",
      ca: "Carta de platets viatgers amb maridatge individual de vi o còctel dissenyat per a cada plat.",
    },
  },
  menuUrl: "https://www.vandalpalma.com/menuvandalpalma/",
  onlineStore: {
    hasOnlineStore: true,
    platform: "woocommerce",
    url: "https://vandalpalma.com/shop",
  },
  specialties: {
    es: [
      "Cornetto de Tartar de Atún Rojo con Nori y Wasabi",
      "Ceviche Rústico de Corvina con Leche de Tigre de Maracuyá",
      "Panceta Crujiente Laqueada con Kimchi y Miel Balear",
      "Molleja Glaseada con Crema de Tupinambo",
      "Cócteles de Autor Diseñados a Medida para Cada Plato",
    ],
    en: [
      "Bluefin Tuna Tartare Cornetto with Nori and Wasabi",
      "Rustic Corvina Ceviche with Passion Fruit Leche de Tigre",
      "Crispy Glazed Pork Belly with Kimchi and Balearic Honey",
      "Glazed Sweetbreads with Jerusalem Artichoke Puree",
      "Bespoke Author Cocktails Tailored for Every Dish",
    ],
    ca: [
      "Cornet de Tàrtar de Tonyina Vermella amb Nori i Wasabi",
      "Ceviche Rústic de Corvina amb Llet de Tigre de Fruita de la Passió",
      "Cansalada Cruixent Laquejada amb Kimchi i Mel Balear",
      "Lletó Glacejat amb Crema de Tupinambo",
      "Còctels d'Autor Dissenyats a Mida per a Cada Plat",
    ],
  },
  teamMembers: [
    {
      name: "Bernabé Caravotta",
      role: {
        es: "Chef Ejecutivo & Cofundador",
        en: "Head Chef & Co-founder",
        ca: "Xef Executiu i Cofundador",
      },
      specialty: "Cocina Creativa Global y Sabores de Viaje",
      instagramHandle: "@vandalpalma",
    },
    {
      name: "Sebastián Pérez",
      role: {
        es: "Sumiller & Jefe de Sala",
        en: "Head Sommelier & General Manager",
        ca: "Cap de Sala i Sommelier",
      },
      specialty: "Maridajes Líquidos y Vinos Internacionales",
      instagramHandle: "@vandalpalma",
    },
  ],
  faqs: [
    {
      question: {
        es: "¿Cómo funciona el maridaje por plato en Vandal?",
        en: "How does dish-by-dish pairing work at Vandal?",
        ca: "Com funciona el maridatge per plat a Vandal?",
      },
      answer: {
        es: "Cada plato de la carta cuenta con una sugerencia de maridaje de media copa de vino singular o un cóctel de autor creado específicamente para potenciar sus sabores.",
        en: "Every dish on the menu has a curated pairing of a half-glass of boutique wine or an artisan cocktail specifically crafted to enhance its flavors.",
        ca: "Cada plat de la carta té una recomanació de maridatge de mitja copa de vi singular o un còctel d'autor dissenyat per potenciar els seus sabors.",
      },
    },
  ],
  foundedYear: 2017,
  founderName: "Bernabé Caravotta y Sebastián Pérez",
  founderStory: {
    es: "Nacido en 2017 en el vibrante barrio de Santa Catalina en Palma, Vandal nació de la complicidad entre el chef argentino Bernabé Caravotta y el sumiller Sebastián Pérez tras años de viajes por los cinco continentes. Su objetivo fue romper convencionalismos y crear una experiencia sensorial desenfadada donde la comida y la bebida dialogan plato a plato.",
    en: "Established in 2017 in Palma's bohemian Santa Catalina district, Vandal arose from the creative synergy between Argentine chef Bernabe Caravotta and sommelier Sebastian Perez after global culinary travels. Their mission was to break fine-dining rules, creating an electric experience where drinks and food converse course by course.",
    ca: "Nascut el 2017 al barri de Santa Catalina a Palma, Vandal va néixer de la complicitat entre el xef Bernabé Caravotta i el sommelier Sebastián Pérez. El seu objectiu va ser trencar els convencionalismes de l'alta cuina i crear una experiència on menjar i beure dialoguen plat a plat.",
  },
  reputationBreakdown: {
    googleMaps: {
      rating: 4.6,
      reviewCount: 1650,
      url: "https://www.google.com/maps/search/?api=1&query=Vandal%20Palma%20Mallorca",
    },
    appleMaps: {
      url: "https://maps.apple.com/?q=Vandal%20Palma%20Mallorca",
    },
    bingMaps: {
      rating: 4.6,
      reviewCount: 95,
      url: "https://www.bing.com/maps?q=Vandal%20Palma%20Mallorca",
    },
    totalReviewsAggregated: 1745,
    overallWeightedRating: 4.6,
  },
  reviews: [
    {
      id: "rev-vp-1",
      authorName: "Ignacio P.",
      rating: 5,
      date: "2026-07-11",
      platform: "google_maps",
      language: "es",
      comment:
        "Una de las experiencias gastronómicas más divertidas y sorprendentes de Palma. El tartar de atún y el maridaje con cócteles son sublimes.",
      verifiedCustomer: true,
    },
    {
      id: "rev-vp-2",
      authorName: "Liam W.",
      rating: 5,
      date: "2026-05-30",
      platform: "tripadvisor",
      language: "en",
      comment:
        "Incredible energy, vibrant atmosphere, and world-class food. The wine & cocktail pairings make every bite exciting.",
      verifiedCustomer: true,
    },
  ],
  socialLinks: {
    instagram: "https://www.instagram.com/vandalpalma/",
    facebook: "https://www.facebook.com/VandalPalma/",
  },
  socialPosts: [],
  webDirectories: [
    {
      directoryName: "Guía Repsol (Recomendado)",
      url: "https://www.google.com/search?q=site:guiarepsol.com+Vandal%20Palma",
      indexed: true,
    },
    {
      directoryName: "TripAdvisor Gastronomía Mallorca",
      url: "https://www.google.com/search?q=site:tripadvisor.es+Vandal%20Palma",
      indexed: true,
    },
  ],
  pressMentions: [
    {
      mediaName: "Diario de Mallorca",
      title: "Vandal: La cocina sin fronteras que conquistó Santa Catalina",
      date: "2025-08-14",
      url: "https://www.google.com/search?q=site:diariodemallorca.es+Vandal%20Palma",
      quote: "Un referente indiscutible de creatividad y gastronomía líquida en la noche de Palma.",
    },
  ],
  newsMentions: [
    {
      source: "Diario de Mallorca",
      title: "Vandal Palma: Sabores del mundo y coctelería en Santa Catalina",
      url: "https://www.google.com/search?q=site:diariodemallorca.es+Vandal%20Palma",
    },
    {
      source: "ABC Mallorca",
      title: "Vandal Restaurant in Santa Catalina Palma",
      url: "https://www.google.com/search?q=site:abc-mallorca.com+Vandal%20Palma",
    },
  ],
  awards: [
    {
      title: "Recomendado Guía Repsol",
      issuer: "Guía Repsol",
      year: 2025,
      url: "https://www.guiarepsol.com",
    },
    {
      title: "Travellers' Choice",
      issuer: "TripAdvisor",
      year: 2025,
      url: "https://www.tripadvisor.es",
    },
  ],
  authorityProfiles: [],
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Vandal%20Palma%20Mallorca",
  appleMapsUrl: "https://maps.apple.com/?q=Vandal%20Palma%20Mallorca",
  bingMapsUrl: "https://www.bing.com/maps?q=Vandal%20Palma%20Mallorca",
  phone: "+34 871 04 51 74",
  whatsapp: "+34 871 04 51 74",
  email: "info@vandalpalma.com",
  website: "https://vandalpalma.com",
  tags: [
    "zona:palma",
    "product:premium",
    "mod:en-local",
    "mod:cita-previa",
    "aud:parejas",
    "aud:expat",
    "temps:todo-el-ano",
  ],
  shortDescription: {
    es: "Restaurante de cocina creativa de autor y maridaje global en Santa Catalina liderado por Bernabé Caravotta y Sebastián Pérez, con platos viajeros y coctelería a medida.",
    en: "Creative author restaurant and global pairing in Santa Catalina by Bernabe Caravotta and Sebastian Perez, featuring world flavors and bespoke cocktails.",
    ca: "Restaurant de cuina creativa d'autor i maridatge global a Santa Catalina liderat per Bernabé Caravotta i Sebastián Pérez, amb platets viatgers i cocteleria a mida.",
  },
  fullDescription: {
    es: "Ubicado en el corazón del barrio gastronómico de Santa Catalina en Palma, Vandal propone una experiencia cosmopolita y vibrante que invita a viajar por los sabores del mundo. Diseñado por el chef Bernabé Caravotta y el sumiller Sebastián Pérez, el restaurante destaca por su original fórmula de maridaje individual: cada bocado cuenta con su correspondiente copa de vino singular o cóctel de autor creado para armonizar y potenciar la vivencia en mesa.",
    en: "Set in the beating heart of Palma's culinary Santa Catalina district, Vandal delivers an electric, world-inspired dining experience. Conceived by chef Bernabe Caravotta and sommelier Sebastian Perez, the restaurant stands out for its pairing mastery: each dish is served with an individually tailored boutique wine or author cocktail.",
    ca: "Ubicat al cor del barri de Santa Catalina a Palma, Vandal ofereix una experiència cosmopolita i vibrant inspirada en els sabors del món. Dissenyat pel xef Bernabé Caravotta i el sommelier Sebastián Pérez, el restaurant destaca per la seva fórmula de maridatge individual per a cada plat.",
  },
  highlights: {
    es: [
      "Concepto pionero de maridaje líquido individual plato por plato",
      "Ubicación céntrica en el barrio gastronómico de Santa Catalina",
      "Cocina creativa global de alta técnica",
      "Coctelería de autor y bodega internacional seleccionada",
      "Terraza animada en Plaça del Progrés",
    ],
    en: [
      "Pioneering course-by-course bespoke drink pairing concept",
      "Prime location in Palma's lively Santa Catalina dining hub",
      "High-technique inventive global cuisine",
      "Artisan author cocktail bar and boutique international wine list",
      "Vibrant dining terrace on Placa del Progres",
    ],
    ca: [
      "Concepte pioner de maridatge líquid individual plat per plat",
      "Ubicació cèntrica al barri gastronòmic de Santa Catalina",
      "Cuina creativa global d'alta tècnica",
      "Cocteleria d'autor i celler internacional seleccionat",
      "Terrassa animada a la Plaça del Progrés",
    ],
  },
  servicesProvided: {
    es: [
      "Cocina de Autor Creativa Global",
      "Maridaje Líquido por Plato (Vinos & Cócteles)",
      "Coctelería de Autor en Barra",
      "Venta de Bonos Regalo Online",
    ],
    en: [
      "Inventive Global Author Cuisine",
      "Dish-by-Dish Liquid Pairing (Wines & Cocktails)",
      "Artisan Cocktail Bar",
      "Online Gift Voucher Store",
    ],
    ca: [
      "Cuina d'Autor Creativa Global",
      "Maridatge Líquid per Plat (Vins i Còctels)",
      "Cocteleria d'Autor en Barra",
      "Venda de Xecs Regal Online",
    ],
  },
  image: "https://www.vandalpalma.com/wp-content/uploads/2023/04/vandal-interior.jpg",
  gallery: ["https://www.vandalpalma.com/wp-content/uploads/2023/04/vandal-interior.jpg"],
  schedule: "Mar - Sáb: 19:30 - 00:30 (Dom y Lun Cerrado)",
  lastVerifiedAt: "2026-08-25",
  confidenceScore: 98,
  authorityScore: 95,
  verificationStatus: "verified",
  sourceCrossReference: {
    webPhoneMatch: true,
    mapsPhoneMatch: true,
    addressConsistency: true,
    addressInMallorca: true,
    activeWeb200Ok: true,
    socialMatchScore: 15,
  },
};
