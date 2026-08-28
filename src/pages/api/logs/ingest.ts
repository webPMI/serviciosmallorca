import type { APIRoute } from "astro";
import { logToD1, type LogLevel, type LogCategory } from "../../../lib/d1Logger";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const d1 = (locals as any)?.runtime?.env?.DB;
    const body = await request.json();

    const level: LogLevel = ["INFO", "WARN", "ERROR", "FATAL", "SECURITY"].includes(body.level) ? body.level : "ERROR";

    const category: LogCategory = [
      "SSR",
      "API",
      "AUTH",
      "PAYMENT",
      "ROUTING",
      "DATABASE",
      "TAXONOMY",
      "CLIENT_JS",
    ].includes(body.category)
      ? body.category
      : "CLIENT_JS";

    const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    const result = await logToD1(d1, {
      level,
      category,
      message: String(body.message || "Error no especificado en cliente").slice(0, 1000),
      stack: body.stack ? String(body.stack).slice(0, 3000) : undefined,
      url: body.url ? String(body.url).slice(0, 500) : undefined,
      method: body.method || "CLIENT",
      status: Number(body.status) || 0,
      clientIp,
      userAgent,
      userId: body.userId ? String(body.userId).slice(0, 100) : undefined,
      metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : undefined,
    });

    return new Response(JSON.stringify({ success: true, logId: result.logId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
