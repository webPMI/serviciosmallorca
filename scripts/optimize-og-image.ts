import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

async function optimizeOgImage() {
  const ogPath = path.resolve("public", "og-image.jpg");
  const tempPath = path.resolve("public", "og-image-temp.jpg");
  const defaultPath = path.resolve("public", "images", "og-default.jpg");

  console.log("Original size:", fs.statSync(ogPath).size, "bytes");

  await sharp(ogPath)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .jpeg({ quality: 88, progressive: true })
    .toFile(tempPath);

  fs.renameSync(tempPath, ogPath);
  fs.copyFileSync(ogPath, defaultPath);

  console.log("Optimized 1200x630 WhatsApp Open Graph size:", fs.statSync(ogPath).size, "bytes");
}

optimizeOgImage().catch(console.error);
