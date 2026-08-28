import type { APIRoute } from "astro";
import { logToD1 } from "../../lib/d1Logger";

export const prerender = false;

/**
 * API Endpoint para recibir logs de telemetría desde el frontend.
 * Captura errores, advertencias y eventos de auditoría en tiempo real.
 */
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: "active", service: "telemetry" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const result = await logToD1(undefined, data);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
