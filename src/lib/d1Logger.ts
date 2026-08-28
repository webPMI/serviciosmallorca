/**
 * d1Logger.ts
 *
 * 🛡️ SISTEMA RESILIENTE DE LOGS Y TELEMETRÍA DE ERRORES EN CLOUDFLARE D1 (2026)
 *
 * Captura, cataloga y persiste cualquier error que ocurra tanto en el servidor SSR (Astro/Cloudflare Workers)
 * como en el cliente (Browser), guardándolo en Cloudflare D1 para su auditoría y revisión técnica.
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

// ── D1 BINDING HELPER ───────────────────────────────────────────────────────
export function getD1Binding(context?: any): any {
  if (context?.locals?.runtime?.env?.DB) return context.locals.runtime.env.DB;
  if (context?.locals?.DB) return context.locals.DB;
  if (context?.env?.DB) return context.env.DB;
  if ((globalThis as any)?.DB) return (globalThis as any).DB;
  if (context && typeof context.prepare === "function") return context;
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
  if (entry.level === "SECURITY" || entry.category === "PAYMENT") {
    return { throttle: false, count: 1 };
  }

  const key = generateDedupKey(entry);
  const now = Date.now();
  const existing = dedupCache.get(key);

  if (existing) {
    if (now - existing.firstSeen < DEDUP_WINDOW_MS) {
      existing.count += 1;
      existing.lastSeen = now;
      // Permitir el primer registro, y luego solo avisar cada 20 repeticiones
      const shouldLog = existing.count === 20 || existing.count === 50 || existing.count % 100 === 0;
      return { throttle: !shouldLog, count: existing.count };
    } else {
      // Ventana expirada, resetear contador
      dedupCache.set(key, { firstSeen: now, lastSeen: now, count: 1 });
      return { throttle: false, count: 1 };
    }
  }

  // Limpieza periódica de caché si crece demasiado
  if (dedupCache.size > 1000) {
    for (const [k, v] of dedupCache.entries()) {
      if (now - v.lastSeen > DEDUP_WINDOW_MS) dedupCache.delete(k);
    }
  }

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
  const d1Binding = getD1Binding(d1BindingOrContext);
  const { throttle, count } = shouldThrottleLog(entry);

  if (throttle) {
    return { success: true, logId: "throttled_duplicate", throttled: true };
  }

  const logId = entry.id || `log_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const timestamp = entry.timestamp || new Date().toISOString();

  const enrichedMetadata = {
    ...(entry.metadata || {}),
    ...(count > 1 ? { _duplicateOccurrencesInWindow: count } : {}),
  };
  const metaStr = JSON.stringify(enrichedMetadata);

  // Log formateado en consola para monitorización en tiempo real
  const icon = entry.level === "SECURITY" ? "🚨" : entry.level === "FATAL" || entry.level === "ERROR" ? "💥" : "⚠️";
  console.error(
    `[D1-Logger] ${icon} [${entry.level}] [${entry.category}] ${entry.message} ${count > 1 ? `(Repetido x${count})` : ""} ${entry.url ? `(URL: ${entry.url})` : ""}`,
  );

  // Si no hay binding D1 presente, salimos con éxito en modo fallback
  if (!d1Binding || typeof d1Binding.prepare !== "function") {
    return { success: true, logId };
  }

  try {
    // Inicializar tabla de forma perezosa una sola vez
    if (!isTableInitialized) {
      try {
        await d1Binding.exec(D1_SCHEMA_SQL);
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
  d1Binding: any,
  options: {
    limit?: number;
    level?: LogLevel;
    category?: LogCategory;
  } = {},
): Promise<ServerLogEntry[]> {
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
