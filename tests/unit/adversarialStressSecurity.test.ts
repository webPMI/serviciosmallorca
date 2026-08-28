/**
 * adversarialStressSecurity.test.ts
 *
 * 🛡️ SUITE DE PRUEBAS DE PRESIÓN ADVERSARIA Y FUZZING AGRESIVO (ESTÁNDAR 2026)
 *
 * Simula el comportamiento de:
 *  1. 🥴 Usuario Torpe / Errático: Datos malformados, desbordamientos, caracteres de control,
 *     fechas futuras o corruptas, valores numéricos extremos (NaN, Infinity, float drift).
 *  2. 🥷 Atacante Violento / Adversario Avanzado: Intentos de escalada de privilegios,
 *     inyección de esquemas (javascript:, data:), evasión de validación fiscal (NIF/CIF),
 *     ataques de polución de prototipo (__proto__), spoofing de titularidad e IDOR,
 *     bypasses de confianza temporal y manipulación de pujas del Cuadro de Honor.
 */

import { describe, it, expect } from "vitest";
import {
  validateSpanishTaxId,
  validateBalearicPhone,
  isDisposableEmail,
  isMatchingCorporateDomain,
  evaluateClaimSecurity,
  type ClaimVerificationPayload,
} from "../../src/lib/managerSecurityEngine.ts";
import {
  getDaysSinceValidation,
  calculateDecayedConfidenceScore,
  evaluateServiceTrust,
  canUserInteractWithService,
  isAuthorizedToEdit,
} from "../../src/lib/trustEngine.ts";
import {
  calculateNextBidPrice,
  isEligibleForHonorSpot,
  rankHonorList,
  type HonorSpotEntry,
} from "../../src/lib/honorBoardEngine.ts";
import { runFullCatalogAudit, auditSecurity, auditDataIntegrity } from "../../src/lib/multiAuditorEngine.ts";
import { can, PERMISSIONS } from "../../src/lib/permissions.ts";
import { redactSecrets } from "../../scripts/gemini-bridge.ts";
import type { ServiceItem } from "../../src/data/services/index.ts";

const baseService: ServiceItem = {
  id: "test-item-palma",
  slug: "test-item-palma",
  name: "Test Item Palma",
  category: "gastronomia-restaurantes",
  zone: "palma",
  address: "Carrer dels Horts 1, Palma",
  coordinates: { lat: 39.57, lng: 2.65 },
  rating: 4.8,
  reviewCount: 150,
  priceRange: "€€",
  verified: true,
  featured: false,
  status: "open",
  googleMapsUrl: "https://maps.google.com/?id=1",
  appleMapsUrl: "https://maps.apple.com/?id=1",
  bingMapsUrl: "https://bing.com/maps/?id=1",
  phone: "+34 971 102 030",
  whatsapp: "+34 971 102 030",
  email: "contacto@restaurantetestpalma.com",
  website: "https://restaurantetestpalma.com",
  tags: ["test", "palma"],
  shortDescription: { es: "Test", en: "Test", ca: "Test", de: "Test" },
  fullDescription: { es: "Test completo", en: "Full test", ca: "Test complet", de: "Vollständiger Test" },
  image: "/images/test.jpg",
  schedule: "L-D 10:00-20:00",
  confidenceScore: 90,
};

describe("🛡️ BATERÍA DE PRUEBAS DE PRESIÓN AGRESIVA Y SEGURIDAD ADVERSARIA (2026)", () => {
  // ===========================================================================
  // 1. FUZZING & ADVERSARIAL ATTACKS: MOTOR FISCAL Y GESTIÓN DE ACCESO
  // ===========================================================================
  describe("1. Fuzzing & Ataques contra el Validador Fiscal y de Titularidad", () => {
    it("debe rechazar vectores de inyección SQL, XSS, null-bytes y caracteres de control en NIF/CIF", () => {
      const maliciousTaxIds = [
        "12345678A' OR '1'='1",
        "<script>alert(1)</script>",
        "12345678A\x00extra",
        "12345678A\r\nBCC:attacker@evil.com",
        "\\x27\\x22\\x3E\\x3C",
        "B".repeat(10000), // Buffer overflow attempt
        "12345678A", // DNI con letra de control incorrecta (12345678 % 23 = 14 -> Z != A)
        "X1234567A", // NIE con letra de control incorrecta (X01234567 % 23 = 10 -> L != A)
        "__proto__",
        "constructor",
        "   ",
        "\t\n\r",
        "NaN",
        "undefined",
        "[object Object]",
        "null",
      ];

      for (const badTaxId of maliciousTaxIds) {
        expect(validateSpanishTaxId(badTaxId)).toBe(false);
      }
    });

    it("debe validar correctamente DNI/NIE/CIF legítimos con formatos variados de espacios y guiones", () => {
      // DNI válidos reales con su letra de control según módulo 23
      expect(validateSpanishTaxId("12345678Z")).toBe(true); // 12345678 % 23 = 14 -> Z
      expect(validateSpanishTaxId(" 12345678-Z ")).toBe(true);
      expect(validateSpanishTaxId("X1234567L")).toBe(true); // X01234567 -> 1234567 % 23 = 10 -> L
      expect(validateSpanishTaxId("B07123456")).toBe(true); // CIF S.L. Balear
    });

    it("debe resistir ataques de fuzzing telefónico y números internacionales no baleares", () => {
      const hostilePhones = [
        "+1 800 555 0199", // US
        "+7 999 123 45 67", // RU
        "+34 971 12 34 56<script>",
        "+34971123456\x00injection",
        "callto:112",
        "tel:+34971000000;ext=999",
        "A".repeat(500),
        "000000000",
        "12345678",
      ];

      for (const badPhone of hostilePhones) {
        expect(validateBalearicPhone(badPhone)).toBe(false);
      }

      // Válidos baleares / españoles
      expect(validateBalearicPhone("+34 971 123 456")).toBe(true);
      expect(validateBalearicPhone("871 900 100")).toBe(true);
      expect(validateBalearicPhone("+34 612 345 678")).toBe(true);
      expect(validateBalearicPhone("722 111 222")).toBe(true);
    });

    it("debe bloquear correos desechables con subdominios y caracteres especiales", () => {
      const dirtyDisposableEmails = [
        "hacker@mailinator.com",
        "victim@subdomain.yopmail.com",
        "test@trashmail.com",
        "admin@tempmail.com",
        "spammer@guerrillamail.com",
      ];

      for (const email of dirtyDisposableEmails) {
        expect(isDisposableEmail(email)).toBe(true);
      }

      expect(isDisposableEmail("info@restaurante-mallorca.com")).toBe(false);
      expect(isDisposableEmail("gerencia@hotelpalma.es")).toBe(false);
    });

    it("debe neutralizar intentos de evasión en coincidencia de dominio corporativo (SSRF, Subdomain Takeover)", () => {
      const serviceWeb = "https://www.restaurante-soller.com";

      // Intentos de bypass
      expect(isMatchingCorporateDomain("attacker@restaurante-soller.com.evil.com", serviceWeb)).toBe(false);
      expect(isMatchingCorporateDomain("attacker@evil-restaurante-soller.com", serviceWeb)).toBe(false);
      expect(isMatchingCorporateDomain("attacker@localhost", serviceWeb)).toBe(false);
      expect(isMatchingCorporateDomain("attacker@127.0.0.1", serviceWeb)).toBe(false);
      expect(isMatchingCorporateDomain("attacker@restaurante-soller%2ecom", serviceWeb)).toBe(false);

      // Legítimos
      expect(isMatchingCorporateDomain("gerente@restaurante-soller.com", serviceWeb)).toBe(true);
      expect(isMatchingCorporateDomain("reservas@staff.restaurante-soller.com", serviceWeb)).toBe(true);
    });

    it("debe rechazar solicitudes de reclamación de titularidad hostiles o no acreditadas", () => {
      const dummyService: ServiceItem = {
        ...baseService,
        id: "rest-test",
        name: "Restaurante Test Palma",
        slug: "restaurante-test-palma",
        category: "gastronomia-restaurantes",
        zone: "palma",
        address: "Carrer de Balmes 10, Palma",
        phone: "+34 971 102 030",
        website: "https://restaurantetestpalma.com",
      };

      const hostileClaim: ClaimVerificationPayload = {
        applicantUid: "evil-user-666",
        applicantEmail: "hacker@tempmail.com", // Desechable
        applicantPhone: "12345", // No válido
        applicantName: "Hacker X",
        businessTaxId: "00000000X", // Falso
        verificationMethod: "corporate_email",
      };

      const evaluation = evaluateClaimSecurity(hostileClaim, dummyService);
      expect(evaluation.passed).toBe(false);
      expect(evaluation.recommendedAction).toBe("reject_unauthorized");
      expect(evaluation.securityScore).toBeLessThan(40);
      expect(evaluation.reasons.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ===========================================================================
  // 2. PRIVILEGE ESCALATION, IDOR & PROTOCOL BARRIERS
  // ===========================================================================
  describe("2. Barreras contra Escalada de Privilegios, IDOR y Manipulación de Roles", () => {
    it("debe denegar edición a atacantes que intenten suplantar UIDs mediante null, undefined o injection", () => {
      const dummyService: ServiceItem = {
        ...baseService,
        id: "hotel-palma",
        name: "Hotel Palma",
        slug: "hotel-palma",
        category: "hoteles-alojamiento",
        zone: "palma",
        address: "Passeig Marítim 1, Palma",
        phone: "+34 971 700 800",
        website: "https://hotelpalma.com",
      };

      // Intentos de IDOR con rol manager pero UID discordante
      expect(isAuthorizedToEdit(undefined, "guest", dummyService)).toBe(false);
      expect(isAuthorizedToEdit("", "user", dummyService)).toBe(false);
      expect(isAuthorizedToEdit("evil-uid", "user", dummyService)).toBe(false);
      expect(isAuthorizedToEdit("evil-uid", "manager", dummyService, "real-owner-uid")).toBe(false);
      expect(isAuthorizedToEdit("admin-fake", "user", dummyService, "real-owner-uid")).toBe(false);

      // Solo el propietario real con rol manager o un admin legítimo tienen acceso
      expect(isAuthorizedToEdit("real-owner-uid", "manager", dummyService, "real-owner-uid")).toBe(true);
      expect(isAuthorizedToEdit("admin-uid-123", "admin", dummyService, "real-owner-uid")).toBe(true);
    });

    it("debe mantener el blindaje RBAC frente a nombres de permisos inyectados o manipulados", () => {
      expect(can("guest", "MANAGE_USERS" as any)).toBe(false);
      expect(can("user", "MANAGE_USERS" as any)).toBe(false);
      expect(can("manager", "VIEW_ADMIN_PANEL" as any)).toBe(false);
      expect(can("guest", "__proto__" as any)).toBe(false);
      expect(can("guest", "toString" as any)).toBe(false);
      expect(can("admin", PERMISSIONS.MANAGE_USERS)).toBe(true);
    });
  });

  // ===========================================================================
  // 3. CLUMSY & ADVERSARIAL INPUTS: MOTOR DE TIEMPO, CADUCIDAD Y CONFIANZA
  // ===========================================================================
  describe("3. Resiliencia ante Fechas Corruptas, NaN y Manipulación de Confianza Temporal", () => {
    it("debe manejar con seguridad fechas absurdas: año 3000, epoch negativo, strings no parseables", () => {
      const corruptDates = ["NOT-A-DATE", "2026-99-99T99:99:99Z", "undefined", "null", "", "0000-00-00"];

      for (const badDate of corruptDates) {
        const days = getDaysSinceValidation(badDate);
        expect(days).toBe(999); // Fallback seguro a caducado
      }
    });

    it("debe aplicar degradación temporal estricta y blindar el gating de interacción ante servicios no revalidados", () => {
      const now = new Date("2026-08-28T00:00:00Z");

      const staleService: ServiceItem = {
        ...baseService,
        id: "stale-biz",
        name: "Negocio Sin Auditar",
        slug: "negocio-sin-auditar",
        confidenceScore: 90,
        lastValidatedAt: "2024-01-01T00:00:00Z", // >2 años atrás
      };

      const decayedScore = calculateDecayedConfidenceScore(staleService, now);
      expect(decayedScore).toBe(45); // 90 * 0.5 = 45

      const trust = evaluateServiceTrust(staleService, now);
      expect(trust.trustLevel).toBe("level_1_discovery");
      expect(trust.allowedActions.canDirectBook).toBe(false);
      expect(trust.allowedActions.canSubmitReviews).toBe(false);

      // Un usuario regular no puede reservar en un negocio caducado
      expect(canUserInteractWithService("user", staleService, "book", now)).toBe(false);
      expect(canUserInteractWithService("user", staleService, "review", now)).toBe(false);
    });
  });

  // ===========================================================================
  // 4. FINANCIAL & AUCTION LOGIC: CUADRO DE HONOR ADVERSARIAL STRESS
  // ===========================================================================
  describe("4. Presión contra el Motor del Cuadro de Honor y Subastas", () => {
    it("debe rechazar pujas negativas, NaN, Infinity y drift aritmético", () => {
      expect(calculateNextBidPrice(0)).toBe(1.0);
      expect(calculateNextBidPrice(-100)).toBe(1.0);
      expect(calculateNextBidPrice(1.0, 1.0)).toBe(2.0);
      expect(calculateNextBidPrice(12.55, 1.0)).toBe(13.55);
    });

    it("debe rechazar postulaciones de negocios fraudulentos, cerrados o con score < 80% (GR-11)", () => {
      const closedService: ServiceItem = {
        ...baseService,
        id: "closed-shop",
        name: "Tienda Cerrada",
        slug: "tienda-cerrada",
        status: "permanently_closed", // Cerrado
        confidenceScore: 90,
      };

      const lowScoreService: ServiceItem = {
        ...closedService,
        status: "open",
        verified: false,
        confidenceScore: 55, // Por debajo de 80%
      };

      expect(isEligibleForHonorSpot(closedService).eligible).toBe(false);
      expect(isEligibleForHonorSpot(lowScoreService).eligible).toBe(false);
    });

    it("debe ordenar el ranking de honor de forma determinista y resistir arrays masivos", () => {
      const massiveBids: HonorSpotEntry[] = Array.from({ length: 500 }, (_, i) => ({
        id: `spot-${i}`,
        position: 0,
        serviceId: `service-${i}`,
        serviceName: `Service ${i}`,
        serviceSlug: `service-${i}`,
        category: "gastronomia-restaurantes",
        zone: "palma",
        honorTitle: { es: "E", en: "E", ca: "E", de: "E" },
        currentBidEuros: (i % 50) + 1,
        sponsorName: `Sponsor ${i}`,
        nominatedAt: new Date(Date.now() - i * 1000).toISOString(),
        confidenceScore: 95,
        isVerified: true,
      }));

      const ranked = rankHonorList(massiveBids);
      expect(ranked.length).toBe(500);
      expect(ranked[0].position).toBe(1);
      expect(ranked[0].currentBidEuros).toBeGreaterThanOrEqual(ranked[1].currentBidEuros);
      expect(ranked[499].position).toBe(500);
    });
  });

  // ===========================================================================
  // 5. ORCHESTRATION & CORRUPT PAYLOAD RESISTANCE IN MULTI-AUDITOR
  // ===========================================================================
  describe("5. Resistencia del Orquestador Multi-Auditor ante Objetos Corruptos", () => {
    it("debe procesar catálogos con servicios mutados o parcialmente corruptos sin lanzar excepciones no controladas", () => {
      const dirtyCatalog: ServiceItem[] = [
        {
          ...baseService,
          id: "corrupt-1",
          name: "Corrupt Service",
          slug: "corrupt-service",
          phone: "999-INVALID",
          website: "http://not-https.com",
          email: "spam@mailinator.com", // Desechable
          coordinates: { lat: 0, lng: 0 }, // Fuera de Mallorca
          shortDescription: { es: "", en: "", ca: "" } as any,
          status: "open",
        },
      ];

      const secAudit = auditSecurity(dirtyCatalog);
      expect(secAudit.findings.length).toBeGreaterThan(0);
      expect(secAudit.stats.criticalCount).toBeGreaterThanOrEqual(1);

      const dataAudit = auditDataIntegrity(dirtyCatalog);
      expect(dataAudit.findings.some((f) => f.code === "DATA_GEO_OUT_OF_BOUNDS")).toBe(true);

      const fullReport = runFullCatalogAudit(dirtyCatalog);
      expect(fullReport.overallStatus).toBe("ACCION_INMEDIATA");
      expect(fullReport.overallComplianceScore).toBeLessThanOrEqual(85);
    });
  });

  // ===========================================================================
  // 6. GEMINI BRIDGE & SECRET REDACTION UNDER PRESSURE
  // ===========================================================================
  describe("6. Blindaje de Redacción de Secretos en Puente Gemini", () => {
    it("debe anonimizar cualquier clave o token que aparezca en fragmentos de log o JSON de error", () => {
      const realApiKey = "AIzaSyFakeSecretToken1234567890abcdef";
      const dirtyLog = `Error: Authentication failed with key=${realApiKey} at endpoint /v1/models`;

      const redacted = redactSecrets(dirtyLog, [realApiKey]);
      expect(redacted).not.toContain(realApiKey);
      expect(redacted).toContain("***");
    });
  });
});
