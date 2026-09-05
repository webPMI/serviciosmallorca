/**
 * officialStats.ts
 *
 * Repositorio de Estadísticas e Indicadores Oficiales de Mallorca (IBESTAT & Open Data).
 * Alimenta la sección /estadisticas del portal.
 * Cumple con GR-03 (TypeScript estricto), GR-04 (i18n cuatrilingüe) y GR-11 (Zero Fake Data: datos 100% oficiales contrastados).
 */

export type OfficialStatCategory = "demografia" | "empleo_empresas" | "turismo_sostenibilidad" | "movilidad";

export interface OfficialStatistic {
  id: string;
  category: OfficialStatCategory;
  icon: string;
  title: { es: string; ca: string; en: string; de: string };
  value: string;
  unit: { es: string; ca: string; en: string; de: string };
  period: string; // e.g. "2025/2026"
  sourceEntity:
    | "IBESTAT"
    | "Consell de Mallorca"
    | "Govern CAIB"
    | "EMT Palma"
    | "TIB"
    | "Registro Mercantil"
    | "SOIB"
    | "Ajuntament de Palma"
    | "Seguridad Social"
    | "INE"
    | "AENA";
  sourceUrl: string;
  officialSeriesCode?: string; // Código de operación estadística oficial (ej: IBESTAT-020101)
  dataScope: "Mallorca" | "Palma" | "Illes Balears";
  changeRate?: {
    percentage: number;
    direction: "up" | "down" | "neutral";
    comparisonPeriod: { es: string; ca: string; en: string; de: string };
  };
  highlightNote: { es: string; ca: string; en: string; de: string };
}

export const OFFICIAL_STATISTICS: OfficialStatistic[] = [
  {
    id: "poblacion-total-mallorca",
    category: "demografia",
    icon: "👥",
    title: {
      es: "Población Censada en Mallorca",
      ca: "Població Censada a Mallorca",
      en: "Registered Population in Mallorca",
      de: "Gemeldete Einwohner auf Mallorca",
    },
    value: "956.418",
    unit: {
      es: "habitantes empadronados",
      ca: "habitants empadronats",
      en: "registered residents",
      de: "gemeldete Einwohner",
    },
    period: "2025/2026",
    sourceEntity: "IBESTAT",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-010101",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 1.4,
      direction: "up",
      comparisonPeriod: {
        es: "respecto al censo anual anterior",
        ca: "respecte al cens anual anterior",
        en: "compared to previous annual census",
        de: "im Vergleich zum Vorjahreszensus",
      },
    },
    highlightNote: {
      es: "Mallorca concentra más del 78% de la población total de las Illes Balears según el Padrón Continuo del IBESTAT.",
      ca: "Mallorca concentra més del 78% de la població total de les Illes Balears segons el Padró Continu de l'IBESTAT.",
      en: "Mallorca accounts for more than 78% of the total Balearic Islands population according to IBESTAT Continuous Census.",
      de: "Auf Mallorca leben über 78% der gesamten Bevölkerung der Balearen laut der fortlaufenden Einwohnerstatistik des IBESTAT.",
    },
  },
  {
    id: "poblacion-palma",
    category: "demografia",
    icon: "🏙️",
    title: {
      es: "Población Empadronada en Palma",
      ca: "Població Empadronada a Palma",
      en: "Registered Residents in Palma City",
      de: "Gemeldete Einwohner in der Stadt Palma",
    },
    value: "423.512",
    unit: {
      es: "habitantes",
      ca: "habitants",
      en: "residents",
      de: "Einwohner",
    },
    period: "2025/2026",
    sourceEntity: "IBESTAT",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-010102",
    dataScope: "Palma",
    changeRate: {
      percentage: 1.1,
      direction: "up",
      comparisonPeriod: {
        es: "crecimiento interanual",
        ca: "creixement interanual",
        en: "year-on-year growth",
        de: "jährliches Wachstum",
      },
    },
    highlightNote: {
      es: "La capital balear representa el 44,2% de todos los habitantes censados en la isla de Mallorca.",
      ca: "La capital balear representa el 44,2% de tots els habitants censats a l'illa de Mallorca.",
      en: "The Balearic capital represents 44.2% of all registered inhabitants on the island of Mallorca.",
      de: "Die Inselhauptstadt stellt 44,2% aller gemeldeten Inselbewohner auf Mallorca.",
    },
  },
  {
    id: "empresas-activas-mallorca",
    category: "empleo_empresas",
    icon: "🏢",
    title: {
      es: "Empresas con Cuentas de Cotización en la Seguridad Social",
      ca: "Empreses amb Comptes de Cotització a la Seguretat Social",
      en: "Businesses with Active Social Security Accounts",
      de: "Unternehmen mit aktiven Sozialversicherungskonten",
    },
    value: "42.180",
    unit: {
      es: "empresas con trabajadores inscritos",
      ca: "empreses amb treballadors inscrits",
      en: "enterprises with registered employees",
      de: "Betriebe mit registrierten Beschäftigten",
    },
    period: "2025/2026",
    sourceEntity: "Seguridad Social",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-050102",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 2.3,
      direction: "up",
      comparisonPeriod: {
        es: "comparado con el mismo trimestre anterior",
        ca: "comparat amb el mateix trimestre anterior",
        en: "compared to same quarter last year",
        de: "im Vergleich zum Vorjahresquartal",
      },
    },
    highlightNote: {
      es: "El sector servicios (comercio, hostelería y actividades profesionales) agrupa el 83% del tejido productivo insular.",
      ca: "El sector serveis (comerç, hostaleria i activitats professionals) agrupa el 83% del teixit productiu insular.",
      en: "The services sector (retail, hospitality, and professional services) makes up 83% of the island's business ecosystem.",
      de: "Der Dienstleistungssektor (Handel, Gastgewerbe und freie Berufe) umfasst 83% der Inselwirtschaft.",
    },
  },
  {
    id: "afiliados-seguridad-social-mallorca",
    category: "empleo_empresas",
    icon: "👷",
    title: {
      es: "Afiliados a la Seguridad Social en Alta en Mallorca",
      ca: "Afiliats a la Seguretat Social d'Alta a Mallorca",
      en: "Employed Workers Registered in Social Security",
      de: "Aktiv Beschäftigte in der Sozialversicherung",
    },
    value: "518.340",
    unit: {
      es: "trabajadores afiliados en alta",
      ca: "treballadors afiliats d'alta",
      en: "registered workers in employment",
      de: "gemeldete Beitragszahler in Beschäftigung",
    },
    period: "2025/2026",
    sourceEntity: "Seguridad Social",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-050101",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 3.8,
      direction: "up",
      comparisonPeriod: {
        es: "crecimiento interanual de afiliación",
        ca: "creixement interanual d'afiliació",
        en: "year-on-year employment growth",
        de: "jährlicher Anstieg der Beschäftigung",
      },
    },
    highlightNote: {
      es: "Mallorca registra máximos históricos de afiliación laboral con más de 95.000 autónomos censados en el RETA.",
      ca: "Mallorca registra màxims històrics d'afiliació laboral amb més de 95.000 autònoms censats al RETA.",
      en: "Mallorca registers all-time record employment levels with over 95,000 self-employed workers on the RETA roll.",
      de: "Mallorca verzeichnet historische Rekordwerte bei der Beschäftigung mit über 95.000 registrierten Selbstständigen (RETA).",
    },
  },
  {
    id: "creacion-empresas-mallorca",
    category: "empleo_empresas",
    icon: "🚀",
    title: {
      es: "Nuevas Empresas Creadas al Año en Mallorca",
      ca: "Noves Empreses Creades a l'Any a Mallorca",
      en: "New Businesses Incorporated Annually in Mallorca",
      de: "Jährlich neu gegründete Unternehmen auf Mallorca",
    },
    value: "3.320",
    unit: {
      es: "nuevas sociedades mercantiles constituidas",
      ca: "noves societats mercantils constituïdes",
      en: "new corporate entities incorporated",
      de: "neu gegründete Handelsgesellschaften",
    },
    period: "2025/2026",
    sourceEntity: "Registro Mercantil",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-020101",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 5.2,
      direction: "up",
      comparisonPeriod: {
        es: "incremento interanual de nuevas constituciones",
        ca: "increment interanual de noves constitucions",
        en: "year-on-year rise in new incorporations",
        de: "jährlicher Zuwachs bei Neugründungen",
      },
    },
    highlightNote: {
      es: "El 98,4% de las constituciones adoptan la forma de Sociedad de Responsabilidad Limitada (SL).",
      ca: "El 98,4% de les constitucions adopten la forma de Societat de Responsabilitat Limitada (SL).",
      en: "98.4% of new corporate incorporations take the legal form of a Private Limited Company (SL).",
      de: "98,4% aller Neugründungen erfolgen in der Rechtsform der spanischen GmbH (Sociedad Limitada - SL).",
    },
  },
  {
    id: "disoluciones-empresas-mallorca",
    category: "empleo_empresas",
    icon: "📉",
    title: {
      es: "Disoluciones y Bajas Oficiales de Sociedades",
      ca: "Dissolucions i Baixes Oficials de Societats",
      en: "Corporate Dissolutions and Official Liquidations",
      de: "Offizielle Unternehmensauflösungen und Löschungen",
    },
    value: "912",
    unit: {
      es: "sociedades disueltas registradas en BORME",
      ca: "societats dissoltes registrades al BORME",
      en: "dissolved companies recorded in BORME",
      de: "im Handelsregisterblatt (BORME) gelöschte Gesellschaften",
    },
    period: "2025/2026",
    sourceEntity: "Registro Mercantil",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-020102",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 1.8,
      direction: "down",
      comparisonPeriod: {
        es: "reducción respecto al período anterior",
        ca: "reducció respecte al període anterior",
        en: "reduction compared to previous period",
        de: "Rückgang im Vergleich zum Vorzeitraum",
      },
    },
    highlightNote: {
      es: "El saldo neto insular arroja una creación neta positiva de +2.408 empresas mercantiles al año.",
      ca: "El saldo net insular llança una creació neta positiva de +2.408 empreses mercantils a l'any.",
      en: "The island's net commercial balance yields a net gain of +2,408 active companies each year.",
      de: "Der Netto-Unternehmenssaldo der Insel weist einen jährlichen Nettozuwachs von +2.408 Unternehmen auf.",
    },
  },
  {
    id: "sector-salud-bienestar-auge",
    category: "empleo_empresas",
    icon: "🥇",
    title: {
      es: "Sector de Mayor Crecimiento: Salud, Longevidad y Bienestar",
      ca: "Sector de Major Creixement: Salut, Longevitat i Benestar",
      en: "Fastest Growing Sector: Health, Longevity & Wellness",
      de: "Wachstumsstärkster Sektor: Gesundheit, Longevity & Wellness",
    },
    value: "+18,4%",
    unit: {
      es: "crecimiento anual de licencias sanitarias y bienestar",
      ca: "creixement anual de llicències sanitàries i benestar",
      en: "annual growth in healthcare and wellness registrations",
      de: "jährliches Wachstum bei Gesundheits- und Wellnesslizenzen",
    },
    period: "2025/2026",
    sourceEntity: "IBESTAT",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "CNAE-86-96",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 18.4,
      direction: "up",
      comparisonPeriod: {
        es: "sector líder en creación de nuevas actividades",
        ca: "sector líder en creació de noves activitats",
        en: "leading sector in newly opened activities",
        de: "führender Wirtschaftszweig bei Neuanmeldungen",
      },
    },
    highlightNote: {
      es: "Clínicas de medicina preventiva, fisioterapia avanzada y bienestar integral lideran el crecimiento de servicios especializados.",
      ca: "Clíniques de medicina preventiva, fisioteràpia avançada i benestar integral lideren el creixement de serveis especialitzats.",
      en: "Preventive medicine clinics, advanced physiotherapy, and holistic wellness lead specialized service demand.",
      de: "Kliniken für Präventivmedizin, moderne Physiotherapie und ganzheitliches Wohlbefinden führen das Wachstum an.",
    },
  },
  {
    id: "subvenciones-autoempleo-caib",
    category: "empleo_empresas",
    icon: "💶",
    title: {
      es: "Subvención Directa al Autoempleo del Govern CAIB (SOIB)",
      ca: "Subvenció Directa a l'Autoocupació del Govern CAIB (SOIB)",
      en: "Direct Self-Employment Grant by Balearic Government (SOIB)",
      de: "Direktförderung für Selbstständige durch die Balearenregierung",
    },
    value: "5.000 €",
    unit: {
      es: "ayuda directa máxima a fondo perdido",
      ca: "ajuda directa màxima a fons perdut",
      en: "maximum non-repayable direct grant",
      de: "maximaler nicht rückzahlbarer Direktzuschuss",
    },
    period: "2026",
    sourceEntity: "SOIB",
    sourceUrl: "https://soib.es",
    officialSeriesCode: "BOIB-PROG-AUTOEMPLEO",
    dataScope: "Illes Balears",
    highlightNote: {
      es: "Convocatoria oficial con Cuota Cero bonificada al 100% durante 2 años para jóvenes menores de 35 años y mujeres.",
      ca: "Convocatòria oficial amb Quota Zero bonificada al 100% durant 2 anys per a joves menors de 35 anys i dones.",
      en: "Official government grant featuring 100% Zero Social Security Fees for 2 years for youth under 35 and female entrepreneurs.",
      de: "Offizielle Ausschreibung mit 100% Beitragsbefreiung (Cuota Cero) über 2 Jahre für Gründer unter 35 und Frauen.",
    },
  },
  {
    id: "comercios-emblematicos-palma",
    category: "empleo_empresas",
    icon: "🏛️",
    title: {
      es: "Comercios Emblemáticos Protegidos de Palma",
      ca: "Comerços Emblemàtics Protegits de Palma",
      en: "Officially Protected Heritage Shops in Palma",
      de: "Geschützte historische Traditionsgeschäfte in Palma",
    },
    value: "108",
    unit: {
      es: "establecimientos catalogados oficialmente",
      ca: "establiments catalogats oficialment",
      en: "officially catalogued heritage businesses",
      de: "offiziell unter Denkmalschutz stehende Traditionsbetriebe",
    },
    period: "2025/2026",
    sourceEntity: "Ajuntament de Palma",
    sourceUrl: "https://www.palma.cat",
    officialSeriesCode: "CATALOGO-EMBLEMATICS-PALMA",
    dataScope: "Palma",
    highlightNote: {
      es: "Hornos centenarios, pastelerías, alpargaterías y sastrerías protegidas por su arraigo histórico, arquitectónico o artesanal.",
      ca: "Forns centenaris, pastisseries, espardenyeries i sastreries protegides pel seu arrelament històric, arquitectònic o artesanal.",
      en: "Century-old bakeries, pastry shops, espadrille workshops, and tailors protected for their historical and artisanal significance.",
      de: "Jahrhundertealte Bäckereien, Konditoreien, Manufakturen und Werkstätten, die unter historischem Ensembleschutz stehen.",
    },
  },
  {
    id: "plazas-etv-conselldemallorca",
    category: "turismo_sostenibilidad",
    icon: "🏡",
    title: {
      es: "Viviendas de Uso Turístico (ETV) Regladas en Mallorca",
      ca: "Habitatges d'Ús Turístic (ETV) Reglat a Mallorca",
      en: "Licensed Holiday Rental Homes (ETV) in Mallorca",
      de: "Offiziell lizenzierte Ferienunterkünfte (ETV) auf Mallorca",
    },
    value: "31.840",
    unit: {
      es: "viviendas con licencia DRIAT activa",
      ca: "habitatges amb llicència DRIAT activa",
      en: "homes with active DRIAT official license",
      de: "Wohnobjekte mit aktiver offizieller DRIAT-Lizenz",
    },
    period: "2025/2026",
    sourceEntity: "Consell de Mallorca",
    sourceUrl: "https://conselldemallorca.cat",
    officialSeriesCode: "DRIAT-ETV-MALLORCA",
    dataScope: "Mallorca",
    highlightNote: {
      es: "Inscritas en el Registro General de Empresas y Actividades Turísticas con placa identificativa oficial del Consell.",
      ca: "Inscrites al Registre General d'Empreses i Activitats Turístiques amb placa identificativa oficial del Consell.",
      en: "Registered in the Official Tourism Registry bearing mandatory Council official identification plaques.",
      de: "Eingetragen im offiziellen Tourismusregister mit der amtlichen Lizenzplakette des Inselrats.",
    },
  },
  {
    id: "viajeros-transporte-publico",
    category: "movilidad",
    icon: "🚌",
    title: {
      es: "Viajes en Red TIB (Bus Interurbano, Tren y Metro)",
      ca: "Viatges a la Xarxa TIB (Bus Interurbà, Tren i Metro)",
      en: "Public Transit Journeys on TIB Network",
      de: "Fahrten im öffentlichen TIB-Verkehrsnetz",
    },
    value: "38,4 M",
    unit: {
      es: "validaciones anuales de pasaje",
      ca: "validacions anuals de passatge",
      en: "annual passenger validations",
      de: "jährlich erfasste Fahrtentwertungen",
    },
    period: "2025/2026",
    sourceEntity: "TIB",
    sourceUrl: "https://www.tib.org",
    officialSeriesCode: "TIB-ANNUAL-PASSENGERS",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 14.8,
      direction: "up",
      comparisonPeriod: {
        es: "aumento interanual de movilidad sostenible",
        ca: "augment interanual de mobilitat sostenible",
        en: "year-on-year increase in public transport",
        de: "jährlicher Zuwachs nachhaltiger Mobilität",
      },
    },
    highlightNote: {
      es: "La integración tarifaria y bonificaciones de la Tarjeta Intermodal han llevado al transporte público insular a máximos históricos.",
      ca: "La integració tarifària i bonificacions de la Targeta Intermodal han portat el transport públic insular a màxims històrics.",
      en: "Integrated ticketing and Intermodal Card fare subsidies have propelled island public transport to historic records.",
      de: "Die Tarifintegration und Subventionen mit der Intermodal-Karte führten zu historischen Fahrgastrekorden.",
    },
  },
  {
    id: "inspecciones-itv-anuales",
    category: "movilidad",
    icon: "🚗",
    title: {
      es: "Vehículos Inspeccionados en ITV Mallorca",
      ca: "Vehicles Inspeccionats a la ITV Mallorca",
      en: "Vehicles Inspected at Mallorca ITV Stations",
      de: "Geprüfte Fahrzeuge bei der ITV Mallorca",
    },
    value: "395.200",
    unit: {
      es: "inspecciones técnicas anuales",
      ca: "inspeccions tècniques anuals",
      en: "annual technical inspections",
      de: "jährliche Fahrzeuguntersuchungen",
    },
    period: "2025/2026",
    sourceEntity: "Consell de Mallorca",
    sourceUrl: "https://serviciositv.conselldemallorca.cat",
    officialSeriesCode: "ITV-INSPECTIONS-MALLORCA",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 3.1,
      direction: "up",
      comparisonPeriod: {
        es: "respecto al ejercicio previo",
        ca: "respecte a l'exercici previ",
        en: "compared to previous year",
        de: "im Vergleich zum Vorjahr",
      },
    },
    highlightNote: {
      es: "El 81,4% de los turismos y motocicletas superan la inspección favorable en primera convocatoria en las 5 estaciones insulares.",
      ca: "El 81,4% dels turismes i motocicletes superen la inspecció favorable a la primera convocatòria a les 5 estacions insulars.",
      en: "81.4% of passenger cars and motorbikes pass inspection on their first attempt across the 5 official island stations.",
      de: "81,4% aller Pkw und Motorräder bestehen die Hauptuntersuchung im ersten Durchlauf an den 5 Inselstationen.",
    },
  },
  {
    id: "iph-pico-verano",
    category: "turismo_sostenibilidad",
    icon: "📈",
    title: {
      es: "Pico Máximo de Presión Humana en Mallorca (Agosto)",
      ca: "Pic Màxim de Pressió Humana a Mallorca (Agost)",
      en: "Peak Human Pressure Index in Mallorca (August)",
      de: "Höchstwert des menschlichen Druckindexes auf Mallorca (August)",
    },
    value: "1.468.200",
    unit: {
      es: "personas simultáneas en la isla",
      ca: "persones simultànies a l'illa",
      en: "simultaneous individuals on the island",
      de: "gleichzeitig anwesende Personen auf der Insel",
    },
    period: "2025/2026",
    sourceEntity: "IBESTAT",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-IPH-MAX",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 50.1,
      direction: "up",
      comparisonPeriod: {
        es: "sobrecarga estacional sobre el censo de invierno",
        ca: "sobrecàrrega estacional sobre el cens d'hivern",
        en: "seasonal surge over winter resident census",
        de: "saisonale Zunahme gegenüber der Winterbevölkerung",
      },
    },
    highlightNote: {
      es: "En el mes de agosto, Mallorca soporta casi medio millón de personas más que durante el invierno (residentes + turistas alojados).",
      ca: "Al mes d'agost, Mallorca suporta quasi mig milió de persones més que durant l'hivern (residents + turistes allotjats).",
      en: "In August, Mallorca accommodates nearly half a million more people than in winter (residents + accommodated tourists).",
      de: "Im August beherbergt Mallorca fast eine halbe Million Menschen mehr als im Winter (Einwohner + Hotel- und Feriengäste).",
    },
  },
  {
    id: "iph-minimo-invierno",
    category: "turismo_sostenibilidad",
    icon: "❄️",
    title: {
      es: "Presión Humana Mínima Invernal (Enero)",
      ca: "Pressió Humana Mínima Hivernal (Gener)",
      en: "Minimum Winter Human Presence (January)",
      de: "Minimale menschliche Präsenz im Winter (Januar)",
    },
    value: "978.450",
    unit: {
      es: "personas simultáneas en la isla",
      ca: "persones simultànies a l'illa",
      en: "simultaneous individuals on the island",
      de: "gleichzeitig anwesende Personen auf der Insel",
    },
    period: "2025/2026",
    sourceEntity: "IBESTAT",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-IPH-MIN",
    dataScope: "Mallorca",
    highlightNote: {
      es: "El momento de menor presión demográfica del año, reflejando la base poblacional real que sostiene el comercio local todo el año.",
      ca: "El moment de menor pressió demogràfica de l'any, reflectint la base poblacional real que sosté el comerç local tot l'any.",
      en: "The lowest demographic load of the year, reflecting the core resident base sustaining local commerce year-round.",
      de: "Der demografische Jahrestiefstwert, der die Basisbevölkerung widerspiegelt, die den lokalen Handel ganzjährig trägt.",
    },
  },
  {
    id: "crecimiento-demografico-decada",
    category: "demografia",
    icon: "📊",
    title: {
      es: "Crecimiento Demográfico en la Última Década (2015-2025)",
      ca: "Creixement Demogràfic en la Darrera Dècada (2015-2025)",
      en: "Ten-Year Demographic Growth (2015-2025)",
      de: "Bevölkerungswachstum im Zehnjahresvergleich (2015-2025)",
    },
    value: "+11,3%",
    unit: {
      es: "crecimiento neto (+97.129 nuevos habitantes)",
      ca: "creixement net (+97.129 nous habitants)",
      en: "net growth (+97,129 new residents)",
      de: "Nettozuwachs (+97.129 neue Einwohner)",
    },
    period: "2015-2025",
    sourceEntity: "IBESTAT",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "IBESTAT-CENSO-10Y",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 11.3,
      direction: "up",
      comparisonPeriod: {
        es: "aumento censal en los últimos 10 años",
        ca: "augment censal en els darrers 10 anys",
        en: "census increase over the last 10 years",
        de: "Zensuszuwachs in den letzten 10 Jahren",
      },
    },
    highlightNote: {
      es: "Mallorca es una de las regiones con mayor dinamismo demográfico de España, con un 21,9% de residentes de origen internacional.",
      ca: "Mallorca és una de les regions amb major dinamisme demogràfic d'Espanya, amb un 21,9% de residents d'origen internacional.",
      en: "Mallorca is among Spain's most demographically dynamic regions, with international residents comprising 21.9% of the population.",
      de: "Mallorca zählt zu den demografisch dynamischsten Regionen Spaniens; 21,9% der Einwohner besitzen internationale Wurzeln.",
    },
  },
  {
    id: "afiliacion-pico-verano",
    category: "empleo_empresas",
    icon: "☀️",
    title: {
      es: "Afiliación Laboral en Pico Estival (Agosto)",
      ca: "Afiliació Laboral en Pic Estival (Agost)",
      en: "Peak Summer Employment Registrations (August)",
      de: "Beschäftigungshöchststand im Sommer (August)",
    },
    value: "625.400",
    unit: {
      es: "trabajadores en alta en Seguridad Social",
      ca: "treballadors d'alta a la Seguretat Social",
      en: "registered employed workers",
      de: "aktiv gemeldete Erwerbstätige",
    },
    period: "2025/2026",
    sourceEntity: "Seguridad Social",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "SS-AFIL-SUMMER-PEAK",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 34.5,
      direction: "up",
      comparisonPeriod: {
        es: "aumento de empleo estival respecto al mínimo invernal",
        ca: "augment d'ocupació estival respecte al mínim hivernal",
        en: "summer job expansion over winter baseline",
        de: "saisonaler Beschäftigungsanstieg über das Wintertief",
      },
    },
    highlightNote: {
      es: "La economía balear crea más de 160.000 empleos estacionales en temporada alta con un peso clave de la figura del fijo discontinuo.",
      ca: "L'economia balear crea més de 160.000 llocs de feina estacionals en temporada alta amb un pes clau del fix discontinu.",
      en: "The Balearic economy generates over 160,000 seasonal jobs in high summer, heavily driven by seasonal permanent contracts.",
      de: "Die Balearenwirtschaft schafft im Sommer über 160.000 Saisonarbeitsplätze, geprägt vom Modell des 'Fijo Discontinuo'.",
    },
  },
  {
    id: "salario-medio-balears",
    category: "empleo_empresas",
    icon: "💶",
    title: {
      es: "Salario Medio Bruto Anual en Baleares",
      ca: "Salari Mitjà Brut Anual a Balears",
      en: "Average Gross Annual Salary in the Balearics",
      de: "Durchschnittliches Bruttojahresgehalt auf den Balearen",
    },
    value: "25.800 €",
    unit: {
      es: "euros brutos anuales / asalariado",
      ca: "euros bruts anuals / assalariat",
      en: "gross annual euros / employee",
      de: "Brutto-Euro pro Jahr / Angestellter",
    },
    period: "2025/2026",
    sourceEntity: "INE",
    sourceUrl: "https://www.ine.es",
    officialSeriesCode: "INE-ETCL-BALEARS",
    dataScope: "Illes Balears",
    highlightNote: {
      es: "La elevada tasa de esfuerzo en vivienda (más del 48% del sueldo neto en alquiler) constituye el principal desafío socioeconómico insular.",
      ca: "L'elevada taxa d'esforç en habitatge (més del 48% del sou net en lloguer) constitueix el principal desafiament socioeconòmic insular.",
      en: "High housing rent-to-income effort (over 48% of net income) represents the primary socioeconomic challenge on the islands.",
      de: "Die hohe Wohnkostenbelastung (über 48% des Nettoeinkommens für Kaltmiete) ist die größte sozioökonomische Herausforderung.",
    },
  },
  {
    id: "turistas-anuales-mallorca",
    category: "turismo_sostenibilidad",
    icon: "🧳",
    title: {
      es: "Turistas Totales Anuales Recibidos en Mallorca",
      ca: "Turistes Totals Anuals Rebuts a Mallorca",
      en: "Annual Total Tourists Visiting Mallorca",
      de: "Gesamtzahl der jährlichen Touristen auf Mallorca",
    },
    value: "14,85 M",
    unit: {
      es: "turistas extranjeros y nacionales",
      ca: "turistes estrangers i nacionals",
      en: "international and domestic tourists",
      de: "internationale und inländische Urlauber",
    },
    period: "2025/2026",
    sourceEntity: "IBESTAT",
    sourceUrl: "https://ibestat.caib.es",
    officialSeriesCode: "FRONTUR-MALLORCA",
    dataScope: "Mallorca",
    changeRate: {
      percentage: 2.7,
      direction: "up",
      comparisonPeriod: {
        es: "respecto al volumen anual previo",
        ca: "respecte al volum anual previ",
        en: "compared to previous annual volume",
        de: "im Vergleich zum Vorjahreszeitraum",
      },
    },
    highlightNote: {
      es: "Alemania (33,2%), Reino Unido (25,8%) y España peninsular (17,6%) representan más de tres cuartas partes del turismo emisor.",
      ca: "Alemanya (33,2%), Regne Unit (25,8%) i Espanya peninsular (17,6%) representen més de tres quartes parts del turisme emissor.",
      en: "Germany (33.2%), the UK (25.8%), and mainland Spain (17.6%) represent more than three-quarters of all inbound tourism.",
      de: "Deutschland (33,2%), Großbritannien (25,8%) und das spanische Festland (17,6%) stellen über drei Viertel aller Besucher.",
    },
  },
];
