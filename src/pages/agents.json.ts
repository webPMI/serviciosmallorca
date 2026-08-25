import type { APIRoute } from "astro";
import { GET as getWellKnown } from "./.well-known/agents.json.ts";

export const prerender = false;
export const GET: APIRoute = getWellKnown;
