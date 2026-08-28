import { describe, it, expect } from "vitest";
import {
  validateFeedbackSubmission,
  sanitizeString,
  generateFeedbackId,
  type FeedbackSubmissionPayload,
} from "../../src/lib/communityVoiceEngine";

describe("📢 Community Voice Engine & Feedback Validator (GR-03, GR-11, GR-13)", () => {
  it("validates a genuine good news submission with clean data", () => {
    const payload: FeedbackSubmissionPayload = {
      type: "GOOD_NEWS",
      title: "Excelente servicio en Taller Artesano Palma",
      description: "Nos atendieron con gran profesionalidad y rapidez para restaurar una lámpara tradicional.",
      authorName: "Maria Antonia",
      authorEmail: "maria@example.com",
      targetServiceSlug: "taller-artesano-palma",
      targetServiceName: "Taller Artesano Palma",
      zone: "palma",
    };

    const result = validateFeedbackSubmission(payload);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.sanitized).toBeDefined();
    expect(result.sanitized?.authorName).toBe("Maria Antonia");
    expect(result.sanitized?.authorEmail).toBe("maria@example.com");
  });

  it("rejects bot submissions when honeypot field is filled", () => {
    const payload: FeedbackSubmissionPayload = {
      type: "SUGGESTION",
      title: "Añadir más gimnasios en Manacor",
      description: "Sería ideal contar con más opciones de fitness en la zona este de la isla.",
      honeypot: "i-am-a-spambot",
    };

    const result = validateFeedbackSubmission(payload);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("SPAM_BOT_DETECTED");
  });

  it("rejects invalid feedback types", () => {
    const payload = {
      type: "INVALID_HACK" as any,
      title: "Prueba de tipo",
      description: "Descripción de prueba para verificar tipo inválido.",
    };

    const result = validateFeedbackSubmission(payload);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("INVALID_FEEDBACK_TYPE");
  });

  it("validates title and description length boundaries", () => {
    // Too short title
    const resShortTitle = validateFeedbackSubmission({
      type: "CORRECTION",
      title: "Hi",
      description: "Esta es una descripción válida con más de quince caracteres.",
    });
    expect(resShortTitle.valid).toBe(false);
    expect(resShortTitle.errors).toContain("TITLE_TOO_SHORT");

    // Too short description
    const resShortDesc = validateFeedbackSubmission({
      type: "CORRECTION",
      title: "Título de prueba válido",
      description: "Corto",
    });
    expect(resShortDesc.valid).toBe(false);
    expect(resShortDesc.errors).toContain("DESCRIPTION_TOO_SHORT");
  });

  it("filters malicious scripts and spam words", () => {
    const resXss = validateFeedbackSubmission({
      type: "BUG_REPORT",
      title: "Error <script>alert(1)</script>",
      description: "He detectado un fallo en la página de servicios con javascript:void(0)",
    });
    expect(resXss.valid).toBe(false);
    expect(resXss.errors).toContain("MALICIOUS_CONTENT_DETECTED");

    const resCasino = validateFeedbackSubmission({
      type: "GOOD_NEWS",
      title: "Free casino bonus giveaway",
      description: "Visita nuestro enlace para reclamar premios sin esfuerzo en la isla.",
    });
    expect(resCasino.valid).toBe(false);
    expect(resCasino.errors).toContain("MALICIOUS_CONTENT_DETECTED");
  });

  it("validates email formats when provided", () => {
    const resBadEmail = validateFeedbackSubmission({
      type: "SUGGESTION",
      title: "Sugerencia de transporte",
      description: "Añadir más rutas de autobuses hacia la Serra de Tramuntana.",
      authorEmail: "not-an-email",
    });
    expect(resBadEmail.valid).toBe(false);
    expect(resBadEmail.errors).toContain("INVALID_EMAIL_FORMAT");
  });

  it("sanitizes HTML tags safely", () => {
    const raw = "<b>Negocio</b> <script>alert('xss')</script> Palma";
    const cleaned = sanitizeString(raw);
    expect(cleaned).toBe("bNegocio/b scriptalert('xss')/script Palma");
    expect(cleaned).not.toContain("<");
    expect(cleaned).not.toContain(">");
  });

  it("generates unique feedback identifiers", () => {
    const id1 = generateFeedbackId();
    const id2 = generateFeedbackId();
    expect(id1).toMatch(/^fb_[a-z0-9]+_[a-z0-9]+$/);
    expect(id2).toMatch(/^fb_[a-z0-9]+_[a-z0-9]+$/);
    expect(id1).not.toBe(id2);
  });
});
