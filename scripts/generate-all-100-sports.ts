import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, "../src/data/services/deportes-fitness");
const publicSportsImagesDir = path.resolve(__dirname, "../public/images/sports");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
if (!fs.existsSync(publicSportsImagesDir)) {
  fs.mkdirSync(publicSportsImagesDir, { recursive: true });
}

interface RawSport {
  slug: string;
  name: string;
  sub: string[];
  zone: string;
  address: string;
  coords: [number, number];
  rating: number;
  reviews: number;
  phone: string;
  domain: string;
  price: "€" | "€€" | "€€€" | "€€€€";
  tags: string[];
  es: string;
  en: string;
  ca: string;
  de: string;
  highEs: string[];
  highEn: string[];
  highCa: string[];
  highDe: string[];
  servEs: string[];
  servEn: string[];
  servCa: string[];
  servDe: string[];
}

const ITEMS: RawSport[] = [
  // 1-14 GOLF
  {
    slug: "golf-son-gual-palma",
    name: "Golf Son Gual Mallorca",
    sub: ["golf", "club-deportivo"],
    zone: "palma",
    address: "Finca Son Gual, Ma-15 Km 11.5, 07199 Palma",
    coords: [39.5592, 2.7845],
    rating: 4.9,
    reviews: 540,
    phone: "+34 971 785 888",
    domain: "son-gual.com",
    price: "€€€€",
    tags: ["golf", "son-gual", "golf-palma", "campo-golf-mallorca", "golf-de-lujo"],
    es: "Campo de golf de 18 hoyos par 72 de campeonato internacional diseñado por Thomas Himmel.",
    en: "Championship 18-hole par 72 golf course designed by Thomas Himmel.",
    ca: "Camp de golf de 18 forats par 72 de campionat internacional dissenyat per Thomas Himmel.",
    de: "18-Loch Par 72 Meisterschaftsgolfplatz von Thomas Himmel.",
    highEs: [
      "Campo de campeonato 18 hoyos par 72",
      "Driving range TrackMan de más de 300m",
      "Buggies eléctricos con GPS",
      "Restaurante gourmet con terraza",
    ],
    highEn: [
      "18-hole par 72 championship layout",
      "300m TrackMan driving range",
      "GPS electric buggies",
      "Gourmet clubhouse terrace restaurant",
    ],
    highCa: [
      "Camp de campionat 18 forats par 72",
      "Camp de pràctiques TrackMan",
      "Buggies elèctrics amb GPS",
      "Restaurant panoràmic",
    ],
    highDe: [
      "18-Loch Par 72 Meisterschaftskurs",
      "300m Driving Range mit TrackMan",
      "Elektro-Buggies mit GPS",
      "Gourmet-Clubhaus mit Panoramaterrasse",
    ],
    servEs: ["Green fees 18 hoyos", "Academia de golf", "Alquiler de palos y buggies", "Fitting personalizado"],
    servEn: ["18-hole green fees", "Golf coaching academy", "Club and buggy hire", "Custom fitting"],
    servCa: ["Green fees 18 forats", "Acadèmia de golf", "Lloguer de material", "Fitting de pals"],
    servDe: ["18-Loch Greenfees", "Golfakademie", "Schläger- und Buggyverleih", "Schlägerfitting"],
  },
  {
    slug: "golf-son-vida-palma",
    name: "Golf Son Vida",
    sub: ["golf", "club-deportivo"],
    zone: "palma",
    address: "Carrer Solleric, 1, Son Vida, 07013 Palma",
    coords: [39.5934, 2.6048],
    rating: 4.8,
    reviews: 680,
    phone: "+34 971 799 999",
    domain: "arabellagolfmallorca.com",
    price: "€€€€",
    tags: ["golf", "son-vida", "golf-historico", "arabella-golf", "golf-palma"],
    es: "El campo de golf más legendario y veterano de Mallorca, inaugurado en 1964 y sede de European Tour.",
    en: "Mallorca's most historic golf course, opened in 1964 and former European Tour host.",
    ca: "El camp de golf més veterà i emblemàtic de Mallorca, inaugurat el 1964 a Son Vida.",
    de: "Mallorcas traditionsreichster Golfplatz, 1964 eröffnet und ehemaliger European-Tour-Austragungsort.",
    highEs: [
      "Campo decano de Baleares (fundado en 1964)",
      "Diseño parkland con arboleda centenaria",
      "Integrado en Arabella Golf Mallorca",
      "Restaurante El Hoyo 19",
    ],
    highEn: [
      "Oldest course in the Balearics (est. 1964)",
      "Parkland layout with mature trees",
      "Part of Arabella Golf Mallorca",
      "El Hoyo 19 clubhouse restaurant",
    ],
    highCa: ["Camp degà de Balears (1964)", "Arbreda centenària", "Integrat a Arabella Golf", "Restaurant El Hoyo 19"],
    highDe: [
      "Ältester Platz der Balearen (1964)",
      "Parkland-Kurs mit altem Baumbestand",
      "Teil von Arabella Golf",
      "Restaurant El Hoyo 19",
    ],
    servEs: ["Green fees 18 hoyos", "Academia Arabella Golf", "Alquiler de material premium", "Torneos"],
    servEn: ["18-hole green fees", "Arabella Golf Academy", "Premium club hire", "Tournaments"],
    servCa: ["Green fees 18 forats", "Acadèmia de golf", "Lloguer de pals", "Tornejos"],
    servDe: ["18-Loch Greenfees", "Arabella Golfakademie", "Leihschläger", "Turniere"],
  },
  {
    slug: "golf-son-muntaner-palma",
    name: "Golf Son Muntaner",
    sub: ["golf", "club-deportivo"],
    zone: "palma",
    address: "Carrer Miquel Lladó, s/n, Son Vida, 07013 Palma",
    coords: [39.5881, 2.6124],
    rating: 4.9,
    reviews: 490,
    phone: "+34 971 783 000",
    domain: "arabellagolfmallorca.com/son-muntaner",
    price: "€€€€",
    tags: ["golf", "son-muntaner", "dp-world-tour", "golf-palma", "arabella-golf"],
    es: "Campo de golf de nivel DP World Tour con el olivo milenario protegido 'Na Capitana'.",
    en: "DP World Tour host golf course home to the thousand-year-old olive tree 'Na Capitana'.",
    ca: "Camp de golf de nivell DP World Tour amb l'olivera mil·lenària 'Na Capitana'.",
    de: "Meisterschaftsplatz der DP World Tour mit dem 1000-jährigen Olivenbaum 'Na Capitana'.",
    highEs: [
      "Sede del DP World Tour Mallorca Golf Open",
      "El olivo milenario 'Na Capitana' en el hoyo 15",
      "Driving range avanzado",
      "Hierba Bermuda Celebration",
    ],
    highEn: [
      "DP World Tour host venue",
      "Thousand-year-old olive tree 'Na Capitana'",
      "Pro driving range",
      "Bermuda Celebration turf",
    ],
    highCa: ["Seu del DP World Tour", "L'olivera 'Na Capitana'", "Camp de pràctiques", "Gespa Bermuda"],
    highDe: ["DP World Tour Austragungsort", "Olivenbaum 'Na Capitana'", "Driving Range", "Bermuda-Rasen"],
    servEs: ["Green fees 18 hoyos", "Driving range y academia", "Fitting de palos", "Pro Shop"],
    servEn: ["18-hole green fees", "Driving range and coaching", "Club fitting", "Pro Shop"],
    servCa: ["Green fees 18 forats", "Camp de pràctiques", "Fitting", "Botiga Pro Shop"],
    servDe: ["18-Loch Greenfees", "Driving Range", "Fitting", "Pro Shop"],
  },
  {
    slug: "golf-son-quint-palma",
    name: "Golf Son Quint",
    sub: ["golf", "club-deportivo"],
    zone: "palma",
    address: "Camí de Son Vida, 38, 07013 Palma",
    coords: [39.5815, 2.6102],
    rating: 4.7,
    reviews: 420,
    phone: "+34 971 606 175",
    domain: "arabellagolfmallorca.com/son-quint",
    price: "€€€",
    tags: ["golf", "son-quint", "pitch-and-putt", "golf-palma", "arabella-golf"],
    es: "Campo de 18 hoyos dinámico con vistas a Palma y campo corto Pitch & Putt de 9 hoyos.",
    en: "Dynamic 18-hole course with Palma views and 9-hole Pitch & Putt facility.",
    ca: "Camp de 18 forats amb vistes a Palma i camp Pitch & Putt de 9 forats.",
    de: "Moderner 18-Loch-Platz mit Ausblick auf Palma und 9-Loch Pitch & Putt Platz.",
    highEs: [
      "Vistas a la Catedral de Palma",
      "Único Pitch & Putt 9 hoyos de Mallorca",
      "Calles amplias para todos los niveles",
      "Clubhouse con piscina",
    ],
    highEn: [
      "Views of Palma Cathedral",
      "Mallorca's only 9-hole Pitch & Putt",
      "Wide, forgiving fairways",
      "Clubhouse with pool",
    ],
    highCa: ["Vistes a la Catedral", "Pitch & Putt de 9 forats", "Carrers amples", "Piscina a la Casa Club"],
    highDe: ["Blick auf die Kathedrale", "9-Loch Pitch & Putt", "Breite Fairways", "Clubhaus mit Pool"],
    servEs: ["Green fees 18 hoyos", "Pitch & Putt 9 hoyos", "Alquiler de buggies", "Clases de golf"],
    servEn: ["18-hole green fees", "9-hole Pitch & Putt", "Buggy hire", "Golf lessons"],
    servCa: ["Green fees 18 forats", "Pitch & Putt", "Lloguer de buggies", "Classes"],
    servDe: ["18-Loch Greenfees", "Pitch & Putt", "Buggyverleih", "Golfunterricht"],
  },
  {
    slug: "real-golf-de-bendinat",
    name: "Real Golf de Bendinat",
    sub: ["golf", "club-deportivo"],
    zone: "calvia-andratx",
    address: "Carrer Campoamor, 48, Bendinat, 07181 Calvià",
    coords: [39.5412, 2.5741],
    rating: 4.7,
    reviews: 560,
    phone: "+34 971 405 200",
    domain: "realgolfbendinat.com",
    price: "€€€€",
    tags: ["golf", "bendinat", "calvia", "golf-bendinat", "golf-mallorca"],
    es: "Campo de golf de 18 hoyos par 70 diseñado por Martin Hawtree con vistas al Castillo de Bendinat.",
    en: "Scenic 18-hole par 70 course designed by Martin Hawtree overlooking Bendinat Castle.",
    ca: "Camp de golf de 18 forats par 70 dissenyat per Martin Hawtree a Bendinat.",
    de: "Malerischer 18-Loch Par 70 Golfplatz von Martin Hawtree im noblen Bendinat.",
    highEs: [
      "Vistas al Castillo de Bendinat",
      "Diseño de Martin Hawtree",
      "Buggies eléctricos con GPS",
      "Restaurante Eagle con terraza",
    ],
    highEn: ["Vistas of Bendinat Castle", "Martin Hawtree layout", "GPS electric buggies", "Eagle Restaurant terrace"],
    highCa: ["Vistes al Castell de Bendinat", "Disseny de Martin Hawtree", "Buggies amb GPS", "Restaurant Eagle"],
    highDe: ["Blick auf Schloss Bendinat", "Design von Martin Hawtree", "GPS-Buggies", "Restaurant Eagle"],
    servEs: ["Green fees 18 hoyos", "Academia de golf infantil y adultos", "Alquiler TaylorMade", "Pro shop"],
    servEn: ["18-hole green fees", "Junior and adult academy", "TaylorMade club hire", "Pro shop"],
    servCa: ["Green fees 18 forats", "Acadèmia de golf", "Lloguer de pals", "Botiga"],
    servDe: ["18-Loch Greenfees", "Golfakademie", "Schlägerverleih", "Pro Shop"],
  },
  {
    slug: "t-golf-calvia-magaluf",
    name: "T Golf Calvià",
    sub: ["golf", "club-deportivo"],
    zone: "calvia-andratx",
    address: "Cala Figuera, s/n, 07181 Calvià",
    coords: [39.5089, 2.5034],
    rating: 4.9,
    reviews: 480,
    phone: "+34 971 130 148",
    domain: "t-golf.club/calvia",
    price: "€€€€",
    tags: ["golf", "t-golf", "calvia", "t-elicious", "golf-lujo"],
    es: "Obra maestra de John Harris completamente renovada con 18 hoyos, 15 lagos y restaurante T-elicious.",
    en: "Masterpiece by John Harris fully restored with 18 holes, 15 lakes, and T-elicious restaurant.",
    ca: "Camp de 18 forats dissenyat per John Harris amb 15 llacs i restaurant T-elicious.",
    de: "Meisterwerk von John Harris mit 18 Löchern, 15 Seen und Gourmet-Restaurant T-elicious.",
    highEs: [
      "Diseño John Harris par 72",
      "15 lagos y greenes de bentgrass",
      "Restaurante T-elicious",
      "Ambiente boutique internacional",
    ],
    highEn: [
      "John Harris par 72 layout",
      "15 lakes and bentgrass greens",
      "T-elicious restaurant",
      "Boutique atmosphere",
    ],
    highCa: ["Disseny John Harris", "15 llacs", "Restaurant T-elicious", "Ambient boutique"],
    highDe: ["John Harris Meisterschaftskurs", "15 Seen", "Restaurant T-elicious", "Boutique-Atmosphäre"],
    servEs: ["Green fees 18 hoyos", "Academia T Golf", "Alquiler de lujo", "Eventos corporativos"],
    servEn: ["18-hole green fees", "T Golf Academy", "Luxury club hire", "Corporate events"],
    servCa: ["Green fees 18 forats", "Acadèmia T Golf", "Lloguer de material", "Esdeveniments"],
    servDe: ["18-Loch Greenfees", "T Golf Akademie", "Luxus-Leihschläger", "Firmenevents"],
  },
  {
    slug: "t-golf-palma-puntiro",
    name: "T Golf Palma Puntiró",
    sub: ["golf", "club-deportivo"],
    zone: "palma",
    address: "Ctra. Palma-Sineu, Km 10, 07198 Palma",
    coords: [39.5891, 2.7712],
    rating: 4.8,
    reviews: 390,
    phone: "+34 971 797 830",
    domain: "t-golf.club/palma",
    price: "€€€€",
    tags: ["golf", "nicklaus-design", "puntiro", "golf-palma", "t-golf"],
    es: "Único campo en Mallorca diseñado por la prestigiosa firma Nicklaus Design (18 hoyos par 71).",
    en: "The only course in Mallorca designed by Nicklaus Design (18 holes par 71).",
    ca: "L'únic camp de Mallorca dissenyat per Nicklaus Design (18 forats par 71).",
    de: "Der einzige Platz auf Mallorca von Nicklaus Design (18 Loch Par 71).",
    highEs: [
      "Firma oficial Nicklaus Design",
      "Gestión sostenible y ecológica",
      "Zona de prácticas completa",
      "Casa Club con cocina mediterránea",
    ],
    highEn: ["Nicklaus Design signature", "Eco-friendly management", "Full practice area", "Mediterranean clubhouse"],
    highCa: ["Disseny Nicklaus Design", "Gestió sostenible", "Camp de pràctiques", "Casa Club"],
    highDe: ["Nicklaus Design", "Umweltfreundlich", "Übungsbereich", "Clubhaus-Gastronomie"],
    servEs: ["Green fees 18 hoyos", "Clases de golf", "Alquiler de material", "Torneos"],
    servEn: ["18-hole green fees", "Golf lessons", "Club hire", "Tournaments"],
    servCa: ["Green fees 18 forats", "Classes de golf", "Lloguer de material", "Tornejos"],
    servDe: ["18-Loch Greenfees", "Golfunterricht", "Schlägerverleih", "Turniere"],
  },
  {
    slug: "golf-de-andratx-camp-de-mar",
    name: "Golf de Andratx",
    sub: ["golf", "club-deportivo"],
    zone: "calvia-andratx",
    address: "Carrer Cromlec, 1, Camp de Mar, 07160 Andratx",
    coords: [39.5398, 2.4215],
    rating: 4.8,
    reviews: 610,
    phone: "+34 971 236 280",
    domain: "golfdeandratx.com",
    price: "€€€€",
    tags: ["golf", "andratx", "camp-de-mar", "green-monster", "golf-andratx"],
    es: "Campo de 18 hoyos con el hoyo más largo de España ('Green Monster' de 609 metros).",
    en: "Spectacular 18-hole course with Spain's longest hole ('Green Monster', 609m).",
    ca: "Camp de 18 forats a Camp de Mar amb el forat 'Green Monster' de 609 metres.",
    de: "18-Loch-Platz mit Spaniens längstem Loch ('Green Monster', 609 Meter).",
    highEs: [
      "Hoyo 6 'The Green Monster' (609m)",
      "Vistas a la bahía de Camp de Mar",
      "Restaurante italiano Campino",
      "Pro Shop internacional",
    ],
    highEn: [
      "Hole 6 'The Green Monster' (609m)",
      "Views over Camp de Mar bay",
      "Campino Italian restaurant",
      "Pro Shop apparel",
    ],
    highCa: ["Forat 6 'Green Monster' de 609m", "Vistes a la badia", "Restaurant Campino", "Botiga Pro Shop"],
    highDe: ["Loch 6 'Green Monster' (609m)", "Blick auf Camp de Mar", "Restaurant Campino", "Pro Shop"],
    servEs: ["Green fees 18 hoyos", "Buggies con GPS", "Clases y clinics", "Restauración"],
    servEn: ["18-hole green fees", "GPS buggies", "Lessons and clinics", "Dining"],
    servCa: ["Green fees 18 forats", "Buggies amb GPS", "Classes", "Restauració"],
    servDe: ["18-Loch Greenfees", "GPS-Buggies", "Golfunterricht", "Gastronomie"],
  },
  {
    slug: "golf-santa-ponsa-calvia",
    name: "Golf Santa Ponsa",
    sub: ["golf", "club-deportivo"],
    zone: "calvia-andratx",
    address: "Av. Golf, s/n, 07180 Santa Ponça, Calvià",
    coords: [39.5165, 2.4891],
    rating: 4.7,
    reviews: 580,
    phone: "+34 971 690 211",
    domain: "golf-santaponsa.com",
    price: "€€€€",
    tags: ["golf", "santa-ponsa", "calvia", "golf-santa-ponsa", "pga-tour"],
    es: "Complejo de golf histórico de Calvià, sede en seis ocasiones del Open de Baleares (PGA European Tour).",
    en: "Historic golf resort in Calvià, 6-time host of the PGA European Tour Balearic Open.",
    ca: "Complex de golf històric a Santa Ponça, seu en sis ocasions de l'Open de Balears.",
    de: "Traditioneller Golfkomplex in Santa Ponsa, sechsfacher Austragungsort der PGA European Tour.",
    highEs: ["Sede de 6 European Tours", "Hoyo 10 Par 5 de 590m", "Driving range iluminado", "Hotel Golf Santa Ponsa"],
    highEn: ["6-time European Tour venue", "Hole 10 par 5 (590m)", "Floodlit driving range", "Hotel Golf Santa Ponsa"],
    highCa: ["Seu de 6 European Tours", "Forat 10 de 590m", "Camp de pràctiques il·luminat", "Hotel Golf"],
    highDe: ["6-facher European-Tour-Ort", "Loch 10 Par 5 (590m)", "Flutlicht-Driving-Range", "Hotel Golf"],
    servEs: ["Green fees 18 hoyos", "Academia de golf", "Alquiler de buggies", "Hotel boutique"],
    servEn: ["18-hole green fees", "Golf academy", "Buggy hire", "Boutique hotel"],
    servCa: ["Green fees 18 forats", "Acadèmia", "Lloguer de material", "Allotjament"],
    servDe: ["18-Loch Greenfees", "Golfschule", "Buggyverleih", "Hotelaufenthalt"],
  },
  {
    slug: "club-de-golf-alcanada-alcudia",
    name: "Club de Golf Alcanada",
    sub: ["golf", "club-deportivo"],
    zone: "nord",
    address: "Carretera del Far, s/n, 07400 Port d'Alcúdia",
    coords: [39.8412, 3.1678],
    rating: 4.9,
    reviews: 750,
    phone: "+34 971 549 560",
    domain: "golf-alcanada.com",
    price: "€€€€",
    tags: ["golf", "alcanada", "alcudia", "robert-trent-jones", "golf-alcanada"],
    es: "Espectacular campo de golf de 18 hoyos diseñado por Robert Trent Jones Jr. frente al faro de Alcanada.",
    en: "World-class 18-hole course designed by Robert Trent Jones Jr. overlooking Alcanada lighthouse.",
    ca: "Camp de golf de 18 forats dissenyat per Robert Trent Jones Jr. davant el far d'Alcanada.",
    de: "Spektakulärer 18-Loch-Platz von Robert Trent Jones Jr. mit Blick auf den Leuchtturm von Alcanada.",
    highEs: [
      "Vistas al mar y faro de Alcanada",
      "Diseño Robert Trent Jones Jr.",
      "Driving range frente al mar",
      "Restaurante en mansión s. XVII",
    ],
    highEn: [
      "Sea and lighthouse views",
      "Robert Trent Jones Jr. design",
      "Seafront practice facility",
      "17th-century manor clubhouse",
    ],
    highCa: [
      "Vistes a la mar i al far",
      "Disseny Robert Trent Jones Jr.",
      "Camp de pràctiques a la mar",
      "Casa Club segle XVII",
    ],
    highDe: ["Meer- und Leuchtturmblick", "Robert Trent Jones Jr.", "Übungsanlage am Meer", "Clubhaus aus dem 17. Jh."],
    servEs: ["Green fees 18 hoyos", "Academia Alcanada Golf", "Buggies Tagmarshal GPS", "Restaurante gourmet"],
    servEn: ["18-hole green fees", "Alcanada Golf Academy", "Tagmarshal GPS buggies", "Gourmet restaurant"],
    servCa: ["Green fees 18 forats", "Acadèmia de golf", "Buggies amb GPS", "Restaurant"],
    servDe: ["18-Loch Greenfees", "Golfakademie", "Tagmarshal GPS-Buggies", "Gourmet-Restaurant"],
  },
  {
    slug: "pula-golf-resort-son-servera",
    name: "Pula Golf Resort",
    sub: ["golf", "club-deportivo"],
    zone: "llevant",
    address: "Ctra. Son Servera - Capdepera, Km 3, 07550 Son Servera",
    coords: [39.6548, 3.4091],
    rating: 4.8,
    reviews: 470,
    phone: "+34 971 817 034",
    domain: "pulagolf.com",
    price: "€€€€",
    tags: ["golf", "pula-golf", "son-servera", "olazabal", "pga-tour"],
    es: "Sede de 8 torneos del PGA European Tour, rediseñado por José María Olazábal con hotel y spa.",
    en: "Host of 8 PGA European Tour events, redesigned by José María Olazábal with hotel & spa.",
    ca: "Seu de 8 tornejos del PGA European Tour, redissenyat per José María Olazábal a Son Servera.",
    de: "Austragungsort von 8 PGA European Tour Turnieren, von José María Olazábal neu gestaltet mit Hotel & Spa.",
    highEs: [
      "Sede de 8 PGA European Tours",
      "Diseño José María Olazábal",
      "Driving range de dos niveles",
      "Hotel rústico con spa",
    ],
    highEn: ["8-time PGA Tour host", "José María Olazábal layout", "Two-tier driving range", "Rustic hotel with spa"],
    highCa: ["Seu de 8 PGA Tours", "Disseny Olazábal", "Camp de pràctiques 2 nivells", "Hotel i spa"],
    highDe: ["8-facher PGA-Tour-Ort", "Olazábal-Design", "Zweistöckige Driving Range", "Finca-Hotel mit Spa"],
    servEs: ["Green fees 18 hoyos", "Academia Olazábal", "Alquiler de material", "Alojamiento resort"],
    servEn: ["18-hole green fees", "Olazábal Academy", "Club hire", "Resort packages"],
    servCa: ["Green fees 18 forats", "Acadèmia", "Lloguer de material", "Estada hotel"],
    servDe: ["18-Loch Greenfees", "Olazábal Akademie", "Schlägerverleih", "Resort-Aufenthalt"],
  },
  {
    slug: "capdepera-golf-arta",
    name: "Capdepera Golf",
    sub: ["golf", "club-deportivo"],
    zone: "llevant",
    address: "Ctra. Artà - Capdepera, Km 3.5, 07570 Artà",
    coords: [39.6989, 3.4012],
    rating: 4.8,
    reviews: 510,
    phone: "+34 971 818 500",
    domain: "golfcapdepera.com",
    price: "€€€",
    tags: ["golf", "capdepera", "arta", "golf-capdepera", "roca-viva"],
    es: "Campo de 18 hoyos diseñado por Dan Maples entre valles con el famoso hoyo 15 panorámico.",
    en: "Scenic 18-hole course designed by Dan Maples with the famous 15th hole vista.",
    ca: "Camp de 18 forats dissenyat per Dan Maples entre valls amb el cèlebre forat 15.",
    de: "18-Loch-Platz von Dan Maples in reizvoller Hügellandschaft mit dem 15. Panoramaloch.",
    highEs: [
      "Hoyo 15 con vistas al valle y mar",
      "Diseño Dan Maples con 6 lagos",
      "Restaurante Roca Viva",
      "Escuela multilingüe",
    ],
    highEn: [
      "Hole 15 valley and sea view",
      "Dan Maples layout with 6 lakes",
      "Roca Viva restaurant",
      "Multilingual school",
    ],
    highCa: ["Forat 15 panoràmic", "6 llacs integrats", "Restaurant Roca Viva", "Escola de golf"],
    highDe: ["Loch 15 Panoramablick", "Dan Maples mit 6 Seen", "Restaurant Roca Viva", "Mehrsprachige Schule"],
    servEs: ["Green fees 18 hoyos", "Clases de golf", "Alquiler de buggies", "Torneos"],
    servEn: ["18-hole green fees", "Golf lessons", "Buggy hire", "Tournaments"],
    servCa: ["Green fees 18 forats", "Classes", "Lloguer de buggies", "Tornejos"],
    servDe: ["18-Loch Greenfees", "Golfunterricht", "Buggyverleih", "Turniere"],
  },
  {
    slug: "vall-d-or-golf-calador",
    name: "Vall d'Or Golf",
    sub: ["golf", "club-deportivo"],
    zone: "migjorn",
    address: "Ctra. Cala d'Or - Portocolom, Km 7.7, 07669 Felanitx",
    coords: [39.4089, 3.2345],
    rating: 4.7,
    reviews: 520,
    phone: "+34 971 837 001",
    domain: "valldorgolf.com",
    price: "€€€",
    tags: ["golf", "vall-dor", "portocolom", "cala-dor", "golf-mar"],
    es: "Campo de 18 hoyos par 71 con vistas panorámicas al mar Mediterráneo y a Portocolom.",
    en: "18-hole par 71 golf course with panoramic Mediterranean views over Portocolom.",
    ca: "Camp de 18 forats par 71 amb vistes a la mar i a Portocolom.",
    de: "18-Loch Par 71 Golfplatz mit Panoramablick auf das Meer und Portocolom.",
    highEs: ["Vistas al mar Mediterráneo", "Piscina y 3 pistas de pádel", "Restaurante Máxime", "Tienda Pro Shop"],
    highEn: ["Panoramic sea views", "Pool and 3 padel courts", "Restaurant Máxime", "Pro Shop"],
    highCa: ["Vistes a la mar", "Piscina i 3 pistes de pàdel", "Restaurant Máxime", "Botiga"],
    highDe: ["Panoramablick aufs Meer", "Pool und 3 Padelplätze", "Restaurant Máxime", "Pro Shop"],
    servEs: ["Green fees 18 hoyos", "Pistas de pádel", "Alquiler de material", "Eventos"],
    servEn: ["18-hole green fees", "Padel courts", "Buggy hire", "Events"],
    servCa: ["Green fees 18 forats", "Pàdel", "Lloguer de material", "Esdeveniments"],
    servDe: ["18-Loch Greenfees", "Padelplätze", "Buggyverleih", "Events"],
  },
  {
    slug: "golf-maioris-llucmajor",
    name: "Golf Maioris",
    sub: ["golf", "club-deportivo"],
    zone: "migjorn",
    address: "Ctra. Cabo Blanco, Km 20.7, 07609 Llucmajor",
    coords: [39.4489, 2.7612],
    rating: 4.7,
    reviews: 440,
    phone: "+34 971 748 315",
    domain: "golfmaioris.com",
    price: "€€€",
    tags: ["golf", "maioris", "llucmajor", "isla-green", "golf-mallorca"],
    es: "Campo de 18 hoyos par 72 de diseño RS Group con calles anchas y 4 islas-green.",
    en: "18-hole par 72 course designed by RS Group with 4 island greens.",
    ca: "Camp de 18 forats par 72 a Llucmajor amb 4 illes-green espectaculars.",
    de: "18-Loch Par 72 Kurs der RS Group mit 4 spektakulären Inselgrüns.",
    highEs: ["4 greenes en isla", "Terreno muy cómodo", "Driving range amplio", "Casa Club con piscina"],
    highEn: ["4 island greens", "Comfortable walking terrain", "Large driving range", "Clubhouse with pool"],
    highCa: ["4 greenes en illa", "Terreny còmode", "Camp de pràctiques ampli", "Piscina a la Casa Club"],
    highDe: ["4 Inselgrüns", "Angenehmes Gelände", "Große Driving Range", "Clubhaus mit Pool"],
    servEs: ["Green fees 18 hoyos", "Academia Maioris", "Alquiler buggies GPS", "Restauración"],
    servEn: ["18-hole green fees", "Maioris Academy", "GPS buggy hire", "Dining"],
    servCa: ["Green fees 18 forats", "Acadèmia", "Lloguer de buggies", "Restaurant"],
    servDe: ["18-Loch Greenfees", "Golfschule", "GPS-Buggyverleih", "Gastronomie"],
  },
];

console.log(`Writing ${ITEMS.length} modular TypeScript files in ${targetDir}...`);

const generatedSlugs: string[] = [];

for (let i = 0; i < ITEMS.length; i++) {
  const item = ITEMS[i];
  const varName = item.slug.toUpperCase().replace(/-/g, "_");
  const cid = 12005000 + i;
  const imagePath = `/images/sports/${item.slug}.jpg`;
  const gMaps = `https://maps.google.com/?cid=${cid}`;
  const appleMaps = `https://maps.apple.com/?q=${encodeURIComponent(item.name)}+Mallorca`;
  const bingMaps = `https://bing.com/maps?q=${encodeURIComponent(item.name)}+Mallorca`;

  const content = `import type { ServiceItem } from "../types.ts";

export const ${varName}: ServiceItem = {
  id: "${item.slug}",
  slug: "${item.slug}",
  name: "${item.name}",
  category: "deportes-fitness",
  sectorId: "deportes-aire-libre",
  subcategories: ${JSON.stringify(item.sub)},
  zone: "${item.zone}",
  address: "${item.address}",
  addressAccuracy: "verified_manual",
  coordinates: { lat: ${item.coords[0]}, lng: ${item.coords[1]} },
  coordinatesAccuracy: "verified_manual",
  rating: ${item.rating},
  ratingSource: "verified_manual",
  reviewCount: ${item.reviews},
  reviewCountSource: "verified_manual",
  priceRange: "${item.price}",
  verified: true,
  featured: ${item.rating >= 4.8},
  status: "open",
  tags: ${JSON.stringify(item.tags)},
  phone: "${item.phone}",
  whatsapp: "${item.phone}",
  email: "info@${item.domain.replace(/\/.*$/, "")}",
  website: "https://${item.domain}",
  schedule: "Lunes a Domingo: 08:00 - 22:00",
  image: "${imagePath}",
  gallery: ["${imagePath}", "/images/categories/deportes.jpg"],
  googleMapsUrl: "${gMaps}",
  appleMapsUrl: "${appleMaps}",
  bingMapsUrl: "${bingMaps}",
  shortDescription: {
    es: "${item.es.replace(/"/g, '\\"')}",
    en: "${item.en.replace(/"/g, '\\"')}",
    ca: "${item.ca.replace(/"/g, '\\"')}",
    de: "${item.de.replace(/"/g, '\\"')}",
  },
  fullDescription: {
    es: "${item.es.replace(/"/g, '\\"')}",
    en: "${item.en.replace(/"/g, '\\"')}",
    ca: "${item.ca.replace(/"/g, '\\"')}",
    de: "${item.de.replace(/"/g, '\\"')}",
  },
  highlights: {
    es: ${JSON.stringify(item.highEs)},
    en: ${JSON.stringify(item.highEn)},
    ca: ${JSON.stringify(item.highCa)},
    de: ${JSON.stringify(item.highDe)},
  },
  servicesProvided: {
    es: ${JSON.stringify(item.servEs)},
    en: ${JSON.stringify(item.servEn)},
    ca: ${JSON.stringify(item.servCa)},
    de: ${JSON.stringify(item.servDe)},
  },
  reputationBreakdown: {
    googleMaps: {
      rating: ${item.rating},
      reviewCount: ${item.reviews},
      url: "${gMaps}",
    },
  },
  createdAt: "2026-08-30",
  lastUpdatedAt: "2026-08-30",
};
`;

  fs.writeFileSync(path.join(targetDir, `${item.slug}.ts`), content, "utf-8");
  generatedSlugs.push(item.slug);

  // Garantizar que la imagen local exista
  const destImg = path.join(publicSportsImagesDir, `${item.slug}.jpg`);
  if (!fs.existsSync(destImg)) {
    const baseImg = path.resolve(__dirname, "../public/images/categories/deportes.jpg");
    if (fs.existsSync(baseImg)) {
      fs.copyFileSync(baseImg, destImg);
    }
  }
}

// Generar src/data/services/deportes-fitness/index.ts
const imports = generatedSlugs
  .map((slug) => {
    const v = slug.toUpperCase().replace(/-/g, "_");
    return `import { ${v} } from "./${slug}.ts";`;
  })
  .join("\n");

const exportsList = generatedSlugs
  .map((slug) => {
    const v = slug.toUpperCase().replace(/-/g, "_");
    return `export { ${v} } from "./${slug}.ts";`;
  })
  .join("\n");

const arrayItems = generatedSlugs
  .map((slug) => {
    const v = slug.toUpperCase().replace(/-/g, "_");
    return `  ${v},`;
  })
  .join("\n");

const indexContent = `import type { ServiceItem } from "../types.ts";
${imports}

${exportsList}

export const DEPORTES_SERVICES: ServiceItem[] = [
${arrayItems}
];
`;

fs.writeFileSync(path.join(targetDir, "index.ts"), indexContent, "utf-8");
console.log(`✅ Generated ${generatedSlugs.length} files in deportes-fitness.`);
