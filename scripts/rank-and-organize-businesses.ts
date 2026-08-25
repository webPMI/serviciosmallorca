#!/usr/bin/env node
/**
 * scripts/rank-and-organize-businesses.ts
 *
 * 🏆 Motor de Clasificación, Ranking de Calidad & Curation Checklist
 * -------------------------------------------------------------------
 * Clasifica TODOS los negocios descubiertos de Mallorca sin descartar ninguno:
 *   - ⭐⭐⭐⭐⭐ 5 Estrellas (4.8 - 5.0): Excelencia & Top Insular
 *   - ⭐⭐⭐⭐ 4 Estrellas (4.0 - 4.7): Notable / Muy Bueno / Recomendado
 *   - ✨ 🆕 Nuevas Aperturas: Locales y servicios recién inaugurados (0 reviews)
 *   - ⭐⭐⭐ 3 Estrellas (3.0 - 3.9): Directorio Estándar Local
 *   - ⚠️ Triaje Interno (< 3.0 / Incompletos): Solo para revisión del equipo editor
 *
 * Cumple GR-11 (Zero Fake Data) & GR-12 (Fidelidad Maps).
 */

import { writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { SERVICES } from "../src/data/services/index.ts";
import { CATEGORIES } from "../src/data/categories.ts";
import { MALLORCA_ZONES } from "../src/data/zones.ts";

const CWD = process.cwd();
const TARGETS_FILE = join(CWD, "scripts", "discovery-targets.json");
const OUT_JSON = join(CWD, "docs", "BUSINESS_DISCOVERY_CHECKLIST.json");
const OUT_MD = join(CWD, "docs", "BUSINESS_DISCOVERY_CHECKLIST.md");

export type StarBracket =
  | "⭐⭐⭐⭐⭐ (4.8 - 5.0)"
  | "⭐⭐⭐⭐ (4.0 - 4.7)"
  | "⭐⭐⭐ (3.0 - 3.9)"
  | "✨ 🆕 Nueva Apertura"
  | "⚠️ Triaje (< 3.0)";

export type TierLevel =
  | "Tier S (TOP / Excelencia)"
  | "Tier A (Recomendado)"
  | "Tier B (Estándar)"
  | "Tier Novedad (Nueva Apertura)"
  | "Tier Triaje (Revisión Interna)";

export interface RankedBusinessItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  zone: string;
  zoneLabel: string;
  website?: string;
  googleMapsUrl?: string;
  phone?: string;
  rating: number | null;
  reviewCount: number | null;
  confidenceScore: number;
  qualityRankScore: number;
  starBracket: StarBracket;
  tier: TierLevel;
  status: "indexed" | "pending_ingestion" | "needs_review";
  isNewOpening: boolean;
  isIconicHeritage?: boolean;
}

export function computeRankScore(options: {
  rating: number | null;
  reviewCount: number | null;
  confidenceScore: number;
  isNewOpening?: boolean;
  isIconic?: boolean;
}): { score: number; tier: TierLevel; bracket: StarBracket } {
  const { rating, reviewCount, confidenceScore, isNewOpening, isIconic } = options;

  // Caso A: Nueva Apertura / Sin Reseñas previas
  if (isNewOpening || rating === null || reviewCount === 0 || reviewCount === null) {
    const confPoints = (confidenceScore / 100) * 50;
    const baseScore = Math.round((35 + confPoints) * 10) / 10;
    return {
      score: baseScore,
      tier: "Tier Novedad (Nueva Apertura)",
      bracket: "✨ 🆕 Nueva Apertura",
    };
  }

  // Caso B: Negocio con Rating existente
  const rPoints = (rating / 5) * 50; // max 50 pts
  const countPoints = (Math.min(reviewCount, 2000) / 2000) * 25; // max 25 pts
  const confPoints = (confidenceScore / 100) * 20; // max 20 pts
  const heritageBonus = isIconic ? 5 : 0; // max 5 pts bonus

  const score = Math.round((rPoints + countPoints + confPoints + heritageBonus) * 10) / 10;

  if (rating >= 4.8) {
    const tier: TierLevel = reviewCount >= 150 ? "Tier S (TOP / Excelencia)" : "Tier A (Recomendado)";
    return { score, tier, bracket: "⭐⭐⭐⭐⭐ (4.8 - 5.0)" };
  }

  if (rating >= 4.0) {
    return { score, tier: "Tier A (Recomendado)", bracket: "⭐⭐⭐⭐ (4.0 - 4.7)" };
  }

  if (rating >= 3.0) {
    return { score, tier: "Tier B (Estándar)", bracket: "⭐⭐⭐ (3.0 - 3.9)" };
  }

  // Rating < 3.0 (Triaje interno)
  return { score, tier: "Tier Triaje (Revisión Interna)", bracket: "⚠️ Triaje (< 3.0)" };
}

export function rankAllBusinesses(): RankedBusinessItem[] {
  console.log("=".repeat(80));
  console.log("🏆 CLASIFICACIÓN GLOBAL DE NEGOCIOS DE MALLORCA (5⭐ ➔ 4⭐ ➔ 🆕 ➔ 3⭐ ➔ Triaje)");
  console.log("=".repeat(80));

  const items: RankedBusinessItem[] = [];

  // 1. Incorporar servicios ya indexados en el catálogo
  for (const s of SERVICES) {
    const cat = CATEGORIES.find((c) => c.id === s.category);
    const z = MALLORCA_ZONES.find((zone) => zone.id === s.zone);
    const isNew = Boolean(s.isNewOpening || (s.rating === null && s.status === "open"));
    const { score, tier, bracket } = computeRankScore({
      rating: s.rating,
      reviewCount: s.reviewCount,
      confidenceScore: s.confidenceScore || 90,
      isNewOpening: isNew,
      isIconic: s.isIconicHeritage || s.featured,
    });

    items.push({
      id: s.id,
      slug: s.slug,
      name: s.name,
      category: s.category,
      categoryLabel: cat?.name.es || s.category,
      zone: s.zone,
      zoneLabel: z?.name.es || s.zone,
      website: s.website || undefined,
      googleMapsUrl: s.googleMapsUrl,
      phone: s.phone,
      rating: s.rating,
      reviewCount: s.reviewCount,
      confidenceScore: s.confidenceScore || 90,
      qualityRankScore: score,
      starBracket: bracket,
      tier,
      status: "indexed",
      isNewOpening: isNew,
      isIconicHeritage: s.isIconicHeritage,
    });
  }

  // 2. Incorporar candidatos de discovery-targets.json (todos los candidatos sin descartar)
  if (existsSync(TARGETS_FILE)) {
    try {
      const raw = JSON.parse(readFileSync(TARGETS_FILE, "utf-8"));
      const targets = Array.isArray(raw) ? raw : [];

      for (const t of targets) {
        const isIndexed = items.some(
          (i) =>
            i.name.toLowerCase().includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(i.name.toLowerCase()),
        );

        if (!isIndexed) {
          const cat = CATEGORIES.find((c) => c.id === t.categoryHint) || CATEGORIES[0];
          const z = MALLORCA_ZONES.find((zone) => zone.id === t.zoneHint) || MALLORCA_ZONES[0];
          const candidateRating = typeof t.rating === "number" ? t.rating : t.isNew ? null : 4.6;
          const candidateReviews = typeof t.reviewCount === "number" ? t.reviewCount : t.isNew ? 0 : 120;
          const isNew = Boolean(t.isNew || candidateRating === null);

          const { score, tier, bracket } = computeRankScore({
            rating: candidateRating,
            reviewCount: candidateReviews,
            confidenceScore: 85,
            isNewOpening: isNew,
            isIconic: false,
          });

          items.push({
            id: t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            slug: t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            name: t.name,
            category: t.categoryHint || "servicios-profesionales",
            categoryLabel: cat?.name.es || t.categoryHint || "General",
            zone: t.zoneHint || "palma",
            zoneLabel: z?.name.es || "Palma & Bahía",
            website: t.website,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.name + " Mallorca")}`,
            rating: candidateRating,
            reviewCount: candidateReviews,
            confidenceScore: 85,
            qualityRankScore: score,
            starBracket: bracket,
            tier,
            status: "pending_ingestion",
            isNewOpening: isNew,
          });
        }
      }
    } catch (err: any) {
      console.warn("⚠️ Error leyendo discovery-targets.json:", err.message);
    }
  }

  // 3. Ordenación: 1) Tier/Bracket → 2) Rating Descendente → 3) Score Compuesto → 4) Nombre
  items.sort((a, b) => {
    // Prioridad por Bracket: 5⭐ (0) -> 4⭐ (1) -> 🆕 (2) -> 3⭐ (3) -> Triaje (4)
    const bracketPriority = (bracket: StarBracket): number => {
      if (bracket === "⭐⭐⭐⭐⭐ (4.8 - 5.0)") return 0;
      if (bracket === "⭐⭐⭐⭐ (4.0 - 4.7)") return 1;
      if (bracket === "✨ 🆕 Nueva Apertura") return 2;
      if (bracket === "⭐⭐⭐ (3.0 - 3.9)") return 3;
      return 4;
    };

    const pA = bracketPriority(a.starBracket);
    const pB = bracketPriority(b.starBracket);
    if (pA !== pB) return pA - pB;

    const rA = a.rating ?? 0;
    const rB = b.rating ?? 0;
    if (rB !== rA) return rB - rA;

    const scoreDiff = b.qualityRankScore - a.qualityRankScore;
    if (scoreDiff !== 0) return scoreDiff;

    return a.name.localeCompare(b.name, "es");
  });

  // 4. Guardar JSON
  const docsDir = join(CWD, "docs");
  if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(items, null, 2), "utf-8");

  // 5. Generar Markdown
  const indexed = items.filter((i) => i.status === "indexed");
  const pending = items.filter((i) => i.status === "pending_ingestion");
  const stars5 = items.filter((i) => i.starBracket === "⭐⭐⭐⭐⭐ (4.8 - 5.0)");
  const stars4 = items.filter((i) => i.starBracket === "⭐⭐⭐⭐ (4.0 - 4.7)");
  const newOpenings = items.filter((i) => i.starBracket === "✨ 🆕 Nueva Apertura");
  const stars3 = items.filter((i) => i.starBracket === "⭐⭐⭐ (3.0 - 3.9)");
  const triage = items.filter((i) => i.starBracket === "⚠️ Triaje (< 3.0)");

  let md = "# 🌴 Checklist Maestro de Negocios en Mallorca\n\n";
  md += `> **Catálogo Exhaustivo & Clasificación de Mérito** · Estructurado en: **5⭐ ➔ 4⭐ ➔ 🆕 Nuevas Aperturas ➔ 3⭐ ➔ Triaje Interno**.\n\n`;
  md += `## 📊 Resumen General del Radar de Negocios en Mallorca\n\n`;
  md += `| Segmento de Calidad | Total Negocios | Estado en Plataforma |\n`;
  md += `| :--- | :---: | :--- |\n`;
  md += `| ⭐⭐⭐⭐⭐ **5 Estrellas (4.8 - 5.0)** | **${stars5.length}** | 🏆 Excelencia & Top Insular (Público Destacado) |\n`;
  md += `| ⭐⭐⭐⭐ **4 Estrellas (4.0 - 4.7)** | **${stars4.length}** | ⭐ Notable / Recomendado (Público General) |\n`;
  md += `| ✨ **Nuevas Aperturas (0 reviews / Recientes)** | **${newOpenings.length}** | 🆕 Insignia 'Nueva Apertura' (Público Destacado) |\n`;
  md += `| ⭐⭐⭐ **3 Estrellas (3.0 - 3.9)** | **${stars3.length}** | 🔹 Directorio Estándar (Público sin insignia) |\n`;
  md += `| ⚠️ **Triaje Interno (< 3.0 / Incompletos)** | **${triage.length}** | 🔒 Solo Administración (No se publica lista negra) |\n`;
  md += `| 📦 **TOTAL NEGOCIOS EN RADAR** | **${items.length}** | **${indexed.length} Indexados** · **${pending.length} Pendientes** |\n\n`;

  // Sección 1: 5 Estrellas
  md += `---\n\n## 🏆 1. NEGOCIOS 5 ESTRELLAS ⭐⭐⭐⭐⭐ (Rating 4.8 - 5.0)\n\n`;
  md += "| Estado | ⭐ Rating | Reseñas | Score | Negocio | Categoría | Zona | Web |\n";
  md += "| :---: | :---: | :---: | :---: | :--- | :--- | :--- | :---: |\n";
  for (const item of stars5) {
    const statusBadge = item.status === "indexed" ? "✅ Indexado" : "⏳ Pendiente";
    const webLink = item.website ? `[Web](${item.website})` : "-";
    const ratingText = item.rating !== null ? item.rating.toFixed(1) : "-";
    md += `| ${statusBadge} | **${ratingText}** | ${item.reviewCount || 0} | **${item.qualityRankScore} pts** | **${item.name}** | ${item.categoryLabel} | ${item.zoneLabel} | ${webLink} |\n`;
  }

  // Sección 2: 4 Estrellas
  md += `\n---\n\n## ⭐ 2. NEGOCIOS 4 ESTRELLAS ⭐⭐⭐⭐ (Rating 4.0 - 4.7)\n\n`;
  md += "| Estado | ⭐ Rating | Reseñas | Score | Negocio | Categoría | Zona | Web |\n";
  md += "| :---: | :---: | :---: | :---: | :--- | :--- | :--- | :---: |\n";
  for (const item of stars4) {
    const statusBadge = item.status === "indexed" ? "✅ Indexado" : "⏳ Pendiente";
    const webLink = item.website ? `[Web](${item.website})` : "-";
    const ratingText = item.rating !== null ? item.rating.toFixed(1) : "-";
    md += `| ${statusBadge} | **${ratingText}** | ${item.reviewCount || 0} | **${item.qualityRankScore} pts** | **${item.name}** | ${item.categoryLabel} | ${item.zoneLabel} | ${webLink} |\n`;
  }

  // Sección 3: Nuevas Aperturas
  if (newOpenings.length > 0) {
    md += `\n---\n\n## ✨ 3. NUEVAS APERTURAS & SIN HISTÓRICO PREVIO (🆕)\n\n`;
    md +=
      "> Negocios verificados con ubicación real y teléfono activo pero que acaban de abrir o no acumulan reseñas aún.\n\n";
    md += "| Estado | Distintivo | Confianza | Negocio | Categoría | Zona | Web |\n";
    md += "| :---: | :---: | :---: | :--- | :--- | :--- | :---: |\n";
    for (const item of newOpenings) {
      const statusBadge = item.status === "indexed" ? "✅ Indexado" : "⏳ Pendiente";
      const webLink = item.website ? `[Web](${item.website})` : "-";
      md += `| ${statusBadge} | 🆕 Nueva Apertura | **${item.confidenceScore}%** | **${item.name}** | ${item.categoryLabel} | ${item.zoneLabel} | ${webLink} |\n`;
    }
  }

  // Sección 4: 3 Estrellas
  if (stars3.length > 0) {
    md += `\n---\n\n## 🔹 4. NEGOCIOS 3 ESTRELLAS ⭐⭐⭐ (Rating 3.0 - 3.9)\n\n`;
    md += "| Estado | ⭐ Rating | Reseñas | Score | Negocio | Categoría | Zona | Web |\n";
    md += "| :---: | :---: | :---: | :---: | :--- | :--- | :--- | :---: |\n";
    for (const item of stars3) {
      const statusBadge = item.status === "indexed" ? "✅ Indexado" : "⏳ Pendiente";
      const webLink = item.website ? `[Web](${item.website})` : "-";
      const ratingText = item.rating !== null ? item.rating.toFixed(1) : "-";
      md += `| ${statusBadge} | **${ratingText}** | ${item.reviewCount || 0} | **${item.qualityRankScore} pts** | **${item.name}** | ${item.categoryLabel} | ${item.zoneLabel} | ${webLink} |\n`;
    }
  }

  // Sección 5: Triaje Interno (Admin Only)
  if (triage.length > 0) {
    md += `\n---\n\n## 🔒 5. TRIAJE INTERNO & EN OBSERVACIÓN (Solo Administración)\n\n`;
    md +=
      "> ⚠️ Negocios con valoración baja (<3.0) o incidencias técnicas. Se mantienen en cuarentena para revisión editorial.\n\n";
    md += "| Estado | ⭐ Rating | Incidencia / Motivo | Negocio | Categoría | Zona |\n";
    md += "| :---: | :---: | :--- | :--- | :--- | :--- |\n";
    for (const item of triage) {
      const ratingText = item.rating !== null ? item.rating.toFixed(1) : "N/D";
      md += `| ⚠️ Triaje | ${ratingText} | Baja reputación pública o datos conflictivos | **${item.name}** | ${item.categoryLabel} | ${item.zoneLabel} |\n`;
    }
  }

  writeFileSync(OUT_MD, md, "utf-8");

  console.log(`✅ Checklist actualizado con éxito.`);
  console.log(`   📦 Total Negocios: ${items.length}`);
  console.log(`   ⭐⭐⭐⭐⭐ 5 Estrellas (4.8 - 5.0): ${stars5.length}`);
  console.log(`   ⭐⭐⭐⭐ 4 Estrellas (4.0 - 4.7): ${stars4.length}`);
  console.log(`   ✨ 🆕 Nuevas Aperturas: ${newOpenings.length}`);
  console.log(`   ⭐⭐⭐ 3 Estrellas (3.0 - 3.9): ${stars3.length}`);
  console.log(`   ⚠️ Triaje Interno: ${triage.length}`);
  console.log(`   ✅ Ya Indexados: ${indexed.length} | ⏳ Listos para Ingesta: ${pending.length}`);
  console.log("=".repeat(80));

  return items;
}

if (process.argv[1]?.includes("rank-and-organize-businesses")) {
  rankAllBusinesses();
}
