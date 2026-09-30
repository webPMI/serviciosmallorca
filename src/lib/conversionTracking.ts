export type ConversionEventType =
  | "whatsapp_click"
  | "whatsapp_floating_click"
  | "phone_click"
  | "website_click"
  | "directions_click"
  | "share_click"
  | "menu_view"
  | "booking_intent";

export interface ConversionEventPayload {
  serviceId: string;
  eventType: ConversionEventType;
  locale?: string;
  referrer?: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Registra un evento de conversión de negocio (intención de contacto, llamada, reserva o mapa).
 * Utiliza navigator.sendBeacon para no bloquear la navegación del usuario.
 */
export function trackConversion(
  serviceId: string,
  eventType: ConversionEventType,
  metadata: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined" || !serviceId) return;

  const payload: ConversionEventPayload = {
    serviceId,
    eventType,
    locale: document.documentElement.lang || "es",
    referrer: document.referrer || undefined,
    timestamp: new Date().toISOString(),
    metadata,
  };

  try {
    // 📊 Google Analytics 4 Event Dispatch (Key Events / Conversions)
    if (typeof (window as any).gtag === "function") {
      try {
        if (eventType === "whatsapp_click" || eventType === "phone_click") {
          const contactMethod = eventType === "whatsapp_click" ? "whatsapp" : "phone";
          (window as any).gtag("event", "generate_lead", {
            lead_type: contactMethod,
            service_id: serviceId,
            event_category: "conversion",
            event_label: serviceId,
            locale: payload.locale,
          });
          (window as any).gtag("event", "contact", {
            method: contactMethod,
            service_id: serviceId,
          });
        }

        // Custom event con telemetría de servicio
        (window as any).gtag("event", eventType, {
          service_id: serviceId,
          locale: payload.locale,
          ...metadata,
        });
      } catch {
        // Ignored
      }
    }

    const jsonStr = JSON.stringify(payload);
    const endpoint = "/api/track-conversion";

    if (navigator.sendBeacon) {
      const blob = new Blob([jsonStr], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonStr,
        keepalive: true,
      }).catch(() => {
        // Silencioso en cliente para evitar interrupciones
      });
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Inicializa escuchadores automáticos en el DOM para elementos con data-track-event.
 *
 * Idempotente por diseño (guard de módulo): aunque se invoque múltiples veces
 * (multi-layout, HMR, hydration repetida) solo registra UN listener delegado,
 * evitando beacons duplicados por cada click.
 */
export function initAutomaticClickTracking(): void {
  if (typeof window === "undefined") return;
  if ((globalThis as { __smClickTrackingInitialized?: boolean }).__smClickTrackingInitialized) return;
  (globalThis as { __smClickTrackingInitialized?: boolean }).__smClickTrackingInitialized = true;

  document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement)?.closest("[data-track-event]") as HTMLElement | null;
    if (!target) return;

    const eventType = target.getAttribute("data-track-event") as ConversionEventType;
    const serviceId =
      target.getAttribute("data-service-id") || (eventType === "whatsapp_floating_click" ? "platform" : null);

    if (eventType && serviceId) {
      trackConversion(serviceId, eventType, {
        elementId: target.id || "",
        href: (target as HTMLAnchorElement).href || "",
      });
    }
  });
}

export interface PurchaseEventParams {
  transactionId: string;
  value: number;
  currency?: string;
  serviceId?: string;
  serviceName?: string;
  mode?: string;
}

/**
 * Registra un evento de compra/conversión monetaria oficial (GA4 Purchase Key Event).
 */
export function trackPurchase(params: PurchaseEventParams): void {
  if (typeof window === "undefined" || !params.transactionId) return;

  if (typeof (window as any).gtag === "function") {
    try {
      (window as any).gtag("event", "purchase", {
        transaction_id: params.transactionId,
        value: Number(params.value.toFixed(2)),
        currency: params.currency || "EUR",
        service_id: params.serviceId || "",
        service_name: params.serviceName || "",
        mode: params.mode || "community_boost",
        items: [
          {
            item_id: params.serviceId || "honor_spot",
            item_name: params.serviceName || "Posicionamiento Cuadro de Honor",
            price: Number(params.value.toFixed(2)),
            quantity: 1,
          },
        ],
      });
    } catch {
      // Graceful fallback
    }
  }
}
