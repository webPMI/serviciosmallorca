import { SERVICES } from "../src/data/services/index.ts";
import type { ServiceItem } from "../src/data/services/types.ts";

export interface SectorAuditResult {
  sector: string;
  total: number;
  verifiedCount: number;
  averageRating: number;
  lowConfidenceDropRate: number; // Porcentaje de fallos o baja confianza
  isAnomalyDetected: boolean;
}

export interface QAAuditReport {
  timestamp: string;
  totalCatalogSize: number;
  sectorAudits: SectorAuditResult[];
  anomaliesFound: boolean;
  sampleAudited5Percent: Array<{ id: string; name: string; category: string; rating: number }>;
}

/**
 * Analiza la tasa de anomalías por sector y selecciona un 5% de muestra para auditoría humana
 */
export function runAnomalyAndQualityAudit(catalog: ServiceItem[] = SERVICES): QAAuditReport {
  const byCategory: Record<string, ServiceItem[]> = {};

  for (const item of catalog) {
    if (!byCategory[item.category]) {
      byCategory[item.category] = [];
    }
    byCategory[item.category].push(item);
  }

  const sectorAudits: SectorAuditResult[] = [];
  let anomaliesFound = false;

  for (const [category, items] of Object.entries(byCategory)) {
    const total = items.length;
    const verified = items.filter((i) => i.verified && (i.confidenceScore ?? 85) >= 80).length;
    const totalRatings = items.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const avgRating = total > 0 ? Number((totalRatings / total).toFixed(2)) : 0;

    // Se considera baja confianza si el score es inferior a 80 o verificationStatus es needs_review
    const lowConfidence = items.filter(
      (i) => (i.confidenceScore !== undefined && i.confidenceScore < 80) || i.verificationStatus === "needs_review",
    ).length;

    const dropRate = total > 0 ? Number(((lowConfidence / total) * 100).toFixed(1)) : 0;
    const isAnomaly = dropRate > 10;

    if (isAnomaly) {
      anomaliesFound = true;
    }

    sectorAudits.push({
      sector: category,
      total,
      verifiedCount: verified,
      averageRating: avgRating,
      lowConfidenceDropRate: dropRate,
      isAnomalyDetected: isAnomaly,
    });
  }

  // 5% Muestreo aleatorio estratificado
  const sampleSize = Math.max(1, Math.round(catalog.length * 0.05));
  const shuffled = [...catalog].sort(() => 0.5 - Math.random());
  const sample = shuffled.slice(0, sampleSize).map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    rating: s.rating || 0,
  }));

  return {
    timestamp: new Date().toISOString(),
    totalCatalogSize: catalog.length,
    sectorAudits,
    anomaliesFound,
    sampleAudited5Percent: sample,
  };
}

async function main() {
  console.log("🛡️ [QA Audit Engine] Ejecutando control de anomalías y muestreo del 5%...");
  const report = runAnomalyAndQualityAudit();

  console.log("\n==================================================");
  console.log("📊 INFORME DE CONTROL DE CALIDAD Y ANOMALÍAS");
  console.log("==================================================");
  console.log(`Catálogo Total Auditado: ${report.totalCatalogSize} negocios`);
  console.log(
    `Anomalías Detectadas (>10% drop): ${report.anomaliesFound ? "🚨 SÍ (DETENCIÓN REQUERIDA)" : "✅ NINGUNA (TODO ÍNTEGRO)"}`,
  );
  console.log(`Muestra del 5% auditada (${report.sampleAudited5Percent.length} negocios):`);
  report.sampleAudited5Percent.forEach((s, idx) => {
    console.log(`  ${idx + 1}. [${s.category}] ${s.name} (⭐ ${s.rating})`);
  });
  console.log("==================================================\n");
}

if (process.argv[1]?.endsWith("anomaly-audit.ts")) {
  main().catch(console.error);
}
