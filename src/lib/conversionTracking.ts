export type ConversionEventType =
  | "whatsapp_click"
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
    const serviceId = target.getAttribute("data-service-id");

    if (eventType && serviceId) {
      trackConversion(serviceId, eventType, {
        elementId: target.id || "",
        href: (target as HTMLAnchorElement).href || "",
      });
    }
  });
}
