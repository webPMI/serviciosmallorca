import fs from "node:fs";
import path from "node:path";

async function downloadImages() {
  const images = [
    {
      url: "https://www.inkenzo.com/assets/enzo-tatuando@2x.webp",
      dest: "public/images/services/ink-enzo-tattoo-mallorca.webp",
    },
    {
      url: "https://www.inkenzo.com/assets/portfolio/realismo-tigre-vertical.webp",
      dest: "public/images/services/ink-enzo-tigre-realismo.webp",
    },
    {
      url: "https://www.inkenzo.com/assets/portfolio/realismo-leon-vertical.webp",
      dest: "public/images/services/ink-enzo-leon-realismo.webp",
    },
    {
      url: "https://www.inkenzo.com/assets/portfolio/fineline-script.webp",
      dest: "public/images/services/ink-enzo-fineline.webp",
    },
    {
      url: "https://www.inkenzo.com/assets/events/domicilio-hero.webp",
      dest: "public/images/services/ink-enzo-domicilio-villas.webp",
    },
  ];

  for (const img of images) {
    try {
      console.log(`Downloading ${img.url}...`);
      const res = await fetch(img.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(img.dest, buffer);
      console.log(`Saved ${img.dest} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${img.url}:`, err);
    }
  }
}

downloadImages();
