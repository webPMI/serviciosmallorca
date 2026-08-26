// Temporal: intenta extraer rating/reviewCount real de Google Maps embebido (se borra al finalizar).
const targets = [
  { slug: "zaranda", q: "Restaurante Zaranda Palma Mallorca" },
  { slug: "maca", q: "Restaurante Maca de Castro Alcudia" },
  { slug: "agenestra", q: "Andreu Genestra Llucmajor" },
];

async function getMatches(url, patterns) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
    const t = await res.text();
    const out = {};
    for (const key of Object.keys(patterns)) {
      const m = t.match(patterns[key]);
      out[key] = m ? (m[1] ?? m[0]) : null;
    }
    return { status: res.status, len: t.length, ...out };
  } catch (e) {
    return { err: e.message };
  }
}

for (const t of targets) {
  const url = "https://www.google.com/search?q=" + encodeURIComponent(t.q + " opiniones");
  const r = await getMatches(url, {
    reviewCount: /(?:\b|>)(\d[\d.,]*)\s*(?:reseñas|opiniones|reviews)/i,
    rating: /ARATING\((\d[\d.,]*)[;]/,
    near: /(\d[.,]\d)\s*★/,
  });
  console.log(`== ${t.slug} ==`, JSON.stringify(r));
  await new Promise((res) => setTimeout(res, 1200));
}
