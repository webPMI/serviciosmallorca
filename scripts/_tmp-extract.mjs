// Temporal: extrae imágenes y metadatos reales de negocios para curación (se borra al finalizar).
const sites = [
  { name: "zaranda", url: "https://zaranda.es/" },
  { name: "maca", url: "https://macadecastro.com/" },
  { name: "agenestra", url: "https://andreugenestra.com/" },
];

const imgRe = /https:\/\/[^\s"'()]+?\.(?:jpg|jpeg|png|webp)(?:\?[^\s"'()]*)?/g;

for (const s of sites) {
  const html = await (await fetch(s.url, { headers: { "user-agent": "Mozilla/5.0" } })).text();
  const og = html.match(/property="og:image" content="([^"]+)"/)?.[1] ?? "";
  const imgs = [...new Set(html.match(imgRe) ?? [])];
  const phones = [...new Set(html.match(/\+34[\d ]{8,}/g) ?? [])];
  const emails = [...new Set(html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) ?? [])].filter(
    (e) => !e.endsWith(".png") && !e.endsWith(".jpg"),
  );
  console.log(`== ${s.name} ==`);
  console.log("OG:", og);
  console.log("IMG:", imgs.slice(0, 10).join("\n   "));
  console.log("TEL:", phones.join(", "));
  console.log("EMAIL:", emails.join(", "));
  console.log("");
}
