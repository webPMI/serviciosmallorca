import type { GeoCoordinates } from "./services/types";

export interface TourStop {
  stopNumber: number;
  businessSlug?: string;
  name: string;
  categoryIcon: string;
  zone: string;
  address: string;
  coordinates: GeoCoordinates;
  durationEstimate: string;
  description: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  highlight: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
}

export interface DiscoveryTour {
  id: string;
  slug: string;
  title: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  subtitle: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  theme: "gastronomia" | "relax_wellness" | "nautica_aventura" | "arte_cultura" | "deporte_naturaleza";
  estimatedTime: string;
  zone: string;
  heroImage: string;
  badge: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  stops: TourStop[];
}

export const DISCOVERY_TOURS: DiscoveryTour[] = [
  {
    id: "ruta-gastro-vinos-raiguer",
    slug: "ruta-gastro-vinos-raiguer",
    title: {
      es: "Ruta Gastro & Vinos Tradicionales del Raiguer",
      en: "Traditional Gastronomy & Wine Route in Raiguer",
      ca: "Ruta Gastro & Vins Tradicionals del Raiguer",
      de: "Traditionelle Gastronomie- & Weinroute im Raiguer",
    },
    subtitle: {
      es: "Un viaje de sabores auténticos: hornos de leña centenarios, cellers históricos y bodegas con cata privada.",
      en: "An authentic culinary journey: historic bakeries, traditional cellers, and boutique wineries.",
      ca: "Un viatge de sabors autèntics: forns centenaris, cellers històrics i cellers vinícoles.",
      de: "Eine authentische Gourmet-Reise: jahrhundertealte Bäckereien, Traditions-Cellers und Weingüter.",
    },
    theme: "gastronomia",
    estimatedTime: "5 - 6 horas",
    zone: "raiguer",
    heroImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    badge: {
      es: "🍷 Experiencia Gastronómica",
      en: "🍷 Gourmet Wine Experience",
      ca: "🍷 Experiència Gastronòmica",
      de: "🍷 Kulinarische Weinroute",
    },
    stops: [
      {
        stopNumber: 1,
        businessSlug: "forn-sant-francesc-inca",
        name: "Forn Sant Francesc (Inca)",
        categoryIcon: "🥖",
        zone: "raiguer",
        address: "Carrer de Sant Francesc, 126, 07300 Inca",
        coordinates: { lat: 39.7212, lng: 2.9114 },
        durationEstimate: "45 min",
        description: {
          es: "Desayuno tradicional con la mejor ensaimada premiada del mundo y pan de masa madre.",
          en: "Traditional breakfast featuring award-winning ensaimadas and artisanal sourdough breads.",
          ca: "Esmorzar tradicional amb l'ensaïmada premiada i pa artesà de xeixa.",
          de: "Traditionelles Frühstück mit der preisgekrönten Ensaimada und Holzofenbrot.",
        },
        highlight: {
          es: "Mejor Ensaimada de Mallorca",
          en: "World Best Ensaimada Winner",
          ca: "Millor Ensaïmada de Mallorca",
          de: "Beste Ensaimada Mallorcas",
        },
      },
      {
        stopNumber: 2,
        businessSlug: "bodega-finca-biniagual",
        name: "Bodega Finca Biniagual (Binissalem)",
        categoryIcon: "🍇",
        zone: "raiguer",
        address: "Camí de Biniagual, s/n, 07350 Binissalem",
        coordinates: { lat: 39.6748, lng: 2.8465 },
        durationEstimate: "2 horas",
        description: {
          es: "Cata exclusiva de vinos ecológicos autóctonos (Mantonegro y Premsal Blanc) en una aldea histórica privada.",
          en: "Exclusive wine tasting of indigenous organic varieties in a private historic hamlet.",
          ca: "Tast exclusiu de vins ecològics autòctons en un llogaret històric.",
          de: "Exklusive Weinprobe einheimischer Bio-Weine in einem privaten historischen Weiler.",
        },
        highlight: {
          es: "Vinos DO Binissalem",
          en: "DO Binissalem Fine Wines",
          ca: "Vins DO Binissalem",
          de: "DO Binissalem Spitzenweine",
        },
      },
      {
        stopNumber: 3,
        businessSlug: "celler-can-ripoll-inca",
        name: "Celler Can Ripoll (Inca)",
        categoryIcon: "🥘",
        zone: "raiguer",
        address: "Carrer Jaume Armengol, 4, 07300 Inca",
        coordinates: { lat: 39.7205, lng: 2.9101 },
        durationEstimate: "2 horas",
        description: {
          es: "Almuerzo de cocina mallorquina bajo arcos góticos y barricas centenarias (Frit, Porcella y Tumbet).",
          en: "Mallorcan authentic lunch beneath historic gothic arches and century-old wine barrels.",
          ca: "Dinar de cuina mallorquina sota arcs gòtics i bótes centenàries.",
          de: "Mittagessen mit authentischer mallorquinischer Küche unter gotischen Bögen.",
        },
        highlight: {
          es: "Celler Declarado Patrimonio Cultural",
          en: "Cultural Heritage Celler",
          ca: "Celler Patrimoni Cultural",
          de: "Kulturgeschützter historischer Weinkeller",
        },
      },
    ],
  },
  {
    id: "dia-nautico-relax-bahia-palma",
    slug: "dia-nautico-relax-bahia-palma",
    title: {
      es: "Día Náutico & Relax en la Bahía de Palma",
      en: "Nautical Day & Pure Wellness in Palma Bay",
      ca: "Dia Nàutic & Relax a la Badia de Palma",
      de: "Yachttag & Pure Wellness in der Bucht von Palma",
    },
    subtitle: {
      es: "Navegación en catamarán privado por calas vírgenes, alta gastronomía marinera y spa de cinco estrellas.",
      en: "Private catamaran cruise along secluded coves, fresh seafood lunch, and five-star spa treatment.",
      ca: "Navegació en catamarà privat, gastronomia marinera i sessió de spa cinc estrelles.",
      de: "Privater Katamaran-Törn zu einsamen Buchten, exzellente Meeresfrüchte und 5-Sterne-Spa.",
    },
    theme: "nautica_aventura",
    estimatedTime: "7 - 8 horas",
    zone: "palma",
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    badge: {
      es: "⛵ Experiencia VIP Mediterránea",
      en: "⛵ VIP Mediterranean Cruise",
      ca: "⛵ Experiència VIP Mediterrània",
      de: "⛵ Exklusives Mittelmeer-Erlebnis",
    },
    stops: [
      {
        stopNumber: 1,
        businessSlug: "oasis-catamaran-palma",
        name: "Oasis Catamarán (Muelle de Palma)",
        categoryIcon: "⛵",
        zone: "palma",
        address: "Paseo Marítimo, Muelle de Golondrinas, 07014 Palma",
        coordinates: { lat: 39.5638, lng: 2.6391 },
        durationEstimate: "4 horas",
        description: {
          es: "Salida en catamarán hacia las reservas marinas de Cala Blava y Cap Enderrocat con paddle surf y snorkel.",
          en: "Catamaran cruise to Cala Blava marine reserve with stand-up paddleboarding and snorkeling.",
          ca: "Sortida en catamarà cap a Cala Blava amb paddle surf i snorkel.",
          de: "Katamaran-Segeltörn zum Meeresschutzgebiet Cala Blava mit Stand-up-Paddling und Schnorcheln.",
        },
        highlight: {
          es: "Aguas Cristalinas & Snorkel",
          en: "Crystal Clear Waters",
          ca: "Aigües Cristal·lines",
          de: "Kristallklares Wasser & Riffe",
        },
      },
      {
        stopNumber: 2,
        businessSlug: "ca-n-eduardo",
        name: "Restaurante Ca n'Eduardo (Lonja de Palma)",
        categoryIcon: "🦞",
        zone: "palma",
        address: "Carrer Contramuelle Mollet, 3, 07012 Palma",
        coordinates: { lat: 39.5671, lng: 2.6438 },
        durationEstimate: "2 horas",
        description: {
          es: "Almuerzo con vistas a la Catedral y pescado salvaje desembarcado diariamente en la Lonja pesquera.",
          en: "Seafood dining overlooking the Cathedral with fresh catch landed directly from the fish market.",
          ca: "Dinar amb vistes a la Seu i peix fresc directe de la Llotja.",
          de: "Mittagessen mit Blick auf die Kathedrale und tagesfrischem Fisch direkt vom Fischmarkt.",
        },
        highlight: {
          es: "Pescado Fresco de Lonja",
          en: "Fresh Daily Catch",
          ca: "Peix Fresc del Dia",
          de: "Tagesfrischer Fang aus Palma",
        },
      },
      {
        stopNumber: 3,
        businessSlug: "arabella-spa-mallorca",
        name: "Arabella Spa (St. Regis Mardavall)",
        categoryIcon: "💆",
        zone: "calvia",
        address: "Carretera Palma-Andratx 19, 07181 Costa d'en Blanes",
        coordinates: { lat: 39.5312, lng: 2.5518 },
        durationEstimate: "2 horas",
        description: {
          es: "Circuito de hidroterapia, sauna mediterránea y masaje descontracturante con sales marinas de Es Trenc.",
          en: "Hydrotherapy circuit, sea salt exfoliating massage, and outdoor swimming relaxation.",
          ca: "Circuit d'hidroteràpia i massatge relaxant amb sals d'Es Trenc.",
          de: "Hydrotherapie, mediterrane Sauna und Tiefenmassage mit Meersalz aus Es Trenc.",
        },
        highlight: {
          es: "El Mayor Spa de Lujo de Baleares",
          en: "Largest Luxury Spa in Balearics",
          ca: "El Spa de Luxe més Gran",
          de: "Größtes Luxus-Spa der Balearen",
        },
      },
    ],
  },
  {
    id: "dia-activo-ciclista-tramuntana",
    slug: "dia-activo-ciclista-tramuntana",
    title: {
      es: "Día Activo Ciclista & Recuperación en Tramuntana",
      en: "Active Cycling & Thermal Recovery in Tramuntana",
      ca: "Dia Actiu Ciclista & Recuperació a Tramuntana",
      de: "Aktiv-Radsport & Thermale Erholung im Tramuntana-Gebirge",
    },
    subtitle: {
      es: "Ruta en bicicleta de carretera de carbono hacia los puertos de montaña y relajación termal en Son Brull.",
      en: "Pro carbon road bike tour through scenic mountain passes followed by thermal recovery at Son Brull.",
      ca: "Ruta ciclista cap a ports de muntanya i recuperació termal a Son Brull.",
      de: "Rennrad-Tour über landschaftlich reizvolle Pässe und regenerative Spa-Behandlung in Son Brull.",
    },
    theme: "deporte_naturaleza",
    estimatedTime: "6 horas",
    zone: "nord",
    heroImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    badge: {
      es: "🚴 Deporte & Bienestar",
      en: "🚴 Sports & Performance",
      ca: "🚴 Esport & Rendiment",
      de: "🚴 Sport & Performance",
    },
    stops: [
      {
        stopNumber: 1,
        businessSlug: "mallorca-cycling-center-playa-muro",
        name: "Mallorca Cycling Center (Playa de Muro)",
        categoryIcon: "🚴",
        zone: "nord",
        address: "Avinguda de s'Albufera, 07458 Playa de Muro",
        coordinates: { lat: 39.8142, lng: 3.1189 },
        durationEstimate: "3.5 horas",
        description: {
          es: "Alquiler de bicicleta de alta gama BMC con GPS y salida hacia Coll de Femenia y Formentor.",
          en: "High-end BMC carbon road bike rental with GPS navigation to Coll de Femenia and Formentor.",
          ca: "Lloguer de bicicleta BMC de gamma alta cap a Coll de Femenia i Formentor.",
          de: "BMC-Carbon-Rennradverleih mit GPS-Routenführung zum Coll de Femenia und Cap Formentor.",
        },
        highlight: {
          es: "Rutas Homologadas UCI",
          en: "UCI Certified Mountain Routes",
          ca: "Rutes Ciclistes Homologades",
          de: "UCI-geprüfte Bergstrecken",
        },
      },
      {
        stopNumber: 2,
        businessSlug: "son-brull-spa-mallorca",
        name: "Son Brull Spa & Wellness (Pollensa)",
        categoryIcon: "🌿",
        zone: "nord",
        address: "Ctra. Palma - Pollença, km 49.8, 07460 Pollença",
        coordinates: { lat: 39.8702, lng: 3.0315 },
        durationEstimate: "2.5 horas",
        description: {
          es: "Masaje deportivo de piernas con aceite de almendras mallorquinas y piscina de agua salada con vistas a los olivares.",
          en: "Leg recovery sports massage with local almond oil and saltwater pool overlooking organic olive groves.",
          ca: "Massatge esportiu de cames amb oli d'ametlla i piscina d'aigua salada.",
          de: "Sportmassage für die Beine mit mallorquinischem Mandelöl und Salzwasserpool mit Blick auf Olivenhaine.",
        },
        highlight: {
          es: "Ingredientes Naturales 100% Mallorquines",
          en: "100% Local Natural Ingredients",
          ca: "Ingredients 100% Mallorquins",
          de: "100% lokale Naturprodukte",
        },
      },
    ],
  },
  {
    id: "ruta-tatuaje-arte-relax-palma-calvia",
    slug: "ruta-tatuaje-arte-relax-palma-calvia",
    title: {
      es: "Ruta de Arte Corporal, Gastronomía & Bienestar en Palma y Calvià",
      en: "Body Art, High-End Dining & Spa Route in Palma & Calvià",
      ca: "Ruta d'Art Corporal, Gastronomia i Benestar a Palma i Calvià",
      de: "Tattoo-Kunst, Gourmet-Dinner & Wellness-Route in Palma & Calvià",
    },
    subtitle: {
      es: "Combina una sesión de tatuaje fine-line con la mejor gastronomía de lonja y una tarde de relajación termal en Son Vida.",
      en: "Pair a bespoke fine-line tattoo session with fresh seafood tapas and luxury thermal spa relaxation in Son Vida.",
      ca: "Combina una sessió de tatuatge fine-line amb tapes fresques de llotja i relax a Son Vida.",
      de: "Kombinieren Sie ein feines Fine-Line-Tattoo mit Live-Cooking an der Marmortheke und exklusiver Spa-Erholung.",
    },
    theme: "arte_cultura",
    estimatedTime: "6 - 7 horas",
    zone: "palma",
    heroImage: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=80",
    badge: {
      es: "🎨 Arte & Experiencia Exclusiva",
      en: "🎨 Art & Luxury Experience",
      ca: "🎨 Art i Experiència Exclusiva",
      de: "🎨 Kunst & Exklusiv-Erlebnis",
    },
    stops: [
      {
        stopNumber: 1,
        businessSlug: "good-luck-tattoo-mallorca",
        name: "Good Luck Tattoo Mallorca (Paseo Mallorca)",
        categoryIcon: "✒️",
        zone: "palma",
        address: "Passeig de Mallorca, 18, 07012 Palma",
        coordinates: { lat: 39.5721, lng: 2.6438 },
        durationEstimate: "2.5 horas",
        description: {
          es: "Sesión personalizada de tatuaje fine-line o realismo botánico en un estudio con máximos estándares sanitarios.",
          en: "Custom fine-line botanical tattoo session in a studio adhering to peak clinical hygiene standards.",
          ca: "Sessió personalitzada de tatuatge fine-line o microrealisme a Passeig de Mallorca.",
          de: "Individuelle Fine-Line-Tattoo-Session in einem Studio mit höchsten Hygienestandards.",
        },
        highlight: {
          es: "Puntuación 5.0 en Google Maps",
          en: "5.0 Perfect Rating on Google Maps",
          ca: "Puntuació 5.0 a Google Maps",
          de: "5,0 Spitzenbewertung bei Google Maps",
        },
      },
      {
        stopNumber: 2,
        businessSlug: "el-camino-palma",
        name: "El Camino Palma (Can Brondo)",
        categoryIcon: "🍤",
        zone: "palma",
        address: "Carrer de Can Brondo, 4, 07001 Palma",
        coordinates: { lat: 39.5702, lng: 2.6489 },
        durationEstimate: "1.5 horas",
        description: {
          es: "Comida gourmet en la barra de mármol: gamba roja de Sóller y chipirones salteados con sobrasada.",
          en: "High-energy counter dining: fresh Sóller red prawns and sautéed squid with artisanal sobrasada.",
          ca: "Dinar gurmet a la barra: gamba vermella de Sóller i calamarsons saltejats.",
          de: "Gourmet-Lunch an der Marmortheke: Sóller-Garnelen und frische Meeresfrüchte-Tapas.",
        },
        highlight: {
          es: "Cocina Abierta en Directo",
          en: "Live Open Kitchen Experience",
          ca: "Cuina Oberta en Directe",
          de: "Live-Showküche",
        },
      },
      {
        stopNumber: 3,
        businessSlug: "arabella-spa-mallorca",
        name: "Arabella Spa (St. Regis Mardavall / Son Vida)",
        categoryIcon: "✨",
        zone: "palma",
        address: "Carrer Raixa, 2, Son Vida, 07013 Palma",
        coordinates: { lat: 39.5934, lng: 2.6021 },
        durationEstimate: "2 horas",
        description: {
          es: "Circuito hidrotermal, sauna finlandesa y rituales de relajación aromática balear.",
          en: "Hydrothermal circuit, Finnish saunas, and Mediterranean aromatherapy relaxation rituals.",
          ca: "Circuit hidrotermal, saunes i rituals de relaxació aromàtica balear.",
          de: "Hydrothermale Pools, finnische Sauna und mediterrane Aroma-Entspannungsrituale.",
        },
        highlight: {
          es: "Circuito Termal de Lujo",
          en: "Luxury Thermal Circuit",
          ca: "Circuit Termal de Luxe",
          de: "Exklusiver Thermalbereich",
        },
      },
    ],
  },
];

export function getDiscoveryTours(): DiscoveryTour[] {
  return DISCOVERY_TOURS;
}

export function getDiscoveryTourBySlug(slug: string): DiscoveryTour | undefined {
  return DISCOVERY_TOURS.find((t) => t.slug === slug || t.id === slug);
}
