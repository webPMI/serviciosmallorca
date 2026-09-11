import type { APIRoute } from "astro";
import { logToD1, type LogLevel, type LogCategory } from "../../lib/d1Logger";

export const prerender = false;

/**
 * API Endpoint para recibir logs de telemetría y diagnóstico desde el frontend/SSR.
 * Captura errores, advertencias y eventos de auditoría en Cloudflare D1 en tiempo real.
 */
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: "active", service: "telemetry", version: "2026.1" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async (context) => {
  const { request } = context;
  try {
    const body = await request.json();

    const level: LogLevel = ["INFO", "WARN", "ERROR", "FATAL", "SECURITY"].includes(body?.level) ? body.level : "ERROR";

    const category: LogCategory = [
      "SSR",
      "API",
      "AUTH",
      "PAYMENT",
      "ROUTING",
      "DATABASE",
      "TAXONOMY",
      "CLIENT_JS",
    ].includes(body?.category)
      ? body.category
      : "CLIENT_JS";

    const clientIp =
      body?.clientIp || request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || undefined;

    const userAgent = body?.userAgent || request.headers.get("user-agent") || undefined;

    const result = await logToD1(context, {
      level,
      category,
      message: String(body?.message || "Error de telemetría no especificado").slice(0, 2000),
      stack: body?.stack ? String(body.stack).slice(0, 4000) : undefined,
      url: body?.url ? String(body.url).slice(0, 500) : undefined,
      method: body?.method || "CLIENT",
      status: Number(body?.status) || 0,
      clientIp,
      userAgent,
      userId: body?.userId ? String(body.userId).slice(0, 100) : undefined,
      metadata: body?.metadata && typeof body.metadata === "object" ? body.metadata : undefined,
    });

    return new Response(
      JSON.stringify({
        success: result.success,
        logId: result.logId,
        throttled: result.throttled,
        error: result.error,
      }),
      {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message || "Internal Server Error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
