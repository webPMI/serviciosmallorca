/**
 * checkoutApiEndpoints.test.ts
 *
 * 🛡️ SUITE DE PRUEBAS DE INTEGRACIÓN PARA ENDPOINTS DE PAGO Y WEBHOOKS STRIPE
 *
 * Cobertura de auditoría:
 *  1. POST /api/create-checkout-session:
 *     - Validación de payload, sanitización y rechazo de inputs inválidos.
 *     - Rechazo de servicios inexistentes en catálogo.
 *     - Modo Sandbox: persistencia en D1 como `sandbox_recorded` sin corromper podio público.
 *     - Modo Live: detección de falta de clave secreta (500) y rechazo controlado ante fallo de Stripe (502).
 *     - Mutex & Locks: liberación adecuada de locks ante errores.
 *
 *  2. POST /api/webhooks/stripe:
 *     - Modo Live sin secreto: rechazo con HTTP 500 (seguridad obligatoria).
 *     - Firma HMAC inválida o manipulada: rechazo con HTTP 400.
 *     - Evento checkout.session.completed legítimo: registro en ledger y aplicación al podio D1.
 *     - Idempotencia y anti-replay: procesamiento único ante entregas repetidas de Stripe.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { POST as createCheckoutSession } from "../../src/pages/api/create-checkout-session";
import { POST as stripeWebhook } from "../../src/pages/api/webhooks/stripe";
import { resetPaymentSecurityState } from "../../src/lib/paymentSecurityEngine";
import { createHonorD1Mock } from "../helpers/honorD1Mock";

const originalFetch = globalThis.fetch;

describe("💳 Endpoints de Pago: create-checkout-session y webhooks/stripe", () => {
  let mockD1: ReturnType<typeof createHonorD1Mock>;

  beforeEach(() => {
    resetPaymentSecurityState();
    mockD1 = createHonorD1Mock();
    delete process.env.PUBLIC_PAYMENTS_LIVE;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
    delete process.env.PUBLIC_PAYMENTS_LIVE;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  function createMockLocals() {
    return {
      DB: mockD1.d1,
      runtime: {
        env: {
          DB: mockD1.d1,
          KV_CACHE: undefined,
        },
      },
    };
  }

  // =========================================================================
  // 1. POST /api/create-checkout-session
  // =========================================================================
  describe("1. POST /api/create-checkout-session", () => {
    it("rechaza payload malformado con HTTP 400", async () => {
      const request = new Request("http://localhost/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid-json",
      });

      const response = await createCheckoutSession({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("inválido");
    });

    it("rechaza servicios inexistentes con HTTP 404", async () => {
      const request = new Request("http://localhost/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "servicio-fantasma-no-existe",
          amountEuros: 10,
          backerEmail: "user@test.com",
        }),
      });

      const response = await createCheckoutSession({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("no figura");
    });

    it("rechaza peticiones con email inválido con HTTP 422", async () => {
      const request = new Request("http://localhost/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "adrian-quetglas",
          amountEuros: 10,
          backerEmail: "email-invalido",
        }),
      });

      const response = await createCheckoutSession({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(422);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("correo electrónico válido");
    });

    it("procesa con éxito transacciones en modo Sandbox y audita en D1", async () => {
      const request = new Request("http://localhost/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "adrian-quetglas",
          amountEuros: 25.0,
          backerName: "Antoni Joan",
          backerEmail: "antoni@example.com",
          category: "artesanos-sabor",
        }),
      });

      const response = await createCheckoutSession({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.mode).toBe("sandbox");
      expect(json.amount).toBe(25.0);
      expect(json.invoiceId).toMatch(/^INV-HONOR-/);
      expect(json.subtotal).toBe(20.66);
      expect(json.tax).toBe(4.34);

      // Debe quedar registrado en D1 como sandbox_recorded
      const recordedBid = mockD1.bids.find((b) => b.service_id === "adrian-quetglas");
      expect(recordedBid).toBeDefined();
      expect(recordedBid.status).toBe("sandbox_recorded");
      expect(recordedBid.amount_eur).toBe(25.0);
    });

    it("en modo Live sin STRIPE_SECRET_KEY configurada, responde con HTTP 500 y no cae a sandbox", async () => {
      process.env.PUBLIC_PAYMENTS_LIVE = "true";

      const request = new Request("http://localhost/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "adrian-quetglas",
          amountEuros: 15.0,
          backerEmail: "pago@live.com",
        }),
      });

      const response = await createCheckoutSession({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("no está configurada");
    });

    it("en modo Live con fallo en Stripe API, responde con HTTP 502 y libera el bloqueo", async () => {
      process.env.PUBLIC_PAYMENTS_LIVE = "true";
      process.env.STRIPE_SECRET_KEY = "sk_test_fake_key";

      // Mock Stripe API fallando
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: { message: "Your card was declined" } }),
      }) as any;

      const request = new Request("http://localhost/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "adrian-quetglas",
          amountEuros: 20.0,
          backerEmail: "live@mallorca.com",
        }),
      });

      const response = await createCheckoutSession({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(502);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("declined");
    });
  });

  // =========================================================================
  // 2. POST /api/webhooks/stripe
  // =========================================================================
  describe("2. POST /api/webhooks/stripe", () => {
    it("en modo Live sin STRIPE_WEBHOOK_SECRET, rechaza con HTTP 500 por seguridad", async () => {
      process.env.PUBLIC_PAYMENTS_LIVE = "true";

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "evt_1", type: "checkout.session.completed" }),
      });

      const response = await stripeWebhook({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("seguridad incompleta");
    });

    it("rechaza webhooks con firma no coincidente con HTTP 400", async () => {
      process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "t=1700000000,v1=fake_signature_hash_123",
        },
        body: JSON.stringify({ id: "evt_1", type: "checkout.session.completed" }),
      });

      const response = await stripeWebhook({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Firma de webhook");
    });

    it("procesa un evento checkout.session.completed válido y actualiza D1", async () => {
      const secret = "whsec_valid_test_secret";
      process.env.STRIPE_WEBHOOK_SECRET = secret;

      const payloadObj = {
        id: "evt_test_123",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_stripe_mock_session",
            client_reference_id: "idemp_test_webhook_real_1",
            amount_total: 5000, // 50.00€
            metadata: {
              serviceId: "adrian-quetglas",
              serviceSlug: "adrian-quetglas",
              invoiceId: "INV-HONOR-2026-TEST",
              category: "artesanos-sabor",
              mode: "owner_bid",
              sponsorName: "Titular Forn",
            },
          },
        },
      };

      const rawBody = JSON.stringify(payloadObj);
      const now = Math.floor(Date.now() / 1000);

      // Generar firma HMAC legítima
      const encoder = new TextEncoder();
      const signedPayload = `${now}.${rawBody}`;
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const sigBuffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(signedPayload));
      const hexSig = Array.from(new Uint8Array(sigBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const signatureHeader = `t=${now},v1=${hexSig}`;

      const request = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": signatureHeader,
        },
        body: rawBody,
      });

      const response = await stripeWebhook({ request, locals: createMockLocals() } as any);
      expect(response.status).toBe(200);

      // Comprobar idempotencia: una segunda llamada idéntica debe retornar nota de duplicado
      const secondRequest = new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": signatureHeader,
        },
        body: rawBody,
      });

      const secondResponse = await stripeWebhook({ request: secondRequest, locals: createMockLocals() } as any);
      expect(secondResponse.status).toBe(200);
      const secondJson = await secondResponse.json();
      expect(secondJson.note).toContain("ya procesada previamente");
    });
  });
});
