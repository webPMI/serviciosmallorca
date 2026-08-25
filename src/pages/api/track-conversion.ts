import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    if (!data || !data.serviceId || !data.eventType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // En entorno de producción, aquí se puede almacenar en Cloudflare KV, Analytics Engine o Firestore
    // console.log(`[CONVERSION_TRACKING] ${data.serviceId} -> ${data.eventType}`, data);

    return new Response(JSON.stringify({ ok: true, receivedAt: new Date().toISOString() }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
