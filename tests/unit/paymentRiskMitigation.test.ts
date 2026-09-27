/**
 * paymentRiskMitigation.test.ts
 *
 * 🛡️ SUITE DE PRUEBAS DE BLINDAJE INTEGRAL CONTRA FACTORES DE RIESGO FINANCIERO (2026)
 *
 * Cobertura de Vectores de Amenaza:
 *  1. 👤 FACTOR HUMANO:
 *     - Prevención de doble clic y clics compulsivos (Mutex de 20s).
 *     - Sanitización de nombres, dedicatorias y datos fiscales.
 *     - Validación estricta de NIF, CIF, NIE y VAT europeo.
 *
 *  2. 🌐 FACTOR DE RED Y LAG:
 *     - Idempotencia criptográfica y registro permanente en ledger.
 *     - Prevención de replay attacks tras completarse una transacción.
 *     - Desbloqueo automático tras TTL y resiliencia ante cortes.
 *
 *  3. 💻 FACTOR DIGITAL & CIBERSEGURIDAD (HACKING):
 *     - Anti-Price-Tampering: Bloqueo de importes negativos, desbordamientos, NaN o >50.000€.
 *     - Anti-Injection: Sanitización profunda de strings contra XSS y control chars.
 *     - Concurrency Guard: Bloqueo de concurrencia a nivel de negocio/recurso.
 *     - Verificación Criptográfica de Webhooks: Validación HMAC-SHA256 con tolerancia temporal.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  sanitizePaymentInput,
  isValidPaymentEmail,
  isValidFiscalTaxId,
  validateAndSanitizeAmount,
  acquirePaymentLock,
  releasePaymentLock,
  acquireServiceResourceLock,
  releaseServiceResourceLock,
  recordCompletedPayment,
  isPaymentAlreadyProcessed,
  getCompletedPayment,
  generatePaymentIdempotencyKey,
  validatePaymentRequest,
  verifyStripeWebhookSignature,
  resetPaymentSecurityState,
  type PaymentAttemptPayload,
} from "../../src/lib/paymentSecurityEngine";

describe("🛡️ BLINDAJE INTEGRAL DE PAGOS Y MITIGACIÓN DE RIESGOS 360°", () => {
  beforeEach(() => {
    resetPaymentSecurityState();
  });

  // =========================================================================
  // 1. FACTOR HUMANO & SANITIZACIÓN DE DATOS (INPUTS & FISCALIDAD)
  // =========================================================================
  describe("1. Factor Humano: Sanitización de Inputs y Validación Fiscal", () => {
    it("debe eliminar etiquetas HTML, scripts e inyecciones XSS de los textos", () => {
      const maliciousName = "<script>alert('pwned')</script>Joan García <b>Palma</b>";
      const cleaned = sanitizePaymentInput(maliciousName, 80);
      expect(cleaned).not.toContain("<script>");
      expect(cleaned).not.toContain("</script>");
      expect(cleaned).not.toContain("<b>");
      expect(cleaned).toBe("alert(pwned)Joan García Palma");
    });

    it("debe truncar cadenas excesivamente largas a su límite seguro", () => {
      const hugeString = "A".repeat(500);
      const cleaned = sanitizePaymentInput(hugeString, 50);
      expect(cleaned.length).toBe(50);
    });

    it("debe validar correos electrónicos legítimos y rechazar payloads maliciosos", () => {
      // Válidos
      expect(isValidPaymentEmail("joan.garcia@empresa.com")).toBe(true);
      expect(isValidPaymentEmail("vecino_mallorca@gmail.com")).toBe(true);
      expect(isValidPaymentEmail("info@restaurante-soller.es")).toBe(true);

      // Inválidos / Peligrosos
      expect(isValidPaymentEmail("sin-arroba.com")).toBe(false);
      expect(isValidPaymentEmail("test@")).toBe(false);
      expect(isValidPaymentEmail("test@.com")).toBe(false);
      expect(isValidPaymentEmail("<script>@evil.com")).toBe(false);
      expect(isValidPaymentEmail("")).toBe(false);
      expect(isValidPaymentEmail(null as any)).toBe(false);
    });

    it("debe validar CIFs, NIFs y NIEs españoles válidos para deducción B2B", () => {
      // NIF español (8 números + 1 letra)
      expect(isValidFiscalTaxId("43123456Z")).toBe(true);
      // NIE español (X, Y, Z + 7 números + letra)
      expect(isValidFiscalTaxId("X1234567A")).toBe(true);
      // CIF de sociedad española (Letra + 7 números + dígito/letra)
      expect(isValidFiscalTaxId("B07123456")).toBe(true);
      // VAT intra-comunitario (Alemania DE, etc.)
      expect(isValidFiscalTaxId("DE123456789")).toBe(true);

      // Inválidos
      expect(isValidFiscalTaxId("123")).toBe(false);
      expect(isValidFiscalTaxId("INVALID_NIF_TOO_LONG_1234567890")).toBe(false);
      expect(isValidFiscalTaxId("")).toBe(false);
      expect(isValidFiscalTaxId(null as any)).toBe(false);
    });
  });

  // =========================================================================
  // 2. FACTOR DIGITAL: ANTI-TAMPERING DE IMPORTES Y CÁLCULOS
  // =========================================================================
  describe("2. Factor Digital: Anti-Price-Tampering y Validación de Importes", () => {
    it("debe sanitizar importes numéricos y redondeos flotantes", () => {
      const res = validateAndSanitizeAmount(10.555, 1.0);
      expect(res.valid).toBe(true);
      expect(res.amount).toBe(10.56);
    });

    it("debe admitir importes en formato string con comas o puntos", () => {
      const resComma = validateAndSanitizeAmount("15,75", 1.0);
      expect(resComma.valid).toBe(true);
      expect(resComma.amount).toBe(15.75);

      const resDot = validateAndSanitizeAmount("25.00", 1.0);
      expect(resDot.valid).toBe(true);
      expect(resDot.amount).toBe(25.0);
    });

    it("debe rechazar ataques con NaN, valores negativos, ceros o desbordamientos", () => {
      // Negativo
      expect(validateAndSanitizeAmount(-10.0, 1.0).valid).toBe(false);
      // Cero o menor al mínimo
      expect(validateAndSanitizeAmount(0.5, 1.0).valid).toBe(false);
      // NaN o texto no numérico
      expect(validateAndSanitizeAmount("no-es-numero", 1.0).valid).toBe(false);
      expect(validateAndSanitizeAmount(NaN, 1.0).valid).toBe(false);
      // Infinito
      expect(validateAndSanitizeAmount(Infinity, 1.0).valid).toBe(false);
      // Desbordamiento mayor a 50.000€
      expect(validateAndSanitizeAmount(9999999, 1.0).valid).toBe(false);
    });
  });

  // =========================================================================
  // 3. FACTOR DE RED, DOBLE CLIC Y CONCURRENCIA (MUTEX SHIELDS)
  // =========================================================================
  describe("3. Factor Red & Lag: Mutex Anti-Doble Clic y Bloqueo de Concurrencia", () => {
    it("debe generar claves de idempotencia robustas y no colisionantes con prefijo estructurado", () => {
      const key1 = generatePaymentIdempotencyKey("forn-inca-tradicio", 25.0, "juan@empresa.com");
      const key2 = generatePaymentIdempotencyKey("forn-inca-tradicio", 25.0, "juan@empresa.com");
      expect(key1).toMatch(/^idemp_forn-inca-tradicio_25\.00_juan_/);
      expect(key2).toMatch(/^idemp_forn-inca-tradicio_25\.00_juan_/);
      expect(key1).not.toBe(key2);
    });

    it("debe bloquear peticiones concurrentes con la misma clave de idempotencia", () => {
      const key = "idemp_test_fast_click";
      expect(acquirePaymentLock(key, 10000)).toBe(true);
      // Segundo clic inmediato rechazado por el mutex
      expect(acquirePaymentLock(key, 10000)).toBe(false);

      // Tras liberación manual, el mutex vuelve a estar disponible
      releasePaymentLock(key);
      expect(acquirePaymentLock(key, 10000)).toBe(true);
    });

    it("debe permitir nueva adquisición tras expirar el TTL del bloqueo", () => {
      const key = "idemp_ttl_test";
      const pastTime = 100000;
      // Adquirir con TTL de 5000ms en el tiempo pastTime
      expect(acquirePaymentLock(key, 5000, pastTime)).toBe(true);

      // En pastTime + 2000ms todavía está bloqueado
      expect(acquirePaymentLock(key, 5000, pastTime + 2000)).toBe(false);

      // En pastTime + 6000ms (después de 5000ms TTL) el bloqueo ya expiró
      expect(acquirePaymentLock(key, 5000, pastTime + 6000)).toBe(true);
    });

    it("debe bloquear la concurrencia a nivel de comercio para evitar condiciones de carrera", () => {
      const serviceId = "forn-inca-tradicio";
      expect(acquireServiceResourceLock(serviceId, 5000)).toBe(true);
      // Segundo intento concurrente sobre el mismo comercio en vuelo
      expect(acquireServiceResourceLock(serviceId, 5000)).toBe(false);

      // Liberar bloqueo de recurso
      releaseServiceResourceLock(serviceId);
      expect(acquireServiceResourceLock(serviceId, 5000)).toBe(true);
    });

    it("debe registrar pagos completados e impedir ataques de replay", () => {
      const idempotencyKey = "idemp_order_finalized_789";
      expect(isPaymentAlreadyProcessed(idempotencyKey)).toBe(false);

      recordCompletedPayment(idempotencyKey, "forn-inca-tradicio", 20.0, "INV-HONOR-2026-TEST");
      expect(isPaymentAlreadyProcessed(idempotencyKey)).toBe(true);

      const record = getCompletedPayment(idempotencyKey);
      expect(record?.amount).toBe(20.0);
      expect(record?.invoiceId).toBe("INV-HONOR-2026-TEST");

      // Intento de reenvío con la misma clave es rechazado por el validador
      const payload: PaymentAttemptPayload = {
        serviceId: "forn-inca-tradicio",
        serviceSlug: "forn-inca-tradicio",
        amountEuros: 20.0,
        backerName: "Joan",
        backerEmail: "joan@test.com",
        paymentMethod: "card",
        mode: "community_boost",
        idempotencyKey,
        clientTimestamp: Date.now(),
      };
      const validation = validatePaymentRequest(payload, []);
      expect(validation.allowed).toBe(false);
      expect(validation.error).toContain("ya fue procesado y confirmado");
    });
  });

  // =========================================================================
  // 4. FACTOR HACKING: VERIFICACIÓN CRIPTOGRÁFICA DE WEBHOOKS STRIPE
  // =========================================================================
  describe("4. Factor Hacking: Verificación de Firma Criptográfica de Webhooks", () => {
    async function generateValidSignature(payload: string, secret: string, timestamp: number): Promise<string> {
      const encoder = new TextEncoder();
      const signedPayload = `${timestamp}.${payload}`;
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(signedPayload));
      const hexSig = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return `t=${timestamp},v1=${hexSig}`;
    }

    it("debe validar satisfactoriamente un webhook firmado legítimamente", async () => {
      const rawPayload = JSON.stringify({ id: "evt_123", type: "checkout.session.completed" });
      const secret = "whsec_test_secret_key_123456789";
      const now = Math.floor(Date.now() / 1000);
      const signatureHeader = await generateValidSignature(rawPayload, secret, now);

      const result = await verifyStripeWebhookSignature(rawPayload, signatureHeader, secret, 300);
      expect(result.valid).toBe(true);
      expect(result.timestamp).toBe(now);
    });

    it("debe rechazar webhooks con firma alterada o payload modificado por un hacker", async () => {
      const originalPayload = JSON.stringify({ id: "evt_123", amount: 1000 });
      const tamperedPayload = JSON.stringify({ id: "evt_123", amount: 100000 }); // Hacker modificó el importe
      const secret = "whsec_test_secret_key_123456789";
      const now = Math.floor(Date.now() / 1000);
      const signatureHeader = await generateValidSignature(originalPayload, secret, now);

      const result = await verifyStripeWebhookSignature(tamperedPayload, signatureHeader, secret, 300);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("no coincide");
    });

    it("debe rechazar webhooks expirados para prevenir ataques de repetición (Replay Attacks)", async () => {
      const rawPayload = JSON.stringify({ id: "evt_old_123" });
      const secret = "whsec_test_secret_key_123456789";
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutos en el pasado (límite: 5 min)
      const signatureHeader = await generateValidSignature(rawPayload, secret, expiredTimestamp);

      const result = await verifyStripeWebhookSignature(rawPayload, signatureHeader, secret, 300);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Firma expirada");
    });

    it("debe rechazar peticiones con cabeceras de firma malformadas o faltantes", async () => {
      const result = await verifyStripeWebhookSignature("{}", null, "secret");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("ausente");

      const malformedResult = await verifyStripeWebhookSignature("{}", "bad_header_no_equals", "secret");
      expect(malformedResult.valid).toBe(false);
      expect(malformedResult.error).toContain("inválido");
    });
  });
});
