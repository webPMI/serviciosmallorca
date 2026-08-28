/**
 * 🔐 security-audit.ts — Auditoría estática de secretos y configuración segura (GR-13).
 *
 * Escanea el repositorio en busca de secretos hardcodeados y verifica la higiene de
 * configuración (git/gitignore). Pensado para CI y pre-commit:
 *
 *   npm run audit:security          # escaneo estático + higiene git
 *   npm run audit:security -- --deps  # añade npm audit --omit=dev (requiere red)
 *
 * Reglas de alto señal (se escanean en TODOS los ficheros):
 *   - Claves de Google (AIza...), claves estilo OpenAI (sk-...), bloques de clave privada,
 *     JWT con firma, URLs de base de datos con credenciales embebidas.
 * Regla genérica (se omite en tests/ y en líneas claramente no-secretas):
 *   - Asignaciones tipo apiKey/secret/password/token = "literal largo".
 *
 * Exit code 1 si hay hallazgos: apto para tuberías CI.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["src", "scripts", "public", "tests", "docs"];
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".astro", ".html", ".json", ".md", ".css", ".txt", ".xml"]);
const SKIP_DIRS = new Set(["node_modules", ".astro", "dist", ".git", "coverage", ".wrangler", ".gemini-bridge"]);
const MAX_FILE_BYTES = 1_000_000;

interface Finding {
  file: string;
  line: number;
  rule: string;
  snippet: string;
}

interface ScanRule {
  id: string;
  re: RegExp;
  highSignal: boolean;
}

const RULES: ScanRule[] = [
  { id: "google-api-key", re: /AIza[0-9A-Za-z_\\-]{30,}/, highSignal: true },
  { id: "openai-style-key", re: /sk-[A-Za-z0-9]{20,}/, highSignal: true },
  { id: "private-key-block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, highSignal: true },
  { id: "jwt-signed", re: /eyJ[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}/, highSignal: true },
  {
    id: "db-credentials-url",
    re: /(mongodb|postgres|postgresql|mysql|redis):\/\/[^\s\/"'`]+:[^\s@\/"'`]+@/,
    highSignal: true,
  },
  {
    id: "generic-secret-assignment",
    re: /\b(api[_-]?key|apisecret|api[_-]?secret|client[_-]?secret|password|passwd|auth[_-]?token)\b\s*[:=]\s*["'][^"'\s]{16,}["']/i,
    highSignal: false,
  },
];

// Líneas que claramente NO contienen secretos reales (solo aplican a reglas no alto-señal
// y, para alto-señal, únicamente a los marcadores de configuración por entorno).
const ENV_MARKER_RE = /process\.env|import\.meta\.env/;
const LINE_ALLOWLIST_RE = /your[_-]?api|placeholder|example|xxxx|<your|dummy|fake|stub|fixture|test-key|\$\{[A-Z_]+\}/i;
const PATH_ALLOWLIST_RE = /\.env\.example/i;

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(path);
    } else if (entry.isFile() && SCAN_EXT.has(extname(entry.name).toLowerCase())) {
      yield path;
    }
  }
}

// ─── Escaneo estático ────────────────────────────────────────────────────────

function scanRepository(): { findings: Finding[]; scanned: number } {
  const findings: Finding[] = [];
  let scanned = 0;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(join(ROOT, dir))) {
      const rel = relative(ROOT, file).split("\\").join("/");
      if (PATH_ALLOWLIST_RE.test(rel)) continue;
      let content = "";
      try {
        if (statSync(file).size > MAX_FILE_BYTES) continue;
        content = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      scanned += 1;
      const lines = content.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.length === 0) continue;
        for (const rule of RULES) {
          if (!rule.highSignal) {
            if (rel.startsWith("tests/")) continue; // en tests, claves genéricas son fixtures
            if (LINE_ALLOWLIST_RE.test(line)) continue;
          } else if (ENV_MARKER_RE.test(line)) {
            continue; // alto-señal: solo se perdona la lectura desde entorno
          }
          if (rule.re.test(line)) {
            // Literales declaradamente falsos (fixtures tipo "AIzaSyFake...") no son secretos.
            const matched = line.match(rule.re)?.[0] ?? "";
            if (matched && /fake/i.test(matched)) continue;
            findings.push({ file: rel, line: i + 1, rule: rule.id, snippet: line.trim().slice(0, 120) });
          }
        }
      }
    }
  }
  return { findings, scanned };
}

// ─── Higiene de configuración (git / gitignore) ──────────────────────────────

function checkGitHygiene(): string[] {
  const problems: string[] = [];
  let tracked: string[] = [];
  try {
    tracked = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
  } catch {
    return ["No se pudo ejecutar 'git ls-files' (¿repo sin git?)"];
  }
  for (const forbidden of [".env", ".env.production", ".gemini-bridge"]) {
    if (tracked.some((f) => f === forbidden || f.startsWith(forbidden + "/"))) {
      problems.push(`'${forbidden}' está trackeado en git (debe estar ignorado)`);
    }
  }
  const gitignore = existsSync(join(ROOT, ".gitignore")) ? readFileSync(join(ROOT, ".gitignore"), "utf8") : "";
  for (const needed of [".env", ".gemini-bridge/"]) {
    if (!gitignore.includes(needed)) problems.push(`.gitignore no ignora '${needed}'`);
  }
  return problems;
}

// ─── npm audit opcional (--deps) ─────────────────────────────────────────────

function runDependencyAudit(): { failed: boolean; summary: string } {
  try {
    const out = execSync("npm audit --omit=dev --json", {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const audit = JSON.parse(out) as { metadata?: { vulnerabilities?: Record<string, number> } };
    const v = audit.metadata?.vulnerabilities ?? {};
    const summary = JSON.stringify(v);
    const critical = (v.high ?? 0) + (v.critical ?? 0);
    return { failed: critical > 0, summary: `npm audit (prod): ${summary}` };
  } catch (err: unknown) {
    const stdout = (err as { stdout?: string }).stdout ?? "";
    try {
      const audit = JSON.parse(stdout) as { metadata?: { vulnerabilities?: Record<string, number> } };
      const v = audit.metadata?.vulnerabilities ?? {};
      const critical = (v.high ?? 0) + (v.critical ?? 0);
      return { failed: critical > 0, summary: `npm audit (prod): ${JSON.stringify(v)}` };
    } catch {
      return { failed: false, summary: "npm audit no disponible o sin red (no bloquea la auditoría)" };
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  console.log("");
  console.log("🔐 Auditoría de seguridad estática — Servicios Mallorca (GR-13)");
  console.log("═".repeat(64));

  const { findings, scanned } = scanRepository();
  console.log(`  Ficheros escaneados: ${String(scanned)} (${SCAN_DIRS.join(", ")})`);
  if (findings.length === 0) {
    console.log("  ✅ Secretos hardcodeados: 0 hallazgos");
  } else {
    console.log(`  ❌ Secretos hardcodeados: ${String(findings.length)} hallazgo(s):`);
    for (const f of findings) console.log(`     [${f.rule}] ${f.file}:${String(f.line)} → ${f.snippet}`);
  }

  const gitProblems = checkGitHygiene();
  if (gitProblems.length === 0) {
    console.log("  ✅ Higiene git: .env/.gemini-bridge ignorados y no trackeados");
  } else {
    for (const p of gitProblems) console.log(`  ❌ ${p}`);
  }

  let depFailed = false;
  if (process.argv.includes("--deps")) {
    const deps = runDependencyAudit();
    depFailed = deps.failed;
    console.log(`  ${deps.failed ? "❌" : "✅"} ${deps.summary}`);
  } else {
    console.log("  ℹ️  npm audit omitido (usa --deps para incluirlo)");
  }

  const clean = findings.length === 0 && gitProblems.length === 0 && !depFailed;
  console.log("═".repeat(64));
  console.log(clean ? "  ✅ AUDITORÍA LIMPIA" : "  ❌ AUDITORÍA CON HALLAZGOS (exit 1)");
  console.log("");
  if (!clean) process.exitCode = 1;
}

const invoked = process.argv[1];
const invokedHref = invoked ? pathToFileURL(invoked).href : "";
const selfHref = import.meta.url;
const isDirectRun =
  invokedHref === selfHref || (process.platform === "win32" && invokedHref.toLowerCase() === selfHref.toLowerCase());
if (isDirectRun) {
  main();
}
