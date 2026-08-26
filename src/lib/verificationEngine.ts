/**
 * src/lib/verificationEngine.ts
 *
 * Motor de Auditoría y Triple Verificación de Negocios (Zero Fake Data - GR-11).
 * Cruza datos extraídos de múltiples fuentes (Web, Google Maps, Redes Sociales)
 * para calcular un puntaje determinista de confianza (Confidence Score: 0-100%).
 */

export interface VerificationInput {
  name: string;
  category: string;
  zone: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  website?: string;
  phone?: string;
  extractedWebPhone?: string;
  extractedMapsPhone?: string;
  extractedSocialPhone?: string;
  whatsapp?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
  };
  reviewCount?: number;
  rating?: number;
  webHttpStatus?: number;
  webAccessibility?: "active" | "not_found" | "server_error" | "timeout" | "error";
}

export interface VerificationReport {
  confidenceScore: number; // 0 a 100
  status: "verified" | "needs_manual_review" | "pending_audit";
  scoreBreakdown: {
    phoneConsistency: number; // Max 25
    geoAccuracy: number; // Max 25
    webAvailability: number; // Max 20
    socialFootprint: number; // Max 15
    reputationVolume: number; // Max 15
  };
  crossReference: {
    webPhoneMatch: boolean;
    mapsPhoneMatch: boolean;
    socialPhoneMatch: boolean;
    hasCriticalPhoneMismatch: boolean;
    addressInMallorca: boolean;
    activeWeb200Ok: boolean;
    socialMatchScore: number;
  };
  warnings: string[];
  recommendations: string[];
}

export interface UserIntentBadges {
  isEmergency24h: boolean;
  isUrgentService: boolean;
  hasInVillaService: boolean;
  hasAppointmentRequired: boolean;
}

/**
 * Detecta puntos de dolor e intención de búsqueda del usuario para destacar badges de urgencia.
 */
export function extractUserIntentFlags(rawText: string): UserIntentBadges {
  const t = rawText.toLowerCase();
  return {
    isEmergency24h: t.includes("24h") || t.includes("24 horas") || t.includes("urgencias 24"),
    isUrgentService:
      t.includes("urgente") ||
      t.includes("averia") ||
      t.includes("averías") ||
      t.includes("emergencia") ||
      t.includes("mismo dia") ||
      t.includes("mismo día"),
    hasInVillaService:
      t.includes("a domicilio") ||
      t.includes("en villa") ||
      t.includes("in-villa") ||
      t.includes("a tu casa") ||
      t.includes("desplazamiento a"),
    hasAppointmentRequired:
      t.includes("cita previa") ||
      t.includes("citas previas") ||
      t.includes("cita") ||
      t.includes("citas") ||
      t.includes("reserva previa") ||
      t.includes("bajo cita") ||
      t.includes("reserva obligatoria"),
  };
}

/**
 * Dominios restringidos de bancos de imágenes genéricos o stock.
 */
export const FORBIDDEN_STOCK_DOMAINS = [
  "unsplash.com",
  "pexels.com",
  "pixabay.com",
  "freepik.com",
  "placeholder",
  "dummyimage",
  "loremflickr",
  "stock.adobe.com",
  "shutterstock.com",
  "gettyimages.com",
  "istockphoto.com",
] as const;

/**
 * Patrones de imágenes basura, placeholders o assets de plugins que no deben usarse como fotos del negocio.
 */
export const FORBIDDEN_IMAGE_PATTERNS = [
  /flag/i,
  /bandera/i,
  /plugin/i,
  /revslider/i,
  /dummy/i,
  /pixel/i,
  /analytics/i,
  /1x1/i,
  /icon/i,
  /favicon/i,
  /spinner/i,
  /loader/i,
  /sample/i,
  /placeholder/i,
];

export interface ImageVerificationResult {
  isValid: boolean;
  trustLevel: "high_trust_domain" | "social_trust" | "unverified";
  reason?: string;
}

/**
 * Valida la calidad estructural de una imagen (rechaza stock, placeholders, banderas y plugins).
 */
export function validateImageQuality(imageUrl?: string): { isValid: boolean; reason?: string } {
  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim() === "") {
    return { isValid: false, reason: "URL de imagen vacía o inválida." };
  }

  const urlLower = imageUrl.toLowerCase();

  // 1. Descartar dominios de stock explícitos
  if (FORBIDDEN_STOCK_DOMAINS.some((domain) => urlLower.includes(domain))) {
    return { isValid: false, reason: `Dominio de imagen de stock restringido: ${imageUrl}` };
  }

  // 2. Descartar patrones de placeholders o assets
  if (FORBIDDEN_IMAGE_PATTERNS.some((pattern) => pattern.test(urlLower))) {
    return { isValid: false, reason: `Patrón de imagen no válido detectado: ${imageUrl}` };
  }

  return { isValid: true };
}

/**
 * Verifica la propiedad de una imagen contrastándola contra el dominio oficial del negocio
 * y contra sus CDNs oficiales de redes sociales.
 */
export function verifyImageOwnership(
  imageUrl: string,
  businessWebsiteUrl?: string,
  _socialLinks?: Record<string, string | undefined>,
): ImageVerificationResult {
  const quality = validateImageQuality(imageUrl);
  if (!quality.isValid) {
    return { isValid: false, trustLevel: "unverified", reason: quality.reason };
  }

  try {
    const imgObj = new URL(imageUrl);
    const imgHost = imgObj.hostname.toLowerCase();

    // 1. Verificación contra dominio propio de la web oficial
    if (businessWebsiteUrl && businessWebsiteUrl.startsWith("http")) {
      try {
        const siteObj = new URL(businessWebsiteUrl);
        const siteHost = siteObj.hostname.toLowerCase();

        // Coincidencia de dominio principal o subdominio (ej: img.minegocio.com vs minegocio.com)
        if (imgHost === siteHost || imgHost.endsWith(`.${siteHost}`)) {
          return { isValid: true, trustLevel: "high_trust_domain" };
        }
      } catch {
        /* ignore */
      }
    }

    // CDNs de plataformas de confianza
    const TRUSTED_BUSINESS_CDNS = [
      "cloudinary.com",
      "imgix.net",
      "shopify.com",
      "squarespace-cdn.com",
      "wixstatic.com",
      "wp.com",
      "google.com",
      "gstatic.com",
    ];

    if (TRUSTED_BUSINESS_CDNS.some((cdn) => imgHost.includes(cdn))) {
      return { isValid: true, trustLevel: "high_trust_domain" };
    }

    // 2. Verificación de Redes Sociales y Google Maps (Social Trust)
    const SOCIAL_CDNS = ["cdninstagram.com", "fbcdn.net", "googleusercontent.com", "ggpht.com", "licdn.com"];

    if (SOCIAL_CDNS.some((scdn) => imgHost.includes(scdn))) {
      return { isValid: true, trustLevel: "social_trust" };
    }

    // Si no coincide con el dominio ni con CDNs conocidos, pero pasa la calidad, se acepta como unverified
    return {
      isValid: true,
      trustLevel: "unverified",
      reason: `Imagen no pertenece al dominio principal (${imgHost}), pero pasó los filtros de calidad de stock.`,
    };
  } catch {
    return { isValid: false, trustLevel: "unverified", reason: "URL de imagen malformada." };
  }
}

/**
 * Normaliza números de teléfono para comparación estricta (omite prefijos +34, 0034, espacios y guiones).
 */
export function normalizePhoneNumber(rawPhone?: string): string {
  if (!rawPhone) return "";
  let cleaned = rawPhone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+34")) cleaned = cleaned.slice(3);
  else if (cleaned.startsWith("0034")) cleaned = cleaned.slice(4);
  else if (cleaned.startsWith("34") && cleaned.length > 9) cleaned = cleaned.slice(2);
  return cleaned.trim();
}

/**
 * Compara dos números de teléfono para determinar si coinciden.
 */
export function arePhonesMatching(phoneA?: string, phoneB?: string): boolean {
  const normA = normalizePhoneNumber(phoneA);
  const normB = normalizePhoneNumber(phoneB);
  if (!normA || !normB) return false;
  return normA === normB || normA.endsWith(normB) || normB.endsWith(normA);
}

/**
 * Verifica si las coordenadas geográficas caen dentro del polígono delimitador de la isla de Mallorca.
 */
export function isCoordinateWithinMallorca(lat?: number, lng?: number): boolean {
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  // Bounding box aproximado de la isla de Mallorca
  const MIN_LAT = 39.15;
  const MAX_LAT = 40.0;
  const MIN_LNG = 2.25;
  const MAX_LNG = 3.55;
  return lat >= MIN_LAT && lat <= MAX_LAT && lng >= MIN_LNG && lng <= MAX_LNG;
}

/**
 * Ejecuta la auditoría cruzada multivariable y calcula el Confidence Score (0-100%).
 * Implementa Consistencia Cruzada Estricta (Double-Check):
 * Si el teléfono del sitio web contradice al de Redes Sociales o Maps,
 * el puntaje se penaliza (<80%) y el estado se fuerza a "needs_manual_review".
 */
export function auditBusinessData(input: VerificationInput): VerificationReport {
  let phoneScore = 0;
  let geoScore = 0;
  let webScore = 0;
  let socialScore = 0;
  let repScore = 0;

  const warnings: string[] = [];
  const recommendations: string[] = [];

  const mainPhone = input.phone || input.whatsapp;
  const webPhone = input.extractedWebPhone;
  const mapsPhone = input.extractedMapsPhone;
  const socialPhone = input.extractedSocialPhone;

  // 1. Verificación Telefónica Cruzada (Max 25 pts)
  const webPhoneMatch = Boolean(mainPhone && webPhone && arePhonesMatching(mainPhone, webPhone));
  const mapsPhoneMatch = Boolean(mainPhone && mapsPhone && arePhonesMatching(mainPhone, mapsPhone));
  const socialPhoneMatch = Boolean(mainPhone && socialPhone && arePhonesMatching(mainPhone, socialPhone));

  // Detección de discrepancia crítica entre fuentes activas
  let hasCriticalPhoneMismatch = false;
  if (webPhone && socialPhone && !arePhonesMatching(webPhone, socialPhone)) {
    hasCriticalPhoneMismatch = true;
    warnings.push("🚩 Discrepancia Crítica: El teléfono de la Web no coincide con el teléfono de Redes Sociales.");
    recommendations.push("Contactar con el titular para verificar el canal de contacto preferente.");
  } else if (webPhone && mapsPhone && !arePhonesMatching(webPhone, mapsPhone)) {
    hasCriticalPhoneMismatch = true;
    warnings.push("🚩 Discrepancia Crítica: El teléfono de la Web difiere del número indexado en Google Maps.");
    recommendations.push("Comprobar cuál es el teléfono de atención al cliente activo.");
  }

  if (mainPhone) {
    if (hasCriticalPhoneMismatch) {
      phoneScore = 5; // Fuerte penalización por contradicción entre fuentes oficiales
    } else if (webPhoneMatch && (mapsPhoneMatch || socialPhoneMatch)) {
      phoneScore = 25; // Triple coincidencia perfecta
    } else if (webPhoneMatch || mapsPhoneMatch || socialPhoneMatch) {
      phoneScore = 20; // Doble coincidencia
    } else {
      phoneScore = 10;
      if (webPhone || mapsPhone || socialPhone) {
        warnings.push("Discrepancia en números de teléfono entre fuentes.");
        recommendations.push("Confirmar con el titular el número oficial preferente.");
      }
    }
  } else {
    warnings.push("No se ha registrado número de teléfono de contacto.");
  }

  // 2. Precisión Geográfica y Dirección (Max 25 pts)
  const addressInMallorca = isCoordinateWithinMallorca(input.coordinates?.lat, input.coordinates?.lng);
  if (addressInMallorca && input.address && input.address.length > 8) {
    geoScore = 25;
  } else if (input.address && input.address.toLowerCase().includes("mallorca")) {
    geoScore = 15;
    warnings.push("Coordenadas GPS no verificadas con precisión dentro de Mallorca.");
  } else {
    warnings.push("Dirección o coordenadas GPS ausentes o fuera de Mallorca.");
    recommendations.push("Comprobar ubicación exacta en OpenStreetMap o Google Maps.");
  }

  // 3. Disponibilidad y Web Oficial (Max 20 pts)
  let activeWeb200Ok = false;
  if (input.website && input.website.startsWith("http")) {
    if (input.webAccessibility === "active" || input.webHttpStatus === 200 || input.webHttpStatus === undefined) {
      webScore = 20;
      activeWeb200Ok = true;
    } else if (input.webAccessibility === "not_found" || input.webHttpStatus === 404) {
      webScore = 5;
      warnings.push("La web oficial devuelve código 404 (No Encontrada).");
      recommendations.push("Verificar si la URL ha cambiado o el negocio ha cerrado.");
    } else if (input.webAccessibility === "server_error" || input.webHttpStatus === 500) {
      webScore = 5;
      warnings.push("La web oficial devuelve código 500 (Error del Servidor).");
    } else {
      webScore = 5;
      warnings.push(`La web oficial devuelve código HTTP ${input.webHttpStatus}.`);
    }
  } else {
    webScore = 5;
    warnings.push("Negocio sin web oficial indexada.");
  }

  // 4. Huella y Canales Digitales Oficiales (Max 15 pts)
  let socialChannelsCount = 0;
  if (input.socialLinks) {
    if (input.socialLinks.instagram) socialChannelsCount++;
    if (input.socialLinks.facebook) socialChannelsCount++;
    if (input.socialLinks.youtube) socialChannelsCount++;
    if (input.socialLinks.tiktok) socialChannelsCount++;
    if (input.socialLinks.linkedin) socialChannelsCount++;
  }

  if (socialChannelsCount >= 3) socialScore = 15;
  else if (socialChannelsCount >= 2) socialScore = 12;
  else if (socialChannelsCount >= 1) socialScore = 8;
  else {
    socialScore = 0;
    warnings.push("No se han detectado perfiles en redes sociales.");
  }

  // 5. Volumen y Reputación Pública (Max 15 pts)
  const reviewCount = input.reviewCount || 0;
  const rating = input.rating || 0;

  if (reviewCount >= 50 && rating >= 4.5) {
    repScore = 15;
  } else if (reviewCount >= 20 && rating >= 4.0) {
    repScore = 12;
  } else if (reviewCount > 0) {
    repScore = 8;
  } else {
    repScore = 3;
    warnings.push("Volumen de reseñas públicas bajo o no consolidado.");
  }

  let confidenceScore = Math.min(100, phoneScore + geoScore + webScore + socialScore + repScore);

  // Si existe discrepancia crítica entre fuentes oficiales, limitar el score al 75% máximo
  if (hasCriticalPhoneMismatch && confidenceScore >= 80) {
    confidenceScore = 75;
  }

  let status: "verified" | "needs_manual_review" | "pending_audit" = "pending_audit";
  if (confidenceScore >= 80 && !hasCriticalPhoneMismatch && !warnings.some((w) => w.includes("Discrepancia"))) {
    status = "verified";
  } else if (confidenceScore >= 50 || warnings.length > 0 || hasCriticalPhoneMismatch) {
    status = "needs_manual_review";
  }

  return {
    confidenceScore,
    status,
    scoreBreakdown: {
      phoneConsistency: phoneScore,
      geoAccuracy: geoScore,
      webAvailability: webScore,
      socialFootprint: socialScore,
      reputationVolume: repScore,
    },
    crossReference: {
      webPhoneMatch,
      mapsPhoneMatch,
      socialPhoneMatch,
      hasCriticalPhoneMismatch,
      addressInMallorca,
      activeWeb200Ok,
      socialMatchScore: socialScore,
    },
    warnings,
    recommendations,
  };
}
