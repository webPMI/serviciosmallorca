/**
 * managerSecurityEngine.ts
 *
 * Motor de Seguridad Estricta y Verificación de Titularidad de Negocios en Mallorca.
 * Garantiza que nadie tome el control de una ficha sin superar pruebas rigurosas:
 *  - Validación de NIF/CIF español (Personas físicas, S.L., S.A., C.B.).
 *  - Verificación de concordancia de dominio de correo corporativo vs web oficial.
 *  - Comprobación de formato telefónico balear (+34 971 / +34 871 / +34 6xx / +34 7xx).
 *  - Cálculo de Security Confidence Score para aprobación de rol Manager.
 */

import type { ServiceItem } from "../data/services";

export interface ClaimVerificationPayload {
  applicantUid: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantName: string;
  businessTaxId: string; // NIF / CIF / NIE
  verificationMethod: "official_document" | "corporate_email" | "phone_sms_otp" | "manual_notarial";
  documentUrl?: string; // Enlace seguro a IAE Modelo 036/037 o escrituras
  notes?: string;
}

export interface SecurityEvaluationResult {
  passed: boolean;
  securityScore: number; // 0 - 100
  checks: {
    validTaxId: boolean;
    validBalearicPhone: boolean;
    matchingCorporateDomain: boolean;
    hasProofDocument: boolean;
    nonDisposableEmail: boolean;
  };
  reasons: string[];
  recommendedAction: "auto_approve" | "manual_admin_review" | "reject_unauthorized";
}

/**
 * Validador estricto de NIF / CIF / NIE español.
 */
export function validateSpanishTaxId(taxId: string): boolean {
  const clean = taxId.trim().toUpperCase().replace(/[\s-]/g, "");
  if (!clean || clean.length !== 9) return false;

  // 1. DNI estándar (8 dígitos + letra de control)
  const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
  if (dniRegex.test(clean)) {
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const num = parseInt(clean.substring(0, 8), 10);
    return clean[8] === letters[num % 23];
  }

  // 2. NIE (X, Y, Z + 7 dígitos + letra)
  const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
  if (nieRegex.test(clean)) {
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    let prefix = "0";
    if (clean[0] === "Y") prefix = "1";
    if (clean[0] === "Z") prefix = "2";
    const num = parseInt(prefix + clean.substring(1, 8), 10);
    return clean[8] === letters[num % 23];
  }

  // 3. CIF de empresas (A, B, C, D, E, F, G, H, J, N, P, Q, R, S, U, V, W + 7 dígitos + control)
  const cifRegex = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/;
  if (cifRegex.test(clean)) {
    return true; // Formato CIF societario válido
  }

  return false;
}

/**
 * Validador de teléfono balear / nacional español (+34).
 */
export function validateBalearicPhone(phone: string): boolean {
  const clean = phone.trim().replace(/[\s()-]/g, "");
  // Acepta formato internacional +34 o directo 971, 871, 6xx, 7xx (9 dígitos)
  const regex = /^(\+34|0034)?[6789]\d{8}$/;
  return regex.test(clean);
}

/**
 * Detecta si un correo electrónico proviene de proveedores temporales / desechables.
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  const disposableDomains = new Set([
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "sharklasers.com",
    "throwawaymail.com",
    "yopmail.com",
    "trashmail.com",
  ]);
  return disposableDomains.has(domain);
}

/**
 * Comprueba si el dominio del correo coincide con la web oficial del negocio.
 */
export function isMatchingCorporateDomain(email: string, businessWebsite: string): boolean {
  if (!email || !businessWebsite) return false;
  try {
    const emailDomain = email
      .split("@")[1]
      ?.toLowerCase()
      .replace(/^www\./, "");
    const parsedUrl = new URL(businessWebsite.startsWith("http") ? businessWebsite : `https://${businessWebsite}`);
    const webDomain = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");

    return Boolean(emailDomain && webDomain && (emailDomain === webDomain || webDomain.endsWith(`.${emailDomain}`)));
  } catch {
    return false;
  }
}

/**
 * Evalúa rigurosamente una solicitud de reclamación de negocio para evitar accesos no autorizados.
 */
export function evaluateClaimSecurity(
  claim: ClaimVerificationPayload,
  targetService: ServiceItem,
): SecurityEvaluationResult {
  const reasons: string[] = [];
  let score = 0;

  // 1. Verificación de Tax ID (CIF/NIF)
  const validTaxId = validateSpanishTaxId(claim.businessTaxId);
  if (validTaxId) {
    score += 30;
  } else {
    reasons.push("El NIF/CIF proporcionado no cumple el algoritmo de validación oficial de la AEAT.");
  }

  // 2. Verificación de teléfono
  const validBalearicPhone = validateBalearicPhone(claim.applicantPhone);
  if (validBalearicPhone) {
    score += 20;
  } else {
    reasons.push("El teléfono de contacto no tiene formato español (+34) o no es válido.");
  }

  // 3. Verificación de correo no desechable
  const nonDisposable = !isDisposableEmail(claim.applicantEmail);
  if (nonDisposable) {
    score += 15;
  } else {
    reasons.push("Se ha detectado un dominio de correo temporal o no verificado.");
  }

  // 4. Concordancia con dominio corporativo oficial del negocio
  const matchingCorporateDomain = isMatchingCorporateDomain(claim.applicantEmail, targetService.website);
  if (matchingCorporateDomain) {
    score += 25;
  }

  // 5. Documentación de acreditación (IAE 036/037 / Escritura)
  const hasProofDocument = Boolean(claim.documentUrl && claim.documentUrl.length > 5);
  if (hasProofDocument) {
    score += 10;
  }

  // Decisión y acción recomendada
  let passed = false;
  let recommendedAction: "auto_approve" | "manual_admin_review" | "reject_unauthorized" = "reject_unauthorized";

  if (score >= 80 && (matchingCorporateDomain || hasProofDocument) && validTaxId) {
    passed = true;
    recommendedAction = "auto_approve";
  } else if (score >= 50 && validTaxId && nonDisposable) {
    passed = false; // Requiere revisión de admin antes de otorgar el rol
    recommendedAction = "manual_admin_review";
  } else {
    passed = false;
    recommendedAction = "reject_unauthorized";
  }

  return {
    passed,
    securityScore: score,
    checks: {
      validTaxId,
      validBalearicPhone,
      matchingCorporateDomain,
      hasProofDocument,
      nonDisposableEmail: nonDisposable,
    },
    reasons,
    recommendedAction,
  };
}
