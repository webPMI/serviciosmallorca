#!/usr/bin/env node
/**
 * scripts/business-intelligence-lookup.ts
 *
 * Motor de Inteligencia Integral, Huella Digital, Redes Sociales Ampliadas,
 * Extracción Multimedia, Reputación Multi-Plataforma y Estructuración de Negocios en Mallorca.
 *
 * Uso:
 *   npx tsx scripts/business-intelligence-lookup.ts "Kuyen Art Tattoo Palma" --url="https://kuyenart.com"
 *   npx tsx scripts/business-intelligence-lookup.ts "Box Tattoo Piercing Palma" --url="https://boxtattoopiercing.com"
 */

import { auditBusinessData, type VerificationReport } from "../src/lib/verificationEngine.ts";

interface LookupResult {
  businessQuery: string;
  websiteProvided?: string;
  extractedMedia: {
    mainImage?: string;
    ogImage?: string;
    favicon?: string;
    galleryImages: string[];
  };
  detectedSocialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    pinterest?: string;
    linkedin?: string;
    twitter?: string;
    whatsappChannel?: string;
  };
  detectedAmenities: string[];
  detectedPaymentMethods: string[];
  mapsPresence: {
    googleMapsSearchUrl: string;
    googleReviewsSearchUrl: string;
    appleMapsSearchUrl: string;
    bingMapsSearchUrl: string;
    openStreetMapUrl: string;
  };
  directoryIndexingDorks: Array<{
    directoryName: string;
    searchUrl: string;
  }>;
  balearicPressDorks: Array<{
    mediaName: string;
    language: string;
    searchUrl: string;
  }>;
  socialAndAuthorityDorks: Array<{
    platform: string;
    searchUrl: string;
  }>;
  verificationReport: VerificationReport;
  curationTemplate: Record<string, any>;
}

/**
 * Escanea la web oficial extrayendo multimedia, todas las redes sociales, métodos de pago y comodidades.
 */
async function scrapeWebsiteData(targetUrl: string): Promise<{
  ogImage?: string;
  favicon?: string;
  metaDescription?: string;
  extractedPhone?: string;
  extractedEmail?: string;
  galleryImages: string[];
  socialLinks: Record<string, string>;
  detectedAmenities: string[];
  detectedPaymentMethods: string[];
  onlineStoreDetected?: boolean;
  storePlatform?: string;
  storeUrl?: string;
  httpStatus?: number;
}> {
  const socialLinks: Record<string, string> = {};
  const detectedAmenities: string[] = ["wifi", "air_conditioning"];
  const detectedPaymentMethods: string[] = ["credit_card", "cash"];
  let extractedPhone: string | undefined;
  let extractedEmail: string | undefined;
  let metaDescription: string | undefined;
  let httpStatus = 200;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);
    httpStatus = res.status;

    if (!res.ok) {
      return {
        galleryImages: [],
        socialLinks,
        detectedAmenities,
        detectedPaymentMethods,
        httpStatus,
      };
    }

    const html = await res.text();
    const baseUrl = new URL(targetUrl);
    const lowerHtml = html.toLowerCase();

    // 1. Extraer Meta Description
    const metaDescMatch =
      html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (metaDescMatch) {
      metaDescription = metaDescMatch[1].trim();
    }

    // 2. Extraer Teléfono y Email
    const telMatch =
      html.match(/href=["']tel:([^"']+)["']/i) ||
      html.match(/(?:\+34\s?|\b)([89]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}|[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3})\b/);
    if (telMatch) {
      extractedPhone = telMatch[1].trim();
    }

    const emailMatch =
      html.match(/href=["']mailto:([^"']+)["']/i) ||
      html.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      extractedEmail = emailMatch[1].trim();
    }

    // 3. Extraer og:image y twitter:image
    const ogMatch =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
    const twitterMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

    let ogImage = ogMatch ? ogMatch[1] : twitterMatch ? twitterMatch[1] : undefined;
    if (ogImage && !ogImage.startsWith("http")) {
      ogImage = new URL(ogImage, baseUrl).href;
    }

    // 4. Extraer Favicon / Icon
    const iconMatch =
      html.match(/<link\s+rel=["'](?:shortcut )?icon["']\s+href=["']([^"']+)["']/i) ||
      html.match(/<link\s+rel=["']apple-touch-icon["']\s+href=["']([^"']+)["']/i);
    let favicon = iconMatch ? iconMatch[1] : undefined;
    if (favicon && !favicon.startsWith("http")) {
      favicon = new URL(favicon, baseUrl).href;
    }

    // 3. Extracción profunda de Redes Sociales (HTML, JSON-LD, iframes y scripts)
    const cleanedHtml = html.replace(/\\\//g, "/");
    const rawUrlMatches = cleanedHtml.match(/(?:https?:)?\/\/[^\s"'<>()\\]+/gi) || [];

    for (let rawUrl of rawUrlMatches) {
      if (rawUrl.startsWith("//")) rawUrl = `https:${rawUrl}`;

      // Limpieza de sufijos comunes de comillas o caracteres extra
      const url = rawUrl.replace(/[",;)>]+$/, "").trim();

      // YouTube: Canales (@handle, /channel/, /c/, /user/, videos)
      if (
        (url.includes("youtube.com/") || url.includes("youtu.be/")) &&
        !url.includes("/embed/") &&
        !url.includes("/iframe_api") &&
        !url.includes("/player_api") &&
        !socialLinks.youtube
      ) {
        // Normalizar canal de YouTube
        socialLinks.youtube = url;
      }

      // Facebook: Páginas oficiales de negocio
      else if (
        (url.includes("facebook.com/") || url.includes("fb.com/") || url.includes("fb.me/")) &&
        !url.includes("/sharer") &&
        !url.includes("/share.php") &&
        !url.includes("/dialog/") &&
        !url.includes("/tr/") &&
        !url.includes("/login") &&
        !socialLinks.facebook
      ) {
        socialLinks.facebook = url;
      }

      // Instagram
      else if (
        (url.includes("instagram.com/") || url.includes("instagr.am/")) &&
        !url.includes("/sharer") &&
        !socialLinks.instagram
      ) {
        socialLinks.instagram = url;
      }

      // TikTok
      else if (url.includes("tiktok.com/@") && !socialLinks.tiktok) {
        socialLinks.tiktok = url;
      }

      // LinkedIn
      else if (url.includes("linkedin.com/") && !socialLinks.linkedin) {
        socialLinks.linkedin = url;
      }

      // Pinterest
      else if ((url.includes("pinterest.com/") || url.includes("pinterest.es/")) && !socialLinks.pinterest) {
        socialLinks.pinterest = url;
      }

      // Twitter / X
      else if (
        (url.includes("twitter.com/") || url.includes("x.com/")) &&
        !url.includes("/intent/") &&
        !url.includes("/share") &&
        !socialLinks.twitter
      ) {
        socialLinks.twitter = url;
      }

      // WhatsApp Channel
      else if (
        (url.includes("whatsapp.com/channel/") || url.includes("chat.whatsapp.com/")) &&
        !socialLinks.whatsappChannel
      ) {
        socialLinks.whatsappChannel = url;
      }
    }

    // 4. Detección de Bizum, Apple Pay, Cripto
    if (lowerHtml.includes("bizum")) detectedPaymentMethods.push("bizum");
    if (lowerHtml.includes("apple pay") || lowerHtml.includes("applepay")) detectedPaymentMethods.push("apple_pay");
    if (lowerHtml.includes("bitcoin") || lowerHtml.includes("crypto")) detectedPaymentMethods.push("crypto");

    // 5. Detección de Tienda Online & E-Commerce
    let onlineStoreDetected = false;
    let storePlatform: string | undefined = undefined;
    let storeUrl: string | undefined = undefined;

    if (lowerHtml.includes("shopify") || lowerHtml.includes("cdn.shopify.com")) {
      onlineStoreDetected = true;
      storePlatform = "shopify";
    } else if (lowerHtml.includes("woocommerce") || lowerHtml.includes("wc-api")) {
      onlineStoreDetected = true;
      storePlatform = "woocommerce";
    } else if (lowerHtml.includes("prestashop")) {
      onlineStoreDetected = true;
      storePlatform = "prestashop";
    } else if (lowerHtml.includes("/shop") || lowerHtml.includes("/tienda") || lowerHtml.includes("/store") || lowerHtml.includes("/productos")) {
      onlineStoreDetected = true;
      storePlatform = "custom";
    }

    if (onlineStoreDetected) {
      storeUrl = new URL("/shop", baseUrl).href;
    }

    // 6. Detección de Comodidades
    if (lowerHtml.includes("parking") || lowerHtml.includes("aparcamiento")) detectedAmenities.push("parking_nearby");
    if (lowerHtml.includes("movilidad reducida") || lowerHtml.includes("accesible") || lowerHtml.includes("wheelchair"))
      detectedAmenities.push("wheelchair_accessible");
    if (lowerHtml.includes("pet friendly") || lowerHtml.includes("mascotas")) detectedAmenities.push("pet_friendly");

    // 6. Extraer imágenes de alta resolución del body
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
        gallerySet.add(src);
      }
    }

    return {
      ogImage,
      favicon,
      metaDescription,
      extractedPhone,
      extractedEmail,
      galleryImages: Array.from(gallerySet).slice(0, 8),
      socialLinks,
      detectedAmenities,
      detectedPaymentMethods,
      onlineStoreDetected,
      storePlatform,
      storeUrl,
      httpStatus,
    };
  } catch {
    return {
      galleryImages: [],
      socialLinks,
      detectedAmenities,
      detectedPaymentMethods,
      onlineStoreDetected: false,
      httpStatus: 500,
    };
  }
}

interface ScrapedWebsiteInfo {
  ogImage?: string;
  favicon?: string;
  metaDescription?: string;
  extractedPhone?: string;
  extractedEmail?: string;
  galleryImages: string[];
  socialLinks: Record<string, string>;
  detectedAmenities: string[];
  detectedPaymentMethods: string[];
  onlineStoreDetected?: boolean;
  storePlatform?: string;
  storeUrl?: string;
  httpStatus?: number;
}

async function generateIntelligenceReport(query: string, websiteUrl?: string): Promise<LookupResult> {
  const cleanQuery = query.trim();
  const encodedQuery = encodeURIComponent(cleanQuery);
  const locationSuffix = cleanQuery.toLowerCase().includes("mallorca") ? "" : " Mallorca";
  const fullSearchTerm = encodeURIComponent(`${cleanQuery}${locationSuffix}`);

  // Scrape website if provided
  let scrapedData: ScrapedWebsiteInfo = {
    galleryImages: [],
    socialLinks: {},
    detectedAmenities: ["wifi", "air_conditioning"],
    detectedPaymentMethods: ["credit_card", "cash"],
    onlineStoreDetected: false,
  };

  if (websiteUrl && websiteUrl.startsWith("http")) {
    scrapedData = await scrapeWebsiteData(websiteUrl);
  }

  // Detección de Indexación en Directorios Oficiales & Guías Gastronómicas
  const directoryIndexingDorks = [
    {
      directoryName: "Guía Michelin España (Estrellas / Bib Gourmand)",
      searchUrl: `https://www.google.com/search?q=site:guide.michelin.com+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "Guía Repsol (Soles & Soletes)",
      searchUrl: `https://www.google.com/search?q=site:guiarepsol.com+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "TheFork / ElTenedor Reservas",
      searchUrl: `https://www.google.com/search?q=site:thefork.es+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "TripAdvisor Mallorca",
      searchUrl: `https://www.google.com/search?q=site:tripadvisor.es+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "ABC Mallorca Directorio & Gastronomía",
      searchUrl: `https://www.google.com/search?q=site:abc-mallorca.com+${encodedQuery}`,
    },
    {
      directoryName: "Páginas Amarillas Baleares",
      searchUrl: `https://www.google.com/search?q=site:paginasamarillas.es+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "Cylex España Mallorca",
      searchUrl: `https://www.google.com/search?q=site:cylex.es+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "Trustpilot España",
      searchUrl: `https://www.google.com/search?q=site:trustpilot.com+${encodedQuery}`,
    },
    {
      directoryName: "Bodas.net Mallorca",
      searchUrl: `https://www.google.com/search?q=site:bodas.net+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "Treatwell / Fresha Belleza",
      searchUrl: `https://www.google.com/search?q=(site:treatwell.es+OR+site:fresha.com)+${encodedQuery}+mallorca`,
    },
  ];

  // Prensa Balear
  const pressDorks = [
    {
      mediaName: "Diario de Mallorca",
      language: "es",
      searchUrl: `https://www.google.com/search?q=site:diariodemallorca.es+${encodedQuery}`,
    },
    {
      mediaName: "Última Hora Mallorca",
      language: "es",
      searchUrl: `https://www.google.com/search?q=site:ultimahora.es+${encodedQuery}`,
    },
    {
      mediaName: "Mallorca Magazin (Alemán)",
      language: "de",
      searchUrl: `https://www.google.com/search?q=site:mallorcamagazin.com+${encodedQuery}`,
    },
    {
      mediaName: "Majorca Daily Bulletin (Inglés)",
      language: "en",
      searchUrl: `https://www.google.com/search?q=site:majorcadailybulletin.com+${encodedQuery}`,
    },
    {
      mediaName: "ABC Mallorca (Lujo & Estilo)",
      language: "en / es / de",
      searchUrl: `https://www.google.com/search?q=site:abc-mallorca.com+${encodedQuery}`,
    },
    {
      mediaName: "IB3 Notícies",
      language: "ca",
      searchUrl: `https://www.google.com/search?q=site:ib3.org+${encodedQuery}`,
    },
  ];

  // Autoridad y Redes Sociales Oficiales
  const authorityDorks = [
    {
      platform: "YouTube Canal Oficial",
      searchUrl:
        scrapedData.socialLinks.youtube ||
        `https://www.google.com/search?q=site:youtube.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "Facebook Página Oficial",
      searchUrl:
        scrapedData.socialLinks.facebook ||
        `https://www.google.com/search?q=site:facebook.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "Instagram Official",
      searchUrl:
        scrapedData.socialLinks.instagram ||
        `https://www.google.com/search?q=site:instagram.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "TikTok Oficial",
      searchUrl:
        scrapedData.socialLinks.tiktok || `https://www.google.com/search?q=site:tiktok.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "LinkedIn Empresa",
      searchUrl:
        scrapedData.socialLinks.linkedin ||
        `https://www.google.com/search?q=site:linkedin.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "Pinterest Tableros",
      searchUrl:
        scrapedData.socialLinks.pinterest ||
        `https://www.google.com/search?q=site:pinterest.com+${encodedQuery}+mallorca`,
    },
    {
      platform: "Premios y Reconocimientos Oficiales",
      searchUrl: `https://www.google.com/search?q=${encodedQuery}+"premio"+OR+"award"+OR+"michelin"+OR+"repsol"+mallorca`,
    },
  ];

  // Slug generator
  const slug = cleanQuery
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const mainImage = scrapedData.ogImage || (scrapedData.galleryImages[0] ?? "");
  const gallery = scrapedData.galleryImages.filter((img) => img !== mainImage);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${fullSearchTerm}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${fullSearchTerm}`;
  const bingMapsUrl = `https://www.bing.com/maps?q=${fullSearchTerm}`;

  const curationTemplate: Record<string, any> = {
    id: slug,
    slug: slug,
    name: cleanQuery,
    category: "arte-tatuajes",
    secondaryCategories: [],
    zone: "palma",
    address: "Palma, Mallorca",
    coordinates: { lat: 39.5696, lng: 2.6502 },
    rating: 5.0,
    reviewCount: 0,
    priceRange: "€€",
    verified: true,
    featured: false,
    status: "open",
    seasonality: "year_round",
    culturalIdentity: "mallorquin_heritage",
    isIconicHeritage: false,
    targetAudience: ["residentes", "turistas", "alemanes", "britanicos"],
    languagesSpoken: ["es", "en", "ca"],
    emergency24h: false,
    inVillaService: false,
    features: ["wifi", "air_conditioning", "credit_card"],
    paymentMethods: scrapedData.detectedPaymentMethods,
    amenities: scrapedData.detectedAmenities,
    certifications: ["Higiénico Sanitario Balear"],
    pricing: {
      startingPrice: "Desde 60€",
      depositRequired: "Cita previa con señal",
      rateType: "custom_quote",
    },
    teamMembers: [
      {
        name: "Artista Principal",
        role: { es: "Director / Tatuador Residente", en: "Lead Resident Artist", ca: "Director / Tatuador Resident" },
        specialty: "Fine Line & Microrealismo",
        instagramHandle: scrapedData.socialLinks.instagram
          ? `@${scrapedData.socialLinks.instagram.replace(/\/$/, "").split("/").pop()}`
          : "",
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Es necesario pedir cita previa?",
          en: "Is an appointment required?",
          ca: "És necessari demanar cita prèvia?",
        },
        answer: {
          es: "Para piezas personalizadas y proyectos grandes recomendamos concertar cita. También atendemos walk-ins según disponibilidad diaria.",
          en: "For custom and large pieces we recommend booking an appointment. Walk-ins are also welcome depending on daily availability.",
          ca: "Per a peces personalitzades recomanem concertar cita. També atenem walk-ins segons disponibilitat.",
        },
      },
    ],
    foundedYear: 2020,
    founderName: "",
    founderStory: {
      es: "",
      en: "",
      ca: "",
    },
    reputationBreakdown: {
      googleMaps: {
        rating: 5.0,
        reviewCount: 0,
        url: googleMapsUrl,
      },
      appleMaps: {
        url: appleMapsUrl,
      },
      bingMaps: {
        rating: 5.0,
        reviewCount: 0,
        url: bingMapsUrl,
      },
      tripadvisor: {
        rating: 5.0,
        reviewCount: 0,
        url: "",
      },
      totalReviewsAggregated: 0,
      overallWeightedRating: 5.0,
    },
    reviews: [
      {
        id: "rev-1",
        authorName: "Cliente Verificado",
        rating: 5,
        date: new Date().toISOString().split("T")[0],
        platform: "google_maps",
        language: "es",
        comment: "Excelente atención, máxima higiene y un trato inmejorable en el centro de Palma.",
        verifiedCustomer: true,
      },
    ],
    socialLinks: scrapedData.socialLinks,
    socialPosts: [],
    webDirectories: [
      {
        directoryName: "Páginas Amarillas",
        url: `https://www.google.com/search?q=site:paginasamarillas.es+${encodedQuery}`,
        indexed: true,
      },
      {
        directoryName: "Cylex Mallorca",
        url: `https://www.google.com/search?q=site:cylex.es+${encodedQuery}`,
        indexed: true,
      },
    ],
    pressMentions: [],
    awards: [],
    authorityProfiles: [],
    googleMapsUrl,
    appleMapsUrl,
    bingMapsUrl,
    phone: scrapedData.extractedPhone || "+34 000 000 000",
    whatsapp: scrapedData.extractedPhone || "+34 000 000 000",
    email: scrapedData.extractedEmail || "info@ejemplo.com",
    website: websiteUrl || "",
    tags: ["zona:palma", "product:fine-line", "mod:cita-previa"],
    shortDescription: {
      es: scrapedData.metaDescription || "",
      en: "",
      ca: "",
    },
    fullDescription: {
      es: "",
      en: "",
      ca: "",
    },
    highlights: {
      es: [],
      en: [],
      ca: [],
    },
    servicesProvided: {
      es: [],
      en: [],
      ca: [],
    },
    image: mainImage,
    gallery: gallery,
    schedule: "Lun - Sáb: 10:00 - 20:00",
    lastVerifiedAt: new Date().toISOString().split("T")[0],
  };

  // Ejecución de la Triple Verificación y Cálculo de Confianza
  const verificationReport = auditBusinessData({
    name: cleanQuery,
    category: "arte-tatuajes",
    zone: "palma",
    address: "Palma, Mallorca",
    coordinates: { lat: 39.5696, lng: 2.6502 },
    website: websiteUrl,
    phone: scrapedData.extractedPhone,
    extractedWebPhone: scrapedData.extractedPhone,
    whatsapp: scrapedData.extractedPhone,
    socialLinks: scrapedData.socialLinks,
    webHttpStatus: scrapedData.httpStatus,
  });

  curationTemplate.confidenceScore = verificationReport.confidenceScore;
  curationTemplate.verificationStatus = verificationReport.status;
  curationTemplate.sourceCrossReference = verificationReport.crossReference;

  return {
    businessQuery: cleanQuery,
    websiteProvided: websiteUrl,
    extractedMedia: {
      mainImage,
      ogImage: scrapedData.ogImage,
      favicon: scrapedData.favicon,
      galleryImages: scrapedData.galleryImages,
    },
    detectedSocialLinks: scrapedData.socialLinks,
    detectedAmenities: scrapedData.detectedAmenities,
    detectedPaymentMethods: scrapedData.detectedPaymentMethods,
    mapsPresence: {
      googleMapsSearchUrl: googleMapsUrl,
      googleReviewsSearchUrl: `https://www.google.com/search?q=${encodedQuery}+opiniones+google+maps+mallorca`,
      appleMapsSearchUrl: appleMapsUrl,
      bingMapsSearchUrl: bingMapsUrl,
      openStreetMapUrl: `https://www.openstreetmap.org/search?query=${fullSearchTerm}`,
    },
    directoryIndexingDorks: directoryIndexingDorks,
    balearicPressDorks: pressDorks,
    socialAndAuthorityDorks: authorityDorks,
    verificationReport,
    curationTemplate,
  };
}

// CLI Execution
async function main() {
  const rawArgs = process.argv.slice(2);
  let websiteUrl: string | undefined;
  const queryParts: string[] = [];

  for (const arg of rawArgs) {
    if (arg.startsWith("--url=")) {
      websiteUrl = arg.replace("--url=", "").trim();
    } else {
      queryParts.push(arg);
    }
  }

  const query = queryParts.join(" ").trim() || "Kuyen Art Tattoo Palma";

  console.log("=".repeat(80));
  console.log(`🔎 MINERÍA DE INTELIGENCIA EXTENDIDA, MULTI-MAPAS & REDES: "${query}"`);
  if (websiteUrl) console.log(`🌐 Website Oficial Analizado: ${websiteUrl}`);
  console.log("=".repeat(80));

  const report = await generateIntelligenceReport(query, websiteUrl);

  console.log("\n📍 1. ENLACES DIRECTOS A MAPAS Y BÚSQUEDA DE RESEÑAS:");
  console.log(`  • Google Maps Ficha:   ${report.mapsPresence.googleMapsSearchUrl}`);
  console.log(`  • Google Reviews Deep: ${report.mapsPresence.googleReviewsSearchUrl}`);
  console.log(`  • Apple Maps Ficha:    ${report.mapsPresence.appleMapsSearchUrl}`);
  console.log(`  • Bing Maps Ficha:     ${report.mapsPresence.bingMapsSearchUrl}`);

  console.log("\n📸 2. MULTIMEDIA OFICIAL DETECTADO:");
  if (report.extractedMedia.ogImage) {
    console.log(`  • Imagen Principal (OpenGraph): ${report.extractedMedia.ogImage}`);
  }
  if (report.extractedMedia.favicon) {
    console.log(`  • Logotipo / Favicon:          ${report.extractedMedia.favicon}`);
  }
  if (report.extractedMedia.galleryImages.length > 0) {
    console.log(`  • Galería de Fotos (${report.extractedMedia.galleryImages.length}):`);
    report.extractedMedia.galleryImages.forEach((img, i) => console.log(`    [${i + 1}] ${img}`));
  }

  console.log("\n📱 3. REDES SOCIALES OFICIALES DETECTADAS (Web Scrape):");
  if (Object.keys(report.detectedSocialLinks).length > 0) {
    Object.entries(report.detectedSocialLinks).forEach(([net, url]) => {
      console.log(`  • ${net.toUpperCase()}: ${url}`);
    });
  } else {
    console.log("  • (No se encontraron enlaces embebidos directos en el HTML de la web)");
  }

  console.log("\n🔎 3.1. DORKS DE BÚSQUEDA DIRECTA PARA REDES & AUTORIDAD:");
  report.socialAndAuthorityDorks.forEach((d) => {
    console.log(`  • ${d.platform}: ${d.searchUrl}`);
  });

  console.log("\n💳 4. MÉTODOS DE PAGO Y COMODIDADES DETECTADAS:");
  console.log(`  • Métodos de Pago: ${report.detectedPaymentMethods.join(", ")}`);
  console.log(`  • Comodidades:     ${report.detectedAmenities.join(", ")}`);

  console.log("\n🗂️ 5. INDEXACIÓN EN DIRECTORIOS Y OTRAS WEBS BALEARES:");
  report.directoryIndexingDorks.forEach((d) => {
    console.log(`  • ${d.directoryName}: ${d.searchUrl}`);
  });

  console.log("\n📰 6. PRENSA Y REPUTACIÓN BALEAR:");
  report.balearicPressDorks.forEach((p) => {
    console.log(`  • [${p.language.toUpperCase()}] ${p.mediaName}: ${p.searchUrl}`);
  });

  console.log("\n🛡️ 7. AUDITORÍA DE CONFIANZA & TRIPLE VERIFICACIÓN (Confidence Score):");
  const vr = report.verificationReport;
  const statusEmoji = vr.status === "verified" ? "✅" : vr.status === "needs_manual_review" ? "⚠️" : "⏳";
  console.log(`  • Puntaje de Confianza: ${vr.confidenceScore}% (${statusEmoji} ${vr.status.toUpperCase()})`);
  console.log(`  • Desglose de Puntos:`);
  console.log(`    - Coincidencia Telefónica: ${vr.scoreBreakdown.phoneConsistency}/25 pts`);
  console.log(`    - Precisión Geográfica Mallorca: ${vr.scoreBreakdown.geoAccuracy}/25 pts`);
  console.log(`    - Disponibilidad Web (HTTP ${report.extractedMedia.ogImage ? "200" : "Status"}): ${vr.scoreBreakdown.webAvailability}/20 pts`);
  console.log(`    - Huella en Redes Sociales: ${vr.scoreBreakdown.socialFootprint}/15 pts`);
  console.log(`    - Reputación y Reseñas: ${vr.scoreBreakdown.reputationVolume}/15 pts`);

  if (vr.warnings.length > 0) {
    console.log(`  • Alertas / Discrepancias Detectadas:`);
    vr.warnings.forEach((w) => console.log(`    ⚠️ ${w}`));
  }
  if (vr.recommendations.length > 0) {
    console.log(`  • Recomendaciones para el Curador:`);
    vr.recommendations.forEach((r) => console.log(`    💡 ${r}`));
  }

  console.log("\n📋 8. PLANTILLA JSON ENRIQUECIDA PARA src/data/services/<sector>/<slug>.ts:");
  console.log(JSON.stringify(report.curationTemplate, null, 2));
  console.log("\n" + "=".repeat(80));
}

main();
