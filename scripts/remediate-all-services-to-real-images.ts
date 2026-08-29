import fs from "node:fs";
import path from "node:path";

const CATEGORY_MAP: Record<string, string> = {
  "gastronomia-catering": "/images/categories/gastronomia.jpg",
  "nautica-charter": "/images/categories/nautica.jpg",
  "salud-bienestar": "/images/categories/salud.jpg",
  "reformas-hogar": "/images/categories/reformas.jpg",
  "inmobiliaria-villas": "/images/categories/inmobiliaria.jpg",
  "motor-transporte": "/images/categories/motor.jpg",
  "servicios-profesionales": "/images/categories/profesionales.jpg",
  "arte-tatuajes": "/images/categories/arte.jpg",
  deportes: "/images/categories/deportes.jpg",
  "jardineria-piscinas": "/images/categories/reformas.jpg",
  "tecnologia-seguridad": "/images/categories/profesionales.jpg",
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

async function remediate() {
  const servicesDir = path.resolve("src", "data", "services");
  const files = walkDir(servicesDir);
  console.log(`Scanning ${files.length} service files in ${servicesDir}...`);

  let modifiedCount = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");
    let changed = false;

    // Detect category
    const catMatch = content.match(/category:\s*["']([^"']+)["']/);
    const category = catMatch ? catMatch[1] : "servicios-profesionales";
    const realFallbackImage = CATEGORY_MAP[category] || "/images/categories/profesionales.jpg";

    // Replace SVG image: "/images/..." or "/images/services/....svg"
    const imageSvgMatch = content.match(/image:\s*["']([^"']+\.svg)["']/);
    if (imageSvgMatch) {
      const oldImage = imageSvgMatch[1];
      content = content.replace(imageSvgMatch[0], `image: "${realFallbackImage}"`);
      changed = true;
      console.log(`[${path.basename(file)}] Replaced SVG image ${oldImage} -> ${realFallbackImage}`);
    }

    // Replace SVG gallery items
    const gallerySvgMatch = content.match(/gallery:\s*\[([^\]]+)\]/);
    if (gallerySvgMatch && gallerySvgMatch[1].includes(".svg")) {
      content = content.replace(gallerySvgMatch[0], `gallery: ["${realFallbackImage}"]`);
      changed = true;
      console.log(`[${path.basename(file)}] Replaced SVG in gallery -> ${realFallbackImage}`);
    }

    if (changed) {
      fs.writeFileSync(file, content, "utf8");
      modifiedCount++;
    }
  }

  console.log(`\n🎉 Remediation complete: Updated ${modifiedCount} service files with authentic real photographs.`);
}

remediate().catch(console.error);
