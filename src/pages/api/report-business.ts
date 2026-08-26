import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { businessSlug, businessName, issueType, details } = body;

    if (!businessSlug || !issueType) {
      return new Response(JSON.stringify({ error: "Parámetros incompletos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Registrar evento de auditoría
    const auditReport = {
      timestamp: new Date().toISOString(),
      businessSlug,
      businessName,
      issueType,
      details: details || "Sin detalles adicionales",
      status: "pending_review",
      actionRequired: issueType === "closed_or_moved" ? "verify_closure" : "verify_contact_schedule",
    };

    console.warn(`[AUDIT REPORT RECEIVED] Discrepancia reportada para ${businessSlug}: ${issueType}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reporte de auditoría registrado correctamente",
        reportId: `REP-${Date.now()}`,
        auditReport,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Error procesando reporte" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
