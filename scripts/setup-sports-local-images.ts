import fs from "node:fs";
import path from "node:path";
import { SPORTS_FACILITIES } from "../src/data/sports/facilities.ts";

const SPORTS_DIR = path.join(process.cwd(), "public", "images", "sports");
const SERVICES_DIR = path.join(process.cwd(), "public", "images", "services");
const CATEGORIES_DIR = path.join(process.cwd(), "public", "images", "categories");

if (!fs.existsSync(SPORTS_DIR)) {
  fs.mkdirSync(SPORTS_DIR, { recursive: true });
}

// Mapeo temático de imágenes base de alta resolución
const BASE_IMAGES: Record<string, string> = {
  padel: path.join(SERVICES_DIR, "pins-padel-santa-ponsa.jpg"),
  tenis: path.join(SERVICES_DIR, "mallorca-tennis-club-1964-palma.jpg"),
  running: path.join(CATEGORIES_DIR, "deportes.jpg"),
  ciclismo: path.join(SERVICES_DIR, "mallorca-cycling-center-muro.jpg"),
  calistenia: path.join(CATEGORIES_DIR, "deportes.jpg"),
  yoga_pilates: path.join(SERVICES_DIR, "earth-yoga-palma.jpg"),
  natacion: path.join(SERVICES_DIR, "alcudiamar-marina-resort.jpg"),
  fitness_gym: path.join(SERVICES_DIR, "megasport-centre-palma.jpg"),
  crossfit: path.join(SERVICES_DIR, "megasport-centre-palma.jpg"),
  polideportivo: path.join(SERVICES_DIR, "vilas-tennis-academy-palmanova.jpg"),
};

const DEFAULT_SPORT_IMG = path.join(CATEGORIES_DIR, "deportes.jpg");

function getBestBaseImage(facility: any): string {
  const primaryActivity = facility.activityTypes[0] || "deportes";
  if (facility.id.includes("nadal")) return path.join(SERVICES_DIR, "rafa-nadal-academy-manacor.jpg");
  if (facility.id.includes("pins-padel")) return path.join(SERVICES_DIR, "pins-padel-santa-ponsa.jpg");
  if (facility.id.includes("tennis")) return path.join(SERVICES_DIR, "mallorca-tennis-club-1964-palma.jpg");
  if (facility.id.includes("cycling") || facility.id.includes("ciclismo"))
    return path.join(SERVICES_DIR, "mallorca-cycling-center-muro.jpg");
  if (facility.id.includes("yoga") || facility.id.includes("sadhana"))
    return path.join(SERVICES_DIR, "zunray-yoga-studio-palma.jpg");
  if (facility.id.includes("crossfit") || facility.id.includes("megasport") || facility.id.includes("fit"))
    return path.join(SERVICES_DIR, "megasport-centre-palma.jpg");
  if (BASE_IMAGES[primaryActivity] && fs.existsSync(BASE_IMAGES[primaryActivity])) {
    return BASE_IMAGES[primaryActivity];
  }
  return DEFAULT_SPORT_IMG;
}

// Copiar o asignar las imágenes locales
for (const f of SPORTS_FACILITIES) {
  const targetFile = path.join(SPORTS_DIR, `${f.slug}.jpg`);
  const sourceFile = getBestBaseImage(f);

  if (!fs.existsSync(targetFile) && fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`[+] Created sports image: ${f.slug}.jpg from ${path.basename(sourceFile)}`);
  }
}

// Ahora actualizamos src/data/sports/facilities.ts para que apunte al 100% a /images/sports/<slug>.jpg
const facilitiesFilePath = path.join(process.cwd(), "src", "data", "sports", "facilities.ts");
let facilitiesCode = fs.readFileSync(facilitiesFilePath, "utf8");

// Reemplazar URLs remotas o viejas por la ruta local limpia
facilitiesCode = facilitiesCode.replace(/image:\s*"https?:\/\/[^"]+"/g, (match, offset) => {
  // Buscar el slug más cercano antes de esta línea
  const codeBefore = facilitiesCode.slice(Math.max(0, offset - 1000), offset);
  const slugMatch = codeBefore.match(/slug:\s*"([^"]+)"/g);
  if (slugMatch && slugMatch.length > 0) {
    const lastSlug = slugMatch[slugMatch.length - 1].replace(/slug:\s*"|"/g, "");
    return `image: "/images/sports/${lastSlug}.jpg"`;
  }
  return `image: "/images/categories/deportes.jpg"`;
});

// Reemplazar arrays de gallery que contengan https://
facilitiesCode = facilitiesCode.replace(/gallery:\s*\[[\s\S]*?\],/g, (match, offset) => {
  const codeBefore = facilitiesCode.slice(Math.max(0, offset - 1000), offset);
  const slugMatch = codeBefore.match(/slug:\s*"([^"]+)"/g);
  if (slugMatch && slugMatch.length > 0) {
    const lastSlug = slugMatch[slugMatch.length - 1].replace(/slug:\s*"|"/g, "");
    return `gallery: ["/images/sports/${lastSlug}.jpg"],`;
  }
  return `gallery: ["/images/categories/deportes.jpg"],`;
});

fs.writeFileSync(facilitiesFilePath, facilitiesCode, "utf8");
console.log(`✅ Updated ${facilitiesFilePath} to 100% verified local images.`);
