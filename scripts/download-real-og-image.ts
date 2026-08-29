import fs from "node:fs";
import https from "node:https";
import path from "node:path";

// Official Wikimedia Commons authentic photograph of Palma de Mallorca Cathedral and Marina (Public Domain / CC BY-SA)
const REAL_MALLORCA_PHOTO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Palma_Cathedral_and_Parc_de_la_Mar.jpg/1280px-Palma_Cathedral_and_Parc_de_la_Mar.jpg";

function downloadImage(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "ServiciosMallorca/1.0 (https://serviciosmallorca.com; info@serviciosmallorca.com)",
          },
        },
        (response) => {
          if (response.statusCode === 301 || response.statusCode === 302) {
            if (response.headers.location) {
              downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
              return;
            }
          }
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download ${url}, status code: ${response.statusCode}`));
            return;
          }
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        },
      )
      .on("error", (err) => {
        fs.unlinkSync(destPath);
        reject(err);
      });
  });
}

async function main() {
  console.log("Downloading authentic real photograph of Mallorca from Wikimedia Commons...");
  const publicOgPath = path.resolve("public", "og-image.jpg");
  const defaultOgPath = path.resolve("public", "images", "og-default.jpg");

  await downloadImage(REAL_MALLORCA_PHOTO_URL, publicOgPath);
  console.log("Saved to:", publicOgPath, `(${fs.statSync(publicOgPath).size} bytes)`);

  fs.copyFileSync(publicOgPath, defaultOgPath);
  console.log("Copied to:", defaultOgPath);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
