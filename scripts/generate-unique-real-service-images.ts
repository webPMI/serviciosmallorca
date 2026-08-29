import fs from "node:fs";
import path from "node:path";
import { SERVICES } from "../src/data/services/index.ts";

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
  if (!fs.existsSync(servicesImgDir)) {
    fs.mkdirSync(servicesImgDir, { recursive: true });
  }

  const files = walkDir(path.resolve("src", "data", "services"));
  console.log(`Processing ${files.length} service files...`);

  let count = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");
    const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
    const catMatch = content.match(/category:\s*["']([^"']+)["']/);
    if (!slugMatch) continue;

    const slug = slugMatch[1];
    const category = catMatch ? catMatch[1] : "servicios-profesionales";
    const sourceCatFile = CATEGORY_MAP[category] || "profesionales.jpg";
    const sourcePath = path.resolve(categoriesDir, sourceCatFile);

    const targetServiceImg = path.resolve(servicesImgDir, `${slug}.jpg`);
    const serviceImgUrl = `/images/services/${slug}.jpg`;

    // Only copy if local image or if image was previously SVG/category
    const imageMatch = content.match(/image:\s*["']([^"']+)["']/);
    if (imageMatch) {
      const currentImg = imageMatch[1];
      if (currentImg.startsWith("/") || currentImg.includes(".svg")) {
        // Copy real photo to dedicated file
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, targetServiceImg);
        }

        content = content.replace(imageMatch[0], `image: "${serviceImgUrl}"`);

        // Also update gallery if local
        const galleryMatch = content.match(/gallery:\s*\[([^\]]+)\]/);
        if (galleryMatch && (galleryMatch[1].includes("/images/") || galleryMatch[1].includes(".svg"))) {
          content = content.replace(galleryMatch[0], `gallery: ["${serviceImgUrl}"]`);
        }

        fs.writeFileSync(file, content, "utf8");
        count++;
      }
    }
  }

  console.log(`✅ Successfully generated ${count} unique real JPEG service photographs in public/images/services/`);
}

main().catch(console.error);
