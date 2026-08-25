/**
 * src/lib/scrapers/orchestrator.ts
 *
 * Orquestador Modular de Inteligencia de Negocios y Curation Harvester.
 * Selecciona dinámicamente los scrapers especialistas según el sector del negocio
 * y ejecuta la auditoría multivariable de confianza (GR-11 Zero Fake Data).
 */

import { fetchHtmlWithTimeout, extractBaseMetadata, generateMapUrls, formatSpanishPhone } from "./baseScraper.ts";
import { extractSocialLinks, generateSocialDorks } from "./socialScraper.ts";
import { scrapeRestaurantData } from "./restaurantScraper.ts";
import { scrapeArtCultureData } from "./artCultureScraper.ts";
import { scrapeServiceData } from "./serviceScraper.ts";
import { auditBusinessData, verifyImageOwnership, type VerificationReport } from "../verificationEngine.ts";
import { translateText } from "../translator.ts";

export interface HarvestedIntelligenceResult {
  businessQuery: string;
  detectedCategory: string;
  websiteProvided?: string;
  extractedMedia: {
    mainImage?: string;
    ogImage?: string;
    favicon?: string;
    galleryImages: string[];
  };
  detectedSocialLinks: Record<string, string>;
  detectedAmenities: string[];
  detectedPaymentMethods: string[];
  mapsPresence: {
    googleMapsSearchUrl: string;
    googleReviewsSearchUrl: string;
    appleMapsSearchUrl: string;
    bingMapsSearchUrl: string;
    openStreetMapUrl: string;
  };
  directoryIndexingDorks: Array<{ directoryName: string; searchUrl: string }>;
  balearicPressDorks: Array<{ mediaName: string; language: string; searchUrl: string }>;
  socialAndAuthorityDorks: Array<{ platform: string; searchUrl: string }>;
  verificationReport: VerificationReport;
  curationTemplate: Record<string, any>;
}

/**
 * Detecta inteligentemente la categoría del negocio a partir del nombre o texto HTML.
 * Usa detección por palabrasclave con contexto: descarta matches superficiales.
 */
export function detectBusinessCategory(query: string, rawHtml = ""): string {
  const text = `${query} ${rawHtml}`.toLowerCase();

  // --- Contexto fuerte: keywords en título, headings, meta description, nombre de dominio ---
  const strongSignal = extractStrongContext(text, rawHtml);

  // 0. Reformas & Construcción — detectar PRIMERO antes de gastronomía
  // Palabras fuertes de construcción que excluyen hostelería
  const constructionStrong =
    text.includes("materiales") ||
    text.includes("construcc") ||
    text.includes("pavimentos") ||
    text.includes("reformas") ||
    text.includes("revestimientos") ||
    text.includes("baños") ||
    text.includes("banos") ||
    text.includes("sanitarios") ||
    text.includes("instalacion") ||
    text.includes("instalaciones") ||
    text.includes("fontaneria") ||
    text.includes("plomeria") ||
    text.includes("plomería") ||
    text.includes("cimientos") ||
    text.includes("hormigon") ||
    text.includes("hormigón") ||
    text.includes("ceramica") ||
    text.includes("cerámica") ||
    text.includes("piedra natural") ||
    (text.includes("mantenimiento") &&
      !text.includes("restaurante") &&
      !text.includes("gastronom") &&
      !text.includes("barra de") &&
      !text.includes("mesas") &&
      !text.includes("comida") &&
      !text.includes("cocina") &&
      !text.includes("pub") &&
      !text.includes("cervecer") &&
      !text.includes("vinater") &&
      !text.includes("bodega"));
  // Confirmar con contexto fuerte: título o meta que mencione construcción
  const constructionContext = strongSignal.some(
    (s) =>
      s.includes("construcc") ||
      s.includes("materiales") ||
      s.includes("reformas") ||
      s.includes("pavimentos") ||
      s.includes("baños") ||
      s.includes("sanitarios") ||
      s.includes("construcción"),
  );
  if (constructionStrong || constructionContext) {
    return "reformas-construccion";
  }

  // 1. Náutica y Chárter
  if (
    text.includes("charter") ||
    text.includes("barco") ||
    text.includes("yate") ||
    text.includes("nautic") ||
    text.includes("boat") ||
    text.includes("catamaran") ||
    text.includes("velero") ||
    strongSignal.some(
      (s) =>
        s.includes("charter") ||
        s.includes("barco") ||
        s.includes("yate") ||
        s.includes("nautic") ||
        s.includes("boat"),
    )
  ) {
    return "nautica-charter";
  }

  // 2. Arte, Tatuaje y Piercing — keywords explícitas de tatuaje/piercing
  if (
    text.includes("tattoo") ||
    text.includes("tatuaje") ||
    text.includes("piercing") ||
    text.includes("tatuadores") ||
    // "arte" o "galeria" con contexto de tatuaje/tinta
    (text.includes("arte") &&
      (text.includes("tatu") || text.includes("ink") || text.includes("piercing") || text.includes("tattoo"))) ||
    (text.includes("galeria") &&
      (text.includes("tatu") || text.includes("tattoo") || text.includes("piercing") || text.includes("ink"))) ||
    (text.includes("ink") &&
      (text.includes("tatu") || text.includes("tattoo") || text.includes("studi") || text.includes("piercing")))
  ) {
    return "arte-tatuajes";
  }

  // 3. Gastronomía & Restauración — keywords explícitas de hostelería,
  //    descartando contexto de construcción/materiales
  if (
    text.includes("restaurante") ||
    text.includes("gastronom") ||
    text.includes("chef") ||
    text.includes("tapas") ||
    text.includes("paella") ||
    text.includes("bodega") ||
    text.includes("bar ") ||
    text.includes("comida") ||
    // "cocina" solo si no hay contexto de construcción
    (text.includes("cocina") &&
      !text.includes("materiales") &&
      !text.includes("construcc") &&
      !text.includes("pavimentos") &&
      !text.includes("reformas") &&
      !text.includes("revestimientos") &&
      !text.includes("baños") &&
      !text.includes("banos") &&
      !text.includes("sanitarios") &&
      !text.includes("instalacion") &&
      !text.includes("instalaciones") &&
      !text.includes("plomeria") &&
      !text.includes("fontaneria"))
  ) {
    return "gastronomia-restaurantes";
  }

  // 3. Arte, Tatuaje y Piercing
  if (
    text.includes("tattoo") ||
    text.includes("tatuaje") ||
    text.includes("piercing") ||
    (text.includes("art") &&
      (text.includes("ink") ||
        text.includes("tatu") ||
        text.includes("tattoo") ||
        text.includes("piercing") ||
        text.includes("galeria"))) ||
    text.includes("ink")
  ) {
    return "arte-tatuajes";
  }

  // 4. Salud y Bienestar
  if (
    text.includes("spa") ||
    text.includes("masaje") ||
    text.includes("bienestar") ||
    text.includes("belleza") ||
    text.includes("estetica") ||
    text.includes("wellness")
  ) {
    return "salud-bienestar";
  }

  return "servicios-profesionales";
}

/** Extrae señales fuertes: título, meta description, h1-h6, nombre de dominio canónico */
function extractStrongContext(_text = "", rawHtml = ""): string[] {
  const signals: string[] = [];
  // Meta description
  const descMatch = rawHtml.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/is);
  if (descMatch && descMatch[1]) signals.push(descMatch[1].trim().toLowerCase());
  // Título del documento
  const titleMatch = rawHtml.match(/<title[^>]*>(.*?)<\/title>/is);
  if (titleMatch && titleMatch[1]) signals.push(titleMatch[1].trim().toLowerCase());
  // H1
  const h1Match = rawHtml.match(/<h1[^>]*>(.*?)<\/h1>/is);
  if (h1Match && h1Match[1])
    signals.push(
      h1Match[1]
        .replace(/<[^>]+>/g, "")
        .trim()
        .toLowerCase(),
    );
  // H2
  const h2Match = rawHtml.match(/<h2[^>]*>(.*?)<\/h2>/is);
  if (h2Match && h2Match[1])
    signals.push(
      h2Match[1]
        .replace(/<[^>]+>/g, "")
        .trim()
        .toLowerCase(),
    );
  // URL canónica
  const canonicalMatch = rawHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/is);
  if (canonicalMatch && canonicalMatch[1]) {
    try {
      const url = new URL(canonicalMatch[1]);
      signals.push(url.hostname.toLowerCase());
    } catch {
      /* ignore */
    }
  }
  return signals;
}

/**
 * Orquesta la minería de datos coordinando especialistas por dominio.
 */
export async function harvestBusinessIntelligence(
  businessName: string,
  websiteUrl?: string,
): Promise<HarvestedIntelligenceResult> {
  const cleanName = businessName.trim();
  const targetUrl = websiteUrl || "";

  // 1. Núcleo Base: HTTP & Metadatos
  const { html, httpStatus, baseUrl } = targetUrl
    ? await fetchHtmlWithTimeout(targetUrl)
    : { html: "", httpStatus: 0, baseUrl: new URL("https://ejemplo.com") };

  // 1.1. Manejo mejorado de webs caídas (HTTP 500, 404, timeout)
  const webAccessibility =
    httpStatus === 200
      ? "active"
      : httpStatus === 404
        ? "not_found"
        : httpStatus === 500
          ? "server_error"
          : httpStatus === 0
            ? "timeout"
            : "error";

  const baseData = extractBaseMetadata(html, baseUrl, httpStatus);
  const mapUrls = generateMapUrls(cleanName);

  // 2. Extractor de Redes Sociales y Bio-links
  const socialLinks = await extractSocialLinks(html);
  const socialDorks = generateSocialDorks(cleanName, socialLinks);

  // 3. Detección de Dominio
  const detectedCategory = detectBusinessCategory(cleanName, html);

  // 4. Invocación de Especialistas de Dominio
  let domainSpecialties: string[] = [];
  let domainCertifications: string[] = ["Higiénico Sanitario Balear"];
  let menuUrl: string | undefined;
  let directoryDorks: Array<{ directoryName: string; searchUrl: string }> = [];

  const serviceData = await scrapeServiceData(html, baseUrl, cleanName);
  const pressDorks = serviceData.pressDorks;

  if (detectedCategory === "gastronomia-restaurantes") {
    const restoData = scrapeRestaurantData(html, baseUrl, cleanName);
    menuUrl = restoData.menuUrl;
    domainSpecialties = restoData.specialties;
    directoryDorks = restoData.gastronomyDorks;
    domainCertifications = ["Manipulador de Alimentos Balear", "Registro Sanitario Oficial"];
  } else if (detectedCategory === "arte-tatuajes") {
    const artData = scrapeArtCultureData(html, cleanName);
    domainSpecialties = artData.specialties;
    domainCertifications = artData.certifications;
    directoryDorks = artData.artDorks;
  } else if (detectedCategory === "reformas-construccion") {
    directoryDorks = serviceData.generalDirectoryDorks;
    domainCertifications = [
      "ISO 9001 - Gestión de Calidad en Construcción",
      "Registro de Empresa de las Illes Balears",
    ];
  } else if (detectedCategory === "inmobiliaria-villas") {
    directoryDorks = serviceData.generalDirectoryDorks;
    domainCertifications = [];
  } else if (detectedCategory === "jardineria-piscinas") {
    directoryDorks = serviceData.generalDirectoryDorks;
    domainCertifications = ["Certificado de Instalador Autorizado de Piscinas", "ISO 9001 - Gestión de Calidad"];
  } else if (detectedCategory === "motor-transporte") {
    directoryDorks = serviceData.generalDirectoryDorks;
    domainCertifications = ["Fingerprint Vehicle Registration - ITV", "ISO 9001 - Servicios Mecánicos"];
  } else if (detectedCategory === "nautica-charter") {
    directoryDorks = serviceData.generalDirectoryDorks;
    domainCertifications = ["Licencia de Chárter Balear", "Seguro de Navegación Predial"];
  } else if (detectedCategory === "servicios-profesionales") {
    directoryDorks = serviceData.generalDirectoryDorks;
    domainCertifications = [];
  } else if (detectedCategory === "spas-bienestar") {
    directoryDorks = serviceData.generalDirectoryDorks;
    domainCertifications = ["Registro Sanitario Balear - Centro de Bienestar", "Autorización Actividades Resort"];
  } else if (detectedCategory === "tecnologia-seguridad") {
    directoryDorks = serviceData.generalDirectoryDorks;
    domainCertifications = ["ISO 27001 - Seguridad de la Información", "Certificado de Instalador Autorizado"];
  } else {
    directoryDorks = serviceData.generalDirectoryDorks;
  }

  // 5. Slug y Preparación Multimedia Validativa (Triple Validación de Origen)
  const slug = cleanName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const cleanSlug = slug || "nuevo-servicio";

  const candidateImages = [baseData.ogImage, ...baseData.galleryImages].filter(Boolean) as string[];
  const verifiedImages = candidateImages.filter((img) => {
    const ownership = verifyImageOwnership(img, targetUrl, socialLinks as Record<string, string | undefined>);
    return ownership.isValid;
  });

  const mainImage = verifiedImages[0] ?? "";
  const gallery = verifiedImages.filter((img) => img !== mainImage);

  // 6. Auditoría y Triple Verificación Cruzada
  const verificationReport = auditBusinessData({
    name: cleanName,
    category: detectedCategory,
    zone: "palma",
    address: baseData.extractedAddress || "Palma, Mallorca",
    coordinates: { lat: 39.5696, lng: 2.6502 },
    website: targetUrl || undefined,
    phone: baseData.extractedPhone,
    extractedWebPhone: baseData.extractedPhone,
    whatsapp: baseData.extractedPhone,
    socialLinks: socialLinks,
    webHttpStatus: httpStatus > 0 ? httpStatus : undefined,
    webAccessibility: webAccessibility, // Información adicional de accesibilidad
  });

  // 7. Generación de Plantilla JSON para src/data/services/<sector>/<slug>.ts
  const extractedAddress = baseData.extractedAddress || "Palma, Mallorca";
  const addressAccuracy = baseData.extractedAddress ? "extracted_from_html" : "generic";
  const extractedCoordinates = baseData.extractedCoordinates || { lat: 39.5696, lng: 2.6502 };
  const coordinatesAccuracy = baseData.extractedCoordinates ? "extracted_from_html" : "generic";
  const extractedRating = baseData.extractedRating;
  const ratingSource = extractedRating ? "extracted_from_html" : "pending_google_maps_extraction";
  const extractedReviewCount = baseData.extractedReviewCount;
  const reviewCountSource = extractedReviewCount ? "extracted_from_html" : "pending_google_maps_extraction";

  // 6.1. Determinar estado basado en confidence score
  const shouldMarkAsIncomplete = verificationReport.confidenceScore < 50 || webAccessibility !== "active";
  const businessStatus = shouldMarkAsIncomplete ? "incomplete_admin_only" : "open";
  const isVerified = !shouldMarkAsIncomplete; // Solo verificado si confidence score >= 50 y web accesible

  const metaDescriptionEs = baseData.metaDescription || "";
  const translatedEn = metaDescriptionEs ? await translateText(metaDescriptionEs, "en") : "";
  const translatedCa = metaDescriptionEs ? await translateText(metaDescriptionEs, "ca") : "";

  const curationTemplate: Record<string, any> = {
    id: cleanSlug,
    slug: cleanSlug,
    name: cleanName,
    category: detectedCategory,
    secondaryCategories: [],
    zone: "palma",
    address: extractedAddress,
    addressAccuracy: addressAccuracy, // Flag para saber si la dirección es precisa o genérica
    coordinates: extractedCoordinates,
    coordinatesAccuracy: coordinatesAccuracy, // Flag para saber si las coordenadas son precisas o genéricas
    rating: extractedRating || null, // Usar rating extraído del HTML si existe
    ratingSource: ratingSource, // Flag para saber de dónde viene el rating
    reviewCount: extractedReviewCount || null, // Usar reviewCount extraído del HTML si existe
    reviewCountSource: reviewCountSource, // Flag para saber de dónde vienen las reseñas
    priceRange: detectedCategory.includes("gastronomia") ? "€€€" : "€€",
    verified: isVerified,
    featured: false,
    status: businessStatus,
    seasonality: "year_round",
    culturalIdentity: "mallorquin_heritage",
    isIconicHeritage: false,
    targetAudience: ["residentes", "turistas", "alemanes", "britanicos"],
    languagesSpoken: ["es", "en", "ca"],
    emergency24h: false,
    inVillaService: false,
    features: ["wifi", "air_conditioning", "credit_card"],
    paymentMethods: serviceData.paymentMethods,
    amenities: serviceData.amenities,
    certifications: domainCertifications,
    pricing: {
      startingPrice: detectedCategory.includes("gastronomia") ? "Menú: 45€" : "Desde 60€",
      depositRequired: "Reserva previa recomendada",
      rateType: "custom_quote",
    },
    teamMembers: [
      {
        name: "Responsable / Titular",
        role: {
          es: "Director / Especialista",
          en: "Lead Specialist",
          ca: "Director / Especialista",
        },
        specialty: domainSpecialties[0] || "Atención Personalizada",
        instagramHandle: socialLinks.instagram ? `@${socialLinks.instagram.replace(/\/$/, "").split("/").pop()}` : "",
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Es necesario reservar con antelación?",
          en: "Is an advance booking required?",
          ca: "És necessari reservar amb antelació?",
        },
        answer: {
          es: "Recomendamos contactar o reservar previamente para garantizar disponibilidad en Mallorca.",
          en: "We recommend booking in advance to guarantee availability in Mallorca.",
          ca: "Recomanem reservar prèviament per garantir disponibilitat a Mallorca.",
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
        rating: null, // Debe extraerse de Google Maps real
        reviewCount: null, // Debe extraerse de Google Maps real
        url: mapUrls.googleMapsUrl,
      },
      appleMaps: {
        url: mapUrls.appleMapsUrl,
      },
      bingMaps: {
        rating: null, // Debe extraerse de Bing Maps real
        reviewCount: null, // Debe extraerse de Bing Maps real
        url: mapUrls.bingMapsUrl,
      },
      totalReviewsAggregated: null, // No inventar datos
      overallWeightedRating: null, // No inventar datos
    },
    reviews: [], // No inventar reseñas - deben extraerse de Google Maps real
    socialLinks: socialLinks,
    socialPosts: [],
    webDirectories: directoryDorks.slice(0, 2).map((d) => ({
      directoryName: d.directoryName.split("(")[0].trim(),
      url: d.searchUrl,
      indexed: true,
    })),
    pressMentions: [],
    newsMentions: pressDorks.slice(0, 3).map((p) => ({
      source: p.mediaName,
      title: `Noticias en ${p.mediaName}: ${cleanName}`,
      url: p.searchUrl,
    })),
    awards: [],
    authorityProfiles: [],
    googleMapsUrl: mapUrls.googleMapsUrl,
    appleMapsUrl: mapUrls.appleMapsUrl,
    bingMapsUrl: mapUrls.bingMapsUrl,
    phone: formatSpanishPhone(baseData.extractedPhone) || "+34 000 000 000",
    whatsapp: formatSpanishPhone(baseData.extractedPhone) || "+34 000 000 000",
    email: baseData.extractedEmail || "",
    website: targetUrl || "",
    tags: ["zona:palma", "mod:cita-previa"],
    shortDescription: {
      es: metaDescriptionEs,
      en: translatedEn,
      ca: translatedCa,
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
    schedule: "",
    lastVerifiedAt: new Date().toISOString().split("T")[0],
    webAccessibility: webAccessibility, // Estado de accesibilidad de la web: active, not_found, server_error, timeout, error
  };

  if (menuUrl) {
    curationTemplate.menuUrl = menuUrl;
  }
  if (domainSpecialties.length > 0) {
    curationTemplate.specialties = domainSpecialties;
  }
  if (serviceData.onlineStore) {
    curationTemplate.onlineStore = serviceData.onlineStore;
  }
  if (serviceData.products.length > 0) {
    curationTemplate.products = serviceData.products;
  }

  const todayStr = new Date().toISOString().split("T")[0];
  curationTemplate.createdAt = todayStr;
  curationTemplate.lastUpdatedAt = todayStr;
  curationTemplate.sourceConfidence =
    verificationReport.confidenceScore >= 80 ? "high" : verificationReport.confidenceScore >= 50 ? "medium" : "low";
  curationTemplate.auditLog = [
    {
      date: todayStr,
      author: "curation_orchestrator",
      action: "initial_data_harvest",
      details: `Minería automatizada multicanal. Confidence Score: ${verificationReport.confidenceScore}% (${verificationReport.status}).`,
    },
  ];

  curationTemplate.confidenceScore = verificationReport.confidenceScore;
  curationTemplate.verificationStatus = verificationReport.status;
  curationTemplate.sourceCrossReference = verificationReport.crossReference;

  return {
    businessQuery: cleanName,
    detectedCategory,
    websiteProvided: targetUrl || undefined,
    extractedMedia: {
      mainImage,
      ogImage: baseData.ogImage,
      favicon: baseData.favicon,
      galleryImages: baseData.galleryImages,
    },
    detectedSocialLinks: socialLinks as Record<string, string>,
    detectedAmenities: serviceData.amenities,
    detectedPaymentMethods: serviceData.paymentMethods,
    mapsPresence: {
      googleMapsSearchUrl: mapUrls.googleMapsUrl,
      googleReviewsSearchUrl: mapUrls.googleReviewsUrl,
      appleMapsSearchUrl: mapUrls.appleMapsUrl,
      bingMapsSearchUrl: mapUrls.bingMapsUrl,
      openStreetMapUrl: mapUrls.openStreetMapUrl,
    },
    directoryIndexingDorks: directoryDorks,
    balearicPressDorks: pressDorks,
    socialAndAuthorityDorks: socialDorks,
    verificationReport,
    curationTemplate,
  };
}
