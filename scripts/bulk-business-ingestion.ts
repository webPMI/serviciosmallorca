#!/usr/bin/env node
/**
 * scripts/bulk-business-ingestion.ts
 *
 * Motor de Carga y Minería en Lotes (Bulk Ingestion & Quality Triage Engine).
 * Procesa candidatos de negocios en Mallorca mediante la arquitectura modular de scrapers
 * y clasifica automáticamente los resultados según el Confidence Score (GR-11 Zero Fake Data).
 *
 * Uso:
 *   npx tsx scripts/bulk-business-ingestion.ts --demo
 *   npx tsx scripts/bulk-business-ingestion.ts --file="scripts/test-batch.json" --save
 */

import { harvestBusinessIntelligence } from "../src/lib/scrapers/orchestrator.ts";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export interface BatchCandidate {
  name: string;
  website?: string;
  categoryHint?: string;
  zoneHint?: string;
}

export interface BatchIngestionSummary {
  timestamp: string;
  totalCandidates: number;
  processedCount: number;
  verifiedCount: number;
  needsReviewCount: number;
  averageConfidenceScore: number;
  results: Array<{
    name: string;
    slug: string;
    category: string;
    confidenceScore: number;
    status: "verified" | "needs_manual_review" | "pending_audit";
    warnings: string[];
    hasStore: boolean;
    hasMenu: boolean;
    template: Record<string, any>;
  }>;
}

const DEMO_TARGETS: BatchCandidate[] = [
  {
    name: "DINS Santi Taura",
    website: "https://dinssantitaura.com",
    categoryHint: "gastronomia-restaurantes",
  },
  {
    name: "Kuyen Art Tattoo Palma",
    website: "https://kuyenart.com",
    categoryHint: "arte-tatuajes",
  },
  {
    name: "Box Tattoo Piercing Palma",
    website: "https://boxtattoopiercing.com",
    categoryHint: "arte-tatuajes",
  },
  {
    name: "Restaurante Sa Caleta Palma",
    categoryHint: "gastronomia-restaurantes",
  },
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runBulkIngestion(
  candidates: BatchCandidate[],
  options: { saveFiles?: boolean; delayMs?: number } = {}
): Promise<BatchIngestionSummary> {
  const delayMs = options.delayMs ?? 600;
  console.log("=".repeat(80));
  console.log(`🚀 INICIANDO MOTOR DE CARGA EN LOTES (BULK INGESTION ENGINE)`);
  console.log(`📊 Total Candidatos a Procesar: ${candidates.length}`);
  console.log(`⏱️ Intervalo de Seguridad entre Consultas: ${delayMs}ms`);
  console.log("=".repeat(80));

  const results: BatchIngestionSummary["results"] = [];
  let verifiedCount = 0;
  let needsReviewCount = 0;
  let totalScoreSum = 0;

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    console.log(`\n[${i + 1}/${candidates.length}] Procesando: "${candidate.name}"...`);

    try {
      const report = await harvestBusinessIntelligence(candidate.name, candidate.website);
      const vr = report.verificationReport;
      const score = vr.confidenceScore;
      totalScoreSum += score;

      const isVerified = vr.status === "verified";
      if (isVerified) {
        verifiedCount++;
      } else {
        needsReviewCount++;
      }

      const statusEmoji = isVerified ? "✅ VERIFICADO" : "⚠️ TRIAJE REQUERIDO";
      console.log(`  ➔ Score: ${score}% [${statusEmoji}] | Cat: ${report.detectedCategory}`);
      if (vr.warnings.length > 0) {
        console.log(`  ➔ Discrepancias: ${vr.warnings.join(" | ")}`);
      }

      results.push({
        name: candidate.name,
        slug: report.curationTemplate.slug,
        category: report.detectedCategory,
        confidenceScore: score,
        status: vr.status,
        warnings: vr.warnings,
        hasStore: !!report.curationTemplate.onlineStore?.hasOnlineStore,
        hasMenu: !!report.curationTemplate.menuUrl,
        template: report.curationTemplate,
      });

      // Pausa ética entre peticiones
      if (i < candidates.length - 1) {
        await sleep(delayMs);
      }
    } catch (err: any) {
      console.error(`  ❌ Error procesando "${candidate.name}":`, err.message);
    }
  }

  const avgScore = candidates.length > 0 ? Math.round(totalScoreSum / candidates.length) : 0;
  const summary: BatchIngestionSummary = {
    timestamp: new Date().toISOString(),
    totalCandidates: candidates.length,
    processedCount: results.length,
    verifiedCount,
    needsReviewCount,
    averageConfidenceScore: avgScore,
    results,
  };

  // Guardar Reporte en docs/BATCH_INGESTION_REPORT.json
  const reportPath = join(process.cwd(), "docs", "BATCH_INGESTION_REPORT.json");
  writeFileSync(reportPath, JSON.stringify(summary, null, 2), "utf-8");

  console.log("\n" + "=".repeat(80));
  console.log(`🏁 RESUMEN DEL LOTE PROCESADO:`);
  console.log(`  • Negocios Procesados:           ${results.length}`);
  console.log(`  • ✅ Listos para Publicar (≥85%): ${verifiedCount}`);
  console.log(`  • ⚠️ Derivados a Triaje (<85%):   ${needsReviewCount}`);
  console.log(`  • 🛡️ Puntuación Media del Lote:  ${avgScore}%`);
  console.log(`  • 📄 Reporte JSON Guardado en:   docs/BATCH_INGESTION_REPORT.json`);
  console.log("=".repeat(80));

  return summary;
}

async function main() {
  const args = process.argv.slice(2);
  let inputFile: string | undefined;
  let saveFiles = false;

  for (const arg of args) {
    if (arg.startsWith("--file=")) {
      inputFile = arg.replace("--file=", "").trim();
    } else if (arg === "--save") {
      saveFiles = true;
    }
  }

  let candidates = DEMO_TARGETS;
  if (inputFile && existsSync(inputFile)) {
    try {
      const content = readFileSync(inputFile, "utf-8");
      candidates = JSON.parse(content);
    } catch {
      console.error(`❌ Error al leer el archivo ${inputFile}, usando demo.`);
    }
  }

  await runBulkIngestion(candidates, { saveFiles });
}

if (process.argv[1]?.includes("bulk-business-ingestion")) {
  main();
}
