/**
 * 🔒 Gemini Bridge — puente local IA ⇄ Gemini con panel de análisis de comunicación.
 *
 * Propósito:
 *   Servidor HTTP de loopback (127.0.0.1) que conecta "la IA en local" (terminal,
 *   scripts o navegador del proyecto) con el modelo Gemini que usa Google
 *   Antigravity (Gemini 3 Pro → `gemini-3-pro-preview`), y expone una interfaz web
 *   embebida para ANALIZAR la comunicación: latencia, tokens, errores, historial,
 *   búsqueda y exportación JSON/Markdown.
 *
 * Seguridad (GR-13):
 *   - Escucha SOLO en 127.0.0.1 (nunca 0.0.0.0); no existe opción de exposición externa.
 *   - Verificación de cabecera Host (anti DNS-rebinding).
 *   - API key SOLO desde entorno / .env — nunca hardcodeada, nunca enviada al navegador.
 *   - Rate limiting por IP (ventana fija), límite de payload (256 KB), timeouts de
 *     socket y de upstream, cabeceras de seguridad y CSP con nonce por petición.
 *   - UI con escape HTML (anti-XSS); cero eval/Function; secretos redactados en logs.
 *
 * Uso:
 *   1. Copia .env.example → .env y define GEMINI_API_KEY (Google AI Studio).
 *   2. npm run gemini:bridge
 *   3. Abre http://127.0.0.1:8785
 *
 * Variables de entorno:
 *   GEMINI_API_KEY        clave de https://aistudio.google.com/apikey (obligatoria para chatear)
 *   GEMINI_MODEL          default: gemini-3-pro-preview (el de Google Antigravity)
 *   GEMINI_BRIDGE_PORT    default: 8785
 *   GEMINI_BRIDGE_PERSIST "1" → persiste el registro en .gemini-bridge/comm-log.jsonl
 *   GEMINI_BASE_URL       solo para tests/stubs (default: API oficial de Google)
 *
 * Nota de veracidad (GR-11): "Gemini 3.7" no existe. Antigravity usa Gemini 3 Pro
 * (`gemini-3-pro-preview`). Antigravity no expone una API local pública para apps de
 * terceros; este bridge usa la Gemini API oficial, el canal soportado para ese modelo.
 */

import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { randomBytes, randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// ─── Constantes ──────────────────────────────────────────────────────────────

const BRIDGE_VERSION = "1.0.0";
const DEFAULT_PORT = 8785;
const DEFAULT_MODEL = "gemini-3-pro-preview";
const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
const DEFAULT_MAX_ENTRIES = 500;
const DEFAULT_BODY_LIMIT = 256 * 1024;
const DEFAULT_CHAT_RATE = 20; // peticiones/min a /api/chat
const DEFAULT_API_RATE = 240; // peticiones/min al resto de /api/*
const DEFAULT_UPSTREAM_TIMEOUT_MS = 110_000;
const RATE_WINDOW_MS = 60_000;
const STORED_TEXT_CAP = 20_000;
const MODEL_ID_RE = /^[a-zA-Z0-9._-]{1,80}$/;
const MAX_HISTORY = 40;
const MAX_MESSAGE_CHARS = 32_000;
const MAX_SYSTEM_CHARS = 8_000;

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(HERE, "..");

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type ChatRole = "user" | "model";

export interface HistoryTurn {
  role: ChatRole;
  text: string;
}

export interface GeminiUsage {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  thoughtsTokenCount?: number;
  totalTokenCount?: number;
}

export interface CommsEntry {
  id: string;
  ts: number;
  model: string;
  status: number;
  ok: boolean;
  latencyMs: number;
  promptChars: number;
  responseChars: number;
  usage: GeminiUsage | null;
  finishReason: string | null;
  error: string | null;
  prompt: string;
  response: string;
}

export interface StatsByModelEntry {
  total: number;
  ok: number;
  errors: number;
  avgLatencyMs: number;
  tokensOutput: number;
}

export interface StatsSnapshot {
  ts: number;
  uptimeMs: number;
  version: string;
  model: string;
  keyConfigured: boolean;
  total: number;
  ok: number;
  errors: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  tokensPrompt: number;
  tokensOutput: number;
  tokensTotal: number;
  byModel: Record<string, StatsByModelEntry>;
  lastError: { ts: number; status: number; error: string } | null;
}

export interface BridgeOptions {
  port?: number;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  persist?: boolean;
  maxEntries?: number;
  chatRateLimit?: number;
  apiRateLimit?: number;
  upstreamTimeoutMs?: number;
  bodyLimitBytes?: number;
  quiet?: boolean;
}

export interface ResolvedConfig {
  port: number;
  model: string;
  apiKey: string;
  baseUrl: string;
  persist: boolean;
  maxEntries: number;
  chatRateLimit: number;
  apiRateLimit: number;
  upstreamTimeoutMs: number;
  bodyLimitBytes: number;
}

export interface BridgeInstance {
  readonly server: Server;
  readonly config: ResolvedConfig;
  start(): Promise<number>;
  stop(): Promise<void>;
  stats(): StatsSnapshot;
  comms(): CommsEntry[];
  record(entry: CommsEntry): void;
  clearComms(): void;
}

// ─── Utilidades de entorno y secretos ────────────────────────────────────────

/**
 * Carga un archivo .env simple (KEY=VALUE, admite comentarios y comillas) sin
 * sobreescribir variables ya presentes en el entorno. Devuelve las keys cargadas.
 */
export function loadDotEnv(filePath: string): string[] {
  if (!existsSync(filePath)) return [];
  const loaded: string[] = [];
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key.length === 0) continue;
    if (!(key in process.env)) {
      process.env[key] = value;
      loaded.push(key);
    }
  }
  return loaded;
}

/** Reemplaza cualquier secreto conocido por "***" en textos que puedan loguearse. */
export function redactSecrets(input: string, secrets: string[]): string {
  let out = input;
  for (const secret of secrets) {
    if (secret.length >= 8) out = out.split(secret).join("***");
  }
  return out;
}

function envInt(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

export interface CliOptions {
  port?: number;
  model?: string;
  persist?: boolean;
  help: boolean;
}

export function parseCliArgs(argv: string[]): CliOptions {
  const out: CliOptions = { help: false };
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      out.help = true;
      continue;
    }
    if (arg === "--persist") {
      out.persist = true;
      continue;
    }
    if (arg.startsWith("--port=")) {
      const n = Number(arg.slice("--port=".length));
      if (Number.isInteger(n) && n > 0 && n < 65536) out.port = n;
      continue;
    }
    if (arg.startsWith("--model=")) {
      const m = arg.slice("--model=".length);
      if (MODEL_ID_RE.test(m)) out.model = m;
      continue;
    }
  }
  return out;
}

// ─── Rate limiting (ventana fija por IP) ─────────────────────────────────────

class FixedWindowLimiter {
  private readonly max: number;
  private readonly windowMs: number;
  private buckets = new Map<string, { count: number; resetAt: number }>();

  constructor(max: number, windowMs: number) {
    this.max = max;
    this.windowMs = windowMs;
  }

  check(key: string): { allowed: boolean; retryAfterSec: number } {
    const now = Date.now();
    if (this.buckets.size > 5000) {
      for (const [bucketKey, bucket] of this.buckets) {
        if (bucket.resetAt <= now) this.buckets.delete(bucketKey);
      }
    }
    const existing = this.buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, retryAfterSec: 0 };
    }
    existing.count += 1;
    if (existing.count > this.max) {
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
    }
    return { allowed: true, retryAfterSec: 0 };
  }
}

// ─── Lectura de body con límite duro de tamaño ───────────────────────────────

type BodyResult = { ok: true; raw: string } | { ok: false; tooLarge: boolean };

function readBodyWithLimit(req: IncomingMessage, maxBytes: number): Promise<BodyResult> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let settled = false;
    const finish = (result: BodyResult): void => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    req.on("data", (chunk: unknown) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
      size += buf.length;
      if (size > maxBytes) {
        req.removeAllListeners("data");
        req.resume();
        finish({ ok: false, tooLarge: true });
        return;
      }
      chunks.push(buf);
    });
    req.on("end", () => finish({ ok: true, raw: Buffer.concat(chunks).toString("utf8") }));
    req.on("error", () => finish({ ok: false, tooLarge: false }));
  });
}

// ─── Validación del payload de chat ──────────────────────────────────────────

export interface ParsedChat {
  message: string;
  system: string | null;
  model: string | null;
  history: HistoryTurn[];
}

/** Devuelve el payload validado o un mensaje de error (string) listo para el cliente. */
export function parseChatPayload(raw: unknown): ParsedChat | string {
  if (typeof raw !== "object" || raw === null) return "Cuerpo JSON inválido: se esperaba un objeto.";
  const obj = raw as Record<string, unknown>;

  const message = typeof obj.message === "string" ? obj.message.trim() : "";
  if (message.length === 0) return 'Campo "message" obligatorio (texto no vacío).';
  if (message.length > MAX_MESSAGE_CHARS) {
    return 'Campo "message" demasiado largo (máx ' + String(MAX_MESSAGE_CHARS) + " caracteres).";
  }

  let system: string | null = null;
  if (obj.system !== undefined && obj.system !== null) {
    if (typeof obj.system !== "string") return 'Campo "system" debe ser texto.';
    system = obj.system.trim().slice(0, MAX_SYSTEM_CHARS) || null;
  }

  let model: string | null = null;
  if (obj.model !== undefined && obj.model !== null) {
    if (typeof obj.model !== "string" || !MODEL_ID_RE.test(obj.model)) return 'Campo "model" inválido.';
    model = obj.model;
  }

  const history: HistoryTurn[] = [];
  if (obj.history !== undefined && obj.history !== null) {
    if (!Array.isArray(obj.history)) return 'Campo "history" debe ser un array.';
    const capped = obj.history.slice(-MAX_HISTORY);
    for (const turn of capped) {
      if (typeof turn !== "object" || turn === null) return 'Cada turno de "history" debe ser {role, text}.';
      const t = turn as Record<string, unknown>;
      const role: ChatRole = t.role === "model" ? "model" : "user";
      const text = typeof t.text === "string" ? t.text.slice(0, MAX_MESSAGE_CHARS) : "";
      if (text.length === 0) continue;
      history.push({ role, text });
    }
  }

  return { message, system, model, history };
}

// ─── Cliente Gemini (generateContent) ────────────────────────────────────────

export type GeminiCallResult =
  | { ok: true; text: string; usage: GeminiUsage | null; finishReason: string | null; modelVersion: string | null }
  | { ok: false; status: number; error: string };

interface GeminiRawResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  usageMetadata?: GeminiUsage;
  modelVersion?: string;
}

function mapUpstreamStatus(status: number): number {
  return status >= 500 ? 502 : status;
}

export async function callGemini(
  cfg: ResolvedConfig,
  payload: ParsedChat,
  secrets: string[],
): Promise<GeminiCallResult> {
  const model = payload.model ?? cfg.model;
  const contents: Array<{ role: ChatRole; parts: Array<{ text: string }> }> = [];
  for (const turn of payload.history) {
    contents.push({ role: turn.role, parts: [{ text: turn.text }] });
  }
  contents.push({ role: "user", parts: [{ text: payload.message }] });

  const body: Record<string, unknown> = { contents };
  if (payload.system) body.systemInstruction = { parts: [{ text: payload.system }] };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.upstreamTimeoutMs);
  try {
    const url = cfg.baseUrl + "/v1beta/models/" + model + ":generateContent";
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": cfg.apiKey },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const rawText = await res.text();
    if (!res.ok) {
      let msg = "Upstream HTTP " + String(res.status);
      try {
        const parsedErr = JSON.parse(rawText) as { error?: { message?: string } };
        if (parsedErr.error && typeof parsedErr.error.message === "string") msg += ": " + parsedErr.error.message;
      } catch {
        // cuerpo no-JSON: se conserva el mensaje genérico
      }
      return { ok: false, status: mapUpstreamStatus(res.status), error: redactSecrets(msg, secrets) };
    }

    let parsed: GeminiRawResponse;
    try {
      parsed = JSON.parse(rawText) as GeminiRawResponse;
    } catch {
      return { ok: false, status: 502, error: "Respuesta upstream no-JSON" };
    }

    const candidate = parsed.candidates && parsed.candidates.length > 0 ? parsed.candidates[0] : undefined;
    const parts = candidate && candidate.content && candidate.content.parts ? candidate.content.parts : [];
    let text = "";
    for (const part of parts) {
      if (part && typeof part.text === "string") text += part.text;
    }
    if (text.length === 0) {
      const reason = candidate && candidate.finishReason ? candidate.finishReason : "UNKNOWN";
      return { ok: false, status: 502, error: "Respuesta sin contenido (finishReason=" + reason + ")" };
    }

    return {
      ok: true,
      text,
      usage: parsed.usageMetadata ?? null,
      finishReason: candidate && candidate.finishReason ? candidate.finishReason : null,
      modelVersion: parsed.modelVersion ?? null,
    };
  } catch (err: unknown) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return {
      ok: false,
      status: aborted ? 504 : 502,
      error: aborted
        ? "Timeout del upstream (" + String(cfg.upstreamTimeoutMs) + " ms)"
        : "Fallo de red contactando Gemini: " + (err instanceof Error ? err.message : String(err)),
    };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Helpers HTTP internos ───────────────────────────────────────────────────

function capText(text: string): string {
  if (text.length <= STORED_TEXT_CAP) return text;
  return text.slice(0, STORED_TEXT_CAP) + "…[truncado]";
}

function isAllowedHost(hostHeader: string | undefined, port: number): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.toLowerCase();
  return (
    host === "localhost:" + String(port) ||
    host === "127.0.0.1:" + String(port) ||
    host === "[::1]:" + String(port) ||
    host === "localhost" ||
    host === "127.0.0.1"
  );
}

function securityHeaders(res: ServerResponse, csp?: string): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Security-Policy", csp ?? "default-src 'none'; frame-ancestors 'none'");
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  securityHeaders(res);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

// ─── Configuración resuelta ──────────────────────────────────────────────────

export function resolveConfig(options: BridgeOptions = {}): ResolvedConfig {
  const apiKey = (options.apiKey ?? process.env.GEMINI_API_KEY ?? "").trim();
  return {
    port: options.port ?? envInt("GEMINI_BRIDGE_PORT", DEFAULT_PORT),
    model: options.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
    apiKey,
    baseUrl: (options.baseUrl ?? process.env.GEMINI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, ""),
    persist: options.persist ?? process.env.GEMINI_BRIDGE_PERSIST === "1",
    maxEntries: options.maxEntries ?? DEFAULT_MAX_ENTRIES,
    chatRateLimit: options.chatRateLimit ?? DEFAULT_CHAT_RATE,
    apiRateLimit: options.apiRateLimit ?? DEFAULT_API_RATE,
    upstreamTimeoutMs: options.upstreamTimeoutMs ?? DEFAULT_UPSTREAM_TIMEOUT_MS,
    bodyLimitBytes: options.bodyLimitBytes ?? DEFAULT_BODY_LIMIT,
  };
}

// ─── Factory del bridge ──────────────────────────────────────────────────────

export function createBridge(options: BridgeOptions = {}): BridgeInstance {
  const cfg = resolveConfig(options);
  const secrets = cfg.apiKey.length >= 8 ? [cfg.apiKey] : [];
  const entries: CommsEntry[] = [];
  const chatLimiter = new FixedWindowLimiter(cfg.chatRateLimit, RATE_WINDOW_MS);
  const apiLimiter = new FixedWindowLimiter(cfg.apiRateLimit, RATE_WINDOW_MS);
  const startedAt = Date.now();
  let boundPort = cfg.port;

  const log = (...parts: string[]): void => {
    if (!options.quiet) console.log(new Date().toISOString(), parts.join(" "));
  };

  const persistEntry = async (entry: CommsEntry): Promise<void> => {
    try {
      const dir = join(PROJECT_ROOT, ".gemini-bridge");
      await mkdir(dir, { recursive: true });
      await appendFile(join(dir, "comm-log.jsonl"), JSON.stringify(entry) + "\n", "utf8");
    } catch (err: unknown) {
      log("persist-error", err instanceof Error ? err.message : String(err));
    }
  };

  const record = (entry: CommsEntry): void => {
    entries.push(entry);
    while (entries.length > cfg.maxEntries) entries.shift();
    if (cfg.persist) void persistEntry(entry);
  };

  const commsSnapshot = (): CommsEntry[] => entries.slice().reverse();

  const clearComms = (): void => {
    entries.length = 0;
  };

  const computeStats = (): StatsSnapshot => {
    const okLatencies = entries
      .filter((e) => e.ok)
      .map((e) => e.latencyMs)
      .sort((a, b) => a - b);
    const total = entries.length;
    const okCount = entries.filter((e) => e.ok).length;
    const avg = okLatencies.length > 0 ? Math.round(okLatencies.reduce((a, b) => a + b, 0) / okLatencies.length) : 0;
    const p95 =
      okLatencies.length > 0 ? okLatencies[Math.min(okLatencies.length - 1, Math.floor(okLatencies.length * 0.95))] : 0;
    let tokensPrompt = 0;
    let tokensOutput = 0;
    let tokensTotal = 0;
    const byModel: Record<string, StatsByModelEntry> = {};
    let lastError: StatsSnapshot["lastError"] = null;
    for (const e of entries) {
      const u = e.usage;
      tokensPrompt += u?.promptTokenCount ?? 0;
      tokensOutput += u?.candidatesTokenCount ?? 0;
      tokensTotal += u?.totalTokenCount ?? 0;
      const bucket = byModel[e.model] ?? { total: 0, ok: 0, errors: 0, avgLatencyMs: 0, tokensOutput: 0 };
      bucket.total += 1;
      if (e.ok) {
        bucket.ok += 1;
        bucket.tokensOutput += u?.candidatesTokenCount ?? 0;
      } else {
        bucket.errors += 1;
        lastError = { ts: e.ts, status: e.status, error: e.error ?? "" };
      }
      byModel[e.model] = bucket;
    }
    for (const key of Object.keys(byModel)) {
      const okForModel = entries.filter((e) => e.model === key && e.ok);
      byModel[key].avgLatencyMs =
        okForModel.length > 0 ? Math.round(okForModel.reduce((a, e) => a + e.latencyMs, 0) / okForModel.length) : 0;
    }
    return {
      ts: Date.now(),
      uptimeMs: Date.now() - startedAt,
      version: BRIDGE_VERSION,
      model: cfg.model,
      keyConfigured: cfg.apiKey.length > 0,
      total,
      ok: okCount,
      errors: total - okCount,
      avgLatencyMs: avg,
      p95LatencyMs: p95,
      tokensPrompt,
      tokensOutput,
      tokensTotal,
      byModel,
      lastError,
    };
  };

  const buildMarkdownExport = (): string => {
    const lines: string[] = [];
    lines.push("# Gemini Bridge — Registro de comunicación IA ⇄ Gemini");
    lines.push("");
    lines.push("- Generado: " + new Date().toISOString());
    lines.push("- Modelo por defecto: " + cfg.model);
    lines.push("- Entradas exportadas: " + String(entries.length));
    lines.push("");
    for (const e of commsSnapshot()) {
      const tokens = e.usage && typeof e.usage.totalTokenCount === "number" ? String(e.usage.totalTokenCount) : "n/d";
      lines.push(
        "## " +
          new Date(e.ts).toISOString() +
          " · " +
          e.model +
          " · " +
          (e.ok ? "OK " : "ERROR ") +
          String(e.status) +
          " · " +
          String(e.latencyMs) +
          " ms · tokens " +
          tokens,
      );
      lines.push("");
      lines.push("**Prompt (" + String(e.promptChars) + " caracteres):**");
      lines.push("");
      lines.push(e.prompt);
      lines.push("");
      lines.push("**Respuesta:**");
      lines.push("");
      lines.push(e.ok ? e.response : "ERROR: " + (e.error ?? ""));
      lines.push("");
    }
    return lines.join("\n");
  };

  const handle = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const t0 = Date.now();
    const method = req.method ?? "GET";
    let url: URL;
    try {
      url = new URL(req.url ?? "/", "http://127.0.0.1");
    } catch {
      sendJson(res, 400, { ok: false, error: "URL inválida" });
      return;
    }
    const path = url.pathname;
    const done = (status: number): void => {
      log(method + " " + path + " → " + String(status) + " (" + String(Date.now() - t0) + "ms)");
    };
    const jsonOut = (status: number, payload: unknown): void => {
      sendJson(res, status, payload);
      done(status);
    };

    // Anti DNS-rebinding: solo se atiende a hosts de loopback.
    if (!isAllowedHost(req.headers.host, boundPort)) {
      jsonOut(403, {
        ok: false,
        error: "Host no permitido: el bridge solo atiende a loopback (127.0.0.1 / localhost)",
      });
      return;
    }

    if (path === "/" && method === "GET") {
      const nonce = randomBytes(16).toString("base64");
      const html = UI_HTML.split("__NONCE__").join(nonce);
      securityHeaders(
        res,
        "default-src 'none'; script-src 'nonce-" +
          nonce +
          "'; style-src 'nonce-" +
          nonce +
          "'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      );
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
      done(200);
      return;
    }

    if (!path.startsWith("/api/")) {
      jsonOut(404, { ok: false, error: "No encontrado" });
      return;
    }

    const ip = req.socket.remoteAddress ?? "local";
    const apiCheck = apiLimiter.check(ip);
    if (!apiCheck.allowed) {
      res.setHeader("Retry-After", String(apiCheck.retryAfterSec));
      jsonOut(429, { ok: false, error: "Demasiadas peticiones a la API (límite por minuto)" });
      return;
    }

    if (path === "/api/health" && method === "GET") {
      jsonOut(200, {
        ok: true,
        version: BRIDGE_VERSION,
        model: cfg.model,
        keyConfigured: cfg.apiKey.length > 0,
        uptimeMs: Date.now() - startedAt,
        entries: entries.length,
      });
      return;
    }

    if (path === "/api/stats" && method === "GET") {
      jsonOut(200, computeStats());
      return;
    }

    if (path === "/api/comms" && method === "GET") {
      const limitRaw = Number(url.searchParams.get("limit") ?? "200");
      const limit = Number.isInteger(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 500) : 200;
      const q = (url.searchParams.get("q") ?? "").toLowerCase();
      const onlyErrors = url.searchParams.get("errors") === "1";
      const selected = entries
        .slice()
        .reverse()
        .filter((e) => {
          if (onlyErrors && e.ok) return false;
          if (q.length > 0) {
            const haystack = (e.prompt + " " + e.response + " " + e.model + " " + (e.error ?? "")).toLowerCase();
            if (!haystack.includes(q)) return false;
          }
          return true;
        })
        .slice(0, limit);
      jsonOut(200, { ok: true, total: entries.length, returned: selected.length, entries: selected });
      return;
    }

    if (path === "/api/comms/clear" && method === "POST") {
      const count = entries.length;
      clearComms();
      jsonOut(200, { ok: true, cleared: count });
      return;
    }

    if (path === "/api/export" && method === "GET") {
      const format = url.searchParams.get("format") === "md" ? "md" : "json";
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const body =
        format === "md"
          ? buildMarkdownExport()
          : JSON.stringify(
              { exportedAt: new Date().toISOString(), stats: computeStats(), entries: commsSnapshot() },
              null,
              2,
            );
      securityHeaders(res);
      res.writeHead(200, {
        "content-type": format === "md" ? "text/markdown; charset=utf-8" : "application/json; charset=utf-8",
        "content-disposition": 'attachment; filename="gemini-bridge-' + stamp + "." + format + '"',
      });
      res.end(body);
      done(200);
      return;
    }

    if (path === "/api/chat" && method === "POST") {
      const chatCheck = chatLimiter.check(ip);
      if (!chatCheck.allowed) {
        res.setHeader("Retry-After", String(chatCheck.retryAfterSec));
        jsonOut(429, { ok: false, error: "Límite de /api/chat alcanzado (" + String(cfg.chatRateLimit) + "/min)" });
        return;
      }
      if (cfg.apiKey.length === 0) {
        jsonOut(503, { ok: false, error: "GEMINI_API_KEY no configurada. Añádela a .env y reinicia el bridge." });
        return;
      }
      const bodyRes = await readBodyWithLimit(req, cfg.bodyLimitBytes);
      if (!bodyRes.ok) {
        jsonOut(bodyRes.tooLarge ? 413 : 400, {
          ok: false,
          error: bodyRes.tooLarge
            ? "Payload demasiado grande (límite " + String(cfg.bodyLimitBytes) + " bytes)"
            : "Cuerpo de petición ilegible",
        });
        return;
      }
      let parsedRaw: unknown;
      try {
        parsedRaw = JSON.parse(bodyRes.raw);
      } catch {
        jsonOut(400, { ok: false, error: "JSON inválido" });
        return;
      }
      const chat = parseChatPayload(parsedRaw);
      if (typeof chat === "string") {
        jsonOut(400, { ok: false, error: chat });
        return;
      }

      const result = await callGemini(cfg, chat, secrets);
      const latencyMs = Date.now() - t0;
      const promptText = (
        chat.history.map((h) => "[" + h.role + "] " + h.text).join("\n\n") +
        "\n\n[user] " +
        chat.message
      ).trim();
      const entry: CommsEntry = {
        id: randomUUID(),
        ts: Date.now(),
        model: chat.model ?? cfg.model,
        status: result.ok ? 200 : result.status,
        ok: result.ok,
        latencyMs,
        promptChars: promptText.length,
        responseChars: result.ok ? result.text.length : 0,
        usage: result.ok ? result.usage : null,
        finishReason: result.ok ? result.finishReason : null,
        error: result.ok ? null : redactSecrets(result.error, secrets),
        prompt: capText(promptText),
        response: result.ok ? capText(result.text) : "",
      };
      record(entry);

      if (result.ok) {
        jsonOut(200, {
          ok: true,
          id: entry.id,
          model: entry.model,
          text: result.text,
          usage: result.usage,
          latencyMs,
          finishReason: result.finishReason,
        });
      } else {
        jsonOut(result.status, { ok: false, model: entry.model, error: result.error, latencyMs });
      }
      return;
    }

    jsonOut(404, { ok: false, error: "Endpoint desconocido" });
  };

  const server: Server = createServer((req, res) => {
    void handle(req, res).catch((err: unknown) => {
      try {
        sendJson(res, 500, {
          ok: false,
          error: "Error interno: " + redactSecrets(err instanceof Error ? err.message : String(err), secrets),
        });
      } catch {
        // socket ya cerrado
      }
    });
  });
  server.requestTimeout = 115_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;

  const start = async (): Promise<number> => {
    if (cfg.persist) {
      try {
        await mkdir(join(PROJECT_ROOT, ".gemini-bridge"), { recursive: true });
      } catch {
        // se reintentará al persistir cada entrada
      }
    }
    return new Promise<number>((resolve, reject) => {
      server.once("listening", () => {
        const addr = server.address();
        const port2 = typeof addr === "object" && addr !== null ? addr.port : cfg.port;
        boundPort = port2;
        resolve(port2);
      });
      server.once("error", (err: Error) => {
        reject(err);
      });
      server.listen(cfg.port, "127.0.0.1");
    });
  };

  const stop = async (): Promise<void> => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    server.closeAllConnections();
  };

  return {
    server,
    config: cfg,
    start,
    stop,
    stats: computeStats,
    comms: commsSnapshot,
    record,
    clearComms,
  };
}
// ─── UI de análisis (embebida, vanilla JS, 0 dependencias — convención DevTools) ────

const UI_HEAD = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Gemini Bridge · Análisis de comunicación IA ⇄ Gemini</title>
<style nonce="__NONCE__">
:root{--bg:#0d1117;--panel:#161b22;--panel2:#1c2129;--border:#30363d;--text:#e6edf3;--muted:#8b949e;--accent:#58a6ff;--ok:#3fb950;--err:#f85149;--warn:#d29922;--mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;--sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--radius:8px}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:14px;line-height:1.5}
a{color:var(--accent)}
header{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 18px;border-bottom:1px solid var(--border);background:var(--panel)}
header h1{font-size:16px;font-weight:600;margin-right:6px}
.badge{font-family:var(--mono);font-size:11px;padding:3px 8px;border-radius:999px;border:1px solid var(--border);color:var(--muted)}
.badge.ok{color:var(--ok);border-color:var(--ok)}
.badge.err{color:var(--err);border-color:var(--err)}
#uptime{margin-left:auto}
#banner{display:none;background:#2b1d00;border:1px solid var(--warn);color:#ffe9b3;padding:10px 18px;margin:12px 18px 0;border-radius:var(--radius);font-size:13px}
#banner code{font-family:var(--mono)}
.cards{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;padding:12px 18px 0;max-width:1400px;margin:0 auto}
.card{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px}
.card .k{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.5px}
.card .v{font-family:var(--mono);font-size:18px;margin-top:2px}
.card .v.bad{color:var(--err)}
main{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:14px;padding:14px 18px 20px;max-width:1400px;margin:0 auto}
.panel{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);display:flex;flex-direction:column;min-height:460px;overflow:hidden}
.panel>h2{font-size:13px;padding:10px 12px;border-bottom:1px solid var(--border);color:var(--muted);font-weight:600;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#chatlog{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:160px}
.bubble{max-width:88%;padding:8px 11px;border-radius:var(--radius);white-space:pre-wrap;word-break:break-word;font-size:13px}
.bubble.user{align-self:flex-end;background:#1f3a5f;border:1px solid #2d5380}
.bubble.model{align-self:flex-start;background:var(--panel2);border:1px solid var(--border)}
.bubble.errb{align-self:center;background:#3a1418;border:1px solid var(--err);color:#ffb3b8}
.meta{font-family:var(--mono);font-size:10px;color:var(--muted)}
.meta.right{align-self:flex-end}
#chatform{border-top:1px solid var(--border);padding:10px;display:flex;flex-direction:column;gap:8px}
textarea,input[type=text],input[type=search]{background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:8px;font-family:var(--mono);font-size:13px}
textarea:focus,input:focus{outline:2px solid var(--accent);outline-offset:1px}
#msg{width:100%;min-height:64px;resize:vertical}
#systemBox{width:100%;margin-top:6px}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.push{margin-left:auto}
button{background:var(--accent);color:#04121f;border:0;border-radius:6px;padding:8px 14px;font-weight:600;font-size:13px;cursor:pointer}
button.ghost{background:transparent;color:var(--muted);border:1px solid var(--border);padding:5px 10px;font-size:12px}
button:hover{filter:brightness(1.15)}
button:disabled{opacity:.45;cursor:not-allowed}
label{color:var(--muted);font-size:12px;display:inline-flex;align-items:center;gap:4px}
#commsBody{flex:1;overflow:auto}
table{width:100%;border-collapse:collapse;font-family:var(--mono);font-size:12px}
th,td{padding:6px 8px;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap;max-width:260px;overflow:hidden;text-overflow:ellipsis}
th{color:var(--muted);position:sticky;top:0;background:var(--panel);z-index:1}
tr.entry{cursor:pointer}
tr.entry:hover,tr.entry:focus{background:var(--panel2);outline:none}
td.ok{color:var(--ok)}
td.err{color:var(--err)}
.empty{color:var(--muted);font-family:var(--mono);font-size:12px;padding:12px}
#detail{display:none;border-top:1px solid var(--border);padding:10px 12px;background:var(--panel2);max-height:300px;overflow:auto}
#detail pre{white-space:pre-wrap;word-break:break-word;font-family:var(--mono);font-size:12px;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px;margin:6px 0;max-height:160px;overflow:auto}
#detail h3{font-size:11px;color:var(--muted);margin-top:8px;text-transform:uppercase;letter-spacing:.5px}
summary{cursor:pointer;color:var(--muted);font-size:12px}
@media (max-width:900px){main{grid-template-columns:1fr}.cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
</head>
`;
const UI_BODY = `<body>
<header>
  <h1>🔒 Gemini Bridge</h1>
  <span class="badge" id="bModel">…</span>
  <span class="badge" id="bKey">…</span>
  <span class="badge" id="bLat">—</span>
  <span class="badge" id="uptime">0s</span>
</header>
<div id="banner">⚠️ <strong>GEMINI_API_KEY no configurada.</strong> Añade <code>GEMINI_API_KEY</code> a tu <code>.env</code> (clave gratuita de <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>) y reinicia <code>npm run gemini:bridge</code>. Modelo por defecto: <code>gemini-3-pro-preview</code> (el que usa Google Antigravity).</div>
<div class="cards">
  <div class="card"><div class="k">Peticiones</div><div class="v" id="cTotal">0</div></div>
  <div class="card"><div class="k">Errores</div><div class="v" id="cErrors">0</div></div>
  <div class="card"><div class="k">Latencia media</div><div class="v" id="cAvg">—</div></div>
  <div class="card"><div class="k">Latencia p95</div><div class="v" id="cP95">—</div></div>
  <div class="card"><div class="k">Tokens entrada</div><div class="v" id="cTokIn">0</div></div>
  <div class="card"><div class="k">Tokens salida</div><div class="v" id="cTokOut">0</div></div>
</div>
<main>
  <section class="panel" aria-label="Chat con Gemini">
    <h2>💬 Chat en local → Gemini</h2>
    <div id="chatlog" aria-live="polite"><div class="empty">La conversación aparecerá aquí. Cada intercambio queda registrado en 📡 Comunicaciones.</div></div>
    <form id="chatform">
      <details>
        <summary>System prompt (opcional)</summary>
        <textarea id="systemBox" rows="2" aria-label="System prompt" placeholder="Instrucciones de sistema para Gemini…"></textarea>
      </details>
      <div class="row">
        <input type="text" id="modelBox" size="26" aria-label="Modelo de Gemini" placeholder="modelo (vacío = por defecto)">
        <label><input type="checkbox" id="useHist" checked> incluir historial</label>
      </div>
      <textarea id="msg" aria-label="Mensaje para Gemini" placeholder="Escribe tu mensaje… (Enter envía · Shift+Enter salto de línea)"></textarea>
      <div class="row">
        <button type="submit" id="sendBtn">Enviar ⏎</button>
        <button type="button" class="ghost" id="clearChatBtn" aria-label="Limpiar conversación">Limpiar chat</button>
        <span class="meta" id="chatStatus" role="status" aria-live="polite"></span>
      </div>
    </form>
  </section>
  <section class="panel" aria-label="Registro de comunicaciones">
    <h2>📡 Comunicaciones
      <button type="button" class="ghost" id="refreshBtn" aria-label="Refrescar ahora">↻</button>
      <label><input type="checkbox" id="auto" checked> auto</label>
      <label><input type="checkbox" id="onlyErr"> solo errores</label>
      <input type="search" id="q" size="12" aria-label="Buscar en comunicaciones" placeholder="buscar…">
      <button type="button" class="ghost" id="expJson" aria-label="Exportar JSON">JSON</button>
      <button type="button" class="ghost" id="expMd" aria-label="Exportar Markdown">MD</button>
      <button type="button" class="ghost" id="clearBtn" aria-label="Borrar registro">🗑</button>
    </h2>
    <div id="commsBody">
      <table aria-label="Registro de comunicaciones IA y Gemini">
        <thead><tr><th scope="col">Hora</th><th scope="col">Modelo</th><th scope="col">Estado</th><th scope="col">ms</th><th scope="col">Tokens</th><th scope="col">Detalle</th></tr></thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
    <div id="detail" role="region" aria-label="Detalle de la comunicación seleccionada">
      <div class="row"><strong id="dTitle">—</strong><span class="meta" id="dMeta"></span><button type="button" class="ghost push" id="dClose" aria-label="Cerrar detalle">✕</button></div>
      <h3>Prompt</h3><pre id="dPrompt"></pre>
      <h3>Respuesta</h3><pre id="dResp"></pre>
    </div>
  </section>
</main>
<script nonce="__NONCE__">
(function () {
  "use strict";
  var S = { entries: [], stats: null, history: [] };
  function $(id) { return document.getElementById(id); }
  function esc(v) { var d = document.createElement("div"); d.textContent = (v === null || v === undefined) ? "" : String(v); return d.innerHTML; }
  function fmtMs(n) { if (n === null || n === undefined || isNaN(n) || n <= 0) return "—"; return (Math.round(n * 10) / 10) + " ms"; }
  function fmtN(n) { if (n === null || n === undefined || isNaN(n)) return "0"; return Number(n).toLocaleString("es-ES"); }
  function fmtUp(ms) { var s = Math.floor(ms / 1000); var h = Math.floor(s / 3600); var m = Math.floor((s % 3600) / 60); var r = s % 60; return (h ? h + "h " : "") + (m ? m + "m " : "") + r + "s"; }
  function pad(x) { return (x < 10 ? "0" : "") + x; }
  function fmtT(ts) { var d = new Date(ts); return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); }
  function fetchJSON(url, opts) { return fetch(url, opts).then(function (r) { return r.json().then(function (j) { return { status: r.status, json: j }; }); }); }

  function renderStats() {
    var s = S.stats;
    if (!s) return;
    $("cTotal").textContent = fmtN(s.total);
    $("cErrors").textContent = fmtN(s.errors);
    $("cErrors").className = "v" + (s.errors > 0 ? " bad" : "");
    $("cAvg").textContent = fmtMs(s.avgLatencyMs);
    $("cP95").textContent = fmtMs(s.p95LatencyMs);
    $("cTokIn").textContent = fmtN(s.tokensPrompt);
    $("cTokOut").textContent = fmtN(s.tokensOutput);
    $("bModel").textContent = "🧠 " + s.model;
    $("bKey").textContent = s.keyConfigured ? "🔑 API key ✓" : "🔑 sin API key";
    $("bKey").className = "badge " + (s.keyConfigured ? "ok" : "err");
    $("uptime").textContent = fmtUp(s.uptimeMs);
    $("banner").style.display = s.keyConfigured ? "none" : "block";
  }

  function renderTable() {
    var tb = $("tbody");
    if (S.entries.length === 0) { tb.innerHTML = '<tr><td colspan="6" class="empty">Sin comunicaciones registradas todavía.</td></tr>'; return; }
    var html = "";
    for (var i = 0; i < S.entries.length; i++) {
      var e = S.entries[i];
      var tokens = e.usage ? fmtN(e.usage.totalTokenCount) : "—";
      var detail = e.error ? esc(String(e.error).slice(0, 70)) : (fmtN(e.responseChars) + " car");
      html += '<tr class="entry" tabindex="0" role="button" data-id="' + esc(e.id) + '" aria-label="Ver comunicación de ' + esc(fmtT(e.ts)) + '">'
        + "<td>" + esc(fmtT(e.ts)) + "</td>"
        + "<td>" + esc(e.model) + "</td>"
        + '<td class="' + (e.ok ? "ok" : "err") + '">' + (e.ok ? "OK " : "ERR ") + e.status + "</td>"
        + "<td>" + fmtMs(e.latencyMs) + "</td>"
        + "<td>" + tokens + "</td>"
        + "<td>" + detail + "</td></tr>";
    }
    tb.innerHTML = html;
  }

  function openDetail(id) {
    var e = null;
    for (var i = 0; i < S.entries.length; i++) { if (S.entries[i].id === id) { e = S.entries[i]; break; } }
    if (!e) return;
    $("dTitle").textContent = fmtT(e.ts) + " · " + e.model;
    $("dMeta").textContent = (e.ok ? "OK " : "ERROR ") + e.status + " · " + fmtMs(e.latencyMs) + " · prompt " + fmtN(e.promptChars) + " car · salida " + fmtN(e.responseChars) + " car" + (e.usage ? " · tokens " + fmtN(e.usage.promptTokenCount) + "→" + fmtN(e.usage.candidatesTokenCount) : "") + (e.finishReason ? " · " + e.finishReason : "");
    $("dPrompt").textContent = e.prompt || "(vacío)";
    $("dResp").textContent = e.ok ? (e.response || "(vacío)") : "ERROR: " + (e.error || "desconocido");
    $("detail").style.display = "block";
    $("dClose").focus();
  }
  function closeDetail() { $("detail").style.display = "none"; }
  function addBubble(cls, text, meta) {
    var log = $("chatlog");
    var empty = log.querySelector(".empty");
    if (empty) empty.remove();
    var b = document.createElement("div");
    b.className = "bubble " + cls;
    b.textContent = (text === undefined || text === null) ? "" : String(text);
    log.appendChild(b);
    if (meta) {
      var m = document.createElement("div");
      m.className = "meta" + (cls === "user" ? " right" : "");
      m.textContent = meta;
      log.appendChild(m);
    }
    log.scrollTop = log.scrollHeight;
  }

  function sendChat(ev) {
    ev.preventDefault();
    var input = $("msg");
    var msg = input.value.trim();
    if (!msg) return;
    var btn = $("sendBtn");
    btn.disabled = true;
    $("chatStatus").textContent = "Enviando a Gemini…";
    var body = { message: msg };
    var sys = $("systemBox").value.trim();
    if (sys) body.system = sys;
    var m = $("modelBox").value.trim();
    if (m) body.model = m;
    if ($("useHist").checked && S.history.length > 0) body.history = S.history.slice(-20);
    fetchJSON("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) {
        var j = r.json;
        if (j && j.ok) {
          S.history.push({ role: "user", text: msg });
          S.history.push({ role: "model", text: String(j.text || "") });
          addBubble("user", msg);
          addBubble("model", String(j.text || ""), String(j.model || "?") + " · " + fmtMs(j.latencyMs) + " · " + fmtN(j.usage ? j.usage.totalTokenCount : 0) + " tok");
          $("chatStatus").textContent = "OK";
          input.value = "";
        } else {
          addBubble("errb", (j && j.error ? String(j.error) : "Error desconocido") + " (HTTP " + r.status + ")");
          $("chatStatus").textContent = "Error";
        }
        refresh();
      })
      .catch(function (err) {
        addBubble("errb", "Fallo de red: " + err);
        $("chatStatus").textContent = "Error de red";
      })
      .then(function () { btn.disabled = false; });
  }

  function refreshStats() {
    return fetchJSON("/api/stats").then(function (r) {
      if (r.status === 200) { S.stats = r.json; renderStats(); }
    }).catch(function () {});
  }
  function refreshComms() {
    var q = $("q").value.trim();
    var only = $("onlyErr").checked;
    var url = "/api/comms?limit=200" + (q ? "&q=" + encodeURIComponent(q) : "") + (only ? "&errors=1" : "");
    return fetchJSON(url).then(function (r) {
      if (r.status === 200) { S.entries = r.json.entries || []; renderTable(); }
    }).catch(function () {});
  }
  function refresh() { refreshStats(); refreshComms(); }

  $("chatform").addEventListener("submit", sendChat);
  $("msg").addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); if ($("chatform").requestSubmit) $("chatform").requestSubmit(); else $("sendBtn").click(); }
  });
  $("clearChatBtn").addEventListener("click", function () {
    S.history = [];
    $("chatlog").innerHTML = '<div class="empty">La conversación aparecerá aquí.</div>';
    $("chatStatus").textContent = "Conversación limpiada (el registro de 📡 se conserva)";
  });
  $("refreshBtn").addEventListener("click", refresh);
  $("onlyErr").addEventListener("change", refreshComms);
  $("q").addEventListener("input", refreshComms);
  $("expJson").addEventListener("click", function () { window.location.href = "/api/export?format=json"; });
  $("expMd").addEventListener("click", function () { window.location.href = "/api/export?format=md"; });
  $("clearBtn").addEventListener("click", function () {
    fetchJSON("/api/comms/clear", { method: "POST" }).then(function () { refresh(); });
  });
  $("dClose").addEventListener("click", closeDetail);
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") closeDetail(); });
  $("tbody").addEventListener("click", function (ev) {
    var t = ev.target;
    var tr = t && t.closest ? t.closest("tr.entry") : null;
    if (tr && tr.getAttribute("data-id")) openDetail(tr.getAttribute("data-id"));
  });
  $("tbody").addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    var t = ev.target;
    var tr = t && t.closest ? t.closest("tr.entry") : null;
    if (tr) { ev.preventDefault(); openDetail(tr.getAttribute("data-id")); }
  });
  setInterval(function () { if ($("auto").checked) refresh(); }, 2500);
  setInterval(function () { if (S.stats) $("uptime").textContent = fmtUp(S.stats.uptimeMs); }, 1000);
  refresh();
</script>
</body>
</html>
`;

const UI_HTML = UI_HEAD + UI_BODY;
// ─── CLI / arranque ──────────────────────────────────────────────────────────

function printHelp(): void {
  console.log("");
  console.log("  🔒 Gemini Bridge v" + BRIDGE_VERSION + " — puente local IA ⇄ Gemini + panel de análisis");
  console.log("");
  console.log("  Uso: npm run gemini:bridge [-- --port=8785 --model=gemini-3-pro-preview --persist]");
  console.log("");
  console.log("  Flags:");
  console.log("    --port=N        puerto del servidor (default 8785 o GEMINI_BRIDGE_PORT)");
  console.log("    --model=ID      modelo Gemini (default gemini-3-pro-preview, el de Antigravity)");
  console.log("    --persist       persiste el registro en .gemini-bridge/comm-log.jsonl");
  console.log("    --help          muestra esta ayuda");
  console.log("");
  console.log("  Endpoints: GET / · POST /api/chat · GET /api/comms · GET /api/stats");
  console.log("             GET /api/health · POST /api/comms/clear · GET /api/export?format=md|json");
  console.log("");
}

function main(): void {
  const cli = parseCliArgs(process.argv.slice(2));
  if (cli.help) {
    printHelp();
    return;
  }
  loadDotEnv(join(PROJECT_ROOT, ".env"));
  const bridge = createBridge({
    port: cli.port ?? envInt("GEMINI_BRIDGE_PORT", DEFAULT_PORT),
    model: cli.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
    persist: cli.persist ?? process.env.GEMINI_BRIDGE_PERSIST === "1",
  });
  void bridge
    .start()
    .then((port) => {
      const hasKey = bridge.config.apiKey.length > 0;
      console.log("");
      console.log("  🔒 Gemini Bridge v" + BRIDGE_VERSION + " — IA local ⇄ Gemini");
      console.log("  ────────────────────────────────────────────────");
      console.log("  UI análisis  : http://127.0.0.1:" + String(port) + "/");
      console.log("  Modelo       : " + bridge.config.model);
      console.log("  API key      : " + (hasKey ? "configurada ✓" : "NO configurada ✗"));
      console.log(
        "  Persistencia : " +
          (bridge.config.persist
            ? ".gemini-bridge/comm-log.jsonl"
            : "solo memoria (--persist / GEMINI_BRIDGE_PERSIST=1)"),
      );
      console.log("  Seguridad    : loopback 127.0.0.1 · Host check · rate-limit · payload ≤256KB · CSP nonce");
      console.log("  Parar        : Ctrl+C");
      if (!hasKey) {
        console.log("");
        console.log("  ⚠️  Sin GEMINI_API_KEY el chat responderá 503. Consigue una clave gratuita en");
        console.log("      https://aistudio.google.com/apikey y añádela a .env como GEMINI_API_KEY=...");
      }
      console.log("");
    })
    .catch((err: unknown) => {
      console.error("No se pudo iniciar Gemini Bridge:", err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    });
  const shutdown = (): void => {
    void bridge.stop().then(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

const invoked = process.argv[1];
const invokedHref = invoked ? pathToFileURL(invoked).href : "";
const selfHref = import.meta.url;
const isDirectRun =
  invokedHref === selfHref || (process.platform === "win32" && invokedHref.toLowerCase() === selfHref.toLowerCase());
if (isDirectRun) {
  main();
}
