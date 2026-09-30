import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { SERVICES } from "../src/data/services/index.ts";

const hashToServices = new Map<string, { filePath: string; count: number; services: any[] }>();
const missingImages: any[] = [];
const remoteImages: any[] = [];

for (const s of SERVICES) {
  if (!s.image) {
    missingImages.push(s.slug);
    continue;
  }
  if (s.image.startsWith("http://") || s.image.startsWith("https://")) {
    remoteImages.push({ slug: s.slug, url: s.image });
    continue;
  }
  const cleanPath = s.image.replace(/^\//, "");
  const fullPath = path.resolve("public", cleanPath);
  if (!fs.existsSync(fullPath)) {
    missingImages.push({ slug: s.slug, path: s.image });
    continue;
  }
  const buf = fs.readFileSync(fullPath);
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  if (!hashToServices.has(hash)) {
    hashToServices.set(hash, { filePath: s.image, count: 0, services: [] });
  }
  const entry = hashToServices.get(hash)!;
  entry.count++;
  entry.services.push({ slug: s.slug, name: s.name, category: s.category, sectors: s.sectors });
}

console.log("Total services:", SERVICES.length);
console.log("Missing images:", missingImages.length);
console.log("Remote images:", remoteImages.length);
console.log("Unique hashes:", hashToServices.size);

const clusters = Array.from(hashToServices.entries())
  .filter(([_, data]) => data.count > 1)
  .sort((a, b) => b[1].count - a[1].count);

console.log("\nTop Duplicate Clusters (> 1 occurrences):", clusters.length);
let totalDuplicated = 0;
for (const [hash, data] of clusters) {
  totalDuplicated += data.count;
  console.log(`- Count: ${data.count} | Sample: ${data.filePath} | Hash: ${hash.slice(0, 10)}`);
  const cats: Record<string, number> = {};
  data.services.forEach((s) => {
    cats[s.category] = (cats[s.category] || 0) + 1;
  });
  console.log("  Categories:", JSON.stringify(cats));
  console.log("  Sample slugs (first 5):", data.services.slice(0, 5).map(s => s.slug).join(", "));
}
console.log("\nTotal services affected by duplication:", totalDuplicated);

const hashCounts = new Map<string, number>();
for (const [hash, data] of hashToServices.entries()) {
  hashCounts.set(hash, data.count);
}
const uniqueServices = SERVICES.filter((s) => {
  if (!s.image || s.image.startsWith("http")) return false;
  const cleanPath = s.image.replace(/^\//, "");
  const fullPath = path.resolve("public", cleanPath);
  if (!fs.existsSync(fullPath)) return false;
  const hash = crypto.createHash("sha256").update(fs.readFileSync(fullPath)).digest("hex");
  return hashCounts.get(hash) === 1;
});
console.log("Services with truly unique images:", uniqueServices.length);

const duplicateServicesList: any[] = [];
for (const [_hash, data] of hashToServices.entries()) {
  if (data.count > 1) {
    duplicateServicesList.push(...data.services);
  }
}
console.log("Total duplicate services count:", duplicateServicesList.length);
const allDuplicateServicesData = SERVICES.filter((s) =>
  duplicateServicesList.some((d) => d.slug === s.slug),
);
const withWeb = allDuplicateServicesData.filter((s) => s.website && s.website.startsWith("http"));
console.log("With valid website URL:", withWeb.length);
console.log("Without website URL:", allDuplicateServicesData.length - withWeb.length);




function getFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

const all = getFiles("public/images");
const allHashes = new Map<string, string[]>();
for (const f of all) {
  const buf = fs.readFileSync(f);
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  if (!allHashes.has(hash)) allHashes.set(hash, []);
  allHashes.get(hash)!.push(f);
}

console.log("Total files in public/images:", all.length);
console.log("Unique hashes among all files in public/images:", allHashes.size);

const sportsFiles = getFiles("public/images/sports");
const sportsHashes = new Set(sportsFiles.map((f) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex")));
console.log("Unique hashes in sports (out of " + sportsFiles.length + "):", sportsHashes.size);

const spasFiles = getFiles("public/images/spas");
const spasHashes = new Set(spasFiles.map((f) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex")));
console.log("Unique hashes in spas (out of " + spasFiles.length + "):", spasHashes.size);

