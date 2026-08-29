import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const REAL_CATHEDRAL_HDR =
  "https://upload.wikimedia.org/wikipedia/commons/5/5a/Catedral_de_Santa_Mar%C3%ADa%2C_Palma_de_Mallorca%2C_Espa%C3%B1a%2C_2022-10-06%2C_DD_01-03_HDR.jpg";

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: { "User-Agent": "ServiciosMallorca/1.0 (https://serviciosmallorca.com; info@serviciosmallorca.com)" },
      },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          if (res.headers.location) {
            download(res.headers.location, dest).then(resolve).catch(reject);
            return;
          }
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}, status: ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      },
    );
    req.on("error", reject);
  });
}

async function main() {
  const destPublic = path.resolve("public", "og-image.jpg");
  const destImages = path.resolve("public", "images", "og-default.jpg");

  console.log("Downloading real authentic HDR photo of Palma Cathedral from Wikimedia Commons...");
  await download(REAL_CATHEDRAL_HDR, destPublic);
  const size = fs.statSync(destPublic).size;
  console.log(`Saved public/og-image.jpg (${size} bytes)`);

  fs.copyFileSync(destPublic, destImages);
  console.log("Copied to public/images/og-default.jpg");
}

main().catch(console.error);
