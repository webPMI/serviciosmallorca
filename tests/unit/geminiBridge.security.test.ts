/**
 * geminiBridge.security.test.ts
 *
 * 🛡️ SUITE ADVERSARIAL DEL GEMINI BRIDGE (GR-13 / SECURITY.md §7)
 *
 * Ataques dirigidos al puente local IA ⇄ Gemini (scripts/gemini-bridge.ts):
 *  1. 🔑 Fugas de secretos: la API key no puede aparecer en ninguna superficie HTTP.
 *  2. 🧬 Prototipo: payloads con __proto__/constructor sin contaminación ni crash.
 *  3. 🥷 XSS: vectores almacenados como datos y servidos siempre como JSON, nunca HTML.
 *  4. 🌐 DNS-rebinding: variantes de Host spoofing → 403; loopback legítimo → 200.
 *  5. 💣 DoS lógico: JSON profundamente anidado → 400 controlado sin colgar el proceso.
 *  6. 🔀 Métodos HTTP incorrectos y path traversal de modelo → rechazo.
 *  7. 📎 Cabecera content-disposition del export saneada (sin inyección).
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer as createHttpServer, request as httpRequest, type IncomingMessage, type Server } from "node:http";
import { createBridge, parseChatPayload, redactSecrets, type BridgeInstance } from "../../scripts/gemini-bridge.ts";

const API_KEY = "adversarial-key-xyz987654321";
const JSONH = { "content-type": "application/json" };

function startStub(): Promise<{ server: Server; port: number }> {
  return new Promise((resolve, reject) => {
    const server: Server = createHttpServer((req, res) => {
      let raw = "";
      req.on("data", (chunk: Buffer) => {
        raw += chunk.toString("utf8");
      });
      req.on("end", () => {
        const url = req.url ?? "";
        if (!url.includes(":generateContent")) {
          res.writeHead(404, { "content-type": "application/json" });
          res.end("{}");
          return;
        }
        let lastUser = "";
        try {
          const parsed = JSON.parse(raw) as { contents?: Array<{ parts?: Array<{ text?: string }> }> };
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
            candidates: [{ content: { role: "model", parts: [{ text: "ECO:" + lastUser }] }, finishReason: "STOP" }],
            usageMetadata: { promptTokenCount: 9, candidatesTokenCount: 7, totalTokenCount: 16 },
            modelVersion: "stub-gemini",
          }),
        );
      });
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      resolve({ server, port: typeof addr === "object" && addr !== null ? addr.port : 0 });
    });
  });
}

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

describe("🛡️ Gemini Bridge — suite adversarial de seguridad", () => {
  let stub: Server;
  let stubPort = 0;
  let bridge: BridgeInstance;
  let port = 0;
  let base = "";

  beforeAll(async () => {
    const started = await startStub();
    stub = started.server;
    stubPort = started.port;
    bridge = createBridge({
      port: 0,
      model: "stub-gemini",
      apiKey: API_KEY,
      baseUrl: "http://127.0.0.1:" + String(stubPort),
      chatRateLimit: 1000,
      apiRateLimit: 5000,
      quiet: true,
    });
    port = await bridge.start();
    base = "http://127.0.0.1:" + String(port);
  });

  afterAll(async () => {
    await bridge.stop();
    await new Promise<void>((resolve) => stub.close(() => resolve()));
  });

  it("🔑 la API key no aparece en ninguna superficie HTTP tras usarla", async () => {
    const chat = await fetch(base + "/api/chat", {
      method: "POST",
      headers: JSONH,
      body: JSON.stringify({ message: "fuga?" }),
    });
    expect(chat.status).toBe(200);
    const surfaces = await Promise.all([
      fetch(base + "/api/health").then((r) => r.text()),
      fetch(base + "/api/stats").then((r) => r.text()),
      fetch(base + "/api/comms").then((r) => r.text()),
      fetch(base + "/api/export?format=json").then((r) => r.text()),
      fetch(base + "/api/export?format=md").then((r) => r.text()),
      fetch(base + "/").then((r) => r.text()),
    ]);
    for (const body of surfaces) {
      expect(body).not.toContain(API_KEY);
    }
  });

  it("🧬 claves peligrosas (__proto__/constructor) se ignoran sin contaminación ni crash", async () => {
    const res = await fetch(base + "/api/chat", {
      method: "POST",
      headers: JSONH,
      body: '{"__proto__":{"isAdmin":true},"constructor":{"prototype":{}},"message":"proto"}',
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; text: string };
    expect(json.ok).toBe(true);
    expect(json.text).toBe("ECO:proto");
    const probe = {} as Record<string, unknown>;
    expect(probe.isAdmin).toBeUndefined();
  });

  it("🥷 vectores XSS viajan como datos JSON, jamás como HTML ejecutable", async () => {
    const xss = '<img src=x onerror="alert(1)"><script>alert(1)</script>';
    const res = await fetch(base + "/api/chat", {
      method: "POST",
      headers: JSONH,
      body: JSON.stringify({ message: xss }),
    });
    expect(res.status).toBe(200);
    const comms = await fetch(base + "/api/comms?q=onerror");
    const ctype = comms.headers.get("content-type") ?? "";
    expect(ctype).toContain("application/json");
    expect(ctype).not.toContain("text/html");
    const body = await comms.text();
    expect(body).toContain("onerror"); // datos íntegros: el escape vive en el render (UI usa textContent/esc)
  });

  it("🌐 spoofing de Host (DNS-rebinding) → 403 en todas las variantes", async () => {
    for (const host of ["127.0.0.1.evil.com", "localhost.evil.com", "evil-127.0.0.1", "[::1]:6666"]) {
      const res = await rawRequest(port, "/api/health", { host });
      expect(res.status).toBe(403);
    }
  });

  it("🌐 Host loopback legítimo en mayúsculas sigue permitido (comparación case-insensitive)", async () => {
    const res = await rawRequest(port, "/api/health", { host: "LOCALHOST:" + String(port) });
    expect(res.status).toBe(200);
  });

  it("💣 JSON profundamente anidado → 400 controlado sin colgar el proceso", async () => {
    const res = await fetch(base + "/api/chat", {
      method: "POST",
      headers: JSONH,
      body: "[".repeat(60000),
    });
    expect([400, 413]).toContain(res.status);
    const health = await fetch(base + "/api/health");
    expect(health.status).toBe(200);
  });

  it("🔀 métodos HTTP incorrectos no exponen endpoints (404)", async () => {
    expect((await fetch(base + "/api/chat")).status).toBe(404);
    expect((await fetch(base + "/api/comms/clear")).status).toBe(404);
    expect((await fetch(base + "/api/chat", { method: "PUT", headers: JSONH, body: "{}" })).status).toBe(404);
  });

  it("📎 content-disposition del export saneado (sin inyección de cabeceras)", async () => {
    const res = await fetch(base + "/api/export?format=json");
    const cd = res.headers.get("content-disposition") ?? "";
    expect(cd).toMatch(/^attachment; filename="gemini-bridge-[0-9T.\-Z]+\.json"$/);
  });

  it("🔀 path traversal en model → 400 (nunca llega al upstream)", async () => {
    const res = await fetch(base + "/api/chat", {
      method: "POST",
      headers: JSONH,
      body: JSON.stringify({ message: "x", model: "../../v1/evil" }),
    });
    expect(res.status).toBe(400);
  });

  it("🔑 mensaje que excede el límite → 400 y el error NO hace eco del payload", async () => {
    const res = await fetch(base + "/api/chat", {
      method: "POST",
      headers: JSONH,
      body: JSON.stringify({ message: "a".repeat(32001) }),
    });
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text.length).toBeLessThan(300);
    expect(text).toContain("demasiado largo");
  });

  it("🧪 redactSecrets: sustituye secretos ≥8 chars y preserva los cortos por diseño", () => {
    expect(redactSecrets("token abcdef12345 fin", ["abcdef12345"])).toBe("token *** fin");
    expect(redactSecrets("abc", ["abc"])).toBe("abc");
  });

  it("🧪 parseChatPayload: rechaza model inválido, system no-texto e history no-array", () => {
    expect(typeof parseChatPayload({ message: "hola", model: "../etc/passwd" })).toBe("string");
    expect(typeof parseChatPayload({ message: "hola", system: 42 })).toBe("string");
    expect(typeof parseChatPayload({ message: "hola", history: "no-soy-array" })).toBe("string");
    const ok = parseChatPayload({ message: "hola", model: "gemini-3.7-flash", history: [{ role: "user", text: "a" }] });
    expect(typeof ok).toBe("object");
  });

  it("✅ el servidor queda sano tras la batería adversarial completa", async () => {
    const res = await fetch(base + "/api/health");
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; entries: number };
    expect(json.ok).toBe(true);
    expect(json.entries).toBeGreaterThan(0);
  });
});
