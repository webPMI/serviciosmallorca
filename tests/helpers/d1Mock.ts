import { vi } from "vitest";

export interface MockD1Record {
  [column: string]: any;
}

export interface MockD1Database {
  exec: ReturnType<typeof vi.fn>;
  prepare: ReturnType<typeof vi.fn>;
  _tables: Map<string, MockD1Record[]>;
  _lastExecutedSql?: string;
  _boundQueries: Array<{ sql: string; params: any[] }>;
}

/**
 * Factoría estándar para simular una base de datos Cloudflare D1 en Vitest.
 * Soporta .exec(), .prepare(), .bind(), .run(), .all() y .first().
 */
export function createMockD1Database(initialData: Record<string, MockD1Record[]> = {}): MockD1Database {
  const tables = new Map<string, MockD1Record[]>();
  for (const [name, rows] of Object.entries(initialData)) {
    tables.set(name, [...rows]);
  }

  const boundQueries: Array<{ sql: string; params: any[] }> = [];

  const exec = vi.fn().mockImplementation(async (sql: string) => {
    // Si crea tabla server_error_logs, registrarla
    if (sql.includes("CREATE TABLE IF NOT EXISTS server_error_logs")) {
      if (!tables.has("server_error_logs")) {
        tables.set("server_error_logs", []);
      }
    }
    return { success: true };
  });

  const prepare = vi.fn().mockImplementation((sql: string) => {
    return {
      bind: (...params: any[]) => {
        boundQueries.push({ sql, params });

        const run = vi.fn().mockImplementation(async () => {
          if (sql.includes("INSERT INTO server_error_logs")) {
            const list = tables.get("server_error_logs") || [];
            list.push({
              id: params[0],
              timestamp: params[1],
              level: params[2],
              category: params[3],
              message: params[4],
              stack: params[5],
              url: params[6],
              method: params[7],
              status: params[8],
              client_ip: params[9],
              user_agent: params[10],
              user_id: params[11],
              metadata: params[12],
            });
            tables.set("server_error_logs", list);
          }
          return { success: true, meta: { changes: 1 } };
        });

        const all = vi.fn().mockImplementation(async () => {
          let rows = tables.get("server_error_logs") || [];

          // Filtro por nivel si aplica
          if (sql.includes("level = ?")) {
            const levelIdx = sql.indexOf("category = ?") !== -1 ? 0 : 0;
            const levelVal = params[levelIdx];
            rows = rows.filter((r) => r.level === levelVal);
          }

          // Filtro por categoría si aplica
          if (sql.includes("category = ?")) {
            const catVal = params.length > 1 ? params[1] : params[0];
            rows = rows.filter((r) => r.category === catVal);
          }

          // Limit
          const limit = typeof params[params.length - 1] === "number" ? params[params.length - 1] : rows.length;
          const sliced = rows.slice(0, limit);

          return { results: sliced, success: true };
        });

        const first = vi.fn().mockImplementation(async (col?: string) => {
          const res = await all();
          const firstRow = res.results[0];
          if (!firstRow) return null;
          return col ? firstRow[col] : firstRow;
        });

        return { run, all, first };
      },
    };
  });

  return {
    exec,
    prepare,
    _tables: tables,
    _boundQueries: boundQueries,
  };
}
