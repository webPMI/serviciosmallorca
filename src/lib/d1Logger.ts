/**
 * d1Logger.ts
 *
 * 🛡️ SISTEMA RESILIENTE DE LOGS, TELEMETRÍA Y AUDITORÍA EN CLOUDFLARE D1 (2026)
 *
 * Captura, cataloga y persiste cualquier error que ocurra tanto en el servidor SSR (Astro/Cloudflare Workers)
 * como en el cliente (Browser), guardándolo en Cloudflare D1 para su auditoría y revisión técnica.
 * Incluye sanitización automática de datos sensibles (PII), control de deduplicación y API ergonómica `createLogger`.
 */

export type LogLevel = "INFO" | "WARN" | "ERROR" | "FATAL" | "SECURITY";

export type LogCategory = "SSR" | "API" | "AUTH" | "PAYMENT" | "ROUTING" | "DATABASE" | "TAXONOMY" | "CLIENT_JS";

export interface ServerLogEntry {
  id?: string;
  timestamp?: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  stack?: string;
  url?: string;
  method?: string;
  status?: number;
  clientIp?: string;
  userAgent?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export const D1_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS server_error_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  method TEXT,
  status INTEGER,
  client_ip TEXT,
  user_agent TEXT,
  user_id TEXT,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON server_error_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_level ON server_error_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_category ON server_error_logs(category);
`;

// ── SANITIZACIÓN DE DATOS SENSIBLES (PII & SECURITY MASKING) ────────────────
const SENSITIVE_KEYS = new Set([
  "password",
  "pass",
  "token",
  "authorization",
  "auth",
  "secret",
  "apikey",
  "api_key",
  "cardnumber",
  "card_number",
  "cvv",
  "cvc",
  "creditcard",
  "credit_card",
  "dni",
  "nie",
]);

/**
 * Ofusca recursivamente claves sensibles en objetos de metadatos para evitar fugas de PII en D1 o consola.
 */
export function sanitizeSensitiveData(val: any, depth = 0): any {
  if (depth > 6 || val === null || val === undefined) return val;
  if (typeof val === "string") {
    let str = val;
    // Ofuscar Bearer tokens si aparecen en strings
    if (/bearer\s+[a-zA-Z0-9_\-\.]{15,}/i.test(str)) {
      str = str.replace(/bearer\s+[a-zA-Z0-9_\-\.]+/gi, "Bearer [REDACTED]");
    }
    // Ofuscar números de tarjetas de crédito potenciales (13 a 19 dígitos)
    if (/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{1,4}\b/.test(str)) {
      str = str.replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{1,4}\b/g, "[CARD_REDACTED]");
    }
    return str;
  }
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeSensitiveData(item, depth + 1));
  }
  if (typeof val === "object") {
    const sanitized: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      const lowerKey = k.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (SENSITIVE_KEYS.has(lowerKey)) {
        sanitized[k] = "[REDACTED]";
      } else {
        sanitized[k] = sanitizeSensitiveData(v, depth + 1);
      }
    }
    return sanitized;
  }
  return val;
}

// ── D1 BINDING HELPER ───────────────────────────────────────────────────────
export function getD1Binding(context?: any): any {
  if (context && typeof context.prepare === "function") return context;
  if (context?.DB && typeof context.DB.prepare === "function") return context.DB;
  if (context?.locals?.DB && typeof context.locals.DB.prepare === "function") return context.locals.DB;
  if (context?.env?.DB && typeof context.env.DB.prepare === "function") return context.env.DB;

  try {
    if (context?.locals?.runtime?.env?.DB) return context.locals.runtime.env.DB;
  } catch {
    // Astro v6+ deprecation proxy throws on runtime.env access
  }

  if ((globalThis as any)?.DB && typeof (globalThis as any).DB.prepare === "function") {
    return (globalThis as any).DB;
  }
  if ((globalThis as any)?.env?.DB && typeof (globalThis as any).env.DB.prepare === "function") {
    return (globalThis as any).env.DB;
  }
  return undefined;
}

// ── DEDUPLICACIÓN DE ERRORES (ANTI-SPAM / RATE-LIMITING) ────────────────────
interface DedupEntry {
  firstSeen: number;
  lastSeen: number;
  count: number;
}

// Cache en memoria con TTL de 5 minutos para evitar inundar D1 con miles del mismo error
const dedupCache = new Map<string, DedupEntry>();
const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutos

function generateDedupKey(entry: ServerLogEntry): string {
  const cleanMsg = (entry.message || "").replace(/\d+/g, "X").slice(0, 150);
  const cleanUrl = (entry.url || "").split("?")[0];
  return `${entry.level}:${entry.category}:${cleanMsg}:${entry.status || 0}:${cleanUrl}`;
}

export function shouldThrottleLog(entry: ServerLogEntry): { throttle: boolean; count: number } {
  // Errores de seguridad o transacciones financieras críticas siempre se registran
  if (entry.level === "SECURITY" || entry.level === "FATAL" || entry.category === "PAYMENT") {
    return { throttle: false, count: 1 };
  }

  const key = generateDedupKey(entry);
  const now = Date.now();
  const existing = dedupCache.get(key);

  if (!existing) {
    dedupCache.set(key, { firstSeen: now, lastSeen: now, count: 1 });
    return { throttle: false, count: 1 };
  }

  // Si está dentro de la ventana de dedup
  if (now - existing.firstSeen < DEDUP_WINDOW_MS) {
    existing.count += 1;
    existing.lastSeen = now;
    // Permitir el 1º, 10º y luego cada 50 para no silenciar anomalías masivas persistentes
    if (existing.count === 10 || existing.count % 50 === 0) {
      return { throttle: false, count: existing.count };
    }
    return { throttle: true, count: existing.count };
  }

  // Fuera de la ventana: reiniciar
  dedupCache.set(key, { firstSeen: now, lastSeen: now, count: 1 });
  return { throttle: false, count: 1 };
}

let isTableInitialized = false;

export function _resetTableInitializedForTesting(): void {
  isTableInitialized = false;
  dedupCache.clear();
}

/**
 * Registra un error o evento de auditoría en la base de datos Cloudflare D1.
 * Si el binding D1 no está disponible (ej. entorno de desarrollo o pruebas), registra en consola y memoria sin romper la ejecución.
 */
export async function logToD1(
  d1BindingOrContext: any,
  entry: ServerLogEntry,
): Promise<{ success: boolean; logId: string; throttled?: boolean; error?: string }> {
  let d1Binding = getD1Binding(d1BindingOrContext);

  if (!d1Binding || typeof d1Binding.prepare !== "function") {
    try {
      const cfMod = "cloudflare:workers";
      // @ts-ignore
      const cfWorkers = await import(/* @vite-ignore */ cfMod).catch(() => null);
      if (cfWorkers?.env?.DB && typeof cfWorkers.env.DB.prepare === "function") {
        d1Binding = cfWorkers.env.DB;
      }
    } catch {
      // Ignorar en entornos sin módulo cloudflare:workers
    }
  }

  const { throttle, count } = shouldThrottleLog(entry);

  if (throttle) {
    return { success: true, logId: "throttled_duplicate", throttled: true };
  }

  const logId = entry.id || `log_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const timestamp = entry.timestamp || new Date().toISOString();

  const rawMetadata = {
    ...(entry.metadata || {}),
    ...(count > 1 ? { _duplicateOccurrencesInWindow: count } : {}),
  };
  const enrichedMetadata = sanitizeSensitiveData(rawMetadata);
  const metaStr = JSON.stringify(enrichedMetadata);

  // Control de ruido en consola: en entorno de test solo se imprime si DEBUG_LOGS está activo
  const isTest = typeof process !== "undefined" && process.env?.NODE_ENV === "test" && !process.env?.DEBUG_LOGS;
  if (!isTest) {
    const icon = entry.level === "SECURITY" ? "🚨" : entry.level === "FATAL" || entry.level === "ERROR" ? "💥" : "⚠️";
    console.error(
      `[D1-Logger] ${icon} [${entry.level}] [${entry.category}] ${entry.message} ${count > 1 ? `(Repetido x${count})` : ""} ${entry.url ? `(URL: ${entry.url})` : ""}`,
    );
  }

  // Si no hay binding D1 presente, salimos con éxito en modo fallback
  if (!d1Binding || typeof d1Binding.prepare !== "function") {
    return { success: true, logId };
  }

  try {
    // Inicializar tabla de forma perezosa una sola vez
    if (!isTableInitialized) {
      try {
        if (typeof d1Binding.exec === "function") {
          await d1Binding.exec(D1_SCHEMA_SQL);
        }
        isTableInitialized = true;
      } catch (tableErr) {
        console.warn("[D1-Logger] Table init warning:", tableErr);
      }
    }

    const stmt = d1Binding.prepare(`
      INSERT INTO server_error_logs (
        id, timestamp, level, category, message, stack, url, method, status, client_ip, user_agent, user_id, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt
      .bind(
        logId,
        timestamp,
        entry.level,
        entry.category,
        entry.message.slice(0, 2000),
        entry.stack ? entry.stack.slice(0, 4000) : null,
        entry.url ? entry.url.slice(0, 500) : null,
        entry.method || "GET",
        entry.status || 500,
        entry.clientIp || "anonymized",
        entry.userAgent ? entry.userAgent.slice(0, 300) : null,
        entry.userId || null,
        metaStr,
      )
      .run();

    return { success: true, logId };
  } catch (err: any) {
    console.error("[D1-Logger] Failed to write log to Cloudflare D1:", err);
    return { success: false, logId, error: err.message };
  }
}

/**
 * Consulta los logs de error más recientes almacenados en Cloudflare D1.
 */
export async function queryD1Logs(
  d1BindingOrContext: any,
  options: {
    limit?: number;
    level?: LogLevel;
    category?: LogCategory;
  } = {},
): Promise<ServerLogEntry[]> {
  const d1Binding = getD1Binding(d1BindingOrContext);
  if (!d1Binding || typeof d1Binding.prepare !== "function") {
    return [];
  }

  const limit = Math.min(100, Math.max(1, options.limit || 50));
  let sql = "SELECT * FROM server_error_logs";
  const params: any[] = [];
  const clauses: string[] = [];

  if (options.level) {
    clauses.push("level = ?");
    params.push(options.level);
  }
  if (options.category) {
    clauses.push("category = ?");
    params.push(options.category);
  }

  if (clauses.length > 0) {
    sql += " WHERE " + clauses.join(" AND ");
  }

  sql += " ORDER BY timestamp DESC LIMIT ?";
  params.push(limit);

  try {
    const { results } = await d1Binding
      .prepare(sql)
      .bind(...params)
      .all();
    return (results || []).map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      level: row.level as LogLevel,
      category: row.category as LogCategory,
      message: row.message,
      stack: row.stack,
      url: row.url,
      method: row.method,
      status: row.status,
      clientIp: row.client_ip,
      userAgent: row.user_agent,
      userId: row.user_id,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    }));
  } catch (err) {
    console.error("[D1-Logger] Query error:", err);
    return [];
  }
}

// ── FACTORÍA ERGONÓMICA DE LOGGING ESTRUCTURADO ─────────────────────────────
export interface AppLogger {
  info(message: string, metadata?: Record<string, any>): Promise<{ success: boolean; logId: string }>;
  warn(message: string, metadata?: Record<string, any>): Promise<{ success: boolean; logId: string }>;
  error(
    message: string,
    errorOrStack?: unknown,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean; logId: string }>;
  security(message: string, metadata?: Record<string, any>): Promise<{ success: boolean; logId: string }>;
  fatal(
    message: string,
    errorOrStack?: unknown,
    metadata?: Record<string, any>,
  ): Promise<{ success: boolean; logId: string }>;
  time(label: string): void;
  timeEnd(label: string, metadata?: Record<string, any>): Promise<number>;
  child(extraMetadata: Record<string, any>): AppLogger;
}

/**
 * Crea una instancia de Logger contextual para un módulo o petición.
 *
 * @example
 * const logger = createLogger("SSR", context);
 * await logger.info("Página renderizada con éxito", { durationMs: 45 });
 * await logger.error("Fallo de conexión", error, { userId: "123" });
 */
export function createLogger(category: LogCategory, context?: any, baseMetadata: Record<string, any> = {}): AppLogger {
  const timers = new Map<string, number>();

  const logHelper = (level: LogLevel, message: string, errorOrStack?: unknown, metadata?: Record<string, any>) => {
    let stack: string | undefined;
    let actualMsg = message;

    if (errorOrStack instanceof Error) {
      stack = errorOrStack.stack;
      if (!actualMsg) actualMsg = errorOrStack.message;
    } else if (typeof errorOrStack === "string") {
      stack = errorOrStack;
    }

    const combinedMeta = {
      ...baseMetadata,
      ...(metadata || {}),
    };

    const entry: ServerLogEntry = {
      level,
      category,
      message: actualMsg,
      stack,
      url: context?.url?.pathname || (typeof context?.url === "string" ? context.url : undefined),
      method: context?.request?.method,
      metadata: combinedMeta,
    };

    return logToD1(context, entry);
  };

  return {
    info(msg, meta) {
      return logHelper("INFO", msg, undefined, meta);
    },
    warn(msg, meta) {
      return logHelper("WARN", msg, undefined, meta);
    },
    error(msg, err, meta) {
      return logHelper("ERROR", msg, err, meta);
    },
    security(msg, meta) {
      return logHelper("SECURITY", msg, undefined, meta);
    },
    fatal(msg, err, meta) {
      return logHelper("FATAL", msg, err, meta);
    },
    time(label: string) {
      timers.set(label, Date.now());
    },
    async timeEnd(label: string, meta = {}) {
      const start = timers.get(label);
      const elapsed = start ? Date.now() - start : 0;
      timers.delete(label);
      await logHelper("INFO", `Timer [${label}]: ${elapsed}ms`, undefined, {
        ...meta,
        timerLabel: label,
        elapsedMs: elapsed,
      });
      return elapsed;
    },
    child(extraMetadata: Record<string, any>) {
      return createLogger(category, context, {
        ...baseMetadata,
        ...extraMetadata,
      });
    },
  };
}
