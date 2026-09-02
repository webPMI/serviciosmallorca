/**
 * src/lib/rateLimiter.ts
 *
 * Motor de limitación de tasa (Rate Limiting) para Cloudflare Workers & SSR.
 * Protege endpoints públicos contra abusos, spam y ataques de denegación de servicio.
 * Cumple estrictamente con el RGPD anonimizando las IPs de origen.
 */

export interface RateLimitOptions {
  /** Número máximo de solicitudes permitidas dentro de la ventana de tiempo. Por defecto: 10 */
  limit?: number;
  /** Duración de la ventana de tiempo en milisegundos. Por defecto: 60000 ms (1 minuto) */
  windowMs?: number;
  /** Prefijo de clave para aislar diferentes endpoints o acciones. Por defecto: "default" */
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number; // Timestamp en ms cuando expira la ventana actual
  retryAfterSeconds: number;
}

interface MemoryEntry {
  count: number;
  resetAt: number;
}

// Almacén en memoria volátil (usado en dev, tests o si no hay KV binding)
const memoryStore = new Map<string, MemoryEntry>();

/**
 * Limpia entradas expiradas periódicamente para evitar fugas de memoria
 */
function cleanupExpiredMemoryEntries(): void {
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (now >= entry.resetAt) {
      memoryStore.delete(key);
    }
  }
}

/**
 * Resetea el almacén en memoria para pruebas unitarias.
 */
export function resetRateLimitsForTesting(): void {
  memoryStore.clear();
}

/**
 * Extrae y anonimiza la dirección IP de la solicitud para cumplir el RGPD (GR-13).
 */
export function extractClientIdentifier(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  const rawIp = cfIp || forwarded?.split(",")[0]?.trim() || realIp || "127.0.0.1";

  // Anonimizar IPv4 (dejar solo los primeros 2 octetos)
  if (rawIp.includes(".")) {
    const parts = rawIp.split(".");
    return `${parts.slice(0, 2).join(".")}.x.x`;
  }

  // Anonimizar IPv6 (dejar solo los primeros 3 bloques)
  if (rawIp.includes(":")) {
    const parts = rawIp.split(":");
    return `${parts.slice(0, 3).join(":")}::x`;
  }

  return rawIp;
}

/**
 * Verifica si una solicitud supera el límite de tasa permitido.
 */
export async function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {},
  kvBinding?: any,
): Promise<RateLimitResult> {
  const limit = options.limit ?? 10;
  const windowMs = options.windowMs ?? 60000;
  const keyPrefix = options.keyPrefix ?? "rate-limit";

  const clientIdentifier = extractClientIdentifier(request);
  const now = Date.now();
  const storageKey = `rl:${keyPrefix}:${clientIdentifier}`;

  // 1. Uso de Cloudflare KV si el binding está disponible
  if (kvBinding && typeof kvBinding.get === "function" && typeof kvBinding.put === "function") {
    try {
      const existingData = await kvBinding.get(storageKey, { type: "json" });
      if (existingData && typeof existingData.count === "number" && typeof existingData.resetAt === "number") {
        if (now < existingData.resetAt) {
          const newCount = existingData.count + 1;
          const remaining = Math.max(0, limit - newCount);
          const allowed = newCount <= limit;
          const retryAfterSeconds = Math.max(1, Math.ceil((existingData.resetAt - now) / 1000));

          // Actualizar conteo manteniendo el TTL original
          const ttlSeconds = Math.max(60, Math.ceil((existingData.resetAt - now) / 1000));
          await kvBinding.put(
            storageKey,
            JSON.stringify({ count: newCount, resetAt: existingData.resetAt }),
            { expirationTtl: ttlSeconds },
          );

          return {
            allowed,
            remaining,
            limit,
            resetAt: existingData.resetAt,
            retryAfterSeconds: allowed ? 0 : retryAfterSeconds,
          };
        }
      }

      // Nueva ventana en KV
      const resetAt = now + windowMs;
      const ttlSeconds = Math.max(60, Math.ceil(windowMs / 1000));
      await kvBinding.put(
        storageKey,
        JSON.stringify({ count: 1, resetAt }),
        { expirationTtl: ttlSeconds },
      );

      return {
        allowed: true,
        remaining: limit - 1,
        limit,
        resetAt,
        retryAfterSeconds: 0,
      };
    } catch {
      // Si KV falla, degradar elegantemente al almacén en memoria
    }
  }

  // 2. Fallback de Almacén en Memoria
  cleanupExpiredMemoryEntries();

  const entry = memoryStore.get(storageKey);

  if (entry && now < entry.resetAt) {
    entry.count += 1;
    const remaining = Math.max(0, limit - entry.count);
    const allowed = entry.count <= limit;
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    return {
      allowed,
      remaining,
      limit,
      resetAt: entry.resetAt,
      retryAfterSeconds: allowed ? 0 : retryAfterSeconds,
    };
  }

  // Nueva ventana en memoria
  const resetAt = now + windowMs;
  memoryStore.set(storageKey, { count: 1, resetAt });

  return {
    allowed: true,
    remaining: limit - 1,
    limit,
    resetAt,
    retryAfterSeconds: 0,
  };
}

/**
 * Genera una respuesta estándar HTTP 429 Too Many Requests con cabeceras estándar.
 */
export function createRateLimitResponse(
  result: RateLimitResult,
  customMessage = "Demasiadas solicitudes. Por favor, inténtelo de nuevo en unos momentos.",
): Response {
  return new Response(
    JSON.stringify({
      error: "TOO_MANY_REQUESTS",
      message: customMessage,
      retryAfter: result.retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.retryAfterSeconds),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        "Cache-Control": "no-store",
      },
    },
  );
}
