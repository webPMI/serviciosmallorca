/**
 * changelog.ts
 *
 * Registro Maestro de Versiones, Novedades, Mantenimiento y Roadmap de Servicios Mallorca.
 * Cumple con GR-03 (TypeScript estricto) y GR-04 (i18n cuatrilingüe).
 */

export type ReleaseType = "MAJOR" | "MINOR" | "PATCH" | "BETA";
export type ChangelogCategory = "FEATURE" | "FIX" | "PERFORMANCE" | "TAXONOMY" | "SECURITY" | "DOCS";

export interface ChangelogEntry {
  category: ChangelogCategory;
  title: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  description: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  badgeText?: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
}

export interface ReleaseLog {
  version: string;
  versionLabel: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  type: ReleaseType;
  date: string; // ISO 8601
  summary: {
    es: string;
    en: string;
    ca: string;
    de: string;
  };
  highlights: {
    es: string[];
    en: string[];
    ca: string[];
    de: string[];
  };
  entries: ChangelogEntry[];
}

export const CURRENT_PLATFORM_VERSION = "0.02-beta";
export const PLATFORM_RELEASE_DATE = "2026-08-29";
export const PLATFORM_LAST_BUILD_TIMESTAMP = "2026-08-29T10:50:00+02:00";

/**
 * Devuelve la fecha y hora formateada de la última actualización según el idioma.
 */
export function getFormattedBuildTimestamp(locale: "es" | "en" | "ca" | "de" = "es"): string {
  const d = new Date(PLATFORM_LAST_BUILD_TIMESTAMP);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  };

  const localeMap = {
    es: "es-ES",
    en: "en-GB",
    ca: "ca-ES",
    de: "de-DE",
  };

  return d.toLocaleDateString(localeMap[locale] || "es-ES", options);
}

export const CHANGELOG_RELEASES: ReleaseLog[] = [
  {
    version: "0.02",
    versionLabel: {
      es: "v0.02-beta · Rediseño Editorial del Blog, Directorio Reactivo y Optimizaciones SEO",
      en: "v0.02-beta · Editorial Blog Redesign, Reactive Directory & SEO Optimizations",
      ca: "v0.02-beta · Redisseny Editorial del Blog, Directori Reactiu i Optimitzacions SEO",
      de: "v0.02-beta · Redaktionelles Blog-Redesign, Reaktives Verzeichnis & SEO-Optimierung",
    },
    type: "BETA",
    date: "2026-08-29",
    summary: {
      es: "Gran actualización editorial y visual: nuevo diseño magazine para el blog con TOC sticky y barra de progreso, directorio de servicios con ordenación dinámica y vista de lista/tarjetas, y optimizaciones de SEO/Sitemap globales.",
      en: "Major visual and editorial update: magazine-style layout for the blog with sticky TOC and reading progress bar, reactive directory with live sorting and grid/list toggle, and global SEO/Sitemap enhancements.",
      ca: "Gran actualització editorial i visual: nou disseny magazine per al blog amb TOC sticky i barra de progrés, directori de serveis amb ordenació dinàmica i commutador targeta/llista, i optimitzacions SEO/Sitemap.",
      de: "Großes visuelles und redaktionelles Update: Magazin-Layout für den Blog mit Sticky-Inhaltsverzeichnis und Lesefortschrittsbalken, reaktives Verzeichnis mit Live-Sortierung und Listenansicht sowie umfassende SEO/Sitemap-Optimierungen.",
    },
    highlights: {
      es: [
        "Rediseño completo del Blog: BlogCard con badge de tipo de post, índice con live search y detalle con TOC sticky.",
        "Directorio interactivo con vista Grid/List y ordenación dinámica por Mejor Valorado, A-Z y Más Reciente.",
        "Hero de la página de inicio con estadísticas en vivo animadas mediante IntersectionObserver.",
        "Ficha de servicio con barra de progreso, metadatos enriquecidos de Open Graph y Schema.org BreadcrumbList.",
        "Sitemap dinámico multilingüe actualizado con indexación de secciones editoriales e itinerarios.",
      ],
      en: [
        "Complete Blog redesign: enhanced BlogCard, live search index, and sticky TOC article layout with reading progress.",
        "Interactive directory featuring Grid/List toggle and dynamic sorting by Best Rated, A-Z, and Newest.",
        "Homepage hero with real-time statistics animated via IntersectionObserver.",
        "Service detail pages with reading progress bar, rich Open Graph metadata, and Schema.org BreadcrumbList.",
        "Multilingual dynamic sitemap indexing all editorial and tour routes.",
      ],
      ca: [
        "Redisseny complet del Blog: BlogCard amb tipus de post, cerca en viu i detall amb TOC sticky i progrés.",
        "Directori interactiu amb commutador Grid/List i ordenació dinàmica per Millor Valorat, A-Z i Més Recent.",
        "Hero de la pàgina d'inici amb estadístiques en viu animades mitjançant IntersectionObserver.",
        "Ficha de servei amb barra de progrés, metadades Open Graph enriquides i BreadcrumbList Schema.org.",
        "Sitemap dinàmic multilingüe actualitzat amb totes les rutes del blog i tours.",
      ],
      de: [
        "Komplettes Blog-Redesign: BlogCard mit Beitragsart-Badges, Live-Suche und Sticky-TOC mit Lesefortschrittsbalken.",
        "Interaktives Verzeichnis mit Grid/Listenansicht und dynamischer Sortierung (Beste Bewertung, A-Z, Neueste).",
        "Startseiten-Hero mit animierten Live-Statistiken über IntersectionObserver.",
        "Detaillierte Dienstleistungsseiten mit Lesebalken, Open-Graph-Metadaten und Schema.org BreadcrumbList.",
        "Dynamische mehrsprachige Sitemap mit vollständiger Indexierung redaktioneller Inhalte und Routen.",
      ],
    },
    entries: [
      {
        category: "FEATURE",
        title: {
          es: "Rediseño Magazine del Blog & TOC Sticky",
          en: "Magazine Blog Redesign & Sticky TOC",
          ca: "Redisseny Magazine del Blog i TOC Sticky",
          de: "Magazin-Design für das Blog & Sticky Inhaltsverzeichnis",
        },
        description: {
          es: "Nueva experiencia de lectura con cálculo de tiempo de lectura, barra de progreso fija, índice de contenidos interactivo y botones para compartir.",
          en: "New reading experience with estimated read time, fixed progress bar, interactive table of contents, and native share tools.",
          ca: "Nova experiència de lectura amb temps estimat, barra de progrés fixa, índex interactiu i eines per compartir.",
          de: "Neues Leseerlebnis mit geschätzter Lesezeit, fixiertem Fortschrittsbalken, interaktivem Inhaltsverzeichnis und Share-Tools.",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Directorio de Servicios con Toggle de Vistas y Ordenación",
          en: "Service Directory with View Toggle & Live Sorting",
          ca: "Directori de Serveis amb Commutador de Vistes i Ordenació",
          de: "Dienstleistungsverzeichnis mit Ansichtsumschaltung & Live-Sortierung",
        },
        description: {
          es: "Permite cambiar entre tarjetas y lista compacta, además de ordenar los resultados en tiempo real sin recargar la página.",
          en: "Allows toggling between card and compact list views, plus instant client-side sorting without page reload.",
          ca: "Permet alternar entre targetes i llista compacta, a més d'ordenar resultats en temps real.",
          de: "Ermöglicht das Umschalten zwischen Karten- und Listenansicht sowie Sortierung in Echtzeit ohne Neuladen.",
        },
      },
    ],
  },
  {
    version: "0.01",
    versionLabel: {
      es: "v0.01-beta · Lanzamiento y Cimentación del Ecosistema Balear",
      en: "v0.01-beta · Launch & Foundation of the Balearic Ecosystem",
      ca: "v0.01-beta · Llançament i Fonamentació de l'Ecosistema Balear",
      de: "v0.01-beta · Start & Grundsteinlegung des Balearen-Ökosystems",
    },
    type: "BETA",
    date: "2026-08-28",
    summary: {
      es: "Primera versión pública beta de Servicios Mallorca: catálogo de 313 comercios auditados mediante búsqueda continua en fuentes oficiales, Cuadro de Honor meritocrático, diseño 100% responsivo y arquitectura de alta velocidad.",
      en: "First public beta release of Servicios Mallorca: directory of 313 local businesses audited through continuous public research, merit-based Honor Board, 100% responsive design, and high-speed architecture.",
      ca: "Primera versió pública beta de Serveis Mallorca: catàleg de 313 comerços auditats mitjançant recerca contínua en fonts oficials, Quadre d'Honor meritocràtic, disseny 100% adaptatiu i arquitectura d'alta velocitat.",
      de: "Erste öffentliche Beta-Version von Servicios Mallorca: Verzeichnis von 313 Betrieben, auditiert durch stetige Recherche offizieller Quellen, Honor Board, 100% responsives Design und Highspeed-Architektur.",
    },
    highlights: {
      es: [
        "313 Comercios auditados mediante búsqueda constante en fuentes públicas e intentos de verificación exhaustiva.",
        "Cuadro de Honor Balear con vista continua 'a simple vista' y pujas iniciales reales desde 1,00€.",
        "Dropdown del Directorio sincronizado alfabéticamente con contador en tiempo real de comercios disponibles.",
        "Navbar Unificado y optimizado (<850px en escritorio, drawer táctil sin duplicación en móvil).",
        "Buscador predictivo en vivo y geolocalización precisa en las 6 comarcas de Mallorca.",
      ],
      en: [
        "313 businesses audited through continuous public intelligence and exhaustive contrast steps.",
        "Honor Board with full continuous view and genuine €1.00 starting baseline bids.",
        "Directory dropdown sorted alphabetically with real-time business counts per category.",
        "Unified streamlined Navbar (<850px on desktop, zero DOM duplicates in mobile drawer).",
        "Predictive live search and precise GPS geolocation across all 6 Mallorca regions.",
      ],
      ca: [
        "313 Comerços auditats mitjançant cerca constant en fonts públiques i verificació exhaustiva.",
        "Quadre d'Honor Balear amb visualització contínua i licitacions inicials des d'1,00€.",
        "Desplegable del Directori sincronitzat alfabèticament amb comptador en temps real.",
        "Barra de navegació unificada (<850px a l'escriptori, drawer tàctil sense duplicats).",
        "Cercador predictiu en viu i geolocalització exacta a les 6 comarques de Mallorca.",
      ],
      de: [
        "313 Unternehmen, auditiert durch kontinuierliche Recherche in offiziellen Quellen.",
        "Ehrentafel mit kontinuierlicher Gesamtansicht und echten Startgeboten ab 1,00€.",
        "Verzeichnis-Dropdown alphabetisch sortiert mit Echtzeitanzeige der Betriebe pro Kategorie.",
        "Einheitliche, kompakte Navigation (<850px Desktop, ohne Duplikate auf Mobilgeräten).",
        "Live-Suche und präzise GPS-Standortbestimmung für alle 6 Regionen Mallorcas.",
      ],
    },
    entries: [
      {
        category: "FEATURE",
        title: {
          es: "Cuadro de Honor 'A Simple Vista' y Subastas Comunitarias",
          en: "Continuous Honor Board & Community Auctions",
          ca: "Quadre d'Honor 'A Simple Vista' i Subhastes Comunitàries",
          de: "Ehrentafel mit Direktansicht & Community-Auktionen",
        },
        description: {
          es: "Rediseño completo para eliminar pestañas ocultas: todos los gremios son visibles de forma fluida con barra de saltos rápidos por anclas y pujas desde 1,00€.",
          en: "Complete redesign removing hidden tabs: all guilds are visible continuously with quick-jump anchors and baseline bids from €1.00.",
          ca: "Redisseny complet per eliminar pestanyes ocultes: tots els gremis visibles contínuament amb enllaços ràpids i licitacions des d'1,00€.",
          de: "Vollständiges Redesign ohne versteckte Reiter: alle Kategorien sind direkt sichtbar mit Schnellzugriffs-Pills und Geboten ab 1,00€.",
        },
        badgeText: { es: "Meritocracia", en: "Merit-based", ca: "Meritocràcia", de: "Meritokratie" },
      },
      {
        category: "FEATURE",
        title: {
          es: "Componente Pedagógico 'Guía del Ecosistema'",
          en: "Ecosystem Guide Educational Component",
          ca: "Component Pedagògic 'Guia de l'Ecosistema'",
          de: "Pädagogische Ökosystem-Übersicht",
        },
        description: {
          es: "Módulo explicativo interactivo de los 6 pilares de la plataforma (Directorio, Honor, Deporte, Tours, Memoria Histórica y Empresas) con Schema.org JSON-LD.",
          en: "Interactive visual component explaining the 6 platform pillars with rich Schema.org JSON-LD structured data.",
          ca: "Mòdul interactiu que explica els 6 pilars de la plataforma amb dades estructurades Schema.org JSON-LD.",
          de: "Interaktive Übersicht über die 6 Plattform-Säulen inklusive Schema.org JSON-LD für Suchmaschinen.",
        },
        badgeText: { es: "SEO & Guía", en: "SEO & Guide", ca: "SEO & Guia", de: "SEO & Guide" },
      },
      {
        category: "FIX",
        title: {
          es: "Responsividad Fluida & Erradicación de Desbordamientos",
          en: "Fluid Responsiveness & Overflow Elimination",
          ca: "Responsivitat Fluida & Erradicació de Desbordaments",
          de: "Fluides Responsive Design & Overflow-Beseitigung",
        },
        description: {
          es: "Corrección de desbordamientos horizontales en pantallas móviles pequeñas (<480px) aplicando min-width: 0 y word-break seguro.",
          en: "Fixed horizontal overflow on small mobile screens (<480px) by applying min-width: 0 and word-break wrapping.",
          ca: "Correcció de desbordament horitzontal en mòbils petits (<480px) amb min-width: 0 i text-wrapping segur.",
          de: "Behebung von horizontalen Überläufen auf kleinen Mobilgeräten (<480px) durch min-width: 0 und Zeilenumbruch.",
        },
        badgeText: { es: "Responsive", en: "Responsive", ca: "Adaptatiu", de: "Mobil-Optimiert" },
      },
      {
        category: "SECURITY",
        title: {
          es: "Lenguaje Claro y Profesional para el Usuario",
          en: "Clean and Professional User Experience Language",
          ca: "Llenguatge Clar i Professional per a l'Usuari",
          de: "Verständliche und professionelle Benutzersprache",
        },
        description: {
          es: "Revisión de todas las interfaces visibles para hablar a residentes y turistas en un tono natural, profesional y transparente sin tecnicismos.",
          en: "Review of all user-facing interfaces to communicate in a natural, clear and transparent tone without technical jargon.",
          ca: "Revisió de totes les interfícies públiques per oferir un tracte natural, clar i professional sense tecnicismes.",
          de: "Überarbeitung aller Benutzeroberflächen für eine transparente, kundennahe und verständliche Kommunikation.",
        },
        badgeText: { es: "Claridad", en: "Clarity", ca: "Claredat", de: "Klarheit" },
      },
      {
        category: "PERFORMANCE",
        title: {
          es: "Alta Velocidad de Carga y Verificación Continua",
          en: "High Loading Speed & Continuous Healthchecks",
          ca: "Alta Velocitat de Càrrega i Verificació Contínua",
          de: "Hohe Ladegeschwindigkeit & Kontinuierliche Prüfung",
        },
        description: {
          es: "Arquitectura optimizada con 75 suites de prueba (612 tests unitarios) y verificación en vivo de respuesta en <300ms.",
          en: "Optimized architecture with 75 test suites (612 unit tests) and live response verification in <300ms.",
          ca: "Arquitectura optimitzada amb 75 suites de test (612 proves) i verificació en viu de resposta en menys de 300ms.",
          de: "Optimierte Architektur mit 75 Test-Suites (612 Unit-Tests) und Live-Antwortzeitprüfung in unter 300ms.",
        },
        badgeText: { es: "Velocidad", en: "Speed", ca: "Velocitat", de: "Geschwindigkeit" },
      },
    ],
  },
];
