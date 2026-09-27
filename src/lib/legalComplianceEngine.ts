/**
 * legalComplianceEngine.ts
 *
 * ⚖️ MOTOR DE CUMPLIMIENTO LEGAL, VERSIONADO DE TÉRMINOS Y AUDITORÍA DE CONSENTIMIENTO (2026)
 *
 * Marco Normativo Aplicado:
 *  - RGPD / GDPR (Reglamento UE 2016/679) - Arts. 6, 7 (Consentimiento demostrable) y 13/14.
 *  - LOPD-GDD (Ley Orgánica 3/2018) - Protección de Datos Personales y garantía de derechos digitales en España.
 *  - LSSI-CE (Ley 34/2002) - Arts. 10 (Aviso Legal), 21/22 (Cookies) y 27/28 (Contratación Electrónica).
 *  - LGDCU (Real Decreto Legislativo 1/2007) - Arts. 97 (Info precontractual) y 103 (Excepciones desistimiento).
 *  - DSA (Reglamento UE 2022/2065) - Ley de Servicios Digitales para plataformas y directorios.
 */

export const CURRENT_LEGAL_VERSION = "2026.2";
export const LEGAL_POLICIES_LAST_UPDATED = "2026-09-27";
export const LEGAL_CONTACT_EMAIL = "legal@serviciosmallorca.com";

export type LegalPolicyType = "terms" | "privacy" | "cookies" | "digital_withdrawal";

export interface LegalConsentRecord {
  userId: string;
  version: string;
  acceptedAt: string; // ISO 8601
  policies: LegalPolicyType[];
  source: "registration" | "checkout" | "terms_update_modal" | "profile" | "guest_checkout";
  ipAddress?: string;
  userAgent?: string;
}

export interface CookieConsentPreferences {
  version: string;
  acceptedAt: string;
  necessary: boolean; // Always true
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
}

export interface LegalVersionChangeSummary {
  version: string;
  date: string;
  title: Record<string, string>;
  changes: Record<string, string[]>;
}

export const LEGAL_VERSION_CHANGES: LegalVersionChangeSummary = {
  version: CURRENT_LEGAL_VERSION,
  date: LEGAL_POLICIES_LAST_UPDATED,
  title: {
    es: "Actualización de Términos de Servicio, Pasarela de Pagos y Protección RGPD (v2026.2)",
    en: "Terms of Service, Payment Gateway & GDPR Compliance Update (v2026.2)",
    ca: "Actualització de Termes de Servei, Passarel·la de Pagaments i Protecció RGPD (v2026.2)",
    de: "Aktualisierung der Nutzungsbedingungen, Zahlungs-Gateway & DSGVO (v2026.2)",
  },
  changes: {
    es: [
      "Transparencia en Facturación e Impuestos: Incorporación del desglose fiscal oficial del 21% de IVA en todas las aportaciones comunitarias y pujas de titular.",
      "Derecho de Desistimiento y Servicios Digitales: Información precontractual expresa y renuncia de conformidad con el Art. 103 de la LGDCU para servicios digitales de activación inmediata.",
      "Blindaje Anti-Riesgo Financiero: Protocolos de idempotencia, prevención de duplicados y cancelación transparente a coste 0,00€ con auditoría en el perfil del usuario.",
      "Consentimiento Demostrable RGPD: Registro unificado e inmutable de aceptaciones legales con almacenamiento privado y posibilidad de revocación.",
    ],
    en: [
      "Tax & Billing Transparency: Incorporation of official 21% VAT breakdown on all community boosts and owner bids.",
      "Right of Withdrawal & Digital Services: Explicit pre-contractual notice and waiver under EU Consumer Directive / Art. 103 LGDCU for instant-activation digital goods.",
      "Financial Risk Shield: Idempotency protocols, duplicate payment prevention, and 0.00€ fee-free cancellation tracking in user profile.",
      "Verifiable GDPR Consent: Unified and immutable legal acceptance ledger with private storage and revocation rights.",
    ],
    ca: [
      "Transparència en Facturació i Impostos: Incorporació del desglossament fiscal oficial del 21% d'IVA en totes les aportacions i licitacions.",
      "Dret de Desistiment i Serveis Digitals: Informació precontractual expressa i renúncia segons l'Art. 103 de la LGDCU per a serveis d'activació immediata.",
      "Blindatge Anti-Risc Financer: Protocols d'idempotència, prevenció de duplicats i cancel·lació transparent a cost 0,00€ amb auditoria al perfil.",
      "Consentiment Demostrable RGPD: Registre unificat i immutable d'acceptacions legals amb emmagatzematge privat.",
    ],
    de: [
      "Steuer- und Rechnungstransparenz: 21% MwSt.-Aufschlüsselung bei allen Community-Förderungen und Bieterverfahren.",
      "Widerrufsrecht bei digitalen Dienstleistungen: Vorvertragliche Belehrung und Verzichtserklärung nach EU-Verbraucherrichtlinie für Sofort-Services.",
      "Finanzrisikoschutz: Idempotenz, Schutz vor Doppelabbuchungen und kostenfreie Storno-Verfolgung (0,00€) im Benutzerprofil.",
      "Nachweisbare DSGVO-Einwilligung: Einheitliche und unveränderliche Protokollierung mit privaten Speicherrechten.",
    ],
  },
};

/**
 * Comprueba si un registro de consentimiento corresponde a la versión legal vigente.
 */
export function hasAcceptedCurrentLegalTerms(consent: LegalConsentRecord | null | undefined): boolean {
  if (!consent || !consent.version) return false;
  return consent.version === CURRENT_LEGAL_VERSION;
}

/**
 * Comprueba en localStorage si el usuario ha aceptado la versión legal vigente.
 */
export function hasUserAcceptedCurrentTerms(userId: string): boolean {
  if (typeof window === "undefined" || !userId) return false;
  try {
    const raw = localStorage.getItem(`sm_legal_consent_${userId}`);
    if (!raw) return false;
    const record: LegalConsentRecord = JSON.parse(raw);
    return hasAcceptedCurrentLegalTerms(record);
  } catch (_) {
    return false;
  }
}

/**
 * Registra y persiste la aceptación de los términos y políticas legales por parte de un usuario.
 */
export function recordUserLegalConsent(
  userId: string,
  source: LegalConsentRecord["source"],
  policies: LegalPolicyType[] = ["terms", "privacy", "cookies"],
  extra?: { ipAddress?: string; userAgent?: string },
): LegalConsentRecord {
  const record: LegalConsentRecord = {
    userId: userId || "guest_anonymous",
    version: CURRENT_LEGAL_VERSION,
    acceptedAt: new Date().toISOString(),
    policies,
    source,
    ipAddress: extra?.ipAddress,
    userAgent: extra?.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : undefined),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`sm_legal_consent_${record.userId}`, JSON.stringify(record));
      // También guardar la versión globalmente aceptada para comprobación rápida en sesión
      localStorage.setItem("sm_latest_accepted_legal_version", CURRENT_LEGAL_VERSION);
    } catch (e) {
      console.warn("[LegalEngine] No se pudo guardar el consentimiento:", e);
    }
  }

  return record;
}

/**
 * Obtiene el registro de consentimiento del usuario.
 */
export function getUserLegalConsent(userId: string): LegalConsentRecord | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = localStorage.getItem(`sm_legal_consent_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

/**
 * Valida los consentimientos obligatorios antes de procesar un pago (LSSI + LGDCU Art. 103).
 */
export function validateCheckoutLegalConsent(
  termsAccepted: boolean,
  digitalWithdrawalWaived: boolean,
): { isValid: boolean; errorMessage?: string } {
  if (!termsAccepted) {
    return {
      isValid: false,
      errorMessage:
        "Debes leer y aceptar los Términos de Servicio y la Política de Privacidad de Servicios Mallorca antes de continuar.",
    };
  }

  if (!digitalWithdrawalWaived) {
    return {
      isValid: false,
      errorMessage:
        "De conformidad con el Art. 103 de la Ley General para la Defensa de los Consumidores y Usuarios, debes consentir expresamente el inicio inmediato del servicio digital y la pérdida del derecho de desistimiento tras su activación.",
    };
  }

  return { isValid: true };
}

/**
 * Genera un certificado de auditoría de consentimiento legible para inspecciones de la AEPD.
 */
export function generateConsentAuditCertificate(consent: LegalConsentRecord): string {
  const policiesList = consent.policies.join(", ");
  return [
    `=============================================================`,
    `CERTIFICADO DE CONSENTIMIENTO RGPD Y ACEPTACIÓN LEGAL (ESPAÑA)`,
    `=============================================================`,
    `Plataforma:           Servicios Mallorca (serviciosmallorca.com)`,
    `ID Usuario / Titular: ${consent.userId}`,
    `Versión de Términos:  ${consent.version}`,
    `Fecha y Hora (UTC):   ${consent.acceptedAt}`,
    `Políticas Aceptadas:  ${policiesList}`,
    `Canal de Aceptación:  ${consent.source}`,
    `Navegador / Dispositivo: ${consent.userAgent || "No registrado"}`,
    `Responsable de Datos: Servicios Mallorca (legal@serviciosmallorca.com)`,
    `Garantía de Derechos: Acceso, Rectificación, Supresión y Oposición (LOPD-GDD)`,
    `=============================================================`,
  ].join("\n");
}

/**
 * Gestión de preferencias de cookies conforme a la guía de la AEPD.
 */
export const DEFAULT_COOKIE_PREFERENCES: CookieConsentPreferences = {
  version: CURRENT_LEGAL_VERSION,
  acceptedAt: new Date().toISOString(),
  necessary: true,
  analytics: false,
  personalization: false,
  marketing: false,
};

export function getStoredCookiePreferences(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("sm_cookie_preferences_v2");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function saveCookiePreferences(prefs: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  const finalPrefs: CookieConsentPreferences = {
    version: CURRENT_LEGAL_VERSION,
    acceptedAt: new Date().toISOString(),
    necessary: true, // Técnicas siempre obligatorias
    analytics: Boolean(prefs.analytics),
    personalization: Boolean(prefs.personalization),
    marketing: Boolean(prefs.marketing),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("sm_cookie_preferences_v2", JSON.stringify(finalPrefs));
    } catch (_) {}
  }

  return finalPrefs;
}
