async function inspectSite(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const html = await res.text();
    const matches = Array.from(
      html.matchAll(/(?:src|href|content)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi),
    );
    const urls = new Set<string>();
    for (const m of matches) {
      if (m[1]) {
        try {
          urls.add(new URL(m[1], url).href);
        } catch {}
      }
    }
    console.log(`Found ${urls.size} raw image candidates on ${url}:`);
    for (const img of urls) {
      try {
        const test = await fetch(img, { method: "HEAD" });
        if (test.ok) {
          console.log(` [200 OK] -> ${img}`);
        }
      } catch {}
    }
  } catch (err: any) {
    console.error("Error fetching site:", err.message);
  }
}

const targetUrl = process.argv[2] || "https://www.trespais-mallorca.com/";
inspectSite(targetUrl);
