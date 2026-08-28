/**
 * client-error-reporter.ts
 *
 * 📡 TELEMETRÍA AUTOMÁTICA DE ERRORES DE CLIENTE (BROWSER ➔ D1)
 *
 * Captura excepciones no controladas y rechazos de promesas en el navegador,
 * enviándolos en segundo plano a /api/logs/ingest mediante sendBeacon / fetch.
 */

let isReporterInitialized = false;

// Evitar inundar la red con el mismo error en bucles de JavaScript
const seenErrors = new Set<string>();
const MAX_SEEN_ERRORS = 50;

export function initClientErrorReporter(): void {
  if (typeof window === "undefined" || isReporterInitialized) return;
  isReporterInitialized = true;

  // 1. Captura de errores estándar de JavaScript
  window.addEventListener("error", (event: ErrorEvent) => {
    try {
      const errorKey = `${event.message}:${event.filename}:${event.lineno}`;
      if (seenErrors.has(errorKey)) return;
      if (seenErrors.size >= MAX_SEEN_ERRORS) seenErrors.clear();
      seenErrors.add(errorKey);

      const payload = {
        level: "ERROR",
        category: "CLIENT_JS",
        message: event.message || "Error no controlado en script del cliente",
        stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
        url: window.location.pathname + window.location.search,
        status: 0,
      };
      sendErrorLog(payload);
    } catch {
      // Evitar bucles de error
    }
  });

  // 2. Captura de Promesas rechazadas no controladas
  window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    try {
      const reason = event.reason;
      const message = typeof reason === "string" ? reason : reason?.message || "Unhandled Promise Rejection";
      const stack = reason?.stack;

      const rejectionKey = `rejection:${message}:${window.location.pathname}`;
      if (seenErrors.has(rejectionKey)) return;
      if (seenErrors.size >= MAX_SEEN_ERRORS) seenErrors.clear();
      seenErrors.add(rejectionKey);

      const payload = {
        level: "WARN",
        category: "CLIENT_JS",
        message: `Unhandled Rejection: ${message}`,
        stack,
        url: window.location.pathname + window.location.search,
        status: 0,
      };
      sendErrorLog(payload);
    } catch {
      // Evitar bucles de error
    }
  });
}

function sendErrorLog(payload: Record<string, any>): void {
  try {
    const data = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon("/api/logs/ingest", blob);
    } else {
      fetch("/api/logs/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silencioso en cliente
  }
}
