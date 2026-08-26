// Temporal: extrae aggregateRating (JSON-LD) y geodatos de las webs oficiales (se borra al finalizar).
const sites = [
  { name: "zaranda", url: "https://zaranda.es/contacto/" },
  { name: "maca", url: "https://macadecastro.com/contacto/" },
  { name: "agenestra", url: "https://andreugenestra.com/contacto/" },
];

for (const s of sites) {
  const html = await (await fetch(s.url, { headers: { "user-agent": "Mozilla/5.0" } })).text();
  const blocks = [...html.matchAll(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  console.log(`== ${s.name} == LD blocks: ${blocks.length}`);
  for (const blk of blocks) {
    try {
      const arr = Array.isArray(JSON.parse(blk)) ? JSON.parse(blk) : [JSON.parse(blk)];
      for (const obj of arr) {
        const t = obj?.["@type"] ?? "";
        if (typeof obj === "object" && ["Restaurant", "LocalBusiness", "FoodEstablishment"].includes(t)) {
          console.log(
            JSON.stringify(
              { type: t, name: obj.name, rating: obj.aggregateRating, tel: obj.telephone, addr: obj.address },
              null,
              1,
            ),
          );
        }
      }
    } catch {}
  }
}
