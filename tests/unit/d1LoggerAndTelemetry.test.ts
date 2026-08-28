import { describe, it, expect, vi } from "vitest";
import { logToD1, queryD1Logs, D1_SCHEMA_SQL, type ServerLogEntry } from "../../src/lib/d1Logger";

describe("🛡️ Cloudflare D1 Error Logger & Telemetry Suite (2026)", () => {
  it("contiene el schema SQL válido con índices para consulta eficiente", () => {
    expect(D1_SCHEMA_SQL).toContain("CREATE TABLE IF NOT EXISTS server_error_logs");
    expect(D1_SCHEMA_SQL).toContain("idx_logs_timestamp");
    expect(D1_SCHEMA_SQL).toContain("idx_logs_level");
    expect(D1_SCHEMA_SQL).toContain("idx_logs_category");
  });

  it("logToD1 opera en modo fallback seguro si d1Binding es null o undefined", async () => {
    const entry: ServerLogEntry = {
      level: "ERROR",
      category: "SSR",
      message: "Test fallback error",
    };

    const res = await logToD1(null, entry);
    expect(res.success).toBe(true);
    expect(res.logId).toMatch(/^log_/);
  });

  it("logToD1 ejecuta bind e insert en D1 cuando el binding está presente", async () => {
    const mockRun = vi.fn().mockResolvedValue({ success: true });
    const mockBind = vi.fn().mockReturnValue({ run: mockRun });
    const mockPrepare = vi.fn().mockReturnValue({ bind: mockBind });
    const mockExec = vi.fn().mockResolvedValue(true);

    const mockD1 = {
      exec: mockExec,
      prepare: mockPrepare,
    };

    const entry: ServerLogEntry = {
      level: "FATAL",
      category: "DATABASE",
      message: "Conexión rechazada por timeout",
      stack: "Error: Conexión rechazada\n    at db.ts:42:10",
      url: "/es/cuadro-de-honor",
      method: "GET",
      status: 503,
      userId: "usr_admin_1",
      metadata: { retryCount: 3 },
    };

    const res = await logToD1(mockD1, entry);
    expect(res.success).toBe(true);
    expect(mockPrepare).toHaveBeenCalled();
    expect(mockBind).toHaveBeenCalledWith(
      res.logId,
      expect.any(String),
      "FATAL",
      "DATABASE",
      "Conexión rechazada por timeout",
      expect.stringContaining("Error: Conexión rechazada"),
      "/es/cuadro-de-honor",
      "GET",
      503,
      "anonymized",
      null,
      "usr_admin_1",
      JSON.stringify({ retryCount: 3 }),
    );
    expect(mockRun).toHaveBeenCalled();
  });

  it("queryD1Logs construye consultas filtradas por nivel y categoría", async () => {
    const mockAll = vi.fn().mockResolvedValue({
      results: [
        {
          id: "log_1",
          timestamp: "2026-08-28T12:00:00Z",
          level: "ERROR",
          category: "PAYMENT",
          message: "Tarjeta declinada por 3DS",
          stack: null,
          url: "/es/checkout",
          method: "POST",
          status: 402,
          client_ip: "1.2.3.4",
          user_agent: "Mozilla/5.0",
          user_id: "u123",
          metadata: '{"cardBrand":"visa"}',
        },
      ],
    });
    const mockBind = vi.fn().mockReturnValue({ all: mockAll });
    const mockPrepare = vi.fn().mockReturnValue({ bind: mockBind });

    const mockD1 = {
      prepare: mockPrepare,
    };

    const logs = await queryD1Logs(mockD1, {
      limit: 10,
      level: "ERROR",
      category: "PAYMENT",
    });

    expect(logs.length).toBe(1);
    expect(logs[0].category).toBe("PAYMENT");
    expect(logs[0].metadata).toEqual({ cardBrand: "visa" });
    expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining("WHERE level = ? AND category = ?"));
  });

  it("aplica deduplicación inteligente (anti-spam) en ráfagas de errores idénticos", async () => {
    const mockRun = vi.fn().mockResolvedValue({ success: true });
    const mockBind = vi.fn().mockReturnValue({ run: mockRun });
    const mockPrepare = vi.fn().mockReturnValue({ bind: mockBind });
    const mockExec = vi.fn().mockResolvedValue(true);

    const mockD1 = { exec: mockExec, prepare: mockPrepare };

    const entry: ServerLogEntry = {
      level: "ERROR",
      category: "ROUTING",
      message: "404 Not Found route spam test",
      url: "/es/recurso-inexistente-123",
      status: 404,
    };

    // 1er intento: debe registrarse normalmente
    const res1 = await logToD1(mockD1, entry);
    expect(res1.success).toBe(true);
    expect(res1.throttled).toBeFalsy();

    // 2do intento inmediato: debe ser silenciado / throttled para proteger D1
    const res2 = await logToD1(mockD1, entry);
    expect(res2.success).toBe(true);
    expect(res2.throttled).toBe(true);

    // 3er intento inmediato: sigue silenciado
    const res3 = await logToD1(mockD1, entry);
    expect(res3.throttled).toBe(true);

    // Errores de SECURITY y PAYMENT NO se silencian nunca
    const secEntry: ServerLogEntry = {
      level: "SECURITY",
      category: "AUTH",
      message: "CSRF token mismatch detected",
      url: "/api/checkout",
    };
    const secRes1 = await logToD1(mockD1, secEntry);
    const secRes2 = await logToD1(mockD1, secEntry);
    expect(secRes1.throttled).toBeFalsy();
    expect(secRes2.throttled).toBeFalsy();
  });
});
