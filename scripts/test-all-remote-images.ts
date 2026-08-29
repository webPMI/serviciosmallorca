import https from "node:https";
import http from "node:http";
import { SERVICES } from "../src/data/services/index.ts";

function testImage(url: string): Promise<{ url: string; status: number; ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    if (url.startsWith("/")) {
      resolve({ url, status: 200, ok: true });
      return;
    }
    const client = url.startsWith("https") ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://serviciosmallorca.com/",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        timeout: 6000,
      },
      (res) => {
        resolve({ url, status: res.statusCode || 0, ok: res.statusCode === 200 });
      },
    );
    req.on("error", (e) => resolve({ url, status: 0, ok: false, error: e.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ url, status: 0, ok: false, error: "TIMEOUT" });
    });
  });
}

async function main() {
  console.log(`Testing all ${SERVICES.length} service images...`);
  const results = [];
  let brokenCount = 0;

  for (const s of SERVICES) {
    const res = await testImage(s.image);
    if (!res.ok) {
      brokenCount++;
      console.log(
        `❌ [${s.category}] ${s.name} (${s.id}): Status ${res.status} | Error: ${res.error || ""} | URL: ${s.image}`,
      );
    }
    results.push({ service: s.id, ...res });
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Total Tested: ${SERVICES.length}`);
  console.log(`Broken / Blocked (Hotlink / 403 / 404 / Timeout): ${brokenCount}`);
  console.log(`Working: ${SERVICES.length - brokenCount}`);
}

main().catch(console.error);
