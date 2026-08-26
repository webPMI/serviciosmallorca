import fs from "node:fs";
import path from "node:path";

async function testUrl(url: string): Promise<boolean> {
  if (!url || !url.startsWith("http")) return false;
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 3500);
    const r = await fetch(url, {
      method: "HEAD",
      signal: c.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(t);
    return r.ok;
  } catch {
    return false;
  }
}

const categoryBanners: Record<string, string> = {
  "gastronomia-catering": "/images/categories/gastronomia-catering.svg",
  "salud-bienestar": "/images/categories/salud-bienestar.svg",
  "nautica-charter": "/images/categories/nautica-charter.svg",
  "deportes-aire-libre": "/images/categories/deportes.svg",
  deporte: "/images/categories/deportes.svg",
  "reformas-hogar": "/images/categories/reformas-hogar.svg",
  "inmobiliaria-villas": "/images/categories/inmobiliaria-villas.svg",
  "arte-tatuajes": "/images/categories/arte-tatuajes.svg",
  "servicios-profesionales": "/images/categories/servicios-profesionales.svg",
  "motor-transporte": "/images/categories/motor-transporte.svg",
};

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...walkDir(full));
    else if (item.name.endsWith(".ts") && item.name !== "index.ts" && item.name !== "types.ts") files.push(full);
  }
  return files;
}

async function run() {
  const allFiles = walkDir("./src/data/services");
  console.log("Analyzing", allFiles.length, "service files for dead image URLs...");

  let fixedCount = 0;
  for (const file of allFiles) {
    let content = fs.readFileSync(file, "utf-8");
    const imageMatch = content.match(/image:\s*["'](https:\/\/[^"']+)["']/);
    if (imageMatch) {
      const url = imageMatch[1];
      const ok = await testUrl(url);
      if (!ok) {
        const catMatch = content.match(/category:\s*["']([^"']+)["']/);
        const cat = catMatch ? catMatch[1] : "gastronomia-catering";
        const fallback = categoryBanners[cat] || "/images/categories/default.svg";
        console.log(`Fixing dead URL in ${path.basename(file)}: ${url} -> ${fallback}`);
        content = content.replace(/image:\s*["']https:\/\/[^"']+["']/, `image: "${fallback}"`);
        content = content.replace(/gallery:\s*\[[\s\S]*?\],/m, `gallery: [],`);
        fs.writeFileSync(file, content, "utf-8");
        fixedCount++;
      }
    }
  }
  console.log(`\n✅ Finished cleaning broken image URLs. Total fixed files: ${fixedCount}`);
}

run();
