/**
 * legalCompliance.test.ts
 *
 * ⚖️ PRUEBAS UNITARIAS: MOTOR DE CUMPLIMIENTO LEGAL, VERSIONADO Y AUDITORÍA RGPD
 *
 * Valida:
 *  1. Comprobación y control de versiones legales (CURRENT_LEGAL_VERSION = "2026.2").
 *  2. Detección automática de términos desactualizados para forzar la re-aceptación.
 *  3. Registro inmutable de consentimientos con trazabilidad de políticas y marca temporal.
 *  4. Generación de certificado de auditoría para la Agencia Española de Protección de Datos (AEPD).
 *  5. Validación precontractual de pagos y renuncia al desistimiento (LGDCU Art. 103).
 *  6. Gestión de preferencias de cookies según las directrices de la AEPD.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  CURRENT_LEGAL_VERSION,
  LEGAL_POLICIES_LAST_UPDATED,
  hasAcceptedCurrentLegalTerms,
  recordUserLegalConsent,
  getUserLegalConsent,
  validateCheckoutLegalConsent,
  generateConsentAuditCertificate,
  saveCookiePreferences,
  getStoredCookiePreferences,
  type LegalConsentRecord,
} from "../../src/lib/legalComplianceEngine";

// Storage Mock
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const mockStorage = new LocalStorageMock();

// Mock global localStorage
if (typeof window === "undefined" || !globalThis.localStorage) {
  (globalThis as any).localStorage = mockStorage;
}

describe("⚖️ MOTOR DE CUMPLIMIENTO LEGAL, VERSIONADO Y BLINDAJE RGPD/LSSI", () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  describe("1. Control de Versiones Legales Vigentes", () => {
    it("debe definir una versión legal vigente y una fecha ISO válida", () => {
      expect(CURRENT_LEGAL_VERSION).toBe("2026.2");
      expect(LEGAL_POLICIES_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("debe validar positivamente solo si el consentimiento coincide con la versión actual", () => {
      const validConsent: LegalConsentRecord = {
        userId: "usr_joan_1",
        version: CURRENT_LEGAL_VERSION,
        acceptedAt: new Date().toISOString(),
        policies: ["terms", "privacy", "cookies"],
        source: "registration",
      };

      expect(hasAcceptedCurrentLegalTerms(validConsent)).toBe(true);
    });

    it("debe rechazar versiones obsoletas de términos exigiendo re-aceptación", () => {
      const outdatedConsent: LegalConsentRecord = {
        userId: "usr_joan_1",
        version: "2026.1", // Versión antigua
        acceptedAt: "2026-08-01T10:00:00.000Z",
        policies: ["terms", "privacy"],
        source: "registration",
      };

      expect(hasAcceptedCurrentLegalTerms(outdatedConsent)).toBe(false);
      expect(hasAcceptedCurrentLegalTerms(null)).toBe(false);
      expect(hasAcceptedCurrentLegalTerms(undefined)).toBe(false);
    });
  });

  describe("2. Registro de Consentimiento y Certificado de Auditoría RGPD", () => {
    it("debe registrar y recuperar el consentimiento en almacenamiento local", () => {
      const uid = "usr_maria_palma";
      const record = recordUserLegalConsent(uid, "terms_update_modal", [
        "terms",
        "privacy",
        "cookies",
        "digital_withdrawal",
      ]);

      expect(record.version).toBe(CURRENT_LEGAL_VERSION);
      expect(record.userId).toBe(uid);
      expect(record.policies).toContain("digital_withdrawal");

      const retrieved = getUserLegalConsent(uid);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.version).toBe(CURRENT_LEGAL_VERSION);
      expect(hasAcceptedCurrentLegalTerms(retrieved)).toBe(true);
    });

    it("debe generar un certificado de auditoría con los campos exigidos por la AEPD", () => {
      const consent: LegalConsentRecord = {
        userId: "usr_audit_test",
        version: CURRENT_LEGAL_VERSION,
        acceptedAt: "2026-09-27T12:00:00.000Z",
        policies: ["terms", "privacy", "cookies", "digital_withdrawal"],
        source: "checkout",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      };

      const cert = generateConsentAuditCertificate(consent);
      expect(cert).toContain("CERTIFICADO DE CONSENTIMIENTO RGPD");
      expect(cert).toContain(CURRENT_LEGAL_VERSION);
      expect(cert).toContain("usr_audit_test");
      expect(cert).toContain("terms, privacy, cookies, digital_withdrawal");
      expect(cert).toContain("checkout");
      expect(cert).toContain("legal@serviciosmallorca.com");
    });
  });

  describe("3. Validación Precontractual de Pagos y Desistimiento Digital (LGDCU Art. 103)", () => {
    it("debe bloquear la transacción si no se aceptan los términos de servicio", () => {
      const result = validateCheckoutLegalConsent(false, true);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain("Términos de Servicio");
    });

    it("debe bloquear la transacción si no se renuncia expresamente al desistimiento para servicio digital", () => {
      const result = validateCheckoutLegalConsent(true, false);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain("Art. 103");
      expect(result.errorMessage).toContain("desistimiento");
    });

    it("debe autorizar el cobro cuando ambos consentimientos obligatorios están marcados", () => {
      const result = validateCheckoutLegalConsent(true, true);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });
  });

  describe("4. Gestión Granular de Preferencias de Cookies (AEPD / LSSI Art. 22.2)", () => {
    it("debe mantener las cookies necesarias siempre activas de forma obligatoria", () => {
      const saved = saveCookiePreferences({
        analytics: false,
        personalization: false,
        marketing: false,
      });

      expect(saved.necessary).toBe(true);
      expect(saved.analytics).toBe(false);

      const stored = getStoredCookiePreferences();
      expect(stored?.necessary).toBe(true);
    });

    it("debe permitir activar cookies analíticas y de personalización conforme a la elección del usuario", () => {
      const saved = saveCookiePreferences({
        analytics: true,
        personalization: true,
        marketing: false,
      });

      expect(saved.analytics).toBe(true);
      expect(saved.personalization).toBe(true);
      expect(saved.marketing).toBe(false);
    });
  });
});
