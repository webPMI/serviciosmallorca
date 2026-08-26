// Temporal: sondea Restaurant Guru / ElTenedor para rating y reviewCount reales.
const targets = [
  { slug: "zaranda", url: "https://restaurantguru.com/Zaranda-Palma" },
  { slug: "maca", url: "https://restaurantguru.com/Maca-de-Castro-Alcudia" },
  { slug: "agenestra", url: "https://restaurantguru.com/Andreu-Genestra-Llucmajor" },
];

for (const t of targets) {
  try {
    const res = await fetch(t.url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
    const body = await res.text();
    const rating =
      (body.match(/ratingValue\s*[:=]?\s*["']?(\d[.,]\d)/) ??
        body.match(/itemprop="ratingValue"[^>]*>([\d.,]+)</))?.[1] ?? null;
    const rc =
      (body.match(/ratingCount\s*[:=]?\s*["']?(\d[\d.,]*)["']?/) ??
        body.match(/itemprop="reviewCount"[^>]*>([\d.,]+)</))?.[1] ?? null;
    const addr = body.match(/itemprop="streetAddress"[^>]*>([^<]+)</)?.[1]?.trim() ?? null;
    console.log(`${t.slug}: status=${res.status} len=${body.length} rating=${rating} count=${rc} addr=${addr}`);
  } catch (e) {
    console.log(`${t.slug}: ERR ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 800));
}
