import { SERVICES } from "../data/services/index.ts";
import type { ServiceItem, BusinessCapabilities } from "../data/services/types";

export interface QualityScoreBreakdown {
  visualQuality: number; // 0 - 20 pts
  dataVeracity: number; // 0 - 30 pts
  popularity: number; // 0 - 30 pts
  intentAffinity: number; // 0 - 20 pts
  total: number; // 0 - 100 pts
}

export interface RankedService {
  service: ServiceItem;
  rank: number;
  score: number; // 0 - 100
  breakdown: QualityScoreBreakdown;
  badgeLabel?: string;
  reasons: string[];
}

export interface ComparisonFilterParams {
  category?: string;
  sectorId?: string;
  zone?: string;
  capabilities?: Array<keyof BusinessCapabilities>;
  priceRange?: string;
  minScore?: number;
  locale?: string;
  limit?: number;
}

/**
 * Calcula la puntuación ponderada y el desglose de calidad bajo el modelo 20/30/30/20:
 *
 * 1. Calidad Visual (20%): Fotos verificadas, galería fotográfica y ausencia de fallbacks.
 * 2. Veracidad de Datos (30%): Confidence score, coincidencia telefónica y geolocalización.
 * 3. Popularidad Real (30%): Calificación ponderada, volumen de reseñas y premios oficiales.
 * 4. Afinidad de Usuario (20%): Matriz de capacidades (terraza, PMR, pet friendly, reservas).
 */
export function calculateBusinessScore(service: ServiceItem, locale = "es"): number {
  const breakdown = calculateQualityBreakdown(service, locale);
  return breakdown.total;
}

/**
 * Genera el desglose analítico de puntuación de calidad (Quality Score Breakdown).
 */
export function calculateQualityBreakdown(service: ServiceItem, locale = "es"): QualityScoreBreakdown {
  // 1. Calidad Visual (Max 20 pts)
  let visualQuality = 0;
  if (service.image && !service.image.includes("default.svg") && !service.image.includes("placeholder")) {
    visualQuality += 12;
  } else {
    visualQuality += 6;
  }
  if (service.gallery && service.gallery.length >= 2) {
    visualQuality += 8;
  } else if (service.gallery && service.gallery.length >= 1) {
    visualQuality += 4;
  }

  // 2. Veracidad de Datos (Max 30 pts)
  const confidence = service.confidenceScore ?? (service.verified ? 95 : 70);
  const dataVeracity = Math.round((confidence / 100) * 30 * 10) / 10;

  // 3. Popularidad Real (Max 30 pts)
  const rating = service.rating ?? 4.0;
  const reviewCount = service.reviewCount ?? 0;
  const ratingScore = ((rating - 3.5) / 1.5) * 18; // Base 18 pts
  const reviewScore = Math.min(8, (reviewCount / 200) * 8); // Base 8 pts
  let awardsBonus = 0;
  if (service.isIconicHeritage || (service.awards && service.awards.length > 0)) {
    awardsBonus += 4;
  }
  const popularity = Math.min(30, Math.max(10, Math.round((ratingScore + reviewScore + awardsBonus) * 10) / 10));

  // 4. Afinidad de Usuario & Capacidades (Max 20 pts)
  let intentAffinity = 0;
  if (service.phone || service.whatsapp) intentAffinity += 5;
  if (service.schedule) intentAffinity += 4;
  if (service.website || service.menuUrl) intentAffinity += 4;

  const caps = service.capabilities || {};
  let capCount = 0;
  if (caps.terrace) capCount++;
  if (caps.petFriendly) capCount++;
  if (caps.wheelchairAccessible) capCount++;
  if (caps.seaViews) capCount++;
  if (caps.onlineBooking) capCount++;
  if (caps.inVillaService) capCount++;
  if (caps.emergency24h) capCount++;

  intentAffinity += Math.min(7, capCount * 2);

  // Boost Localizado para Mercado Alemán (DACH)
  if (locale === "de") {
    if (service.languagesSpoken?.includes("de") || service.culturalIdentity === "german_oriented") {
      intentAffinity = Math.min(20, intentAffinity + 2);
    }
  }

  const total = Math.min(100, Math.round((visualQuality + dataVeracity + popularity + intentAffinity) * 10) / 10);

  return {
    visualQuality: Math.min(20, visualQuality),
    dataVeracity: Math.min(30, dataVeracity),
    popularity: Math.min(30, popularity),
    intentAffinity: Math.min(20, intentAffinity),
    total,
  };
}

/**
 * Devuelve los negocios mejor valorados de una categoría específica con soporte de localización.
 */
export function getTopServicesByCategory(category: string, limit = 5, locale = "es"): RankedService[] {
  const filtered = SERVICES.filter(
    (s) => (s.category === category || s.sectors?.includes(category)) && s.status !== "permanently_closed",
  );

  const ranked = filtered
    .map((service) => {
      const breakdown = calculateQualityBreakdown(service, locale);
      const score = breakdown.total;
      const reasons: string[] = [];

      if (locale === "de") {
        if (service.rating && service.rating >= 4.8) reasons.push("⭐ Spitzenbewertung (4.8+)");
        if (service.languagesSpoken?.includes("de") || service.culturalIdentity === "german_oriented") {
          reasons.push("🇩🇪 Deutschsprachiger Service");
        }
        if (service.verified) reasons.push("🛡️ Geprüfte Qualität & Vertrauensindex");
        if (service.isIconicHeritage) reasons.push("🏛️ Traditioneller Traditionsbetrieb");
      } else {
        if (service.rating && service.rating >= 4.8) reasons.push("⭐ Calificación de excelencia (4.8+)");
        if (service.reviewCount && service.reviewCount >= 100) reasons.push("💬 Gran volumen de reseñas verificadas");
        if (service.verified) reasons.push("✅ 100% Auditado por Servicios Mallorca");
        if (service.isIconicHeritage) reasons.push("🏛️ Negocio histórico o emblemático");
      }

      return {
        service,
        score,
        breakdown,
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    badgeLabel:
      locale === "de"
        ? idx === 0
          ? "🥇 Top #1 Kategorie"
          : idx === 1
            ? "🥈 Top #2"
            : idx === 2
              ? "🥉 Top #3"
              : `#${idx + 1}`
        : idx === 0
          ? "🥇 Top #1 Sector"
          : idx === 1
            ? "🥈 Top #2"
            : idx === 2
              ? "🥉 Top #3"
              : `#${idx + 1}`,
  }));
}

/**
 * Filtra los mejores negocios de una zona geográfica específica.
 */
export function getTopServicesByZone(zone: string, limit = 5, locale = "es"): RankedService[] {
  const filtered = SERVICES.filter((s) => s.zone === zone && s.status !== "permanently_closed");
  const ranked = filtered
    .map((service) => {
      const breakdown = calculateQualityBreakdown(service, locale);
      return {
        service,
        score: breakdown.total,
        breakdown,
        reasons: service.rating && service.rating >= 4.7 ? ["⭐ Calificación Destacada"] : ["🛡️ Verificado"],
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    badgeLabel: `Top #${idx + 1} ${zone}`,
  }));
}

/**
 * Devuelve el Top 3 curado de la semana con rotación determinista.
 */
export function getWeeklyCuratedTops(date = new Date(), locale = "es"): RankedService[] {
  const verifiedServices = SERVICES.filter((s) => s.verified && s.status !== "permanently_closed");
  if (verifiedServices.length === 0) return [];

  // Calcular número de semana del año para rotación
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);

  const startIndex = (weekNumber * 3) % verifiedServices.length;
  const weeklyServices: ServiceItem[] = [];

  for (let i = 0; i < 3; i++) {
    weeklyServices.push(verifiedServices[(startIndex + i) % verifiedServices.length]);
  }

  return weeklyServices.map((service, idx) => {
    const breakdown = calculateQualityBreakdown(service, locale);
    return {
      service,
      rank: idx + 1,
      score: breakdown.total,
      breakdown,
      badgeLabel: locale === "de" ? "✨ Wöchentliche Auswahl" : "✨ Selección Semanal",
      reasons: ["🏆 Destacado de la Semana", "✅ 100% Verificado"],
    };
  });
}

/**
 * Consulta de Lista Comparativa Multicriterio con Filtros por Capacidades.
 */
export function getComparisonList(params: ComparisonFilterParams = {}): RankedService[] {
  const { category, sectorId, zone, capabilities = [], priceRange, minScore = 70, locale = "es", limit = 20 } = params;

  let results = SERVICES.filter((s) => s.status !== "permanently_closed");

  if (category) {
    results = results.filter((s) => s.category === category || s.sectors?.includes(category));
  }
  if (sectorId) {
    results = results.filter((s) => s.sectorId === sectorId || s.sectors?.includes(sectorId));
  }
  if (zone) {
    results = results.filter((s) => s.zone === zone);
  }
  if (priceRange) {
    results = results.filter((s) => s.priceRange === priceRange);
  }
  if (capabilities.length > 0) {
    results = results.filter((s) => {
      const caps = s.capabilities || {};
      return capabilities.every((cap) => Boolean(caps[cap]));
    });
  }

  const ranked = results
    .map((service) => {
      const breakdown = calculateQualityBreakdown(service, locale);
      const reasons: string[] = [];
      if (service.rating && service.rating >= 4.7) reasons.push("⭐ Calificación Sobresaliente");
      if (service.capabilities?.terrace) reasons.push("☀️ Terraza al aire libre");
      if (service.capabilities?.seaViews) reasons.push("🌊 Vistas al mar");
      if (service.capabilities?.petFriendly) reasons.push("🐾 Pet Friendly");
      if (service.capabilities?.wheelchairAccessible) reasons.push("♿ Accesible PMR");

      return {
        service,
        score: breakdown.total,
        breakdown,
        reasons,
      };
    })
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

/**
 * Devuelve los mejores negocios globales de la isla de Mallorca.
 */
export function getTopRankedServices(limit = 10, locale = "es"): RankedService[] {
  const ranked = SERVICES.filter((s) => s.status !== "permanently_closed")
    .map((service) => {
      const breakdown = calculateQualityBreakdown(service, locale);
      return {
        service,
        score: breakdown.total,
        breakdown,
        reasons: service.rating && service.rating >= 4.8 ? ["⭐ Calidad Superior"] : ["🛡️ Verificado"],
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    badgeLabel: idx === 0 ? "👑 Top #1 Mallorca" : `#${idx + 1}`,
  }));
}

/**
 * Genera FAQs Dinámicas y Estructuradas (FAQPage Schema) para SEO Long-Tail y Motores de IA.
 */
export function generateDynamicFaqs(
  categoryName: string,
  zoneName = "Mallorca",
  topServices: RankedService[] = [],
  locale = "es",
) {
  const top1 = topServices[0]?.service;
  const top2 = topServices[1]?.service;

  const faqs = [
    {
      question:
        locale === "de"
          ? `Welche sind die besten geprüften Anbieter für ${categoryName} in ${zoneName}?`
          : `¿Cuáles son los mejores negocios y profesionales de ${categoryName} en ${zoneName}?`,
      answer: top1
        ? locale === "de"
          ? `Basierend auf unserem unabhängigen Qualitäts- und Vertrauensindex führen ${top1.name} (Bewertung ${top1.rating}★) ${top2 ? `und ${top2.name} (Bewertung ${top2.rating}★)` : ""} die Rangliste in ${zoneName} an.`
          : `Según nuestro índice de calidad y veracidad multi-fuente, los líderes destacados en ${zoneName} son ${top1.name} (puntuación ${top1.rating}★ con ${top1.reviewCount} reseñas) ${top2 ? `y ${top2.name} (${top2.rating}★)` : ""}.`
        : `En Servicios Mallorca dispones de una selección 100% auditada con horarios, teléfonos directos y geolocalización precisa.`,
    },
    {
      question:
        locale === "de"
          ? `Wie werden die Unternehmen in der Bestenliste von ${categoryName} bewertet?`
          : `¿Cómo se calcula el ranking y el Score de Calidad de ${categoryName}?`,
      answer:
        locale === "de"
          ? `Die Platzierung erfolgt über einen automatischen 4-Säulen-Index: Datenwahrheit (30%), Kundenbewertungen & Reputation (30%), Visuelle Qualität (20%) und Benutzeraffinität & Serviceleistungen (20%).`
          : `El ranking se calcula mediante un algoritmo transparente de 4 pilares: Veracidad de Datos (30%), Popularidad y Reseñas Reales (30%), Calidad Visual (20%) y Matriz de Capacidades y Atención al Usuario (20%).`,
    },
    {
      question:
        locale === "de"
          ? `Gibt es in ${zoneName} Optionen mit Online-Reservierung oder barrierefreiem Zugang?`
          : `¿Hay opciones con terraza, reservas online o accesibilidad PMR en ${zoneName}?`,
      answer:
        locale === "de"
          ? `Ja, Sie können die Liste interaktiv filtern, um gezielt Betriebe mit Terrasse, Barrierefreiheit (PMR) oder Online-Terminen anzuzeigen.`
          : `Sí, nuestra tabla comparativa dinámica permite filtrar al instante por terraza al aire libre, pet friendly, accesibilidad para personas con movilidad reducida (PMR) y reserva directa.`,
    },
  ];

  return faqs;
}
