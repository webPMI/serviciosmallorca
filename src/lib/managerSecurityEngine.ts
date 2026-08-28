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
 * Incluye comprobación recursiva de subdominios.
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim() || "";
  if (!domain) return true;

  const disposableDomains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "sharklasers.com",
    "throwawaymail.com",
    "yopmail.com",
    "trashmail.com",
  ];

  return disposableDomains.some((d) => domain === d || domain.endsWith(`.${d}`));
}

/**
 * Comprueba si el dominio del correo coincide con la web oficial del negocio.
 * Soporta subdominios legítimos corporativos (ej. reservas@staff.restaurante.com).
 */
export function isMatchingCorporateDomain(email: string, businessWebsite: string): boolean {
  if (!email || !businessWebsite) return false;
  try {
    const emailDomain = email
      .split("@")[1]
      ?.toLowerCase()
      .trim()
      .replace(/^www\./, "");
    const parsedUrl = new URL(businessWebsite.startsWith("http") ? businessWebsite : `https://${businessWebsite}`);
    const webDomain = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");

    if (!emailDomain || !webDomain) return false;

    return emailDomain === webDomain || emailDomain.endsWith(`.${webDomain}`) || webDomain.endsWith(`.${emailDomain}`);
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

/**
 * Sanitiza texto de entrada de usuario contra vectores XSS, inyección HTML,
 * caracteres de control y caracteres Unicode invisibles / homóglifos.
 */
export function sanitizeUserInput(input: string, maxLength: number = 2000): string {
  if (typeof input !== "string") return "";

  let sanitized = input
    // 1. Eliminar caracteres de control y formatos invisibles (Zero-Width Space, RTL override)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\uFEFF]/g, "")
    // 2. Escapar etiquetas HTML esenciales
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  // 3. Truncar a longitud máxima segura
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized.trim();
}

/**
 * Valida URLs para evitar Open Redirects y ataques SSRF.
 * Solo permite protocolos seguros (https:) y rechaza javascript:, data:, file:, etc.
 */
export function validateSafeRedirectUrl(
  url: string,
  allowedHosts: string[] = ["serviciosmallorca.com", "localhost"],
): boolean {
  if (!url || typeof url !== "string") return false;
  const clean = url.trim();

  // Rechazar esquemas peligrosos
  const dangerousSchemes = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousSchemes.test(clean)) return false;

  // Rutas relativas seguras
  if (clean.startsWith("/") && !clean.startsWith("//") && !clean.startsWith("/\\")) {
    return true;
  }

  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }

    // Comprobar IPs internas / SSRF (169.254.x.x, 127.0.0.1, 0.0.0.0, 10.x.x.x, 192.168.x.x)
    const hostname = parsed.hostname.toLowerCase();
    const isInternalIp =
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.startsWith("169.254.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.");

    if (isInternalIp && !allowedHosts.includes(hostname) && !allowedHosts.includes("localhost")) {
      return false;
    }

    return allowedHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

// Memoria volátil para control de tasa (Rate Limiter en memoria)
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Control de tasa para evitar ataques de fuerza bruta y bombardeo de peticiones.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000,
  now: number = Date.now(),
): { allowed: boolean; remaining: number; resetMs: number } {
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetMs: windowMs };
  }

  if (bucket.count < maxRequests) {
    bucket.count += 1;
    return { allowed: true, remaining: maxRequests - bucket.count, resetMs: bucket.resetAt - now };
  }

  return { allowed: false, remaining: 0, resetMs: bucket.resetAt - now };
}

export function resetRateLimitBuckets(): void {
  rateLimitBuckets.clear();
}

/**
 * Valida la seguridad y legitimidad de una reseña comunitaria.
 */
export function validateReviewSecurity(review: {
  text: string;
  rating: number;
  authorUid?: string;
  businessId?: string;
}): { safe: boolean; reason?: string } {
  if (!review.authorUid || review.authorUid.trim().length < 3) {
    return { safe: false, reason: "El autor de la reseña debe estar autenticado." };
  }

  if (!review.businessId || review.businessId.trim().length < 2) {
    return { safe: false, reason: "ID de negocio no especificado o inválido." };
  }

  if (typeof review.rating !== "number" || isNaN(review.rating) || !isFinite(review.rating)) {
    return { safe: false, reason: "La puntuación debe ser un número válido." };
  }

  if (review.rating < 1 || review.rating > 5 || !Number.isInteger(review.rating)) {
    return { safe: false, reason: "La puntuación debe ser un entero entre 1 y 5 estrellas." };
  }

  if (!review.text || review.text.trim().length < 5) {
    return { safe: false, reason: "El contenido de la reseña debe tener al menos 5 caracteres." };
  }

  if (review.text.length > 3000) {
    return { safe: false, reason: "El contenido de la reseña excede el límite máximo de 3000 caracteres." };
  }

  // Detectar enlaces de spam masivo o URLs sospechosas
  const urlCount = (review.text.match(/https?:\/\//gi) || []).length;
  if (urlCount > 2) {
    return { safe: false, reason: "No se permiten más de 2 enlaces externos en una reseña comunitaria." };
  }

  return { safe: true };
}
