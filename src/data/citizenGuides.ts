/**
 * citizenGuides.ts
 *
 * Catálogo Canónico de Guías Oficiales y Trámites al Ciudadano de Mallorca.
 * Rige la sección /guias del portal.
 * Cumple con GR-03 (TypeScript estricto), GR-04 (i18n cuatrilingüe),
 * GR-11 (Zero Fake Data: datos 100% oficiales contrastados) y GR-12 (Coordenadas reales).
 */

export type OfficialEntity =
  | "Govern CAIB"
  | "Consell de Mallorca"
  | "Ajuntament de Palma"
  | "Ajuntament de Calvià"
  | "Ajuntament de Manacor"
  | "Ajuntament d'Inca"
  | "Servei de Salut (Ib-Salut)"
  | "Ministerio del Interior / Extranjería";

export type GuideCategory = "padron" | "transporte" | "salud" | "extranjeria" | "vehiculos" | "vivienda" | "tributos";

export interface GuideStep {
  stepNumber: number;
  title: { es: string; ca: string; en: string; de: string };
  description: { es: string; ca: string; en: string; de: string };
  channel: "online" | "presencial" | "ambos";
  officialUrl?: string;
  importantNotice?: { es?: string; ca?: string; en?: string; de?: string };
}

export interface GuideDocument {
  id: string;
  name: { es: string; ca: string; en: string; de: string };
  isMandatory: boolean;
  helpTip?: { es?: string; ca?: string; en?: string; de?: string };
}

export interface GuideOffice {
  name: string;
  address: string;
  municipality: string;
  zone: string;
  phone: string;
  appointmentUrl: string;
  coordinates: { lat: number; lng: number };
}

export interface CitizenGuide {
  id: string;
  slug: string;
  icon: string;
  title: { es: string; ca: string; en: string; de: string };
  summary: { es: string; ca: string; en: string; de: string };
  category: GuideCategory;
  officialEntity: OfficialEntity;
  officialSourceUrl: string;
  officialLastAudited: string; // YYYY-MM-DD
  fee: {
    isFree: boolean;
    amount?: number;
    currency: "EUR";
    description?: { es?: string; ca?: string; en?: string; de?: string };
  };
  estimatedTime: { es: string; ca: string; en: string; de: string };
  validityYears?: number;
  documents: GuideDocument[];
  steps: GuideStep[];
  offices: GuideOffice[];
  faqs: Array<{
    question: { es: string; ca: string; en: string; de: string };
    answer: { es: string; ca: string; en: string; de: string };
  }>;
  relatedServiceCategories: string[];
}

export const CITIZEN_GUIDES: CitizenGuide[] = [
  {
    id: "empadronamiento-palma",
    slug: "empadronamiento-palma",
    icon: "📋",
    title: {
      es: "Empadronamiento en Palma de Mallorca (Padrón Municipal)",
      ca: "Empadronament a Palma de Mallorca (Padró Municipal)",
      en: "Town Hall Registration in Palma (Padrón Municipal)",
      de: "Anmeldung beim Einwohnermeldeamt Palma (Padrón Municipal)",
    },
    summary: {
      es: "Guía oficial paso a paso para inscribirte en el Padrón Municipal de Palma, obtener tu certificado de residencia y acceder a servicios públicos y descuentos insulares.",
      ca: "Guia oficial pas a pas per inscriure't al Padró Municipal de Palma, obtenir el certificat de residència i accedir a serveis públics i descomptes insulars.",
      en: "Official step-by-step guide to register on Palma's municipal census, get your residency certificate, and access local public services and island discounts.",
      de: "Offizielle Schritt-für-Schritt-Anleitung zur Anmeldung beim Einwohnermeldeamt in Palma für den Wohnsitznachweis und Inselrabatte.",
    },
    category: "padron",
    officialEntity: "Ajuntament de Palma",
    officialSourceUrl: "https://www.palma.cat",
    officialLastAudited: "2026-08-28",
    fee: {
      isFree: true,
      currency: "EUR",
      description: {
        es: "Trámite 100% gratuito en todas las oficinas OAC y sede telemática.",
        ca: "Tràmit 100% gratuït a totes les oficines OAC i seu telemàtica.",
        en: "100% free procedure at all citizen service offices and online portal.",
        de: "100% gebührenfreier Vorgang in allen Bürgerämtern und online.",
      },
    },
    estimatedTime: {
      es: "Presencial: Inmediato (con cita previa) · Online: 3 a 5 días hábiles",
      ca: "Presencial: Immediat (amb cita prèvia) · En línia: 3 a 5 dies hàbils",
      en: "In person: Instant (with appointment) · Online: 3 to 5 business days",
      de: "Vor Ort: Sofort (mit Termin) · Online: 3 bis 5 Werktage",
    },
    documents: [
      {
        id: "doc-id",
        name: {
          es: "DNI, Pasaporte o NIE/TIE original en vigor",
          ca: "DNI, Passaport o NIE/TIE original en vigor",
          en: "Original valid ID, Passport or NIE/TIE",
          de: "Gültiger Original-Personalausweis, Reisepass oder NIE/TIE",
        },
        isMandatory: true,
      },
      {
        id: "doc-housing",
        name: {
          es: "Título de propiedad (Escritura/Nota simple) o Contrato de arrendamiento en vigor con depósito IBAVI",
          ca: "Títol de propietat (Escriptura/Nota simple) o Contracte d'arrendament en vigor amb dipòsit IBAVI",
          en: "Title deed or active tenancy agreement with IBAVI deposit certificate",
          de: "Eigentumsurkunde oder gültiger Mietvertrag mit IBAVI-Kautionsnachweis",
        },
        isMandatory: true,
        helpTip: {
          es: "Si alquilas, la fianza debe estar depositada obligatoriamente en el Institut Balear de l'Habitatge (IBAVI).",
          ca: "Si estàs de lloguer, la fiança ha d'estar dipositada obligatòriament a l'IBAVI.",
          en: "Tenancy rental deposits in the Balearic Islands must be registered with IBAVI.",
          de: "Bei Mietverhältnissen auf den Balearen muss die Kaution beim IBAVI hinterlegt sein.",
        },
      },
      {
        id: "doc-owner-auth",
        name: {
          es: "Autorización de empadronamiento firmada por el titular de la vivienda (si no eres el arrendatario principal)",
          ca: "Autorització d'empadronament signada pel titular de l'habitatge (si no ets l'arrendatari principal)",
          en: "Registration authorization signed by the property owner/tenant (if co-living)",
          de: "Wohnungsgeberbestätigung / Einverständniserklärung des Wohnungsinhabers",
        },
        isMandatory: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          es: "Solicitar cita previa en la OAC o acceder a la Sede Electrónica",
          ca: "Demanar cita prèvia a l'OAC o accedir a la Seu Electrònica",
          en: "Book an appointment at an OAC office or access the Online Portal",
          de: "Termin beim Bürgeramt (OAC) buchen oder das Online-Portal aufrufen",
        },
        description: {
          es: "Reserva tu turno en palma.cat seleccionando 'Padró d'Habitants' o identifícate con Cl@ve / Certificado Digital.",
          ca: "Reserva el teu torn a palma.cat seleccionant 'Padró d'Habitants' o identifica't amb Cl@ve / Certificat Digital.",
          en: "Book your time slot on palma.cat selecting 'Padró d'Habitants' or log in via Cl@ve / Digital Certificate.",
          de: "Buchen Sie Ihren Termin auf palma.cat unter 'Padró d'Habitants' oder nutzen Sie Cl@ve / digitales Zertifikat.",
        },
        channel: "ambos",
        officialUrl: "https://www.palma.cat",
      },
      {
        stepNumber: 2,
        title: {
          es: "Presentar la documentación original y firmar la hoja de inscripción",
          ca: "Presentar la documentació original i signar el full d'inscripció",
          en: "Present original documents and sign the registration form",
          de: "Originalunterlagen vorlegen und das Anmeldeformular unterschreiben",
        },
        description: {
          es: "El funcionario municipal comprobará los documentos de identidad y el título de la vivienda emitiendo el volante de empadronamiento.",
          ca: "El funcionari municipal comprovarà els documents d'identitat i el títol de l'habitatge emetent el volant d'empadronament.",
          en: "The municipal clerk will review identity papers and property tenancy title, issuing your registration certificate on the spot.",
          de: "Der Sachbearbeiter prüft die Identitätsdokumente sowie den Mietvertrag und stellt die Meldebescheinigung direkt aus.",
        },
        channel: "presencial",
      },
    ],
    offices: [
      {
        name: "OAC Cort (Centro Histórico)",
        address: "Plaça de Cort, 1, 07001 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 22 59 00",
        appointmentUrl: "https://www.palma.cat",
        coordinates: { lat: 39.5696, lng: 2.6502 },
      },
      {
        name: "OAC Sant Ferran (Policía Local)",
        address: "Avinguda de Sant Ferran, 42, 07013 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 22 59 00",
        appointmentUrl: "https://www.palma.cat",
        coordinates: { lat: 39.5781, lng: 2.6372 },
      },
      {
        name: "OAC Pere Garau",
        address: "Carrer de Pere Llofriu, 26, 07007 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 22 59 00",
        appointmentUrl: "https://www.palma.cat",
        coordinates: { lat: 39.5745, lng: 2.6625 },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Tiene algún coste empadronarse en Palma?",
          ca: "Té algun cost empadronar-se a Palma?",
          en: "Is there any fee to register on Palma's municipal census?",
          de: "Fallen für die Anmeldung in Palma Gebühren an?",
        },
        answer: {
          es: "No. El trámite es completamente gratuito en todas las oficinas públicas del Ajuntament de Palma.",
          ca: "No. El tràmit és totalment gratuït a totes les oficines públiques de l'Ajuntament de Palma.",
          en: "No. The procedure is entirely free of charge across all Palma Town Hall offices.",
          de: "Nein. Der Vorgang ist in allen Bürgerämtern der Stadt Palma absolut kostenlos.",
        },
      },
      {
        question: {
          es: "¿Caduca el empadronamiento?",
          ca: "Caduca l'empadronament?",
          en: "Does municipal town hall registration expire?",
          de: "Läuft die Wohnsitzanmeldung ab?",
        },
        answer: {
          es: "Para ciudadanos españoles y comunitarios (UE) es permanente hasta que cambies de domicilio. Para ciudadanos no comunitarios sin residencia permanente debe renovarse cada dos años.",
          ca: "Per a ciutadans espanyols i comunitaris (UE) és permanent fins que canviïs de domicili. Per a no comunitaris sense residència de llarga durada s'ha de renovar cada dos anys.",
          en: "For Spanish and EU citizens it does not expire unless you move. For non-EU citizens without permanent residency it must be renewed every 2 years.",
          de: "Für spanische und EU-Bürger gilt die Anmeldung unbefristet bis zum Umzug. Für Nicht-EU-Bürger ohne Daueraufenthalt muss sie alle zwei Jahre erneuert werden.",
        },
      },
    ],
    relatedServiceCategories: ["abogados-gestorias", "inmobiliarias-propiedad"],
  },
  {
    id: "tarjeta-ciudadana-palma",
    slug: "tarjeta-ciudadana-palma",
    icon: "💳",
    title: {
      es: "Tarjeta Ciudadana de Palma (Bonificaciones EMT y SMAP)",
      ca: "Targeta Ciutadana de Palma (Bonificacions EMT i SMAP)",
      en: "Palma Citizen Card (EMT Bus & SMAP Discounts)",
      de: "Bürgerkarte Palma (EMT Bus- & Parkrabatte)",
    },
    summary: {
      es: "Descubre cómo conseguir la Tarjeta Ciudadana de Palma para viajar gratis o con descuentos en los autobuses de la EMT, BiciPalma, parkings y polideportivos municipales.",
      ca: "Descobreix com aconseguir la Targeta Ciutadana de Palma per viatjar de franc o amb descomptes als autobusos de l'EMT, BiciPalma, pàrkings i poliesportius municipals.",
      en: "Learn how to obtain Palma's Citizen Card for free or discounted EMT bus rides, BiciPalma bike share, public parking, and municipal sports facilities.",
      de: "Erfahren Sie, wie Sie die Bürgerkarte von Palma für kostenlose oder vergünstigte EMT-Busfahrten, BiciPalma, Parkhäuser und Sportstätten erhalten.",
    },
    category: "transporte",
    officialEntity: "Ajuntament de Palma",
    officialSourceUrl: "https://www.emtpalma.cat",
    officialLastAudited: "2026-08-25",
    fee: {
      isFree: true,
      currency: "EUR",
      description: {
        es: "Primera emisión gratuita para personas empadronadas en Palma.",
        ca: "Primera emissió gratuïta per a persones empadronades a Palma.",
        en: "First issue is free for registered residents of Palma.",
        de: "Erstausstellung für in Palma gemeldete Einwohner kostenlos.",
      },
    },
    estimatedTime: {
      es: "Inmediata en cualquier oficina OAC",
      ca: "Immediata a qualsevol oficina OAC",
      en: "Instant issuance at any OAC citizen office",
      de: "Sofortige Ausstellung in jedem Bürgeramt (OAC)",
    },
    documents: [
      {
        id: "doc-id",
        name: {
          es: "DNI, NIE o Pasaporte original en vigor",
          ca: "DNI, NIE o Passaport original en vigor",
          en: "Original valid national ID, NIE or Passport",
          de: "Gültiger Original-Personalausweis, NIE oder Reisepass",
        },
        isMandatory: true,
      },
      {
        id: "doc-photo",
        name: {
          es: "Fotografía tamaño carnet (si no dispones de foto digital en el registro)",
          ca: "Fotografia mida carnet (si no disposes de foto digital al registre)",
          en: "Passport-size photograph (if no digital picture is on file)",
          de: "Passfoto (falls noch kein digitales Foto hinterlegt ist)",
        },
        isMandatory: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          es: "Comprobar que estás de alta en el Padrón de Palma",
          ca: "Comprovar que estàs d'alta al Padró de Palma",
          en: "Ensure you are registered on Palma's town hall census",
          de: "Prüfen, ob Sie im Melderegister von Palma eingetragen sind",
        },
        description: {
          es: "Es requisito imprescindible estar empadronado en el municipio de Palma para acceder a las tarifas y gratuidades de residente.",
          ca: "És requisit imprescindible estar empadronat al municipi de Palma per gaudir de les tarifes i gratuïtats de resident.",
          en: "Being registered on Palma's municipal roll is mandatory to access resident fare discounts and concessions.",
          de: "Die offizielle Wohnsitzanmeldung in Palma ist Voraussetzung für die rabattierten bzw. kostenlosen Tarife.",
        },
        channel: "ambos",
      },
      {
        stepNumber: 2,
        title: {
          es: "Acudir a una OAC para la expedición de la tarjeta",
          ca: "Anar a una OAC per a l'expedició de la targeta",
          en: "Visit an OAC office for card issuance",
          de: "Bürgeramt (OAC) zur Kartenausstellung aufsuchen",
        },
        description: {
          es: "Te imprimirán la tarjeta en el acto configurando tu perfil correspondiente (residente, estudiante, jubilado o menor).",
          ca: "T'imprimiran la targeta a l'acte configurant el teu perfil (resident, estudiant, jubilat o menor).",
          en: "The clerk will print your card immediately and activate your profile (resident, student, senior or minor).",
          de: "Die Karte wird direkt gedruckt und für Ihr jeweiliges Profil (Einwohner, Student, Rentner oder Kind) aktiviert.",
        },
        channel: "presencial",
      },
    ],
    offices: [
      {
        name: "OAC Avingudes",
        address: "Avinguda de Gabriel Alomar, 18, 07006 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 22 59 00",
        appointmentUrl: "https://www.palma.cat",
        coordinates: { lat: 39.5684, lng: 2.6565 },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Los menores de 16 años viajan gratis en la EMT con la tarjeta?",
          ca: "Els menors de 16 anys viatgen gratis a l'EMT amb la targeta?",
          en: "Do children under 16 travel for free on EMT buses with the card?",
          de: "Fahren Kinder unter 16 Jahren mit der Bürgerkarte kostenlos im EMT-Bus?",
        },
        answer: {
          es: "Sí. Los menores empadronados tienen perfil gratuito al 100% en todas las líneas regulares urbanas de la EMT Palma.",
          ca: "Sí. Els menors empadronats tenen perfil gratuït al 100% a totes les línies regulars urbanes de l'EMT Palma.",
          en: "Yes. Registered resident children under 16 enjoy 100% free travel across all EMT Palma urban routes.",
          de: "Ja. Gemeldete Kinder unter 16 Jahren fahren auf allen regulären EMT-Stadtbuslinien zu 100% kostenlos.",
        },
      },
    ],
    relatedServiceCategories: ["motor-transporte", "deportes-aire-libre"],
  },
  {
    id: "itv-cita-previa-mallorca",
    slug: "itv-cita-previa-mallorca",
    icon: "🚗",
    title: {
      es: "Cita Previa e Inspección Técnica ITV en Mallorca (Consell)",
      ca: "Cita Prèvia i Inspecció Tècnica ITV a Mallorca (Consell)",
      en: "ITV Vehicle Inspection in Mallorca (Stations & Appointments)",
      de: "TÜV / ITV Fahrzeuginspektion auf Mallorca (Termine & Stationen)",
    },
    summary: {
      es: "Guía completa para pasar la ITV a tu coche, moto o furgoneta en las 5 estaciones oficiales del Consell de Mallorca: Can Valero, Son Castelló, Inca, Manacor y Calvià.",
      ca: "Guia completa per passar la ITV al teu cotxe, moto o furgoneta a les 5 estacions oficials del Consell de Mallorca: Can Valero, Son Castelló, Inca, Manacor i Calvià.",
      en: "Comprehensive guide to pass your mandatory ITV vehicle inspection at Mallorca Council's 5 official stations: Can Valero, Son Castelló, Inca, Manacor, and Calvià.",
      de: "Komplette Anleitung zur Hauptuntersuchung (ITV) für Auto oder Motorrad an den 5 offiziellen Stationen des Inselrats auf Mallorca.",
    },
    category: "vehiculos",
    officialEntity: "Consell de Mallorca",
    officialSourceUrl: "https://serviciositv.conselldemallorca.cat",
    officialLastAudited: "2026-08-30",
    fee: {
      isFree: false,
      amount: 35.5,
      currency: "EUR",
      description: {
        es: "Turismos gasolina aprox. 35,50 € · Turismos diésel aprox. 50,20 € · Motos aprox. 16,50 €",
        ca: "Turismes gasolina aprox. 35,50 € · Turismes dièsel aprox. 50,20 € · Motos aprox. 16,50 €",
        en: "Petrol cars approx. €35.50 · Diesel cars approx. €50.20 · Motorcycles approx. €16.50",
        de: "Benzin-Pkw ca. 35,50 € · Diesel-Pkw ca. 50,20 € · Motorräder ca. 16,50 €",
      },
    },
    estimatedTime: {
      es: "25 a 40 minutos en línea de inspección",
      ca: "25 a 40 minuts en línia d'inspecció",
      en: "25 to 40 minutes on the inspection lane",
      de: "25 bis 40 Minuten auf der Prüfgasse",
    },
    documents: [
      {
        id: "doc-permiso",
        name: {
          es: "Permiso de Circulación original del vehículo",
          ca: "Permís de Circulació original del vehicle",
          en: "Original vehicle registration certificate (Permiso de Circulación)",
          de: "Original-Fahrzeugschein (Permiso de Circulación)",
        },
        isMandatory: true,
      },
      {
        id: "doc-ficha-tecnica",
        name: {
          es: "Tarjeta de Inspección Técnica (Ficha Técnica verde o e-ITV)",
          ca: "Targeta d'Inspecció Tècnica (Fitxa Tècnica verda o e-ITV)",
          en: "Technical Inspection Card (Ficha Técnica paper or digital e-ITV)",
          de: "Fahrzeugdatenblatt / Prüfkarte (Ficha Técnica)",
        },
        isMandatory: true,
      },
      {
        id: "doc-seguro",
        name: {
          es: "Acreditación del seguro obligatorio vigente (comprobado telemáticamente vía FIVA)",
          ca: "Acreditació de l'assegurança obligatòria vigent (comprovat per FIVA)",
          en: "Proof of active mandatory car insurance (verified via FIVA registry)",
          de: "Nachweis der gültigen Kfz-Haftpflichtversicherung",
        },
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          es: "Reservar cita en la plataforma oficial del Consell de Mallorca",
          ca: "Reservar cita a la plataforma oficial del Consell de Mallorca",
          en: "Book your appointment on Mallorca Council's official portal",
          de: "Termin auf dem offiziellen Portal des Inselrats Mallorca buchen",
        },
        description: {
          es: "Accede únicamente a serviciositv.conselldemallorca.cat o llama al 971 17 08 00 evitando intermediarios fraudulentos.",
          ca: "Accedeix únicament a serviciositv.conselldemallorca.cat o telefona al 971 17 08 00 evitant intermediaris fraudulents.",
          en: "Only access serviciositv.conselldemallorca.cat or call 971 17 08 00 to avoid non-official fee-charging third parties.",
          de: "Nutzen Sie ausschließlich serviciositv.conselldemallorca.cat oder Tel. 971 17 08 00, um dubiose Drittanbieter zu meiden.",
        },
        channel: "online",
        officialUrl: "https://serviciositv.conselldemallorca.cat",
      },
      {
        stepNumber: 2,
        title: {
          es: "Presentar el vehículo en la estación seleccionada",
          ca: "Presentar el vehicle a l'estació seleccionada",
          en: "Bring the vehicle to the chosen inspection station",
          de: "Fahrzeug an der gewählten Prüfstation vorführen",
        },
        description: {
          es: "Pasa por ventanilla para el pago de tasas y verificación documental antes de entrar a la línea técnica.",
          ca: "Passa per finestreta per al pagament de taxes i revisió documental abans d'entrar a la línia tècnica.",
          en: "Check in at the cashier counter for fee payment and document verification prior to entering the lane.",
          de: "Am Schalter Dokumente vorlegen und Gebühr entrichten, danach in die Prüfgasse einfahren.",
        },
        channel: "presencial",
      },
    ],
    offices: [
      {
        name: "ITV Palma I (Can Valero)",
        address: "Camí dels Reis, s/n (Polígon Can Valero), 07011 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 17 08 00",
        appointmentUrl: "https://serviciositv.conselldemallorca.cat",
        coordinates: { lat: 39.5932, lng: 2.6285 },
      },
      {
        name: "ITV Palma II (Son Castelló)",
        address: "Carrer Gremi Menestrals, 18, 07009 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 17 08 00",
        appointmentUrl: "https://serviciositv.conselldemallorca.cat",
        coordinates: { lat: 39.6085, lng: 2.6734 },
      },
      {
        name: "ITV Inca",
        address: "Polígon Can Matzarí, Carrer dels Fusters, s/n, 07300 Inca",
        municipality: "Inca",
        zone: "inca-raiguer",
        phone: "+34 971 17 08 00",
        appointmentUrl: "https://serviciositv.conselldemallorca.cat",
        coordinates: { lat: 39.7123, lng: 2.9142 },
      },
      {
        name: "ITV Manacor",
        address: "Carretera Palma-Manacor, km 48, 07500 Manacor",
        municipality: "Manacor",
        zone: "manacor-llevant",
        phone: "+34 971 17 08 00",
        appointmentUrl: "https://serviciositv.conselldemallorca.cat",
        coordinates: { lat: 39.5714, lng: 3.1958 },
      },
      {
        name: "ITV Calvià (Magaluf)",
        address: "Camí de Cala Figuera, s/n, 07181 Calvià",
        municipality: "Calvià",
        zone: "calvia",
        phone: "+34 971 17 08 00",
        appointmentUrl: "https://serviciositv.conselldemallorca.cat",
        coordinates: { lat: 39.5112, lng: 2.5312 },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Qué plazo tengo si la ITV resulta desfavorable?",
          ca: "Quin termini tinc si la ITV resulta desfavorable?",
          en: "How long do I have if my car fails the ITV inspection?",
          de: "Welche Frist gilt bei nicht bestandener Hauptuntersuchung (desfavorable)?",
        },
        answer: {
          es: "Dispones de un plazo legal máximo de 60 días naturales para reparar los defectos graves en un taller mecánico y volver a presentar el vehículo.",
          ca: "Tens un termini legal màxim de 60 dies naturals per reparar els defectes greus en un taller i tornar a presentar el vehicle.",
          en: "You have a statutory maximum of 60 calendar days to fix serious defects at a workshop and present the vehicle for re-inspection.",
          de: "Sie haben eine gesetzliche Frist von maximal 60 Kalendertagen, um Mängel in einer Werkstatt beheben zu lassen und das Auto erneut vorzuführen.",
        },
      },
    ],
    relatedServiceCategories: ["motor-transporte"],
  },
  {
    id: "descuento-residente-balear",
    slug: "descuento-residente-balear",
    icon: "✈️",
    title: {
      es: "Descuento de Residente Balear (75% en Vuelos y Barcos)",
      ca: "Descompte de Resident Balear (75% en Vols i Vaixells)",
      en: "Balearic Resident Travel Discount (75% on Flights & Ferries)",
      de: "Inselrabatt Balearen (75% Rabatt auf Flüge & Fähren)",
    },
    summary: {
      es: "Guía oficial sobre la bonificación del 75% en billetes de avión y barco con la Península y trayectos interislas mediante el sistema telemático SARA.",
      ca: "Guia oficial sobre la bonificació del 75% en bitllets d'avió i vaixell amb la Península i trajectes interilles mitjançant el sistema SARA.",
      en: "Official guide on the 75% government subsidy on flights and ferries connecting the Balearic Islands with mainland Spain and inter-island journeys.",
      de: "Offizielle Anleitung zum 75% Residentenrabatt auf Flug- und Fährtickets zum spanischen Festland und zwischen den Baleareninseln.",
    },
    category: "transporte",
    officialEntity: "Govern CAIB",
    officialSourceUrl: "https://www.caib.es",
    officialLastAudited: "2026-08-20",
    fee: {
      isFree: true,
      currency: "EUR",
      description: {
        es: "La acreditación y el certificado de viajes son totalmente gratuitos.",
        ca: "L'acreditació i el certificat de viatges són totalment gratuïts.",
        en: "Verification and municipal travel certificates are 100% free of charge.",
        de: "Die elektronische Bestätigung und der Reisenachweis sind kostenfrei.",
      },
    },
    estimatedTime: {
      es: "Validación instantánea en el proceso de reserva online",
      ca: "Validació instantània en el procés de reserva en línia",
      en: "Instant automated validation during airline/ferry checkout",
      de: "Sofortige automatische Überprüfung bei der Online-Buchung",
    },
    documents: [
      {
        id: "doc-id",
        name: {
          es: "DNI o Pasaporte español, o NIE con Certificado de Registro de Ciudadano UE en vigor",
          ca: "DNI o Passaport espanyol, o NIE amb Certificat de Registre de Ciutadà UE en vigor",
          en: "Spanish National ID/Passport, or NIE with active EU Citizen Certificate",
          de: "Spanischer Personalausweis/Reisepass oder NIE mit gültigem EU-Meldezertifikat (grünes Dokument)",
        },
        isMandatory: true,
      },
      {
        id: "doc-cert-viajes",
        name: {
          es: "Certificado de Empadronamiento para Viajes (solo exigible si falla la verificación SARA)",
          ca: "Certificat d'Empadronament per a Viatges (només exigible si falla la validació SARA)",
          en: "Municipal Travel Residency Certificate (only required if SARA automated check fails)",
          de: "Reise-Meldebescheinigung (nur nötig, falls die automatische SARA-Prüfung fehlschlägt)",
        },
        isMandatory: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          es: "Marcar la casilla de 'Residente Balear' durante la compra del billete",
          ca: "Marcar la casella de 'Resident Balear' durant la compra del bitllet",
          en: "Check the 'Balearic Resident' box during ticket purchase",
          de: "Beim Ticketkauf das Häkchen für 'Balearen-Resident' setzen",
        },
        description: {
          es: "Introduce tu DNI o NIE con exactitud para que el sistema SARA del Ministerio de Transportes corrobore tu padrón en tiempo real.",
          ca: "Introdueix el teu DNI o NIE amb precisió perquè el sistema SARA corrobori el teu padró en temps real.",
          en: "Enter your exact ID or NIE number so the Ministry's SARA system verifies your residency status instantaneously.",
          de: "Geben Sie Ihre Ausweis- oder NIE-Nummer exakt ein, damit das staatliche SARA-System Ihre Meldung in Echtzeit prüft.",
        },
        channel: "online",
      },
      {
        stepNumber: 2,
        title: {
          es: "Embarcar con documento de identidad original",
          ca: "Embarcar amb document d'identitat original",
          en: "Board using your original identification document",
          de: "Mit dem Original-Ausweisdokument an Bord gehen",
        },
        description: {
          es: "Si la tarjeta de embarque muestra 'Residente Verificado', solo necesitas tu DNI/NIE en la puerta de embarque.",
          ca: "Si la targeta d'embarcament mostra 'Resident Verificat', només necessites el DNI/NIE a la porta d'embarcament.",
          en: "If your boarding pass indicates 'Resident Verified', simply show your original ID at the boarding gate.",
          de: "Zeigt die Bordkarte 'Resident Verified', genügt am Flugsteig die Vorlage Ihres Original-Ausweises.",
        },
        channel: "presencial",
      },
    ],
    offices: [
      {
        name: "Ajuntament de Palma (Cajeros de Certificados 24h)",
        address: "Plaça de Cort, 1, 07001 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 22 59 00",
        appointmentUrl: "https://www.palma.cat",
        coordinates: { lat: 39.5696, lng: 2.6502 },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Qué hago si la aerolínea dice que mi residencia no ha sido verificada?",
          ca: "Què faig si l'aerolínia diu que la meva residència no s'ha verificat?",
          en: "What should I do if the airline fails to verify my residency automatically?",
          de: "Was tun, wenn die Fluggesellschaft den Wohnsitz nicht automatisch bestätigen kann?",
        },
        answer: {
          es: "Descarga de inmediato el Certificado de Viajes con código CSV desde la sede electrónica de tu ayuntamiento o en un cajero municipal e imprímelo o llévalo en tu móvil.",
          ca: "Descarrega d'immediat el Certificat de Viatges amb codi CSV des de la seu electrònica del teu ajuntament o a un caixer municipal.",
          en: "Instantly download your Travel Residency Certificate with CSV verification code from your municipal town hall portal or kiosk.",
          de: "Laden Sie die Meldebescheinigung für Reisen (Certificado de Viajes) mit CSV-Code sofort aus dem Bürgerportal Ihrer Gemeinde herunter.",
        },
      },
    ],
    relatedServiceCategories: ["nautica-charter", "motor-transporte"],
  },
  {
    id: "tarjeta-sanitaria-ibsalut",
    slug: "tarjeta-sanitaria-ibsalut",
    icon: "🏥",
    title: {
      es: "Tarjeta Sanitaria Individual (TSI) del Ib-Salut en Mallorca",
      ca: "Targeta Sanitària Individual (TSI) de l'Ib-Salut a Mallorca",
      en: "Balearic Public Health Card (TSI Ib-Salut)",
      de: "Gesundheitskarte der Balearen (TSI Ib-Salut)",
    },
    summary: {
      es: "Cómo solicitar la tarjeta sanitaria de la sanidad pública balear (Servei de Salut), asignar tu centro de salud (PAC) y médico de familia en Mallorca.",
      ca: "Com sol·licitar la targeta sanitària de la sanitat pública balear (Servei de Salut), assignar el teu centre de salut (PAC) i metge de família a Mallorca.",
      en: "How to apply for the Balearic public healthcare card (Ib-Salut), assign your local medical center (PAC) and family doctor in Mallorca.",
      de: "Antragstellung für die öffentliche Versichertenkarte der Balearen (Ib-Salut) und Zuweisung Ihres Gesundheitszentrums (PAC) und Hausarztes.",
    },
    category: "salud",
    officialEntity: "Servei de Salut (Ib-Salut)",
    officialSourceUrl: "https://www.ibsalut.es",
    officialLastAudited: "2026-08-22",
    fee: {
      isFree: true,
      currency: "EUR",
      description: {
        es: "Emisión 100% gratuita por el Servei de Salut de les Illes Balears.",
        ca: "Emissió 100% gratuïta pel Servei de Salut de les Illes Balears.",
        en: "100% free issuance by the Balearic Islands Health Service.",
        de: "100% kostenlose Ausstellung durch den Gesundheitsdienst der Balearen.",
      },
    },
    estimatedTime: {
      es: "Inmediata asignación de médico de cabecera; envío postal en 10-15 días",
      ca: "Assignació immediata de metge de capçalera; enviament postal en 10-15 dies",
      en: "Instant doctor assignment; physical card arrives by post in 10-15 days",
      de: "Sofortige Hausarztzuweisung; Zusendung der Plastikkarte per Post in 10-15 Tagen",
    },
    documents: [
      {
        id: "doc-id",
        name: {
          es: "DNI, NIE o Pasaporte en vigor",
          ca: "DNI, NIE o Passaport en vigor",
          en: "Valid National ID, NIE or Passport",
          de: "Gültiger Personalausweis, NIE oder Reisepass",
        },
        isMandatory: true,
      },
      {
        id: "doc-inss",
        name: {
          es: "Documento de acreditación del derecho a la asistencia sanitaria expedido por el INSS",
          ca: "Document d'acreditació del dret a l'assistència sanitària expedit per l'INSS",
          en: "Certificate of entitlement to public healthcare issued by Social Security (INSS)",
          de: "Bescheinigung über den Anspruch auf Krankenversicherung der spanischen Sozialversicherung (INSS)",
        },
        isMandatory: true,
      },
      {
        id: "doc-padron",
        name: {
          es: "Certificado de empadronamiento reciente (menos de 3 meses)",
          ca: "Certificat d'empadronament recent (menys de 3 mesos)",
          en: "Recent town hall registration certificate (under 3 months old)",
          de: "Aktuelle Meldebescheinigung (nicht älter als 3 Monate)",
        },
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          es: "Localizar tu Centro de Salud (PAC) por código postal",
          ca: "Localitzar el teu Centre de Salut (PAC) per codi postal",
          en: "Identify your designated Health Center (PAC) by postcode",
          de: "Zuständiges Gesundheitszentrum (PAC) anhand der Postleitzahl ermitteln",
        },
        description: {
          es: "La asignación médica en Mallorca se rige estrictamente por la zona básica de salud vinculada a tu empadronamiento.",
          ca: "L'assignació mèdica a Mallorca es regeix estrictament per la zona bàsica de salut vinculada al teu empadronament.",
          en: "Primary care assignment in Mallorca strictly corresponds to the health zone of your registered home address.",
          de: "Die Zuteilung zu den Gesundheitszentren auf Mallorca richtet sich verbindlich nach Ihrem Wohnbezirk.",
        },
        channel: "online",
        officialUrl: "https://www.ibsalut.es",
      },
      {
        stepNumber: 2,
        title: {
          es: "Presentar la solicitud en el mostrador de admisión del PAC",
          ca: "Presentar la sol·licitud al taulell d'admissió del PAC",
          en: "Submit the application at your PAC reception desk",
          de: "Antrag am Empfang Ihres Gesundheitszentrums (PAC) abgeben",
        },
        description: {
          es: "Te entregarán un documento provisional con tu CIP autonómico para poder acudir al médico de inmediato.",
          ca: "Et lliuraran un document provisional amb el teu CIP autonòmic per poder acudir al metge immediatament.",
          en: "You will receive a temporary document with your personal health code (CIP) to see a doctor immediately.",
          de: "Sie erhalten einen vorläufigen Beleg mit Ihrer Versichertennummer (CIP), um sofort einen Arzt aufsuchen zu können.",
        },
        channel: "presencial",
      },
    ],
    offices: [
      {
        name: "PAC Escola Graduada (Palma Centro)",
        address: "Carrer d'Escola Graduada, 8, 07002 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 17 57 00",
        appointmentUrl: "https://www.ibsalut.es",
        coordinates: { lat: 39.5691, lng: 2.6558 },
      },
      {
        name: "Hospital Universitari Son Espases (Referencia)",
        address: "Carretera de Valldemossa, 79, 07010 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 871 20 50 00",
        appointmentUrl: "https://www.ibsalut.es",
        coordinates: { lat: 39.6052, lng: 2.6451 },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Sirve la tarjeta del Ib-Salut para retirar recetas en farmacias?",
          ca: "Serveix la targeta de l'Ib-Salut per retirar receptes a farmàcies?",
          en: "Can I pick up prescription medicine at pharmacies using the Ib-Salut card?",
          de: "Kann ich mit der Ib-Salut-Karte Rezepte in Apotheken einlösen?",
        },
        answer: {
          es: "Sí. La tarjeta incorpora la Receta Electrónica interoperable válida en todas las farmacias de Mallorca y del territorio nacional español.",
          ca: "Sí. La targeta incorpora la Recepta Electrònica interoperable vàlida a totes les farmàcies de Mallorca i de l'Estat.",
          en: "Yes. The card features electronic prescription interoperability across all pharmacies in Mallorca and mainland Spain.",
          de: "Ja. Die Karte beinhaltet das elektronische Rezept (Receta Electrónica), das in allen Apotheken auf Mallorca und ganz Spanien eingelöst werden kann.",
        },
      },
    ],
    relatedServiceCategories: ["spas-bienestar", "servicios-personales"],
  },
  {
    id: "nie-tie-extranjeria-palma",
    slug: "nie-tie-extranjeria-palma",
    icon: "🌍",
    title: {
      es: "NIE, Certificado Verde UE y TIE en Palma de Mallorca",
      ca: "NIE, Certificat Verd UE i TIE a Palma de Mallorca",
      en: "NIE, EU Green Certificate & TIE in Palma de Mallorca",
      de: "NIE, Grünes EU-Zertifikat und TIE in Palma de Mallorca",
    },
    summary: {
      es: "Guía completa para extranjeros sobre cómo tramitar el NIE de no residente, el Certificado de Registro de Ciudadano UE y la TIE en la Oficina de Extranjería de Palma.",
      ca: "Guia completa per a estrangers sobre com tramitar el NIE de no resident, el Certificat de Registre de Ciutadà UE i la TIE a l'Oficina d'Estrangeria de Palma.",
      en: "Comprehensive guide for expats and international residents on obtaining the NIE number, EU Citizen Certificate, and TIE residence card in Palma.",
      de: "Umfassender Ratgeber für Ausländer und Expats zur Beantragung von NIE, grünem EU-Anmeldezertifikat und TIE-Aufenthaltskarte in Palma.",
    },
    category: "extranjeria",
    officialEntity: "Ministerio del Interior / Extranjería",
    officialSourceUrl: "https://sede.administracionespublicas.gob.es",
    officialLastAudited: "2026-08-25",
    fee: {
      isFree: false,
      amount: 12.0,
      currency: "EUR",
      description: {
        es: "Tasa modelo 790 código 012 (aprox. 12,00 € para Certificado UE / NIE asignación)",
        ca: "Taxa model 790 codi 012 (aprox. 12,00 € per a Certificat UE / NIE assignació)",
        en: "Official government fee form 790 code 012 (approx. €12.00 for EU Certificate / NIE)",
        de: "Staatliche Gebühr Formular 790 Code 012 (ca. 12,00 € für EU-Zertifikat / NIE)",
      },
    },
    estimatedTime: {
      es: "Emisión en el acto del Certificado UE · 30 a 45 días para la tarjeta TIE física",
      ca: "Emissió a l'acte del Certificat UE · 30 a 45 dies per a la targeta TIE física",
      en: "Same-day issuance for EU Green Certificate · 30 to 45 days for physical plastic TIE",
      de: "Sofortige Aushändigung des grünen EU-Zertifikats · 30 bis 45 Tage für die Plastik-TIE",
    },
    documents: [
      {
        id: "doc-pasaporte",
        name: {
          es: "Pasaporte original en vigor y fotocopia completa",
          ca: "Passaport original en vigor i fotocòpia completa",
          en: "Original valid Passport and complete photocopy",
          de: "Gültiger Original-Reisepass und vollständige Kopie",
        },
        isMandatory: true,
      },
      {
        id: "doc-form-ex",
        name: {
          es: "Formulario oficial cumplimentado (EX-15 para NIE o EX-18 para Certificado UE)",
          ca: "Formulari oficial complimentat (EX-15 per a NIE o EX-18 per a Certificat UE)",
          en: "Completed official application form (EX-15 for NIE or EX-18 for EU Certificate)",
          de: "Ausgefülltes offizielles Antragsformular (EX-15 für NIE oder EX-18 für EU-Zertifikat)",
        },
        isMandatory: true,
      },
      {
        id: "doc-tasa",
        name: {
          es: "Justificante de pago de la Tasa Modelo 790 código 012 sellado por el banco",
          ca: "Justificant de pagament de la Taxa Model 790 codi 012 segellat pel banc",
          en: "Bank-stamped proof of payment of government fee form 790 code 012",
          de: "Bankgestempelter Einzahlungsbeleg der Gebühr Modelo 790 Code 012",
        },
        isMandatory: true,
      },
      {
        id: "doc-economic",
        name: {
          es: "Acreditación de medios económicos y seguro médico privado sin copagos (para comunitarios)",
          ca: "Acreditació de mitjans econòmics i assegurança mèdica privada sense copagaments",
          en: "Proof of sufficient economic funds and full-coverage private health insurance",
          de: "Nachweis ausreichender finanzieller Mittel und Vollkrankenversicherung ohne Selbstbeteiligung",
        },
        isMandatory: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: {
          es: "Reservar cita previa en la Sede de Administraciones Públicas",
          ca: "Reservar cita prèvia a la Seu d'Administracions Públiques",
          en: "Book an official appointment on the National Portal",
          de: "Offiziellen Termin im Portal der öffentlichen Verwaltung buchen",
        },
        description: {
          es: "Selecciona provincia 'Illes Balears' y trámite 'Policia - Certificado de Registro de Ciudadano de la UE' o 'Asignación de NIE'.",
          ca: "Selecciona província 'Illes Balears' i tràmit 'Policia - Certificat de Registre de Ciutadà de la UE'.",
          en: "Choose province 'Illes Balears' and select the appropriate police procedure for your citizenship status.",
          de: "Wählen Sie die Provinz 'Illes Balears' und das entsprechende polizeiliche Meldeverfahren aus.",
        },
        channel: "online",
        officialUrl: "https://sede.administracionespublicas.gob.es",
      },
      {
        stepNumber: 2,
        title: {
          es: "Acudir a la Oficina de Extranjería o Comisaría de Policía Nacional",
          ca: "Acudir a l'Oficina d'Estrangeria o Comissaria de Policia Nacional",
          en: "Attend your in-person appointment at the Immigration Office or Police Station",
          de: "Termin bei der Ausländerbehörde oder der Nationalpolizei wahrnehmen",
        },
        description: {
          es: "Entrega tu documentación y justificante de tasa pagada. Si cumples los requisitos, te expedirán tu documento en el acto.",
          ca: "Lliura la teva documentació i taxa pagada. Si compleixes els requisits, t'expediran el document a l'acte.",
          en: "Submit documents and paid fee receipt. If all requirements are met, your green certificate is handed over on the spot.",
          de: "Unterlagen und Zahlungsnachweis vorlegen. Bei vollständigen Papieren wird das grüne Zertifikat sofort ausgehändigt.",
        },
        channel: "presencial",
      },
    ],
    offices: [
      {
        name: "Oficina Única de Extranjería en Palma",
        address: "Carrer de Felicià Fuster, 7, 07006 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 98 90 00",
        appointmentUrl: "https://sede.administracionespublicas.gob.es",
        coordinates: { lat: 39.5645, lng: 2.6612 },
      },
      {
        name: "Comisaría de Policía Nacional Palma - Doria",
        address: "Carrer de Simó Ballester, 8, 07011 Palma",
        municipality: "Palma",
        zone: "palma",
        phone: "+34 971 22 52 00",
        appointmentUrl: "https://sede.administracionespublicas.gob.es",
        coordinates: { lat: 39.5752, lng: 2.6415 },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿El NIE acredita residencia legal en España?",
          ca: "El NIE acredita residència legal a Espanya?",
          en: "Does a NIE number alone prove legal residency in Spain?",
          de: "Reicht die NIE-Nummer allein als legaler Wohnsitznachweis in Spanien aus?",
        },
        answer: {
          es: "No. El NIE es solo un número de identificación fiscal. Para acreditar residencia debes obtener el Certificado de Registro de la Unión (comunitarios) o la TIE (extracomunitarios).",
          ca: "No. El NIE és només un número d'identificació fiscal. Per acreditar residència has d'obtenir el Certificat de la UE o la TIE.",
          en: "No. The NIE is merely a tax identification number. Legal residency requires the EU Registration Certificate or TIE card.",
          de: "Nein. Die NIE ist lediglich eine Steuernummer. Für den legalen Wohnsitz benötigen EU-Bürger das grüne EU-Zertifikat und Nicht-EU-Bürger die TIE.",
        },
      },
    ],
    relatedServiceCategories: ["abogados-gestorias", "inmobiliarias-propiedad"],
  },
];

/**
 * Obtiene una guía oficial por su slug único
 */
export function getGuideBySlug(slug: string): CitizenGuide | undefined {
  return CITIZEN_GUIDES.find((guide) => guide.slug === slug);
}

/**
 * Filtra guías oficiales por su categoría administrativa
 */
export function getGuidesByCategory(category: GuideCategory): CitizenGuide[] {
  return CITIZEN_GUIDES.filter((guide) => guide.category === category);
}
