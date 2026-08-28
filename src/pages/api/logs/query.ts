import type { APIRoute } from "astro";
import { queryD1Logs, type LogLevel, type LogCategory } from "../../../lib/d1Logger";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);

    const limit = Number(url.searchParams.get("limit")) || 50;
    const level = url.searchParams.get("level") as LogLevel | undefined;
    const category = url.searchParams.get("category") as LogCategory | undefined;

    const logs = await queryD1Logs(undefined, { limit, level, category });

    return new Response(
      JSON.stringify({
        success: true,
        count: logs.length,
        logs,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
