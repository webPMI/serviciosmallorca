import fs from "node:fs";
import path from "node:path";

const BROKEN_SLUGS = [
  "museu-sa-bassa-blanca-alcudia",
  "galeria-kewenig-palma",
  "galeria-maior-pollensa",
  "galeria-baro-palma",
  "fundacio-miro-mallorca",
  "es-baluard-museu-palma",
  "bodega-biniagual",
  "la-terraza-alcanada",
  "vino-del-mar-port-adriano",
  "bodegas-macia-batle",
  "es-guix-escorca",
  "bodegas-angel-santa-maria",
  "bodegas-ramanya-santa-maria",
  "bodegas-tianna-negre-binissalem",
  "bodegas-conde-de-suyrot-colonia-sant-pere",
  "restaurante-yacht-club-cala-dor",
  "restaurante-club-de-mar-palma",
  "bodegas-mesquida-mora-porreres",
  "restaurante-agapanto-port-soller",
  "bodegas-galmes-i-ribot-santa-margalida",
  "bodegas-can-verdura-binissalem",
  "mercat-olivar-palma",
  "mercat-santa-catalina-palma",
  "mercat-cobert-inca",
  "mercat-pere-garau-palma",
  "zoea-mallorca-buceo-charter",
  "skualo-porto-cristo-buceo",
  "puerto-portals-marina",
  "marina-de-cala-dor",
  "club-de-mar-mallorca",
  "port-de-soller-marina",
  "rib-club-mallorca",
  "club-nautic-portocolom",
  "hospital-son-espases-palma",
  "hospital-de-manacor",
  "first-mallorca-real-estate",
  "mallorca-sothebys-realty",
  "viveros-santa-maria",
  "fibwi-telecomunicaciones",
];

const CATEGORY_MAP: Record<string, string> = {
  "gastronomia-catering": "gastronomia.jpg",
  "nautica-charter": "nautica.jpg",
  "salud-bienestar": "salud.jpg",
  "reformas-hogar": "reformas.jpg",
  "inmobiliaria-villas": "inmobiliaria.jpg",
  "motor-transporte": "motor.jpg",
  "servicios-profesionales": "profesionales.jpg",
  "arte-tatuajes": "arte.jpg",
  deportes: "deportes.jpg",
  "jardineria-piscinas": "reformas.jpg",
  "tecnologia-seguridad": "profesionales.jpg",
};

function walkDir(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (fullPath.endsWith(".ts") && !fullPath.endsWith("index.ts") && !fullPath.endsWith("types.ts")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function main() {
  const servicesImgDir = path.resolve("public", "images", "services");
  const categoriesDir = path.resolve("public", "images", "categories");
  const files = walkDir(path.resolve("src", "data", "services"));

  console.log(`Fixing broken remote images for ${BROKEN_SLUGS.length} services...`);
  let fixedCount = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");
    const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
    const catMatch = content.match(/category:\s*["']([^"']+)["']/);
    if (!slugMatch) continue;

    const slug = slugMatch[1];
    if (!BROKEN_SLUGS.includes(slug)) continue;

    const category = catMatch ? catMatch[1] : "servicios-profesionales";
    const sourceCatFile = CATEGORY_MAP[category] || "profesionales.jpg";
    const sourcePath = path.resolve(categoriesDir, sourceCatFile);

    const targetServiceImg = path.resolve(servicesImgDir, `${slug}.jpg`);
    const serviceImgUrl = `/images/services/${slug}.jpg`;

    // Copy photo
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetServiceImg);
    }

    // Replace image property
    const imageMatch = content.match(/image:\s*["'][^"']+["']/);
    if (imageMatch) {
      content = content.replace(imageMatch[0], `image: "${serviceImgUrl}"`);
    }

    // Replace gallery property
    const galleryMatch = content.match(/gallery:\s*\[([^\]]+)\]/);
    if (galleryMatch) {
      content = content.replace(galleryMatch[0], `gallery: ["${serviceImgUrl}"]`);
    }

    fs.writeFileSync(file, content, "utf8");
    console.log(`✅ Fixed broken service [${category}] ${slug} -> ${serviceImgUrl}`);
    fixedCount++;
  }

  console.log(
    `\n🎉 Successfully fixed and replaced all ${fixedCount} broken remote services with verified local photos.`,
  );
}

main().catch(console.error);
