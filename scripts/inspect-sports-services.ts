async function inspectLive(url: string) {
  console.log(`\n========================================`);
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  const html = await res.text();
  console.log(`HTTP ${res.status}, length: ${html.length}`);

  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  const matches = [...html.matchAll(imgRegex)];
  console.log(`Found ${matches.length} <img> tags`);

  const counts: Record<string, number> = {};
  for (const m of matches) {
    const src = m[1];
    counts[src] = (counts[src] || 0) + 1;
  }

  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
  for (const [src, c] of sorted) {
    console.log(`  [${c}x] ${src}`);
  }
}

async function main() {
  await inspectLive('https://serviciosmallorca.com/es/deporte');
  await inspectLive('https://serviciosmallorca.com/es/categoria/deportes-fitness');
  await inspectLive('https://serviciosmallorca.com/es/servicios?categoria=deportes-fitness');
}

main().catch(console.error);
