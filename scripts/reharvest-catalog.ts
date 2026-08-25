#!/usr/bin/env node
/**
 * scripts/reharvest-catalog.ts
 *
 * Motor de Re-Minería y Actualización Inteligente para Negocios Existentes.
 * Ejecuta el nuevo sistema de captación multicanal sobre el catálogo registrado,
 * aplicando una Fusión Inteligente (Smart Merge) que enriquece campos nuevos sin destruir la curación manual.
 *
 * Uso:
 *   npx tsx scripts/reharvest-catalog.ts --slug="dins-santi-taura"
 *   npx tsx scripts/reharvest-catalog.ts --all
 *   npx tsx scripts/reharvest-catalog.ts --all --apply
 */

import { SERVICES } from "../src/data/services/index.ts";
import type { ServiceItem } from "../src/data/services/types.ts";
import { harvestBusinessIntelligence } from "../src/lib/scrapers/orchestrator.ts";
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export interface ReharvestDiff {
  serviceId: string;
  name: string;
  previousScore: number;
  newScore: number;
  addedFields: string[];
  updatedFields: string[];
}

export interface ReharvestReport {
  timestamp: string;
  totalCatalog: number;
  processedCount: number;
  improvedScoreCount: number;
  summaryDiffs: ReharvestDiff[];
}

/**
 * Fusiona de forma inteligente el registro existente con los nuevos datos cosechados.
 */
export function smartMergeService(
  existing: ServiceItem,
  harvestedTemplate: Record<string, any>
): { merged: ServiceItem; diff: ReharvestDiff } {
  const merged: ServiceItem = { ...existing };
  const addedFields: string[] = [];
  const updatedFields: string[] = [];

  // 1. Redes Sociales: Añadir canales nuevos sin borrar los existentes
  if (harvestedTemplate.socialLinks) {
    merged.socialLinks = {
      ...(existing.socialLinks || {}),
      ...harvestedTemplate.socialLinks,
    };
    for (const [net, url] of Object.entries(harvestedTemplate.socialLinks)) {
      if (url && !(existing.socialLinks as any)?.[net]) {
        addedFields.push(`socialLinks.${net}`);
      }
    }
  }

  // 2. Tienda Online & Productos
  if (harvestedTemplate.onlineStore && !existing.onlineStore) {
    merged.onlineStore = harvestedTemplate.onlineStore;
    addedFields.push("onlineStore");
  }
  if (harvestedTemplate.products && harvestedTemplate.products.length > 0 && (!existing.products || existing.products.length === 0)) {
    merged.products = harvestedTemplate.products;
    addedFields.push(`products (${harvestedTemplate.products.length} productos)`);
  }

  // 3. Menú y Carta Digital
  if (harvestedTemplate.menuUrl && !existing.menuUrl) {
    merged.menuUrl = harvestedTemplate.menuUrl;
    addedFields.push("menuUrl");
  }

  // 4. Especialidades (Añadir si no existían)
  if (harvestedTemplate.specialties && !existing.specialties) {
    merged.specialties = harvestedTemplate.specialties;
    addedFields.push("specialties");
  }

  // 5. Menciones en Prensa Balear (News Mentions)
  if (harvestedTemplate.newsMentions && (!existing.newsMentions || existing.newsMentions.length === 0)) {
    merged.newsMentions = harvestedTemplate.newsMentions;
    addedFields.push("newsMentions");
  }

  // 6. Actualización de Auditoría y Verificación
  const prevScore = existing.confidenceScore ?? (existing.verified ? 85 : 60);
  const newScore = harvestedTemplate.confidenceScore ?? prevScore;

  merged.confidenceScore = newScore;
  merged.verificationStatus = harvestedTemplate.verificationStatus || existing.verificationStatus;
  merged.sourceCrossReference = harvestedTemplate.sourceCrossReference || existing.sourceCrossReference;
  merged.lastVerifiedAt = new Date().toISOString().split("T")[0];
  updatedFields.push("lastVerifiedAt", "confidenceScore", "sourceCrossReference");

  return {
    merged,
    diff: {
      serviceId: existing.id,
      name: existing.name,
      previousScore: prevScore,
      newScore: newScore,
      addedFields,
      updatedFields,
    },
  };
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z0-9])/gi, (_, g) => g.toUpperCase());
}

/**
 * Guarda el servicio actualizado como archivo TypeScript en src/data/services/<sector>/<slug>.ts
 */
function saveServiceToFile(service: ServiceItem, sector: string) {
  const baseServicesDir = join(process.cwd(), "src", "data", "services");
  let targetPath = join(baseServicesDir, sector, `${service.slug}.ts`);

  if (!existsSync(targetPath)) {
    const candidateFolders = ["arte-tatuajes", "gastronomia-restaurantes", "nautica-charter", "salud-bienestar"];
    for (const folder of candidateFolders) {
      const p = join(baseServicesDir, folder, `${service.slug}.ts`);
      if (existsSync(p)) {
        targetPath = p;
        break;
      }
    }
  }

  const varName = toCamelCase(service.slug);
  const tsContent = `import type { ServiceItem } from "../types.ts";

export const ${varName}: ServiceItem = ${JSON.stringify(service, null, 2)};
`;

  writeFileSync(targetPath, tsContent, "utf-8");
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runReharvest(options: {
  targetSlug?: string;
  sector?: string;
  apply?: boolean;
  delayMs?: number;
}): Promise<ReharvestReport> {
  const delayMs = options.delayMs ?? 600;
  let targets = [...SERVICES];

  if (options.targetSlug) {
    targets = targets.filter((s) => s.slug === options.targetSlug || s.id === options.targetSlug);
  } else if (options.sector) {
    targets = targets.filter((s) => s.category.includes(options.sector!) || s.category === options.sector);
  }

  console.log("=".repeat(80));
  console.log(`🔄 MOTOR DE RE-MINERÍA Y ACTUALIZACIÓN CONTINUA DE NEGOCIOS`);
  console.log(`📊 Negocios Seleccionados para Actualizar: ${targets.length}`);
  console.log(`💾 Modo de Escritura: ${options.apply ? "✅ APLICAR CAMBIOS EN DISCO" : "🔍 SIMULACIÓN (DRY-RUN)"}`);
  console.log("=".repeat(80));

  const diffs: ReharvestDiff[] = [];
  let improvedCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const existing = targets[i];
    console.log(`\n[${i + 1}/${targets.length}] Re-analizando: "${existing.name}" (Slug: ${existing.slug})...`);

    try {
      const harvested = await harvestBusinessIntelligence(existing.name, existing.website);
      const { merged, diff } = smartMergeService(existing, harvested.curationTemplate);

      if (diff.newScore > diff.previousScore) improvedCount++;
      diffs.push(diff);

      console.log(`  • Score: ${diff.previousScore}% ➔ ${diff.newScore}% (${diff.newScore >= 85 ? "✅ VERIFICADO" : "⚠️ TRIAJE"})`);
      if (diff.addedFields.length > 0) {
        console.log(`  • ✨ Campos Nuevos Incorporados: ${diff.addedFields.join(", ")}`);
      } else {
        console.log(`  • ✓ Información ya al día.`);
      }

      if (options.apply) {
        saveServiceToFile(merged, existing.category);
        console.log(`  • 💾 Archivo src/data/services/${existing.category}/${existing.slug}.ts actualizado.`);
      }

      if (i < targets.length - 1) {
        await sleep(delayMs);
      }
    } catch (err: any) {
      console.error(`  ❌ Error re-analizando "${existing.name}":`, err.message);
    }
  }

  const report: ReharvestReport = {
    timestamp: new Date().toISOString(),
    totalCatalog: SERVICES.length,
    processedCount: targets.length,
    improvedScoreCount: improvedCount,
    summaryDiffs: diffs,
  };

  const reportPath = join(process.cwd(), "docs", "REHARVEST_REPORT.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");

  console.log("\n" + "=".repeat(80));
  console.log(`🏁 RESUMEN DEL PROCESO DE RE-MINERÍA:`);
  console.log(`  • Fichas Procesadas:              ${targets.length}`);
  console.log(`  • Fichas con Información Nueva:   ${diffs.filter((d) => d.addedFields.length > 0).length}`);
  console.log(`  • Fichas con Mejora de Confianza: ${improvedCount}`);
  console.log(`  • 📄 Reporte de Diferencias:      docs/REHARVEST_REPORT.json`);
  if (!options.apply) {
    console.log(`  💡 Consejo: Ejecuta con --apply para guardar automáticamente las mejoras en el código.`);
  }
  console.log("=".repeat(80));

  return report;
}

async function main() {
  const args = process.argv.slice(2);
  let targetSlug: string | undefined;
  let sector: string | undefined;
  let apply = false;

  for (const arg of args) {
    if (arg.startsWith("--slug=")) {
      targetSlug = arg.replace("--slug=", "").trim();
    } else if (arg.startsWith("--sector=")) {
      sector = arg.replace("--sector=", "").trim();
    } else if (arg === "--apply" || arg === "--save") {
      apply = true;
    }
  }

  await runReharvest({ targetSlug, sector, apply });
}

if (process.argv[1]?.includes("reharvest-catalog")) {
  main();
}
