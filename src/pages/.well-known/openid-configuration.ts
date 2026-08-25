import type { APIRoute } from "astro";

export const prerender = false;

const OPENID_CONFIGURATION = {
  issuer: "https://serviciosmallorca.com",
  authorization_endpoint: "https://serviciosmallorca.com/login",
  token_endpoint: "https://serviciosmallorca.com/api/auth/token",
  userinfo_endpoint: "https://serviciosmallorca.com/api/auth/userinfo",
  jwks_uri: "https://serviciosmallorca.com/.well-known/jwks.json",
  response_types_supported: ["code", "token", "id_token"],
  subject_types_supported: ["public"],
  id_token_signing_alg_values_supported: ["RS256"],
  scopes_supported: ["openid", "profile", "email"],
  claims_supported: ["sub", "iss", "auth_time", "name", "email"],
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(OPENID_CONFIGURATION, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
