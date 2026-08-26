import fs from "node:fs";
import path from "node:path";

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...walkDir(full));
    else if (item.name.endsWith(".ts") && item.name !== "index.ts" && item.name !== "types.ts") files.push(full);
  }
  return files;
}

const seenImages = new Set<string>();

const allFiles = walkDir("./src/data/services");

for (const file of allFiles) {
  let content = fs.readFileSync(file, "utf-8");
  const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
  const imageMatch = content.match(/image:\s*["']([^"']+)["']/);

  if (slugMatch && imageMatch) {
    const slug = slugMatch[1];
    const img = imageMatch[1];

    if (img.startsWith("/images/") || seenImages.has(img)) {
      const uniqueImg = `/images/services/${slug}.svg`;
      content = content.replace(/image:\s*["'][^"']+["']/, `image: "${uniqueImg}"`);
      fs.writeFileSync(file, content, "utf-8");
      seenImages.add(uniqueImg);
    } else {
      seenImages.add(img);
    }
  }
}

console.log("✅ All service images assigned strictly uniquely per slug.");
