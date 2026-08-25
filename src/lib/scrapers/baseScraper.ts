/**
 * src/lib/scrapers/baseScraper.ts
 *
 * Núcleo base para peticiones HTTP, extracción de metadatos genéricos,
 * teléfonos, emails, favicons, imágenes OpenGraph y generación de mapas.
 */

import { validateImageQuality } from "../verificationEngine.ts";

export interface BaseScrapeResult {
  httpStatus: number;
  html: string;
  baseUrl: URL;
  metaDescription?: string;
  extractedPhone?: string;
  extractedEmail?: string;
  ogImage?: string;
  favicon?: string;
  galleryImages: string[];
}

export async function fetchHtmlWithTimeout(
  targetUrl: string,
  timeoutMs = 7000
): Promise<{ html: string; httpStatus: number; baseUrl: URL }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);
    const html = await res.text();
    return {
      html,
      httpStatus: res.status,
      baseUrl: new URL(targetUrl),
    };
  } catch {
    clearTimeout(timeout);
    return {
      html: "",
      httpStatus: 500,
      baseUrl: new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`),
    };
  }
}

export function extractBaseMetadata(html: string, baseUrl: URL, httpStatus: number): BaseScrapeResult {
  if (!html) {
    return {
      httpStatus,
      html: "",
      baseUrl,
      galleryImages: [],
    };
  }

  // 1. Meta Description
  const metaDescMatch =
    html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : undefined;

  // 2. Teléfono y Email
  const telMatch =
    html.match(/href=["']tel:([^"']+)["']/i) ||
    html.match(/(?:\+34\s?|\b)([89]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}|[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3})\b/);
  const extractedPhone = telMatch ? telMatch[1].trim() : undefined;

  const emailMatch =
    html.match(/href=["']mailto:([^"']+)["']/i) ||
    html.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const extractedEmail = emailMatch ? emailMatch[1].trim() : undefined;

  // 3. og:image y twitter:image
  const ogMatch =
    html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
  const twitterMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

  let ogImage = ogMatch ? ogMatch[1] : twitterMatch ? twitterMatch[1] : undefined;
  if (ogImage) {
    if (!ogImage.startsWith("http")) {
      try {
        ogImage = new URL(ogImage, baseUrl).href;
      } catch {
        ogImage = undefined;
      }
    }
    if (ogImage && !validateImageQuality(ogImage).isValid) {
      ogImage = undefined;
    }
  }

  // 4. Favicon / Icon
  const iconMatch =
    html.match(/<link\s+rel=["'](?:shortcut )?icon["']\s+href=["']([^"']+)["']/i) ||
    html.match(/<link\s+rel=["']apple-touch-icon["']\s+href=["']([^"']+)["']/i);
  let favicon = iconMatch ? iconMatch[1] : undefined;
  if (favicon && !favicon.startsWith("http")) {
    try {
      favicon = new URL(favicon, baseUrl).href;
    } catch {
      // Ignorar si falla la URL
    }
  }

  // 5. Galería de Fotos del Body
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const gallerySet = new Set<string>();
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    let src = match[1];
    if (
      !src.includes("data:image") &&
      !src.includes("icon") &&
      !src.includes("logo") &&
      !src.includes("pixel") &&
      !src.endsWith(".svg")
    ) {
      if (!src.startsWith("http")) {
        try {
          src = new URL(src, baseUrl).href;
        } catch {
          continue;
        }
      }
      if (validateImageQuality(src).isValid) {
        gallerySet.add(src);
      }
    }
  }

  return {
    httpStatus,
    html,
    baseUrl,
    metaDescription,
    extractedPhone,
    extractedEmail,
    ogImage,
    favicon,
    galleryImages: Array.from(gallerySet).slice(0, 8),
  };
}

export function generateMapUrls(businessName: string) {
  const cleanQuery = businessName.trim();
  const locationSuffix = cleanQuery.toLowerCase().includes("mallorca") ? "" : " Mallorca";
  const fullSearchTerm = encodeURIComponent(`${cleanQuery}${locationSuffix}`);

  return {
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${fullSearchTerm}`,
    googleReviewsUrl: `https://www.google.com/search?q=${fullSearchTerm}+opiniones+google+maps`,
    appleMapsUrl: `https://maps.apple.com/?q=${fullSearchTerm}`,
    bingMapsUrl: `https://www.bing.com/maps?q=${fullSearchTerm}`,
    openStreetMapUrl: `https://www.openstreetmap.org/search?query=${fullSearchTerm}`,
  };
}
