import { writeServiceModule, type NewBusinessSeed } from "./mass-curation-ingest.ts";

export const BATCH_2_SEEDS: NewBusinessSeed[] = [
  {
    id: "heladeria-sa-fabrica-de-gelats-soller",
    slug: "heladeria-sa-fabrica-de-gelats-soller",
    name: "Sa Fàbrica de Gelats de Sóller (1994)",
    category: "gastronomia-catering",
    sectorId: "gastronomia-hosteleria",
    zone: "tramuntana",
    address: "Plaça des Mercat, s/n, 07100 Sóller, Illes Balears",
    coordinates: { lat: 39.7662, lng: 2.7154 },
    rating: 4.8,
    reviewCount: 1120,
    priceRange: "€€",
    phone: "+34 971 63 81 20",
    website: "https://gelatssoller.com",
    email: "info@gelatssoller.com",
    tags: ["zona:tramuntana", "mod:cita-previa", "product:premium"],
    schedule: "Lunes a Domingo: 10:00 - 22:00",
    shortDesc: {
      es: "Fábrica artesanal y heladería en el corazón de Sóller célebre por sus helados y sorbetes de naranjas y limones de la huerta del valle.",
      en: "Artisanal ice cream factory in Sóller famous for fresh citrus sorbets made with oranges and lemons from local valley orchards.",
      ca: "Fàbrica artesanal i gelateria a Sóller famosa pels seus gelats de taronja i llimona de la vall.",
      de: "Traditionelle Eismanufaktur in Sóller, berühmt für frisches Fruchteis aus den sonnengereiften Orangen des Tals.",
    },
    fullDesc: {
      es: "Elaborados artesanalmente con fruta recolectada en los huertos de Sóller y leche fresca de granjas mallorquinas, Sa Fàbrica de Gelats ofrece más de 40 sabores naturales sin conservantes ni colorantes artificiales.",
      en: "Handcrafted using fruit picked directly from Sóller citrus groves and fresh Mallorcan farm milk, offering over 40 all-natural preservative-free flavors.",
      ca: "Elaborats artesanalment amb fruita dels horts de Sóller i llet fresca de granges mallorquines.",
      de: "Handwerklich hergestellt aus Sóller-Orangen und frischer Inselmilch mit über 40 reinen Natursorten ohne künstliche Zusätze.",
    },
    highlights: {
      es: [
        "Helados elaborados con naranjas y limones recolectados en Sóller",
        "Más de 40 sabores artesanales 100% naturales",
        "Terraza en la animada Plaza del Mercado de Sóller",
      ],
      en: [
        "Gelato made with freshly harvested Sóller valley citrus",
        "Over 40 all-natural artisanal flavors",
        "Terrace seating right on Sóller Market Square",
      ],
      ca: [
        "Gelats fets amb taronges i llimones de Sóller",
        "Més de 40 sabors naturals",
        "Terrassa a la Plaça des Mercat",
      ],
      de: [
        "Eis aus erntefrischen Sóller-Zitrusfrüchten",
        "Über 40 rein natürliche Sorten",
        "Terrasse am Marktplatz von Sóller",
      ],
    },
    specialties: {
      es: [
        "Sorbete Natural de Naranja Canoneta de Sóller",
        "Helado de Almendra Mallorquina con Flor de Sal",
        "Sorbete Refrescante de Limón de la Tramuntana",
      ],
      en: [
        "Natural Sóller Canoneta Orange Sorbet",
        "Mallorcan Almond Gelato with Flor de Sal",
        "Fresh Tramuntana Lemon Sorbet",
      ],
      ca: ["Sorbet de Taronja Canoneta de Sóller", "Gelat d'Ametlla Mallorquina", "Sorbet de Llimona de Tramuntana"],
      de: [
        "Natürliches Sóller Canoneta-Orangensorbet",
        "Mallorquinisches Mandeleis mit Flor de Sal",
        "Zitronensorbet aus der Tramuntana",
      ],
    },
    servicesProvided: {
      es: [
        "Venta de helados en cucurucho, tarrina y tarrinas isotérmicas",
        "Suministro a hoteles y restaurantes gastronómicos",
        "Granizados naturales de naranja y limón",
      ],
      en: [
        "Cones, cups, and take-away insulated tubs",
        "Wholesale supply to boutique hotels and fine dining venues",
        "Fresh iced citrus granitas",
      ],
      ca: ["Gelats en cucurutxo i terrina", "Distribució per a restaurants", "Granissats naturals de taronja"],
      de: [
        "Eiswaffeln, Becher und Thermoboxen",
        "Belieferung von Hotels und Restaurants",
        "Frische Zitrussorbets und Granitas",
      ],
    },
    faq: {
      q: {
        es: "¿Dónde se encuentra la heladería en Sóller?",
        en: "Where is the ice cream shop located in Sóller?",
        ca: "On és la gelateria a Sóller?",
        de: "Wo befindet sich die Eisdiele in Sóller?",
      },
      a: {
        es: "Está situada en la Plaça des Mercat, a 2 minutos a pie de la estación del tren histórico de Sóller.",
        en: "Located right on Plaça des Mercat, a 2-minute walk from the historic vintage train station.",
        ca: "És a la Plaça des Mercat, al costat de l'estació del tren.",
        de: "Direkt an der Plaça des Mercat, nur 2 Gehminuten vom historischen Bahnhof entfernt.",
      },
    },
    badge: {
      es: "Fábrica Artesana de Cítricos (Sóller - 1994)",
      en: "Artisanal Citrus Gelato Master (Sóller - 1994)",
      ca: "Fàbrica Artesana de Gelats (Sóller - 1994)",
      de: "Zitrus-Eismanufaktur (Sóller - 1994)",
    },
    confidenceScore: 99,
  },
  {
    id: "megasport-centre-palma",
    slug: "megasport-centre-palma",
    name: "Megasport Centre (Palma)",
    category: "servicios-profesionales",
    sectorId: "servicios-profesionales",
    zone: "palma",
    address: "Carrer de Francesc Vallduví, 1, 07011 Palma, Illes Balears",
    coordinates: { lat: 39.5892, lng: 2.6315 },
    rating: 4.8,
    reviewCount: 2150,
    priceRange: "€€€",
    phone: "+34 971 76 33 33",
    website: "https://megasportcentre.com",
    email: "info@megasportcentre.com",
    tags: ["zona:palma", "mod:cita-previa", "product:premium"],
    schedule: "Lunes a Viernes: 06:00 - 23:00 | Sábados y Domingos: 08:00 - 21:00",
    shortDesc: {
      es: "El mayor complejo deportivo y de fitness de Baleares con más de 25.000 m² de instalaciones, spa termal, pistas de pádel y equipamiento Technogym de última generación.",
      en: "Balearic Islands' largest sports and fitness complex spanning over 25,000 m² with thermal spa, padel courts, and cutting-edge Technogym suites.",
      ca: "El complex esportiu i de fitness més gran de les Balears amb més de 25.000 m², spa termal i pistes de pàdel.",
      de: "Größter Sport- und Fitnesskomplex der Balearen auf über 25.000 m² mit Thermal-Spa, Padel-Plätzen und modernster Technogym-Ausstattung.",
    },
    fullDesc: {
      es: "Megasport Centre es el referente indiscutible del entrenamiento y la salud en Mallorca. Cuenta con salas de musculación vanguardistas, piscinas cubiertas y al aire libre, zona de aguas termales con saunas, pistas de pádel panorámicas y más de 300 clases dirigidas semanales.",
      en: "Megasport is Mallorca's premier sports and wellness destination, featuring Olympic indoor and outdoor pools, expansive thermal spa, panoramic padel courts, and 300+ weekly group fitness classes.",
      ca: "Instal·lacions líders amb piscines cobertes i exteriors, spa termal, pistes de pàdel i més de 300 classes dirigides.",
      de: "Das ultimative Fitness- und Wellnesszentrum Mallorcas mit Innen- und Außenpools, Saunalandschaft, Padel-Courts und über 300 Gruppenkursen pro Woche.",
    },
    highlights: {
      es: [
        "Más de 25.000 m² de instalaciones deportivas de máxima categoría",
        "Circuito termal de spa con saunas, baño turco y piscinas de hidromasaje",
        "Pistas de pádel reglamentarias cubiertas y al aire libre",
      ],
      en: [
        "Over 25,000 m² of championship sports and fitness facilities",
        "Expansive thermal wellness spa with saunas, steam rooms, and whirlpools",
        "Official covered and outdoor panoramic padel courts",
      ],
      ca: [
        "Més de 25.000 m² d'instal·lacions esportives de primera línia",
        "Circuit termal de spa complet",
        "Pistes de pàdel reglamentàries",
      ],
      de: [
        "Über 25.000 m² erstklassige Sport- und Trainingsfläche",
        "Thermal-Spa mit finnischer Sauna, Dampfbad und Hydromassage",
        "Offizielle Padel-Plätze (überdacht und outdoor)",
      ],
    },
    specialties: {
      es: [
        "Entrenamiento Funcional, HIIT y Cross Training",
        "Escuela de Natación y Aquafitness",
        "Academia de Pádel para Niños y Adultos",
      ],
      en: [
        "Functional Training, HIIT, and Olympic Lifting",
        "Swimming Academy and Aqua Fitness",
        "Padel Academy for Juniors and Adults",
      ],
      ca: ["Entrenament Funcional i HIIT", "Escola de Natació", "Acadèmia de Pàdel"],
      de: [
        "Functional Training, HIIT und Krafttraining",
        "Schwimmschule und Aquagymnastik",
        "Padel-Akademie für alle Spielstärken",
      ],
    },
    servicesProvided: {
      es: [
        "Pases diarios (Day Pass) para visitantes y turistas",
        "Membresías mensuales y anuales con acceso total",
        "Centro de medicina deportiva, nutrición y fisioterapia",
      ],
      en: [
        "Day Passes for visiting tourists and yacht crews",
        "Monthly and annual all-inclusive memberships",
        "Sports medicine clinic, nutritionists, and physiotherapy",
      ],
      ca: ["Pases de dia per a visitants", "Membresies amb accés total", "Fisioteràpia i medicina esportiva"],
      de: [
        "Tageskarten (Day Pass) für Urlauber",
        "Monats- und Jahresmitgliedschaften",
        "Sportmedizin, Ernährungsberatung und Physiotherapie",
      ],
    },
    faq: {
      q: {
        es: "¿Se puede acceder con pase de un solo día (Day Pass)?",
        en: "Are Day Passes available for visitors?",
        ca: "Es pot accedir amb passi d'un dia?",
        de: "Gibt es Tageskarten für Feriengäste?",
      },
      a: {
        es: "Sí, disponemos de Day Pass que incluye acceso completo a todas las salas de fitness, clases y spa termal.",
        en: "Yes, Day Passes grant full access to gym floors, group classes, swimming pools, and thermal spa.",
        ca: "Sí, el Day Pass inclou accés total al gimnàs i spa.",
        de: "Ja, die Tageskarte beinhaltet den kompletten Zugang zu Fitnessbereich, Kursen, Pools und Spa.",
      },
    },
    badge: {
      es: "Complejo Deportivo Líder en Baleares (Palma)",
      en: "Premier Balearic Sports & Fitness Complex (Palma)",
      ca: "Complex Esportiu Líder a les Balears (Palma)",
      de: "Führender Sport- und Fitnesskomplex (Palma)",
    },
    confidenceScore: 99,
  },
];

async function main() {
  for (const s of BATCH_2_SEEDS) {
    writeServiceModule(s);
  }
  console.log("✅ Batch 2 complete.");
}

main().catch(console.error);
