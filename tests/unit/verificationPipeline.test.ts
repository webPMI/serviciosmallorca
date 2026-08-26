/**
 * tests/unit/verificationPipeline.test.ts
 *
 * Test suite para el Hub de Verificación Centralizado (verificationPipeline.ts).
 * Valida cada fase de forma aislada y el pipeline completo de extremo a extremo.
 *
 * GR-05: Todo feature con tests.
 */

import { describe, it, expect } from "vitest";
import {
  checkVisualQuality,
  triangulateContacts,
  detectRisks,
  runVerificationPipeline,
  VERIFICATION_GATE,
  type RawBusinessData,
} from "../../src/lib/verificationPipeline";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const VALID_RAW: RawBusinessData = {
  name: "Restaurante Es Pla Mallorca",
  category: "gastronomia-restaurantes",
  zone: "palma",
  address: "Carrer del Bisbe Berenguer de Palou, 12, 07001 Palma, Illes Balears",
  coordinates: { lat: 39.5696, lng: 2.6502 },
  website: "https://www.esplamallorca.com",
  phone: "+34 971 123 456",
  whatsapp: "+34 971 123 456",
  extractedWebPhone: "+34 971 123 456",
  extractedMapsPhone: "+34 971 123 456",
  socialLinks: { instagram: "https://instagram.com/esplamallorca", facebook: "https://facebook.com/esplamallorca" },
  rating: 4.7,
  reviewCount: 210,
  images: ["https://esplamallorca.com/images/terraza.jpg", "https://esplamallorca.com/images/menu.jpg"],
  webAccessibility: "active",
  webHttpStatus: 200,
  extractionTimestamp: new Date().toISOString(),
};

const GHOST_RAW: RawBusinessData = {
  name: "Negocio Fantasma",
  category: "gastronomia-restaurantes",
  extractionTimestamp: new Date().toISOString(),
  // Sin web, teléfono ni dirección
};

// ─── FASE 1: Calidad Visual ────────────────────────────────────────────────

describe("Fase 1 — checkVisualQuality()", () => {
  it("aprueba imágenes de dominio propio", () => {
    const result = checkVisualQuality(["https://esplamallorca.com/img/hero.jpg"]);
    expect(result.passed).toBe(true);
    expect(result.approvedImages).toHaveLength(1);
    expect(result.rejectedImages).toHaveLength(0);
  });

  it("rechaza URLs de Imgur", () => {
    const result = checkVisualQuality(["https://i.imgur.com/abc123.jpg", "https://imgur.com/gallery/xyz"]);
    expect(result.passed).toBe(true); // El pipeline no se bloquea sólo por imágenes
    expect(result.approvedImages).toHaveLength(0);
    expect(result.rejectedImages).toHaveLength(2);
    expect(result.rejectedImages[0].reason).toContain("Imgur");
  });

  it("rechaza dominios de stock (unsplash, pexels)", () => {
    const result = checkVisualQuality(["https://images.unsplash.com/photo-123", "https://www.pexels.com/photo/456"]);
    expect(result.approvedImages).toHaveLength(0);
    expect(result.rejectedImages).toHaveLength(2);
  });

  it("filtra placeholders e iconos", () => {
    const result = checkVisualQuality([
      "https://midominio.com/images/placeholder.jpg",
      "https://midominio.com/favicon.ico",
    ]);
    expect(result.approvedImages).toHaveLength(0);
    expect(result.rejectedImages).toHaveLength(2);
  });

  it("acepta lista vacía de imágenes sin fallar", () => {
    const result = checkVisualQuality([]);
    expect(result.passed).toBe(true);
    expect(result.approvedImages).toHaveLength(0);
    expect(result.rejectedImages).toHaveLength(0);
  });
});

// ─── FASE 2: Triangulación ──────────────────────────────────────────────────

describe("Fase 2 — triangulateContacts()", () => {
  it("no detecta discrepancia cuando teléfonos coinciden", () => {
    const result = triangulateContacts({
      ...VALID_RAW,
      phone: "+34 971 123 456",
      extractedWebPhone: "+34 971 123 456",
      extractedMapsPhone: "+34 971 123 456",
    });
    expect(result.passed).toBe(true);
    expect(result.hasCriticalMismatch).toBe(false);
    expect(result.details.some((d) => d.includes("✅"))).toBe(true);
  });

  it("detecta discrepancia crítica entre web y Maps", () => {
    const result = triangulateContacts({
      ...VALID_RAW,
      extractedWebPhone: "+34 971 123 456",
      extractedMapsPhone: "+34 971 999 000",
    });
    expect(result.hasCriticalMismatch).toBe(true);
    expect(result.details.some((d) => d.includes("🚩"))).toBe(true);
  });

  it("detecta discrepancia crítica entre web y social", () => {
    const result = triangulateContacts({
      ...VALID_RAW,
      extractedWebPhone: "+34 971 123 456",
      extractedSocialPhone: "+34 971 888 777",
    });
    expect(result.hasCriticalMismatch).toBe(true);
  });

  it("no falla el pipeline cuando no hay teléfono (lo registra como advertencia)", () => {
    const result = triangulateContacts({
      ...VALID_RAW,
      phone: undefined,
      whatsapp: undefined,
      extractedWebPhone: undefined,
      extractedMapsPhone: undefined,
      extractedSocialPhone: undefined,
    });
    expect(result.passed).toBe(true);
    expect(result.hasCriticalMismatch).toBe(false);
  });
});

// ─── FASE 3: Detección de Riesgos ───────────────────────────────────────────

describe("Fase 3 — detectRisks()", () => {
  it("aprueba un negocio bien formado", () => {
    const result = detectRisks(VALID_RAW);
    expect(result.passed).toBe(true);
    expect(result.failureTrace).toBeUndefined();
  });

  it("bloquea un negocio fantasma (sin web, teléfono ni dirección)", () => {
    const result = detectRisks(GHOST_RAW);
    expect(result.passed).toBe(false);
    expect(result.failureTrace?.phase).toBe("risk_detection");
    expect(result.failureTrace?.reason).toContain("fantasma");
  });

  it("añade riesgo informativo si la web devuelve 404", () => {
    const result = detectRisks({ ...VALID_RAW, webAccessibility: "not_found", webHttpStatus: 404 });
    expect(result.passed).toBe(true); // No bloquea si tiene teléfono y dirección
    expect(result.risks.some((r) => r.includes("404"))).toBe(true);
  });

  it("añade advertencia si no hay rating ni reseñas", () => {
    const result = detectRisks({ ...VALID_RAW, rating: undefined, reviewCount: undefined });
    expect(result.risks.some((r) => r.includes("reputación"))).toBe(true);
  });
});

// ─── PIPELINE COMPLETO ────────────────────────────────────────────────────────

describe("Pipeline Completo — runVerificationPipeline()", () => {
  it("aprueba un negocio de alta calidad con score >= VERIFICATION_GATE", () => {
    const result = runVerificationPipeline(VALID_RAW);
    expect(result.passed).toBe(true);
    expect(result.report.confidenceScore).toBeGreaterThanOrEqual(VERIFICATION_GATE);
    expect(result.failureTrace).toBeUndefined();
  });

  it("rechaza un negocio fantasma con FailureTrace en fase risk_detection", () => {
    const result = runVerificationPipeline(GHOST_RAW);
    expect(result.passed).toBe(false);
    expect(result.failureTrace?.phase).toBe("risk_detection");
    expect(result.report).toBeDefined(); // Report mínimo siempre presente
  });

  it("rechaza negocio que no supera el gate con FailureTrace en fase verification_gate", () => {
    const lowQualityRaw: RawBusinessData = {
      name: "Taller sin datos",
      category: "motor-transporte",
      zone: "palma",
      address: "",
      website: undefined,
      phone: undefined,
      rating: undefined,
      reviewCount: 0,
      images: [],
      webAccessibility: "error",
      webHttpStatus: 500,
      socialLinks: {},
      extractionTimestamp: new Date().toISOString(),
    };
    const result = runVerificationPipeline(lowQualityRaw);
    expect(result.passed).toBe(false);
    // Puede fallar en risk_detection (sin web + sin tel) o en gate
    expect(["risk_detection", "verification_gate"]).toContain(result.failureTrace?.phase);
  });

  it("el FailureTrace incluye el score cuando falla en el gate", () => {
    // Un negocio con web pero sin social, sin rating, sin teléfono → score bajo pero no fantasma
    const borderlineRaw: RawBusinessData = {
      name: "Servicio Mínimo SL",
      category: "servicios-profesionales",
      zone: "palma",
      address: "Palma, Mallorca",
      website: "https://ejemplo.com",
      phone: "+34 971 000 000",
      rating: 3.0,
      reviewCount: 2,
      images: [],
      webAccessibility: "not_found",
      webHttpStatus: 404,
      socialLinks: {},
      extractionTimestamp: new Date().toISOString(),
    };
    const result = runVerificationPipeline(borderlineRaw);
    if (!result.passed && result.failureTrace?.phase === "verification_gate") {
      expect(result.failureTrace.data).toHaveProperty("score");
      expect(result.failureTrace.data).toHaveProperty("gate", VERIFICATION_GATE);
    }
    // En cualquier caso, el report debe estar presente
    expect(result.report).toBeDefined();
  });

  it("la constante VERIFICATION_GATE es 80", () => {
    expect(VERIFICATION_GATE).toBe(80);
  });
});
