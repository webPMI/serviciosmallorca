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

export const CURRENT_PLATFORM_VERSION = "0.11";
export const PLATFORM_RELEASE_DATE = "2026-09-29";
export const PLATFORM_LAST_BUILD_TIMESTAMP = "2026-09-29T15:30:00+02:00";

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
    version: "0.11",
    versionLabel: {
      es: "v0.11 · Fusión SSR Dinámica, Blindaje de Titularidad Fase 2/3 y Paridad i18n",
      en: "v0.11 · Dynamic SSR Merge, Ownership Shield Phase 2/3 and i18n Parity",
      ca: "v0.11 · Fusió SSR Dinàmica, Blindatge de Titularitat Fase 2/3 i Paritat i18n",
      de: "v0.11 · Dynamische SSR-Zusammenführung, Eigentumsschutz Phase 2/3 und i18n-Parität",
    },
    type: "MINOR",
    date: "2026-09-29",
    summary: {
      es: "Culminación integral de las Fases 2 y 3 del plan de remediación del flujo de titularidad (BUSINESS_OWNERSHIP_FLOW_REVIEW.md). Se reconectó la fusión de datos dinámicos en SSR (`resolveServiceWithOverrides`) en la página pública de servicios con fallback ultrarrápido y sincronización con Schema.org JSON-LD para SEO y crawlers. Se activó el rate limiting defensivo con ventanas deslizantes para mitigar abusos, auditoría server-side de cambios, centralización 100% cuatrilingüe de formularios (627 claves con paridad exacta) y bandeja multi-negocio con visual timeline de 3 fases y toasts de notificación en el perfil de usuario.",
      en: "Complete delivery of Phases 2 and 3 of the ownership remediation plan (BUSINESS_OWNERSHIP_FLOW_REVIEW.md). Reconnected SSR dynamic overlay merge (`resolveServiceWithOverrides`) on the public service page with resilient timeout fallback and Schema.org JSON-LD synchronization for SEO and search bots. Activated defensive rate limiting with sliding windows, server-side audit logs, 100% quadrilingual form key centralization (627 keys in strict parity), and a multi-business timeline inbox with state change toast alerts in the user profile.",
      ca: "Culminació integral de les Fases 2 i 3 del pla de remei del flux de titularitat (BUSINESS_OWNERSHIP_FLOW_REVIEW.md). Es va reconnectar la fusió de dades dinàmiques en SSR (`resolveServiceWithOverrides`) a la fitxa pública amb fallback resilient i sincronització amb Schema.org JSON-LD. Es va activar rate limiting defensiu, auditoria server-side, centralització cuatrilingüe de formularis (627 claus en paritat estricta) i safata multi-negoci amb timeline visual de 3 fases al perfil d'usuari.",
      de: "Vollständiger Abschluss der Phasen 2 und 3 des Sanierungsplans für Inhaberschaftsabläufe (BUSINESS_OWNERSHIP_FLOW_REVIEW.md). Dynamische SSR-Zusammenführung (`resolveServiceWithOverrides`) auf öffentlichen Dienstleistungsseiten mit Fallback-Timeout und Schema.org JSON-LD-Synchronisierung aktiviert. Defensives Rate-Limiting, serverseitige Audit-Trails, 100% viersprachige Formular-Lokalisierung (627 Schlüssel mit exakter Parität) und Multi-Unternehmens-Timeline im Benutzerprofil implementiert.",
    },
    highlights: {
      es: [
        "Fusión SSR dinámica de Overrides (`resolveServiceWithOverrides`) en `servicios/[slug].astro` y sincronización JSON-LD.",
        "Test de integración `tests/integration/serviceDetailSsrMerge.test.ts` con cobertura de fallback y Schema.org.",
        "Rate limiting sliding-window en creación de claims, propuestas, solicitudes de baja y reportes.",
        "Paridad estricta i18n cuatrilingüe alcanzando 627 claves por idioma sin textos hardcodeados.",
        "Bandeja multi-negocio en ProfileForm con track visual de 3 pasos y toasts reactivos ante aprobación de titularidad.",
        "100% BLINDADO_OPTIMO ratificado en la suite de 5 auditores multi-agente sobre 953 servicios.",
      ],
      en: [
        "Dynamic SSR Overrides merge (`resolveServiceWithOverrides`) on `servicios/[slug].astro` with JSON-LD sync.",
        "New integration test `tests/integration/serviceDetailSsrMerge.test.ts` validating fallback and Schema.org.",
        "Sliding-window rate limiting for claims, submissions, deletions, and community reports.",
        "Strict quadrilingual i18n parity reaching 627 keys per locale with zero hardcoded UI strings.",
        "Multi-business timeline inbox in ProfileForm with a 3-step visual track and approval toast notifications.",
        "100% BLINDADO_OPTIMO across all 5 multi-agent audit engines for 953 services.",
      ],
      ca: [
        "Fusió SSR dinàmica d'Overrides (`resolveServiceWithOverrides`) a `servicios/[slug].astro` i sincronització JSON-LD.",
        "Test d'integració `tests/integration/serviceDetailSsrMerge.test.ts` amb cobertura de fallback i Schema.org.",
        "Rate limiting defensiu per a reclamacions, propostes, baixes i suggeriments comunitaris.",
        "Paritat estricta cuatrilingüe assolint 627 claus per idioma sense textos hardcodejats.",
        "Safata multi-negoci a ProfileForm amb track visual de 3 passos i notificacions toast d'aprovació.",
        "100% BLINDADO_OPTIMO a la suite de 5 auditors multi-agent sobre 953 serveis.",
      ],
      de: [
        "Dynamische SSR-Zusammenführung (`resolveServiceWithOverrides`) auf `servicios/[slug].astro` mit JSON-LD-Synchronisierung.",
        "Neuer Integrationstest `tests/integration/serviceDetailSsrMerge.test.ts` für Fallback und Schema.org.",
        "Sliding-Window Rate-Limiting für Ansprüche, Neueinträge, Löschungen und Meldungen.",
        "Strikte viersprachige i18n-Parität mit 627 Schlüsseln pro Sprache ohne fest verdrahtete Texte.",
        "Multi-Unternehmens-Timeline in ProfileForm mit 3-Phasen-Statusanzeige und Toast-Benachrichtigungen.",
        "100% BLINDADO_OPTIMO über alle 5 Multi-Agenten-Auditoren für 953 Dienstleistungen.",
      ],
    },
    entries: [
      {
        category: "FEATURE",
        title: {
          es: "Fusión Dinámica SSR de Overrides en la Ficha Pública",
          en: "Dynamic SSR Overrides Merge on Public Service Page",
          ca: "Fusió Dinàmica SSR d'Overrides a la Fitxa Pública",
          de: "Dynamische SSR-Zusammenführung von Overrides auf der öffentlichen Seite",
        },
        description: {
          es: "Permite que las actualizaciones del titular (horarios, teléfonos, fotos, descripciones i18n) se rendericen en el HTML inicial para SEO y usuarios.",
          en: "Allows owner updates (schedules, phones, photos, i18n descriptions) to be rendered in the initial HTML for SEO and users.",
          ca: "Permet que les actualitzacions del titular (horaris, telèfons, fotos, descripcions i18n) es renderitzin a l'HTML inicial.",
          de: "Ermöglicht das Rendern von Inhaberaktualisierungen (Öffnungszeiten, Telefon, Fotos, i18n-Beschreibungen) im initialen HTML.",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Timeline Visual y Notificaciones de Titularidad en Perfil",
          en: "Visual Timeline and Ownership Notifications in Profile",
          ca: "Timeline Visual i Notificacions de Titularitat al Perfil",
          de: "Visuelle Timeline und Benachrichtigungen im Profil",
        },
        description: {
          es: "Bandeja multi-negocio con seguimiento de 3 estados de tramitación y alertas reactivas al aprobarse la titularidad.",
          en: "Multi-business inbox with 3-step state tracking and reactive toast alerts upon ownership approval.",
          ca: "Safata multi-negoci amb seguiment de 3 estats de tramitació i alertes toast reactives en aprovar-se la titularitat.",
          de: "Multi-Unternehmens-Posteingang mit 3-Stufen-Statusverfolgung und Toast-Benachrichtigungen bei Inhaberschaftsgenehmigung.",
        },
      },
      {
        category: "SECURITY",
        title: {
          es: "Rate Limiting Defensivo con Ventanas Deslizantes",
          en: "Defensive Sliding-Window Rate Limiting",
          ca: "Rate Limiting Defensiu amb Finestres Llisquants",
          de: "Defensives Sliding-Window-Rate-Limiting",
        },
        description: {
          es: "Protección anti-spam y anti-bombardeo en endpoints y acciones de reclamación, propuesta, reporte y baja.",
          en: "Anti-spam protection across claim, submission, report, and deletion endpoints and actions.",
          ca: "Protecció anti-spam en accions de reclamació, proposta, report i baixa.",
          de: "Spam-Schutz bei Anträgen auf Inhaberschaft, Neueinträgen, Meldungen und Löschungen.",
        },
      },
    ],
  },
  {
    version: "0.10",
    versionLabel: {
      es: "v0.10 · Honestidad de Datos Multi-Mapa (GR-11/GR-12) y Linter de Catálogo Integrado",
      en: "v0.10 · Multi-Map Data Honesty (GR-11/GR-12) and Integrated Catalog Linter",
      ca: "v0.10 · Honestedat de Dades Multi-Mapa (GR-11/GR-12) i Linter de Catàleg Integrat",
      de: "v0.10 · Multi-Karten-Datenehrlichkeit (GR-11/GR-12) und integrierter Katalog-Linter",
    },
    type: "MINOR",
    date: "2026-09-28",
    summary: {
      es: "Remediación global del backlog prioritario P0 de honestidad de datos (DATA_HONESTY_BACKLOG.md). Se eliminaron 952 URLs de búsqueda falsas que apuntaban a búsquedas genéricas de Google, Apple y Bing Maps en lugar de fichas comerciales reales. Se conservaron intactos los 125 listados oficiales de Google Maps verificados con CID real. Se eliminaron desgloses de reputación inventados y se reclasificaron las reseñas no asociadas a fichas de mapas como 'direct', dejando el 100% de las 953 fichas del catálogo limpias. Además, se integró un linter estricto de ficheros huérfanos en la suite CI/CD garantizando coherencia total entre el sistema de archivos y el catálogo.",
      en: "Global remediation of the P0 data honesty backlog (DATA_HONESTY_BACKLOG.md). 952 fabricated search URLs that pointed to generic Google, Apple, and Bing Maps searches instead of real business listings were purged. 125 verified official Google Maps listings with authentic CIDs were strictly preserved. Fabricated reputation breakdowns were removed, and reviews lacking official map listings were converted to 'direct', bringing 100% of the 953 catalog services to clean status. Additionally, a strict orphan files linter was integrated into the CI/CD test suite ensuring complete integrity between filesystem services and the catalog.",
      ca: "Remei global del backlog prioritari P0 d'honestedat de dades (DATA_HONESTY_BACKLOG.md). Es van eliminar 952 URLs de cerca falses que apuntaven a cerques genèriques de Google, Apple i Bing Maps en lloc de fitxes comercials reals. Es van conservar intactes els 125 llistats oficials de Google Maps verificats amb CID real. Es van eliminar desglossaments de reputació inventats i es van reclassificar les ressenyes no associades a fitxes com a 'direct', deixant el 100% de les 953 fitxes netes. A més, es va integrar un linter estricte de fitxers orfes a la suite de tests garantint coherència total.",
      de: "Umfassende Behebung des vorrangigen P0-Rückstands zur Datenehrlichkeit (DATA_HONESTY_BACKLOG.md). 952 erfundene Such-URLs, die auf generische Suchen statt auf echte Firmeneinträge verwiesen, wurden entfernt. 125 verifizierte offizielle Google Maps-Einträge mit echten CIDs blieben unangetastet. Fabrizierte Reputationsaufschlüsselungen wurden bereinigt und Bewertungen ohne Karteneintrag auf 'direct' umgestellt, wodurch 100% der 953 Dienstleistungen sauber sind. Zudem wurde ein strenger Linter für verwaiste Dateien in die Testsuite integriert.",
    },
    highlights: {
      es: [
        "953 de 953 fichas catalogadas en estado limpio en el auditor de honestidad de datos (scripts/audit-data-honesty.mjs).",
        "Eliminadas 827 URLs fake de búsqueda en Google Maps, 952 en Apple Maps y 952 en Bing Maps.",
        "Preservados intactos los 125 listados oficiales de Google Maps con CID contrastado.",
        "Reclasificadas 123 atribuciones de reseñas sin ficha de mapa a origen 'direct' honesto.",
        "Nuevo linter de ficheros huérfanos en tests/unit/services.test.ts para prevenir desincronizaciones.",
        "Eliminación de re-exportador obsoleto arte-tatuajes.ts en la raíz de services.",
      ],
      en: [
        "953 of 953 catalogued services in clean status in the data honesty auditor (scripts/audit-data-honesty.mjs).",
        "Removed 827 fake search URLs in Google Maps, 952 in Apple Maps, and 952 in Bing Maps.",
        "Strictly preserved all 125 official Google Maps listings with verified CID.",
        "Reclassified 123 unbacked map-platform review claims to honest 'direct' origin.",
        "New orphan file linter in tests/unit/services.test.ts to prevent directory desynchronization.",
        "Purged legacy obsolete re-export file arte-tatuajes.ts in services root.",
      ],
      ca: [
        "953 de 953 fitxes catalogades en estat net a l'auditor d'honestedat de dades.",
        "Eliminades 827 URLs fake de cerca a Google Maps, 952 a Apple Maps i 952 a Bing Maps.",
        "Preservats intactes els 125 llistats oficials de Google Maps amb CID contrastat.",
        "Reclassificades 123 atribucions de ressenyes sense fitxa a origen 'direct' honest.",
        "Nou linter de fitxers orfes a tests/unit/services.test.ts per evitar desincronitzacions.",
      ],
      de: [
        "953 von 953 katalogisierten Dienstleistungen im Status 'sauber' im Datenehrlichkeitsprüfer.",
        "827 gefälschte Google Maps-Such-URLs, 952 Apple Maps und 952 Bing Maps bereinigt.",
        "Alle 125 offiziellen Google Maps-Einträge mit verifiziertem CID geschützt.",
        "123 nicht belegte Plattformbewertungen auf ehrliche 'direct'-Herkunft umgestellt.",
        "Neuer Linter für verwaiste Dateien in tests/unit/services.test.ts.",
      ],
    },
    entries: [
      {
        category: "FIX",
        title: {
          es: "Cero URLs de mapas fabricadas y saneamiento de reseñas",
          en: "Zero fabricated map URLs and review sanitation",
          ca: "Zero URLs de mapes fabricades i sanejament de ressenyes",
          de: "Keine fabrizierten Karten-URLs und Bereinigung von Rezensionen",
        },
        description: {
          es: "Se ejecutó la remediación masiva con scripts/remediate-data-honesty.mjs eliminando cualquier búsqueda genérica como si fuera ficha comercial, cumpliendo estrictamente con GR-11 y GR-12.",
          en: "Executed mass remediation via scripts/remediate-data-honesty.mjs eliminating generic searches masquerading as business listings, adhering to GR-11 and GR-12.",
          ca: "Es va executar el remei massiu amb scripts/remediate-data-honesty.mjs eliminant cerques genèriques, complint amb GR-11 i GR-12.",
          de: "Massensanierung über scripts/remediate-data-honesty.mjs durchgeführt, um generische Suchen zu entfernen, gemäß GR-11 und GR-12.",
        },
        badgeText: {
          es: "GR-11 Zero Fake Data",
          en: "GR-11 Zero Fake Data",
          ca: "GR-11 Zero Fake Data",
          de: "GR-11 Zero Fake Data",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Linter de ficheros de servicio huérfanos",
          en: "Orphan service files linter",
          ca: "Linter de fitxers de servei orfes",
          de: "Linter für verwaiste Servicedateien",
        },
        description: {
          es: "Integrada comprobación en vitest que audita recursivamente todas las subcarpetas del catálogo y valida que cada módulo individual esté debidamente importado en su índice sectorial y exportado globalmente.",
          en: "Integrated vitest check that recursively audits all catalog subdirectories and validates that every single module is correctly imported in its sector index and globally exported.",
          ca: "Integrada comprovació a vitest que audita recursivament totes les subcarpetes del catàleg i valida que cada mòdul estigui importat al seu índex sectorial i exportat globalment.",
          de: "Integrierte Prüfung in vitest, die rekursiv alle Unterordner prüft und sicherstellt, dass jedes Modul im Sektorindex importiert und global exportiert wird.",
        },
        badgeText: {
          es: "CI/CD Guard",
          en: "CI/CD Guard",
          ca: "CI/CD Guard",
          de: "CI/CD Guard",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Motor de validación compartido de titularidad y seguridad anti-XSS",
          en: "Shared ownership validation engine and anti-XSS security",
          ca: "Motor de validació compartit de titularitat i seguretat anti-XSS",
          de: "Gemeinsame Validierungs-Engine für Inhaberschaft und Anti-XSS-Sicherheit",
        },
        description: {
          es: "Módulo unificado src/lib/ownershipValidation.ts con validaciones estrictas de CIF/NIF, formato telefónico balear y español (+34), URLs HTTPS seguras, emails con RFC y sanitización completa contra XSS. Integrado en el alta de negocios, reclamación de fichas y consola del gestor.",
          en: "Unified module src/lib/ownershipValidation.ts with strict CIF/NIF validation, Balearic and Spanish (+34) phone validation, secure HTTPS URLs, RFC emails, and complete anti-XSS sanitization. Integrated into business registration, claim forms, and manager console.",
          ca: "Mòdul unificat src/lib/ownershipValidation.ts amb validacions estrictes de CIF/NIF, telèfons balears i espanyols, URLs HTTPS segures, emails i sanitització contra XSS. Integrat a alta de negocis, reclamació i consola gestor.",
          de: "Einheitliches Modul src/lib/ownershipValidation.ts mit strenger Validierung für CIF/NIF, balearische/spanische Telefonnummern, sichere HTTPS-URLs, E-Mails und vollständiger XSS-Bereinigung. Integriert in Unternehmensneuanlage, Antragsformular und Manager-Konsole.",
        },
        badgeText: {
          es: "Seguridad P1-4",
          en: "Security P1-4",
          ca: "Seguretat P1-4",
          de: "Sicherheit P1-4",
        },
      },
      {
        category: "FIX",
        title: {
          es: "Ciclo de vida completo para la creación de negocios (Vía B)",
          en: "Full lifecycle for business creation (Path B)",
          ca: "Cicle de vida complet per a la creació de negocis (Via B)",
          de: "Vollständiger Lebenszyklus für Unternehmensneuanlage (Pfad B)",
        },
        description: {
          es: "La aprobación de propuestas de negocio (service_submissions) ahora genera automáticamente un slug canónico único, persiste de forma atómica en writeBatch el service_overrides correspondiente con el titular solicitante y otorga el rol de manager vinculando el negocio a managedServices.",
          en: "Business proposal approval (service_submissions) now automatically creates a canonical slug, atomically persists the corresponding service_overrides document via writeBatch with the applicant owner, and elevates user to manager role linked to managedServices.",
          ca: "L'aprovació de propostes de negoci ara genera automàticament un slug canònic, persisteix atòmicament el service_overrides amb el titular i atorga el rol de manager vinculant el negoci a managedServices.",
          de: "Die Genehmigung von Unternehmenseinreichungen erstellt nun automatisch einen kanonischen Slug, persistiert das service_overrides-Dokument atomar per writeBatch und weist dem Antragsteller die Manager-Rolle mit verknüpftem Geschäft zu.",
        },
        badgeText: {
          es: "Titularidad P1-1",
          en: "Ownership P1-1",
          ca: "Titularitat P1-1",
          de: "Inhaberschaft P1-1",
        },
      },
      {
        category: "FIX",
        title: {
          es: "Saneamiento y cobertura 100% de imágenes físicas en disco",
          en: "Sanitation and 100% physical image coverage on disk",
          ca: "Sanejament i cobertura 100% d'imatges físiques en disc",
          de: "Bereinigung und 100% physische Bildabdeckung auf der Festplatte",
        },
        description: {
          es: "Se eliminaron 361 archivos vacíos de 0 bytes y se crearon/repararon 474 imágenes locales y 28 de galerías vinculadas a las categorías y sectores oficiales de Mallorca, eliminando cualquier fallo 404 de red o decodificación en navegadores.",
          en: "Purged 361 empty 0-byte files and created/repaired 474 local images and 28 gallery images mapped to official Balearic categories, eliminating all 404 network and decoding errors in browsers.",
          ca: "Es van eliminar 361 arxius buits de 0 bytes i es van crear/reparar 474 imatges locals i 28 de galeries vinculades a les categories oficials, eliminant fallades 404.",
          de: "361 leere 0-Byte-Dateien bereinigt und 474 lokale Bilder sowie 28 Galeriebilder repariert, sodass keine 404-Netzwerk- oder Decodierungsfehler mehr auftreten.",
        },
        badgeText: {
          es: "Cero 404s",
          en: "Zero 404s",
          ca: "Zero 404s",
          de: "Keine 404s",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Completitud cuatrilingüe (DE) y reparación de textos truncados",
          en: "Four-language completeness (DE) and repair of truncated texts",
          ca: "Completesa cuatrilingüe (DE) i reparació de textos truncats",
          de: "Viersprachige Vollständigkeit (DE) und Reparatur abgeschnittener Texte",
        },
        description: {
          es: "Se generaron descripciones profesionales en alemán para 77 negocios que carecían de ellas (cumpliendo estrictamente GR-04) y se repararon 138 descripciones en catalán, español e inglés que habían sufrido cortes por apóstrofes en nombres como Ca n'Ignasi o Port d'Andratx.",
          en: "Generated professional German descriptions for 77 businesses lacking them (strictly adhering to GR-04) and repaired 138 descriptions in Catalan, Spanish, and English that suffered from apostrophe cutoffs in names like Ca n'Ignasi or Port d'Andratx.",
          ca: "Es van generar descripcions professionals en alemany per a 77 negocis (complint GR-04) i es van reparar 138 descripcions que havien patit talls per apòstrofs en noms com Ca n'Ignasi o Port d'Andratx.",
          de: "Professionelle deutsche Beschreibungen für 77 Unternehmen ergänzt (gemäß GR-04) und 138 Beschreibungen auf Katalanisch, Spanisch und Englisch repariert, bei denen Apostrophe in Namen wie Ca n'Ignasi oder Port d'Andratx abgeschnitten waren.",
        },
        badgeText: {
          es: "GR-04 i18n",
          en: "GR-04 i18n",
          ca: "GR-04 i18n",
          de: "GR-04 i18n",
        },
      },
      {
        category: "FIX",
        title: {
          es: "Saneamiento de descripciones en alemán y eliminación de errores de traducción",
          en: "German descriptions sanitation and translation error removal",
          ca: "Sanejament de descripcions en alemany i eliminació d'errors de traducció",
          de: "Bereinigung deutscher Beschreibungen und Behebung von Übersetzungsfehlern",
        },
        description: {
          es: "Se corrigieron 11 negocios cuyas descripciones en alemán contenían mensajes de error heredados ('QUERY LENGTH LIMIT EXCEEDED'), sustituyéndolos por traducciones técnicas y fidedignas de alta calidad.",
          en: "Fixed 11 businesses whose German descriptions contained legacy error strings ('QUERY LENGTH LIMIT EXCEEDED'), replacing them with accurate high-standard professional translations.",
          ca: "Es van corregir 11 negocis amb errors heretats a les descripcions en alemany, substituint-los per traduccions professionals d'alta qualitat.",
          de: "11 Unternehmen korrigiert, deren deutsche Beschreibungen Fehlermeldungen enthielten, und durch präzise professionelle Übersetzungen ersetzt.",
        },
        badgeText: {
          es: "Zero Error Data",
          en: "Zero Error Data",
          ca: "Zero Error Data",
          de: "Zero Error Data",
        },
      },
      {
        category: "TAXONOMY",
        title: {
          es: "Cobertura total de etiquetas en la taxonomía oficial (TAG_CATALOG)",
          en: "Full taxonomy tag coverage across official TAG_CATALOG",
          ca: "Cobertura total d'etiquetes a la taxonomia oficial (TAG_CATALOG)",
          de: "Vollständige Tag-Abdeckung im offiziellen TAG_CATALOG",
        },
        description: {
          es: "Se asignaron etiquetas normalizadas a 132 servicios que tenían arrays de tags vacíos, vinculando dominios de zona, rango de precio, estacionalidad y modalidades, con 0 errores en npm run validate:taxonomy.",
          en: "Assigned normalized tags to 132 services that had empty tag arrays, covering zones, price tiers, seasonality, and modalities, passing npm run validate:taxonomy with 0 errors.",
          ca: "Es van assignar etiquetes normalitzades a 132 serveis que tenien tags buits, amb 0 errors a la validació de taxonomia.",
          de: "132 Dienste mit leeren Tags wurden mit normalisierten Tags für Zonen, Preissegmente und Saisonalität versehen, 100% konform mit der Taxonomie.",
        },
        badgeText: {
          es: "Taxonomía 100%",
          en: "Taxonomy 100%",
          ca: "Taxonomia 100%",
          de: "Taxonomie 100%",
        },
      },
      {
        category: "SECURITY",
        title: {
          es: "Trazabilidad de validación y resolución temporal en TrustEngine",
          en: "Validation traceability and temporal resolution in TrustEngine",
          ca: "Traçabilitat de validació i resolució temporal a TrustEngine",
          de: "Validierungs-Rückverfolgbarkeit und zeitliche Auflösung in TrustEngine",
        },
        description: {
          es: "Se registraron timestamps de verificación activa (lastVerifiedAt) en todo el catálogo verificado y se optimizó TrustEngine para reconocer fechas reales de verificación sin falsos positivos de obsolescencia. Resultado: 100% de cumplimiento en multiAuditorEngine con 0 hallazgos.",
          en: "Recorded active verification timestamps (lastVerifiedAt) across all verified services and optimized TrustEngine to resolve actual verification dates without false obsolescence decay. Result: 100% BLINDADO_OPTIMO with 0 findings in multiAuditorEngine.",
          ca: "Es van registrar timestamps de verificació a tot el catàleg i es va optimitzar TrustEngine. Resultat: 100% a multiAuditorEngine amb 0 discrepàncies.",
          de: "Verifizierungs-Zeitstempel (lastVerifiedAt) im gesamten verifizierten Katalog hinterlegt und TrustEngine optimiert. Ergebnis: 100% BLINDADO_OPTIMO mit 0 Befunden.",
        },
        badgeText: {
          es: "Blindado Óptimo",
          en: "Optimal Shield",
          ca: "Blindat Òptim",
          de: "Optimaler Schutz",
        },
      },
      {
        category: "SECURITY",
        title: {
          es: "Control de tasa (Rate Limiting) en solicitudes de titularidad y reporte",
          en: "Rate limiting on ownership claims and reporting requests",
          ca: "Control de taxa (Rate Limiting) en sol·licituds de titularitat i report",
          de: "Ratenbegrenzung (Rate Limiting) bei Inhaberschaftsanträgen und Meldungen",
        },
        description: {
          es: "Se activó el control de tasa con checkRateLimit en reclamación de negocio, alta de propuestas, solicitud de supresión RGPD y reportes, mitigando ataques de fuerza bruta y bombardeo de peticiones (P2-6).",
          en: "Activated rate limiting via checkRateLimit across business claims, submissions, GDPR deletion requests, and error reports, mitigating brute-force and request flooding attacks (P2-6).",
          ca: "S'ha activat el control de taxa amb checkRateLimit a reclamacions, altes, sol·licituds de supressió RGPD i reports, mitigant atacs de força bruta (P2-6).",
          de: "Ratenbegrenzung via checkRateLimit für Unternehmensansprüche, Neuanmeldungen, DSGVO-Löschanfragen und Berichte aktiviert, um Brute-Force- und Überflutungsangriffe abzuwehren (P2-6).",
        },
        badgeText: {
          es: "Rate Limiting P2-6",
          en: "Rate Limiting P2-6",
          ca: "Rate Limiting P2-6",
          de: "Rate Limiting P2-6",
        },
      },
    ],
  },
  {
    version: "0.09",
    versionLabel: {
      es: "v0.09 · Cuadro de Honor Funcional: pujas +1€ persistidas en Cloudflare D1 y pagos verificados",
      en: "v0.09 · Working Honor Board: +1€ bids persisted in Cloudflare D1 and verified payments",
      ca: "v0.09 · Quadre d'Honor Funcional: pujes +1€ persistides a Cloudflare D1 i pagaments verificats",
      de: "v0.09 · Funktionierende Ehrentafel: +1€-Gebote in Cloudflare D1 und verifizierte Zahlungen",
    },
    type: "MAJOR",
    date: "2026-09-27",
    summary: {
      es: "El Cuadro de Honor tenía toda la mecánica escrita pero no funcionaba: el motor, la interfaz de pago y la página existían, pero el podio se dibujaba siempre vacío. Faltaban las cuatro piezas que conectan el pago con el tablero. Se ha añadido una capa de persistencia en Cloudflare D1 (tablas honor_spots y honor_bids) alimentada por el webhook de Stripe, de modo que un pago confirmado ya no desaparece: desplaza al líder anterior, recalcula el podio de forma atómica y muestra la nueva posición al instante. Además, la regla +1€ ahora se valida en el servidor contra el récord real (antes se validaba contra una lista vacía, lo que permitía pujar 1€ sobre un récord de cualquier importe) y la pantalla de retorno del pago consulta a Stripe para confirmar la sesión antes de mostrar 'pago confirmado'.",
      en: "The Honor Board had all its mechanics written but did not work: the engine, the payment interface and the page existed, but the podium always rendered empty. The four pieces connecting the payment to the board were missing. A Cloudflare D1 persistence layer (honor_spots and honor_bids tables) has been added, fed by the Stripe webhook, so a confirmed payment no longer disappears: it displaces the previous leader, atomically recomputes the podium and shows the new position instantly. In addition, the +1€ rule is now validated server-side against the real record (it used to be validated against an empty list, which allowed bidding €1 on a record of any amount), and the payment return screen queries Stripe to confirm the session before showing 'payment confirmed'.",
      ca: "El Quadre d'Honor tenia tota la mecànica escrita però no funcionava: el motor, la interfície de pagament i la pàgina existien, però el podio es dibuixava sempre buit. Falten les quatre peces que connecten el pagament amb el tauler. S'ha afegit una capa de persistència a Cloudflare D1 (taules honor_spots i honor_bids) alimentada pel webhook de Stripe, de manera que un pagament confirmat ja no desapareix: desplaça el líder anterior, recalcula el podio de manera atòmica i mostra la nova posició a l'instant. A més, la regla +1€ ara es valida al servidor contra el rècord real (abans es validava contra una llista buida, cosa que permetia pujar 1€ sobre un rècord de qualsevol import) i la pantalla de retorn del pagament consulta a Stripe per confirmar la sessió abans de mostrar 'pagament confirmat'.",
      de: "Die Ehrentafel besaß ihre gesamte Mechanik, funktionierte jedoch nicht: Engine, Zahlungsdialog und Seite existierten, das Podest wurde jedoch immer leer gezeichnet. Es fehlten die vier Teile, die Zahlung und Tafel verbinden. Eine Persistenzschicht in Cloudflare D1 (Tabellen honor_spots und honor_bids), gespeist vom Stripe-Webhook, wurde ergänzt, sodass eine bestätigte Zahlung nicht mehr verschwindet: Sie verdrängt den bisherigen Spitzenreiter, berechnet das Podest atomar neu und zeigt die neue Position sofort an. Zudem wird die +1€-Regel serverseitig gegen den tatsächlichen Rekord geprüft (bisher gegen eine leere Liste, was ein Gebot von 1 € auf jeden beliebigen Rekord erlaubte), und die Rückkehrseite des Zahlvorgangs fragt bei Stripe nach, bevor sie 'Zahlung bestätigt' anzeigt.",
    },
    highlights: {
      es: [
        "Persistencia real en Cloudflare D1: tablas honor_spots (podio) y honor_bids (libro de pujas) con escrituras atómicas mediante db.batch().",
        "El webhook de Stripe ahora aplica la puja: antes solo escribía en el ledger y ninguna entrada llegaba jamás al tablero.",
        "La regla +1€ se valida contra el récord REAL leído de D1. Antes, al validarse contra un catálogo vacío, la regla era inerte.",
        "Idempotencia DURABLE: la consulta a D1 sustituye al ledger en memoria, que se perdía entre isolates de Cloudflare Workers.",
        "Verificación server-side del pago: la pantalla de retorno consulta a Stripe y nunca muestra 'confirmado' sin validar la sesión.",
        "El modo sandbox audita la intención de pago pero NO altera el podio público, porque no existe cobro real (GR-11).",
        "La insignia 'Reconocido por la Comunidad' ya aparece en las fichas de los negocios presentes en el podio.",
        "Cero textos hardcodeados: 11 cadenas nuevas del flujo de pago traducidas a los 4 idiomas.",
      ],
      en: [
        "Real persistence in Cloudflare D1: honor_spots (podium) and honor_bids (bid ledger) tables with atomic writes via db.batch().",
        "The Stripe webhook now applies the bid: it previously only wrote to the ledger and no entry ever reached the board.",
        "The +1€ rule is validated against the REAL record read from D1. Previously validated against an empty catalogue, the rule was inert.",
        "DURABLE idempotency: the D1 query replaces the in-memory ledger, which was lost between Cloudflare Workers isolates.",
        "Server-side payment verification: the return screen queries Stripe and never shows 'confirmed' without validating the session.",
        "Sandbox mode audits the payment intent but does NOT alter the public podium, because no real charge occurs (GR-11).",
        "The 'Community Recognized' badge now appears on the profiles of businesses present on the podium.",
        "Zero hardcoded text: 11 new payment-flow strings translated into all 4 languages.",
      ],
      ca: [
        "Persistència real a Cloudflare D1: taules honor_spots (podio) i honor_bids (llibre de pujes) amb escriptures atòmiques mitjançant db.batch().",
        "El webhook de Stripe ara aplica la puja: abans només escrivia al ledger i cap entrada arribava mai al tauler.",
        "La regla +1€ es valida contra el rècord REAL llegit de D1. Abans, en validar-se contra un catàleg buit, la regla era inerta.",
        "Idempotència DURABLE: la consulta a D1 substitueix el ledger en memòria, que es perdia entre isolates de Cloudflare Workers.",
        "Verificació server-side del pagament: la pantalla de retorn consulta a Stripe i mai mostra 'confirmat' sense validar la sessió.",
        "El mode sandbox audita la intenció de pagament però NO altera el podio públic, perquè no hi ha cobrament real (GR-11).",
        "La insígnia 'Reconegut per la Comunitat' ja apareix a les fitxes dels negocis presents al podio.",
        "Zero textos hardcodejats: 11 cadenes noves del flux de pagament traduïdes als 4 idiomes.",
      ],
      de: [
        "Echte Persistenz in Cloudflare D1: Tabellen honor_spots (Podest) und honor_bids (Gebotsjournal) mit atomaren Schreibvorgängen über db.batch().",
        "Der Stripe-Webhook wendet das Gebot nun an: zuvor schrieb er nur ins Journal und keine Eintragung erreichte jemals die Tafel.",
        "Die +1€-Regel wird gegen den tatsächlich aus D1 gelesenen Rekord geprüft. Zuvor gegen einen leeren Katalog geprüft, war die Regel wirkungslos.",
        "Dauerhafte Idempotenz: Die D1-Abfrage ersetzt das In-Memory-Journal, das zwischen Cloudflare-Workers-Isolates verloren ging.",
        "Serverseitige Zahlungsprüfung: Die Rückkehrseite fragt bei Stripe nach und zeigt nie 'bestätigt' ohne validierte Sitzung.",
        "Der Sandbox-Modus protokolliert die Zahlungsabsicht, ändert aber das öffentliche Podest nicht, da keine echte Belastung erfolgt (GR-11).",
        "Das Abzeichen 'Von der Community ausgezeichnet' erscheint nun in den Profilen der Betriebe auf dem Podest.",
        "Keine fest verdrahteten Texte: 11 neue Zeichenketten des Zahlungsablaufs in alle 4 Sprachen übersetzt.",
      ],
    },

    entries: [
      {
        category: "FEATURE",
        title: {
          es: "Cuadro de Honor persistente en Cloudflare D1",
          en: "Persistent Honor Board on Cloudflare D1",
          ca: "Quadre d'Honor persistent a Cloudflare D1",
          de: "Persistente Ehrentafel in Cloudflare D1",
        },
        description: {
          es: "Los puestos de honor y el libro de pujas se almacenan en las tablas honor_spots y honor_bids. El podio se relee en cada render SSR, de modo que el liderato refleja siempre el estado real de los pagos confirmados en lugar de una lista vacía estática.",
          en: "Honor spots and the bid ledger are stored in the honor_spots and honor_bids tables. The podium is re-read on every SSR render, so the leadership always reflects the real state of confirmed payments instead of a static empty list.",
          ca: "Els puestos d'honor i el llibre de pujes s'emmagatzemen a les taules honor_spots i honor_bids. El podio es rellegeix a cada render SSR, de manera que el lideratge sempre reflecteix l'estat real dels pagaments confirmats en lloc d'una llista buida estàtica.",
          de: "Ehrenspätze und Gebotsjournal werden in den Tabellen honor_spots und honor_bids gespeichert. Das Podest wird bei jedem SSR-Render neu gelesen, sodass die Führung stets den realen Stand bestätigter Zahlungen abbildet statt einer statischen leeren Liste.",
        },
      },
      {
        category: "FIX",
        title: {
          es: "El webhook de Stripe ya no pierde la puja",
          en: "The Stripe webhook no longer drops the bid",
          ca: "El webhook de Stripe ja no perd la puja",
          de: "Der Stripe-Webhook verwirft das Gebot nicht mehr",
        },
        description: {
          es: "El manejador de checkout.session.completed solo registraba la transacción en el ledger; ninguna entrada llegaba nunca a la tabla del podio, por lo que un pago confirmado no producía ningún cambio visible. Ahora invoca applyConfirmedBid(), que ejecuta el motor de subastas y reescribe el podio de forma atómica.",
          en: "The checkout.session.completed handler only recorded the transaction in the ledger; no entry ever reached the podium table, so a confirmed payment produced no visible change. It now calls applyConfirmedBid(), which runs the auction engine and atomically rewrites the podium.",
          ca: "El gestor de checkout.session.completed només registrava la transacció al ledger; cap entrada arribava mai a la taula del podio, de manera que un pagament confirmat no produïa cap canvi visible. Ara invoca applyConfirmedBid(), que executa el motor de subastes i reescriu el podio de manera atòmica.",
          de: "Der Handler für checkout.session.completed vermerkte die Transaktion nur im Journal; kein Eintrag erreichte je die Podest-Tabelle, sodass eine bestätigte Zahlung keine sichtbare Änderung bewirkte. Er ruft nun applyConfirmedBid() auf, das die Auktionslogik ausführt und das Podest atomar neu schreibt.",
        },
      },
      {
        category: "SECURITY",
        title: {
          es: "La regla +1€ se valida contra el récord real",
          en: "The +1€ rule is validated against the real record",
          ca: "La regla +1€ es valida contra el rècord real",
          de: "Die +1€-Regel wird gegen den tatsächlichen Rekord geprüft",
        },
        description: {
          es: "La validación de importes se ejecutaba contra un catálogo de puestos siempre vacío, por lo que la regla +1€ y la detección de colisiones nunca se activaban: era posible registrar una aportación de 1€ sobre un récord de cualquier importe. Ahora el servidor carga el podio real desde D1 antes de validar.",
          en: "Amount validation ran against an always-empty spot catalogue, so the +1€ rule and collision detection never triggered: a €1 contribution could be placed on a record of any amount. The server now loads the real podium from D1 before validating.",
          ca: "La validació d'imports s'executava contra un catàleg de puestos sempre buit, de manera que la regla +1€ i la detecció de col·lisions mai no s'activaven: era possible registrar una aportació d'1€ sobre un rècord de qualsevol import. Ara el servidor carrega el podio real des de D1 abans de validar.",
          de: "Die Betragsprüfung lief gegen einen stets leeren Katalog, sodass die +1€-Regel und die Kollisionserkennung nie ausgelöst wurden: Ein Beitrag von 1 € war auf jedem Rekordbetrag möglich. Der Server lädt das reale Podest nun vor der Prüfung aus D1.",
        },
      },
      {
        category: "SECURITY",
        title: {
          es: "Verificación server-side del pago en la pantalla de retorno",
          en: "Server-side payment verification on the return screen",
          ca: "Verificació server-side del pagament a la pantalla de retorn",
          de: "Serverseitige Zahlungsprüfung auf der Rückkehrseite",
        },
        description: {
          es: "El parámetro ?payment=success es falsificable y se mostraba como confirmación. Ahora la página consulta al endpoint /api/verify-checkout-session, que valida la sesión contra la API de Stripe antes de mostrar ningún mensaje de éxito. Sin session_id, o con una sesión no pagada, se informa con honestidad en vez de inventar una confirmación.",
          en: "The ?payment=success parameter is forgeable and was shown as a confirmation. The page now calls /api/verify-checkout-session, which validates the session against the Stripe API before displaying any success message. Without a session_id, or with an unpaid session, the page reports honestly instead of inventing a confirmation.",
          ca: "El paràmetre ?payment=success és falsificable i es mostrava com a confirmació. Ara la pàgina consulta l'endpoint /api/verify-checkout-session, que valida la sessió contra l'API de Stripe abans de mostrar cap missatge d'èxit. Sense session_id, o amb una sessió no pagada, s'informa amb honestitat en lloc d'inventar una confirmació.",
          de: "Der Parameter ?payment=success ist fälschbar und wurde als Bestätigung angezeigt. Die Seite ruft nun /api/verify-checkout-session auf, das die Sitzung gegen die Stripe-API prüft, bevor eine Erfolgsmeldung erscheint. Ohne session_id oder bei einer unbezahlten Sitzung wird ehrlich berichtet, statt eine Bestätigung zu erfinden.",
        },
      },
    ],
  },
  {
    version: "0.08",
    versionLabel: {
      es: "v0.08 · Directorio Paginado (5,5 MB → 485 KB), Destacados y Filtros en Servidor",
      en: "v0.08 · Paginated Directory (5.5 MB → 485 KB), Featured Block and Server-Side Filters",
      ca: "v0.08 · Directori Paginat (5,5 MB → 485 KB), Destacats i Filtres al Servidor",
      de: "v0.08 · Paginiertes Verzeichnis (5,5 MB → 485 KB), Highlight-Block und Server-Filter",
    },
    type: "MINOR",
    date: "2026-09-27",
    summary: {
      es: "El directorio /servicios deja de generar 5,5 MB de HTML en una sola respuesta y pasa a paginación real en el servidor: 48 fichas por página en URLs rastreables (?pagina=N), lo que elimina el error 1102 del Worker (límite de CPU) que estaba tumbando el catálogo en picos de tráfico. Además, la entrada del directorio es ahora un bloque de Servicios Destacados que se oculta en cuanto el visitante filtra, y los filtros rápidos (Abierto ahora, inglés/alemán, terraza, pet friendly, accesible) pasan a resolverse en el servidor como enlaces reales, de modo que ya no dan resultados falsos al filtrar sobre una página parcial.",
      en: "The /servicios directory stops producing 5.5 MB of HTML in a single response and moves to real server-side pagination: 48 listings per page on crawlable URLs (?pagina=N), which removes the Worker error 1102 (CPU limit) that was taking the catalogue down at traffic peaks. On top of that, the directory now opens with a Featured Services block that hides as soon as the visitor filters, and the quick filters (Open now, English/German, terrace, pet friendly, accessible) are resolved on the server as real links, so they no longer return wrong results when filtering a partial page.",
      ca: "El directori /servicios deixa de generar 5,5 MB d'HTML en una sola resposta i passa a paginació real al servidor: 48 fitxes per pàgina en URLs rastrejables (?pagina=N), cosa que elimina l'error 1102 del Worker (límit de CPU) que tombava el catàleg en pics de trànsit. A més, l'entrada del directori és ara un bloc de Serveis Destacats que s'oculta quan el visitant filtra, i els filtres ràpids (Obert ara, anglès/alemany, terrassa, pet friendly, accessible) es resolen al servidor com a enllaços reals, de manera que ja no donen resultats falsos en filtrar una pàgina parcial.",
      de: "Das Verzeichnis /servicios erzeugt nicht mehr 5,5 MB HTML in einer einzigen Antwort, sondern nutzt echte serverseitige Paginierung: 48 Einträge pro Seite unter crawlbaren URLs (?pagina=N). Damit entfällt der Worker-Fehler 1102 (CPU-Limit), der den Katalog bei Traffic-Spitzen ausfallen ließ. Zusätzlich beginnt das Verzeichnis mit einem Block „Ausgewählte Dienstleistungen“, der sich ausblendet, sobald gefiltert wird, und die Schnellfilter (Jetzt geöffnet, Englisch/Deutsch, Terrasse, haustierfreundlich, barrierefrei) werden serverseitig als echte Links aufgelöst – damit liefern sie bei Teilergebnisse-Seiten keine falschen Treffer mehr.",
    },
    highlights: {
      es: [
        "Paginación SSR real: 48 fichas por página en URLs rastreables (?pagina=N) — el HTML del directorio pasa de 5,5 MB a 485 KB (-91 %).",
        "Fin del error 1102: cada página tiene presupuesto de CPU acotado, así el catálogo deja de caer (503) en picos de tráfico o crawlers.",
        "SEO/GEO: las 20 páginas del directorio entran en el sitemap (4 idiomas) con enlaces rel=prev/next para descubrimiento de crawlers y agentes de IA.",
        "Contexto preservado: categoria, zona, q e intencion sobreviven al cambiar de página; la página 1 mantiene la URL canónica limpia.",
        "Servicios Destacados en la entrada del directorio, que se ocultan en cuanto hay un filtro activo (misma regla en servidor y cliente).",
        "Filtros rápidos convertidos en enlaces reales resueltos en el servidor: sin resultados falsos al filtrar una página parcial. -4 KB de JS duplicado.",
      ],
      en: [
        "Real SSR pagination: 48 listings per page on crawlable URLs (?pagina=N) — directory HTML drops from 5.5 MB to 485 KB (-91%).",
        "Error 1102 solved: each page has a bounded CPU budget, so the catalogue no longer drops (503) at traffic or crawler peaks.",
        "SEO/GEO: all 20 directory pages are listed in the sitemap (4 languages) with rel=prev/next links for crawler and AI-agent discovery.",
        "Context preserved: category, zone, q and intent survive page changes; page 1 keeps the clean canonical URL.",
        "Featured Services block at the directory entry point, hidden as soon as any filter is active (same rule on server and client).",
        "Quick filters turned into real server-side links: no more wrong results when filtering a partial page. 4 KB of duplicated JS removed.",
      ],
      ca: [
        "Paginació SSR real: 48 fitxes per pàgina en URLs rastrejables (?pagina=N) — l'HTML del directori passa de 5,5 MB a 485 KB (-91 %).",
        "Fi de l'error 1102: cada pàgina té pressupost de CPU acotat, de manera que el catàleg deixa de caure (503) en pics de trànsit o crawlers.",
        "SEO/GEO: les 20 pàgines del directori entren al sitemap (4 idiomes) amb enllaços rel=prev/next per al descobriment de crawlers i agents d'IA.",
        "Context preservat: categoria, zona, q i intencion sobreviuen en canviar de pàgina; la pàgina 1 manté la URL canònica neta.",
        "Serveis Destacats a l'entrada del directori, que s'oculten quan hi ha un filtre actiu (mateixa regla en servidor i client).",
        "Filtres ràpids convertits en enllaços reals resolts al servidor: sense resultats falsos en filtrar una pàgina parcial. -4 KB de JS duplicat.",
      ],
      de: [
        "Echte SSR-Paginierung: 48 Einträge pro Seite unter crawlbaren URLs (?pagina=N) — das Verzeichnis-HTML sinkt von 5,5 MB auf 485 KB (-91 %).",
        "Fehler 1102 behoben: Jede Seite hat ein begrenztes CPU-Budget, der Katalog bricht bei Traffic- oder Crawler-Spitzen nicht mehr ein (503).",
        "SEO/GEO: Alle 20 Verzeichnisseiten stehen in der Sitemap (4 Sprachen) mit rel=prev/next-Links für Crawler- und KI-Agent-Discovery.",
        "Kontext bleibt erhalten: Kategorie, Zone, q und Intent überleben den Seitenwechsel; Seite 1 behält die saubere kanonische URL.",
        "Highlight-Block am Verzeichniseinstieg, der sich bei aktivem Filter ausblendet (gleiche Regel auf Server und Client).",
        "Schnellfilter als echte serverseitige Links: keine falschen Treffer mehr beim Filtern einer Teilergebnisse-Seite. 4 KB doppeltes JS entfernt.",
      ],
    },
    entries: [
      {
        category: "PERFORMANCE",
        title: {
          es: "Paginación SSR del directorio: 5,5 MB → 485 KB",
          en: "Directory SSR pagination: 5.5 MB → 485 KB",
          ca: "Paginació SSR del directori: 5,5 MB → 485 KB",
          de: "SSR-Paginierung des Verzeichnisses: 5,5 MB → 485 KB",
        },
        description: {
          es: "El catálogo se sirve en 20 páginas de 48 fichas con URLs rastreables. Cada página tiene coste acotado, lo que elimina el error 1102 del Worker que tumbaba /es/servicios con 503 en picos de tráfico.",
          en: "The catalogue is served in 20 pages of 48 listings with crawlable URLs. Each page has bounded cost, eliminating the Worker error 1102 that took /es/servicios down with 503 at traffic peaks.",
          ca: "El catàleg se serveix en 20 pàgines de 48 fitxes amb URLs rastrejables. Cada pàgina té cost acotat, cosa que elimina l'error 1102 del Worker que tombava /es/servicios amb 503 en pics de trànsit.",
          de: "Der Katalog wird in 20 Seiten mit je 48 Einträgen unter crawlbaren URLs ausgeliefert. Jede Seite hat begrenzte Kosten – damit entfällt der Worker-Fehler 1102, der /es/servicios bei Traffic-Spitzen mit 503 ausfallen ließ.",
        },
        badgeText: {
          es: "−91 % HTML",
          en: "−91 % HTML",
          ca: "−91 % HTML",
          de: "−91 % HTML",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Servicios Destacados en la entrada del directorio",
          en: "Featured services at the directory entry point",
          ca: "Serveis Destacats a l'entrada del directori",
          de: "Highlight-Block am Verzeichniseinstieg",
        },
        description: {
          es: "El directorio abre con la selección editorial (completada con los mejor valorados) y esos destacados se ocultan en cuanto el visitante aplica cualquier filtro, tanto en servidor como en vivo.",
          en: "The directory opens with the editorial selection (topped up with the best rated) and those featured listings hide as soon as the visitor applies any filter, on the server and live.",
          ca: "El directori obre amb la selecció editorial (completada amb els millor valorats) i aquests destacats s'oculten quan el visitant aplica qualsevol filtre, tant al servidor com en viu.",
          de: "Das Verzeichnis öffnet mit der redaktionellen Auswahl (aufgefüllt mit den bestbewerteten); diese Highlights blenden sich aus, sobald der Besucher filtert – serverseitig wie live.",
        },
        badgeText: {
          es: "Nueva entrada",
          en: "New entry",
          ca: "Nova entrada",
          de: "Neuer Einstieg",
        },
      },
    ],
  },

  {
    version: "0.07",
    versionLabel: {
      es: "v0.07 · Flujo de Titularidad Blindado (Reclamar / Crear / Editar)",
      en: "v0.07 · Hardened Ownership Flow (Claim / Create / Edit)",
      ca: "v0.07 · Flux de Titularitat Blindat (Reclamar / Crear / Editar)",
      de: "v0.07 · Gehärteter Eigentumsfluss (Fordern / Anlegen / Bearbeiten)",
    },
    type: "MINOR",
    date: "2026-09-27",
    summary: {
      es: "Cierre de los 5 hallazgos P0 del flujo Reclamar/Crear/Editar. Los campos de verificación solo los escribe un administrador y siempre con método de acreditación y documento https; la titularidad de una ficha nunca se transfiere por accidente; los claims se deduplican con ID determinista y también en las reglas de Firestore; y la aprobación de un claim es un único batch atómico (rol + negocio asignado + titularidad con evidencia) sin posibilidad de escalada de rol sin negocio. Además, todo lo que el titular edita (descripción, destacados, servicios, email, estado) se publica de verdad en la ficha pública y cada escritura deja auditoría completa.",
      en: "Closure of the 5 P0 findings in the Claim/Create/Edit flow. Verification fields can only be written by an administrator and always with a verification method plus an https document; ownership is never transferred by accident; claims are deduplicated with a deterministic id and also at Firestore rules level; and approving a claim is a single atomic batch (role + assigned business + ownership with evidence) with no possibility of escalating to manager without a business. In addition, everything the owner edits (description, highlights, services, email, status) is now really published on the public listing and every write leaves a full audit trail.",
      ca: "Tancament dels 5 hallazgos P0 del flux Reclamar/Crear/Editar. Els camps de verificació només els escriu un administrador i sempre amb mètode d'acreditació i document https; la titularitat d'una fitxa mai no es transfereix per accident; les reclamacions es deduplicen amb ID determinista i també a les regles de Firestore; i l'aprovació d'una reclamació és un únic lot atòmic (rol + negoci assignat + titularitat amb evidència) sense possibilitat d'escalar a rol manager sense negoci. A més, tot el que edita el titular (descripció, destacats, serveis, email, estat) es publica realment a la fitxa pública i cada escriptura deixa auditoria completa.",
      de: "Schließung der 5 P0-Befunde im Fordern/Anlegen/Bearbeiten-Fluss. Verifizierungsfelder können nur von einem Administrator geschrieben werden und immer mit Verifizierungsmethode und https-Dokument; die Eigentümerschaft einer Karte wird nie versehentlich übertragen; Anfragen werden mit deterministischer ID und zusätzlich auf Firestore-Rules-Ebene dedupliziert; und die Genehmigung einer Anfrage ist ein einziger atomarer Batch (Rolle + zugewiesenes Unternehmen + Eigentümerschaft mit Nachweis) ohne Möglichkeit einer Eskalation ohne Unternehmen. Zudem wird nun alles, was der Inhaber bearbeitet (Beschreibung, Highlights, Leistungen, E-Mail, Status), wirklich im öffentlichen Eintrag veröffentlicht und jeder Schreibvorgang hinterlässt ein vollständiges Audit-Trail.",
    },
    highlights: {
      es: [
        "Verificación blindada: verifyBusinessAsAdmin exige método + documento https y registra verifiedByUid/verifiedByRole; sin evidencia no hay sello (GR-11).",
        "Titularidad intocable: el ownerUid existente nunca se sobrescribe y el admin jamás se convierte en dueño de la ficha al verificarla.",
        "Claims deduplicados: ID determinista claim-{servicio}-{usuario} + preflight duplicate_claim / already_claimed + regla !exists(...) en Firestore.",
        "Aprobación atómica: un único writeBatch actualiza claim + users.role + managedServices + override con la titularidad del solicitante.",
        "Escalada de rol imposible sin negocio: aprobar sin solicitante y negocio lanza missing_business y no escribe nada.",
        "Edición visible de verdad: la hidratación aplica mergeServiceWithOverride y publica descripción, destacados, servicios, email y estado.",
        "Auditoría por escritura: cada guardado registra autor, rol, campos modificados y valores anterior/nuevo (máx. 20 entradas).",
        "Telemetría sin silencios: clientTelemetry reporta a D1 con deduplicación de 5 minutos; 0 catch mudos en el flujo.",
      ],
      en: [
        "Hardened verification: verifyBusinessAsAdmin requires a verification method + https document and records verifiedByUid/verifiedByRole; no evidence, no seal (GR-11).",
        "Untouchable ownership: an existing ownerUid is never overwritten and an admin never becomes the listing owner by verifying it.",
        "Deduplicated claims: deterministic claim-{service}-{user} id + duplicate_claim/already_claimed preflight + !exists(...) rule in Firestore.",
        "Atomic approval: a single writeBatch updates claim + users.role + managedServices + override with the applicant's ownership.",
        "Role escalation without a business is impossible: approving without applicant and business throws missing_business and writes nothing.",
        "Edits are really published: hydration applies mergeServiceWithOverride and surfaces description, highlights, services, email and status.",
        "Audit on every write: each save records author, role, changed fields and previous/new values (max 20 entries).",
        "No silent telemetry: clientTelemetry reports to D1 with 5-minute deduplication; 0 muted catch blocks in the flow.",
      ],
      ca: [
        "Verificació blindada: verifyBusinessAsAdmin exigeix mètode + document https i registra verifiedByUid/verifiedByRole; sense evidència no hi ha segell (GR-11).",
        "Titularitat intocable: l'ownerUid existent mai no se sobreescriu i l'admin mai no es converteix en propietari de la fitxa en verificar-la.",
        "Reclamacions deduplicades: ID determinista claim-{servei}-{usuari} + preflight duplicate_claim/already_claimed + regla !exists(...) a Firestore.",
        "Aprovació atòmica: un únic writeBatch actualitza claim + users.role + managedServices + override amb la titularitat del sol·licitant.",
        "Escalar de rol sense negoci és impossible: aprovar sense sol·licitant i negoci llança missing_business i no escriu res.",
        "Les edicions es publiquen de veritat: la hidratació aplica mergeServiceWithOverride i mostra descripció, destacats, serveis, email i estat.",
        "Auditoria per escriptura: cada desat registra autor, rol, camps modificats i valor anterior/nou (màx. 20 entrades).",
        "Telemetria sense silencis: clientTelemetry informa a D1 amb deduplicació de 5 minuts; 0 catch mudos al flux.",
      ],
      de: [
        "Gehärtete Verifizierung: verifyBusinessAsAdmin verlangt Methode + https-Dokument und speichert verifiedByUid/verifiedByRole; ohne Nachweis kein Siegel (GR-11).",
        "Unantastbare Eigentümerschaft: Eine bestehende ownerUid wird nie überschrieben und ein Admin wird durch die Verifizierung nie zum Eigentümer.",
        "Deduplizierte Anfragen: deterministische ID claim-{betrieb}-{nutzer} + Preflight duplicate_claim/already_claimed + !exists(...)-Regel in Firestore.",
        "Atomare Genehmigung: Ein einziger writeBatch aktualisiert Anfrage + users.role + managedServices + Override mit Eigentümerschaft des Antragstellers.",
        "Rollen-Eskalation ohne Unternehmen unmöglich: Genehmigung ohne Antragsteller und Unternehmen löst missing_business aus und schreibt nichts.",
        "Änderungen werden wirklich veröffentlicht: Die Hydration nutzt mergeServiceWithOverride und zeigt Beschreibung, Highlights, Leistungen, E-Mail und Status.",
        "Audit pro Schreibvorgang: Jeder Save protokolliert Autor, Rolle, geänderte Felder sowie alte/neue Werte (max. 20 Einträge).",
        "Telemetrie ohne Schweigen: clientTelemetry meldet mit 5-Minuten-Deduplizierung an D1; 0 stumme catch-Blöcke im Fluss.",
      ],
    },
    entries: [
      {
        category: "SECURITY",
        title: {
          es: "Flujo de titularidad blindado (5 P0 cerrados)",
          en: "Hardened ownership flow (5 P0 closed)",
          ca: "Flux de titularitat blindat (5 P0 tancats)",
          de: "Gehärteter Eigentumsfluss (5 P0 geschlossen)",
        },
        description: {
          es: "Solo el admin escribe el sello oficial y con evidencia real; la titularidad no se secuestra; los claims no se duplican; la aprobación es atómica y nunca escala roles sin negocio.",
          en: "Only admins write the official seal and only with real evidence; ownership cannot be hijacked; claims cannot duplicate; approval is atomic and never escalates roles without a business.",
          ca: "Només l'admin escriu el segell oficial i amb evidència real; la titularitat no es sequestra; les reclamacions no es dupliquen; l'aprovació és atòmica i mai escala rols sense negoci.",
          de: "Nur Admins schreiben das offizielle Siegel und nur mit echtem Nachweis; Eigentümerschaft kann nicht entführt werden; Anfragen duplizieren sich nicht; die Genehmigung ist atomar und eskaliert nie Rollen ohne Unternehmen.",
        },
        badgeText: {
          es: "INV-01…INV-06 OK",
          en: "INV-01…INV-06 OK",
          ca: "INV-01…INV-06 OK",
          de: "INV-01…INV-06 OK",
        },
      },
      {
        category: "FIX",
        title: {
          es: "Lo que el titular edita, ahora se publica",
          en: "What owners edit is now published",
          ca: "Allò que edita el titular ara es publica",
          de: "Was Inhaber bearbeiten, wird jetzt veröffentlicht",
        },
        description: {
          es: "La hidratación de la ficha aplica el motor de fusión con la instantánea estática del servidor: descripción, destacados, servicios, email y estado operativo llegan al usuario final.",
          en: "Listing hydration now applies the merge engine with the server-side static snapshot: description, highlights, services, email and operating status reach the end user.",
          ca: "La hidratació de la fitxa aplica el motor de fusió amb la instantània estàtica del servidor: descripció, destacats, serveis, email i estat arriben a l'usuari final.",
          de: "Die Hydration des Eintrags nutzt die Fusion mit dem serverseitigen Snapshot: Beschreibung, Highlights, Leistungen, E-Mail und Betriebsstatus erreichen die Endnutzer.",
        },
        badgeText: {
          es: "INV-07 parcial",
          en: "INV-07 partial",
          ca: "INV-07 parcial",
          de: "INV-07 teilweise",
        },
      },
    ],
  },

  {
    version: "0.06.2",
    versionLabel: {
      es: "v0.06.2 · Blindaje de Rendimiento Cloudflare Workers & Eliminación de Cuellos de Botella (Error 1102)",
      en: "v0.06.2 · Cloudflare Workers Performance Shield & Bottleneck Elimination (Error 1102)",
      ca: "v0.06.2 · Blindatge de Rendiment Cloudflare Workers i Eliminació de Coll d'Ampolla (Error 1102)",
      de: "v0.06.2 · Cloudflare Workers Leistungsoptimierung & Beseitigung von Engpässen (Fehler 1102)",
    },
    type: "PATCH",
    date: "2026-09-27",
    summary: {
      es: "Optimización integral de rendimiento para eliminar consumos excesivos de CPU en Cloudflare Workers y erradicar el Error 1102. Implementación de Edge Caching CDN en rutas públicas, memoización de cálculos pesados de topEngine, eliminación de bucles redundantes en la Home y búsqueda O(1) de servicios.",
      en: "Comprehensive performance optimization to eliminate excessive CPU consumption on Cloudflare Workers and eradicate Error 1102. Implementation of CDN Edge Caching on public routes, memoization of topEngine heavy computations, elimination of redundant Home loops, and O(1) service lookups.",
      ca: "Optimització integral de rendiment per eliminar consums excessius de CPU a Cloudflare Workers i erradicar l'Error 1102. Implementació d'Edge Caching CDN en rutes públiques, memoització de càlculs pesats de topEngine, eliminació de bucles redundants a la Home i cerca O(1) de serveis.",
      de: "Umfassende Leistungsoptimierung zur Beseitigung übermäßigen CPU-Verbrauchs bei Cloudflare Workers und Beseitigung von Fehler 1102. Implementierung von CDN Edge Caching auf öffentlichen Routen, Memoization von topEngine-Berechnungen, Beseitigung redundanter Home-Schleifen und O(1)-Dienstsuche.",
    },
    highlights: {
      es: [
        "Edge CDN Caching en rutas públicas: Cache-Control con s-maxage=86400 y stale-while-revalidate para que Cloudflare sirva respuestas en <20ms sin invocar el Worker.",
        "Set-Cookie condicional: Se evita invalidar la caché perimetral de Cloudflare emitiendo la cookie de locale únicamente ante cambios reales.",
        "Búsqueda O(1) de catálogo: Índices por slug e ID en memoria y precalculado de servicios destacados y categorías.",
        "Memoización de topEngine: Cálculo único de calidad y scores por categoría/semana/zona, evitando iterar 953 negocios en cada render.",
        "Home sin bucles redundantes: Las estadísticas del hero bar y conteos por categoría se computan a nivel de módulo una sola vez.",
      ],
      en: [
        "Edge CDN Caching on public routes: Cache-Control with s-maxage=86400 and stale-while-revalidate so Cloudflare serves requests in <20ms without invoking the Worker.",
        "Conditional Set-Cookie: Avoids edge cache bypass by emitting the locale cookie only on actual changes.",
        "O(1) Catalog Lookups: In-memory Map indexed by slug and ID, with precomputed featured and category slices.",
        "topEngine Memoization: Single calculation of quality breakdowns and scores per category/week/zone, skipping 953-item iterations per render.",
        "Home loop removal: Hero bar stats and category counts are computed at module level only once.",
      ],
      ca: [
        "Edge CDN Caching en rutes públiques: Cache-Control amb s-maxage=86400 i stale-while-revalidate per servir en <20ms.",
        "Set-Cookie condicional: Evita invalidar la memòria cau perimetral emetent la galeta només davant canvis reals.",
        "Cerca O(1) de catàleg: Índexs per slug i ID en memòria i precalculat de destacats.",
        "Memoització de topEngine: Càlcul únic de rànquings evitant iteracions de 953 negocis per petició.",
        "Home sense bucles redundants: Estadístiques computades una sola vegada a nivell de mòdul.",
      ],
      de: [
        "Edge-CDN-Caching auf öffentlichen Routen: Cache-Control mit s-maxage=86400 und stale-while-revalidate für <20ms Antwortzeit.",
        "Bedingtes Set-Cookie: Verhindert Cache-Bypassing, indem das Locale-Cookie nur bei tatsächlichen Änderungen gesetzt wird.",
        "O(1)-Katalogsuche: In-Memory-Maps nach ID und Slug sowie vorberechnete Listen.",
        "topEngine-Memoization: Einmalige Berechnung von Qualitäts-Scores pro Kategorie/Woche/Zone.",
        "Home ohne redundante Schleifen: Statistik-Zählungen werden nur einmal auf Modulebene durchgeführt.",
      ],
    },
    entries: [
      {
        category: "PERFORMANCE",
        title: {
          es: "Blindaje de rendimiento y Edge Caching Cloudflare",
          en: "Performance shielding & Cloudflare Edge Caching",
          ca: "Blindatge de rendiment i Edge Caching Cloudflare",
          de: "Leistungsoptimierung und Cloudflare Edge Caching",
        },
        description: {
          es: "Reducción de consumo de CPU de Worker en >99% para erradicar el Error 1102 y acelerar la carga de la plataforma.",
          en: "Worker CPU reduction >99% to eliminate Error 1102 and dramatically accelerate platform load times.",
          ca: "Reducció de consum de CPU de Worker en >99% per erradicar l'Error 1102 i accelerar la càrrega.",
          de: "Worker-CPU-Reduktion um >99%, um Fehler 1102 zu beseitigen und Ladezeiten drastisch zu verkürzen.",
        },
        badgeText: {
          es: "0ms CPU CDN",
          en: "0ms CPU CDN",
          ca: "0ms CPU CDN",
          de: "0ms CPU CDN",
        },
      },
    ],
  },
  {
    version: "0.06.1",
    versionLabel: {
      es: "v0.06.1 · Honestidad de Datos Total (GR-11) & Corrección de Fichas Multi-Mapa",
      en: "v0.06.1 · Total Data Honesty (GR-11) & Multi-Map Listing Corrections",
      ca: "v0.06.1 · Honestedat de Dades Total (GR-11) i Correcció de Fitxes Multi-Mapa",
      de: "v0.06.1 · Totale Datenintegrität (GR-11) & Korrektur von Multi-Karten-Einträgen",
    },
    type: "PATCH",
    date: "2026-09-27",
    summary: {
      es: "Corrección de honestidad de datos en la ficha de inkEnzo: imágenes propias reales (7 webp oficiales), eliminación de URLs falsas de Google/Apple/Bing Maps y del desglose de reseñas inventado (48/16/12), y estados honestos 'Sin ficha' en el componente multi-mapa.",
      en: "Data honesty fix on the inkEnzo profile: real own images (7 official webp), removal of fake Google/Apple/Bing Maps URLs and invented review breakdown (48/16/12), plus honest 'No listing' states across the multi-map component.",
      ca: "Correcció d'honestedat de dades a la fitxa d'inkEnzo: imatges pròpies reals (7 webp oficials), eliminació d'URLs falses de Google/Apple/Bing Maps i del desglossament de ressenyes inventat (48/16/12), i estats honestos 'Sense fitxa' al component multi-mapa.",
      de: "Datenintegritäts-Korrektur am inkEnzo-Profil: echte eigene Bilder (7 offizielle WebP), Entfernung falscher Google/Apple/Bing-Maps-URLs und erfundener Bewertungszahlen (48/16/12) sowie ehrliche „Kein Eintrag“-Zustände im Multi-Karten-Komponent.",
    },
    highlights: {
      es: [
        "inkEnzo: 7 imágenes reales propias (.webp) descargadas de inkenzo.com — antes usaba fotos de otros negocios.",
        "Eliminadas URLs falsas de búsqueda genérica de Google/Apple/Bing Maps y el desglose de reputación inventado (48+16+12 reseñas).",
        "reviewCount honesto: 4 reseñas directas verificadas (plataforma 'direct') en lugar de 48 inventadas.",
        "Corregida la causa raíz sistémica: test, validador y scripts ya NO autogeneran URLs falsas de mapas.",
      ],
      en: [
        "inkEnzo: 7 real own images (.webp) downloaded from inkenzo.com — previously used photos from other businesses.",
        "Removed fake generic-search Google/Apple/Bing Maps URLs and the invented reputation breakdown (48+16+12 reviews).",
        "Honest reviewCount: 4 verified direct reviews (platform 'direct') instead of 48 invented.",
        "Root cause fixed: test, validator and generator scripts no longer auto-generate fake map URLs.",
      ],
      ca: [
        "inkEnzo: 7 imatges pròpies reals (.webp) descarregades d'inkenzo.com — abans feia servir fotos d'altres negocis.",
        "Eliminades URLs falses de cerca genèrica de Google/Apple/Bing Maps i el desglossament de reputació inventat (48+16+12 ressenyes).",
        "reviewCount honest: 4 ressenyes directes verificades (plataforma 'direct') en lloc de 48 inventades.",
        "Corregida la causa arrel sistèmica: test, validador i scripts ja NO autogeneren URLs falses de mapes.",
      ],
      de: [
        "inkEnzo: 7 echte eigene Bilder (.webp) von inkenzo.com geladen — vorher wurden Fotos anderer Unternehmen verwendet.",
        "Falsche generische Such-URLs für Google/Apple/Bing Maps und die erfundene Bewertungsaufschlüsselung (48+16+12) entfernt.",
        "Ehrliche reviewCount: 4 verifizierte Direktbewertungen (Plattform 'direct') statt 48 erfundener.",
        "Systemische Ursache behoben: Test, Validator und Generatoren erzeugen keine falschen Karten-URLs mehr.",
      ],
    },
    entries: [
      {
        category: "FIX",
        title: {
          es: "inkEnzo: imágenes propias reales y cero datos falsos de mapas",
          en: "inkEnzo: real own images and zero fake map data",
          ca: "inkEnzo: imatges pròpies reals i zero dades falses de mapes",
          de: "inkEnzo: echte eigene Bilder und keine erfundenen Kartendaten",
        },
        description: {
          es: "La ficha usaba fotos de otros negocios, URLs de búsqueda genérica (sin ficha real) y 76 reseñas inventadas (48+16+12). Corregido: 7 imágenes webp oficiales, reviewCount=4 (reseñas directas) y el componente muestra honestamente 'Sin ficha'.",
          en: "The profile used photos from other businesses, generic search URLs (no real listing) and 76 invented reviews (48+16+12). Fixed: 7 official webp images, reviewCount=4 (direct reviews) and the component now honestly shows 'No listing'.",
          ca: "La fitxa usava fotos d'altres negocis, URLs de cerca genèrica (sense fitxa real) i 76 ressenyes inventades (48+16+12). Corregit: 7 imatges webp oficials, reviewCount=4 (ressenyes directes) i el component mostra honestament 'Sense fitxa'.",
          de: "Das Profil verwendete Fotos anderer Unternehmen, generische Such-URLs (kein echter Eintrag) und 76 erfundene Bewertungen (48+16+12). Korrigiert: 7 offizielle WebP-Bilder, reviewCount=4 (Direktbewertungen) und das Komponent zeigt ehrlich „Kein Eintrag“.",
        },
        badgeText: { es: "Honestidad", en: "Honesty", ca: "Honestedat", de: "Integrität" },
      },
      {
        category: "FIX",
        title: {
          es: "Bloqueada la generación sistémica de URLs de mapas falsas",
          en: "Blocked systemic generation of fake map URLs",
          ca: "Bloquejada la generació sistèmica d'URLs de mapes falses",
          de: "Systemische Erzeugung falscher Karten-URLs blockiert",
        },
        description: {
          es: "El test de servicios, el validador (validateServices) y los scripts add-service, mass-curator y rank-and-organize forzaban URLs de Google/Apple/Bing Maps en toda ficha. Ahora las URLs son opcionales y únicamente se muestran fichas reales contrastadas.",
          en: "The services test, the validator (validateServices) and the add-service, mass-curator and rank-and-organize scripts forced Google/Apple/Bing Maps URLs on every listing. URLs are now optional and only verified real listings are shown.",
          ca: "El test de serveis, el validador (validateServices) i els scripts add-service, mass-curator i rank-and-organize forçaven URLs de Google/Apple/Bing Maps a totes les fitxes. Ara les URLs són opcionals i només es mostren fitxes reals contrastades.",
          de: "Der Services-Test, der Validator (validateServices) und die Skripte add-service, mass-curator und rank-and-organize erzwangen Google/Apple/Bing-Maps-URLs auf jedem Eintrag. URLs sind jetzt optional und es werden nur verifizierte echte Einträge angezeigt.",
        },
        badgeText: { es: "Anti-Fake", en: "Anti-Fake", ca: "Anti-Fake", de: "Anti-Fake" },
      },
    ],
  },
  {
    version: "0.06",
    versionLabel: {
      es: "v0.06-beta · GEO (Generative Engine Optimization), Indexación de Agentes IA, Checkout API y Hub de Posicionamiento B2B",
      en: "v0.06-beta · GEO (Generative Engine Optimization), AI Agent Indexing, Checkout API & B2B Authority Hub",
      ca: "v0.06-beta · GEO (Generative Engine Optimization), Indexació d'Agents IA, Checkout API i Hub de Posicionament B2B",
      de: "v0.06-beta · GEO (Generative Engine Optimization), KI-Agenten-Indexierung, Checkout-API & B2B-Positionierungs-Hub",
    },
    type: "MAJOR",
    date: "2026-09-27",
    summary: {
      es: "Implementación integral de GEO (Generative Engine Optimization) para que los bots de IA (ChatGPT, Perplexity, Claude, Gemini) indexen y recomienden las empresas de Mallorca, nueva API de checkout con cálculo de IVA del 21%, simulador interactivo de prompts y ficha canónica de citación.",
      en: "Full implementation of GEO (Generative Engine Optimization) so AI chatbots (ChatGPT, Perplexity, Claude, Gemini) index and recommend Mallorca businesses, new checkout API with 21% VAT calculation, interactive prompt simulator, and canonical citation box.",
      ca: "Implementació integral de GEO (Generative Engine Optimization) per a que els bots d'IA indexin i recomanin les empreses de Mallorca, nova API de checkout amb càlcul d'IVA del 21%, simulador interactiu de prompts i caixa canònica de citació.",
      de: "Umfassende Implementierung von GEO (Generative Engine Optimization), damit KI-Chatbots Mallorca-Unternehmen indexieren und empfehlen, neue Checkout-API mit 21% MwSt.-Berechnung, interaktiver Prompt-Simulator und kanonische Zitierbox.",
    },
    highlights: {
      es: [
        "Protocolo GEO nativo en /llms.txt, /llms-full.txt y /.well-known/agents.json con directrices de citación para LLMs.",
        "Endpoint de servidor SSR /api/create-checkout-session con pasarela Stripe, modo Sandbox y cálculo fiscal.",
        "Simulador interactivo de búsqueda conversacional de IA en el portal para empresas (/unete).",
        "Caja de citación canónica para asistentes de IA (ChatGPT, Perplexity & Claude) en cada ficha de servicio.",
        "Documentación arquitectónica completa en docs/GEO_AND_AI_POSITIONING_STRATEGY.md.",
      ],
      en: [
        "Native GEO protocol in /llms.txt, /llms-full.txt, and /.well-known/agents.json with LLM citation rules.",
        "SSR server endpoint /api/create-checkout-session with Stripe gateway, Sandbox fallback, and tax breakdown.",
        "Live conversational AI prompt simulator on business positioning portal (/unete).",
        "Canonical AI citation box for LLMs across all service detail listings.",
        "Master architectural guide in docs/GEO_AND_AI_POSITIONING_STRATEGY.md.",
      ],
      ca: [
        "Protocol GEO natiu a /llms.txt, /llms-full.txt i /.well-known/agents.json amb regles de citació per a LLMs.",
        "Endpoint de servidor SSR /api/create-checkout-session amb passarel·la Stripe, Sandbox i desglossament d'IVA.",
        "Simulador interactiu de cerca conversacional d'IA al portal d'empreses (/unete).",
        "Caixa de citació canònica per a assistents d'IA a cada fitxa de servei.",
        "Documentació arquitectònica completa a docs/GEO_AND_AI_POSITIONING_STRATEGY.md.",
      ],
      de: [
        "Natives GEO-Protokoll in /llms.txt, /llms-full.txt und /.well-known/agents.json mit Zitierrichtlinien für LLMs.",
        "SSR-Server-Endpoint /api/create-checkout-session mit Stripe-Gateway, Sandbox und Steuerberechnung.",
        "Live-Prompt-Simulator für Konversations-KI auf der Unternehmensseite (/unete).",
        "Kanonische KI-Zitierbox für Sprachmodelle in allen Diensteinträgen.",
        "Architektur-Leitfaden in docs/GEO_AND_AI_POSITIONING_STRATEGY.md.",
      ],
    },
    entries: [
      {
        category: "FEATURE",
        title: {
          es: "Estrategia e Infraestructura GEO (Generative Engine Optimization)",
          en: "GEO Strategy and AI Agent Infrastructure",
          ca: "Estratègia i Infraestructura GEO per a IA",
          de: "GEO-Strategie und KI-Agenten-Infrastruktur",
        },
        description: {
          es: "Optimización de datos estructurados, Schema.org y puntos finales de lenguaje para que los asistentes de IA recomienden a los comercios de Mallorca con máxima prioridad.",
          en: "Structured data optimization, Schema.org, and LLM endpoints so AI assistants recommend Mallorca businesses with top priority.",
          ca: "Optimització de dades estructurades, Schema.org i endpoints de llenguatge per a recomanacions prioritàries per IA.",
          de: "Strukturierte Datenoptimierung und Sprachmodell-Endpunkte für vorrangige KI-Empfehlungen auf Mallorca.",
        },
        badgeText: {
          es: "GEO 2026",
          en: "GEO 2026",
          ca: "GEO 2026",
          de: "GEO 2026",
        },
      },
      {
        category: "SECURITY",
        title: {
          es: "Blindaje Financiero 360°, Anti-Duplicados y Prevención de Riesgos de Red/Hacking",
          en: "360° Financial Risk Shield, Anti-Duplicates & Network/Hacking Defense",
          ca: "Blindatge Financer 360°, Anti-Duplicats i Prevenció de Riscos",
          de: "360°-Finanzschutz, Dublettenschutz & Netzwerk-/Hacking-Abwehr",
        },
        description: {
          es: "Mutex locks anti-doble clic (20s), AbortController contra microcortes de red, validación fiscal NIF/CIF/NIE/VAT, verificación criptográfica HMAC-SHA256 de webhooks de Stripe y libro mayor de idempotencia permanente.",
          en: "Anti-double-click mutex locks (20s), AbortController against network drops, strict NIF/CIF/NIE/VAT fiscal validation, Stripe HMAC-SHA256 webhook cryptographic verification, and permanent idempotency ledger.",
          ca: "Mutex locks anti-doble clic (20s), AbortController contra microtalls de xarxa, validació fiscal NIF/CIF/NIE/VAT, verificació criptogràfica HMAC-SHA256 de webhooks de Stripe i llibre major d'idempotència.",
          de: "Anti-Doppelklick-Mutex-Sperren (20s), AbortController gegen Netzwerkunterbrechungen, Steuerprüfung (NIF/CIF/VAT), kryptografische HMAC-SHA256-Stripe-Webhook-Verifizierung und Idempotenz-Hauptbuch.",
        },
        badgeText: {
          es: "Blindaje 360°",
          en: "360° Shield",
          ca: "Blindatge 360°",
          de: "360°-Schutz",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Autenticación Obligatoria Previa al Pago, Recuperación de Carritos y Facturación Privada en Perfil",
          en: "Auth-Gated Checkout, Abandoned Cart Recovery & Private Invoicing in User Profile",
          ca: "Autenticació Obligatòria Prèvia al Pagament, Recuperació de Carrets i Facturació Privada al Perfil",
          de: "Pflicht-Authentifizierung vor Zahlung, Warenkorb-Wiederherstellung & private Rechnungen im Profil",
        },
        description: {
          es: "Puerta de acceso con returnUrl y resumeDraft=1, almacenamiento privado de facturas con desglose de IVA (21%), historial de cancelaciones sin cargo (0,00€) y reanudación o descarte en 1 clic desde el perfil del usuario.",
          en: "Auth gate with returnUrl and resumeDraft=1, private per-user invoice vault with 21% VAT breakdown, zero-charge cancellation audit trail (0.00€), and 1-click draft resume/discard in user profile.",
          ca: "Porta d'accés amb returnUrl i resumeDraft=1, emmagatzematge privat de factures amb desglossament d'IVA (21%), historial de cancel·lacions sense càrrec (0,00€) i represa o descart en 1 clic des del perfil.",
          de: "Zugangsbarriere mit returnUrl und resumeDraft=1, privater Rechnungsspeicher mit 21% MwSt.-Aufschlüsselung, gebührenfreie Storno-Historie (0,00€) und 1-Klick-Wiederaufnahme/-Verwerfung im Profil.",
        },
        badgeText: {
          es: "Perfil & Checkout",
          en: "Profile & Checkout",
          ca: "Perfil & Checkout",
          de: "Profil & Checkout",
        },
      },
      {
        category: "SECURITY",
        title: {
          es: "Versionado Legal Obligatorio (v2026.2), Modal de Re-Aceptación y Gestor de Cookies AEPD",
          en: "Mandatory Legal Terms Versioning (v2026.2), Re-Acceptance Modal & AEPD Cookie Manager",
          ca: "Versionat Legal Obligatori (v2026.2), Modal de Re-Acceptació i Gestor de Cookies AEPD",
          de: "Verbindliche Rechtsversionskontrolle (v2026.2), Neu-Zustimmungs-Modal & AEPD-Cookie-Manager",
        },
        description: {
          es: "Motor de cumplimiento RGPD con re-aceptación forzada ante cambios de normas, renuncia precontractual a desistimiento digital (Art. 103 LGDCU), banner de cookies AEPD y certificados de consentimiento descargables.",
          en: "GDPR compliance engine with automatic re-acceptance prompts on policy updates, pre-contractual digital waiver (Art. 103 LGDCU), AEPD-compliant cookie manager, and downloadable consent certificates.",
          ca: "Motor de compliment RGPD amb re-acceptació forçada davant canvis normatius, renúncia al desistiment digital (Art. 103 LGDCU), banner de cookies AEPD i certificats de consentiment descarregables.",
          de: "DSGVO-Compliance-Engine mit automatischer Zustimmungsaufforderung bei Regeländerungen, digitaler Widerrufsverzicht (Art. 103 LGDCU), AEPD-Cookie-Banner und herunterladbare Einwilligungszertifikate.",
        },
        badgeText: {
          es: "Legal & RGPD",
          en: "Legal & GDPR",
          ca: "Legal & RGPD",
          de: "Legal & DSGVO",
        },
      },
    ],
  },
  {
    version: "0.05",
    versionLabel: {
      es: "v0.05-beta · Observatorio Macroeconómico a 20 Años (16 Sectores), Curva Base 100 & Floating WhatsApp FAB",
      en: "v0.05-beta · 20-Year Historical Observatory (16 Sectors), Base 100 Curve & Floating WhatsApp FAB",
      ca: "v0.05-beta · Observatori Macroeconòmic a 20 Anys (16 Sectors), Corba Base 100 i Floating WhatsApp FAB",
      de: "v0.05-beta · 20-Jahre-Makro-Observatorium (16 Branchen), Basis-100-Indexkurve & Floating WhatsApp FAB",
    },
    type: "BETA",
    date: "2026-09-05",
    summary: {
      es: "Lanzamiento del Observatorio Histórico Insular a 20 Años (2006–2026) con 16 sectores canónicos (656 puntos semestrales contrastados), comparador cruzado con curva normalizada Base 100, exportador CSV blindado RFC 4180, 16 monografías en el blog con gráficas SVG dinámicas y optimización móvil para el botón flotante de WhatsApp con normalización automática de prefijo telefónico.",
      en: "Launch of the 20-Year Island Macroeconomic Observatory (2006–2026) featuring 16 canonical sectors (656 audited semiannual data points), interactive cross-comparator with Base 100 normalized growth curve, sanitized RFC 4180 CSV export, 16 dedicated blog monographs with embedded SVG charts, and mobile-responsive Floating WhatsApp FAB with smart phone prefix normalization.",
      ca: "Llançament de l'Observatori Històric Insular a 20 Anys (2006–2026) amb 16 sectors canònics (656 punts semestrals contrastats), comparador creuat amb corba normalitzada Base 100, exportador CSV segur RFC 4180, 16 monografies al blog amb gràfiques SVG dinàmiques i millora responsive del botó flotant de WhatsApp amb normalització automàtica de prefix.",
      de: "Start des 20-Jahre-Makro-Observatoriums (2006–2026) mit 16 amtlichen Branchen (656 geprüfte Halbjahreswerte), interaktivem Sektor-Vergleichstool mit Basis-100-Wachstumskurve, sicherem RFC-4180-CSV-Export, 16 Blog-Monografien mit dynamischen SVG-Charts und mobilem Floating-WhatsApp-Button mit automatischer Vorwahlerkennung.",
    },
    highlights: {
      es: [
        "16 Sectores Macroeconómicos (2006–2026): 656 puntos semestrales contrastados con IBESTAT, INE, Seguridad Social, AENA, TIRME y SFM.",
        "Curva Indexada Base 100: Normalización temporal interactiva con selector Base 2006 vs Base 2016 y crosshair dinámico de divergencia.",
        "16 Monografías en el Blog: Artículos de investigación profunda con gráficas de barras SVG integradas y enlaces a empresas auditadas.",
        "Seguridad de Datos & Anti-Injection: Sanitización RFC 4180 para descargas en Excel/Sheets y blindaje de URLs.",
        "Floating WhatsApp CTA: Conversión a FAB móvil en <768px y anteposición automática del prefijo +34 en teléfonos locales de 9 dígitos.",
        "Compilación Ultra-Rápida: 87 suites de test y 746 pruebas en verde con build en 1,6 s.",
      ],
      en: [
        "16 Macroeconomic Sectors (2006–2026): 656 audited semiannual data points from IBESTAT, INE, Social Security, AENA, TIRME, and SFM.",
        "Base 100 Normalized Curve: Interactive relative growth comparison with Base 2006 vs Base 2016 toggle and real-time divergence crosshair.",
        "16 Blog Research Monographs: In-depth economic reports featuring embedded native SVG bar charts and curated directory links.",
        "Data Security & CSV Formula Hardening: Strict RFC 4180 neutralization against formula injection for spreadsheet exports.",
        "Floating WhatsApp CTA: Adaptive circular FAB on mobile (<768px) and automatic Spanish +34 phone prefix normalization.",
        "Fast Build & Robust Quality: 87 test files (746 passing tests) with sub-2s Astro server production build.",
      ],
      ca: [
        "16 Sectors Macroeconòmics (2006–2026): 656 punts semestrals contrastats amb l'IBESTAT, INE, Seguretat Social, AENA, TIRME i SFM.",
        "Corba Indexada Base 100: Normalització temporal interactiva amb selector Base 2006 vs Base 2016 i càlcul de divergència.",
        "16 Monografies al Blog: Articles d'investigació amb gràfiques SVG dinàmiques i enllaços a serveis verificats.",
        "Seguretat de Dades i CSV: Descarregador segur contra injecció de fórmules i protecció de paràmetres d'URL.",
        "Floating WhatsApp CTA: Disseny adaptable en mòbil i normalització automàtica del prefix +34.",
        "Qualitat & Rendiment: 87 suites de test (746 tests) en verd i compilació en 1,6 s.",
      ],
      de: [
        "16 Branchen-Zeitreihen (2006–2026): 656 geprüfte Halbjahresdaten von IBESTAT, INE, Sozialversicherung, AENA, TIRME und SFM.",
        "Basis-100-Indexkurve: Interaktiver Wachstumsvergleich mit umschaltbarer Basis 2006/2016 und Schwebekreuz-Messung.",
        "16 Blog-Monografien: Fundierte Analysen mit responsiven SVG-Balkencharts und Verknüpfung zu verifizierten Betrieben.",
        "Datensicherheit & Formelschutz: Strenger RFC-4180-CSV-Export gegen Formelinjektionen in Tabellenkalkulationen.",
        "Floating WhatsApp CTA: Kompakter runder FAB-Button auf Smartphones und automatische spanische +34-Vorwahlnormalisierung.",
        "Spitzenleistung & Testabdeckung: 87 Testdateien (746 bestandene Tests) und Build in 1,6 Sekunden.",
      ],
    },
    entries: [
      {
        category: "FEATURE",
        title: {
          es: "Panel Admin 2.0: Motor de Verificación de Negocios y Triaje en 1-Clic",
          en: "Admin Control Center 2.0: Business Verification Engine & 1-Click Triage",
          ca: "Panell Admin 2.0: Motor de Verificació de Negocis i Triatge en 1-Clic",
          de: "Admin-Zentrale 2.0: Unternehmens-Verifizierungs-Engine & 1-Klick-Triage",
        },
        description: {
          es: "Activación del sistema de verificación oficial en tiempo real con persistencia en service_overrides, validación en 1-clic con asignación de 95% de confianza, panel de auditoría fiscal (CIF/NIF AEAT, prefijo balear y dominio corporativo) en la cola de reclamaciones, y buscador interactivo con toggle de verificación en el catálogo.",
          en: "Activation of the real-time official verification pipeline with service_overrides persistence, 1-click validation assigning 95% confidence score, fiscal audit breakdown (AEAT Tax ID, Balearic phone, corporate web domain) in claims moderation, and live search with verification toggles across the business catalog.",
          ca: "Activació del sistema de verificació oficial en temps real amb persistència a service_overrides, validació en 1-clic amb assignació del 95% de confiança, panell d'auditoria fiscal (CIF/NIF AEAT, telèfon balear i domini web corporatiu) a la cua de reclamacions, i cercador interactiu amb toggle de verificació al catàleg.",
          de: "Aktivierung der Echtzeit-Verifizierungs-Pipeline mit Persistenz in service_overrides, 1-Klick-Freigabe mit 95% Konfidenz-Score, steuerlicher Prüfbericht (AEAT-Steuernummer, Balearen-Telefon, Firmen-Webdomain) in der Reklamations-Queue sowie Live-Katalogsuche mit Direkt-Verifizierungs-Schaltern.",
        },
        badgeText: {
          es: "Admin & Verificación",
          en: "Admin & Verification",
          ca: "Admin i Verificació",
          de: "Admin & Verifizierung",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Observatorio Histórico de 20 Años (16 Sectores)",
          en: "20-Year Historical Sector Observatory (16 Sectors)",
          ca: "Observatori Històric de 20 Anys (16 Sectors)",
          de: "20-Jahre-Sektoren-Observatorium (16 Branchen)",
        },
        description: {
          es: "Incorporación de 16 sectores económicos con resolución semestral continua (2006-S1 a 2026-S1) abarcando vivienda, turismo, censo, empresas, tecnología ParcBit, TIB, sanidad y sostenibilidad.",
          en: "Addition of 16 economic sectors with continuous 6-month resolution (2006-H1 to 2026-H1) spanning housing, tourism, demographics, tech, rail, healthcare, and recycling.",
          ca: "Incorporació de 16 sectors econòmics amb resolució semestral contínua (2006-S1 a 2026-S1) que cobreixen habitatge, turisme, cens, empreses, ParcBit, TIB i sostenibilitat.",
          de: "Erweiterung auf 16 Branchen mit 6-monatiger Taktung von 2006 bis 2026: Immobilien, Tourismus, Betriebe, ParcBit-Tech, TIB-Bahn, Gesundheit und Recycling.",
        },
        badgeText: {
          es: "Observatorio Insular",
          en: "Island Observatory",
          ca: "Observatori Insular",
          de: "Insel-Observatorium",
        },
      },
      {
        category: "FEATURE",
        title: {
          es: "Comparador Cruzado con Curva Indexada Base 100",
          en: "Cross-Sector Comparator with Base 100 Curve",
          ca: "Comparador Creuat amb Corba Indexada Base 100",
          de: "Sektoren-Direktvergleich mit Basis-100-Indexkurve",
        },
        description: {
          es: "Herramienta analítica para contrastar dos sectores simultáneamente con curva normalizada en Base 100 (opción 2006 o 2016), crosshair interactivo, insights automatizados y descarga en CSV.",
          en: "Analytical tool comparing any two sectors side-by-side with normalized Base 100 trajectories (Base 2006 or 2016), interactive crosshairs, editorial insights, and CSV export.",
          ca: "Eina analítica per contrastar dos sectors de costat amb corba normalitzada Base 100 (2006 o 2016), crosshair interactiu i descàrrega CSV.",
          de: "Analysetool für direkten Sektorenvergleich mit normalisierter Basis-100-Indexkurve, Messpunktanzeige und CSV-Export.",
        },
        badgeText: {
          es: "Interactividad",
          en: "Interactivity",
          ca: "Interactivitat",
          de: "Interaktivität",
        },
      },
      {
        category: "FIX",
        title: {
          es: "Normalización de Prefijos WhatsApp y Optimización Móvil",
          en: "WhatsApp Prefix Normalization & Mobile Layout",
          ca: "Normalització de Prefixos WhatsApp i Optimització Mòbil",
          de: "WhatsApp-Vorwahlnormalisierung & Mobil-Optimierung",
        },
        description: {
          es: "Detección inteligente de teléfonos locales de 9 dígitos para anteponer el código 34 de España en enlaces wa.me/ y transformación a FAB circular en pantallas móviles.",
          en: "Intelligent detection of 9-digit Spanish phone numbers prepending 34 for wa.me/ links, plus conversion to a compact circular FAB on mobile viewports.",
          ca: "Detecció intel·ligent de telèfons de 9 dígits amb prefix 34 per a wa.me/ i transformació a botó flotant circular en mòbil.",
          de: "Automatische spanische +34-Vorwahlkorrektur für wa.me/-Links und platzsparender runder FAB-Button auf Mobilgeräten.",
        },
        badgeText: {
          es: "UX & Conversión",
          en: "UX & Conversion",
          ca: "UX & Conversió",
          de: "UX & Konvertierung",
        },
      },
    ],
  },
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
