import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer as createHttpServer, request as httpRequest, type IncomingMessage, type Server } from "node:http";
import { createBridge, type BridgeInstance } from "../../scripts/gemini-bridge.ts";

/**
 * Stub local del upstream Gemini (se inyecta al bridge vía baseUrl, equivalente a
 * GEMINI_BASE_URL). Responde con eco del último mensaje del usuario + usage fijo.
 */
function startStub(): Promise<{ server: Server; port: number }> {
  return new Promise((resolve, reject) => {
    const server: Server = createHttpServer((req, res) => {
      let raw = "";
      req.on("data", (chunk: Buffer) => {
        raw += chunk.toString("utf8");
      });
      req.on("end", () => {
        const url = req.url ?? "";
        if (url.includes("/v1beta/models") && !url.includes(":generateContent")) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              models: [
                {
                  name: "models/gemini-3.7-flash",
                  displayName: "Gemini 3.7 Flash",
                  supportedGenerationMethods: ["generateContent"],
                },
                {
                  name: "models/gemini-embed-001",
                  displayName: "Embeddings",
                  supportedGenerationMethods: ["embedContent"],
                },
                {
                  name: "models/banana-2",
                  displayName: "Banana 2",
                  supportedGenerationMethods: ["generateContent"],
                },
              ],
            }),
          );
          return;
        }
        if (!url.includes(":generateContent")) {
          res.writeHead(404, { "content-type": "application/json" });
          res.end("{}");
          return;
        }
        let lastUser = "";
        try {
          const parsed = JSON.parse(raw) as {
            contents?: Array<{ parts?: Array<{ text?: string }> }>;
          };
          const contents = parsed.contents ?? [];
          const last = contents[contents.length - 1];
          lastUser =
            last && last.parts && last.parts[0] && typeof last.parts[0].text === "string" ? last.parts[0].text : "";
        } catch {
          lastUser = "";
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            candidates: [
              {
                content: { role: "model", parts: [{ text: "ECO:" + lastUser }] },
                finishReason: "STOP",
              },
            ],
            usageMetadata: {
              promptTokenCount: 12,
              candidatesTokenCount: 34,
              thoughtsTokenCount: 5,
              totalTokenCount: 51,
            },
            modelVersion: "stub-gemini",
          }),
        );
      });
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr !== null ? addr.port : 0;
      resolve({ server, port });
    });
  });
}

/** Petición HTTP cruda (permite fijar la cabecera Host, p.ej. para el test anti DNS-rebinding). */
function rawRequest(
  port: number,
  path: string,
  headers: Record<string, string> = {},
  method = "GET",
): Promise<{ status: number | undefined; body: string }> {
  return new Promise((resolve, reject) => {
    const req = httpRequest({ host: "127.0.0.1", port, path, method, headers }, (res: IncomingMessage) => {
      let body = "";
      res.on("data", (c: Buffer) => {
        body += c.toString("utf8");
      });
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject);
    req.end();
  });
}

describe("Gemini Bridge (puente local IA ⇄ Gemini + análisis de comunicación)", () => {
  let stub: Server;
  let stubPort = 0;
  let bridge: BridgeInstance;
  let port = 0;

  beforeAll(async () => {
    const started = await startStub();
    stub = started.server;
    stubPort = started.port;
    bridge = createBridge({
      port: 0,
      model: "stub-gemini",
      apiKey: "test-key-abcdef123456",
      baseUrl: "http://127.0.0.1:" + String(stubPort),
      maxEntries: 5,
      chatRateLimit: 1000,
      apiRateLimit: 5000,
      quiet: true,
    });
    port = await bridge.start();
  });

  afterAll(async () => {
    await bridge.stop();
    await new Promise<void>((resolve) => stub.close(() => resolve()));
  });

  it("health responde y nunca filtra la API key", async () => {
    const res = await fetch("http://127.0.0.1:" + String(port) + "/api/health");
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; keyConfigured: boolean; model: string };
    expect(json.ok).toBe(true);
    expect(json.keyConfigured).toBe(true);
    expect(json.model).toBe("stub-gemini");
    const statsText = await (await fetch("http://127.0.0.1:" + String(port) + "/api/stats")).text();
    expect(statsText).not.toContain("test-key-abcdef123456");
  });

  it("sirve la UI con CSP por nonce y cabeceras de seguridad", async () => {
    const res = await fetch("http://127.0.0.1:" + String(port) + "/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(res.headers.get("x-frame-options")).toBe("DENY");
    expect(res.headers.get("cache-control")).toBe("no-store");
    const csp = res.headers.get("content-security-policy") ?? "";
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("script-src 'nonce-");
    const html = await res.text();
    expect(html).toContain("Gemini Bridge");
    expect(html).toContain('nonce="');
  });

  it("POST /api/chat hace eco del stub y registra la comunicación con métricas", async () => {
    const res = await fetch("http://127.0.0.1:" + String(port) + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "hola puente" }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      text: string;
      model: string;
      usage: { totalTokenCount: number } | null;
      latencyMs: number;
    };
    expect(json.ok).toBe(true);
    expect(json.text).toBe("ECO:hola puente");
    expect(json.model).toBe("stub-gemini");
    expect(json.usage?.totalTokenCount).toBe(51);
    expect(json.latencyMs).toBeGreaterThanOrEqual(0);

    const stats = bridge.stats();
    expect(stats.total).toBe(1);
    expect(stats.ok).toBe(1);
    expect(stats.tokensOutput).toBe(34);
    const comms = bridge.comms();
    expect(comms.length).toBe(1);
    expect(comms[0]?.prompt).toContain("hola puente");
    expect(comms[0]?.response).toBe("ECO:hola puente");
  });

  it("envía el historial al modelo (multi-turno)", async () => {
    const res = await fetch("http://127.0.0.1:" + String(port) + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "segunda pregunta",
        history: [
          { role: "user", text: "primera" },
          { role: "model", text: "primera respuesta" },
        ],
      }),
    });
    const json = (await res.json()) as { ok: boolean; text: string };
    expect(json.ok).toBe(true);
    expect(json.text).toBe("ECO:segunda pregunta");
    const entry = bridge.comms()[0];
    expect(entry?.prompt).toContain("[user] primera");
    expect(entry?.prompt).toContain("[model] primera respuesta");
  });

  it("rechaza JSON inválido (400) y message vacío (400)", async () => {
    const bad = await fetch("http://127.0.0.1:" + String(port) + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{no-soy-json",
    });
    expect(bad.status).toBe(400);
    const empty = await fetch("http://127.0.0.1:" + String(port) + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "   " }),
    });
    expect(empty.status).toBe(400);
  });

  it("rechaza payloads demasiado grandes (413)", async () => {
    const big = "x".repeat(300 * 1024);
    const res = await fetch("http://127.0.0.1:" + String(port) + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: big }),
    });
    expect(res.status).toBe(413);
  });

  it("bloquea Host externo (anti DNS-rebinding) con 403", async () => {
    const res = await rawRequest(port, "/api/health", { host: "malicioso.ejemplo" });
    expect(res.status).toBe(403);
    expect(res.body).toContain("Host no permitido");
  });

  it("rate limit de /api/chat devuelve 429 con Retry-After", async () => {
    const limited = createBridge({
      port: 0,
      model: "stub-gemini",
      apiKey: "otra-key-abcdef123456",
      baseUrl: "http://127.0.0.1:" + String(stubPort),
      chatRateLimit: 2,
      apiRateLimit: 1000,
      quiet: true,
    });
    const p = await limited.start();
    try {
      const url = "http://127.0.0.1:" + String(p) + "/api/chat";
      const headers = { "content-type": "application/json" };
      const r1 = await fetch(url, { method: "POST", headers, body: JSON.stringify({ message: "1" }) });
      const r2 = await fetch(url, { method: "POST", headers, body: JSON.stringify({ message: "2" }) });
      const r3 = await fetch(url, { method: "POST", headers, body: JSON.stringify({ message: "3" }) });
      expect(r1.status).toBe(200);
      expect(r2.status).toBe(200);
      expect(r3.status).toBe(429);
      expect(r3.headers.get("retry-after")).toBeTruthy();
    } finally {
      await limited.stop();
    }
  });

  it("ring buffer: respeta maxEntries (5) tras 7 peticiones", async () => {
    const url = "http://127.0.0.1:" + String(port) + "/api/chat";
    const headers = { "content-type": "application/json" };
    for (let i = 0; i < 7; i++) {
      await fetch(url, { method: "POST", headers, body: JSON.stringify({ message: "msg " + String(i) }) });
    }
    expect(bridge.comms().length).toBe(5);
    expect(bridge.stats().total).toBe(5);
  });

  it("filtro /api/comms?q= busca en prompt y respuesta", async () => {
    const url = "http://127.0.0.1:" + String(port) + "/api/chat";
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "palabraclaveUnica" }),
    });
    const hit = await fetch("http://127.0.0.1:" + String(port) + "/api/comms?q=palabraclaveUnica");
    const hitJson = (await hit.json()) as { entries: unknown[] };
    expect(hitJson.entries.length).toBe(1);
    const miss = await fetch("http://127.0.0.1:" + String(port) + "/api/comms?q=inexistenteTotal");
    const missJson = (await miss.json()) as { entries: unknown[] };
    expect(missJson.entries.length).toBe(0);
  });

  it("exporta el registro en Markdown y JSON como adjuntos", async () => {
    const md = await fetch("http://127.0.0.1:" + String(port) + "/api/export?format=md");
    expect(md.status).toBe(200);
    expect(md.headers.get("content-type")).toContain("text/markdown");
    expect(md.headers.get("content-disposition")).toContain("attachment");
    const mdText = await md.text();
    expect(mdText).toContain("# Gemini Bridge");
    const json = await fetch("http://127.0.0.1:" + String(port) + "/api/export?format=json");
    expect(json.status).toBe(200);
    const parsed = (await json.json()) as { entries: unknown[] };
    expect(Array.isArray(parsed.entries)).toBe(true);
  });

  it("limpia el registro (POST /api/comms/clear)", async () => {
    const res = await fetch("http://127.0.0.1:" + String(port) + "/api/comms/clear", { method: "POST" });
    expect(res.status).toBe(200);
    expect(bridge.comms().length).toBe(0);
  });

  it("sin GEMINI_API_KEY el chat responde 503 con instrucción", async () => {
    const noKey = createBridge({
      port: 0,
      model: "stub-gemini",
      apiKey: "",
      baseUrl: "http://127.0.0.1:" + String(stubPort),
      quiet: true,
    });
    const p = await noKey.start();
    try {
      const res = await fetch("http://127.0.0.1:" + String(p) + "/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "hola" }),
      });
      expect(res.status).toBe(503);
      const json = (await res.json()) as { ok: boolean; error: string };
      expect(json.ok).toBe(false);
      expect(json.error).toContain("GEMINI_API_KEY");
    } finally {
      await noKey.stop();
    }
  });

  it("endpoint desconocido responde 404", async () => {
    const res = await fetch("http://127.0.0.1:" + String(port) + "/api/whatever");
    expect(res.status).toBe(404);
  });

  it("GET /api/models descubre modelos EN VIVO y filtra por generateContent", async () => {
    const res = await fetch("http://127.0.0.1:" + String(port) + "/api/models");
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      count: number;
      default: string;
      models: Array<{ id: string; displayName: string }>;
    };
    expect(json.ok).toBe(true);
    const ids = json.models.map((m) => m.id);
    expect(ids).toContain("gemini-3.7-flash");
    expect(ids).toContain("banana-2");
    expect(ids).not.toContain("gemini-embed-001"); // embeddings filtrados: no soportan generateContent
    expect(json.default).toBe("stub-gemini");
  });

  it("GET /api/models sin clave responde 503", async () => {
    const noKey = createBridge({
      port: 0,
      model: "stub-gemini",
      apiKey: "",
      baseUrl: "http://127.0.0.1:" + String(stubPort),
      quiet: true,
    });
    const p = await noKey.start();
    try {
      const res = await fetch("http://127.0.0.1:" + String(p) + "/api/models");
      expect(res.status).toBe(503);
    } finally {
      await noKey.stop();
    }
  });
});
