import fs from "node:fs";
import path from "node:path";

const LAST_5_SLUGS = [
  "macatela-tattoo",
  "urban-soul-tattoo",
  "lafiore-vidrio-artesanal",
  "cca-andratx-arte-contemporaneo",
  "galeria-pelaires-palma",
];

const CATEGORY_MAP: Record<string, string> = {
  "arte-tatuajes": "arte.jpg",
  "gastronomia-catering": "gastronomia.jpg",
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

  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");
    const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
    const catMatch = content.match(/category:\s*["']([^"']+)["']/);
    if (!slugMatch) continue;

    const slug = slugMatch[1];
    if (!LAST_5_SLUGS.includes(slug)) continue;

    const category = catMatch ? catMatch[1] : "arte-tatuajes";
    const sourceCatFile = CATEGORY_MAP[category] || "arte.jpg";
    const sourcePath = path.resolve(categoriesDir, sourceCatFile);

    const targetServiceImg = path.resolve(servicesImgDir, `${slug}.jpg`);
    const serviceImgUrl = `/images/services/${slug}.jpg`;

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetServiceImg);
    }

    const imageMatch = content.match(/image:\s*["'][^"']+["']/);
    if (imageMatch) {
      content = content.replace(imageMatch[0], `image: "${serviceImgUrl}"`);
    }

    const galleryMatch = content.match(/gallery:\s*\[([^\]]+)\]/);
    if (galleryMatch) {
      content = content.replace(galleryMatch[0], `gallery: ["${serviceImgUrl}"]`);
    }

    fs.writeFileSync(file, content, "utf8");
    console.log(`✅ Fixed [${category}] ${slug} -> ${serviceImgUrl}`);
  }
}

main().catch(console.error);
