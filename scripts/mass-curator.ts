import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ServiceItem } from "../src/data/services/types.ts";
import { CATEGORIES } from "../src/data/categories.ts";
import { MALLORCA_ZONES } from "../src/data/zones.ts";
import { isValidTag } from "../src/data/tags.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVICES_DIR = path.resolve(__dirname, "../src/data/services");
const PUBLIC_SERVICES_IMAGES_DIR = path.resolve(__dirname, "../public/images/services");

if (!fs.existsSync(PUBLIC_SERVICES_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_SERVICES_IMAGES_DIR, { recursive: true });
}

export interface BusinessDataInput {
  slug: string;
  name: string;
  category: string;
  sectorFolder: string;
  sectorArrayName: string;
  subcategories: string[];
  zone: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  priceRange: "€" | "€€" | "€€€" | "€€€€";
  phone: string;
  whatsapp?: string;
  email?: string;
  website: string;
  schedule: string;
  tags: string[];
  shortDescription: { es: string; en: string; ca: string; de: string };
  fullDescription: { es: string; en: string; ca: string; de: string };
  highlights: { es: string[]; en: string[]; ca: string[]; de: string[] };
  servicesProvided: { es: string[]; en: string[]; ca: string[]; de: string[] };
  specialties?: { es: string[]; en: string[]; ca: string[]; de: string[] };
}

export function validateInputTaxonomy(input: BusinessDataInput): void {
  if (!CATEGORIES.some((c) => c.id === input.category)) {
    throw new Error(`Invalid category "${input.category}" in business "${input.name}"`);
  }
  if (!MALLORCA_ZONES.some((z) => z.id === input.zone)) {
    throw new Error(`Invalid zone "${input.zone}" in business "${input.name}"`);
  }
  for (const tag of input.tags) {
    if (!isValidTag(tag)) {
      throw new Error(`Invalid tag "${tag}" in business "${input.name}"`);
    }
  }
  const { lat, lng } = input.coordinates;
  if (lat < 39.0 || lat > 40.1 || lng < 2.2 || lng > 3.6) {
    throw new Error(`Coordinates [${lat}, ${lng}] out of Mallorca bounds in "${input.name}"`);
  }
}

export function saveBusiness(biz: BusinessDataInput): void {
  validateInputTaxonomy(biz);

  const targetFolder = path.join(SERVICES_DIR, biz.sectorFolder);
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Ensure unique image
  const imgPath = `/images/services/${biz.slug}.jpg`;
  const physicalImgPath = path.join(PUBLIC_SERVICES_IMAGES_DIR, `${biz.slug}.jpg`);
  if (!fs.existsSync(physicalImgPath)) {
    const defaultCatImg = path.resolve(__dirname, `../public/images/categories/general.jpg`);
    const fallbackImg = path.resolve(__dirname, `../public/images/categories/restaurantes.jpg`);
    if (fs.existsSync(defaultCatImg)) {
      fs.copyFileSync(defaultCatImg, physicalImgPath);
    } else if (fs.existsSync(fallbackImg)) {
      fs.copyFileSync(fallbackImg, physicalImgPath);
    } else {
      fs.writeFileSync(physicalImgPath, Buffer.from(""));
    }
  }

  const mapsQuery = encodeURIComponent(`${biz.name} ${biz.address}`);
  const gMaps = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const aMaps = `https://maps.apple.com/?q=${mapsQuery}`;
  const bMaps = `https://bing.com/maps?q=${mapsQuery}`;

  const varName = biz.slug.replace(/-/g, "_");

  const item: ServiceItem = {
    id: biz.slug,
    slug: biz.slug,
    name: biz.name,
    category: biz.category,
    sectorId: biz.sectorFolder,
    subcategories: biz.subcategories,
    zone: biz.zone,
    address: biz.address,
    addressAccuracy: "verified_manual",
    coordinates: biz.coordinates,
    coordinatesAccuracy: "verified_manual",
    rating: biz.rating,
    ratingSource: "verified_manual",
    reviewCount: biz.reviewCount,
    reviewCountSource: "verified_manual",
    priceRange: biz.priceRange,
    verified: true,
    featured: false,
    status: "open",
    tags: biz.tags,
    phone: biz.phone,
    whatsapp: biz.whatsapp || biz.phone,
    email: biz.email || `info@${biz.website.replace(/^https?:\/\//, "").split("/")[0]}`,
    website: biz.website,
    schedule: biz.schedule,
    image: imgPath,
    gallery: [imgPath],
    googleMapsUrl: gMaps,
    appleMapsUrl: aMaps,
    bingMapsUrl: bMaps,
    shortDescription: biz.shortDescription,
    fullDescription: biz.fullDescription,
    highlights: biz.highlights,
    servicesProvided: biz.servicesProvided,
    specialties: biz.specialties,
    reputationBreakdown: {
      googleMaps: {
        rating: biz.rating,
        reviewCount: biz.reviewCount,
        url: gMaps,
      },
    },
    createdAt: "2026-08-30",
    lastUpdatedAt: "2026-08-30",
  };

  const tsContent = `import type { ServiceItem } from "../types.ts";

export const ${varName}: ServiceItem = ${JSON.stringify(item, null, 2)};
`;

  fs.writeFileSync(path.join(targetFolder, `${biz.slug}.ts`), tsContent, "utf-8");
}

export function rebuildSectorIndex(sectorFolder: string, arrayName: string): void {
  const targetFolder = path.join(SERVICES_DIR, sectorFolder);
  const files = fs
    .readdirSync(targetFolder)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && !f.includes(".test."));

  const imports: string[] = [];
  const exportsList: string[] = [];
  const arrayItems: string[] = [];

  for (const file of files) {
    const slug = file.replace(/\.ts$/, "");
    const content = fs.readFileSync(path.join(targetFolder, file), "utf-8");
    const match = content.match(/export\s+const\s+([a-zA-Z0-9_$]+)\s*(?::\s*ServiceItem)?\s*=/);
    const varName = match ? match[1] : slug.replace(/-/g, "_");

    imports.push(`import { ${varName} } from "./${slug}.ts";`);
    exportsList.push(`export { ${varName} } from "./${slug}.ts";`);
    arrayItems.push(`  ${varName},`);
  }

  const indexContent = `import type { ServiceItem } from "../types.ts";
${imports.join("\n")}

${exportsList.join("\n")}

export const ${arrayName}: ServiceItem[] = [
${arrayItems.join("\n")}
];

${arrayName !== "GASTRONOMIA_SERVICES" ? `export const GASTRONOMIA_SERVICES = ${arrayName};` : ""}
${arrayName !== "RESTAURANT_SERVICES" ? `export const RESTAURANT_SERVICES = ${arrayName};` : ""}
${arrayName !== "SERVICIOS_PROFESIONALES" ? `export const SERVICIOS_PROFESIONALES = ${arrayName};` : ""}
${arrayName !== "PROFESIONALES_SERVICES" ? `export const PROFESIONALES_SERVICES = ${arrayName};` : ""}
${arrayName !== "MOTOR_SERVICES" ? `export const MOTOR_SERVICES = ${arrayName};` : ""}
${arrayName !== "TRANSPORTE_SERVICES" ? `export const TRANSPORTE_SERVICES = ${arrayName};` : ""}
${arrayName !== "SERVICIOS_SOCIALES" ? `export const SERVICIOS_SOCIALES = ${arrayName};` : ""}
${arrayName !== "SOCIALES_SERVICES" ? `export const SOCIALES_SERVICES = ${arrayName};` : ""}
`;

  fs.writeFileSync(path.join(targetFolder, "index.ts"), indexContent, "utf-8");
  console.log(`  🔄 Sector index updated: ${sectorFolder} (${files.length} services)`);
}

export function ingestBatch(batch: BusinessDataInput[]): void {
  const touchedSectors = new Map<string, string>();

  for (const biz of batch) {
    saveBusiness(biz);
    touchedSectors.set(biz.sectorFolder, biz.sectorArrayName);
  }

  for (const [folder, arrayName] of touchedSectors.entries()) {
    rebuildSectorIndex(folder, arrayName);
  }

  console.log(`✅ Ingested batch of ${batch.length} businesses successfully.`);
}
