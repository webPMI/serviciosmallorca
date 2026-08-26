/**
 * src/lib/verificationPipeline.ts
 *
 * 🛡️ HUB DE VERIFICACIÓN CENTRALIZADO (v2.0)
 *
 * Pipeline unificado de 3 fases estancas para el sistema de curación:
 *
 *   FASE 1 — Calidad Visual: Filtra Imgur, stock, dummy, banners genéricos.
 *   FASE 2 — Triangulación: Cruza teléfono de web / Maps / social. Penaliza discrepancias.
 *   FASE 3 — Detección de Riesgos: Negocios cerrados, sin web, sin reseñas.
 *
 * Una vez que las 3 fases concluyen, se delega el cálculo del confidenceScore
 * final a `auditBusinessData()` en verificationEngine.ts.
 *
 * El pipeline devuelve `{ report, passed, failureTrace? }`.
 * `passed` es true SÓLO si `confidenceScore >= VERIFICATION_GATE`.
 *
 * Uso desde scripts/curate-business.ts:
 *   const result = await runVerificationPipeline(rawData);
 *   if (!result.passed) throw new Error(result.failureTrace?.reason);
 *
 * GR-11 Zero Fake Data: ningún dato se inventa — el score refleja sólo lo que se puede verificar.
 */

import {
  auditBusinessData,
  validateImageQuality,
  type VerificationInput,
  type VerificationReport,
} from "./verificationEngine.ts";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CONSTANTES                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

/** Umbral mínimo de confianza para publicar un negocio (configurable en un solo lugar). */
export const VERIFICATION_GATE = 80;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TIPOS PÚBLICOS                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Datos brutos tal como salen del orquestador scraper.
 * NO se asume veracidad en ningún campo.
 */
export interface RawBusinessData {
  name: string;
  category: string;
  zone?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  website?: string;
  phone?: string;
  whatsapp?: string;
  extractedWebPhone?: string;
  extractedMapsPhone?: string;
  extractedSocialPhone?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
  };
  rating?: number;
  reviewCount?: number;
  images?: string[];
  webHttpStatus?: number;
  webAccessibility?: "active" | "not_found" | "server_error" | "timeout" | "error";
  /** Timestamp ISO de cuándo se extrajo este bloque de datos brutos. */
  extractionTimestamp: string;
}

/**
 * Trazabilidad del fallo: en qué fase falló el pipeline y por qué.
 * Permite auditar cualquier negocio rechazado sin releer el código.
 */
export interface FailureTrace {
  phase: "visual_quality" | "triangulation" | "risk_detection" | "verification_gate";
  reason: string;
  /** Dato concreto que causó el fallo (ej: URL bloqueada, score obtenido). */
  data?: unknown;
}

/** Resultado completo del pipeline. */
export interface PipelineResult {
  /** El reporte de verificación completo con el confidenceScore. */
  report: VerificationReport;
  /** true si el score supera VERIFICATION_GATE y el negocio puede ser publicado. */
  passed: boolean;
  /** Sólo presente cuando `passed === false`. */
  failureTrace?: FailureTrace;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FASE 1 — CALIDAD VISUAL                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Dominio de Imgur explícitamente bloqueado (GR-11: Zero Fake Data + política de imágenes).
 */
const BLOCKED_IMAGE_DOMAINS = ["i.imgur.com", "imgur.com"];

interface VisualQualityResult {
  passed: boolean;
  approvedImages: string[];
  rejectedImages: Array<{ url: string; reason: string }>;
  failureTrace?: FailureTrace;
}

/**
 * FASE 1: Valida todas las imágenes del negocio.
 * Rechaza Imgur, stock, placeholders y dominios bloqueados.
 * No falla el pipeline si hay algunas imágenes rechazadas, sólo filtra.
 * Falla SÓLO si no queda ninguna imagen válida Y hay imágenes proporcionadas.
 */
export function checkVisualQuality(images: string[]): VisualQualityResult {
  const approvedImages: string[] = [];
  const rejectedImages: Array<{ url: string; reason: string }> = [];

  for (const url of images) {
    // Bloqueo explícito de Imgur
    if (BLOCKED_IMAGE_DOMAINS.some((d) => url.includes(d))) {
      rejectedImages.push({ url, reason: "Dominio Imgur bloqueado por política Zero Fake Data." });
      continue;
    }

    const qCheck = validateImageQuality(url);
    if (!qCheck.isValid) {
      rejectedImages.push({ url, reason: qCheck.reason ?? "Imagen no válida." });
    } else {
      approvedImages.push(url);
    }
  }

  return { passed: true, approvedImages, rejectedImages };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FASE 2 — TRIANGULACIÓN DE DATOS DE CONTACTO                              */
/* ─────────────────────────────────────────────────────────────────────────── */

interface TriangulationResult {
  passed: boolean;
  hasCriticalMismatch: boolean;
  details: string[];
  failureTrace?: FailureTrace;
}

/**
 * Normaliza un teléfono a 9 dígitos sin prefijo +34 para comparación.
 */
function normalizePhone(raw?: string): string {
  if (!raw) return "";
  let cleaned = raw.replace(/[^\d]/g, "");
  if (cleaned.startsWith("0034")) cleaned = cleaned.slice(4);
  else if (cleaned.startsWith("34") && cleaned.length > 9) cleaned = cleaned.slice(2);
  return cleaned.slice(-9);
}

/**
 * FASE 2: Triangula teléfono de web, Maps y social.
 * Marca discrepancia crítica si dos fuentes activas difieren.
 * No bloquea el pipeline — sólo informa al scoring engine.
 */
export function triangulateContacts(raw: RawBusinessData): TriangulationResult {
  const webPhone = normalizePhone(raw.extractedWebPhone ?? raw.phone);
  const mapsPhone = normalizePhone(raw.extractedMapsPhone);
  const socialPhone = normalizePhone(raw.extractedSocialPhone);

  const details: string[] = [];
  let hasCriticalMismatch = false;

  // Discrepancia entre Web y Maps (dos fuentes oficiales)
  if (webPhone && mapsPhone && webPhone !== mapsPhone) {
    hasCriticalMismatch = true;
    details.push(
      `🚩 Discrepancia Crítica: Teléfono web (${webPhone}) ≠ Teléfono Maps (${mapsPhone}). Requiere revisión manual.`,
    );
  }

  // Discrepancia entre Web y Social
  if (webPhone && socialPhone && webPhone !== socialPhone) {
    hasCriticalMismatch = true;
    details.push(
      `🚩 Discrepancia Crítica: Teléfono web (${webPhone}) ≠ Teléfono social (${socialPhone}). Requiere revisión manual.`,
    );
  }

  if (!hasCriticalMismatch && (webPhone || mapsPhone || socialPhone)) {
    details.push("✅ Datos de contacto consistentes entre fuentes.");
  }

  if (!webPhone && !mapsPhone && !socialPhone) {
    details.push("⚠️ No se detectó teléfono en ninguna fuente.");
  }

  return { passed: true, hasCriticalMismatch, details };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FASE 3 — DETECCIÓN DE RIESGOS                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

interface RiskDetectionResult {
  passed: boolean;
  risks: string[];
  failureTrace?: FailureTrace;
}

/**
 * FASE 3: Detecta señales de riesgo que hacen que el negocio sea rechazado o marcado.
 * Un negocio con web 404, sin teléfono Y sin rating es rechazado directamente.
 */
export function detectRisks(raw: RawBusinessData): RiskDetectionResult {
  const risks: string[] = [];

  // Riesgo bloqueante: web offline + sin teléfono
  if (raw.webAccessibility === "not_found" || raw.webHttpStatus === 404) {
    risks.push("🔴 Web oficial devuelve 404 — el negocio puede estar cerrado o la URL ha cambiado.");
  }

  if (!raw.phone && !raw.whatsapp && !raw.extractedWebPhone) {
    risks.push("🔴 Sin teléfono de contacto en ninguna fuente.");
  }

  if (!raw.address && !raw.coordinates) {
    risks.push("🔴 Sin dirección ni coordenadas GPS.");
  }

  // Riesgo informativo (no bloqueante)
  if (!raw.rating && !raw.reviewCount) {
    risks.push("⚠️ Sin datos de reputación pública (rating / reseñas).");
  }

  if (!raw.website) {
    risks.push("⚠️ Sin web oficial indexada.");
  }

  // Bloqueo fuerte: sin web + sin teléfono + sin dirección = negocio fantasma
  const isGhostBusiness = !raw.website && !raw.phone && !raw.address;
  if (isGhostBusiness) {
    return {
      passed: false,
      risks,
      failureTrace: {
        phase: "risk_detection",
        reason: "Negocio fantasma: sin web, sin teléfono y sin dirección verificables.",
        data: { name: raw.name, category: raw.category },
      },
    };
  }

  return { passed: true, risks };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FUNCIÓN CENTRAL: runVerificationPipeline()                               */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Ejecuta el pipeline completo de verificación sobre datos brutos extraídos por el scraper.
 *
 * Fases en orden:
 *  1. checkVisualQuality()    — filtra imágenes no válidas
 *  2. triangulateContacts()   — cruza teléfonos entre fuentes
 *  3. detectRisks()           — bloquea negocios fantasma o cerrados
 *  4. auditBusinessData()     — calcula confidenceScore determinista
 *  5. GATE: score ≥ VERIFICATION_GATE (80) → passed = true
 *
 * @param raw - Datos brutos del scraper (RawBusinessData)
 * @returns PipelineResult con el report, passed y failureTrace si aplica
 */
export function runVerificationPipeline(raw: RawBusinessData): PipelineResult {
  // ── FASE 1: Calidad Visual ──────────────────────────────────────────────
  const visualResult = checkVisualQuality(raw.images ?? []);
  // La fase visual nunca bloquea el pipeline sola, sólo filtra imágenes.

  // ── FASE 2: Triangulación de Contactos ─────────────────────────────────
  const triangulationResult = triangulateContacts(raw);

  // ── FASE 3: Detección de Riesgos ───────────────────────────────────────
  const riskResult = detectRisks(raw);
  if (!riskResult.passed && riskResult.failureTrace) {
    // Negocio fantasma u offline grave: construir VerificationReport mínimo y rechazar
    const minimalReport = auditBusinessData(buildVerificationInput(raw));
    return {
      report: minimalReport,
      passed: false,
      failureTrace: riskResult.failureTrace,
    };
  }

  // ── FASE 4: Motor de Confidence Score (única fuente de verdad) ──────────
  const verificationInput = buildVerificationInput(raw);
  const report = auditBusinessData(verificationInput);

  // ── GATE: umbral mínimo de publicación ─────────────────────────────────
  if (report.confidenceScore < VERIFICATION_GATE) {
    return {
      report,
      passed: false,
      failureTrace: {
        phase: "verification_gate",
        reason: `Score ${report.confidenceScore}/100 es inferior al umbral mínimo de publicación (${VERIFICATION_GATE}).`,
        data: {
          score: report.confidenceScore,
          gate: VERIFICATION_GATE,
          warnings: report.warnings,
          visualRejections: visualResult.rejectedImages.length,
          triangulationIssues: triangulationResult.details.filter((d) => d.startsWith("🚩")),
          risks: riskResult.risks,
        },
      },
    };
  }

  return { report, passed: true };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HELPERS INTERNOS                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */

function buildVerificationInput(raw: RawBusinessData): VerificationInput {
  return {
    name: raw.name,
    category: raw.category,
    zone: raw.zone ?? "palma",
    address: raw.address ?? "",
    coordinates: raw.coordinates,
    website: raw.website,
    phone: raw.phone,
    extractedWebPhone: raw.extractedWebPhone ?? raw.phone,
    extractedMapsPhone: raw.extractedMapsPhone,
    extractedSocialPhone: raw.extractedSocialPhone,
    whatsapp: raw.whatsapp,
    socialLinks: raw.socialLinks,
    reviewCount: raw.reviewCount,
    rating: raw.rating,
    webHttpStatus: raw.webHttpStatus,
    webAccessibility: raw.webAccessibility,
  };
}
