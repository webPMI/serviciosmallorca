#!/usr/bin/env node
/**
 * scripts/discover-businesses.ts
 *
 * 🔎 Motor de Descubrimiento, Clasificación de Calidad y Checklist Maestro de Mallorca
 * --------------------------------------------------------------------------------------
 * Busca, clasifica y organiza todos los negocios candidatos de Mallorca ordenados rigurosamente
 * de MEJORES a PEORES (por Rating ponderado, volumen de reseñas y Confidence Score).
 *
 * Cumple GR-11 (Zero Fake Data) & GR-12 (Fidelidad Maps).
 *
 * Modos de Uso:
 *   1. Generar Checklist Actualizado:
 *      npm run discover
 *
 *   2. Minar Candidatos de scripts/discovery-targets.json y agregarlos clasificados al checklist:
 *      npm run discover:mine
 *
 *   3. Ingestar automáticamente los mejores candidatos verificados al catálogo con auto-traducción:
 *      npx tsx scripts/discover-businesses.ts --ingest-verified
 */

import { writeFileSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { SERVICES } from "../src/data/services/index.ts";
import { CATEGORIES } from "../src/data/categories.ts";
import { MALLORCA_ZONES } from "../src/data/zones.ts";
import { harvestBusinessIntelligence } from "../src/lib/scrapers/orchestrator.ts";
import { addServices } from "./add-service.ts";

const CWD = process.cwd();
const OUT_JSON = join(CWD, "docs", "BUSINESS_DISCOVERY_CHECKLIST.json");
const OUT_MD = join(CWD, "docs", "BUSINESS_DISCOVERY_CHECKLIST.md");

export type ChecklistSource = "catalog" | "discovery";

export interface ChecklistItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  zone: string;
  zoneLabel: string;
  website?: string;
  googleMapsUrl?: string;
  appleMapsUrl?: string;
  bingMapsUrl?: string;
  phone?: string;
  whatsapp?: string;
  rating?: number;
  reviewCount?: number;
  confidenceScore: number;
  qualityRankScore: number; // Métrica ponderada para ordenar de mejores a peores
  status: "indexed" | "pending_ingestion" | "needs_review" | "skipped";
  source: ChecklistSource;
  checked: boolean;
  notes?: string;
  lastUpdatedAt: string;
  rawTemplate?: Record<string, any>;
}

export interface DiscoveryTarget {
  name: string;
  website?: string;
  categoryHint?: string;
  zoneHint?: string;
}

/**
 * Calcula un puntaje de calidad compuesto para ordenar negocios de mejores a peores:
 * Rating (peso 50%) + Volumen de reseñas (peso 25%) + Confidence Score (peso 25%).
 */
export function calculateQualityRankScore(item: {
  rating?: number | null;
  reviewCount?: number | null;
  confidenceScore?: number | null;
}): number {
  const r = item.rating || 4.0;
  const count = Math.min(item.reviewCount || 10, 1000);
  const conf = item.confidenceScore || 70;

  // Rating normalizado sobre 50 pts
  const ratingPoints = (r / 5) * 50;
  // Reseñas normalizadas sobre 25 pts (escala logarítmica/proporcional hasta 1.000 reseñas)
  const reviewsPoints = (count / 1000) * 25;
  // Confianza normalizada sobre 25 pts
  const confidencePoints = (conf / 100) * 25;

  return Math.round((ratingPoints + reviewsPoints + confidencePoints) * 10) / 10;
}

/* ------------------------------------------------------------------ */
/*  Blueprint Exhaustivo de Búsqueda y Minería por Sector y Zona       */
/* ------------------------------------------------------------------ */
export const DISCOVERY_SECTORS: Array<{
  module: string;
  label: string;
  icon: string;
  keywords: string[];
}> = [
  {
    module: "deportes-fitness",
    label: "Deporte, Gimnasios & Fitness",
    icon: "🏋️",
    keywords: [
      "gimnasio Palma 24h",
      "gimnasio crossfit Mallorca",
      "estudio pilates yoga Palma",
      "club padel Palma alquiler pista",
      "club natacion Palma piscina",
      "alquiler bici carretera Mallorca",
      "campo de golf Mallorca green fee",
      "club de tenis Palma",
      "entrenador personal Palma expat",
      "park calistenia Palma parque",
      "escuela futbol ninos Palma",
      "senderismo guiado Tramuntana",
    ],
  },
  {
    module: "gastronomia-restaurantes",
    label: "Hostelería, Gastronomía & Restaurantes",
    icon: "🍽️",
    keywords: [
      "restaurante alta cocina Mallorca",
      "restaurante estrella michelin Mallorca",
      "restaurante puerto portals",
      "arroceria marisqueria Palma",
      "celler tradicional Mallorca",
      "restaurante vistas al mar deia valldemossa",
      "tapas de autor Palma La Lonja",
    ],
  },
  {
    module: "nautica-charter",
    label: "Náutica, Chárter & Actividades Marítimas",
    icon: "⛵",
    keywords: [
      "yacht charter Mallorca",
      "alquiler catamaran Palma",
      "lanchas con patron Calvia Andratx",
      "alquiler veleros Port de Pollença",
      "mantenimiento embarcaciones Palma",
    ],
  },
  {
    module: "spas-bienestar",
    label: "Salud, Spas, Bienestar & Belleza",
    icon: "🧘",
    keywords: [
      "luxury spa Mallorca",
      "wellness hotel spa Palma",
      "masajes terapeuticos Mallorca",
      "clinica medicina estetica Palma",
      "centro yoga retiro Mallorca",
    ],
  },
  {
    module: "arte-tatuajes",
    label: "Arte, Tatuaje de Autor & Piercing",
    icon: "🎨",
    keywords: [
      "best tattoo studio Palma",
      "tatuaje realismo Mallorca",
      "piercing titanio Palma",
      "galeria de arte contemporaneo Palma",
    ],
  },
  {
    module: "reformas-construccion",
    label: "Construcción, Reformas & Hogar",
    icon: "🏗️",
    keywords: [
      "reformas integrales villas Mallorca",
      "empresa constructora Palma",
      "fontaneria urgente Palma",
      "instalador climatizacion aerotermia Mallorca",
      "electricista autorizado Palma",
    ],
  },
  {
    module: "inmobiliaria-villas",
    label: "Inmobiliaria, Villas Exclusivas & Fincas",
    icon: "🏡",
    keywords: [
      "luxury real estate Mallorca",
      "inmobiliaria villas Son Vida",
      "fincas rusticas venta Mallorca",
      "property management Calvia",
    ],
  },
  {
    module: "servicios-profesionales",
    label: "Servicios Profesionales, Legal & Asesoría",
    icon: "💼",
    keywords: [
      "abogados internacionales Mallorca",
      "asesoria fiscal expatriados Palma",
      "notaria Palma Mallorca",
      "auditoria empresas Baleares",
    ],
  },
  {
    module: "motor-transporte",
    label: "Movilidad, Transfers VIP & Chófer Privado",
    icon: "🚗",
    keywords: [
      "vip airport transfer Palma",
      "chofer privado Mallorca",
      "alquiler coches lujo Mallorca",
      "tours privados Mallorca",
    ],
  },
  {
    module: "jardineria-piscinas",
    label: "Jardinería, Paisajismo & Piscinas",
    icon: "🌴",
    keywords: [
      "paisajismo jardines mediterraneos Mallorca",
      "mantenimiento piscinas villas Palma",
      "viveros plantas autoctonas Mallorca",
      "riego automatico fincas Mallorca",
    ],
  },
  {
    module: "tecnologia-seguridad",
    label: "Tecnología, Seguridad & Domótica",
    icon: "🛡️",
    keywords: [
      "alarmas seguridad villas Mallorca",
      "instalacion domotica KNX Palma",
      "videovigilancia CCTV Mallorca",
      "ciberseguridad redes empresas Palma",
    ],
  },
];

/** URLs de búsqueda directa en Google Maps para el blueprint de descubrimiento. */
export function buildDiscoveryBlueprint(): Array<{ icon: string; label: string; searches: string[] }> {
  return DISCOVERY_SECTORS.map((sector) => ({
    icon: sector.icon,
    label: sector.label,
    searches: sector.keywords.map((kw) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kw)}`),
  }));
}

export async function generateChecklist(
  options: { mine?: boolean; targetFile?: string; ingestVerified?: boolean } = {},
): Promise<ChecklistItem[]> {
  console.log("=".repeat(80));
  console.log("🔎 MOTOR DE DESCUBRIMIENTO & CHECKLIST MAESTRO DE NEGOCIOS (MALLORCA)");
  console.log("=".repeat(80));

  const items: ChecklistItem[] = [];

  // 1. Cargar desde el catálogo ya indexado (fuente certificada)
  for (const s of SERVICES) {
    const cat = CATEGORIES.find((c) => c.id === s.category);
    const z = MALLORCA_ZONES.find((zone) => zone.id === s.zone);
    const rank = calculateQualityRankScore({
      rating: s.rating,
      reviewCount: s.reviewCount,
      confidenceScore: s.confidenceScore || 90,
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
      appleMapsUrl: s.appleMapsUrl,
      bingMapsUrl: s.bingMapsUrl,
      phone: s.phone,
      whatsapp: s.whatsapp,
      rating: s.rating ?? undefined,
      reviewCount: s.reviewCount ?? undefined,
      confidenceScore: s.confidenceScore || 90,
      qualityRankScore: rank,
      status: "indexed",
      source: "catalog",
      checked: true,
      lastUpdatedAt: s.lastVerifiedAt || new Date().toISOString().split("T")[0],
    });
  }

  // 2. Si se solicitó minar candidatos externos (ej. scripts/discovery-targets.json)
  if (options.mine) {
    const targetFilePath = options.targetFile || join(CWD, "scripts", "discovery-targets.json");
    if (existsSync(targetFilePath)) {
      console.log(`\n⛏️ Minando candidatos desde: ${targetFilePath}...`);
      try {
        const raw = JSON.parse(readFileSync(targetFilePath, "utf-8"));
        const targets: DiscoveryTarget[] = Array.isArray(raw) ? raw : [];

        for (const t of targets) {
          const alreadyIndexed = items.some(
            (i) =>
              i.name.toLowerCase() === t.name.toLowerCase() ||
              (t.website &&
                i.website &&
                i.website.toLowerCase().includes(new URL(t.website).hostname.replace("www.", ""))),
          );

          if (alreadyIndexed) {
            console.log(`  ✓ Ya indexado: "${t.name}" (omitido de minería duplicada)`);
            continue;
          }

          console.log(`  🔍 Minando datos de: "${t.name}"...`);
          try {
            const intel = await harvestBusinessIntelligence(t.name, t.website);
            const vr = intel.verificationReport;
            const rank = calculateQualityRankScore({
              rating: intel.curationTemplate.rating || 4.8,
              reviewCount: intel.curationTemplate.reviewCount || 50,
              confidenceScore: vr.confidenceScore,
            });

            const detectedCat = t.categoryHint || intel.detectedCategory;
            const cat = CATEGORIES.find((c) => c.id === detectedCat);
            const zoneKey = t.zoneHint || "palma";
            const z = MALLORCA_ZONES.find((zone) => zone.id === zoneKey);

            items.push({
              id: intel.curationTemplate.slug,
              slug: intel.curationTemplate.slug,
              name: t.name,
              category: detectedCat,
              categoryLabel:
                cat?.name.es ||
                detectedCat
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" "),
              zone: zoneKey,
              zoneLabel: z?.name.es || zoneKey,
              website: t.website,
              googleMapsUrl: intel.mapsPresence.googleMapsSearchUrl,
              appleMapsUrl: intel.mapsPresence.appleMapsSearchUrl,
              bingMapsUrl: intel.mapsPresence.bingMapsSearchUrl,
              phone: intel.curationTemplate.phone,
              whatsapp: intel.curationTemplate.whatsapp,
              rating: intel.curationTemplate.rating,
              reviewCount: intel.curationTemplate.reviewCount,
              confidenceScore: vr.confidenceScore,
              qualityRankScore: rank,
              status: vr.confidenceScore >= 80 ? "pending_ingestion" : "needs_review",
              source: "discovery",
              checked: false,
              lastUpdatedAt: new Date().toISOString().split("T")[0],
              rawTemplate: intel.curationTemplate,
            });
          } catch (err: any) {
            console.warn(`  ⚠️ No se pudo minar "${t.name}":`, err.message);
          }
        }
      } catch (err: any) {
        console.error("❌ Error leyendo archivo de targets:", err.message);
      }
    }
  }

  // 2.5 Persistencia: fusionar candidatos ya descubiertos (source: discovery) del JSON previo.
  // Evita que la ejecución normal (sin --mine) borre el trabajo acumulado de descubrimientos previos.
  if (existsSync(OUT_JSON)) {
    try {
      const prev = JSON.parse(readFileSync(OUT_JSON, "utf-8"));
      const prevItems: ChecklistItem[] = Array.isArray(prev) ? prev : [];
      const seen = new Set(items.map((i) => i.slug || i.id));
      for (const p of prevItems) {
        if (p.source !== "discovery") continue; // solo candidatos, nunca el catálogo
        const key = p.slug || p.id;
        if (key && !seen.has(key)) {
          items.push(p);
          seen.add(key);
        }
      }
    } catch {
      // JSON previo corrupto: se ignora y se regenera desde el catálogo
    }
  }

  // 3. Ordenación Rigurosa: 1) Categoría → 2) Calidad de Mayor a Menor (Quality Rank) → 3) Nombre
  items.sort((a, b) => {
    const catCmp = a.categoryLabel.localeCompare(b.categoryLabel, "es");
    if (catCmp !== 0) return catCmp;
    const rankDiff = (b.qualityRankScore || 0) - (a.qualityRankScore || 0);
    if (rankDiff !== 0) return rankDiff;
    return a.name.localeCompare(b.name, "es");
  });

  // 4. Ingesta Automática si fue solicitada (--ingest-verified)
  if (options.ingestVerified) {
    const readyToIngest = items.filter((i) => i.status === "pending_ingestion" && i.rawTemplate);
    if (readyToIngest.length > 0) {
      console.log(`\n🚀 Ingestando ${readyToIngest.length} mejores candidatos verificados al catálogo...`);
      await addServices(readyToIngest.map((i) => i.rawTemplate!));
    }
  }

  // 5. Guardar JSON
  const docsDir = join(CWD, "docs");
  if (!existsSync(docsDir)) mkdirSync(docsDir, { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(items, null, 2), "utf-8");

  // 6. Generar Markdown Enriquecido
  const indexedCount = items.filter((i) => i.status === "indexed").length;
  const pendingCount = items.filter((i) => i.status === "pending_ingestion").length;
  const reviewCount = items.filter((i) => i.status === "needs_review").length;

  const grouped = new Map<string, ChecklistItem[]>();
  for (const item of items) {
    const key = item.categoryLabel;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  let md = "# 🌴 Checklist Maestro de Negocios en Mallorca\n\n";
  md += `> **Directorio Oficial de Servicios de Mallorca** · Cumplimiento estricto de **GR-11 (Zero Fake Data)** y **GR-12 (Fidelidad Maps)**.\n\n`;
  md += `## 📊 Resumen Ejecutivo del Catálogo\n\n`;
  md += `| Métrica | Total |\n`;
  md += `| :--- | :---: |\n`;
  md += `| ✅ **Total Negocios Indexados** | **${indexedCount}** |\n`;
  md += `| 🌟 **Candidatos Listos para Ingesta (Score ≥80%)** | **${pendingCount}** |\n`;
  md += `| ⚠️ **Candidatos en Triaje / Revisión Manual** | **${reviewCount}** |\n`;
  md += `| 🏷️ **Categorías Sectoriales Activas** | **${grouped.size}** |\n\n`;

  md += `---\n\n## 📋 Checklist Organizado por Categoría (Ordenado de Mejores a Peores)\n\n`;

  for (const [cat, rows] of grouped) {
    md += `### ${cat}\n\n`;
    md += `| Estado | Rango | ⭐ Rating | Negocio | Zona | Teléfono | Mapas | Web |\n`;
    md += `| :---: | :---: | :---: | :--- | :--- | :--- | :---: | :---: |\n`;

    for (const item of rows) {
      const statusIcon =
        item.status === "indexed"
          ? "✅ Indexado"
          : item.status === "pending_ingestion"
            ? "🌟 Listo Ingesta"
            : "⚠️ Triaje";

      const ratingText = item.rating ? `${item.rating.toFixed(1)} (${item.reviewCount || 0})` : "Pendiente";
      const mapsLink = item.googleMapsUrl ? `[Maps](${item.googleMapsUrl})` : "-";
      const webLink = item.website ? `[Web](${item.website})` : "-";
      const phone = item.phone || "-";

      md += `| ${statusIcon} | **${item.qualityRankScore} pts** | ${ratingText} | **${item.name}** | ${item.zoneLabel} | ${phone} | ${mapsLink} | ${webLink} |\n`;
    }
    md += `\n`;
  }

  md += `---\n\n## 🔎 Blueprint de Descubrimiento de Negocios por Sector\n\n`;
  md += `Abre estos enlaces directos a Google Maps para descubrir nuevos candidatos oficiales en Mallorca y añadirlos a \`scripts/discovery-targets.json\`:\n\n`;

  for (const sector of buildDiscoveryBlueprint()) {
    md += `### ${sector.icon} ${sector.label}\n\n`;
    for (const url of sector.searches) {
      const queryName = decodeURIComponent(url.split("query=")[1] || "");
      md += `- [🔍 ${queryName}](${url})\n`;
    }
    md += `\n`;
  }

  md += `---\n\n> 💡 **Comandos Útiles:**\n`;
  md += `> - Regenerar checklist: \`npm run discover\`\n`;
  md += `> - Minar lista de candidatos: \`npm run discover:mine\`\n`;

  writeFileSync(OUT_MD, md, "utf-8");
  console.log(`\n✅ Checklist maestro generado con éxito en:`);
  console.log(`   📄 docs/BUSINESS_DISCOVERY_CHECKLIST.md`);
  console.log(`   📊 docs/BUSINESS_DISCOVERY_CHECKLIST.json`);
  console.log(`   📦 Total Entradas: ${items.length} negocios.`);
  console.log("=".repeat(80));

  return items;
}

if (process.argv[1]?.includes("discover-businesses")) {
  const args = process.argv.slice(2);
  const mine = args.includes("--mine");
  const ingestVerified = args.includes("--ingest-verified");
  const fileArg = args.find((a) => a.startsWith("--file="))?.replace("--file=", "");
  generateChecklist({ mine, targetFile: fileArg, ingestVerified });
}
