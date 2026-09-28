/**
 * remediate-data-honesty.mjs — Remediación Automatizada de Honestidad de Datos (GR-11/GR-12).
 * Elimina URLs de búsqueda falsas (maps/search, maps?q=, maps.apple.com/?q=, etc.),
 * elimina desgloses inventados en reputationBreakdown para negocios sin ficha real,
 * preserva los 125 enlaces con ficha real (CID de Google Maps) y
 * convierte plataformas de reseñas no respaldadas a 'direct'.
 */
import fs from "node:fs";
import path from "node:path";

const SERVICES_DIR = path.resolve("src/data/services");
const SEARCH_HINTS = ["maps/search", "maps?q=", "maps.apple.com/?q=", "/search/?api=", "?q=", "?where1="];

function isSearchFake(url) {
  if (!url) return false;
  const u = url.replace(/["'`]/g, "").trim();
  return SEARCH_HINTS.some((hint) => u.includes(hint));
}

function stripFakeMapsField(content, field) {
  const regex = new RegExp(`(\\s*${field}:\\s*(?:[\\r\\n]\\s*)?["'\`]([\\s\\S]*?)["'\`],?\\r?\\n)`, "g");
  return content.replace(regex, (match, fullBlock, url) => {
    if (isSearchFake(url)) {
      return "\n";
    }
    return match;
  });
}

function extractObjectBlock(content, key) {
  const idx = content.indexOf(key);
  if (idx === -1) return null;
  const openBrace = content.indexOf("{", idx);
  if (openBrace === -1) return null;
  let depth = 1;
  let i = openBrace + 1;
  while (i < content.length && depth > 0) {
    if (content[i] === "{") depth++;
    else if (content[i] === "}") depth--;
    i++;
  }
  if (depth === 0) {
    let endIdx = i;
    while (
      endIdx < content.length &&
      (content[endIdx] === "," || content[endIdx] === " " || content[endIdx] === "\t")
    ) {
      endIdx++;
    }
    if (content[endIdx] === "\r") endIdx++;
    if (content[endIdx] === "\n") endIdx++;
    return {
      start: idx,
      end: endIdx,
      block: content.slice(idx, endIdx),
    };
  }
  return null;
}

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".ts") && entry.name !== "types.ts" && entry.name !== "index.ts") files.push(p);
  }
}
walk(SERVICES_DIR);

let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  const original = content;

  // Determine if it has a real Google Maps listing
  const gMatch = content.match(/googleMapsUrl:\s*(?:[\r\n]\s*)?["'`]([\s\\S]*?)["'`]/);
  const hasRealGoogle = gMatch && !isSearchFake(gMatch[1]);

  // Strip fake fields
  content = stripFakeMapsField(content, "googleMapsUrl");
  content = stripFakeMapsField(content, "appleMapsUrl");
  content = stripFakeMapsField(content, "bingMapsUrl");

  // Handle reputationBreakdown
  if (content.includes("reputationBreakdown")) {
    const repInfo = extractObjectBlock(content, "reputationBreakdown");
    if (repInfo) {
      const urlMatch = repInfo.block.match(/url:\s*(?:[\r\n]\s*)?["'`]([\s\\S]*?)["'`]/);
      if (!hasRealGoogle || !urlMatch || isSearchFake(urlMatch[1])) {
        let start = repInfo.start;
        while (start > 0 && (content[start - 1] === " " || content[start - 1] === "\t")) {
          start--;
        }
        content = content.slice(0, start) + content.slice(repInfo.end);
      }
    }
  }

  // Convert unbacked reviews platform to "direct"
  if (!hasRealGoogle) {
    content = content.replace(/platform:\s*["']google_maps["']/g, 'platform: "direct"');
  }
  content = content.replace(/platform:\s*["']bing_maps["']/g, 'platform: "direct"');

  if (content !== original) {
    fs.writeFileSync(file, content, "utf-8");
    modifiedCount++;
  }
}

console.log(`✅ Remediación completada: ${modifiedCount} fichas modificadas de ${files.length}.`);
