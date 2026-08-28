/**
 * scripts/run-full-audit.ts
 *
 * Ejecutor CLI de la Auditoría Integral Multi-Agente de Servicios Mallorca.
 * Audita todos los servicios del catálogo, genera logs detallados y guarda
 * el reporte en docs/AUDIT_INTELLIGENCE_REPORT.md.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SERVICES } from "../src/data/services/index.ts";
import { runFullCatalogAudit, generateMarkdownAuditReport } from "../src/lib/multiAuditorEngine.ts";

async function main() {
  console.log("🛡️ [Servicios Mallorca] Iniciando Auditoría Blindada Multi-Agente...");
  console.log(`📊 Catálogo cargado: ${SERVICES.length} servicios.\n`);

  const report = runFullCatalogAudit(SERVICES);

  console.log("==================================================");
  console.log(`🏆 Puntaje Global de Cumplimiento: ${report.overallComplianceScore}%`);
  console.log(`🚦 Estado del Sistema: ${report.overallStatus}`);
  console.log("==================================================");
  console.log(
    `🛡️ Seguridad:               ${report.auditors.security.complianceScore}% (Críticos: ${report.auditors.security.criticalCount}, Avisos: ${report.auditors.security.warningCount})`,
  );
  console.log(
    `📊 Integridad (GR-11):       ${report.auditors.dataIntegrity.complianceScore}% (Críticos: ${report.auditors.dataIntegrity.criticalCount}, Avisos: ${report.auditors.dataIntegrity.warningCount})`,
  );
  console.log(
    `🏛️ Evolución Histórica:     ${report.auditors.historicalEvolution.complianceScore}% (Críticos: ${report.auditors.historicalEvolution.criticalCount}, Avisos: ${report.auditors.historicalEvolution.warningCount})`,
  );
  console.log(
    `👑 Cuadro de Honor:          ${report.auditors.honorBoard.complianceScore}% (Críticos: ${report.auditors.honorBoard.criticalCount}, Avisos: ${report.auditors.honorBoard.warningCount})`,
  );
  console.log(
    `⚡ Rendimiento & Assets:     ${report.auditors.performance.complianceScore}% (Críticos: ${report.auditors.performance.criticalCount}, Avisos: ${report.auditors.performance.warningCount})`,
  );
  console.log("==================================================\n");

  if (report.findings.length > 0) {
    console.log(`🔍 Total de Hallazgos Detectados: ${report.findings.length}`);
    report.findings.slice(0, 10).forEach((f, idx) => {
      const color = f.severity === "CRITICAL" ? "🔴" : f.severity === "WARNING" ? "🟡" : "ℹ️";
      console.log(`  ${idx + 1}. ${color} [${f.auditor}] ${f.code} (${f.targetName || "General"}): ${f.message}`);
    });
    if (report.findings.length > 10) {
      console.log(`  ... y ${report.findings.length - 10} hallazgos adicionales.`);
    }
  } else {
    console.log("✅ Cero discrepancias. Todo el sistema opera bajo los más altos estándares de calidad.");
  }

  // Generar reporte en Markdown
  const mdReport = generateMarkdownAuditReport(report);
  const outputPath = resolve(process.cwd(), "docs", "AUDIT_INTELLIGENCE_REPORT.md");
  writeFileSync(outputPath, mdReport, "utf8");

  console.log(`\n📄 Reporte de inteligencia exportado a: ${outputPath}`);
}

main().catch((err) => {
  console.error("❌ Error ejecutando la auditoría:", err);
  process.exit(1);
});
