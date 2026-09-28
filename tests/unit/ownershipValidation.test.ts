import { describe, it, expect } from "vitest";
import {
  slugify,
  sanitizeText,
  validatePhoneInput,
  validateHttpsUrl,
  validateEmailInput,
  isValidServiceStatus,
  validateTaxIdOrDocument,
  validateSubmissionForm,
} from "../../src/lib/ownershipValidation";

describe("Ownership and Submission Validation Engine", () => {
  describe("slugify", () => {
    it("converts diverse business names to URL-safe canonical slugs", () => {
      expect(slugify("Restaurante Ca'n Pedro")).toBe("restaurante-ca-n-pedro");
      expect(slugify("Boutique Hotel & Spa Son Net (Mallorca)")).toBe("boutique-hotel-spa-son-net-mallorca");
      expect(slugify("Clínica Veterinaria Palma — 24H")).toBe("clinica-veterinaria-palma-24h");
      expect(slugify("")).toBe("");
    });
  });

  describe("sanitizeText", () => {
    it("strips HTML tags and control characters", () => {
      const malicious = "<script>alert('xss')</script>Bar <b>Auténtico</b>\u0000";
      expect(sanitizeText(malicious)).toBe("alert('xss')Bar Auténtico");
    });

    it("respects maxLength parameter", () => {
      expect(sanitizeText("abcdefghij", 5)).toBe("abcde");
    });
  });

  describe("validatePhoneInput", () => {
    it("accepts valid Balearic and Spanish phone numbers", () => {
      expect(validatePhoneInput("+34 971 123 456").valid).toBe(true);
      expect(validatePhoneInput("971123456").valid).toBe(true);
      expect(validatePhoneInput("871998877").valid).toBe(true);
      expect(validatePhoneInput("+34 600 11 22 33").valid).toBe(true);
    });

    it("rejects invalid or too short phones", () => {
      expect(validatePhoneInput("1234").valid).toBe(false);
      expect(validatePhoneInput("telefono").valid).toBe(false);
    });
  });

  describe("validateHttpsUrl", () => {
    it("accepts secure HTTPS URLs", () => {
      expect(validateHttpsUrl("https://restaurante.com").valid).toBe(true);
      expect(validateHttpsUrl("https://www.flordesaltrenc.com/reserva").valid).toBe(true);
    });

    it("strictly rejects insecure HTTP URLs per GR-13", () => {
      const res = validateHttpsUrl("http://insecure-site.com");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("GR-13");
    });

    it("rejects malformed URLs", () => {
      expect(validateHttpsUrl("not a url").valid).toBe(false);
    });
  });

  describe("validateEmailInput", () => {
    it("accepts valid corporate and standard emails", () => {
      expect(validateEmailInput("info@restaurante-mallorca.com").valid).toBe(true);
      expect(validateEmailInput("contacto@palma.es").valid).toBe(true);
    });

    it("rejects disposable / temporary emails", () => {
      expect(validateEmailInput("spammer@tempmail.com").valid).toBe(false);
      expect(validateEmailInput("bot@mailinator.com").valid).toBe(false);
    });
  });

  describe("isValidServiceStatus", () => {
    it("validates only official ServiceStatus enum values", () => {
      expect(isValidServiceStatus("open")).toBe(true);
      expect(isValidServiceStatus("incomplete_admin_only")).toBe(true);
      expect(isValidServiceStatus("seasonal_closure")).toBe(true);
      expect(isValidServiceStatus("permanently_closed")).toBe(true);
      expect(isValidServiceStatus("unknown_status")).toBe(false);
      expect(isValidServiceStatus(null)).toBe(false);
    });
  });

  describe("validateTaxIdOrDocument", () => {
    it("accepts valid Spanish CIF/NIF", () => {
      // CIF format: B followed by 7 digits and control
      expect(validateTaxIdOrDocument("B07123456").valid).toBe(true);
    });

    it("accepts HTTPS documentation links", () => {
      const res = validateTaxIdOrDocument("https://drive.google.com/document-iae.pdf");
      expect(res.valid).toBe(true);
      expect(res.isUrl).toBe(true);
    });

    it("rejects insecure or invalid documents", () => {
      expect(validateTaxIdOrDocument("http://insecure.com/doc.pdf").valid).toBe(false);
      expect(validateTaxIdOrDocument("").valid).toBe(false);
    });
  });

  describe("validateSubmissionForm", () => {
    it("validates a complete and legitimate business submission", () => {
      const result = validateSubmissionForm({
        name: "Cafetería Can Pedro",
        category: "gastronomia-catering",
        zone: "palma",
        address: "Plaça de Cort, 4, 07001 Palma",
        phone: "+34 971 71 22 33",
        website: "https://canpedro-palma.com",
        description: "Cafetería tradicional en el centro de Palma con ensaimadas artesanas.",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.sanitized?.name).toBe("Cafetería Can Pedro");
    });

    it("collects errors for incomplete or insecure forms", () => {
      const result = validateSubmissionForm({
        name: "A",
        category: "",
        zone: "",
        address: "C/ 1",
        phone: "123",
        website: "http://insecure.com",
        description: "Corta",
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });
});
