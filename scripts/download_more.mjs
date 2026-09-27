import fs from "node:fs";

async function downloadMore() {
  const images = [
    {
      url: "https://www.inkenzo.com/assets/enzo-tatuando-detalle@2x.webp",
      dest: "public/images/services/ink-enzo-detalle.webp",
    },
    {
      url: "https://www.inkenzo.com/assets/portfolio/geometrico-vertical.webp",
      dest: "public/images/services/ink-enzo-geometrico.webp",
    },
    {
      url: "https://www.inkenzo.com/assets/events/popup-studio.webp",
      dest: "public/images/services/ink-enzo-estudio-movil.webp",
    },
  ];

  for (const img of images) {
    try {
      const res = await fetch(img.url);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(img.dest, buffer);
        console.log(`Saved ${img.dest} (${buffer.length} bytes)`);
      }
    } catch (e) {
      console.warn(`Failed to download ${img.url}:`, e instanceof Error ? e.message : e);
    }
  }
}
downloadMore();
