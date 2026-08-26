import { SERVICES } from "../data/services";
import type { ServiceItem } from "../data/services/types";

export interface RankedService {
  service: ServiceItem;
  rank: number;
  score: number; // 0 - 100
  badgeLabel?: string;
  reasons: string[];
}

/**
 * Calcula la puntuación ponderada de un negocio para los rankings "Top".
 *
 * Algoritmo multicriterio:
 * - Rating (40%): Calificación ponderada de 1 a 5 convertida a base 100.
 * - Volumen de Reseñas (25%): Normalizado hasta un máximo de 500 reseñas.
 * - Confidence Score / Verificación (20%): Auditoría estricta GR-11.
 * - Calidad de Contenido & Fidelidad (15%): Fotos reales, horario y contacto directo.
 * - Bonus de Mercado Localizado (Locale-Targeting): Para el mercado DACH ('de'),
 *   prioriza atención multilingüe en alemán, sellos oficiales y alta confianza.
 */
export function calculateBusinessScore(service: ServiceItem, locale?: string): number {
  const rating = service.rating ?? 0;
  const reviewCount = service.reviewCount ?? 0;
  const ratingNorm = (rating / 5.0) * 100;
  const reviewCountNorm = Math.min(100, (reviewCount / 400) * 100);
  const confidenceScore = service.confidenceScore || (service.verified ? 90 : 60);

  let contentBonus = 0;
  if (service.phone) contentBonus += 25;
  if (service.whatsapp) contentBonus += 25;
  if (service.schedule) contentBonus += 25;
  if (service.gallery && service.gallery.length >= 3) contentBonus += 25;

  let baseScore = ratingNorm * 0.4 + reviewCountNorm * 0.25 + confidenceScore * 0.2 + contentBonus * 0.15;

  // Localización Dinámica para Mercado Alemán (DACH)
  if (locale === "de") {
    let germanBoost = 0;
    if (service.languagesSpoken?.includes("de") || service.culturalIdentity === "german_oriented") {
      germanBoost += 6;
    }
    if (service.targetAudience?.includes("expat") || service.targetAudience?.includes("turistas")) {
      germanBoost += 3;
    }
    if (service.certifications && service.certifications.length > 0) {
      germanBoost += 3;
    }
    baseScore = Math.min(100, baseScore + germanBoost);
  }

  return Math.round(baseScore * 10) / 10;
}

/**
 * Devuelve los negocios mejor valorados de una categoría específica con soporte de localización.
 */
export function getTopServicesByCategory(category: string, limit = 5, locale = "es"): RankedService[] {
  const filtered = SERVICES.filter((s) => s.category === category && s.status !== "permanently_closed");

  const ranked = filtered
    .map((service) => {
      const score = calculateBusinessScore(service, locale);
      const reasons: string[] = [];

      if (locale === "de") {
        if (service.rating && service.rating >= 4.8) reasons.push("⭐ Spitzenbewertung (4.8+)");
        if (service.languagesSpoken?.includes("de") || service.culturalIdentity === "german_oriented") {
          reasons.push("🇩🇪 Deutschsprachiger Service");
        }
        if (service.verified) reasons.push("🛡️ Geprüfte Qualität & Vertrauensindex");
        if (service.certifications && service.certifications.length > 0) {
          reasons.push("🏅 Offizielle balearische Registrierung");
        }
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
 * Devuelve los mejores negocios globales de la isla de Mallorca.
 */
export function getTopRankedServices(limit = 10, locale = "es"): RankedService[] {
  const ranked = SERVICES.filter((s) => s.status !== "permanently_closed")
    .map((service) => {
      const score = calculateBusinessScore(service, locale);
      const reasons: string[] = [];

      if (locale === "de") {
        if (service.rating && service.rating >= 4.8) reasons.push("⭐ Herausragende Bewertung");
        if (service.languagesSpoken?.includes("de")) reasons.push("🇩🇪 Deutschsprachige Betreuung");
        if (service.verified) reasons.push("🛡️ Vollständig geprüfter Partner");
      } else {
        if (service.rating && service.rating >= 4.8) reasons.push("⭐ Calificación sobresaliente");
        if (service.verified) reasons.push("✅ Auditoría de confianza superada");
      }

      return {
        service,
        score,
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
          ? "👑 Top #1 Mallorca"
          : `#${idx + 1} Geprüft`
        : idx === 0
          ? "👑 Top #1 Mallorca"
          : `#${idx + 1} Destacado`,
  }));
}

/**
 * Devuelve una selección curada semanal (Top 3 de la Semana) calculada de forma determinista
 * rotando cada 7 días para mantener el contenido fresco para usuarios y motores de IA.
 */
export function getWeeklyCuratedTops(date = new Date()): RankedService[] {
  const verifiedServices = SERVICES.filter((s) => s.verified && s.status !== "permanently_closed");
  if (verifiedServices.length === 0) return [];

  // Calcular número de semana en el año
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

  const total = verifiedServices.length;
  const startIndex = (weekNumber * 3) % total;

  const selected: ServiceItem[] = [];
  for (let i = 0; i < Math.min(3, total); i++) {
    selected.push(verifiedServices[(startIndex + i) % total]);
  }

  return selected.map((service, idx) => ({
    service,
    rank: idx + 1,
    score: calculateBusinessScore(service),
    badgeLabel: `✨ Selección Semanal #${idx + 1}`,
    reasons: [
      "⭐ Destacado de la semana en Baleares",
      "✅ Datos y contacto verificados",
      "📍 Alta preferencia de usuarios locales",
    ],
  }));
}

/**
 * Devuelve los negocios mejor valorados filtrados por zona geográfica de Mallorca.
 */
export function getTopServicesByZone(zone: string, limit = 5): RankedService[] {
  return SERVICES.filter((s) => s.zone === zone && s.status !== "permanently_closed")
    .map((service) => ({
      service,
      score: calculateBusinessScore(service),
      reasons: ["📍 Líder en su zona geográfica", "⭐ Calificación contrastada"],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
      badgeLabel: `Top #${idx + 1} ${zone.replace(/-/g, " ")}`,
    }));
}
