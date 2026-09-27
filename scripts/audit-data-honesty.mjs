/**
 * audit-data-honesty.mjs — Auditor de Honestidad de Datos (GR-11/GR-12).
 * Detecta URLs de mapas autogeneradas falsas, placeholders, reseñas atribuidas
 * a plataformas sin ficha y desgloses de reputación incoherentes. Solo lectura.
 * Uso: node scripts/audit-data-honesty.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";

const SERVICES_DIR = path.resolve("src/data/services");
const JSON_OUTPUT = process.argv.includes("--json");
const SEARCH_HINTS = ["maps/search", "maps?q=", "maps.apple.com/?q=", "/search/?api=", "?q="];

function classifyMapsUrl(url) {
  if (url == null || url === undefined) return "absent";
  const u = url.replace(/["'`]/g, "").trim();
  if (u === "" || u === "undefined" || u === "null") return "invalid";
  if (!/^https?:\/\//i.test(u)) return "invalid";
  if (SEARCH_HINTS.some((hint) => u.includes(hint))) return "search_fake";
  return "listing";
}

function extractField(content, field) {
  const m = content.match(new RegExp(`["']?${field}["']?\\s*[:=]\\s*["']([^"']*)["']`));
  return m ? m[1] : undefined;
}

function main() {
  const services = [];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".ts") && entry.name !== "types.ts" && entry.name !== "index.ts") files.push(p);
    }
  };
  walk(SERVICES_DIR);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const rel = path.relative(SERVICES_DIR, file).replace(/\\/g, "/");
    const name = extractField(content, "name") || rel;
    const g = classifyMapsUrl(extractField(content, "googleMapsUrl"));
    const a = classifyMapsUrl(extractField(content, "appleMapsUrl"));
    const b = classifyMapsUrl(extractField(content, "bingMapsUrl"));
    const reviewCountRaw = extractField(content, "reviewCount");
    const reviewCount =
      reviewCountRaw == null || reviewCountRaw === "undefined" ? null : Number(reviewCountRaw.replace(/\D/g, "") || 0);
    const totalsAgg = content.match(/totalReviewsAggregated["']?\s*[:=]\s*(\d+)/);
    const googleClaims = (content.match(/platform:\s*["']google_maps["']/g) || []).length;
    const bingClaims = (content.match(/platform:\s*["']bing_maps["']/g) || []).length;

    let flags = [];
    if ([g, a, b].includes("search_fake")) flags.push("search_fake");
    if ([g, a, b].includes("invalid")) flags.push("invalid_url");
    if (googleClaims > 0 && g !== "listing") flags.push(`review_google_x${googleClaims}`);
    if (bingClaims > 0 && b !== "listing") flags.push(`review_bing_x${bingClaims}`);
    if (totalsAgg && reviewCount != null && Number(totalsAgg[1]) > reviewCount) {
      flags.push(`agg_${totalsAgg[1]}>rc_${reviewCount}`);
    }
    services.push({ file: rel, name, g, a, b, flags, reviewCount });
  }

  const count = (pred) => services.filter(pred).length;
  const summary = {
    totalServices: services.length,
    google: {
      listing: count((s) => s.g === "listing"),
      searchFake: count((s) => s.g === "search_fake"),
      absent: count((s) => s.g === "absent"),
      invalid: count((s) => s.g === "invalid"),
    },
    apple: {
      listing: count((s) => s.a === "listing"),
      searchFake: count((s) => s.a === "search_fake"),
      absent: count((s) => s.a === "absent"),
      invalid: count((s) => s.a === "invalid"),
    },
    bing: {
      listing: count((s) => s.b === "listing"),
      searchFake: count((s) => s.b === "search_fake"),
      absent: count((s) => s.b === "absent"),
      invalid: count((s) => s.b === "invalid"),
    },
    anySearchFake: count((s) => s.flags.includes("search_fake")),
    anyInvalidUrl: count((f) => f.flags.includes("invalid_url")),
    reviewPlatformMismatch: count((f) => f.flags.some((x) => x.startsWith("review_"))),
    aggregateGtReviewCount: count((f) => f.flags.some((x) => x.startsWith("agg_"))),
    clean: services.filter((s) => s.flags.length === 0).length,
  };

  if (JSON_OUTPUT) {
    console.log(JSON.stringify({ summary, offenders: services.filter((s) => s.flags.length > 0) }, null, 2));
    return;
  }

  console.log("======================================================");
  console.log("AUDITOR DE HONESTIDAD DE DATOS (GR-11 / GR-12)");
  console.log(`Total de fichas analizadas: ${summary.totalServices}`);
  for (const [label, p] of [
    ["Google", summary.google],
    ["Apple", summary.apple],
    ["Bing", summary.bing],
  ]) {
    console.log(`--- ${label} Maps ---`);
    console.log(
      `  Ficha real (listing): ${p.listing} | Búsqueda FAKE: ${p.searchFake} | Ausente (honesto): ${p.absent} | Inválida: ${p.invalid}`,
    );
  }
  console.log(`Negocios con >=1 URL fake       : ${summary.anySearchFake}`);
  console.log(`Negocios con >=1 URL inválida   : ${summary.anyInvalidUrl}`);
  console.log(`Reseñas en plataforma sin ficha : ${summary.reviewPlatformMismatch}`);
  console.log(`Total agregado > reviewCount    : ${summary.aggregateGtReviewCount}`);
  console.log(`Fichas limpias                  : ${summary.clean}`);
  console.log("--- Muestra de casos (máx 60) ---");
  for (const s of services.filter((x) => x.flags.length > 0).slice(0, 60)) {
    console.log(`  ${s.file.padEnd(58)} ${s.flags.join(", ")}`);
  }
}

main();
