import type { APIRoute } from "astro";
import { GET as getMcpCard } from "./mcp/server-card.json.ts";

export const prerender = false;
export const GET: APIRoute = getMcpCard;
