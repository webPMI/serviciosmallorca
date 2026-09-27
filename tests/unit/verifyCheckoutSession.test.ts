/**
 * 🛡️ SUITE DE VERIFICACIÓN DE SESIÓN DE CHECKOUT (anti-falsificación de pagos)
 *
 * `?payment=success` es un query param falsificable. Estos tests garantizan que
 * el servidor NUNCA confirma un pago sin validar antes contra la API de Stripe.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyCheckoutSession } from "../../src/lib/paymentSecurityEngine";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

function mockStripeResponse(body: any, ok = true, status = 200) {
  const spy = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });
  globalThis.fetch = spy as any;
  return spy;
}

describe("🔐 verifyCheckoutSession · Anti-falsificación del retorno de pago", () => {
  it("rechaza session_id vacío o con formato inválido sin llamar a Stripe", async () => {
    const spy = mockStripeResponse({});
    expect((await verifyCheckoutSession("", "sk_test")).verified).toBe(false);
    expect((await verifyCheckoutSession("no-es-stripe", "sk_test")).verified).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("rechaza cuando no hay clave de API configurada (nunca confirma a ciegas)", async () => {
    const spy = mockStripeResponse({ payment_status: "paid" });
    const result = await verifyCheckoutSession("cs_test_123", undefined);
    expect(result.verified).toBe(false);
    expect(result.error).toContain("clave de API");
    expect(spy).not.toHaveBeenCalled();
  });

  it("rechaza una sesión cuyo payment_status NO es 'paid'", async () => {
    mockStripeResponse({ id: "cs_test_123", payment_status: "unpaid" });
    const result = await verifyCheckoutSession("cs_test_123", "sk_test");
    expect(result.verified).toBe(false);
    expect(result.paymentStatus).toBe("unpaid");
  });

  it("rechaza cuando Stripe responde con error HTTP (sesión inexistente)", async () => {
    mockStripeResponse({ error: { message: "No such session" } }, false, 404);
    const result = await verifyCheckoutSession("cs_test_inexistente", "sk_test");
    expect(result.verified).toBe(false);
    expect(result.error).toContain("404");
  });

  it("rechaza ante fallo de red sin lanzar excepción (GR-15: registrado, no silencioso)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down")) as any;
    const result = await verifyCheckoutSession("cs_test_123", "sk_test");
    expect(result.verified).toBe(false);
    expect(spy).toHaveBeenCalled();
  });

  it("acepta una sesión realmente pagada y devuelve los datos de la factura", async () => {
    const spy = mockStripeResponse({
      id: "cs_test_ok",
      payment_status: "paid",
      amount_total: 1250,
      metadata: {
        invoiceId: "INV-HONOR-2026-ABC",
        serviceId: "taller-1",
        serviceSlug: "taller-1",
        category: "elite-general",
      },
    });

    const result = await verifyCheckoutSession("cs_test_ok", "sk_test");

    expect(result.verified).toBe(true);
    expect(result.paymentStatus).toBe("paid");
    expect(result.amountEuros).toBe(12.5);
    expect(result.invoiceId).toBe("INV-HONOR-2026-ABC");
    expect(result.serviceSlug).toBe("taller-1");
    expect(result.category).toBe("elite-general");

    // La clave secreta solo viaja en la cabecera Authorization, nunca en la URL.
    const [url, init] = spy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.stripe.com/v1/checkout/sessions/cs_test_ok");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer sk_test");
  });

  it("acepta 'no_payment_required' como estado válido (importes ya cubiertos)", async () => {
    mockStripeResponse({ id: "cs_test_npr", payment_status: "no_payment_required", amount_total: 0 });
    const result = await verifyCheckoutSession("cs_test_npr", "sk_test");
    expect(result.verified).toBe(true);
  });
});
