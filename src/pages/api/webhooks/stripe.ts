import type { APIRoute } from "astro";
import {
  verifyStripeWebhookSignature,
  recordCompletedPayment,
  isPaymentAlreadyProcessed,
} from "../../../lib/paymentSecurityEngine";
import { createDisplacementAlert } from "../../../lib/displacementNotificationEngine";
import { logToD1 } from "../../../lib/d1Logger";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const d1Binding = (locals as any)?.runtime?.env?.DB;

  try {
    const signatureHeader = request.headers.get("stripe-signature");
    const webhookSecret =
      (import.meta as any).env?.STRIPE_WEBHOOK_SECRET ||
      (locals as any)?.runtime?.env?.STRIPE_WEBHOOK_SECRET ||
      (typeof process !== "undefined" ? process.env?.STRIPE_WEBHOOK_SECRET : undefined);

    const rawBody = await request.text();

    // 1. Verificación de firma criptográfica HMAC-SHA256 (Protección contra Webhook Spoofing)
    if (webhookSecret) {
      const verification = await verifyStripeWebhookSignature(rawBody, signatureHeader, webhookSecret, 300);
      if (!verification.valid) {
        await logToD1(d1Binding, {
          level: "SECURITY",
          category: "PAYMENT",
          message: `Intento de falsificación de Webhook de Stripe: ${verification.error}`,
          status: 400,
          url: request.url,
          method: "POST",
        }).catch(() => {});

        return new Response(
          JSON.stringify({ success: false, error: "Firma de webhook de Stripe inválida o manipulada." }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // 2. Parsear el evento de Stripe
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ success: false, error: "Payload JSON malformado." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const eventType = event?.type;
    const session = event?.data?.object;

    if (!eventType || !session) {
      return new Response(JSON.stringify({ success: false, error: "Estructura de evento no reconocida." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Procesamiento seguro de eventos
    switch (eventType) {
      case "checkout.session.completed": {
        const idempotencyKey = session.client_reference_id || `stripe_${session.id}`;
        const serviceId = session.metadata?.serviceId || "unknown";
        const invoiceId = session.metadata?.invoiceId || `INV-HONOR-${Date.now().toString(36).toUpperCase()}`;
        const amountEuros = session.amount_total ? session.amount_total / 100 : Number(session.metadata?.amount || 0);

        // Anti-Replay: Si ya fue procesado, no repetir
        if (isPaymentAlreadyProcessed(idempotencyKey)) {
          return new Response(
            JSON.stringify({ received: true, note: "Transacción ya procesada previamente (idempotente)." }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }

        // Registrar pago completado en el ledger
        recordCompletedPayment(idempotencyKey, serviceId, amountEuros, invoiceId);

        // Telemetría oficial D1
        await logToD1(d1Binding, {
          level: "INFO",
          category: "PAYMENT",
          message: `Stripe Checkout confirmado para ${serviceId}: ${amountEuros}€ (Factura: ${invoiceId})`,
          status: 200,
          metadata: {
            stripeSessionId: session.id,
            idempotencyKey,
            serviceId,
            invoiceId,
            amount: amountEuros,
            customerEmail: session.customer_email || session.customer_details?.email,
          },
        }).catch(() => {});

        // Desplazamiento en Cuadro de Honor si aplica
        if (session.metadata?.displacedServiceId && session.metadata?.displacedServiceName) {
          createDisplacementAlert({
            category: session.metadata?.category || "elite-general",
            categoryTitle: session.metadata?.categoryTitle || "Élite Balear",
            displacedServiceId: session.metadata.displacedServiceId,
            displacedServiceName: session.metadata.displacedServiceName,
            displacedContactEmail: session.metadata.displacedEmail,
            newLeaderServiceId: serviceId,
            newLeaderServiceName: session.metadata?.serviceName || serviceId,
            newLeaderBidEuros: amountEuros,
            locale: session.metadata?.locale || "es",
          });
        }
        break;
      }

      case "checkout.session.expired": {
        await logToD1(d1Binding, {
          level: "INFO",
          category: "PAYMENT",
          message: `Sesión de pago expirada / abandonada en Stripe: ${session.id}`,
          status: 200,
          metadata: { stripeSessionId: session.id },
        }).catch(() => {});
        break;
      }

      case "payment_intent.payment_failed": {
        await logToD1(d1Binding, {
          level: "WARN",
          category: "PAYMENT",
          message: `Fallo de pago en pasarela: ${session.last_payment_error?.message || "Fondos insuficientes o tarjeta rechazada"}`,
          status: 400,
          metadata: {
            paymentIntentId: session.id,
            errorCode: session.last_payment_error?.code,
          },
        }).catch(() => {});
        break;
      }

      default:
        // Evento no crítico registrado para auditoría
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    await logToD1(d1Binding, {
      level: "ERROR",
      category: "PAYMENT",
      message: `Error al procesar webhook de Stripe: ${error?.message || error}`,
      status: 500,
    }).catch(() => {});

    return new Response(JSON.stringify({ success: false, error: "Error interno al procesar el webhook." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
