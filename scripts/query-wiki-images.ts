async function fetchWikiImageUrl(fileName: string): Promise<string> {
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(endpoint, {
    headers: { "User-Agent": "ServiciosMallorcaBot/1.0 (info@serviciosmallorca.com)" },
  });
  const data = (await res.json()) as any;
  const pages = data.query.pages;
  for (const pageId of Object.keys(pages)) {
    const page = pages[pageId];
    if (page.imageinfo && page.imageinfo.length > 0) {
      return page.imageinfo[0].url;
    }
  }
  throw new Error(`No imageinfo found for ${fileName}`);
}

async function testFetch() {
  const testFiles = [
    "Catedral_de_Palma_de_Mallorca.jpg",
    "Palma_de_Mallorca_Cathedral_from_the_Sea.jpg",
    "Port_de_Sóller_01.jpg",
    "Port_de_Pollença.jpg",
    "Valldemossa_-_panoramio_(1).jpg",
    "Deià_Mallorca.jpg",
    "Binissalem_Mallorca_Placa.jpg",
    "Cap_de_Formentor_Mallorca.jpg",
    "Castell_de_Bellver.JPG",
    "Cala_Figuera_Santanyi.jpg",
    "Mercat_de_l%27Olivar.jpg",
    "Hospital_Son_Espases_Palma.jpg",
  ];

  for (const file of testFiles) {
    try {
      const url = await fetchWikiImageUrl(file);
      console.log(`✅ [${file}]:`, url);
    } catch (e: any) {
      console.log(`❌ [${file}]:`, e.message);
    }
  }
}

testFetch();
