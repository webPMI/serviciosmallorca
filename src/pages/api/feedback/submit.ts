import type { APIRoute } from "astro";
import { validateFeedbackSubmission, generateFeedbackId, type FeedbackRecord } from "../../../lib/communityVoiceEngine";
import { logToD1 } from "../../../lib/d1Logger";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const rawBody = await request.json();

    const validation = validateFeedbackSubmission(rawBody);
    if (!validation.valid || !validation.sanitized) {
      return new Response(
        JSON.stringify({
          ok: false,
          errors: validation.errors,
          message: "Datos de formulario inválidos o incompletos.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const sanitized = validation.sanitized;
    const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = clientIp.split(".").slice(0, 2).join(".") + ".x.x";

    const feedbackRecord: FeedbackRecord = {
      id: generateFeedbackId(),
      type: sanitized.type,
      title: sanitized.title,
      description: sanitized.description,
      authorName: sanitized.authorName || "Anónimo",
      authorEmail: sanitized.authorEmail || "",
      targetServiceSlug: sanitized.targetServiceSlug || null,
      targetServiceName: sanitized.targetServiceName || null,
      zone: sanitized.zone || null,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ipHash,
    };

    // Telemetría & Registro seguro en D1 (GR-15)
    const runtimeEnv = (locals as any)?.runtime?.env;
    const d1Binding = runtimeEnv?.DB;

    await logToD1(d1Binding, {
      level: "INFO",
      category: "API",
      message: `Nuevo mensaje recibido en Buzón Ciudadano [${sanitized.type}]: "${sanitized.title.slice(0, 40)}"`,
      url: "/api/feedback/submit",
      metadata: {
        feedbackId: feedbackRecord.id,
        type: sanitized.type,
        targetSlug: sanitized.targetServiceSlug,
        zone: sanitized.zone,
      },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        id: feedbackRecord.id,
        type: feedbackRecord.type,
        message: "Tu aportación ha sido recibida y será revisada con dedicación por el equipo.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "INVALID_PAYLOAD",
        message: "No se pudo procesar la solicitud.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
};
