import { SERVICES } from "../src/data/services/index.ts";
import { SPORTS_FACILITIES } from "../src/data/sports/facilities.ts";

console.log("=== SERVICES IMAGE AUDIT ===");
console.log("Total Services:", SERVICES.length);

const svgServices = SERVICES.filter((s) => s.image && s.image.endsWith(".svg"));
console.log("Services with SVG image:", svgServices.length);
if (svgServices.length > 0) {
  console.log("SVG services list:");
  for (const s of svgServices) {
    console.log(` - [${s.category}] ${s.id}: ${s.image}`);
  }
}

const relativeServices = SERVICES.filter((s) => s.image && s.image.startsWith("/") && !s.image.endsWith(".svg"));
console.log("Services with non-SVG relative image:", relativeServices.length);
if (relativeServices.length > 0) {
  for (const s of relativeServices) {
    console.log(` - ${s.id}: ${s.image}`);
  }
}

const noImageServices = SERVICES.filter((s) => !s.image || s.image.trim() === "");
console.log("Services with no image:", noImageServices.length);

console.log("\n=== SPORTS FACILITIES IMAGE AUDIT ===");
console.log("Total Sports Facilities:", SPORTS_FACILITIES.length);

const svgSports = SPORTS_FACILITIES.filter((s) => s.image && s.image.endsWith(".svg"));
console.log("Sports with SVG image:", svgSports.length);
if (svgSports.length > 0) {
  for (const s of svgSports) {
    console.log(` - ${s.id}: ${s.image}`);
  }
}

// Check domains of images
const domainCounts: Record<string, number> = {};
for (const s of SERVICES) {
  if (s.image && s.image.startsWith("http")) {
    try {
      const url = new URL(s.image);
      domainCounts[url.hostname] = (domainCounts[url.hostname] || 0) + 1;
    } catch {
      domainCounts["invalid_url"] = (domainCounts["invalid_url"] || 0) + 1;
    }
  }
}
console.log("\nImage domains breakdown in SERVICES:", domainCounts);
