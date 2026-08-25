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
    addressInMallorca: boolean;
    activeWeb200Ok: boolean;
    socialMatchScore: number;
  };
  warnings: string[];
  recommendations: string[];
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

  // 1. Verificación Telefónica (Max 25 pts)
  const webPhoneMatch = Boolean(mainPhone && webPhone && arePhonesMatching(mainPhone, webPhone));
  const mapsPhoneMatch = Boolean(mainPhone && mapsPhone && arePhonesMatching(mainPhone, mapsPhone));

  if (mainPhone) {
    if (webPhoneMatch && mapsPhoneMatch) {
      phoneScore = 25; // Triple coincidencia perfecta
    } else if (webPhoneMatch || mapsPhoneMatch) {
      phoneScore = 20; // Doble coincidencia
    } else if (webPhone && mapsPhone && arePhonesMatching(webPhone, mapsPhone)) {
      phoneScore = 15;
      warnings.push("El teléfono principal difiere del encontrado en Web y Maps.");
    } else {
      phoneScore = 10;
      if (webPhone || mapsPhone) {
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
    if (input.webHttpStatus === 200 || input.webHttpStatus === undefined) {
      webScore = 20;
      activeWeb200Ok = true;
    } else if (input.webHttpStatus >= 300 && input.webHttpStatus < 400) {
      webScore = 15; // Redirección
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

  const confidenceScore = Math.min(100, phoneScore + geoScore + webScore + socialScore + repScore);

  let status: "verified" | "needs_manual_review" | "pending_audit" = "pending_audit";
  if (confidenceScore >= 80 && !warnings.some((w) => w.includes("Discrepancia"))) {
    status = "verified";
  } else if (confidenceScore >= 50 || warnings.length > 0) {
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
      addressInMallorca,
      activeWeb200Ok,
      socialMatchScore: socialScore,
    },
    warnings,
    recommendations,
  };
}
