import * as fs from "node:fs";
import * as path from "node:path";
import { auditBusinessData, type VerificationInput, type VerificationReport } from "../src/lib/verificationEngine.ts";

export interface BatchProcessingSummary {
  totalProcessed: number;
  approvedCount: number;
  needsReviewCount: number;
  averageConfidenceScore: number;
  sectorDistribution: Record<string, number>;
  itemsApproved: Array<{ name: string; score: number; category: string }>;
  itemsNeedsReview: Array<{ name: string; score: number; reasons: string[] }>;
}

/**
 * Procesa un lote de negocios crudos y los categoriza según la regla GR-11 (Zero Fake Data)
 */
export function processRawBusinessBatch(rawItems: VerificationInput[]): BatchProcessingSummary {
  let totalScore = 0;
  const approved: Array<{ name: string; score: number; category: string }> = [];
  const needsReview: Array<{ name: string; score: number; reasons: string[] }> = [];
  const sectorDist: Record<string, number> = {};

  for (const item of rawItems) {
    const report: VerificationReport = auditBusinessData(item);
    totalScore += report.confidenceScore;
    sectorDist[item.category] = (sectorDist[item.category] || 0) + 1;

    if (report.confidenceScore >= 80 && report.status === "verified") {
      approved.push({
        name: item.name,
        score: report.confidenceScore,
        category: item.category,
      });
    } else {
      needsReview.push({
        name: item.name,
        score: report.confidenceScore,
        reasons: report.warnings.length > 0 ? report.warnings : ["Confidence Score inferior al 80%"],
      });
    }
  }

  const total = rawItems.length;
  return {
    totalProcessed: total,
    approvedCount: approved.length,
    needsReviewCount: needsReview.length,
    averageConfidenceScore: total > 0 ? Math.round(totalScore / total) : 0,
    sectorDistribution: sectorDist,
    itemsApproved: approved,
    itemsNeedsReview: needsReview,
  };
}

// Ejecución directa por CLI
async function runBatchIngestCLI() {
  const landingDir = path.resolve(process.cwd(), "src/data/raw_landing");
  if (!fs.existsSync(landingDir)) {
    fs.mkdirSync(landingDir, { recursive: true });
  }

  console.log("📦 [Batch Ingest] Escaneando zona de aterrizaje:", landingDir);

  const rawFiles = fs.readdirSync(landingDir).filter((f) => f.endsWith(".json"));

  if (rawFiles.length === 0) {
    console.log("ℹ️ No hay archivos pendientes en la zona de aterrizaje. Creando lote de demostración...");
    const sampleBatch: VerificationInput[] = [
      {
        name: "Restaurante Ca n'Aina",
        category: "gastronomia-catering",
        zone: "palma",
        address: "Carrer de la Mar, 12, Palma",
        coordinates: { lat: 39.5696, lng: 2.6502 },
        website: "https://canaina-demo.es",
        phone: "+34 971 10 20 30",
        extractedWebPhone: "+34 971 10 20 30",
        extractedMapsPhone: "+34 971 10 20 30",
        reviewCount: 450,
        rating: 4.6,
        webHttpStatus: 200,
      },
      {
        name: "Padel Club Son Vida Test",
        category: "servicios-profesionales",
        zone: "palma",
        address: "Urbanización Son Vida, Palma",
        coordinates: { lat: 39.5896, lng: 2.6002 },
        website: "https://padelsonvida-demo.es",
        phone: "+34 971 88 99 00",
        extractedWebPhone: "+34 971 88 99 00",
        extractedMapsPhone: "+34 971 88 99 00",
        reviewCount: 220,
        rating: 4.7,
        webHttpStatus: 200,
      },
    ];

    const result = processRawBusinessBatch(sampleBatch);
    console.log("\n==================================================");
    console.log("📊 RESULTADOS DEL PROCESAMIENTO EN LOTE");
    console.log("==================================================");
    console.log(`Total procesados: ${result.totalProcessed}`);
    console.log(`Aprobados (Score >= 80%): ${result.approvedCount}`);
    console.log(`En cola de revisión: ${result.needsReviewCount}`);
    console.log(`Score medio de confianza: ${result.averageConfidenceScore}%`);
    console.log("==================================================\n");
  }
}

if (process.argv[1]?.endsWith("batch-ingest.ts")) {
  runBatchIngestCLI().catch(console.error);
}
