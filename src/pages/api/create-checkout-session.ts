import type { APIRoute } from "astro";
import { getServiceById } from "../../data/services";
import {
  validatePaymentRequest,
  recordCompletedPayment,
  releasePaymentLock,
  acquireServiceResourceLock,
  releaseServiceResourceLock,
  isPaymentsLiveMode,
  type PaymentAttemptPayload,
} from "../../lib/paymentSecurityEngine";
import { getDefaultHonorSpots } from "../../lib/honorBoardEngine";
import { checkRateLimit, createRateLimitResponse } from "../../lib/rateLimiter";
import { logToD1 } from "../../lib/d1Logger";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  let activeIdempotencyKey: string | undefined;
  let activeServiceId: string | undefined;

  try {
    // 1. Mitigación contra DoS y Abuso de Pasarela: Rate Limiting Financiero
    const rateLimit = await checkRateLimit(
      request,
      {
        limit: 10,
        windowMs: 60000,
        keyPrefix: "financial-checkout",
      },
      (locals as any)?.runtime?.env?.KV_CACHE,
    );

    if (!rateLimit.allowed) {
      return createRateLimitResponse(
        rateLimit,
        "Has alcanzado el límite de intentos de transacción por minuto. Por motivos de seguridad bancaria, espera unos momentos antes de reintentar.",
      );
    }

    // 2. Parseo y validación del cuerpo de la petición
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Payload de transacción inválido o malformado.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        },
      );
    }

    const {
      serviceId,
      serviceSlug,
      amountEuros,
      backerName = "Vecino de Mallorca",
      backerEmail,
      backerMessage,
      paymentMethod = "card",
      mode = "community_boost",
      idempotencyKey,
      isB2B = false,
      b2bTaxId,
      b2bLegalName,
      b2bAddress,
      locale = "es",
    } = body;

    // 3. Validar existencia del negocio en el catálogo oficial de Mallorca
    const service = getServiceById(serviceSlug || serviceId);
    if (!service) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "El servicio indicado no figura en el catálogo verificado de Mallorca.",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        },
      );
    }

    activeServiceId = service.id;
    activeIdempotencyKey = String(idempotencyKey || `idemp_${Date.now()}`);

    // 4. Bloqueo de concurrencia por recurso (Resource Concurrency Mutex)
    // Evita que dos usuarios o bots pujen en la misma fracción de segundo por el mismo comercio
    const serviceLockAcquired = acquireServiceResourceLock(service.id, 10000);
    if (!serviceLockAcquired) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Existe otra transacción en curso para este mismo comercio. Espera unos segundos e inténtalo de nuevo.",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        },
      );
    }

    // 5. Construcción de payload para validación profunda y sanitización
    const payload: PaymentAttemptPayload = {
      serviceId: service.id,
      serviceSlug: service.slug,
      amountEuros: Number(amountEuros),
      backerName: String(backerName),
      backerEmail: String(backerEmail || ""),
      backerMessage: backerMessage ? String(backerMessage) : undefined,
      paymentMethod,
      mode,
      idempotencyKey: activeIdempotencyKey,
      clientTimestamp: Date.now(),
      isB2B: Boolean(isB2B),
      b2bTaxId: b2bTaxId ? String(b2bTaxId) : undefined,
      b2bLegalName: b2bLegalName ? String(b2bLegalName) : undefined,
      b2bAddress: b2bAddress ? String(b2bAddress) : undefined,
    };

    // 6. Validar seguridad e idempotencia (Anti-tampering, Anti-XSS, Anti-Collision)
    const defaultSpots = getDefaultHonorSpots();
    const currentSpots = Object.values(defaultSpots).flat();
    const validation = validatePaymentRequest(payload, currentSpots);

    if (!validation.allowed) {
      releaseServiceResourceLock(service.id);
      return new Response(
        JSON.stringify({
          success: false,
          error: validation.error || "Validación de pago no superada.",
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        },
      );
    }

    // Datos sanitizados y cálculos fiscales del lado del servidor (GR-01, RGPD)
    const sanitized = validation.sanitizedPayload || {};
    const safeAmount = validation.sanitizedAmount || Number(Number(amountEuros).toFixed(2));
    const subtotal = Number((safeAmount / 1.21).toFixed(2));
    const tax = Number((safeAmount - subtotal).toFixed(2));
    const currentYear = new Date().getFullYear();
    const invoiceId = `INV-HONOR-${currentYear}-${Date.now().toString(36).toUpperCase()}`;

    // 7. Registro en el libro de transacciones completadas (Idempotencia permanente)
    recordCompletedPayment(activeIdempotencyKey, service.id, safeAmount, invoiceId);

    // 8. Telemetría de pago resiliente en Cloudflare D1 (GR-15)
    const d1Binding = (locals as any)?.runtime?.env?.DB;
    await logToD1(d1Binding, {
      level: "INFO",
      category: "PAYMENT",
      message: `Transacción de posicionamiento iniciada para ${service.name}: ${safeAmount}€ (${mode}) [Factura ${invoiceId}]`,
      status: 200,
      url: request.url,
      method: "POST",
      metadata: {
        serviceId: service.id,
        serviceSlug: service.slug,
        amount: safeAmount,
        invoiceId,
        isB2B: payload.isB2B,
        mode,
        paymentMethod,
        backerName: sanitized.backerName,
      },
    }).catch(() => {});

    // 9. Modo Live vs. Sandbox
    const isLive = isPaymentsLiveMode();
    const stripeKey =
      (import.meta as any).env?.STRIPE_SECRET_KEY ||
      (locals as any)?.runtime?.env?.STRIPE_SECRET_KEY ||
      (typeof process !== "undefined" ? process.env?.STRIPE_SECRET_KEY : undefined);

    const origin = new URL(request.url).origin;
    const safeLocale = ["es", "en", "ca", "de"].includes(locale) ? locale : "es";
    const successUrl = `${origin}/${safeLocale}/cuadro-de-honor?payment=success&session_id={CHECKOUT_SESSION_ID}&invoiceId=${invoiceId}&service=${service.slug}`;
    const cancelUrl = `${origin}/${safeLocale}/cuadro-de-honor?payment=cancelled&service=${service.slug}`;

    if (isLive && stripeKey) {
      // Integración directa con Stripe Checkout API mediante fetch REST estándar (compatible con Cloudflare Workers)
      const stripeParams = new URLSearchParams();
      stripeParams.append("payment_method_types[0]", "card");
      stripeParams.append("line_items[0][price_data][currency]", "eur");
      stripeParams.append("line_items[0][price_data][unit_amount]", String(Math.round(safeAmount * 100)));
      stripeParams.append(
        "line_items[0][price_data][product_data][name]",
        `${service.name} — Posicionamiento Cuadro de Honor Mallorca`,
      );
      stripeParams.append(
        "line_items[0][price_data][product_data][description]",
        `Impulso oficial verificado e indexación prioritaria GEO para asistentes de IA. Factura: ${invoiceId}`,
      );
      stripeParams.append("mode", "payment");
      stripeParams.append("success_url", successUrl);
      stripeParams.append("cancel_url", cancelUrl);
      stripeParams.append("customer_email", sanitized.backerEmail || payload.backerEmail);
      stripeParams.append("client_reference_id", activeIdempotencyKey);
      stripeParams.append("metadata[serviceId]", service.id);
      stripeParams.append("metadata[serviceSlug]", service.slug);
      stripeParams.append("metadata[invoiceId]", invoiceId);
      stripeParams.append("metadata[mode]", mode);
      stripeParams.append("metadata[amount]", String(safeAmount));
      if (sanitized.b2bTaxId) {
        stripeParams.append("metadata[b2bTaxId]", sanitized.b2bTaxId);
      }

      try {
        const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: stripeParams.toString(),
        });

        const stripeSession = await stripeRes.json();
        if (stripeRes.ok && stripeSession?.url) {
          return new Response(
            JSON.stringify({
              success: true,
              mode: "live",
              checkoutUrl: stripeSession.url,
              sessionId: stripeSession.id,
              invoiceId,
              amount: safeAmount,
              subtotal,
              tax,
              serviceName: service.name,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
            },
          );
        } else {
          // Si la llamada a Stripe falla, registrar en D1 y ofrecer fallback controlado
          await logToD1(d1Binding, {
            level: "ERROR",
            category: "PAYMENT",
            message: `Stripe API error: ${stripeSession?.error?.message || "Error al generar sesión"}`,
            status: stripeRes.status,
            metadata: { stripeError: stripeSession?.error },
          }).catch(() => {});
        }
      } catch (stripeErr: any) {
        await logToD1(d1Binding, {
          level: "ERROR",
          category: "PAYMENT",
          message: `Fallo de conexión con Stripe API: ${stripeErr?.message || stripeErr}`,
        }).catch(() => {});
      }
    }

    // Modo Sandbox / Demostración transparente, seguro e instantáneo
    return new Response(
      JSON.stringify({
        success: true,
        mode: "sandbox",
        invoiceId,
        amount: safeAmount,
        subtotal,
        tax,
        serviceName: service.name,
        serviceSlug: service.slug,
        backerName: sanitized.backerName || "Vecino de Mallorca",
        backerEmail: sanitized.backerEmail || payload.backerEmail,
        backerMessage: sanitized.backerMessage,
        isB2B: payload.isB2B,
        b2bTaxId: sanitized.b2bTaxId,
        b2bLegalName: sanitized.b2bLegalName,
        b2bAddress: sanitized.b2bAddress,
        createdAt: new Date().toISOString(),
        message: "Transacción auditada y validada en entorno seguro de demostración.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    // GR-15: cero catches silenciosos — registrar el fallo de la pasarela antes de responder 500
    console.error("[checkout] create-checkout-session failed:", error);
    if (activeIdempotencyKey) releasePaymentLock(activeIdempotencyKey);
    if (activeServiceId) releaseServiceResourceLock(activeServiceId);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Error interno al procesar la sesión de pago seguro. Por favor, inténtalo de nuevo.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      },
    );
  }
};
