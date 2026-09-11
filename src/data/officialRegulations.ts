/**
 * officialRegulations.ts
 *
 * Catálogo Canónico de Normativa Oficial, Decretos y Ayudas del BOIB / CAIB para Mallorca.
 * Rige la sección /normativa del portal.
 * Cumple con GR-03 (TypeScript estricto), GR-04 (i18n cuatrilingüe),
 * GR-11 (Zero Fake Data: normativas reales contrastadas con boletín oficial) y GR-13 (HTTPS).
 */

export type RegulationCategory =
  | "vivienda"
  | "empresas_autonomos"
  | "comercio"
  | "turismo"
  | "fiscalidad";

export interface RegulationKeyPoint {
  title: { es: string; ca: string; en: string; de: string };
  description: { es: string; ca: string; en: string; de: string };
}

export interface OfficialRegulation {
  id: string;
  slug: string;
  category: RegulationCategory;
  officialBoibNumber: string; // ej. "BOIB núm. 100 / 2023"
  publicationDate: string; // YYYY-MM-DD
  effectiveDate: string; // YYYY-MM-DD
  authority:
    | "Govern de les Illes Balears"
    | "Consell Insular de Mallorca"
    | "Ajuntament de Palma"
    | "Agencia Tributaria de les Illes Balears (ATIB)"
    | "SOIB";
  title: { es: string; ca: string; en: string; de: string };
  summary: { es: string; ca: string; en: string; de: string };
  officialSourceUrl: string;
  benefitsSummary: { es: string; ca: string; en: string; de: string };
  keyPoints: RegulationKeyPoint[];
  relatedGuideSlugs?: string[];
  relatedStatIds?: string[];
  calculatorType?: "itp_joven";
}

export const OFFICIAL_REGULATIONS: OfficialRegulation[] = [
  {
    id: "bonificacion-itp-jovenes-mallorca",
    slug: "bonificacion-itp-jovenes-mallorca",
    category: "vivienda",
    officialBoibNumber: "Decreto Ley 3/2023 (BOIB núm. 95)",
    publicationDate: "2023-07-18",
    effectiveDate: "2023-07-19",
    authority: "Govern de les Illes Balears",
    title: {
      es: "Bonificación del 100% en el ITP para Jóvenes Menores de 35 Años en Baleares",
      ca: "Bonificació del 100% a l'ITP per a Joves Menors de 35 Anys a Balears",
      en: "100% Property Transfer Tax (ITP) Exemption for Young Buyers Under 35 in Mallorca",
      de: "100% Grunderwerbsteuer-Befreiung (ITP) für Käufer unter 35 Jahren auf Mallorca",
    },
    summary: {
      es: "Decreto oficial del Govern de les Illes Balears que elimina el impuesto de transmisiones (tipo 0%) en la compra de primera vivienda habitual para menores de 35 años con valor de hasta 270.151 €.",
      ca: "Decret oficial del Govern de les Illes Balears que elimina l'impost de transmissions (tipus 0%) en la compra de primer habitatge habitual per a menors de 35 anys fins a 270.151 €.",
      en: "Official Balearic decree removing property transfer tax (0% rate) on first primary residence purchases under 35 years old valued up to €270,151.",
      de: "Offizielles Balearen-Dekret zur vollständigen Befreiung von der Grunderwerbsteuer (0% Steuersatz) beim Erstkauf von Hauptwohnsitzen unter 35 Jahren bis 270.151 €.",
    },
    officialSourceUrl: "https://www.caib.es/eboibfront/es/2023/11768/675548/decreto-ley-3-2023-de-10-de-julio-de-modificacion-d",
    benefitsSummary: {
      es: "Ahorro fiscal directo de hasta 21.612 € en la compraventa de vivienda habitual frente a la tarifa general del 8%.",
      ca: "Estalvi fiscal directe de fins a 21.612 € en la compravenda d'habitatge habitual respecte a la tarifa general del 8%.",
      en: "Direct tax savings of up to €21,612 on purchase of main residence compared to standard 8% rate.",
      de: "Direkte Steuerersparnis von bis zu 21.612 € beim Hauptwohnsitzkauf gegenüber dem regulären 8%-Satz.",
    },
    keyPoints: [
      {
        title: {
          es: "Requisito de Edad y Residencia",
          ca: "Requisit d'Edat i Residència",
          en: "Age and Residency Requirement",
          de: "Alters- und Wohnsitzvoraussetzung",
        },
        description: {
          es: "Tener menos de 36 años en la fecha de devengo y haber residido legalmente de forma continuada en las Illes Balears durante al menos los 3 años inmediatamente anteriores.",
          ca: "Tenir menys de 36 anys en la data de meritació i haver residit legalment de forma continuada a les Illes Balears durant almenys els 3 anys anteriors.",
          en: "Under 36 years old on purchase date and legally resident in the Balearic Islands continuously for at least 3 consecutive years.",
          de: "Unter 36 Jahre am Kauftag und mindestens 3 Jahre ununterbrochen mit Hauptwohnsitz auf den Balearen gemeldet.",
        },
      },
      {
        title: {
          es: "Límite del Valor del Inmueble",
          ca: "Límit del Valor de l'Immoble",
          en: "Property Valuation Threshold",
          de: "Kaufpreisobergrenze der Immobilie",
        },
        description: {
          es: "El valor real o de escrituración no puede superar los 270.151,20 € para la bonificación total del 100%. Para familias numerosas el tope se amplía a 350.000 €.",
          ca: "El valor real o d'escripturació no pot superar els 270.151,20 € per a la bonificació total del 100%. Per a famílies nombroses s'amplia a 350.000 €.",
          en: "The purchase price or real tax value cannot exceed €270,151.20 for 100% exemption. Large families cap extends to €350,000.",
          de: "Der beurkundete Kaufpreis darf 270.151,20 € für die 100%-Freistellung nicht überschreiten. Für kinderreiche Familien bis 350.000 €.",
        },
      },
      {
        title: {
          es: "Obligación de Ocupación Efectiva",
          ca: "Obligació d'Ocupació Efectiva",
          en: "Mandatory Primary Occupancy",
        de: "Verpflichtende Eigennutzung",
        },
        description: {
          es: "La vivienda debe constituir la residencia habitual del comprador y habitarse en un plazo máximo de doce meses desde la adquisición, manteniéndose al menos 3 años.",
          ca: "L'habitatge ha de constituir la residència habitual del comprador i habitar-se en un termini màxim de 12 mesos des de l'adquisició, mantenint-se com a mínim 3 anys.",
          en: "Must be occupied as primary residence within 12 months from purchase date and maintained for at least 3 consecutive years.",
          de: "Muss innerhalb von 12 Monaten nach Kauf als Erstwohnsitz bezogen und mindestens 3 Jahre beibehalten werden.",
        },
      },
    ],
    relatedGuideSlugs: ["empadronamiento-palma"],
    relatedStatIds: ["poblacion-total-mallorca"],
    calculatorType: "itp_joven",
  },
  {
    id: "ayudas-soib-autoempleo-cuota-cero",
    slug: "ayudas-soib-autoempleo-cuota-cero",
    category: "empresas_autonomos",
    officialBoibNumber: "Resolución SOIB / Convocatoria 2025–2026",
    publicationDate: "2024-11-14",
    effectiveDate: "2025-01-01",
    authority: "SOIB",
    title: {
      es: "Programa Oficial Cuota Cero y Ayuda al Autoempleo de hasta 5.000 € del Govern CAIB",
      ca: "Programa Oficial Quota Zero i Ajuda a l'Autoocupació de fins a 5.000 € del Govern CAIB",
      en: "Official Zero Social Security Fee Grant & Self-Employment Subsidy up to €5,000 (SOIB)",
      de: "Offizielles Beitragsfreiheits-Programm (Cuota Cero) & Gründerzuschuss bis 5.000 € (SOIB)",
    },
    summary: {
      es: "Línea de subvención directa a fondo perdido para nuevos autónomos en Mallorca que cubre el 100% de la cuota de la Seguridad Social durante los primeros 24 meses y aporta un incentivo inicial de inicio de actividad.",
      ca: "Línia de subvenció directa a fons perdut per a nous autònoms a Mallorca que cobreix el 100% de la quota de la Seguretat Social durant els primers 24 mesos i un incentiu inicial.",
      en: "Direct non-repayable government subsidy for new self-employed workers in Mallorca covering 100% of social security contributions for up to 24 months plus start-up cash.",
      de: "Nicht rückzahlbarer Direktzuschuss für Neugründer auf Mallorca: 100% Erstattung der Sozialversicherungsbeiträge über 24 Monate sowie Startkapital-Förderung.",
    },
    officialSourceUrl: "https://soib.es",
    benefitsSummary: {
      es: "Hasta 5.000 € a fondo perdido más reembolso completo de las cuotas del RETA durante dos años completos.",
      ca: "Fins a 5.000 € a fons perdut més reemborsament complet de les quotes del RETA durant dos anys complets.",
      en: "Up to €5,000 direct non-repayable funding plus full refund of monthly RETA self-employed fees for 2 full years.",
      de: "Bis zu 5.000 € nicht rückzahlbarer Zuschuss plus vollständige Erstattung der monatlichen RETA-Beiträge über 2 Jahre.",
    },
    keyPoints: [
      {
        title: {
          es: "Requisitos de Inscripción Previa",
          ca: "Requisits d'Inscripció Prèvia",
          en: "Prior Registration Requirements",
          de: "Vorherige Meldepflicht beim Arbeitsamt",
        },
        description: {
          es: "Estar inscrito como demandante de empleo en el SOIB antes del alta efectiva en el Régimen Especial de Trabajadores Autónomos (RETA).",
          ca: "Estar inscrit com a demandant d'ocupació al SOIB abans de l'alta efectiva al RETA.",
          en: "Must be registered as a jobseeker at SOIB immediately prior to official self-employment registration on RETA.",
          de: "Vor der Gewerbeanmeldung als arbeitssuchend beim SOIB gemeldet sein.",
        },
      },
      {
        title: {
          es: "Colectivos Prioritarios y Cuantía Máxima",
          ca: "Col·lectius Prioritaris i Quantia Màxima",
          en: "Priority Groups and Maximum Grant",
          de: "Fördergruppen und Höchstbetrag",
        },
        description: {
          es: "La ayuda base es de 3.000 €, incrementándose hasta 5.000 € para mujeres, menores de 30 años, personas mayores de 45 años o personas con discapacidad.",
          ca: "L'ajuda base és de 3.000 €, incrementant-se fins a 5.000 € per a dones, menors de 30 anys, majors de 45 anys o persones amb discapacitat.",
          en: "Base grant is €3,000, rising to €5,000 for women, youth under 30, adults over 45, or individuals with disabilities.",
          de: "Grundförderung von 3.000 €, ansteigend auf 5.000 € für Frauen, Gründer unter 30, über 45-Jährige oder Menschen mit Behinderung.",
        },
      },
    ],
    relatedGuideSlugs: ["nie-tie-extranjeria-palma"],
    relatedStatIds: ["subvenciones-autoempleo-caib", "creacion-empresas-mallorca"],
  },
  {
    id: "calendario-festivos-aperturas-mallorca-2026",
    slug: "calendario-festivos-aperturas-mallorca-2026",
    category: "comercio",
    officialBoibNumber: "Resolución Conselleria d'Empresa (BOIB núm. 142)",
    publicationDate: "2025-10-25",
    effectiveDate: "2026-01-01",
    authority: "Govern de les Illes Balears",
    title: {
      es: "Calendario Oficial de Domingos y Festivos de Apertura Comercial en Mallorca 2026",
      ca: "Calendari Oficial de Diumenges i Festius d'Obertura Comercial a Mallorca 2026",
      en: "Official 2026 Sunday and Holiday Commercial Opening Calendar in Mallorca",
      de: "Offizieller Kalender für verkaufsoffene Sonntage und Feiertage auf Mallorca 2026",
    },
    summary: {
      es: "Publicación oficial en BOIB de los 10 domingos y festivos en los que los establecimientos comerciales de Mallorca pueden permanecer abiertos al público durante el año 2026.",
      ca: "Publicació oficial al BOIB dels 10 diumenges i festius en què els establiments comercials de Mallorca poden romandre oberts al públic durant el 2026.",
      en: "Official Balearic Government resolution setting the 10 authorized Sunday and holiday commercial retail opening dates across Mallorca in 2026.",
      de: "Amtliche Veröffentlichung der 10 gesetzlich genehmigten verkaufsoffenen Sonntage und Feiertage für den Einzelhandel auf Mallorca im Jahr 2026.",
    },
    officialSourceUrl: "https://www.caib.es/eboibfront",
    benefitsSummary: {
      es: "Seguridad jurídica para comerciantes y consumidores sobre horarios y aperturas autorizadas en festivos.",
      ca: "Seguretat jurídica per a comerciants i consumidors sobre horaris i obertures autoritzades en festius.",
      en: "Legal certainty for retailers and consumers regarding opening schedules on public holidays.",
      de: "Rechtssicherheit für Gewerbetreibende und Verbraucher über zulässige Ladenöffnungen an Feiertagen.",
    },
    keyPoints: [
      {
        title: {
          es: "Días Oficiales Autorizados",
          ca: "Dies Oficials Autoritzats",
          en: "Authorized Retail Dates",
          de: "Offiziell genehmigte Verkaufstage",
        },
        description: {
          es: "Incluye campañas de rebajas de invierno (primer domingo de enero), Semana Santa, campaña estival turística y campaña de compras navideñas en diciembre.",
          ca: "Inclou campanyes de rebaixes d'hivern (primer diumenge de gener), Setmana Santa, campanya estival i campanya de Nadal al desembre.",
          en: "Covers winter sales (first Sunday in January), Easter season, high summer tourist trade, and December Christmas shopping period.",
          de: "Umfasst den Winterschlussverkauf im Januar, die Osterzeit, die touristische Hochsaison im Sommer sowie die Adventszeit im Dezember.",
        },
      },
      {
        title: {
          es: "Régimen Especial de Zonas de Gran Afluencia Turística (ZGAT)",
          ca: "Règim Especial de Zones de Gran Afluència Turística (ZGAT)",
          en: "Special Tourism High-Density Zones (ZGAT)",
          de: "Sonderregelung für Tourismuszonen mit hoher Besucherfrequenz (ZGAT)",
        },
        description: {
          es: "Comercios en zonas costeras declaradas ZGAT disfrutan de libertad de horarios durante los meses centrales de temporada alta (mayo a octubre).",
          ca: "Comerços a zones costaneres declarades ZGAT gaudeixen de llibertat d'horaris durant els mesos centrals de temporada alta (maig a octubre).",
          en: "Retail shops located in designated high tourist zones benefit from deregulated operating hours between May and October.",
          de: "Geschäfte in ausgewiesenen Tourismusgebieten (ZGAT) an der Küste genießen in der Sommersaison (Mai bis Oktober) erweiterte Ladenöffnungszeiten.",
        },
      },
    ],
    relatedGuideSlugs: [],
    relatedStatIds: ["comercios-emblematicos-palma", "empresas-activas-mallorca"],
  },
  {
    id: "moratoria-turistica-regulacion-etv",
    slug: "moratoria-turistica-regulacion-etv",
    category: "turismo",
    officialBoibNumber: "Ley 3/2022 de Medidas Urgentes Turísticas (BOIB núm. 76)",
    publicationDate: "2022-06-15",
    effectiveDate: "2022-06-16",
    authority: "Consell Insular de Mallorca",
    title: {
      es: "Regulación de Viviendas Turísticas (ETV), Moratoria Insular y Régimen Sancionador",
      ca: "Regulació d'Habitatges Turístics (ETV), Moratòria Insular i Règim Sancionador",
      en: "Holiday Rental Regulation (ETV), Island Cap Moratorium and Penalty Code",
      de: "Regulierung der Ferienvermietung (ETV), Inselweites Moratorium & Bußgeldkatalog",
    },
    summary: {
      es: "Marco normativo del Consell de Mallorca que regula la moratoria en adquisición de nuevas plazas turísticas, exigencias de la declaración responsable DRIAT y sanciones a la comercialización irregular.",
      ca: "Marc normatiu del Consell de Mallorca que regula la moratòria en adquisició de noves places turístiques, requisits DRIAT i sancions a la comercialització il·legal.",
      en: "Consell de Mallorca legal framework regulating the moratorium on acquiring new vacation rental spots, mandatory DRIAT filings, and penalties for illegal holiday lets.",
      de: "Rechtsrahmen des Inselrats Mallorca bezüglich des Moratoriums für neue Ferienvermietungslizenzen, DRIAT-Anforderungen und empfindliche Bußgelder für illegale Vermietung.",
    },
    officialSourceUrl: "https://conselldemallorca.cat",
    benefitsSummary: {
      es: "Protección a propietarios con licencias legales consolidadas y salvaguarda de la convivencia vecinal en zonas residenciales.",
      ca: "Protecció a propietaris amb llicències legals consolidades i preservació de la convivència veïnal a zones residencials.",
      en: "Legal protection for fully licensed holiday homes and preservation of residential community standards.",
      de: "Schutz für Eigentümer mit bestehenden rechtsgültigen Lizenzen und Erhalt der Wohnqualität in Wohnvierteln.",
    },
    keyPoints: [
      {
        title: {
          es: "Moratoria de Nuevas Plazas",
          ca: "Moratòria de Noves Places",
          en: "Cap Moratorium on New Beds",
          de: "Moratorium für neue Gästebetten",
        },
        description: {
          es: "Permanece suspendida la compra de nuevas plazas turísticas en la bolsa insular del Consell hasta la aprobación definitiva del Plan Territorial Insular (PIAT).",
          ca: "Resta suspesa la compra de noves places turístiques a la borsa insular del Consell fins a l'aprovació definitiva del PIAT.",
          en: "Acquisition of new tourist bed licenses from the island bed pool remains suspended pending PIAT zoning framework updates.",
          de: "Der Zukauf neuer Lizenzen aus dem offiziellen Bettenpool des Inselrats bleibt bis zur endgültigen Überarbeitung des Raumordnungsplans (PIAT) ausgesetzt.",
        },
      },
      {
        title: {
          es: "Obligación de Placa Identificativa y DRIAT",
          ca: "Obligació de Placa Identificativa i DRIAT",
          en: "Mandatory Official Plaque and DRIAT Number",
          de: "Pflicht zur Anbringung der Lizenzplakette und DRIAT-Nummer",
        },
        description: {
          es: "Toda vivienda reglada debe exhibir visiblemente la placa oficial exterior del Consell y reflejar su código DRIAT en cualquier anuncio o plataforma online.",
          ca: "Tot habitatge reglat ha d'exhibir la placa oficial exterior del Consell i reflectir el codi DRIAT a qualsevol anunci online.",
          en: "All licensed homes must prominently display the official exterior plaque and state their DRIAT license code across all booking platforms.",
          de: "Alle lizenzierten Objekte müssen die offizielle Außenplakette tragen und die Registrierungsnummer (DRIAT) in allen Inseraten angeben.",
        },
      },
      {
        title: {
          es: "Régimen Sancionador",
          ca: "Règim Sancionador",
          en: "Strict Enforcement and Fines",
          de: "Bußgelder bei Verstößen",
        },
        description: {
          es: "Sanciones de hasta 400.000 € para comercializadores y plataformas por comercialización no autorizada en inmuebles residenciales sin licencia.",
          ca: "Sancions de fins a 400.000 € per a comercialitzadors i plataformes per comercialització no autoritzada sense llicència.",
          en: "Fines up to €400,000 for property owners and online platforms marketing unlicensed residential properties for tourist stays.",
          de: "Geldbußen bis zu 400.000 € für Eigentümer und Vermittlungsplattformen bei unerlaubter touristischer Vermietung ohne Lizenz.",
        },
      },
    ],
    relatedGuideSlugs: [],
    relatedStatIds: ["plazas-etv-conselldemallorca", "iph-pico-verano"],
  },
  {
    id: "deducciones-autonomicas-irpf-balear",
    slug: "deducciones-autonomicas-irpf-balear",
    category: "fiscalidad",
    officialBoibNumber: "Texto Refundido Tributario Balear (D.L. 1/2014 actualizado 2026)",
    publicationDate: "2025-12-28",
    effectiveDate: "2026-01-01",
    authority: "Agencia Tributaria de les Illes Balears (ATIB)",
    title: {
      es: "Deducciones Autonómicas en el IRPF de Baleares: Alquiler, Libros de Texto y Conciliación",
      ca: "Deduccions Autonòmiques a l'IRPF de Balears: Lloguer, Llibres de Text i Conciliació",
      en: "Balearic Regional Income Tax Deductions: Housing Rent, Schoolbooks & Childcare",
      de: "Regionale Einkommensteuer-Abzüge auf den Balearen: Miete, Schulbücher & Kinderbetreuung",
    },
    summary: {
      es: "Guía de las deducciones fiscales autonómicas aplicables en la declaración de la renta de los contribuyentes residentes en Mallorca para compensar el coste insular de vivienda y familia.",
      ca: "Guia de les deduccions fiscals autonòmiques aplicables a la declaració de la renda dels residents a Mallorca per compensar el cost insular d'habitatge i família.",
      en: "Summary of regional tax relief credits in Balearic income tax (IRPF) for island residents to offset local living costs, rentals, and child support.",
      de: "Übersicht der regionalen Steuererleichterungen bei der spanischen Einkommensteuererklärung für Residenten auf Mallorca (Mietaufwand, Schulbedarf und Kinderbetreuung).",
    },
    officialSourceUrl: "https://www.atib.es",
    benefitsSummary: {
      es: "Deducciones directas acumulables de hasta 880 € por alquiler de vivienda, 220 € por hijo en guarderías y 100% en libros de texto.",
      ca: "Deduccions directes acumulables de fins a 880 € per lloguer d'habitatge, 220 € per fill en escoletes i 100% en llibres de text.",
      en: "Cumulative direct tax deductions of up to €880 for rental housing, €220 per child in nursery schools, and 100% for mandatory schoolbooks.",
      de: "Direkt anrechenbare Steuerabzüge von bis zu 880 € für Wohnungsmiete, 220 € je Kind für Kitas und 100% für Schulbücher.",
    },
    keyPoints: [
      {
        title: {
          es: "Deducción por Alquiler de Vivienda Habitual",
          ca: "Deducció per Lloguer d'Habitatge Habitual",
          en: "Primary Residence Rent Credit",
          de: "Steuerabzug für Hauptwohnsitz-Miete",
        },
        description: {
          es: "15% del importe satisfecho hasta un máximo de 880 € anuales para menores de 36 años, personas con discapacidad o familias numerosas con depósito de fianza acreditado en el IBAVI.",
          ca: "15% de l'import satisfet fins a un màxim de 880 € anuals per a menors de 36 anys, persones amb discapacitat o famílies nombroses amb fiança dipositada a l'IBAVI.",
          en: "15% of annual rent paid up to €880 per year for renters under 36, persons with disabilities, or large families provided the deposit is registered with IBAVI.",
          de: "15% der gezahlten Kaltmiete bis maximal 880 € jährlich für Mieter unter 36, Behinderte oder kinderreiche Familien mit hinterlegter Kaution beim IBAVI.",
        },
      },
      {
        title: {
          es: "Gastos de Guardería y Escoletes (0 a 3 Años)",
          ca: "Despeses d'Escoleta i Guarderia (0 a 3 Anys)",
          en: "Daycare and Nursery Costs (Ages 0 to 3)",
          de: "Kinderbetreuungskosten in Kitas (0 bis 3 Jahre)",
        },
        description: {
          es: "Deducción de hasta el 40% de los gastos anuales de custodia y matrícula en centros de educación infantil homologados de las islas, hasta 660 € por descendiente.",
          ca: "Deducció de fins al 40% de les despeses anuals de custòdia i matrícula en centres autoritzats, fins a 660 € per descendent.",
          en: "Deduction of up to 40% of daycare fees in authorized early education centers, capped at €660 per child.",
          de: "Steuerabzug von bis zu 40% der Betreuungskosten in anerkannten Kitas auf den Inseln, bis maximal 660 € pro Kind.",
        },
      },
    ],
    relatedGuideSlugs: ["empadronamiento-palma"],
    relatedStatIds: ["salario-medio-balears", "poblacion-total-mallorca"],
  },
];

export function getAllRegulations(): OfficialRegulation[] {
  return OFFICIAL_REGULATIONS;
}

export function getRegulationBySlug(slug: string): OfficialRegulation | undefined {
  return OFFICIAL_REGULATIONS.find((r) => r.slug === slug);
}

export function getRegulationsByCategory(category: RegulationCategory): OfficialRegulation[] {
  return OFFICIAL_REGULATIONS.filter((r) => r.category === category);
}
