async function inspectPortfolio() {
  const res = await fetch("https://www.inkenzo.com/portfolio");
  const html = await res.text();
  console.log("Portfolio HTML length:", html.length);
  // Look for any image extensions or json data
  const matches = [...html.matchAll(/(https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)|(?:\/assets\/[^"'\s]+))/gi)].map(
    (m) => m[0],
  );
  console.log("Matches:", [...new Set(matches)]);
}
inspectPortfolio();
