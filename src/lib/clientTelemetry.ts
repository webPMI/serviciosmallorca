/**
 * clientTelemetry.ts
 *
 * 📡 Reportero de fallos de la capa de datos (cliente y SSR sin binding D1).
 *
 * GR-15: ningún `catch` puede quedarse mudo. Cuando una lectura/escritura de
 * Firestore falla, el error se muestra en consola **y** se envía a Cloudflare D1
 * a través de `/api/logs/ingest` (sendBeacon / keepalive), con **deduplicación
 * anti-spam de 5 minutos** para no saturar la base de datos en bucles de error.
 */

export type TelemetryLevel = "INFO" | "WARN" | "ERROR" | "FATAL" | "SECURITY";

export type TelemetryCategory = "SSR" | "API" | "AUTH" | "PAYMENT" | "ROUTING" | "DATABASE" | "TAXONOMY" | "CLIENT_JS";

export const TELEMETRY_DEDUPE_WINDOW_MS = 5 * 60 * 1000;

const reportedKeys = new Map<string, number>();

export interface TelemetryOptions {
  level?: TelemetryLevel;
  category?: TelemetryCategory;
  /** Identificador del recurso afectado (slug, colección, uid parcial…). */
  resource?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Reporta un fallo de datos de forma trazable y deduplicada.
 * Nunca lanza: la telemetría jamás puede romper el flujo de usuario.
 */
export function reportClientFailure(scope: string, error: unknown, options: TelemetryOptions = {}): void {
  const detail = error instanceof Error ? error.message : String(error);
  const dedupeKey = `${scope}:${options.resource ?? "-"}:${detail}`;
  const now = Date.now();
  const lastReport = reportedKeys.get(dedupeKey);
  if (lastReport !== undefined && now - lastReport < TELEMETRY_DEDUPE_WINDOW_MS) return;
  reportedKeys.set(dedupeKey, now);

  const message = `[${scope}]${options.resource ? ` resource=${options.resource}` : ""}: ${detail}`;

  try {
    console.error(message, error);
  } catch {
    // Entornos sin consola
  }

  if (typeof navigator === "undefined") return;

  try {
    const payload = JSON.stringify({
      level: options.level ?? "ERROR",
      category: options.category ?? "DATABASE",
      message,
      stack: error instanceof Error ? error.stack : undefined,
      url: typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined,
      status: 0,
      metadata: options.metadata,
    });
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/logs/ingest", new Blob([payload], { type: "application/json" }));
    } else if (typeof fetch === "function") {
      void fetch("/api/logs/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // La telemetría nunca puede romper el flujo principal
  }
}

/** Expuesto para tests: limpia la ventana de deduplicación. */
export function resetTelemetryDedupeWindow(): void {
  reportedKeys.clear();
}
