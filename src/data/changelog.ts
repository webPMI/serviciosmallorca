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

export const CURRENT_PLATFORM_VERSION = "0.04-beta";
export const PLATFORM_RELEASE_DATE = "2026-09-02";
export const PLATFORM_LAST_BUILD_TIMESTAMP = "2026-09-02T14:35:00+02:00";

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
    version: "0.04",
    versionLabel: {
      es: "v0.04-beta · Core Web Vitals, Filtros de Intención Rápida & Rate Limiting RGPD",
      en: "v0.04-beta · Core Web Vitals, Quick Intent Filters & GDPR Rate Limiting",
      ca: "v0.04-beta · Core Web Vitals, Filtres d'Intenció Ràpida i Rate Limiting RGPD",
      de: "v0.04-beta · Core Web Vitals, Schnellfilter & DSGVO-Rate-Limiting",
    },
    type: "BETA",
    date: "2026-09-02",
    summary: {
      es: "Optimización de LCP con fetchpriority en imágenes principales, barra de filtros rápidos por intención en el buscador (Abierto ahora, Multilingüe, Terraza, Pet Friendly, Accesible) y blindaje de endpoints con limitador de tasa y anonimización RGPD.",
      en: "LCP optimization with fetchpriority on hero images, quick intent filter chips in directory (Open now, Multilingual, Terrace, Pet Friendly, Accessible) and API endpoint security hardening with GDPR-compliant sliding-window rate limiter.",
      ca: "Optimització de LCP amb fetchpriority a imatges principals, barra de filtres ràpids per intenció al directori (Obert ara, Multilingüe, Terrassa, Pet Friendly, Accessible) i protecció d'endpoints amb limitador de taxa RGPD.",
      de: "LCP-Optimierung mit fetchpriority bei Hauptbildern, Schnellfilter-Leiste im Verzeichnis (Jetzt geöffnet, Mehrsprachig, Mit Terrasse, Haustierfreundlich, Barrierefrei) und Endpunkt-Schutz mit DSGVO-konformem Rate-Limiter.",
    },
    highlights: {
      es: [
        "Core Web Vitals & LCP: fetchpriority='high' y decoding='async' en portadas de servicios y blog.",
        "Filtros Rápidos en Buscador: 5 chips interactivos con cálculo horario en tiempo real en Mallorca.",
        "Seguridad & Rate Limiter: Protección perimetral de endpoints con soporte para Cloudflare KV y memoria.",
        "Paridad i18n 100%: 537 claves traducidas con consistencia en ES, EN, CA y DE.",
      ],
      en: [
        "Core Web Vitals & LCP: fetchpriority='high' and decoding='async' on service hero & blog covers.",
        "Quick Directory Filters: 5 interactive chips with live real-time schedule parsing in Mallorca.",
        "Security & Rate Limiting: Edge and in-memory sliding window rate limiter with GDPR IP hashing.",
        "100% i18n Parity: 537 translation keys consistently maintained across ES, EN, CA, and DE.",
      ],
      ca: [
        "Core Web Vitals & LCP: fetchpriority='high' i decoding='async' a les imatges de portada.",
        "Filtres Ràpids al Cercador: 5 xips interactius amb càlcul horari en temps real a Mallorca.",
        "Seguretat i Rate Limiter: Protecció d'endpoints amb suport per a Cloudflare KV i memòria.",
        "Paritat i18n 100%: 537 claus traduïdes amb coherència en ES, EN, CA i DE.",
      ],
      de: [
        "Core Web Vitals & LCP: fetchpriority='high' und decoding='async' für Service- und Blog-Titelbilder.",
        "Schnellfilter im Verzeichnis: 5 interaktive Chips mit Echtzeit-Öffnungszeitenberechnung auf Mallorca.",
        "Sicherheit & Rate Limiting: Edge- und Memory-Rate-Limiter mit DSGVO-konformer IP-Anonymisierung.",
        "100% i18n-Parität: 537 Übersetzungsschlüssel in ES, EN, CA und DE.",
      ],
    },
    entries: [
      {
        category: "PERFORMANCE",
        title: {
          es: "Inyección de fetchpriority='high' en imágenes LCP",
          en: "Injected fetchpriority='high' on LCP images",
          ca: "Injecció de fetchpriority='high' a imatges LCP",
          de: "fetchpriority='high' für LCP-Bilder integriert",
        },
        description: {
          es: "Mejora del tiempo de renderizado de la imagen principal en fichas de servicio y artículos de blog.",
          en: "Accelerated hero image render times in service details and blog articles.",
          ca: "Millora del temps de renderitzat de la imatge principal a fitxes de servei i blog.",
          de: "Beschleunigte Ladezeiten für Hauptbilder in Service-Profilen und Blogbeiträgen.",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Chips de intención rápida en el buscador de servicios",
          en: "Quick intent filter chips in services directory",
          ca: "Xips d'intenció ràpida al cercador de serveis",
          de: "Schnellfilter-Chips im Service-Verzeichnis",
        },
        description: {
          es: "Filtrado instantáneo para 'Abierto ahora' (según hora en Mallorca), idiomas, terraza, mascotas y accesibilidad.",
          en: "Instant filtering for 'Open now' (real-time Mallorca clock), spoken languages, terrace, pets, and accessibility.",
          ca: "Filtrat instantani per a 'Obert ara', idiomes, terrassa, mascotes i accessibilitat.",
          de: "Sofortiges Filtern nach 'Jetzt geöffnet' (Echtzeit Mallorca), Sprachen, Terrasse, Haustieren und Barrierefreiheit.",
        },
      },
      {
        category: "SECURITY",
        title: {
          es: "Rate limiting con anonimización RGPD en endpoints públicos",
          en: "Rate limiting with GDPR anonymization on public endpoints",
          ca: "Rate limiting amb anonimització RGPD a endpoints públics",
          de: "Rate-Limiting mit DSGVO-Anonymisierung auf öffentlichen Endpunkten",
        },
        description: {
          es: "Protección contra bots y spam en los endpoints de sugerencias y reportes de comercio con HTTP 429.",
          en: "Anti-bot and anti-spam protection on report and feedback endpoints returning standard HTTP 429.",
          ca: "Protecció contra bots i spam als endpoints de suggeriments i reportis amb HTTP 429.",
          de: "Anti-Bot- und Anti-Spam-Schutz für Feedback- und Melde-Endpunkte mit HTTP 429.",
        },
      },
    ],
  },
  {
    version: "0.03",
    versionLabel: {
      es: "v0.03-beta · Expansión Deportiva de Élite, 100% Fotos Reales Locales & Blindaje TypeScript",
      en: "v0.03-beta · Elite Sports Vertical Expansion, 100% Real Local Photos & TypeScript Shielding",
      ca: "v0.03-beta · Expansió Esportiva d'Elit, 100% Fotos Reals Locals i Blindatge TypeScript",
      de: "v0.03-beta · Elite-Sportbereich-Erweiterung, 100% Echte Lokale Fotos & TypeScript-Härtung",
    },
    type: "BETA",
    date: "2026-08-30",
    summary: {
      es: "Incorporación de la vertical deportiva de élite (Rafa Nadal Academy, Palma Tennis Club 1964, Megasport, Vilas Tennis), migración total a fotografías reales locales verificadas en alta resolución y optimizaciones de metadatos sociales para WhatsApp.",
      en: "Integration of elite sports institutions (Rafa Nadal Academy, Palma Tennis Club 1964, Megasport, Vilas Tennis), full migration to 100% verified local real photography, and rich social media Open Graph assets for WhatsApp.",
      ca: "Incorporació d'institucions esportives d'elit (Rafa Nadal Academy, Palma Tennis Club 1964, Megasport, Vilas Tennis), migració al 100% de fotografies reals locals i metadades socials per a WhatsApp.",
      de: "Integration erstklassiger Sporteinrichtungen (Rafa Nadal Academy, Palma Tennis Club 1964, Megasport, Vilas Tennis), vollständige Migration auf 100% verifizierte lokale Echtfotos und optimierte Open-Graph-Tags für WhatsApp.",
    },
    highlights: {
      es: [
        "Vertical Deportiva y Bienestar: Inclusión de Rafa Nadal Academy (Manacor), Mallorca Tennis Club 1964 (Palma) y Vilas Tennis Academy (Calvià).",
        "100% Media Auténtica: Todos los servicios del catálogo cuentan con fotografías reales de Mallorca de alta resolución.",
        "Metadatos Open Graph 1200x630: Visualización nítida y enriquecida en compartición por WhatsApp, Telegram y redes sociales.",
        "Blindaje TypeScript & 5 Pilares: Tipado estricto con soporte para socialProofBadges y localSeoKeywords sin errores de compilación.",
      ],
      en: [
        "Elite Sports & Wellness Vertical: Inclusion of Rafa Nadal Academy (Manacor), Mallorca Tennis Club 1964 (Palma), and Vilas Tennis Academy (Calvià).",
        "100% Authentic Media: Every catalog service features high-resolution verified real photography of Mallorca.",
        "Social Open Graph 1200x630: Rich preview cards for seamless sharing on WhatsApp, Telegram, and social networks.",
        "TypeScript & 5-Pillar Architecture: Strict typing for socialProofBadges and localSeoKeywords with zero compiler errors.",
      ],
      ca: [
        "Vertical Esportiva i Benestar: Rafa Nadal Academy (Manacor), Mallorca Tennis Club 1964 (Palma) i Vilas Tennis Academy (Calvià).",
        "100% Media Autèntica: Fotografies reals d'alta resolució per a tot el catàleg de serveis.",
        "Metadades Open Graph 1200x630: Targetes enriquides per a compartir a WhatsApp i xarxes socials.",
        "Blindatge TypeScript i 5 Pilars: Tipatge estricte sense cap error de compilació.",
      ],
      de: [
        "Elite-Sport & Wellness-Bereich: Rafa Nadal Academy (Manacor), Mallorca Tennis Club 1964 (Palma) und Vilas Tennis Academy (Calvià).",
        "100% Authentische Medien: Hochauflösende, verifizierte Echtfotos für alle Dienstleistungen im gesamten Katalog.",
        "Open-Graph-Karten 1200x630: Gestochen scharfe Vorschauen beim Teilen über WhatsApp, Telegram und soziale Medien.",
        "TypeScript-Härtung: Vollständige Typensicherheit für socialProofBadges und localSeoKeywords ohne Compiler-Fehler.",
      ],
    },
    entries: [
      {
        category: "FEATURE",
        title: {
          es: "Expansión de la Vertical Deportiva & Tenis de Élite",
          en: "Elite Tennis & Sports Vertical Expansion",
          ca: "Expansió de la Vertical Esportiva i Tennis d'Elit",
          de: "Erweiterung des Elite-Tennis- und Sportangebots",
        },
        description: {
          es: "Incorporación de fichas completas para Rafa Nadal Academy by Movistar y Mallorca Tennis Club 1964 con detalles de pistas, horarios, museo y programas.",
          en: "Added detailed profiles for Rafa Nadal Academy by Movistar and Mallorca Tennis Club 1964 with court details, schedules, museum, and training camps.",
          ca: "Noves fitxes completes per a Rafa Nadal Academy i Mallorca Tennis Club 1964.",
          de: "Vollständige Profile für die Rafa Nadal Academy by Movistar und den Mallorca Tennis Club 1964 mit Platzbuchungen und Trainingsprogrammen.",
        },
        badgeText: {
          es: "Deportes & Élite",
          en: "Sports & Elite",
          ca: "Esports i Èlit",
          de: "Sport & Elite",
        },
      },
      {
        category: "PERFORMANCE",
        title: {
          es: "100% Fotografías Reales Locales & Open Graph WhatsApp",
          en: "100% Real Local Photos & WhatsApp Open Graph",
          ca: "100% Fotografies Reals Locals i Open Graph WhatsApp",
          de: "100% Lokale Echtfotos & WhatsApp Open Graph",
        },
        description: {
          es: "Sustitución de marcadores de posición SVG por imágenes JPEG reales y optimización de metadatos de compartición social.",
          en: "Replaced all SVG placeholders with authentic high-res JPEG photos and optimized social share cards.",
          ca: "Substitució de marcadors SVG per fotografies reals JPEG.",
          de: "Ersetzung aller SVG-Platzhalter durch echte JPEG-Fotos und Optimierung der Social-Media-Vorschauen.",
        },
        badgeText: {
          es: "Media & SEO",
          en: "Media & SEO",
          ca: "Media i SEO",
          de: "Medien & SEO",
        },
      },
    ],
  },

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
        category: "TAXONOMY",
        title: {
          es: "Arquitectura Modular de Internacionalización (i18n por Namespaces)",
          en: "Modular Internationalization Architecture (Namespace-based i18n)",
          ca: "Arquitectura Modular d'Internacionalització (i18n per Namespaces)",
          de: "Modulare Internationalisierungsarchitektur (Namespace-basiertes i18n)",
        },
        description: {
          es: "Partición escalable del sistema de traducciones en 10 submódulos temáticos independientes por idioma (common, home, services, sports, heritage, community, blog, honor, auth, legal) con auto-merge, caché en memoria y carga bajo demanda.",
          en: "Scalable partitioning of the translation system into 10 independent domain submodules per language with auto-merge, in-memory caching, and on-demand namespace loading.",
          ca: "Partició escalable del sistema de traduccions en 10 submòduls temàtics per idioma amb fusió automàtica, memòria cau i càrrega sota demanda.",
          de: "Skalierbare Aufteilung des Übersetzungssystems in 10 unabhängige Fachbereichsmodule pro Sprache mit Auto-Merge, In-Memory-Caching und On-Demand-Namespace-Laden.",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Red Pública Deportiva & Zonas de Calistenia de Mallorca",
          en: "Public Sports Network & Calisthenics Parks in Mallorca",
          ca: "Xarxa Pública Esportiva i Zones de Cal·listènia de Mallorca",
          de: "Öffentliches Sportnetzwerk & Calisthenics-Parks auf Mallorca",
        },
        description: {
          es: "10 instalaciones deportivas públicas verificadas con coordenadas GPS, superficies, accesibilidad PMR, iluminación y fuentes oficiales (IME Palma, Ajuntament de Calvià, Esports Inca).",
          en: "10 verified public sports facilities with GPS coordinates, surface types, accessibility, lighting and official municipal sources.",
          ca: "10 instal·lacions esportives públiques verificades amb coordenades GPS, superfícies, accessibilitat i fonts municipals oficials.",
          de: "10 verifizierte öffentliche Sportanlagen mit GPS-Koordinaten, Belagsarten, Barrierefreiheit und offiziellen kommunalen Quellen.",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Foro Vecinal Multilingüe y Nuevos Hubs Comparativos 'Mejores'",
          en: "Multilingual Community Forum & Extended 'Best Of' Hubs",
          ca: "Fòrum Veïnal Multilingüe i Nous Hubs Comparatius 'Millors'",
          de: "Mehrsprachiges Nachbarschaftsforum & Neue 'Beste'-Vergleichshubs",
        },
        description: {
          es: "Categorías y fechas localizadas en 4 idiomas para la comunidad vecinal, junto con nuevos hubs de hoteles boutique, inmobiliarias de lujo, bodegas DO y artesanía balear.",
          en: "4-language localized categories and dates for the community forum, alongside new top hubs for boutique hotels, luxury real estate, DO wineries and Balearic crafts.",
          ca: "Categories i dates localitzades en 4 idiomes per a la comunitat, juntament amb nous hubs d'hotels boutique, immobiliàries de luxe, cellers DO i artesania.",
          de: "Lokalisierte Kategorien und Datumsformate in 4 Sprachen für das Forum sowie neue Vergleichshubs für Boutique-Hotels, Luxusimmobilien, DO-Weingüter und Kunsthandwerk.",
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
