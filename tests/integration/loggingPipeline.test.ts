import { describe, it, expect, beforeEach } from "vitest";
import { createMockD1Database } from "../helpers/d1Mock";
import { createLogger, logToD1, queryD1Logs, _resetTableInitializedForTesting } from "../../src/lib/d1Logger";
import { POST as ingestPost } from "../../src/pages/api/logs/ingest";
import { GET as queryGet } from "../../src/pages/api/logs/query";
import { POST as telemetryPost } from "../../src/pages/api/telemetry";

describe("📡 Logging & Telemetry Pipeline Integration Suite (2026)", () => {
  let mockDb: ReturnType<typeof createMockD1Database>;

  beforeEach(() => {
    _resetTableInitializedForTesting();
    mockDb = createMockD1Database();
  });

  it("ciclo completo: Ingest API registra log en Cloudflare D1 con sanitización PII", async () => {
    const fakeContext: any = {
      locals: { DB: mockDb },
      request: new Request("https://serviciosmallorca.com/api/logs/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cf-connecting-ip": "84.120.45.10",
          "user-agent": "Mozilla/5.0 Vitest/TestRunner",
        },
        body: JSON.stringify({
          level: "ERROR",
          category: "CLIENT_JS",
          message: "Uncaught TypeError: test error",
          url: "/es/servicios/reformas-palma",
          metadata: {
            authHeader: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummysecretpayload",
            password: "superSecretPassword123!",
            safeField: "safeValue",
          },
        }),
      }),
    };

    const response = await ingestPost(fakeContext);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.logId).toMatch(/^log_/);

    // Verificar en la base de datos mock D1
    const storedLogs = mockDb._tables.get("server_error_logs") || [];
    expect(storedLogs.length).toBe(1);

    const record = storedLogs[0];
    expect(record.level).toBe("ERROR");
    expect(record.category).toBe("CLIENT_JS");
    expect(record.client_ip).toBe("84.120.45.10");

    // Verificar sanitización de PII
    const meta = JSON.parse(record.metadata);
    expect(meta.password).toBe("[REDACTED]");
    expect(meta.authHeader).toBe("Bearer [REDACTED]");
    expect(meta.safeField).toBe("safeValue");
  });

  it("ciclo completo: Telemetry API registra y propaga D1 binding desde context", async () => {
    const fakeContext: any = {
      locals: { runtime: { env: { DB: mockDb } } },
      request: new Request("https://serviciosmallorca.com/api/telemetry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.50",
        },
        body: JSON.stringify({
          level: "WARN",
          category: "SSR",
          message: "Cache miss warning in telemetry",
          url: "/es/cuadro-de-honor",
          metadata: {
            cardNumber: "4532 1111 2222 3333",
          },
        }),
      }),
    };

    const res = await telemetryPost(fakeContext);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    const storedLogs = mockDb._tables.get("server_error_logs") || [];
    expect(storedLogs.length).toBe(1);
    expect(storedLogs[0].level).toBe("WARN");

    const meta = JSON.parse(storedLogs[0].metadata);
    expect(meta.cardNumber).toBe("[REDACTED]");
  });

  it("ciclo completo: Query API filtra logs por nivel y categoría desde D1", async () => {
    // Insertamos logs previos mediante logToD1
    await logToD1(mockDb, {
      level: "ERROR",
      category: "API",
      message: "API error 1",
    });
    await logToD1(mockDb, {
      level: "SECURITY",
      category: "AUTH",
      message: "Potential brute force attempt",
    });
    await logToD1(mockDb, {
      level: "WARN",
      category: "ROUTING",
      message: "Deprecated route access",
    });

    // 1. Consulta general
    const queryContextAll: any = {
      locals: { DB: mockDb },
      request: new Request("https://serviciosmallorca.com/api/logs/query?limit=10"),
    };
    const resAll = await queryGet(queryContextAll);
    const dataAll = await resAll.json();
    expect(dataAll.success).toBe(true);
    expect(dataAll.count).toBe(3);

    // 2. Consulta filtrada por level=SECURITY
    const queryContextSec: any = {
      locals: { DB: mockDb },
      request: new Request("https://serviciosmallorca.com/api/logs/query?level=SECURITY"),
    };
    const resSec = await queryGet(queryContextSec);
    const dataSec = await resSec.json();
    expect(dataSec.success).toBe(true);
    expect(dataSec.count).toBe(1);
    expect(dataSec.logs[0].category).toBe("AUTH");
  });

  it("createLogger ofrece ergonomía con métodos tipados y profiling de tiempos", async () => {
    const logger = createLogger("SSR", { locals: { DB: mockDb }, url: "/es/test-logger" });

    await logger.info("Mensaje informativo", { reqId: "req_1" });
    await logger.warn("Advertencia leve");
    await logger.security("Acceso sospechoso bloqueado");

    const err = new Error("Fallo de renderizado reactivo");
    await logger.error("Error capturado", err, { component: "Hero" });

    // Profiling
    logger.time("load-db");
    // Pequeño delay simulado
    const elapsed = await logger.timeEnd("load-db", { query: "SELECT" });
    expect(typeof elapsed).toBe("number");
    expect(elapsed).toBeGreaterThanOrEqual(0);

    const logs = await queryD1Logs(mockDb, { limit: 10 });
    expect(logs.length).toBe(5);

    const errorLog = logs.find((l) => l.level === "ERROR");
    expect(errorLog).toBeDefined();
    expect(errorLog?.message).toBe("Error capturado");
    expect(errorLog?.stack).toContain("Fallo de renderizado reactivo");
    expect(errorLog?.metadata?.component).toBe("Hero");
  });

  it("logger.child crea sub-loggers enriquecidos con contexto heredado", async () => {
    const rootLogger = createLogger("API", mockDb, { service: "auth-service" });
    const childLogger = rootLogger.child({ requestId: "req-999" });

    await childLogger.info("Petición procesada");

    const logs = await queryD1Logs(mockDb);
    expect(logs.length).toBe(1);
    expect(logs[0].metadata?.service).toBe("auth-service");
    expect(logs[0].metadata?.requestId).toBe("req-999");
  });
});
