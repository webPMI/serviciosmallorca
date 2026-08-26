import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVICES_DIR = path.resolve(__dirname, "../src/data/services");

// Mapping of German translations per business slug
const GERMAN_TRANSLATIONS: Record<
  string,
  {
    shortDescription: string;
    fullDescription: string;
    highlights: string[];
    servicesProvided: string[];
    specialties?: string[];
    founderStory?: string;
    pricingNotes?: string;
    teamRole?: string;
  }
> = {
  "box-tattoo-piercing": {
    shortDescription:
      "Zentrales Studio in der Carrer Jaume II, spezialisiert auf individuelle Tattoos, Cover-ups und professionelle Piercings.",
    fullDescription:
      "Box Tattoo Piercing befindet sich in der Fußgängerzone der Carrer de Jaume II in Palma. Geboten werden umfassende Beratung für anspruchsvolle Cover-ups alter Tattoos, traditionelle Stile sowie hygienische Körperpiercings mit einer großen Auswahl an medizinischem Schmuck.",
    highlights: [
      "Kostenlose Vor-Ort-Beratung und unverbindlicher Kostenvoranschlag",
      "Erstklassige Lage in der Fußgängerzone Carrer Jaume II im Zentrum von Palma",
      "Anerkannte Spezialisten für komplexe Cover-ups alter Tattoos",
      "Piercings mit medizinisch sterilisiertem Titan und Chirurgenstahl",
    ],
    servicesProvided: [
      "Cover-up & Neugestaltung alter Tattoos",
      "Anatomische & Gesichts-Piercings",
      "Fine Line & Lettering Tattoos",
      "Traditional American & Farbtattoos",
      "Wechsel & Verkauf von medizinischem Schmuck",
    ],
    pricingNotes: "Persönliche Beratung und sofortiger Kostenvoranschlag im Stadtzentrum von Palma.",
    teamRole: "Professionelle Tätowierer & Piercer",
  },
  "good-luck-tattoo-mallorca": {
    shortDescription:
      "Hervorragend bewertetes Tattoo-Studio im Zentrum von Palma, Experten für Realismus, Fine Line, Blackwork und Traditional.",
    fullDescription:
      "Direkt am Passeig Mallorca und der exklusiven Avinguda de Jaume III gelegen, zählt Good Luck Tattoo mit einer makellosen 5,0-Sterne-Bewertung auf Google zu den renommiertesten Studios der Balearen. Ein erstklassiges Team aus residenten und europäischen Gastkünstlern bietet persönliche Beratung, digitale Entwurfsplanung und sterile Behandlungskabinen nach Krankenhausstandard.",
    highlights: [
      "Perfekte Bewertung von 5,0 Sternen bei über 380 Google-Maps-Rezensionen",
      "Top-Lage im Zentrum von Palma nahe Passeig Mallorca und Jaume III",
      "Hygienische Einzelkabinen mit Klasse-B-Autoklaven und EU-REACH-konformen veganen Farben",
      "Mehrsprachige Beratung auf Deutsch, Englisch, Spanisch und Katalanisch",
    ],
    servicesProvided: [
      "Realistische Tattoos & Porträts",
      "Fine Line & Mikro-Tattoos",
      "Traditional & Blackwork Tattoos",
      "Cover-ups & Tattoo-Restaurierung",
    ],
    specialties: [
      "Black & Grey Mikrorealismus & Schattierungen",
      "Botanisches & minimalistisches Fine Line",
      "Traditionelles & Neotraditionelles Tattoo",
      "Individuelle Entwürfe nach Maß & Cover-ups",
    ],
    pricingNotes: "Verbindliche Festpreise vor der Sitzung mit 100 % veganen, EU-REACH-zertifizierten Farben.",
    teamRole: "Tattoo-Künstler & Designer",
  },
  "kuyen-art-tattoo": {
    shortDescription:
      "Tattoo- und Kunststudio in Palma, spezialisiert auf Realismus, Black & Grey, Dotwork und individuelle Kreationen.",
    fullDescription:
      "Kuyen Art Tattoo in Palma steht für anspruchsvolles Tätowieren mit künstlerischer Signatur. Das Studio überzeugt durch Detailtiefe im Realismus, feine Schattierungen und maßgeschneiderte Motive in einer kreativen und hygienischen Atmosphäre.",
    highlights: [
      "Hervorragende Kundenbewertungen für künstlerische Präzision",
      "Spezialisiert auf realistische Porträts und Schattierungen",
      "Strenge Hygiene- und Sterilisationsstandards",
      "Persönliche Betreuung vom ersten Entwurf bis zur Nachsorge",
    ],
    servicesProvided: [
      "Realismus & Black and Grey Tattoos",
      "Individuelles Design & Großprojekte",
      "Dotwork & Geometrische Tattoos",
      "Tattoo-Pflegeberatung",
    ],
    specialties: ["Realismus & Porträts", "Black and Grey", "Individuelles Design", "Cover-up"],
    pricingNotes: "Transparente Preisgestaltung nach Projektumfang und Motivgröße.",
    teamRole: "Künstler & Master Tätowierer",
  },
  "macatela-tattoo": {
    shortDescription:
      "Kreatives Tattoo-Studio in Palma mit Spezialisierung auf Neotraditional, Blackwork, Anime und ausdrucksstarke Farbmotive.",
    fullDescription:
      "Macatela Tattoo Palma verbindet lebendige Farben, saubere Linienführung und zeitgenössische Designs. Bekannt für Neotraditional, Anime-Tattoos und dynamische Farbkompositionen in entspannter Studioatmosphäre.",
    highlights: [
      "Einzigartiger Autorenstil mit lebendigen Farbpaletten",
      "Fokus auf Neotraditional, Anime und Pop-Culture Art",
      "Höchste Hygienestandards mit REACH-konformen Pigmenten",
      "Hohe Zufriedenheit bei Einheimischen und Inselbesuchern",
    ],
    servicesProvided: [
      "Neotraditional Tattoos",
      "Anime- & Pop-Kultur-Tattoos",
      "Farbtätowierungen & Blackwork",
      "Individuelle Motivberatung",
    ],
    specialties: ["Neotraditional", "Anime / Manga Art", "Farbtattoos", "Blackwork"],
    pricingNotes: "Kostenvoranschlag nach individuellem Entwurf und Vorbesprechung.",
    teamRole: "Resident Tätowierer",
  },
  "urban-soul-tattoo": {
    shortDescription:
      "Bekanntes Tattoo-Studio in Palma mit langjähriger Tradition, vielseitigen residenten Künstlern und großer Stilauswahl.",
    fullDescription:
      "Urban Soul Tattoo ist eine feste Größe der mallorquinischen Tattooszenen. Zentral in Palma gelegen, bietet das Team alle klassischen und modernen Stilrichtungen – von feinen Linien bis zu großflächigen Rücken- und Armprojekten.",
    highlights: [
      "Eines der etabliertesten Studios im Zentrum von Palma",
      "Vielseitiges Künstlerteam für alle Stilrichtungen",
      "Zertifizierte Hygienepraxis und geprüfte Materialien",
      "Zahlreiche Stammkunden unter Residenten und internationalen Gästen",
    ],
    servicesProvided: [
      "Fine Line & Schriftzüge (Lettering)",
      "Traditional & Neo-Traditional Tattoos",
      "Realismus & Schattierungen",
      "Piercings & Schmuckverkauf",
    ],
    specialties: ["Fine Line & Lettering", "Old School / Traditional", "Realismus", "Piercings"],
    pricingNotes: "Preise richten sich nach Motivgröße, Detailgrad und Zeitaufwand.",
    teamRole: "Tattoo Artists & Body Piercer",
  },
  "adrian-quetglas": {
    shortDescription:
      "Michelin-Stern-Restaurant von Chefkoch Adrián Quetglas am Passeig Mallorca – mediterrane Spitzenküche mit internationalen Akzenten.",
    fullDescription:
      "Das Restaurant Adrián Quetglas am eleganten Passeig Mallorca in Palma verbindet mallorquinische Aromen mit Einflüssen internationaler Haute Cuisine. Ausgezeichnet mit einem Michelin-Stern, bietet Chefkoch Adrián Quetglas innovative Degustationsmenüs auf höchstem kulinarischem Niveau.",
    highlights: [
      "Ausgezeichnet mit 1 Michelin-Stern und Repsol-Sonnen",
      "Exklusive Lage am Paseo Mallorca im Zentrum von Palma",
      "Kreative Degustationsmenüs mit saisonalen Inselprodukten",
      "Erstklassige Weinbegleitung mit balearischen und internationalen Tropfen",
    ],
    servicesProvided: [
      "Michelin-Stern-Degustationsmenüs",
      "Saisonale Gourmet-Mittagsmenüs",
      "Exklusive Weinbegleitung (Sommelier-Service)",
      "Reservierungen für besondere Anlässe und Firmenevents",
    ],
    specialties: [
      "Mediterrane Autorenküche",
      "Degustationsmenüs mit Weinbegleitung",
      "Saisonale Meeres- und Fleischkreationen",
    ],
    founderStory:
      "Chefkoch Adrián Quetglas sammelte internationale Erfahrung in renommierten Küchen Moskaus und Westeuropas, bevor er nach Mallorca zurückkehrte, um seine Vision einer anspruchsvollen, zugänglichen Haute Cuisine zu verwirklichen.",
    pricingNotes: "Degustationsmenüs mit optionaler Weinbegleitung. Vorabreservierung erforderlich.",
    teamRole: "Sternekoch & Inhaber",
  },
  "ca-n-eduardo": {
    shortDescription:
      "Traditionsreiches Fisch- und Meeresfrüchterestaurant am Hafen von Palma mit spektakulärem Blick auf die Kathedrale La Seu.",
    fullDescription:
      "Seit über 75 Jahren ist Ca n'Eduardo die führende Adresse für fangfrischen Fisch und Meeresfrüchte direkt an der Fischbörse (Llotja) im Hafen von Palma. Gäste genießen maritime Klassiker, Paellas und Calderetas mit herrlichem Panoramablick auf das Meer und die Kathedrale.",
    highlights: [
      "Über 75 Jahre Tradition direkt an der Fischauktionshalle im Hafen von Palma",
      "Spektakuläre Aussichtsterrasse auf die Kathedrale La Seu und die Bucht",
      "Fangfrischer Edelfisch, Hummer und Meeresfrüchte aus mallorquinischen Gewässern",
      "Perfekt für Geschäftsessen, Familienfeiern und maritime Feinschmecker",
    ],
    servicesProvided: [
      "Fangfrischer Fisch & Meeresfrüchte nach Tagesangebot",
      "Mallorquinische Paellas & Hummereintöpfe (Caldereta)",
      "Panoramaterrasse mit Hafenblick",
      "Veranstaltungen und private Feierlichkeiten",
    ],
    specialties: [
      "Fangfrischer Wildfisch (Dorade, Wolfsbarsch, Drachenkopf)",
      "Mallorquinische Caldereta de Bogavante",
      "Rote Sóller-Garnelen",
      "Klassische Meeresfrüchte-Paella",
    ],
    founderStory:
      "Gegründet 1943 direkt an der Fischbörse, wird Ca n'Eduardo seit Generationen für seine kompromisslose Frische und familiäre Gastfreundschaft geschätzt.",
    pricingNotes: "Frischer Fisch nach Tagesgewicht. Tischreservierung mit Kathedralenblick empfohlen.",
    teamRole: "Küchenchef & Restaurantleitung",
  },
  "ca-na-toneta": {
    shortDescription:
      "Idyllisches Restaurant am Fuße der Tramuntana in Caimari – authentische, nachhaltige Inselküche aus eigenem biologischem Anbau.",
    fullDescription:
      "Geführt von den Schwestern Maria und Teresa Solivellas im malerischen Bergdorf Caimari, feiert Ca Na Toneta die Essenz Mallorcas. Serviert wird ein saisonales Überraschungsmenü aus lokalen Bio-Zutaten, alten Inselgetreidesorten und Erntefrüchten des eigenen Gemüsegartens.",
    highlights: [
      "Pioniere der nachhaltigen 'Kilómetro Cero'-Slow-Food-Bewegung auf Mallorca",
      "Malerische Innenhof-Terrasse im ruhigen Dorf Caimari am Fuße des Gebirges",
      "Biologische Zutaten aus eigenem Anbau und von ausgewählten Kleinbauern",
      "Ausgezeichnet mit dem Grünen Michelin-Stern für Nachhaltigkeit",
    ],
    servicesProvided: [
      "Saisonales Slow-Food-Degustationsmenü",
      "Naturweine und handwerkliche balearische Weinauswahl",
      "Romantisches Speisen im Innenhofgarten",
      "Kulinarische Workshops und saisonale Events",
    ],
    specialties: [
      "Saisonale mallorquinische Naturküche",
      "Traditionelle Inselbackwaren & Cocas",
      "Gemüse- und Wildkräuterkreationen",
      "Bio-Weine aus Mallorca",
    ],
    founderStory:
      "Maria und Teresa Solivellas verwandelten das Haus ihrer Familie in Caimari in einen Zufluchtsort für unverfälschte mallorquinische Esskultur und nachhaltige Landwirtschaft.",
    pricingNotes: "Festes saisonales Degustationsmenü. Vorabreservierung dringend empfohlen.",
    teamRole: "Chefköchin & Slow-Food-Botschafterin",
  },
  "dins-santi-taura": {
    shortDescription:
      "Michelin-Stern-Erlebnis von Santi Taura in Palma – historische mallorquinische Rezepturen modern und meisterhaft interpretiert.",
    fullDescription:
      "DINS Santi Taura im Boutique-Hotel El Llorenç Parc de la Mar in Palma nimmt Gäste mit auf eine gastronomische Zeitreise durch die Kulturgeschichte der Balearen. Chefkoch Santi Taura interpretiert historische Rezepturen mit moderner Präzision und tiefem Respekt vor dem Inselerbe.",
    highlights: [
      "Ausgezeichnet mit 1 Michelin-Stern und 2 Repsol-Sonnen",
      "Exklusive Lage im Luxushotel El Llorenç im historischen Viertel Calatrava",
      "Intimes Tresen-Erlebnis mit Blick auf die Live-Zubereitung",
      "Tiefgründige gastronomische Hommage an die Kulturgeschichte Mallorcas",
    ],
    servicesProvided: [
      "Historisches Gourmet-Degustationsmenü",
      "Chef's Table Live-Erlebnis an der Küchentheke",
      "Sommelier-Weinbegleitung mit seltenen balearischen Tropfen",
      "Privates Gourmet-Dining für kleine Gruppen",
    ],
    specialties: [
      "Historische Inselgastronomie",
      "Mallorquinische Spezialitäten wie Porcella & Panades Gourmet",
      "Degustationsmenü DINS",
    ],
    founderStory:
      "Santi Taura widmet seit über zwei Jahrzehnten seine Leidenschaft der Erforschung vergessener mallorquinischer Rezepte und lokaler Kulturtraditionen.",
    pricingNotes: "Ausschließliches Degustationsmenü mit Vorabreservierung über die Website.",
    teamRole: "Master Chef & Inhaber",
  },
  "el-camino-palma": {
    shortDescription:
      "Ikonische Gourmet-Tapasbar mit langer beleuchteter Marmortheke im Herzen von Palma – Frischeprodukte live zubereitet.",
    fullDescription:
      "El Camino in der Carrer de Can Brondo gilt als eine der lebendigsten kulinarischen Adressen Palmas. An der geschwungenen Marmortheke beobachten Gäste die Köche bei der Zubereitung feinster Tapas aus marktfrischen Tageszutaten, Sóller-Garnelen und handwerklicher Sobrassada.",
    highlights: [
      "Spektakuläre beleuchtete Marmortheke mit offener Schauküche",
      "Beste Qualität an fangfrischen Meeresfrüchten und regionalem Gemüse",
      "Lebendige, stilvolle Atmosphäre im Zentrum von Palma",
      "Internationale Spitzenbewertungen in Gastronomieführern",
    ],
    servicesProvided: [
      "Gourmet-Tapas an der Schautheke",
      "Tagesfang aus den Fischauktionen der Balearen",
      "Ausgewählte spanische und mallorquinische Weinkarte",
      "Exklusives Ambiente für Paare und Feinschmecker",
    ],
    specialties: [
      "Rote Sóller-Garnelen mit Meersalz",
      "Baby-Calamari mit Sobrassada und Honig",
      "Gegrillte Artischocken",
      "Hausgemachte Kroketten & Jamón Ibérico",
    ],
    pricingNotes: "Tagesaktuelle Preise nach Marktlage. Reservierung über das Online-Portal empfohlen.",
    teamRole: "Küchenchef & Team",
  },
  "vandal-palma": {
    shortDescription:
      "Avantgardistisches Restaurant in Santa Catalina – kreative Fusionsküche, aufregende Geschmackskombinationen und Signature Cocktails.",
    fullDescription:
      "Vandal Palma im Szeneviertel Santa Catalina bietet ein multisensorisches Restauranterlebnis. Chefkoch Bernabé Caravotta kombiniert lateinamerikanische, asiatische und mediterrane Einflüsse zu gewagten Gerichten, perfekt abgestimmt auf eigens kreierte Drinks und Weine.",
    highlights: [
      "Kreativ-Fusionsküche mit internationalen Geschmacksexplosionen",
      "Perfektes Food- & Cocktail-Pairing zu jedem Gang",
      "Urbane, kosmopolitische Atmosphäre im Trendviertel Santa Catalina",
      "Empfohlen von führenden Food-Kritikern und Guide Michelin",
    ],
    servicesProvided: [
      "Kreatives Fusions-Dinner",
      "Cocktail- und Wein-Pairing",
      "Tasting-Menüs für Feinschmecker",
      "Gruppen-Events im trendigen Ambiente",
    ],
    specialties: [
      "Internationale Fusionsküche",
      "Cocktail- & Wine-Pairing",
      "Kreative Ceviches & Tatar-Variationen",
      "Dessert-Kreationen",
    ],
    pricingNotes: "Menü à la carte oder abgestimmtes Degustationsmenü mit Cocktail-Pairing.",
    teamRole: "Chefkoch & Co-Founder",
  },
  "engel-volkers-mallorca": {
    shortDescription:
      "Führendes Luxus-Immobilienunternehmen auf Mallorca für Kauf, Verkauf und Langzeitmiete exklusiver Villen, Fincas und Penthouses.",
    fullDescription:
      "Engel & Völkers ist seit über 30 Jahren die führende Immobilienmarke auf Mallorca. Mit über 18 Büros über die gesamte Insel verteilt – von Son Vida und Andratx bis nach Pollença und Santanyí – bietet das mehrsprachige Expertenteam Zugang zum exklusivsten Portfolio an Luxusanwesen.",
    highlights: [
      "Über 18 Beratungsbüros auf ganz Mallorca mit flächendeckender Marktpräsenz",
      "Marktführer im Luxussegment für Villen, Fincas und Penthouses",
      "Mehrsprachige Beratung auf Deutsch, Englisch und Spanisch",
      "Umfassende rechtliche, steuerliche und notarielle Begleitung beim Immobilienkauf",
    ],
    servicesProvided: [
      "Verkauf von Luxusvillen, Landgütern & Neubauprojekten",
      "Immobilienbewertung & Marktwertanalysen",
      "Langzeitvermietung exklusiver Anwesen",
      "Investment- & Portfolioberatung für internationale Käufer",
    ],
    specialties: [
      "Luxusvillen in Son Vida, Andratx & Portals",
      "Historische Fincas & Landhäuser",
      "Penthouses in der Altstadt von Palma",
      "Immobilieninvestments & Neubau",
    ],
    founderStory:
      "Seit Eröffnung des ersten Büros in Palma hat Engel & Völkers maßgeblich den internationalen Luxus-Immobilienmarkt auf Mallorca geprägt und steht für Diskretion, Kompetenz und exzellenten Kundenservice.",
    pricingNotes: "Individuelle Beratung und marktgerechte Wertermittlung für Verkäufer und Käufer.",
    teamRole: "Geschäftsführung & Immobilienberater",
  },
  "first-mallorca-real-estate": {
    shortDescription:
      "Renommierte Premium-Immobilienagentur auf Mallorca mit Sitz in Puerto Portals – Spezialisten für exklusive Wohnimmobilien.",
    fullDescription:
      "First Mallorca gehört seit über zwei Jahrzehnten zu den vertrauenswürdigsten Immobilienagenturen der Insel. Mit Hauptsitz in Puerto Portals und weiteren Filialen berät das Team anspruchsvolle internationale Käufer bei der Suche nach ihrer Traumimmobilie auf Mallorca.",
    highlights: [
      "Über 25 Jahre Erfahrung im gehobenen Immobiliensegment auf Mallorca",
      "Zentrale Repräsentanz im Luxushafen Puerto Portals",
      "Hochqualifiziertes, mehrsprachiges Team mit starker deutscher Ausrichtung",
      "Exklusives Portfolio an erstklassigen Meerblick-Villen und Fincas",
    ],
    servicesProvided: [
      "Kauf- & Verkaufsvermittlung exklusiver Villen und Apartments",
      "Professionelle Immobilienbewertung",
      "Beratung bei Sanierung und Projektentwicklung",
      "After-Sales-Betreuung und Hausverwaltungsservice",
    ],
    specialties: [
      "Meerblick-Villen im Südwesten (Calvià, Andratx)",
      "Exklusive Penthouses & Apartments",
      "Traditionelle Fincas in der Tramuntana",
      "Grundstücke mit Baugenehmigung",
    ],
    pricingNotes: "Persönliche Beratung und diskrete Betreuung vermögender Privatkunden.",
    teamRole: "Senior Immobilienberater",
  },
  "viveros-can-juanito": {
    shortDescription:
      "Traditionelle Gärtnerei und Landschaftsbau-Zentrum in Son Ferriol (Palma) – mediterrane Pflanzen, Palmen und Gartenpflege.",
    fullDescription:
      "Can Juanito ist eines der ältesten und angesehensten Gartencenter Mallorcas. Auf einem weitläufigen Areal nahe Palma bietet der Familienbetrieb eine riesige Auswahl an Olivenbäumen, Palmen, Zitruspflanzen und Gartenbedarf sowie professionelle Landschaftsarchitektur für Fincas und Villen.",
    highlights: [
      "Traditionsbetrieb mit über 50 Jahren Erfahrung im mediterranen Gartenbau",
      "Riesiges Pflanzensortiment: Jahrhundertealte Olivenbäume, Palmen und Zitrusbäume",
      "Komplette Planung, Bepflanzung und Pflege von Gartenanlagen und Fincas",
      "Automatische Bewässerungssysteme und biologische Schädlingsbekämpfung",
    ],
    servicesProvided: [
      "Garten- & Landschaftsplanung für Fincas und Villen",
      "Verkauf von mediterranen Großbäumen und Zierpflanzen",
      "Installation von automatischen Bewässerungsanlagen",
      "Fachgerechte Baumpflege und Palmenschnitt",
    ],
    specialties: [
      "Mediterrane Gartengestaltung",
      "Solitär-Olivenbäume & Palmen",
      "Automatische Tröpfchenbewässerung",
      "Pflanzenschutz & Bodengesundheit",
    ],
    pricingNotes: "Pflanzenverkauf ab Hof sowie Vor-Ort-Gartenberatung mit individuellem Angebot.",
    teamRole: "Agraringenieur & Gartenbauexperte",
  },
  "roig-premium-transfers": {
    shortDescription:
      "Führender Chauffeur- und VIP-Mobilitätsdienst auf Mallorca – High-End-Flughafentransfers und Luxusautovermietung.",
    fullDescription:
      "Roig Premium bietet erstklassige Mobilitätslösungen für anspruchsvolle Reisende auf Mallorca. Von diskreten Chauffeurdiensten mit Mercedes S-Klasse und V-Klasse über VIP-Transfers ab dem Flughafen Palma bis hin zur Anmietung von Luxusfahrzeugen und Sportwagen.",
    highlights: [
      "Mehr als 70 Jahre Erfahrung im Mobilitäts- und Transportsektor auf Mallorca",
      "Moderne Premium-Flotte (Mercedes S-Klasse, V-Klasse, E-Klasse und Range Rover)",
      "Pünktlicher 24/7-Flughafentransfer mit persönlichem Meet & Greet",
      "Zweisprachige, diskrete und ortskundige Berufschauffeure",
    ],
    servicesProvided: [
      "VIP-Flughafentransfers Palma de Mallorca (PMI)",
      "Privatchauffeur auf Stunden- oder Tagesbasis",
      "Exklusiver Transport für Hochzeiten, Events und Yachten",
      "Vermietung von Premium- und Luxusfahrzeugen",
    ],
    specialties: [
      "VIP Airport Transfers",
      "Privatchauffeur-Service",
      "Mercedes-Benz Flotte",
      "Event- & Hochzeitstransfers",
    ],
    founderStory:
      "Seit der Gründung im Jahr 1953 durch die Familie Roig hat sich das Unternehmen vom lokalen Transportbetrieb zum führenden Mobilitätspartner für Luxushotels, Yachten und Privatkunden auf Mallorca entwickelt.",
    pricingNotes: "Transparente Festpreise für Flughafentransfers sowie stundenweise Buchung.",
    teamRole: "Flottenleiter & VIP Chauffeur Service",
  },
  "mallorca-global-charter": {
    shortDescription:
      "Exklusiver Yachtcharter-Dienstleister in Puerto Portals und Palma – Luxusmotoryachten, Segelkatamarane und Eventcharter.",
    fullDescription:
      "Mallorca Global Charter bietet maßgeschneiderte Chartererlebnisse auf den Balearen. Mit einer handverlesenen Flotte modernster Yachten, erfahrenen Kapitänen und individuellem Bordservice werden Traumtörns zu den schönsten Buchten Mallorcas, Ibizas und Formenteras wahr.",
    highlights: [
      "Große Auswahl an modernen Motoryachten und Katamaranen (12 bis 35 Meter)",
      "Liegeplätze in renommierten Marinas wie Puerto Portals und Club de Mar Palma",
      "Kompletter Service inklusive Bord-Catering, Wassersport-Equipment und Skipper",
      "Individuelle Routenplanung für Tagesausflüge und Wochentörns",
    ],
    servicesProvided: [
      "Tages- und Wochen-Yachtcharter mit Crew",
      "Katamaran-Ausflüge für private Feiern und Firmenveranstaltungen",
      "Vermietung von Wasserspielzeugen (Seabob, E-Foil, Stand-Up Paddle)",
      "VIP-Catering und Sommelier-Service an Bord",
    ],
    specialties: [
      "Luxus-Motoryachten",
      "Katamaran-Charter",
      "Privattörns nach Cabrera & Dragonera",
      "Wassersport & Seabob-Verleih",
    ],
    pricingNotes: "Tagescharterpreise inklusive Basisausstattung; Treibstoff nach Verbrauch.",
    teamRole: "Charter Broker & Kapitän",
  },
  "oasis-catamaran-palma": {
    shortDescription:
      "Stilvoller Segelkatamaran in Palma für exklusive Privattörns und stilvolle Gruppen-Ausflüge in die Bucht von Palma.",
    fullDescription:
      "Oasis Catamarán bietet ein erstklassiges Segelerlebnis in den Gewässern Mallorcas. Der geräumige, elegante Katamaran bietet viel Platz zum Sonnenbaden, Schnorcheln in türkisfarbenen Buchten und Genuss von frisch zubereitetem Grill-Catering an Bord.",
    highlights: [
      "Ausgezeichnete Bewertungen für Service, Sauberkeit und Atmosphäre",
      "Großzügiges Sonnendeck mit bequemen Polstern und Schattenbereichen",
      "Schnorchel-Equipment und Stand-Up-Paddleboards inklusive",
      "Hochwertiges Catering mit mediterranen Spezialitäten und Bar-Service",
    ],
    servicesProvided: [
      "Exklusive Privatcharter für Geburtstage, Hochzeiten und Firmen",
      "Halbtages- und Tagestörns in die schönsten Buchten der Palma-Bucht",
      "Sunset-Cruises mit Live-Musik und Cocktail-Begleitung",
      "Bordküche mit frischem BBQ und vegetarischen Optionen",
    ],
    specialties: [
      "Segelkatamaran-Ausflüge",
      "Sunset Sails in der Bucht von Palma",
      "BBQ-Catering an Bord",
      "Private Feiern & Hochzeiten auf See",
    ],
    pricingNotes: "Pauschalen für Privatcharter inklusive Crew, Treibstoff und Wassersportgeräte.",
    teamRole: "Kapitän & Event-Koordinator",
  },
  "duran-palma": {
    shortDescription:
      "Führender Anbieter für Baustoffe, hochwertige Fliesen, Designbäder und Komplettsanierungen auf Mallorca seit 1921.",
    fullDescription:
      "Duran ist seit über einem Jahrhundert der Maßstab für Bau, Architektur und Inneneinrichtung auf Mallorca. Mit modernen Showrooms in Palma, Calvià und Alcúdia bietet Duran eine unvergleichliche Auswahl an Feinsteinzeug, Santanyí-Naturstein, Designer-Bädern, Küchen und innovativer Haustechnik.",
    highlights: [
      "Mehr als 100 Jahre Tradition und Marktführerschaft im Bausektor der Balearen",
      "Große Erlebnis-Showrooms in Palma, Calvià und Alcúdia",
      "Exklusive Vertretung internationaler Top-Marken für Fliesen, Bäder und Küchen",
      "Fachberatung für Architekten, Bauherren, Bauträger und private Sanierer",
    ],
    servicesProvided: [
      "Fachberatung für Neubau- und Renovierungsprojekte",
      "Lieferung von Premium-Fliesen, Parkett und Naturstein",
      "Planung und Ausstattung kompletter Luxusbäder und Küchen",
      "Energieeffiziente Haustechnik, Fußbodenheizung und Sanitärsysteme",
    ],
    specialties: [
      "Designbäder & Luxuskeramik",
      "Naturstein & Feinsteinzeug für Innen- und Außenbereiche",
      "Maßgeschneiderte Küchenplanung",
      "Klimatisierung & Sanitärinstallationen",
    ],
    founderStory:
      "Gegründet im Jahr 1921 als Familienunternehmen in Palma, hat Duran über vier Generationen hinweg die architektonische Entwicklung und Sanierungskultur Mallorcas entscheidend mitgestaltet.",
    pricingNotes: "Kostenfreie Fachberatung im Showroom; detaillierte Leistungsangebote für Bauprojekte.",
    teamRole: "Projektberater & Innenarchitekt",
  },
  "bufete-frau-abogados": {
    shortDescription:
      "Führende internationale Anwaltskanzlei auf Mallorca mit Büros in Palma, Portals und Sóller – Spezialisten für Immobilien- und Steuerrecht.",
    fullDescription:
      "Bufete Frau ist eine mehrsprachige Anwalts- und Steuerkanzlei mit über 25 Jahren Erfahrung in der Begleitung internationaler Immobilienkäufer, Investoren und Residenten auf den Balearen. Das Team aus Rechtsanwälten und Steuerberatern bietet ganzheitliche Betreuung bei Immobilienübertragungen, Erbschaften und Unternehmensgründungen.",
    highlights: [
      "Über 25 Jahre Expertise im spanischen und internationalen Immobilien- und Steuerrecht",
      "Büros in Palma, Puerto Portals, Sóller und Ibiza für maximale Kundennähe",
      "Deutschsprachige Rechtsanwälte und beeidigte Beratung nach europäischen Standards",
      "Vollständige Due-Diligence-Prüfung von Immobilien vor dem Notartermin",
    ],
    servicesProvided: [
      "Umfassende Rechtsprüfung und Abwicklung beim Immobilienkauf auf Mallorca",
      "Internationale Steuerplanung und Nicht-Residenten-Steuererklärungen",
      "Erbrecht, Nachlassabwicklung und spanische Testamente",
      "Gesellschaftsgründung und gewerbliche Rechtsberatung",
    ],
    specialties: [
      "Immobilienrecht & Grundbuchprüfung",
      "Internationales Steuerrecht",
      "Erbrecht & Nachlassverwaltung",
      "Goldenes Visum & Aufenthaltsrecht",
    ],
    founderStory:
      "Gegründet von José Carlos Frau, verbindet die Kanzlei tiefes lokales Netzwerk mit höchsten Ansprüchen an internationale Rechtssicherheit für ausländische Eigentümer auf den Balearen.",
    pricingNotes: "Festes Honorarmodell für Immobilientransaktionen und transparente Abrechnung.",
    teamRole: "Rechtsanwalt & Kanzleigründer",
  },
  "illeslex-abogados-palma": {
    shortDescription:
      "Renommierte Rechts- und Steuerkanzlei in Palma – umfassende juristische Beratung für internationale Immobilieninvestoren.",
    fullDescription:
      "Illeslex Abogados bietet hochspezialisierte Rechtsberatung für ausländische Privatpersonen und Firmen auf Mallorca. Mit über 20 Jahren Erfahrung deckt die Kanzlei Immobilienrecht, Stadtplanungsrecht, Steueroptimierung und Zivilrecht ab.",
    highlights: [
      "Über 20 Jahre juristische Erfahrung im balearischen Immobilien- und Baurecht",
      "Fokus auf deutsche, britische und internationale Mandanten",
      "Zentraler Kanzleisitz im Bankenviertel von Palma",
      "Anerkannt für Gründlichkeit, Verhandlungskompetenz und Diskretion",
    ],
    servicesProvided: [
      "Rechtliche Begleitung beim Erwerb von Villen, Fincas und Grundstücken",
      "Bau- und Lizenzprüfungen bei Sanierungen und Neubauten",
      "Steuerberatung für Residenten und Nicht-Residenten",
      "Erbrechtliche Beratung und Nachlassregelungen",
    ],
    specialties: ["Immobilien- & Baurecht", "Stadtplanung & Baulizenzen", "Steuerrecht", "Zivil- & Gesellschaftsrecht"],
    pricingNotes: "Individuelle Honorarvereinbarung nach Streitwert und Transaktionsumfang.",
    teamRole: "Partner & Fachanwalt für Immobilienrecht",
  },
  "arabella-spa-mallorca": {
    shortDescription:
      "Europas führendes Luxus-Spa im The St. Regis Mardavall (Calvià) – Thalassotherapie, TCM-Ärzte und Valmont-Behandlungen.",
    fullDescription:
      "Das Arabella Spa im 5-Sterne-Resort The St. Regis Mardavall Mallorca ist eine Oase der Ruhe auf über 4.700 m². Mit beheizten Meerwasserbecken, traditioneller chinesischer Medizin (TCM), Ayurveda und Kosmetikritualen von Valmont und Maria Galland setzt es internationale Maßstäbe für ganzheitliches Wohlbefinden.",
    highlights: [
      "Mehrfach als bestes Hotel-Spa Europas ausgezeichnet",
      "Großer Meerwasser-Thalasso-Parcours mit Whirlpools und Eisgrotte",
      "Residente Ärzte für Traditionelle Chinesische Medizin und Akupunktur",
      "Exklusive Gesichts- und Körperrituale von Valmont und Maria Galland",
    ],
    servicesProvided: [
      "Thalassotherapie-Rundgänge in beheiztem Meerwasser",
      "Konsultationen & Akupunktur bei Fachärzten für TCM",
      "Anti-Aging-Gesichtsbehandlungen von Valmont",
      "Ayurvedische Massagen und ganzheitliche Körpertherapien",
    ],
    specialties: [
      "Thalassotherapie & Meerwasserpools",
      "Traditionelle Chinesische Medizin (TCM)",
      "Valmont Anti-Aging Kosmetik",
      "Ayurveda & Entspannungsmassagen",
    ],
    pricingNotes: "Tages-Spa-Pässe und individuelle Behandlungspakete auf Anfrage.",
    teamRole: "Spa-Direktion & Leitender TCM-Arzt",
  },
  "son-brull-spa-mallorca": {
    shortDescription:
      "Exklusives Boutique-Spa im Relais & Châteaux Son Brull (Pollença) – Naturbehandlungen mit Oliven- und Mandelölen aus eigenem Anbau.",
    fullDescription:
      "Das Spa des 5-Sterne-Hotels Son Brull am Fuße der Tramuntana bei Pollença ist ganz der mediterranen Naturheilkunde gewidmet. Alle Behandlungen basieren auf biologischen Ölen aus handgeernteten Mandeln, Oliven und Kräutern der hoteleigenen Finca.",
    highlights: [
      "Einzigartiges Öko-Spa im historischen Klostergut Son Brull (Relais & Châteaux)",
      "100 % natürliche Inhaltsstoffe aus eigenem biologischem Finca-Anbau",
      "Sauna, Dampfbad und beheizter Außenpool mit Traumblick auf die Weinberge",
      "Ganzheitliche Entspannung abseits des Massentourismus im Norden Mallorcas",
    ],
    servicesProvided: [
      "Körperpeelings mit mallorquinischem Meersalz und Mandelöl",
      "Entspannende Ganzkörpermassagen mit warmem Olivenöl",
      "Hydrotherapie, Dampfbad und finnische Sauna",
      "Yoga-Einheiten im Garten und Wellness-Tagesprogramme",
    ],
    specialties: [
      "Mallorquinische Naturkosmetik",
      "Mandelöl- & Olivenöl-Massagen",
      "Thermalbereich mit Bergblick",
      "Private Spa-Rituale für Paare",
    ],
    pricingNotes: "Reservierung für Hotelgäste und externe Tagesbesucher mit Voranmeldung.",
    teamRole: "Leitende Therapeutin & Wellnessberaterin",
  },
  "trablisa-seguridad-mallorca": {
    shortDescription:
      "Mallorcas führendes Sicherheitsunternehmen seit 1958 – Alarmanlagen mit Notrufzentrale, Videoüberwachung und Domotik für Villen.",
    fullDescription:
      "Trablisa ist das traditionsreichste und größte Sicherheitsunternehmen der Balearen. Gegründet 1958 in Palma, schützt Trablisa zehntausende Privathäuser, Fincas, Luxusvillen und Gewerbebetriebe mit hochmodernen Alarmsystemen, 24/7-Notrufleitstelle, Videosensorik und schneller Intervention.",
    highlights: [
      "Über 65 Jahre Erfahrung als Sicherheitsmarktführer auf den Balearen",
      "Eigene nach höchsten Sicherheitsstandards zertifizierte 24/7-Notrufzentrale auf Mallorca",
      "Schnelle Reaktionszeiten durch eigene mobile Interventionsflotte auf der ganzen Insel",
      "Intelligente App-Steuerung für Alarmanlagen, Kameras und Smart-Home-Komponenten",
    ],
    servicesProvided: [
      "Installation & Aufschaltung von Einbruchmeldeanlagen für Fincas und Villen",
      "HD-Videoüberwachung (CCTV) mit intelligenter Bewegungserkennung",
      "24/7-Notrufleitstelle und Alarmaufschaltung mit Interventionsdienst",
      "Smart-Home-Integration, Zutrittskontrolle und Brandschutzsysteme",
    ],
    specialties: [
      "Villen- und Fincasicherheit",
      "Alarmanlagen mit 24/7 Leitstellenanschluss",
      "HD-Videoüberwachung & Perimeterschutz",
      "Zutrittskontroll- und Smarthome-Systeme",
    ],
    founderStory:
      "1958 in Palma de Mallorca gegründet, hat sich Trablisa von einem Pionierunternehmen der Insel zu einem der führenden spanischen Sicherheitskonzerne entwickelt, mit tiefen Wurzeln und unveränderter Verbundenheit zu Mallorca.",
    pricingNotes: "Kostenlose Sicherheitsanalyse vor Ort und transparente monatliche Wartungsverträge.",
    teamRole: "Sicherheitsingenieur & Projektleiter Villenschutz",
  },
};

async function enrichServiceFile(filePath: string) {
  const fileUrl = pathToFileURL(filePath).href;
  const mod = await import(fileUrl);
  const entries = Object.entries(mod);
  if (entries.length === 0) return;
  const [varName, serviceObj] = entries[0] as [string, any];
  if (!serviceObj || typeof serviceObj !== "object" || !serviceObj.slug) return;

  const slug = serviceObj.slug;
  const tr = GERMAN_TRANSLATIONS[slug];
  if (!tr) {
    console.log(`⚠️ No translation for ${slug}`);
    return;
  }

  // Deep clone to modify
  const s = JSON.parse(JSON.stringify(serviceObj));

  // 1. shortDescription
  if (s.shortDescription) {
    s.shortDescription.de = tr.shortDescription;
  }

  // 2. fullDescription
  if (s.fullDescription) {
    s.fullDescription.de = tr.fullDescription;
  }

  // 3. highlights
  if (s.highlights) {
    s.highlights.de = tr.highlights;
  }

  // 4. servicesProvided
  if (s.servicesProvided) {
    s.servicesProvided.de = tr.servicesProvided;
  }

  // 5. specialties
  if (tr.specialties && s.specialties && typeof s.specialties === "object" && !Array.isArray(s.specialties)) {
    s.specialties.de = tr.specialties;
  }

  // 6. founderStory
  if (tr.founderStory && s.founderStory) {
    s.founderStory.de = tr.founderStory;
  }

  // 7. pricing.notes
  if (tr.pricingNotes && s.pricing && s.pricing.notes) {
    s.pricing.notes.de = tr.pricingNotes;
  }

  // 8. teamMembers
  if (tr.teamRole && s.teamMembers && Array.isArray(s.teamMembers) && s.teamMembers[0]?.role) {
    s.teamMembers[0].role.de = tr.teamRole;
  }

  // 9. languagesSpoken
  if (s.languagesSpoken && Array.isArray(s.languagesSpoken)) {
    if (!s.languagesSpoken.includes("de")) {
      s.languagesSpoken.push("de");
    }
  }

  // Write clean TypeScript file
  const header = `import type { ServiceItem } from "../types.ts";\n\n`;
  const code = `${header}export const ${varName}: ServiceItem = ${JSON.stringify(s, null, 2)};\n`;

  fs.writeFileSync(filePath, code, "utf-8");
  console.log(`✨ Enriched & Serialized: ${slug} (${varName})`);
}

async function processAll() {
  const sectors = fs.readdirSync(SERVICES_DIR, { withFileTypes: true });
  for (const sector of sectors) {
    if (sector.isDirectory()) {
      const sectorPath = path.join(SERVICES_DIR, sector.name);
      const files = fs.readdirSync(sectorPath);
      for (const file of files) {
        if (file.endsWith(".ts") && file !== "index.ts") {
          await enrichServiceFile(path.join(sectorPath, file));
        }
      }
    }
  }
}

processAll();
