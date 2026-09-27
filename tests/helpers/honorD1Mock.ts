/**
 * honorD1Mock.ts
 *
 * 🧪 Mock de Cloudflare D1 para las pruebas del Cuadro de Honor.
 * Emula `exec`, `prepare().bind()` con `run()`, `all()` y `first()`, y `batch()`,
 * de forma que las escrituras realmente se reflejen en memoria.
 */

export interface HonorD1Mock {
  d1: any;
  spots: any[];
  bids: any[];
  executedSql: string[];
}

export function createHonorD1Mock(): HonorD1Mock {
  const spots: any[] = [];
  const bids: any[] = [];
  const executedSql: string[] = [];

  const d1: any = {
    exec: async (sql: string) => {
      executedSql.push(sql);
      return { success: true };
    },

    prepare: (sql: string) => ({
      bind: (...params: any[]) => ({
        run: async () => {
          executedSql.push(sql);

          if (sql.includes("DELETE FROM honor_spots")) {
            for (let i = spots.length - 1; i >= 0; i--) {
              if (spots[i].category === params[0]) spots.splice(i, 1);
            }
            return { success: true };
          }

          if (sql.includes("INSERT INTO honor_spots")) {
            spots.push({
              id: params[0],
              category: params[1],
              service_id: params[2],
              service_slug: params[3],
              position: params[4],
              current_bid_eur: params[5],
              sponsor_name: params[6],
              entry_json: params[7],
              created_at: params[8],
              updated_at: params[9],
            });
            return { success: true };
          }

          if (sql.includes("INSERT INTO honor_bids")) {
            const existing = bids.find((b) => b.idempotency_key === params[1]);
            const row = {
              id: params[0],
              idempotency_key: params[1],
              category: params[2],
              service_id: params[3],
              mode: params[4],
              amount_eur: params[5],
              sponsor_name: params[6],
              sponsor_message: params[7],
              invoice_id: params[8],
              status: params[9],
              created_at: params[10],
            };
            if (existing) Object.assign(existing, row);
            else bids.push(row);
            return { success: true };
          }

          return { success: true };
        },

        all: async () => {
          executedSql.push(sql);

          if (sql.includes("FROM honor_spots")) {
            return {
              success: true,
              results: spots
                .filter((s) => s.category === params[0])
                .map((s) => ({
                  entry_json: s.entry_json,
                  current_bid_eur: s.current_bid_eur,
                  service_id: s.service_id,
                  service_slug: s.service_slug,
                })),
            };
          }

          return { success: true, results: [] };
        },

        first: async () => {
          executedSql.push(sql);
          if (sql.includes("FROM honor_bids") && sql.includes("status = 'confirmed'")) {
            return bids.find((b) => b.idempotency_key === params[0] && b.status === "confirmed") || null;
          }
          return null;
        },
      }),
    }),

    batch: async (statements: any[]) => {
      for (const stmt of statements) await stmt.run();
      return [];
    },
  };

  return { d1, spots, bids, executedSql };
}
