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
  versionLabel: string;
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

export const CURRENT_PLATFORM_VERSION = "0.01-beta";
export const PLATFORM_RELEASE_DATE = "2026-08-28";
export const PLATFORM_LAST_BUILD_TIMESTAMP = "2026-08-28T13:28:00+02:00";

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
    version: "0.01",
    versionLabel: "v0.01-beta · Lanzamiento y Cimentación del Ecosistema Balear",
    type: "BETA",
    date: "2026-08-28",
    summary: {
      es: "Primera versión pública beta de Servicios Mallorca: catálogo verificado de 313 comercios, Cuadro de Honor meritocrático, diseño 100% responsivo y arquitectura Cloudflare Edge.",
      en: "First public beta release of Servicios Mallorca: verified directory of 313 local businesses, merit-based Honor Board, 100% responsive design, and Cloudflare Edge architecture.",
      ca: "Primera versió pública beta de Serveis Mallorca: catàleg verificat de 313 comerços, Quadre d'Honor meritocràtic, disseny 100% adaptatiu i arquitectura Cloudflare Edge.",
      de: "Erste öffentliche Beta-Version von Servicios Mallorca: verifiziertes Verzeichnis von 313 Betrieben, Honor Board, 100% responsives Design und Cloudflare Edge-Architektur.",
    },
    highlights: {
      es: [
        "313 Comercios y Servicios Reales verificados bajo la regla Zero Fake Data (GR-11).",
        "Cuadro de Honor Balear con vista continua 'a simple vista' y pujas iniciales reales desde 1,00€.",
        "Dropdown del Directorio sincronizado alfabéticamente con contador en tiempo real de comercios disponibles.",
        "Navbar Unificado y optimizado (<850px en escritorio, drawer táctil sin duplicación en móvil).",
        "Buscador predictivo en vivo y geolocalización precisa en las 6 comarcas de Mallorca.",
      ],
      en: [
        "313 verified local businesses audited under the strict Zero Fake Data rule (GR-11).",
        "Honor Board with full continuous view and genuine €1.00 starting baseline bids.",
        "Directory dropdown sorted alphabetically with real-time business counts per category.",
        "Unified streamlined Navbar (<850px on desktop, zero DOM duplicates in mobile drawer).",
        "Predictive live search and precise GPS geolocation across all 6 Mallorca regions.",
      ],
      ca: [
        "313 Comerços i Serveis Reals verificats sota la regla Zero Fake Data (GR-11).",
        "Quadre d'Honor Balear amb visualització contínua i licitacions inicials des d'1,00€.",
        "Desplegable del Directori sincronitzat alfabèticament amb comptador en temps real.",
        "Barra de navegació unificada (<850px a l'escriptori, drawer tàctil sense duplicats).",
        "Cercador predictiu en viu i geolocalització exacta a les 6 comarques de Mallorca.",
      ],
      de: [
        "313 geprüfte Unternehmen auf Mallorca nach dem Zero Fake Data-Standard (GR-11).",
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
          es: "Purga de Jerga Técnica y Blindaje de Lenguaje de Usuario",
          en: "Jargon Purge & Clean User Experience Language",
          ca: "Purga d'Acònims Tècnics i Llenguatge Clar d'Usuari",
          de: "Entfernung technischer Kürzel & Klare Benutzersprache",
        },
        description: {
          es: "Eliminación de siglas internas de desarrollo (GR-11, GR-01) en las interfaces visibles para hablar a residentes y turistas en un tono natural, profesional y transparente.",
          en: "Removal of internal technical acronyms across all user-facing screens for clean, natural and accessible communication.",
          ca: "Eliminació de sigles tècniques a la interfície pública per oferir un tracte natural, clar i professional.",
          de: "Entfernung interner Entwicklerkürzel auf allen öffentlichen Seiten für eine verständliche und kundennahe Kommunikation.",
        },
        badgeText: { es: "Claridad", en: "Clarity", ca: "Claredat", de: "Klarheit" },
      },
      {
        category: "PERFORMANCE",
        title: {
          es: "Despliegue y Edge Healthcheck en Cloudflare Workers",
          en: "Cloudflare Workers Edge Deploy & Live Healthchecks",
          ca: "Desplegament i Verificació en Viu a Cloudflare Workers",
          de: "Cloudflare Workers Edge Deployment & Live Healthchecks",
        },
        description: {
          es: "Pipeline de entrega continua con 74 suites de prueba (609 tests unitarios) y verificación en vivo HTTP 200/302 en <300ms.",
          en: "Continuous delivery pipeline with 74 test suites (609 unit tests) and live HTTP 200/302 verification in <300ms.",
          ca: "Pipeline de desplegament continu amb 74 suites de test (609 proves) i verificació en viu en menys de 300ms.",
          de: "Continuous-Deployment-Pipeline mit 74 Test-Suites (609 Unit-Tests) und Live-Überprüfung in unter 300ms.",
        },
        badgeText: { es: "Infraestructura", en: "Infrastructure", ca: "Infraestructura", de: "Infrastruktur" },
      },
    ],
  },
];
