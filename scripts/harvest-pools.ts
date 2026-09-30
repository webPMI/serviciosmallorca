/**
 * scripts/harvest-pools.ts
 *
 * Pre-cosecha de forma educada y secuencial candidatos fotográficos de Wikimedia Commons
 * para las categorías de Mallorca, almacenándolos en scripts/harvested-pools.json.
 *
 * Evita rate-limiting (HTTP 429) ejecutando una consulta cada 1100ms con reintentos exponenciales.
 */

import fs from "node:fs";
import path from "node:path";

const OUTPUT_FILE = path.resolve("scripts/harvested-pools.json");

const CATEGORY_QUERIES: Record<string, string[]> = {
  "gastronomia-catering": ["Palma de Mallorca restaurant", "Mallorca tapas cafe"],
  "nautica-charter": ["Mallorca yacht", "Port de Palma sailing"],
  "beach-clubs-rooftops": ["Mallorca beach club", "Palma bay view terrace"],
  "boutiques-moda-mallorca": ["Paseo del Borne Palma", "Palma shopping boutique"],
  "decoracion-muebles-diseno": ["Mallorca patio design", "Mallorca interior architecture"],
  "calzado-piel-inca-artesania": ["Inca Mallorca leather", "Mallorca craft artisan"],
  "vidrio-ceramica-artesanal": ["Mallorca ceramics pottery", "Mallorca glass craft"],
  "salud-bienestar": ["Mallorca spa wellness", "Mallorca luxury retreat"],
  "cuidado-mayores-asistencia": ["Palma quiet street", "Palma garden park"],
  "guarderias-infantil-canguros": ["Palma playground park", "Mallorca family park"],
  "reformas-hogar": ["Mallorca traditional house", "Mallorca finca stone architecture"],
  "carpinteria-piedra-tradicional": ["Mallorca stone house", "Mallorca masonry marès"],
  "jardineria-piscinas": ["Mallorca garden palms", "Mallorca swimming pool villa"],
  "limpieza-villas-fincas": ["Mallorca luxury villa terrace", "Mallorca estate finca"],
  "control-plagas-desinfeccion": ["Mallorca commercial building", "Palma street architecture"],
  "mudanzas-guardamuebles": ["Mallorca transport logistics", "Mallorca road logistics"],
  "servicios-profesionales": ["Palma de Mallorca architecture", "Palma commercial building"],
  "tecnologia-seguridad": ["Palma modern architecture", "Palma office building"],
  "academias-idiomas-formacion": ["Palma library building", "Palma historic education"],
  "escuelas-internacionales": ["Mallorca school campus", "Palma international education"],
  "deportes-fitness": ["Mallorca cycling road", "Mallorca sports athletic"],
  "corredurias-seguros": ["Palma financial commercial", "Mallorca yacht marina"],
  "asesoria-financiera-hipotecas": ["Palma de Mallorca bank", "Palma commercial building"],
  "inmobiliaria-villas": ["Mallorca luxury villa", "Son Vida villa Palma", "Andratx luxury villa"],
  "motor-transporte": ["Mallorca scenic road car", "Tramuntana scenic road"],
  "hoteles-boutique-agroturismo": ["Mallorca boutique hotel", "Mallorca agroturismo rural finca"],
  "guias-experiencias-tours": ["Tramuntana hiking excursion", "Mallorca panoramic landscape"],
  "gimnasios-crossfit-mallorca": ["Mallorca fitness sports", "Palma sports centre"],
  "golf-clubs-mallorca": ["Mallorca golf course", "Son Vida golf club"],
  "padel-tenis-clubs": ["Mallorca tennis court", "Palma tennis sport"],
  "ciclismo-bike-rental": ["Mallorca bicycle road", "Sa Calobra cycling"],
  "clinicas-veterinarias-24h": ["Mallorca pet dog", "Mallorca animal veterinary"],
  "hoteles-adiestramiento-canino": ["Mallorca countryside dog", "Mallorca canine companion"],
  "peluqueria-estetica-canina": ["Mallorca pet grooming dog", "Mallorca pet care"],
  "aceite-oliva-almazaras": ["Mallorca olive grove", "Mallorca olive mill"],
  "queserias-producto-km0": ["Mercat de l'Olivar Palma", "Mallorca traditional food market"],
  "bodegas-enoturismo": ["Mallorca vineyard Binissalem", "Mallorca wine cellar grapes"],
};

const GENERAL_QUERIES = [
  "Mallorca landscape panoramic",
  "Mallorca coast beach cala",
  "Palma de Mallorca street old town",
  "Valldemossa Mallorca architecture",
  "Deia Mallorca village",
  "Soller Mallorca historic",
  "Alcudia Mallorca old town",
  "Pollensa Mallorca historic",
  "Santanyi Mallorca stone",
  "Manacor Mallorca architecture",
  "Capdepera Mallorca castle",
  "Port d'Andratx Mallorca harbour",
];

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function queryCommonsWithRetry(query: string, maxRetries = 3): Promise<string[]> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        query,
      )}&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=1000&format=json`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "ServiciosMallorcaBot/1.0 (https://serviciosmallorca.es; dev@serviciosmallorca.es)",
        },
      });

      if (res.status === 429) {
        console.warn(`⚠️ 429 rate limit para "${query}". Esperando ${attempt * 3}s...`);
        await sleep(attempt * 3000);
        continue;
      }

      if (!res.ok) {
        console.warn(`HTTP error ${res.status} para "${query}"`);
        return [];
      }

      const data = await res.json();
      if (!data.query?.pages) return [];

      const urls = Object.values(data.query.pages)
        .map((p: any) => p.imageinfo?.[0])
        .filter((img: any) => {
          if (!img?.url) return false;
          const lower = img.url.toLowerCase();
          if (lower.endsWith(".svg") || lower.endsWith(".pdf") || lower.endsWith(".tif")) return false;
          if (/flag|bandera|logo|map|mapa|icon|diagram|chart|coat_of_arms|escudo|symbol/i.test(lower)) return false;
          if (/unsplash|dummy|placeholder/i.test(lower)) return false;
          return img.size > 15000;
        })
        .map((img: any) => (img.thumburl || img.url) as string);

      return urls;
    } catch (err: any) {
      console.warn(`Error en consulta "${query}": ${err.message}`);
      await sleep(1500);
    }
  }
  return [];
}

async function main() {
  console.log("🌾 Iniciando cosecha de pools de imágenes para Mallorca...");

  let pools: {
    categories: Record<string, string[]>;
    general: string[];
  } = {
    categories: {},
    general: [],
  };

  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      pools = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
      console.log("📂 Archivo previo encontrado. Reanudando...");
    } catch {}
  }

  // 1. Categorías
  const catEntries = Object.entries(CATEGORY_QUERIES);
  for (let i = 0; i < catEntries.length; i++) {
    const [cat, queries] = catEntries[i];
    if (pools.categories[cat] && pools.categories[cat].length >= 30) {
      console.log(`[${i + 1}/${catEntries.length}] ✅ Categoría "${cat}" ya tiene ${pools.categories[cat].length} imágenes.`);
      continue;
    }

    const catUrls: string[] = pools.categories[cat] || [];
    for (const q of queries) {
      console.log(`[${i + 1}/${catEntries.length}] 🔍 Consultando "${q}"...`);
      const results = await queryCommonsWithRetry(q);
      for (const u of results) {
        if (!catUrls.includes(u)) catUrls.push(u);
      }
      await sleep(1100); // 1.1s entre consultas a Commons API
    }

    pools.categories[cat] = catUrls;
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(pools, null, 2));
    console.log(`[${i + 1}/${catEntries.length}] 💾 Guardada categoría "${cat}" (${catUrls.length} candidatos)`);
  }

  // 2. Pool General
  if (pools.general.length < 200) {
    console.log("\n🌊 Cosechando pool general de Mallorca...");
    for (let i = 0; i < GENERAL_QUERIES.length; i++) {
      const q = GENERAL_QUERIES[i];
      console.log(`[General ${i + 1}/${GENERAL_QUERIES.length}] 🔍 "${q}"...`);
      const results = await queryCommonsWithRetry(q);
      for (const u of results) {
        if (!pools.general.includes(u)) pools.general.push(u);
      }
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(pools, null, 2));
      await sleep(1100);
    }
  }

  let totalCat = 0;
  for (const list of Object.values(pools.categories)) {
    totalCat += list.length;
  }
  console.log(`\n🎉 Cosecha completada con éxito.`);
  console.log(`Total candidatos en categorías: ${totalCat}`);
  console.log(`Total candidatos en general: ${pools.general.length}`);
  console.log(`Archivo: ${OUTPUT_FILE}`);
}

main().catch(console.error);
