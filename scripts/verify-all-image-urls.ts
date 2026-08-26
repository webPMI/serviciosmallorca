import { SERVICES } from "../src/data/services/index.ts";

async function checkUrl(url: string): Promise<{ ok: boolean; status: number; reason?: string }> {
  if (url.includes("imgur.com")) {
    return { ok: false, status: 410, reason: "Imgur URL (deprecada/bloqueada)" };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "image/*,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return { ok: false, status: res.status, reason: `HTTP ${res.status}` };
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("image") && !contentType.includes("octet-stream")) {
      return { ok: false, status: res.status, reason: `Content-Type no es imagen (${contentType})` };
    }
    return { ok: true, status: res.status };
  } catch (err: any) {
    return { ok: false, status: 0, reason: err.message || "Network Error" };
  }
}

async function main() {
  console.log(`🌐 [Live Image Validator] Verificando URLs de imágenes en ${SERVICES.length} negocios...\n`);

  const failed: Array<{ slug: string; name: string; url: string; reason: string }> = [];
  let checked = 0;

  for (const s of SERVICES) {
    checked++;
    if (!s.image) {
      failed.push({ slug: s.slug, name: s.name, url: "", reason: "Sin imagen" });
      continue;
    }
    const result = await checkUrl(s.image);
    if (!result.ok) {
      failed.push({ slug: s.slug, name: s.name, url: s.image, reason: result.reason || "Error" });
      console.log(`❌ [${s.slug}] ${result.reason} -> ${s.image}`);
    } else {
      process.stdout.write(`\r✅ Verificados: ${checked}/${SERVICES.length} | Fallos: ${failed.length}`);
    }
  }

  console.log("\n\n==================================================");
  console.log(`📊 INFORME DE VERIFICACIÓN EN VIVO (${SERVICES.length} NEGOCIOS)`);
  console.log("==================================================");
  console.log(`- Total negocios analizados: ${SERVICES.length}`);
  console.log(`- Imágenes operativas 100%: ${SERVICES.length - failed.length}`);
  console.log(`- Imágenes con problemas / caídas: ${failed.length}`);
  console.log("==================================================");

  if (failed.length > 0) {
    console.log("\n🚨 LISTA DE NEGOCIOS CON IMÁGENES A CORREGIR:");
    failed.forEach((f) => console.log(`  - [${f.slug}] (${f.name}): ${f.reason} -> ${f.url}`));
  }
}

main();
