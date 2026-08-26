import { SERVICES } from "../src/data/services/index.ts";

async function scrapeImagesFromWebsite(url: string): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const html = await res.text();

    const candidates = new Set<string>();

    // 1. og:image & twitter:image
    const ogMatches = html.matchAll(/property=["']og:image["']\s+content=["']([^"']+)["']/gi);
    for (const m of ogMatches) {
      if (m[1]) candidates.add(resolveUrl(url, m[1]));
    }
    const twMatches = html.matchAll(/name=["']twitter:image["']\s+content=["']([^"']+)["']/gi);
    for (const m of twMatches) {
      if (m[1]) candidates.add(resolveUrl(url, m[1]));
    }

    // 2. <img> tags with jpg / png / webp
    const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi);
    for (const m of imgMatches) {
      if (m[1] && !m[1].includes("logo") && !m[1].includes("icon") && !m[1].includes("flag")) {
        candidates.add(resolveUrl(url, m[1]));
      }
    }

    // Filter and test candidates
    const valid: string[] = [];
    for (const imgUrl of Array.from(candidates).slice(0, 8)) {
      if (await testImage(imgUrl)) {
        valid.push(imgUrl);
      }
    }
    return valid;
  } catch {
    return [];
  }
}

function resolveUrl(baseUrl: string, relativeOrAbsolute: string): string {
  try {
    return new URL(relativeOrAbsolute, baseUrl).href;
  } catch {
    return relativeOrAbsolute;
  }
}

async function testImage(url: string): Promise<boolean> {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 4000);
    const r = await fetch(url, {
      method: "GET",
      signal: c.signal,
      headers: { "User-Agent": "Mozilla/5.0", Accept: "image/*,*/*;q=0.8" },
    });
    clearTimeout(t);
    const ct = r.headers.get("content-type") || "";
    return r.ok && (ct.includes("image") || ct.includes("octet-stream"));
  } catch {
    return false;
  }
}

async function run() {
  console.log("🔍 Minando imágenes reales 200 OK directamente de las webs oficiales...\n");
  const targets = [
    "dins-santi-taura",
    "vandal-palma",
    "restaurante-marc-fosh",
    "bens-davall",
    "celler-sa-premsa",
    "bodega-ribas-consell",
    "vidrios-gordiola-algaida",
    "teixits-vicens-pollensa",
    "easy-boats-mallorca",
    "marina-port-de-mallorca",
    "talise-spa-jumeirah",
    "box-tattoo-piercing",
  ];

  for (const slug of targets) {
    const s = SERVICES.find((item) => item.slug === slug || item.id === slug);
    if (!s || !s.website) continue;
    console.log(`📡 Scraping ${s.name} (${s.website})...`);
    const images = await scrapeImagesFromWebsite(s.website);
    if (images.length > 0) {
      console.log(`✅ [${slug}] Encontradas ${images.length} imágenes 200 OK:`);
      images.forEach((img, i) => console.log(`   ${i + 1}. ${img}`));
    } else {
      console.log(`⚠️ [${slug}] No se pudieron extraer imágenes automáticas.`);
    }
  }
}

run();
