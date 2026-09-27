import type { APIRoute } from "astro";
import { verifyCheckoutSession } from "../../lib/paymentSecurityEngine";
import { checkRateLimit, createRateLimitResponse } from "../../lib/rateLimiter";
import { getD1Binding, logToD1 } from "../../lib/d1Logger";

export const prerender = false;

/**
 * POST /api/verify-checkout-session
 *
 * Cierra el agujero de seguridad de la URL de retorno: `?payment=success` es un
 * parámetro de query falsificable. Este endpoint pregunta a Stripe si la sesión
 * existe realmente y está pagada antes de que la UI confirme nada al usuario.
 *
 * La clave secreta de Stripe NUNCA sale del servidor (GR-13).
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const d1Binding = getD1Binding(locals);

  try {
    const rateLimit = await checkRateLimit(
      request,
      { limit: 20, windowMs: 60000, keyPrefix: "verify-checkout" },
      (locals as any)?.runtime?.env?.KV_CACHE,
    );
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit, "Demasiadas verificaciones seguidas. Espera un momento.");
    }

    const body = await request.json().catch(() => null);
    const sessionId = String(body?.sessionId || "").trim();

    if (!sessionId) {
      return new Response(JSON.stringify({ verified: false, error: "Falta el identificador de sesión." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });
    }

    const stripeKey =
      (import.meta as any).env?.STRIPE_SECRET_KEY ||
      (locals as any)?.runtime?.env?.STRIPE_SECRET_KEY ||
      (typeof process !== "undefined" ? process.env?.STRIPE_SECRET_KEY : undefined);

    const result = await verifyCheckoutSession(sessionId, stripeKey);

    // GR-15: todo fallo de verificación queda registrado en D1 para auditoría.
    if (!result.verified) {
      await logToD1(d1Binding, {
        level: "WARN",
        category: "PAYMENT",
        message: `Verificación de sesión de checkout no superada: ${result.error}`,
        status: 200,
        method: "POST",
        url: request.url,
        metadata: { sessionId, reason: result.error },
      }).catch(() => {});
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (error) {
    // GR-15: cero catches silenciosos
    console.error("[verify-checkout-session] Error inesperado:", error);
    await logToD1(d1Binding, {
      level: "ERROR",
      category: "PAYMENT",
      message: `Error inesperado verificando la sesión de checkout: ${(error as any)?.message || error}`,
      status: 500,
      method: "POST",
    }).catch(() => {});

    return new Response(
      JSON.stringify({ verified: false, error: "Error interno al verificar el pago." }),
      { status: 500, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } },
    );
  }
};
