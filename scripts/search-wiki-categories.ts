async function searchWikiCommons(query: string, limit = 5): Promise<string[]> {
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${limit}&prop=imageinfo&iiprop=url|mime&format=json`;
  const res = await fetch(endpoint, {
    headers: { "User-Agent": "ServiciosMallorcaBot/1.0 (info@serviciosmallorca.com)" },
  });
  const data = (await res.json()) as any;
  const pages = data.query?.pages || {};
  const urls: string[] = [];
  for (const pageId of Object.keys(pages)) {
    const page = pages[pageId];
    if (page.imageinfo && page.imageinfo.length > 0) {
      const info = page.imageinfo[0];
      if (info.mime === "image/jpeg" || info.mime === "image/png" || info.mime === "image/webp") {
        urls.push(info.url.split("?")[0]);
      }
    }
  }
  return urls;
}

async function run() {
  const categories = [
    { cat: "cathedral", q: "Catedral de Santa Maria de Palma Mallorca" },
    { cat: "nautica", q: "Port de Palma de Mallorca yachts" },
    { cat: "nautica_soller", q: "Port de Soller Mallorca" },
    { cat: "gastronomia", q: "Mercat de l Olivar Palma Mallorca" },
    { cat: "bodegas", q: "Binissalem Mallorca vineyards" },
    { cat: "reformas", q: "Mallorca traditional finca architecture" },
    { cat: "salud", q: "Valldemossa Mallorca village" },
    { cat: "inmobiliaria", q: "Deia Mallorca village houses" },
    { cat: "motor", q: "Cap de Formentor lighthouse road" },
    { cat: "deporte", q: "Castell de Bellver Palma" },
    { cat: "artesania", q: "Vidrios Gordiola Mallorca" },
  ];

  for (const item of categories) {
    console.log(`\n=== Searching for: ${item.cat} (${item.q}) ===`);
    const results = await searchWikiCommons(item.q, 3);
    for (const r of results) {
      console.log(`  - ${r}`);
    }
  }
}

run();
