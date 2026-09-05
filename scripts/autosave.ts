/**
 * scripts/autosave.ts
 *
 * 💾 AUTO-GUARDADO CONTINUO — Git Commit + Push sin Build
 *
 * Uso:
 *   node --experimental-strip-types scripts/autosave.ts
 *   node --experimental-strip-types scripts/autosave.ts "descripcion opcional"
 *
 * En package.json: "autosave": "node --experimental-strip-types scripts/autosave.ts"
 *
 * Hace SOLO: git add -A → git commit → git pull rebase → git push
 * NO hace:   build de produccion, tests ni deploy Cloudflare.
 */

import { execSync } from "node:child_process";

const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function run(cmd: string, label: string, failFast = true): boolean {
  console.log(`${YELLOW}⚡ ${label}${RESET}`);
  try {
    const out = execSync(cmd, { stdio: "pipe", encoding: "utf-8" });
    if (out.trim()) console.log(out.trim());
    console.log(`${GREEN}✔ ${label}${RESET}`);
    return true;
  } catch (err: any) {
    const msg = (err.stdout?.toString() || err.stderr?.toString() || err.message || "").slice(0, 500);
    if (failFast) {
      console.error(`${RED}${BOLD}❌ ${label}${RESET}\n${msg}`);
      process.exit(1);
    }
    console.warn(`${YELLOW}⚠️  ${label} (no critico)${RESET}\n${msg}`);
    return false;
  }
}

function getTimestamp(): string {
  return new Date()
    .toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(", ", " ");
}

const ts = getTimestamp();
const customMsg = process.argv.slice(2).join(" ");
const commitMsg = customMsg
  ? `chore(autosave): ${customMsg} [${ts}]`
  : `chore(autosave): checkpoint ${ts} — multi-agent session`;

console.log(`\n${CYAN}${BOLD}╔══════════════════════════════════════════╗${RESET}`);
console.log(`${CYAN}${BOLD}║  💾 AUTO-GUARDADO — SERVICIOS MALLORCA   ║${RESET}`);
console.log(`${CYAN}${BOLD}╚══════════════════════════════════════════╝${RESET}`);
console.log(`${CYAN}⏰ ${ts} | ${commitMsg}${RESET}\n`);

// 1. Verificar si hay cambios
const status = execSync("git status --porcelain", { encoding: "utf-8" }).trim();
if (!status) {
  console.log(`${GREEN}✅ Arbol limpio — nada nuevo que guardar.${RESET}\n`);
  process.exit(0);
}

const lines = status.split("\n");
const nw = lines.filter((l) => l.startsWith("?")).length;
const nm = lines.filter((l) => l.match(/^[MAD]/)).length;
console.log(`${CYAN}📊 ${lines.length} archivos cambiados (${nw} nuevos, ${nm} modificados/borrados)${RESET}\n`);

// 2. Stage
run("git add -A", "git add -A");

// 3. Commit (--no-verify para saltar husky en modo autosave)
run(`git commit -m "${commitMsg}" --no-verify`, "git commit");

// 4. Pull rebase (sincronizar con otros agentes remotos)
run("git pull --rebase origin main --no-verify", "git pull --rebase", false);

// 5. Push
run("git push origin main --no-verify", "git push origin main");

console.log(`\n${GREEN}${BOLD}✅ GUARDADO EN GITHUB CORRECTAMENTE — ${ts}${RESET}\n`);
