/**
 * Telemetría proactiva para captura de errores en el cliente (Browser).
 * Envía automáticamente cualquier excepción no controlada o error de JS a Cloudflare D1.
 */
export const captureFrontendError = async (error: Error, context: Record<string, any> = {}) => {
  const logEntry = {
    level: "ERROR",
    category: "CLIENT_JS",
    message: error.message,
    stack: error.stack,
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    timestamp: new Date().toISOString(),
    metadata: {
      ...context,
      path: typeof window !== "undefined" ? window.location.pathname : "",
      screenSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "",
    },
  };

  // Intentar enviar a la API de telemetría de forma asíncrona y no bloqueante
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    await fetch("/api/telemetry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logEntry),
      signal: controller.signal,
    });
    clearTimeout(timer);
  } catch (e) {
    console.warn("[Telemetry] Failed to send log to D1:", e);
  }
};

/**
 * Inicializa los listeners globales para capturar errores que no tienen un try/catch.
 */
export function initTelemetry() {
  if (typeof window === "undefined") return;

  // Captura errores de JS clásicos
  window.addEventListener("error", (event) => {
    captureFrontendError(event.error || new Error(event.message), { type: "window.error" });
  });

  // Captura promesas rechazadas no manejadas
  window.addEventListener("unhandledrejection", (event) => {
    captureFrontendError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
      type: "unhandled_rejection",
    });
  });
}
