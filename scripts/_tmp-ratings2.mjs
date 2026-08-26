// Temporal: intenta rating/reviewCount real desde Bing y Google Maps (se borra al finalizar).
const targets = [
  { slug: "zaranda", q: "Restaurante Zaranda Palma Mallorca" },
  { slug: "maca", q: "Restaurante Maca de Castro Alcudia" },
  { slug: "agenestra", q: "Andreu Genestra Llucmajor" },
];

async function tryGoogleMaps(q) {
  const url = "https://www.google.com/maps/search/" + encodeURIComponent(q);
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
  const t = await res.text();
  const rating = t.match(/LDRxq\s*IMO[^\d]*([\d.,]+)/)?.[1];
  const rcMatch = t.match(/([\d.,]+)\s*reviews/i) ?? t.match(/([\d.,]+)\s*(?:reseñas|opiniones)/i);
  return { len: t.length, rating, reviewCount: rcMatch?.[1] ?? null };
}

async function tryBing(q) {
  const url = "https://www.bing.com/search?q=" + encodeURIComponent(q + " opiniones");
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
  const t = await res.text();
  const rating = (t.match(/value="(\d[.,]\d)"/) ?? t.match(/alt="Valoración: ([0-9,.]{2,3})"/))?.[1] ?? null;
  const rc = t.match(/([0-9.,]+)\s*(?:reseñas|resenhas|reviews)/i)?.[1] ?? null;
  return { len: t.length, rating, reviewCount: rc };
}

for (const t of targets) {
  const gm = await tryGoogleMaps(t.q);
  console.log(`GM ${t.slug}:`, JSON.stringify(gm));
  await new Promise((r) => setTimeout(r, 800));
  const bg = await tryBing(t.q);
  console.log(`BG ${t.slug}:`, JSON.stringify(bg));
  await new Promise((r) => setTimeout(r, 800));
}
