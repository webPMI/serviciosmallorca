import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import sharp from "sharp";

const CATEGORY_PHOTOS: { category: string; url: string; fallbackName: string }[] = [
  {
    category: "gastronomia-catering",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Catedral_de_Santa_Mar%C3%ADa%2C_Palma_de_Mallorca%2C_Espa%C3%B1a%2C_2022-10-06%2C_DD_01-03_HDR.jpg",
    fallbackName: "gastronomia.jpg",
  },
  {
    category: "nautica-charter",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/34/View_from_Pla%C3%A7a_de_Santa_Catarina_in_Port_de_S%C3%B3ller_03.jpg",
    fallbackName: "nautica.jpg",
  },
  {
    category: "salud-bienestar",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_village_of_Valldemossa_in_Mallorca%2C_Spain_%2848001682373%29.jpg",
    fallbackName: "salud.jpg",
  },
  {
    category: "reformas-hogar",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Catedral_de_Santa_Mar%C3%ADa%2C_Palma_de_Mallorca%2C_Espa%C3%B1a%2C_2022-10-06%2C_DD_16-18_HDR.jpg",
    fallbackName: "reformas.jpg",
  },
  {
    category: "inmobiliaria-villas",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Palma_de_Mallorca_%28Spain%29.jpg",
    fallbackName: "inmobiliaria.jpg",
  },
  {
    category: "motor-transporte",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Venus_%28super_yacht_designed_by_Philippe_Starck%29%2C_Port_de_Palma%2C_Majorca%2C_Spain_-_2022-08-20.jpg",
    fallbackName: "motor.jpg",
  },
  {
    category: "servicios-profesionales",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/19/PALMA_de_MALLORCA%2C_AB-331.jpg",
    fallbackName: "profesionales.jpg",
  },
  {
    category: "arte-tatuajes",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Catedral_de_Santa_Mar%C3%ADa%2C_Palma_de_Mallorca%2C_Espa%C3%B1a%2C_2022-10-06%2C_DD_04-06_HDR.jpg",
    fallbackName: "arte.jpg",
  },
  {
    category: "deportes",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/51/View_from_Pla%C3%A7a_de_Santa_Catarina_in_Port_de_S%C3%B3ller_08.jpg",
    fallbackName: "deportes.jpg",
  },
];

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": "ServiciosMallorca/1.0 (info@serviciosmallorca.com)" } },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          if (res.headers.location) {
            download(res.headers.location, dest).then(resolve).catch(reject);
            return;
          }
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed ${url}: status ${res.statusCode}`));
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const categoriesDir = path.resolve("public", "images", "categories");
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }

  for (const item of CATEGORY_PHOTOS) {
    const rawDest = path.resolve(categoriesDir, `raw_${item.fallbackName}`);
    const finalDest = path.resolve(categoriesDir, item.fallbackName);

    console.log(`Downloading ${item.fallbackName} from ${item.url}...`);
    try {
      await download(item.url, rawDest);
      await sharp(rawDest)
        .resize(1200, 800, { fit: "cover" })
        .jpeg({ quality: 85, progressive: true })
        .toFile(finalDest);
      fs.unlinkSync(rawDest);
      console.log(`✅ Saved ${item.fallbackName} (${fs.statSync(finalDest).size} bytes)`);
    } catch (err: any) {
      console.error(`❌ Error downloading ${item.fallbackName}:`, err.message);
      // If error, copy og-image.jpg as fallback
      const ogPath = path.resolve("public", "og-image.jpg");
      if (fs.existsSync(ogPath)) {
        fs.copyFileSync(ogPath, finalDest);
        console.log(`⚠️ Copied og-image.jpg fallback to ${item.fallbackName}`);
      }
    }
    await sleep(800);
  }
}

main().catch(console.error);
