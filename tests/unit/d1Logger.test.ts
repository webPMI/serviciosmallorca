/**
 * d1Logger.test.ts
 *
 * 🗄️ COBERTURA DEL SISTEMA RESILIENTE DE LOGS EN CLOUDFLARE D1 (GR-15)
 *
 * src/lib/d1Logger.ts tenía solo ~48% de branches. Se verifica:
 *  1. Fallback sin binding D1 (dev/test): success=true sin romper ejecución.
 *  2. INSERT con truncado duro (message 2000, stack 4000, url 500, UA 300) y defaults.
 *  3. Schema DDL ejecutado una sola vez (lazy init); fallo de DDL tolerado.
 *  4. Fallo del INSERT → { success:false, error } sin lanzar.
 *  5. queryD1Logs: clamps de limit (1..100), filtros level/category, mapeo de filas
 *     (metadata JSON.parse), y [] ante errores o binding ausente.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  logToD1,
  queryD1Logs,
  createLogger,
  sanitizeSensitiveData,
  D1_SCHEMA_SQL,
  _resetTableInitializedForTesting,
  type ServerLogEntry,
} from "../../src/lib/d1Logger.ts";

const BASE_ENTRY: ServerLogEntry = {
  level: "ERROR",
  category: "API",
  message: "fallo-de-prueba",
};

function makeBinding(runImpl?: () => Promise<void>) {
  const boundArgs: unknown[][] = [];
  const run = vi.fn().mockImplementation(runImpl ?? (async () => undefined));
  const prepare = vi.fn((_sql: string) => ({
    bind: (...args: unknown[]) => {
      boundArgs.push(args);
      return { run };
    },
  }));
  const exec = vi.fn().mockResolvedValue(undefined);
  const binding = { exec, prepare, name: "D1" };
  return { binding, exec, prepare, run, boundArgs };
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  _resetTableInitializedForTesting();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("🗄️ d1Logger: logToD1 (escritura resiliente)", () => {
  it("fallback sin binding: success=true con logId generado y sin crash", async () => {
    const r1 = await logToD1(null, { ...BASE_ENTRY });
    expect(r1.success).toBe(true);
    expect(r1.logId).toMatch(/^log_\d+_/);

    const r2 = await logToD1(undefined as unknown as Record<string, never>, { ...BASE_ENTRY });
    expect(r2.success).toBe(true);

    const r3 = await logToD1({ name: "D1" } as unknown as Record<string, never>, { ...BASE_ENTRY });
    expect(r3.success).toBe(true); // binding sin prepare() → fallback
  });

  it("INSERT correcto: schema DDL ejecutado y 13 params enlazados con defaults", async () => {
    const { binding, exec, boundArgs } = makeBinding();
    const r = await logToD1(binding, {
      ...BASE_ENTRY,
      url: "https://serviciosmallorca.com/es/dashboard",
      metadata: { attempt: 2 },
    });

    expect(r.success).toBe(true);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec.mock.calls[0][0]).toContain("CREATE TABLE IF NOT EXISTS server_error_logs");
    expect(D1_SCHEMA_SQL).toContain("idx_logs_level");

    const args = boundArgs[0] as unknown[];
    expect(args).toHaveLength(13);
    expect(args[2]).toBe("ERROR");
    expect(args[3]).toBe("API");
    expect(args[7]).toBe("GET"); // method por defecto
    expect(args[8]).toBe(500); // status por defecto
    expect(args[9]).toBe("anonymized"); // clientIp anonimizado por defecto
    expect(args[10]).toBeNull(); // userAgent ausente
    expect(args[11]).toBeNull(); // userId ausente
    expect(args[12]).toBe('{"attempt":2}'); // metadata serializada
    expect(typeof args[0]).toBe("string");
    expect(typeof args[1]).toBe("string");
  });

  it("truncado duro: message≤2000, stack≤4000, url≤500, userAgent≤300", async () => {
    const { binding, boundArgs } = makeBinding();
    await logToD1(binding, {
      ...BASE_ENTRY,
      message: "m".repeat(3000),
      stack: "s".repeat(5000),
      url: "u".repeat(600),
      userAgent: "a".repeat(400),
    });
    const args = boundArgs[0] as unknown[];
    expect((args[4] as string).length).toBe(2000);
    expect((args[5] as string).length).toBe(4000);
    expect((args[6] as string).length).toBe(500);
    expect((args[10] as string).length).toBe(300);
  });

  it("respeta id/timestamp proporcionados y no los regenera", async () => {
    const { binding, boundArgs } = makeBinding();
    await logToD1(binding, {
      ...BASE_ENTRY,
      id: "custom-log-id",
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    const args = boundArgs[0] as unknown[];
    expect(args[0]).toBe("custom-log-id");
    expect(args[1]).toBe("2026-01-01T00:00:00.000Z");
  });

  it("el schema DDL se inicializa UNA sola vez aunque se loguee repeatedly", async () => {
    const { binding, exec } = makeBinding();
    await logToD1(binding, { ...BASE_ENTRY, message: "uno" });
    await logToD1(binding, { ...BASE_ENTRY, message: "dos" });
    await logToD1(binding, { ...BASE_ENTRY, message: "tres" });
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it("fallo del INSERT → { success:false, error } sin lanzar excepción", async () => {
    const { binding } = makeBinding(() => Promise.reject(new Error("D1 write error")));
    const r = await logToD1(binding, { ...BASE_ENTRY });
    expect(r.success).toBe(false);
    expect(r.error).toBe("D1 write error");
    expect(r.logId).toBeTruthy();
  });
});

describe("🗄️ d1Logger: queryD1Logs (lectura)", () => {
  const rows = [
    {
      id: "log-1",
      level: "ERROR",
      category: "API",
      message: "error-api",
      client_ip: "1.2.3.4",
      metadata: JSON.stringify({ route: "/es/x" }),
    },
    { id: "log-2", level: "SECURITY", category: "AUTH", message: "evento-seguridad", metadata: null },
  ];

  function makeQueryBinding(results: unknown[] | Error) {
    const prepare = vi.fn((_sql: string) => ({
      bind: (..._args: unknown[]) => ({
        all: async () => {
          if (results instanceof Error) throw results;
          return { results };
        },
      }),
    }));
    return { binding: { prepare }, prepare };
  }

  it("sin binding válido devuelve []", async () => {
    expect(await queryD1Logs(null)).toEqual([]);
    expect(await queryD1Logs({} as unknown as Record<string, never>)).toEqual([]);
  });

  it("mapea filas snake_case → camelCase y parsea metadata JSON", async () => {
    const { binding, prepare } = makeQueryBinding(rows);
    const logs = await queryD1Logs(binding);
    expect(logs).toHaveLength(2);
    expect(logs[0].clientIp).toBe("1.2.3.4");
    expect(logs[0].metadata).toEqual({ route: "/es/x" });
    expect(logs[1].metadata).toBeUndefined();
    expect(logs[1].level).toBe("SECURITY");
    expect(prepare.mock.calls[0][0]).toContain("ORDER BY timestamp DESC");
  });

  it("aplica filtros level/category con cláusulas AND y params enlazados", async () => {
    const { binding, prepare } = makeQueryBinding([]);
    await queryD1Logs(binding, { level: "SECURITY", category: "AUTH", limit: 3 });
    const sql = prepare.mock.calls[0][0] as string;
    expect(sql).toContain("level = ?");
    expect(sql).toContain("category = ?");
    expect(sql).toContain(" AND ");
    expect(sql).toContain("LIMIT ?");
  });

  it("clamps de limit: default 50, máximo 100, mínimo efectivo 1", async () => {
    const capture: number[][] = [];
    const binding = {
      prepare: (_sql: string) => ({
        bind: (...args: unknown[]) => {
          capture.push(args as number[]);
          return { all: async () => ({ results: [] }) };
        },
      }),
    };
    await queryD1Logs(binding, {});
    await queryD1Logs(binding, { limit: 500 });
    await queryD1Logs(binding, { limit: 0 });
    await queryD1Logs(binding, { limit: 1 });
    expect(capture.map((a) => a[a.length - 1])).toEqual([50, 100, 50, 1]);
  });

  it("error del upstream → [] sin lanzar (resiliencia)", async () => {
    const { binding } = makeQueryBinding(new Error("D1 down"));
    const logs = await queryD1Logs(binding, { level: "ERROR" });
    expect(logs).toEqual([]);
  });
});

describe("🗄️ d1Logger: estado de módulo fresco (vi.resetModules)", () => {
  it("fallo del DDL (exec) NO bloquea el INSERT posterior", async () => {
    vi.resetModules();
    const mod = await import("../../src/lib/d1Logger.ts");
    const exec = vi.fn().mockRejectedValue(new Error("table already exists"));
    const run = vi.fn().mockResolvedValue(undefined);
    const binding = { exec, prepare: () => ({ bind: () => ({ run }) }) };
    const r = await mod.logToD1(binding, { ...BASE_ENTRY });
    expect(exec).toHaveBeenCalledTimes(1);
    expect(r.success).toBe(true);
  });

  it("binding sin exec no lanza excepción y procede con INSERT", async () => {
    vi.resetModules();
    const mod = await import("../../src/lib/d1Logger.ts");
    const run = vi.fn().mockResolvedValue(undefined);
    const binding = { prepare: () => ({ bind: () => ({ run }) }) };
    const r = await mod.logToD1(binding, { ...BASE_ENTRY });
    expect(r.success).toBe(true);
  });
});

describe("🛡️ d1Logger: sanitizeSensitiveData (PII masking)", () => {
  it("ofusca contraseñas, tokens y claves secretas", () => {
    const input = {
      password: "secretPassword123",
      api_key: "key-abcdef-12345",
      token: "jwt.token.here",
      user: {
        cvv: "123",
        creditCard: "4111-2222-3333-4444",
        email: "test@example.com",
      },
    };

    const sanitized = sanitizeSensitiveData(input);
    expect(sanitized.password).toBe("[REDACTED]");
    expect(sanitized.api_key).toBe("[REDACTED]");
    expect(sanitized.token).toBe("[REDACTED]");
    expect(sanitized.user.cvv).toBe("[REDACTED]");
    expect(sanitized.user.creditCard).toBe("[REDACTED]");
    expect(sanitized.user.email).toBe("test@example.com");
  });

  it("ofusca Bearer tokens y números de tarjeta en strings de texto libre", () => {
    const text =
      "Error with authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz and card 4532 0150 9999 1234 failed";
    const res = sanitizeSensitiveData(text);
    expect(res).toContain("Bearer [REDACTED]");
    expect(res).toContain("[CARD_REDACTED]");
    expect(res).not.toContain("4532 0150 9999 1234");
  });

  it("mantiene intactos valores primitivos no sensibles, null y undefined", () => {
    expect(sanitizeSensitiveData(null)).toBeNull();
    expect(sanitizeSensitiveData(undefined)).toBeUndefined();
    expect(sanitizeSensitiveData(42)).toBe(42);
    expect(sanitizeSensitiveData("safe text string")).toBe("safe text string");
  });
});

describe("🛡️ d1Logger: createLogger (ergonomía y métodos contextuales)", () => {
  function makeMockContext() {
    const entries: unknown[] = [];
    const run = vi.fn().mockResolvedValue(undefined);
    const prepare = vi.fn(() => ({
      bind: (...args: unknown[]) => {
        entries.push(args);
        return { run };
      },
    }));
    const exec = vi.fn().mockResolvedValue(undefined);
    const context = {
      locals: { DB: { prepare, exec } },
      url: { pathname: "/es/test-route" },
      request: { method: "POST" },
    };
    return { context, entries };
  }

  it("permite invocar .info(), .warn(), .security() con metadatos combinados", async () => {
    const { context, entries } = makeMockContext();
    const logger = createLogger("SSR", context, { app: "mallorca-core" });

    await logger.info("Página cargada", { cacheHit: true });
    await logger.warn("Alerta de rendimiento", { latency: 350 });
    await logger.security("Intento de inyección detectado");

    expect(entries).toHaveLength(3);
    const firstArgs = entries[0] as unknown[];
    expect(firstArgs[2]).toBe("INFO");
    expect(firstArgs[3]).toBe("SSR");
    expect(firstArgs[6]).toBe("/es/test-route");
    expect(firstArgs[7]).toBe("POST");

    const meta = JSON.parse(firstArgs[12] as string);
    expect(meta.app).toBe("mallorca-core");
    expect(meta.cacheHit).toBe(true);
  });

  it(".error() y .fatal() extraen stack de Error instances correctamente", async () => {
    const { context, entries } = makeMockContext();
    const logger = createLogger("API", context);

    const error = new Error("Database timeout");
    await logger.error("Fallo de API", error, { retry: 1 });
    await logger.fatal("Caída crítica de servicio", error);

    expect(entries).toHaveLength(2);
    const errArgs = entries[0] as unknown[];
    expect(errArgs[2]).toBe("ERROR");
    expect(errArgs[4]).toBe("Fallo de API");
    expect(errArgs[5]).toContain("Error: Database timeout");

    const fatalArgs = entries[1] as unknown[];
    expect(fatalArgs[2]).toBe("FATAL");
  });

  it(".time() y .timeEnd() calculan el tiempo transcurrido y loguean métrica", async () => {
    const { context, entries } = makeMockContext();
    const logger = createLogger("DATABASE", context);

    logger.time("fetch-categories");
    const elapsed = await logger.timeEnd("fetch-categories", { source: "cache" });

    expect(typeof elapsed).toBe("number");
    expect(entries).toHaveLength(1);
    const timeArgs = entries[0] as unknown[];
    expect(timeArgs[2]).toBe("INFO");
    expect(timeArgs[4]).toContain("Timer [fetch-categories]");
  });

  it(".child() hereda y extiende metadatos base", async () => {
    const { context, entries } = makeMockContext();
    const parent = createLogger("ROUTING", context, { region: "palma" });
    const child = parent.child({ serviceId: "rest-123" });

    await child.info("Ruta visitada");
    expect(entries).toHaveLength(1);
    const meta = JSON.parse((entries[0] as unknown[])[12] as string);
    expect(meta.region).toBe("palma");
    expect(meta.serviceId).toBe("rest-123");
  });
});
