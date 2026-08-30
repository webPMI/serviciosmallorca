/**
 * communityVoiceEngine.ts
 *
 * Motor de Gestión, Validación y Triage del Buzón Ciudadano y Feedback de la Comunidad.
 * Cumple con GR-03 (TypeScript estricto), GR-11 (Zero Fake Data) y GR-13 (Seguridad y Privacidad).
 */

export type FeedbackType = "GOOD_NEWS" | "CORRECTION" | "SUGGESTION" | "BUG_REPORT";

export type FeedbackStatus = "PENDING" | "AI_AUDITED" | "APPROVED" | "RESOLVED" | "REJECTED";

export interface FeedbackSubmissionPayload {
  type: FeedbackType;
  title: string;
  description: string;
  authorName?: string;
  authorEmail?: string;
  targetServiceSlug?: string;
  targetServiceName?: string;
  zone?: string;
  honeypot?: string;
}

export interface FeedbackRecord {
  id: string;
  type: FeedbackType;
  title: string;
  description: string;
  authorName: string;
  authorEmail: string;
  targetServiceSlug: string | null;
  targetServiceName: string | null;
  zone: string | null;
  status: FeedbackStatus;
  createdAt: string; // ISO 8601
  ipHash: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized?: FeedbackSubmissionPayload;
}

/**
 * Lista de términos spam o patrones abusivos prohibidos.
 */
const SPAM_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /onclick=/gi,
  /onerror=/gi,
  /\b(viagra|casino|cialis|crypto-giveaway|free-bitcoins)\b/i,
];

/**
 * Sanitiza una cadena de texto eliminando etiquetas peligrosas.
 */
export function sanitizeString(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // Eliminar caracteres de apertura/cierre de tags
    .trim();
}

/**
 * Valida y sanitiza una solicitud del Buzón Ciudadano.
 */
export function validateFeedbackSubmission(payload: Partial<FeedbackSubmissionPayload>): ValidationResult {
  const errors: string[] = [];

  // 1. Detección de Honeypot anti-bots
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    errors.push("SPAM_BOT_DETECTED");
    return { valid: false, errors };
  }

  // 2. Validación de Tipo
  const validTypes: FeedbackType[] = ["GOOD_NEWS", "CORRECTION", "SUGGESTION", "BUG_REPORT"];
  if (!payload.type || !validTypes.includes(payload.type)) {
    errors.push("INVALID_FEEDBACK_TYPE");
  }

  // 3. Validación de Título
  const rawTitle = payload.title?.trim() || "";
  if (rawTitle.length < 5) {
    errors.push("TITLE_TOO_SHORT");
  } else if (rawTitle.length > 120) {
    errors.push("TITLE_TOO_LONG");
  }

  // 4. Validación de Descripción
  const rawDesc = payload.description?.trim() || "";
  if (rawDesc.length < 15) {
    errors.push("DESCRIPTION_TOO_SHORT");
  } else if (rawDesc.length > 2000) {
    errors.push("DESCRIPTION_TOO_LONG");
  }

  // 5. Detección de Patrones de Spam
  const combinedText = `${rawTitle} ${rawDesc}`;
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(combinedText)) {
      errors.push("MALICIOUS_CONTENT_DETECTED");
      break;
    }
  }

  // 6. Validación de Email (Opcional pero con formato si se proporciona)
  const rawEmail = payload.authorEmail?.trim() || "";
  if (rawEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail) || rawEmail.length > 150) {
      errors.push("INVALID_EMAIL_FORMAT");
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      type: payload.type as FeedbackType,
      title: sanitizeString(rawTitle),
      description: sanitizeString(rawDesc),
      authorName: payload.authorName ? sanitizeString(payload.authorName).slice(0, 80) : "Anónimo",
      authorEmail: rawEmail ? sanitizeString(rawEmail).toLowerCase() : "",
      targetServiceSlug: payload.targetServiceSlug ? sanitizeString(payload.targetServiceSlug) : undefined,
      targetServiceName: payload.targetServiceName
        ? sanitizeString(payload.targetServiceName).slice(0, 100)
        : undefined,
      zone: payload.zone ? sanitizeString(payload.zone) : undefined,
    },
  };
}

/**
 * Genera un ID único para el registro de feedback.
 */
export function generateFeedbackId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `fb_${timestamp}_${randomPart}`;
}
