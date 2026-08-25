/**
 * Formatea un número de teléfono español al formato internacional +34 XXX XX XX XX
 */
export function formatSpanishPhone(rawPhone?: string): string {
  if (!rawPhone) return "";
  // Limpiar todo excepto dígitos y +
  const digits = rawPhone.replace(/[^\d+]/g, "");
  // Si ya empieza con +34, preservar formato pero añadir espacios
  if (digits.startsWith("+34") || digits.startsWith("0034")) {
    const core = digits.replace(/^(?:\+34|0034)/, "");
    if (core.length >= 9) {
      return `+34 ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6, 9)}`;
    }
    return digits.startsWith("+34") ? digits : `+34${digits.startsWith("0034") ? digits.replace(/^0034/, "") : ""}`;
  }
  // Si son 9 dígitos y empieza por 6 o 9 (móvil/fijo Spanish)
  if (/^[6-9]\d{8}$/.test(digits)) {
    return `+34 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  // Si son 10 dígitos (con prefijo 971, 973, 974, 975, 977, 96...)
  if (/^[6-9]\d{9}$/.test(digits)) {
    return `+34 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  return rawPhone;
}

import { validateImageQuality } from "../verificationEngine.ts";

export interface BaseScrapeResult {
  httpStatus: number;
  html: string;
  baseUrl: URL;
  metaDescription?: string;
  extractedPhone?: string;
  extractedEmail?: string;
  extractedAddress?: string;
  extractedCoordinates?: { lat: number; lng: number };
  extractedRating?: number;
  extractedReviewCount?: number;
  ogImage?: string;
  favicon?: string;
  galleryImages: string[];
}

export async function fetchHtmlWithTimeout(
  targetUrl: string,
  timeoutMs = 7000,
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
    html.match(/href=["']mailto:([^"']+)["']/i) || html.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const extractedEmail = emailMatch ? emailMatch[1].trim() : undefined;

  // 2.1. Dirección física (extracción mejorada con más patrones)
  const addressMatch =
    html.match(/<address[^>]*>(.*?)<\/address>/is) ||
    html.match(/(?:itemprop|typeof)=["']address["'][^>]*>(.*?)<\/[^>]+>/is) ||
    html.match(/(?:Carrer|C\/|Calle|Passeig|Avinguda|Plaça)[^<]{10,}/i) ||
    html.match(/["']streetAddress["']\s*:\s*["']([^"']+)["']/i) ||
    html.match(/["']addressLocality["']\s*:\s*["']([^"']+)["']/i) ||
    html.match(/["']postalCode["']\s*:\s*["']([^"']+)["']/i);
  let extractedAddress: string | undefined;
  if (addressMatch && addressMatch[1]) {
    extractedAddress = addressMatch[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    // Validar que parece una dirección de Mallorca
    if (
      extractedAddress &&
      extractedAddress.length > 10 &&
      (extractedAddress.includes("Palma") || extractedAddress.includes("Mallorca") || extractedAddress.match(/\d{5}/))
    ) {
      // Usar dirección extraída
    } else {
      extractedAddress = undefined;
    }
  }

  // 2.2. Coordenadas (extracción de meta tags y structured data)
  let extractedCoordinates: { lat: number; lng: number } | undefined;
  const latMatch =
    html.match(/["']latitude["']\s*:\s*([0-9.]+)/i) ||
    html.match(/<meta\s+property=["']place:location:latitude["']\s+content=["']([0-9.]+)["']/i) ||
    html.match(/lat["']\s*=\s*["']?([0-9.]+)/i);
  const lngMatch =
    html.match(/["']longitude["']\s*:\s*([0-9.]+)/i) ||
    html.match(/<meta\s+property=["']place:location:longitude["']\s+content=["']([0-9.]+)["']/i) ||
    html.match(/lng["']\s*=\s*["']?([0-9.]+)/i);

  if (latMatch && lngMatch) {
    const lat = parseFloat(latMatch[1]);
    const lng = parseFloat(lngMatch[1]);
    // Validar que están en rango de Mallorca
    if (lat >= 39 && lat <= 40 && lng >= 2 && lng <= 4) {
      extractedCoordinates = { lat, lng };
    }
  }

  // 2.3. Rating (extracción de structured data)
  let extractedRating: number | undefined;
  const ratingMatch =
    html.match(/["']aggregateRating["'].*?["']ratingValue["']\s*:\s*([0-9.]+)/i) ||
    html.match(/<meta\s+property=["']aggregateRating["']\s+content=["']([0-9.]+)["']/i);
  if (ratingMatch) {
    extractedRating = parseFloat(ratingMatch[1]);
  }

  // 2.4. Review count (extracción de structured data)
  let extractedReviewCount: number | undefined;
  const reviewCountMatch =
    html.match(/["']aggregateRating["'].*?["']reviewCount["']\s*:\s*(\d+)/i) ||
    html.match(/<meta\s+property=["']reviewCount["']\s+content=["'](\d+)["']/i);
  if (reviewCountMatch) {
    extractedReviewCount = parseInt(reviewCountMatch[1]);
  }

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
    extractedAddress,
    extractedCoordinates,
    extractedRating,
    extractedReviewCount,
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

/**
 * Traducción asistida ES → EN para descripciones de servicios.
 * Uso de diccionario de términos comunes + fallback a la misma cadena.
 * Esto es una ayuda inicial para el curador — debe revisar y corregir.
 */
export function translateToEnglish(text: string): string {
  if (!text) return "";
  let result = text;
  const dict: Record<string, string> = {
    desatascar: "unblock",
    desatasco: "unblocking",
    fontanería: "plumbing",
    fontanero: "plumber",
    "fontanería urgente": "emergency plumbing",
    "reparación de fugas": "leak repair",
    "fugas de agua": "water leaks",
    instalación: "installation",
    instalaciones: "installations",
    mantenimiento: "maintenance",
    bajantes: "pipes",
    "conducción de agua": "water piping",
    "trabajos de fontanería": "plumbing services",
    averías: "breakdowns",
    humedades: "damp",
    "termos eléctricos": "electric water heaters",
    saneamiento: "sanitation",
    "prevención de inundaciones": "flood prevention",
    "depuradora de aguas": "water treatment plant",
    "bombas de agua": "water pumps",
    "cuello de botella": "bottleneck",
    "redes de saneamiento": "sanitation networks",
    "empresa de fontanería": "plumbing company",
    "servicios de fontanería": "plumbing services",
    "24 horas": "24 hours",
    "24h": "24h",
    "sin coste": "free",
    "sin compromiso": "no obligation",
    ajuste: "adjustment",
    diagnóstico: "diagnosis",
    presupuesto: "quote",
    reparación: "repair",
    reparaciones: "repairs",
    urgente: "emergency",
    urgencias: "emergencies",
    contacto: "contact",
    eficiencia: "efficiency",
    calidad: "quality",
    experiencia: "experience",
    profesional: "professional",
    técnico: "technician",
    local: "local",
  };
  // Ordenar por longitud descendente para reemplazar frases antes que palabras sueltas
  const entries = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
  for (const [es, en] of entries) {
    result = result.replace(new RegExp(`\\b${escapeRegex(es)}\\b`, "gi"), en);
  }
  return result;
}

/**
 * Traducción asistida ES → CA para descripciones de servicios.
 * Mismo enfoque: diccionario de términos + fallback.
 */
export function translateToCatalan(text: string): string {
  if (!text) return "";
  let result = text;
  const dict: Record<string, string> = {
    desatascar: "desembussar",
    desatasco: "desembuss",
    fontanería: "fontaneria",
    fontanero: "fontaner",
    "fontanería urgente": "fontaneria urgent",
    "reparación de fugas": "reparació de fuites",
    "fugas de agua": "fuites d'aigua",
    instalación: "instal·lació",
    instalaciones: "instal·lacions",
    mantenimiento: "manteniment",
    bajantes: "bajants",
    "conducción de agua": "conducció d'aigua",
    "trabajos de fontanería": "treballs de fontaneria",
    averías: "-avaries",
    humedades: "humitats",
    "termos eléctricos": "termos elèctrics",
    saneamiento: "sanejament",
    "prevención de inundaciones": "prevenció d'inundacions",
    "depuradora de aguas": "depuradora d'aigües",
    "bombas de agua": "bombes d'aigua",
    "cuello de botella": "coll d'ampolla",
    "redes de saneamiento": "xarxes de sanejament",
    "empresa de fontanería": "empresa de fontaneria",
    "servicios de fontanería": "serveis de fontaneria",
    "24 horas": "24 hores",
    "24h": "24h",
    "sin coste": "gratis",
    "sin compromiso": "sense compromís",
    ajuste: "ajust",
    diagnóstico: "diagnòstic",
    presupuesto: "pressupost",
    reparación: "reparació",
    reparaciones: "reparas",
    urgente: "urgent",
    urgencias: "urgències",
    contacto: "contacte",
    eficiencia: "eficiència",
    calidad: "qualitat",
    experiencia: "experiència",
    profesional: "profesional",
    técnico: "tècnic",
    local: "local",
  };
  const entries = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
  for (const [es, ca] of entries) {
    result = result.replace(new RegExp(`\\b${escapeRegex(es)}\\b`, "gi"), ca);
  }
  return result;
}

/** Escape simple para regex */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
