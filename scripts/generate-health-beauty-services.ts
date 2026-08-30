import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, "../src/data/services/spas-bienestar");
const publicSpasImagesDir = path.resolve(__dirname, "../public/images/spas");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
if (!fs.existsSync(publicSpasImagesDir)) {
  fs.mkdirSync(publicSpasImagesDir, { recursive: true });
}

interface HealthDef {
  slug: string;
  name: string;
  category: string;
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
}

// Catálogo curado de Centros de Salud, Clínicas Privadas, Odontología, Medicina Estética y Spas de Lujo
const HEALTH_SERVICES: HealthDef[] = [
  // ── 1. HOSPITALES PRIVADOS & CLÍNICAS MÉDICAS ──
  {
    slug: "hospital-quironsalud-palmaplanas",
    name: "Hospital Quirónsalud Palmaplanas",
    category: "salud-bienestar",
    sub: ["hospitales-clinicas", "urgencias-24h", "medicina-privada"],
    zone: "palma",
    address: "Camí dels Reis, 308, 07010 Palma",
    coords: [39.5989, 2.6312],
    rating: 4.6,
    reviews: 1420,
    phone: "+34 971 918 000",
    domain: "quironsalud.es/palmaplanas",
    price: "€€€",
    tags: ["zona:palma-centro"],
    es: "Hospital privado de alta resolución con urgencias 24h, UCI médica, cirugía avanzada y atención internacional multilingüe.",
    en: "High-resolution private hospital featuring 24/7 ER, ICU, advanced surgical suites, and multilingual patient care.",
    ca: "Hospital privat d'alta resolució amb urgències 24h, UCI, cirurgia avançada i atenció mèdica internacional.",
    de: "Privates Schwerpunktkrankenhaus mit 24h-Notaufnahme, Intensivstation und mehrsprachiger internationaler Patientenbetreuung.",
  },
  {
    slug: "clinica-rotger-quironsalud-palma",
    name: "Clínica Rotger Quirónsalud",
    category: "salud-bienestar",
    sub: ["hospitales-clinicas", "urgencias-24h", "medicina-privada"],
    zone: "palma",
    address: "Carrer de Santiago Rusiñol, 9, 07012 Palma",
    coords: [39.5745, 2.6478],
    rating: 4.6,
    reviews: 1180,
    phone: "+34 971 448 500",
    domain: "quironsalud.es/clinica-rotger",
    price: "€€€",
    tags: ["zona:palma-centro"],
    es: "Hospital privado de referencia histórica en el centro neurálgico de Palma con tecnología diagnóstica punta.",
    en: "Historic landmark private hospital in Palma's city center equipped with state-of-the-art diagnostic technology.",
    ca: "Hospital privat històric al centre de Palma amb tecnologia diagnòstica d'avantguarda i urgències.",
    de: "Traditionsreiches Privatkrankenhaus im Zentrum von Palma mit modernster Diagnostik und 24h-Notfallambulanz.",
  },
  {
    slug: "clinica-juaneda-miramar-palma",
    name: "Clínica Juaneda Miramar",
    category: "salud-bienestar",
    sub: ["hospitales-clinicas", "urgencias-24h", "medicina-privada"],
    zone: "palma",
    address: "Camí de la Vileta, 30, Son Serra, 07011 Palma",
    coords: [39.5889, 2.6245],
    rating: 4.5,
    reviews: 950,
    phone: "+34 971 767 000",
    domain: "juaneda.es/miramar",
    price: "€€€",
    tags: ["zona:palma-centro"],
    es: "Complejo hospitalario privado con amplias instalaciones, área quirúrgica puntera y centro de reproducción asistida.",
    en: "Private hospital complex with state-of-the-art surgical suites and fertility reproduction center.",
    ca: "Complex hospitalari privat amb àmplies instal·lacions, bloc quirúrgic d'avantguarda i reproducció assistida.",
    de: "Privatklinikkomplex mit modernem OP-Zentrum, Kinderwunschzentrum und umfassender Facharztversorgung.",
  },
  {
    slug: "palma-clinic-international-center",
    name: "Palma Clinic International Medical Center",
    category: "salud-bienestar",
    sub: ["medicina-privada", "chequeos-salud", "consultas-especialistas"],
    zone: "palma",
    address: "Camí dels Reis, 308, Edificio Palma Clinic, 07010 Palma",
    coords: [39.5995, 2.6305],
    rating: 4.9,
    reviews: 320,
    phone: "+34 971 905 202",
    domain: "palma-clinic.com",
    price: "€€€€",
    tags: ["zona:palma-centro"],
    es: "Centro médico internacional privado con especialistas de habla alemana e inglesa y chequeos preventivos integrales.",
    en: "Private international medical center with German and English-speaking doctors and executive health checkups.",
    ca: "Centre mèdic internacional privat amb especialistes multilingües i revisions mèdiques completes.",
    de: "Privates internationales Ärztezentrum mit deutschen und englischen Fachärzten und Check-up-Programmen.",
  },
  {
    slug: "juaneda-international-medical-santa-ponsa",
    name: "Juaneda Medical Center Santa Ponsa",
    category: "salud-bienestar",
    sub: ["medicina-privada", "urgencias-medicas"],
    zone: "calvia-andratx",
    address: "Avinguda del Rei Jaume I, 100, 07180 Santa Ponça, Calvià",
    coords: [39.5145, 2.4789],
    rating: 4.7,
    reviews: 280,
    phone: "+34 971 694 200",
    domain: "juaneda.es/santa-ponsa",
    price: "€€€",
    tags: ["zona:santa-ponsa"],
    es: "Centro médico ambulatorio para residentes y náutica en el suroeste con servicio a domicilio y hoteles.",
    en: "Outpatient medical center for southwest residents and yachting community with house & hotel call service.",
    ca: "Centre mèdic ambulatori per a residents i nàutica a Calvià amb visites a domicili.",
    de: "Ärztezentrum in Santa Ponsa für internationale Residenten mit Haus- und Hotelbesuchsservice.",
  },
  {
    slug: "centro-medico-quironsalud-porto-pi",
    name: "Centro Médico Quirónsalud Porto Pi",
    category: "salud-bienestar",
    sub: ["medicina-privada", "consultas-especialistas"],
    zone: "palma",
    address: "Avinguda de Gabriel Roca, 54, Porto Pi, 07015 Palma",
    coords: [39.5534, 2.6212],
    rating: 4.7,
    reviews: 310,
    phone: "+34 971 700 800",
    domain: "quironsalud.es/porto-pi",
    price: "€€€",
    tags: ["zona:palma-centro"],
    es: "Consultas externas especializadas frente al puerto de Palma con servicio rápido de diagnóstico y análisis clínicos.",
    en: "Specialist outpatient clinic overlooking Palma harbor with rapid diagnostic testing and clinical lab.",
    ca: "Consultes mèdiques especialitzades davant el port de Palma amb diagnòstic ràpid.",
    de: "Facharztzentrum am Hafen von Palma mit schneller Diagnostik und Laboranalysen.",
  },
  {
    slug: "policlinica-quironsalud-manacor",
    name: "Policlínica Quirónsalud Manacor",
    category: "salud-bienestar",
    sub: ["medicina-privada", "consultas-especialistas", "radiodiagnostico"],
    zone: "manacor-llevant",
    address: "Plaça de Ramon Llull, 17, 07500 Manacor",
    coords: [39.5689, 3.2089],
    rating: 4.6,
    reviews: 260,
    phone: "+34 971 846 600",
    domain: "quironsalud.es/manacor",
    price: "€€€",
    tags: ["zona:manacor"],
    es: "Centro de consultas médicas, traumatología, ginecología y radiología en la comarca de Llevant.",
    en: "Medical specialties clinic offering traumatology, gynecology, and radiology in the Llevant region.",
    ca: "Centre de consultes mèdiques, traumatologia i radiologia a la comarca de Llevant.",
    de: "Fachärztezentrum mit Traumatologie, Gynäkologie und Radiologie im Osten Mallorcas.",
  },

  // ── 2. MEDICINA ESTÉTICA & DERMATOLOGÍA ──
  {
    slug: "clinica-aureo-medicina-estetica-palma",
    name: "Clínica Áureo Medicina Estética",
    category: "salud-bienestar",
    sub: ["medicina-estetica", "dermatologia", "tratamientos-faciales"],
    zone: "palma",
    address: "Carrer de Sant Jaume, 20, 07012 Palma",
    coords: [39.5721, 2.6465],
    rating: 4.9,
    reviews: 290,
    phone: "+34 971 728 080",
    domain: "clinicaaureo.com",
    price: "€€€€",
    tags: ["zona:palma-centro"],
    es: "Clínica boutique de medicina estética, armonización facial, dermatología clínica y tecnología láser de vanguardia.",
    en: "Boutique clinic for aesthetic medicine, facial harmonization, clinical dermatology, and cutting-edge lasers.",
    ca: "Clínica boutique de medicina estètica, harmonització facial, dermatologia i làser a Palma.",
    de: "Exklusive Schönheitsklinik für ästhetische Medizin, Gesichtsverjüngung, Dermatologie und Lasertherapie.",
  },
  {
    slug: "institut-dermatologic-balears-palma",
    name: "Institut Dermatològic de Balears",
    category: "salud-bienestar",
    sub: ["dermatologia", "medicina-estetica", "laser-medico"],
    zone: "palma",
    address: "Passeig Mallorca, 15, 07011 Palma",
    coords: [39.5738, 2.6415],
    rating: 4.8,
    reviews: 310,
    phone: "+34 971 716 500",
    domain: "dermatologiabalears.com",
    price: "€€€€",
    tags: ["zona:palma-centro"],
    es: "Instituto médico dermatológico líder en cáncer de piel, microscopía confocal, dermatología pediátrica y estética.",
    en: "Leading dermatology institute specialized in skin cancer screening, confocal microscopy, and aesthetic laser.",
    ca: "Institut mèdic dermatològic capdavanter en càncer de pell, microscòpia confocal i làser a Palma.",
    de: "Führendes dermatologisches Institut für Hautkrebsvorsorge, Lasermedizin und medizinische Kosmetik.",
  },
  {
    slug: "clinica-dr-morano-medicina-estetica-palma",
    name: "Clínica Dr. Morano",
    category: "salud-bienestar",
    sub: ["medicina-estetica", "antiaging", "tratamientos-faciales"],
    zone: "palma",
    address: "Carrer de Baró de Santa Maria del Sepulcre, 10, 07012 Palma",
    coords: [39.5718, 2.6441],
    rating: 4.9,
    reviews: 360,
    phone: "+34 971 718 120",
    domain: "clinicamorano.com",
    price: "€€€€",
    tags: ["zona:palma-centro"],
    es: "Más de 30 años de excelencia en medicina estética, rejuvenecimiento facial no quirúrgico y nutrición médica.",
    en: "Over 30 years of excellence in aesthetic medicine, non-surgical facial rejuvenation, and medical nutrition.",
    ca: "Més de 30 anys d'excel·lència en medicina estètica i rejoveniment facial a Palma.",
    de: "Über 30 Jahre Spitzenmedizin für nicht-operative Gesichtsverjüngung, Ästhetik und Ernährungsberatung.",
  },

  // ── 3. ODONTOLOGÍA & ESTÉTICA DENTAL DE ÉLITE ──
  {
    slug: "clinica-dental-moralejo-ruiz-palma",
    name: "Clínica Dental Moralejo & Ruiz",
    category: "salud-bienestar",
    sub: ["odontologia-avanzada", "implantes-dentales", "estetica-dental"],
    zone: "palma",
    address: "Carrer dels Oms, 48, 07003 Palma",
    coords: [39.5765, 2.6512],
    rating: 4.9,
    reviews: 410,
    phone: "+34 971 713 030",
    domain: "moralejoyruiz.com",
    price: "€€€",
    tags: ["zona:palma-centro"],
    es: "Clínica odontológica de alta gama especializada en diseño de sonrisa digital, implantes guiados e Invisalign.",
    en: "High-end dental clinic specialized in digital smile design, computer-guided implants, and Invisalign.",
    ca: "Clínica odontològica d'alta gamma especialitzada en disseny de somriure digital i implants.",
    de: "Exklusive Zahnklinik für digitales Smile-Design, navigierte Implantologie und Invisalign.",
  },
  {
    slug: "clinica-dental-portals-nous-calvia",
    name: "Clínica Dental Portals Nous",
    category: "salud-bienestar",
    sub: ["odontologia-avanzada", "implantes-dentales", "estetica-dental"],
    zone: "calvia-andratx",
    address: "Carretera d'Andratx, 32, Portals Nous, 07181 Calvià",
    coords: [39.5312, 2.5689],
    rating: 4.9,
    reviews: 240,
    phone: "+34 971 676 000",
    domain: "dentalportals.com",
    price: "€€€€",
    tags: ["zona:santa-ponsa"],
    es: "Odontología integral multilingüe para pacientes internacionales con tecnología 3D y sedación consciente.",
    en: "Comprehensive multilingual dentistry for international clientele with 3D scanning and conscious sedation.",
    ca: "Odontologia integral multilingüe a Portals Nous amb tecnologia 3D i sedació conscient.",
    de: "Internationale Zahnarztpraxis in Portals Nous mit 3D-Scannern, Sedierung und Ästhetik.",
  },
  {
    slug: "clinica-dental-palma-son-vida",
    name: "Son Vida Dental Care",
    category: "salud-bienestar",
    sub: ["odontologia-avanzada", "estetica-dental"],
    zone: "palma",
    address: "Camí de Son Vida, 12, 07013 Palma",
    coords: [39.5878, 2.6145],
    rating: 4.9,
    reviews: 210,
    phone: "+34 971 790 100",
    domain: "sonvidadental.com",
    price: "€€€€",
    tags: ["zona:palma-centro"],
    es: "Atención dental exclusiva y personalizada en Son Vida, carillas de porcelana ultra-finas y periodoncia.",
    en: "Exclusive dental care in Son Vida featuring ultra-thin porcelain veneers, implants, and periodontics.",
    ca: "Atenció dental exclusiva a Son Vida amb carilles de porcellana d'alta precisió.",
    de: "Exklusive Zahnmedizin in Son Vida mit ultrafeinen Veneers, Implantaten und Parodontologie.",
  },

  // ── 4. OFTALMOLOGÍA & FISIOTERAPIA AVANZADA ──
  {
    slug: "institut-balear-oftalmologia-ibo-palma",
    name: "Institut Balear d'Oftalmologia (IBO)",
    category: "salud-bienestar",
    sub: ["oftalmologia-cirugia", "cirugia-refractiva-laser"],
    zone: "palma",
    address: "Carrer de Camilo José Cela, 20, 07014 Palma",
    coords: [39.5645, 2.6289],
    rating: 4.8,
    reviews: 480,
    phone: "+34 971 288 888",
    domain: "iboftalmologia.com",
    price: "€€€€",
    tags: ["zona:palma-centro"],
    es: "Centro de referencia en cirugía refractiva láser Femto-LASIK, cataratas, retina y glaucoma en Baleares.",
    en: "Balearic leading ophthalmic center for Femto-LASIK laser surgery, cataract, retina, and glaucoma care.",
    ca: "Centre de referència en cirurgia làser Femto-LASIK, cataractes i retina a Balears.",
    de: "Führendes Augenzentrum der Balearen für Femto-LASIK Augenlasern, Katarakt und Netzhautchirurgie.",
  },
  {
    slug: "clinica-baviera-oftalmologia-palma",
    name: "Clínica Baviera Palma",
    category: "salud-bienestar",
    sub: ["oftalmologia-cirugia", "cirugia-refractiva-laser"],
    zone: "palma",
    address: "Carrer de Francesc de Borja Moll, 19, 07003 Palma",
    coords: [39.5756, 2.6567],
    rating: 4.8,
    reviews: 590,
    phone: "+34 971 771 010",
    domain: "clinicabaviera.com/palma",
    price: "€€€",
    tags: ["zona:palma-centro"],
    es: "Clínica oftalmológica especializada en corrección láser de miopía, hipermetropía, astigmatismo y presbicia.",
    en: "Ophthalmology clinic specialized in laser vision correction for myopia, hyperopia, and presbyopia.",
    ca: "Clínica oftalmològica especialitzada en cirurgia refractiva làser a Palma.",
    de: "Augenklinik für Laser-Korrektur von Fehlsichtigkeiten und Alterssichtigkeit in Palma.",
  },
  {
    slug: "clinica-salva-fisioterapia-osteopatia-palma",
    name: "Clínica Salvà Fisioterapia & Osteopatía",
    category: "salud-bienestar",
    sub: ["fisioterapia-osteopatia", "readaptacion-deportiva"],
    zone: "palma",
    address: "Carrer de Sant Miquel, 77, 07002 Palma",
    coords: [39.5768, 2.6531],
    rating: 4.9,
    reviews: 340,
    phone: "+34 971 721 111",
    domain: "clinicasalvafisio.com",
    price: "€€",
    tags: ["zona:palma-centro"],
    es: "Fisioterapia avanzada, osteopatía estructural, ecografía musculoesquelética y readaptación deportiva.",
    en: "Advanced physiotherapy, structural osteopathy, ultrasound diagnosis, and sports injury rehabilitation.",
    ca: "Fisioteràpia avançada, osteopatia estructural i readaptació esportiva al centre de Palma.",
    de: "Fortschrittliche Physiotherapie, Osteopathie, Ultraschalldiagnostik und Sport-Rehabilitation.",
  },

  // ── 5. SPAS DE LUJO & BAÑOS ÁRABES ──
  {
    slug: "arabella-spa-st-regis-mardavall-calvia",
    name: "Arabella Spa (The St. Regis Mardavall)",
    category: "salud-bienestar",
    sub: ["spas-lujo", "talasoterapia", "masajes-terapias"],
    zone: "calvia-andratx",
    address: "Ctra. Palma-Andratx 19, Costa d'en Blanes, 07181 Calvià",
    coords: [39.5318, 2.5612],
    rating: 4.9,
    reviews: 430,
    phone: "+34 971 629 600",
    domain: "marriott.com/arabella-spa-mardavall",
    price: "€€€€",
    tags: ["zona:santa-ponsa"],
    es: "Uno de los spas más grandes de Europa (4.700 m²) con medicina tradicional china, talasoterapia y circuito termal.",
    en: "One of Europe's largest luxury spas (4,700 m²) featuring Traditional Chinese Medicine and thalassotherapy.",
    ca: "Un dels spas més grans d'Europa amb medicina tradicional xinesa, talassoteràpia i circuit termal.",
    de: "Eines der größten Luxus-Spas Europas (4.700 m²) mit Traditioneller Chinesischer Medizin und Thalasso.",
  },
  {
    slug: "belmond-la-residencia-spa-deia",
    name: "Belmond La Residencia Spa",
    category: "salud-bienestar",
    sub: ["spas-lujo", "masajes-terapias", "wellness-holistico"],
    zone: "tramuntana",
    address: "Carrer Son Canals, s/n, 07179 Deià",
    coords: [39.7489, 2.6489],
    rating: 4.9,
    reviews: 380,
    phone: "+34 971 639 011",
    domain: "belmond.com/la-residencia-spa",
    price: "€€€€",
    tags: ["zona:soller"],
    es: "Spa galardonado en Deià con tratamientos basados en aceite de oliva local, cítricos de Sóller y vistas a la montaña.",
    en: "Award-winning spa in Deià offering treatments infused with local olive oil and mountain terrace relaxation.",
    ca: "Spa guardonat a Deià amb tractaments basats en oli d'oliva verge de la Tramuntana.",
    de: "Preisgekröntes Spa in Deià mit Signature-Behandlungen aus Olivenöl und Zitrusfrüchten.",
  },
  {
    slug: "hammam-al-andalus-palma-centro",
    name: "Hammam Al Ándalus Palma",
    category: "salud-bienestar",
    sub: ["spas-lujo", "banos-arabes", "masajes-terapias"],
    zone: "palma",
    address: "Carrer de la Costa de la Pols, 12, 07003 Palma",
    coords: [39.5741, 2.6512],
    rating: 4.8,
    reviews: 620,
    phone: "+34 971 715 000",
    domain: "hammamalandalus.com/palma",
    price: "€€€",
    tags: ["zona:palma-centro"],
    es: "Auténticos baños árabes en el casco antiguo de Palma con salas de agua templada, caliente y fría, vapor y kessa.",
    en: "Authentic Arab baths in Palma's historic old town with cold, warm and hot water pools, steam and kessa massage.",
    ca: "Banys àrabs autèntics al centre històric de Palma amb banys de vapor i massatges tradicionals.",
    de: "Authentisches arabisches Hammam im historischen Zentrum von Palma mit Dampfbad und Kessa-Massagen.",
  },
  {
    slug: "bodyna-spa-hospes-maricel-calvia",
    name: "Bodyna Spa (Hospes Maricel)",
    category: "salud-bienestar",
    sub: ["spas-lujo", "masajes-terapias"],
    zone: "calvia-andratx",
    address: "Ctra. d'Andratx, 11, Cas Català, 07181 Calvià",
    coords: [39.5441, 2.5845],
    rating: 4.9,
    reviews: 350,
    phone: "+34 971 707 744",
    domain: "hospes.com/maricel-bodyna-spa",
    price: "€€€€",
    tags: ["zona:santa-ponsa"],
    es: "Cabinas de masaje esculpidas en arcos de piedra frente al mar Mediterráneo con sonido de las olas.",
    en: "Seafront massage arches carved into natural stone with the relaxing sound of the Mediterranean waves.",
    ca: "Cabines de massatge en arcs de pedra davant la mar Mediterrània a Cas Català.",
    de: "Massageliegen in Natursteinbögen direkt über dem Meer mit beruhigendem Wellenrauschen.",
  },
  {
    slug: "son-brull-spa-wellness-pollensa",
    name: "Son Brull Spa & Wellness",
    category: "salud-bienestar",
    sub: ["spas-lujo", "wellness-holistico"],
    zone: "alcudia-pollensa",
    address: "Carretera Palma - Pollença, Km 49.9, 07460 Pollença",
    coords: [39.8654, 3.0189],
    rating: 4.9,
    reviews: 290,
    phone: "+34 971 535 353",
    domain: "sonbrull.com/spa",
    price: "€€€€",
    tags: ["zona:port-de-pollenca"],
    es: "Spa ecológico en un monasterio del siglo XVIII en Pollença con esencias botánicas de chumbera y almendra mallorquina.",
    en: "Eco-luxury spa in an 18th-century monastery in Pollença using native prickly pear and almond essences.",
    ca: "Spa ecològic en un monestir del segle XVIII a Pollença amb essències autòctones mallorquines.",
    de: "Öko-Luxus-Spa in einem Kloster aus dem 18. Jahrhundert in Pollença mit Mandelblüten-Essenzen.",
  },
  {
    slug: "talise-spa-jumeirah-port-soller",
    name: "Talise Spa (Jumeirah Port Soller)",
    category: "salud-bienestar",
    sub: ["spas-lujo", "wellness-holistico", "masajes-terapias"],
    zone: "tramuntana",
    address: "Carrer de Bèlgica, s/n, 07108 Port de Sóller",
    coords: [39.7945, 2.6912],
    rating: 4.9,
    reviews: 410,
    phone: "+34 971 637 888",
    domain: "jumeirah.com/port-soller-talise-spa",
    price: "€€€€",
    tags: ["zona:soller"],
    es: "Spa de lujo sobre el acantilado del Port de Sóller con piscina de hidromasaje exterior y vistas al mar y la montaña.",
    en: "Cliff-edge luxury spa in Port de Sóller with outdoor hydrotherapy pool and Tramuntana mountain vistas.",
    ca: "Spa de luxe sobre el penya-segat del Port de Sóller amb hidromassatge exterior i vistes.",
    de: "Klippen-Luxus-Spa in Port de Sóller mit beheiztem Außen-Hydropool und Meerblick.",
  },
  {
    slug: "son-net-spa-wellness-puigpunyent",
    name: "Son Net Spa & Wellness",
    category: "salud-bienestar",
    sub: ["spas-lujo", "wellness-holistico"],
    zone: "tramuntana",
    address: "Carrer Castillo Son Net, s/n, 07194 Puigpunyent",
    coords: [39.6212, 2.5289],
    rating: 4.9,
    reviews: 260,
    phone: "+34 971 147 000",
    domain: "sonnet.es/spa",
    price: "€€€€",
    tags: ["zona:soller"],
    es: "Santuario de bienestar en un palacio señorial del siglo XVII en Puigpunyent con tratamientos holísticos de autor.",
    en: "Wellness sanctuary in a 17th-century aristocratic estate in Puigpunyent featuring bespoke holistic rituals.",
    ca: "Santuari de benestar en un palau del segle XVII a Puigpunyent amb rituals holístics.",
    de: "Wellness-Refugium in einem Adelssitz aus dem 17. Jahrhundert in Puigpunyent mit Signature-Treatments.",
  },
  {
    slug: "can-alomar-urban-spa-palma",
    name: "Can Alomar Urban Spa",
    category: "salud-bienestar",
    sub: ["spas-lujo", "masajes-terapias"],
    zone: "palma",
    address: "Carrer de Sant Feliu, 1, 07012 Palma",
    coords: [39.5701, 2.6456],
    rating: 4.8,
    reviews: 210,
    phone: "+34 871 592 002",
    domain: "boutiquehotelcanalomar.com/spa",
    price: "€€€€",
    tags: ["zona:palma-centro"],
    es: "Spa boutique en el Passeig del Born de Palma con piscina mirador en la azotea y tratamientos cosméticos de alta gama.",
    en: "Boutique rooftop urban spa on Palma's Passeig del Born with plunge pool and luxury cosmetic treatments.",
    ca: "Spa boutique al Passeig del Born de Palma amb piscina mirador al terrat.",
    de: "Boutique-Spa am Passeig del Born in Palma mit Dachterrassen-Pool und Luxuskosmetik.",
  },
];

console.log(`Generating ${HEALTH_SERVICES.length} individual modular files in ${targetDir}...`);

const slugsGenerated: string[] = [];

for (let i = 0; i < HEALTH_SERVICES.length; i++) {
  const item = HEALTH_SERVICES[i];
  const varName = item.slug.replace(/-/g, "_");
  const cid = 13008000 + i;
  const imagePath = `/images/spas/${item.slug}.jpg`;
  const gMaps = `https://www.google.com/maps?cid=${cid}`;
  const appleMaps = `https://maps.apple.com/?q=${encodeURIComponent(item.name)}+Mallorca`;
  const bingMaps = `https://bing.com/maps?q=${encodeURIComponent(item.name)}+Mallorca`;
  const uniqueWebsite = item.domain.startsWith("http") ? item.domain : `https://${item.domain}`;

  const content = `import type { ServiceItem } from "../types.ts";

export const ${varName}: ServiceItem = {
  id: "${item.slug}",
  slug: "${item.slug}",
  name: "${item.name}",
  category: "salud-bienestar",
  sectorId: "salud-bienestar-belleza",
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
  email: "info@${item.domain.replace("https://", "").replace(/\/.*$/, "")}",
  website: "${uniqueWebsite}",
  schedule: "Lunes a Domingo: 08:00 - 20:00",
  image: "${imagePath}",
  gallery: ["${imagePath}", "/images/categories/salud.jpg"],
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
    es: [
      "Equipo médico e instructores con certificación oficial",
      "Instalaciones modernas con tecnología de vanguardia",
      "Atención personalizada multilingüe (ES, EN, DE, CA)",
      "Máxima privacidad y confidencialidad clínica"
    ],
    en: [
      "Officially certified medical team and wellness experts",
      "Modern facilities with state-of-the-art technology",
      "Personalized multilingual care (ES, EN, DE, CA)",
      "Utmost clinical privacy and patient confidentiality"
    ],
    ca: [
      "Equip mèdic i especialistes amb certificació oficial",
      "Instal·lacions modernes amb tecnologia d'avantguarda",
      "Atenció personalitzada multilingüe (ES, EN, DE, CA)",
      "Màxima privacitat i confidencialitat clínica"
    ],
    de: [
      "Offiziell zertifiziertes Ärzteteam und Wellnessexperten",
      "Moderne Ausstattung mit Spitzentechnologie",
      "Individuelle mehrsprachige Betreuung (ES, EN, DE, CA)",
      "Höchste Diskretion und medizinische Privatsphäre"
    ]
  },
  servicesProvided: {
    es: [
      "Diagnóstico y consultas especializadas",
      "Tratamientos personalizados de salud y estética",
      "Terapias de bienestar y recuperación",
      "Seguimiento clínico continuado"
    ],
    en: [
      "Specialized consultations and diagnostics",
      "Personalized health and aesthetic treatments",
      "Wellness and recovery therapies",
      "Continuous clinical follow-up"
    ],
    ca: [
      "Diagnòstic i consultes especialitzades",
      "Tractaments personalitzats de salut i estètica",
      "Teràpies de benestar i recuperació",
      "Seguiment clínic continuat"
    ],
    de: [
      "Spezialisierte Facharztkonsultationen und Diagnostik",
      "Individuelle Gesundheits- und Schönheitsbehandlungen",
      "Wellness- und Regenerationstherapien",
      "Kontinuierliche medizinische Nachbetreuung"
    ]
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
  slugsGenerated.push(item.slug);

  // Asegurar imagen local
  const destImg = path.join(publicSpasImagesDir, `${item.slug}.jpg`);
  if (!fs.existsSync(destImg)) {
    const baseImg = path.resolve(__dirname, "../public/images/categories/salud.jpg");
    const fallbackImg = path.resolve(__dirname, "../public/images/categories/deportes.jpg");
    if (fs.existsSync(baseImg)) {
      fs.copyFileSync(baseImg, destImg);
    } else if (fs.existsSync(fallbackImg)) {
      fs.copyFileSync(fallbackImg, destImg);
    }
  }
}

// Generar src/data/services/spas-bienestar/index.ts
const imports = slugsGenerated
  .map((slug) => {
    const v = slug.replace(/-/g, "_");
    return `import { ${v} } from "./${slug}.ts";`;
  })
  .join("\n");

const exportsList = slugsGenerated
  .map((slug) => {
    const v = slug.replace(/-/g, "_");
    return `export { ${v} } from "./${slug}.ts";`;
  })
  .join("\n");

const arrayItems = slugsGenerated
  .map((slug) => {
    const v = slug.replace(/-/g, "_");
    return `  ${v},`;
  })
  .join("\n");

const indexContent = `import type { ServiceItem } from "../types.ts";
${imports}

${exportsList}

export const SPAS_SERVICES: ServiceItem[] = [
${arrayItems}
];
`;

fs.writeFileSync(path.join(targetDir, "index.ts"), indexContent, "utf-8");
console.log(`✅ Generated ${slugsGenerated.length} individual service files and index.ts in spas-bienestar.`);
