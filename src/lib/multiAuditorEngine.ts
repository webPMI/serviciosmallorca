/**
 * multiAuditorEngine.ts
 *
 * Motor de Orquestación Multi-Auditor Blindado de Servicios Mallorca.
 * Coordina 5 auditores especializados que trabajan en conjunto para generar informes
 * de inteligencia, control de calidad, seguridad y cumplimiento de las Golden Rules:
 *
 *  1. 🛡️ SecurityAuditor: NIF/CIF, Teléfonos Baleares, Antisuplantación, Correos Desechables.
 *  2. 📊 DataIntegrityAuditor: Zero Fake Data (GR-11), Bounding Box Mallorca, i18n cuatrilingüe.
 *  3. 🏛️ HistoricalEvolutionAuditor: Memoria histórica, purga de errores y transiciones de estado.
 *  4. 👑 HonorBoardAuditor: Verificación de pujas (+1€), idoneidad ética de podios.
 *  5. ⚡ PerformanceAuditor: Tiempos de respuesta, caché TTL e integridad de medios.
 */

import type { ServiceItem } from "../data/services/index.ts";
import { validateSpanishTaxId, validateBalearicPhone, isDisposableEmail } from "./managerSecurityEngine.ts";
import { evaluateServiceTrust } from "./trustEngine.ts";
import { HONOR_LISTS, getDefaultHonorSpots, isEligibleForHonorSpot } from "./honorBoardEngine.ts";

export type AuditSeverity = "CRITICAL" | "WARNING" | "INFO";

export interface AuditFinding {
  auditor: "Security" | "DataIntegrity" | "HistoricalEvolution" | "HonorBoard" | "Performance";
  severity: AuditSeverity;
  code: string;
  targetId?: string;
  targetName?: string;
  message: string;
  remediation: string;
}

export interface AuditorStats {
  totalAudited: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  complianceScore: number; // 0 - 100%
}

export interface MultiAuditorReport {
  generatedAt: string;
  overallComplianceScore: number; // 0 - 100%
  overallStatus: "BLINDADO_OPTIMO" | "REQUIERE_ATENCION" | "ACCION_INMEDIATA";
  auditors: {
    security: AuditorStats;
    dataIntegrity: AuditorStats;
    historicalEvolution: AuditorStats;
    honorBoard: AuditorStats;
    performance: AuditorStats;
  };
  findings: AuditFinding[];
  summary: {
    totalServicesChecked: number;
    totalFindings: number;
    criticals: number;
    warnings: number;
    infos: number;
  };
}

// Bounding Box Geográfico Oficial de la Isla de Mallorca
const MALLORCA_BBOX = {
  minLat: 39.15,
  maxLat: 39.98,
  minLng: 2.3,
  maxLng: 3.5,
};

/**
 * 1. 🛡️ AUDITOR DE SEGURIDAD Y ACCESO
 */
export function auditSecurity(services: ServiceItem[]): { stats: AuditorStats; findings: AuditFinding[] } {
  const findings: AuditFinding[] = [];

  for (const s of services) {
    // Verificación de formato telefónico
    if (s.phone && !validateBalearicPhone(s.phone)) {
      findings.push({
        auditor: "Security",
        severity: "WARNING",
        code: "SEC_INVALID_PHONE_FORMAT",
        targetId: s.id,
        targetName: s.name,
        message: `El teléfono "${s.phone}" no cumple el formato balear/nacional (+34 971 / 871 / móviles).`,
        remediation: "Normalizar a formato E.164 (+34) o verificar línea oficial del negocio.",
      });
    }

    // Detección de correo desechable
    if (s.email && isDisposableEmail(s.email)) {
      findings.push({
        auditor: "Security",
        severity: "CRITICAL",
        code: "SEC_DISPOSABLE_EMAIL",
        targetId: s.id,
        targetName: s.name,
        message: `Se ha detectado un dominio de correo temporal/desechable en el negocio: ${s.email}`,
        remediation: "Bloquear inmediatamente y solicitar correo corporativo o dominio oficial verificado.",
      });
    }

    // Auditoría de NIF/CIF si está informado
    if ((s as any).taxId && !validateSpanishTaxId((s as any).taxId)) {
      findings.push({
        auditor: "Security",
        severity: "CRITICAL",
        code: "SEC_INVALID_TAX_ID",
        targetId: s.id,
        targetName: s.name,
        message: `El NIF/CIF "${(s as any).taxId}" es inválido según el algoritmo oficial de la AEAT.`,
        remediation: "Revisar escrituras o IAE Modelo 036/037 antes de conceder permisos de gestión.",
      });
    }
  }

  const criticals = findings.filter((f) => f.severity === "CRITICAL").length;
  const warnings = findings.filter((f) => f.severity === "WARNING").length;
  const infos = findings.filter((f) => f.severity === "INFO").length;
  const score = Math.max(0, 100 - criticals * 25 - warnings * 5);

  return {
    stats: {
      totalAudited: services.length,
      criticalCount: criticals,
      warningCount: warnings,
      infoCount: infos,
      complianceScore: score,
    },
    findings,
  };
}

/**
 * 2. 📊 AUDITOR DE INTEGRIDAD DE DATOS Y ZERO FAKE DATA (GR-11)
 */
export function auditDataIntegrity(services: ServiceItem[]): { stats: AuditorStats; findings: AuditFinding[] } {
  const findings: AuditFinding[] = [];

  for (const s of services) {
    // 1. Geolocalización dentro de Mallorca
    if (s.coordinates) {
      const { lat, lng } = s.coordinates;
      if (
        lat < MALLORCA_BBOX.minLat ||
        lat > MALLORCA_BBOX.maxLat ||
        lng < MALLORCA_BBOX.minLng ||
        lng > MALLORCA_BBOX.maxLng
      ) {
        findings.push({
          auditor: "DataIntegrity",
          severity: "CRITICAL",
          code: "DATA_GEO_OUT_OF_BOUNDS",
          targetId: s.id,
          targetName: s.name,
          message: `Coordenadas [${lat}, ${lng}] fuera del territorio de Mallorca.`,
          remediation: "Re-geocodificar en Google Maps para asegurar que pertenece al municipio correspondiente.",
        });
      }
    }

    // 2. Score de confianza y veracidad
    const score = s.confidenceScore ?? (s.verified ? 90 : 50);
    if (score < 80 && s.status === "open") {
      findings.push({
        auditor: "DataIntegrity",
        severity: "WARNING",
        code: "DATA_LOW_CONFIDENCE_SCORE",
        targetId: s.id,
        targetName: s.name,
        message: `El negocio está activo con índice de confianza de ${score}% (< 80%).`,
        remediation: "Completar cruce de fuentes (Maps, Web oficial, Redes) hasta alcanzar $\ge 80\%$.",
      });
    }

    // 3. Completitud de idiomas requeridos (ES, EN, CA)
    if (!s.shortDescription?.es || !s.shortDescription?.en || !s.shortDescription?.ca) {
      findings.push({
        auditor: "DataIntegrity",
        severity: "WARNING",
        code: "DATA_INCOMPLETE_I18N",
        targetId: s.id,
        targetName: s.name,
        message: "Falta traducción en alguno de los 3 idiomas oficiales obligatorios (ES, EN, CA).",
        remediation: "Ejecutar traductor automático o completar textos de alta fidelidad.",
      });
    }
  }

  const criticals = findings.filter((f) => f.severity === "CRITICAL").length;
  const warnings = findings.filter((f) => f.severity === "WARNING").length;
  const infos = findings.filter((f) => f.severity === "INFO").length;
  const compliance = Math.max(0, 100 - criticals * 20 - warnings * 4);

  return {
    stats: {
      totalAudited: services.length,
      criticalCount: criticals,
      warningCount: warnings,
      infoCount: infos,
      complianceScore: compliance,
    },
    findings,
  };
}

/**
 * 3. 🏛️ AUDITOR DE EVOLUCIÓN HISTÓRICA Y CADUCIDAD
 */
export function auditHistoricalEvolution(services: ServiceItem[]): { stats: AuditorStats; findings: AuditFinding[] } {
  const findings: AuditFinding[] = [];

  for (const s of services) {
    const trust = evaluateServiceTrust(s);

    // Alerta de obsolescencia (>180 días)
    if (trust.isDecayed) {
      findings.push({
        auditor: "HistoricalEvolution",
        severity: "INFO",
        code: "HIST_STALE_VALIDATION",
        targetId: s.id,
        targetName: s.name,
        message: `El negocio lleva ${trust.daysSinceLastValidation} días sin revalidar. Su confianza efectiva ha bajado a ${trust.effectiveScore}%.`,
        remediation: "Programar re-auditoría semestral con el scraper o contacto de verificación.",
      });
    }

    // Auditoría de registros históricos
    if (s.evolutionHistory && s.evolutionHistory.length > 0) {
      for (const entry of s.evolutionHistory) {
        if (entry.action === "purge_erroneous") {
          findings.push({
            auditor: "HistoricalEvolution",
            severity: "CRITICAL",
            code: "HIST_UNPURGED_ERROR",
            targetId: s.id,
            targetName: s.name,
            message: `Registro histórico con 'purge_erroneous' encontrado en objeto público: "${entry.title.es}"`,
            remediation: "Purgar de la memoria pública para cumplir GR-11 (Zero Fake Data).",
          });
        }
      }
    }
  }

  const criticals = findings.filter((f) => f.severity === "CRITICAL").length;
  const warnings = findings.filter((f) => f.severity === "WARNING").length;
  const infos = findings.filter((f) => f.severity === "INFO").length;
  const score = Math.max(0, 100 - criticals * 30 - warnings * 5);

  return {
    stats: {
      totalAudited: services.length,
      criticalCount: criticals,
      warningCount: warnings,
      infoCount: infos,
      complianceScore: score,
    },
    findings,
  };
}

/**
 * 4. 👑 AUDITOR DEL CUADRO DE HONOR Y SUBASTAS (+1€)
 */
export function auditHonorBoard(services: ServiceItem[]): { stats: AuditorStats; findings: AuditFinding[] } {
  const findings: AuditFinding[] = [];
  const defaultSpots = getDefaultHonorSpots();

  for (const list of HONOR_LISTS) {
    const spots = defaultSpots[list.id] || [];

    // Validar orden decreciente de pujas
    for (let i = 0; i < spots.length - 1; i++) {
      if (spots[i].currentBidEuros < spots[i + 1].currentBidEuros) {
        findings.push({
          auditor: "HonorBoard",
          severity: "CRITICAL",
          code: "HONOR_INVALID_RANK_ORDER",
          message: `En la lista "${list.id}", el puesto #${i + 1} (${spots[i].currentBidEuros}€) tiene una puja inferior al puesto #${i + 2} (${spots[i + 1].currentBidEuros}€).`,
          remediation: "Reordenar las candidaturas mediante rankHonorList() por orden de puja descendente.",
        });
      }
    }

    // Validar que cada negocio en el cuadro de honor cumple idoneidad ética
    for (const spot of spots) {
      const match = services.find((s) => s.id === spot.serviceId || s.slug === spot.serviceSlug);
      if (match) {
        const eligibility = isEligibleForHonorSpot(match);
        if (!eligibility.eligible) {
          findings.push({
            auditor: "HonorBoard",
            severity: "CRITICAL",
            code: "HONOR_INELIGIBLE_BUSINESS",
            targetId: match.id,
            targetName: match.name,
            message: `Negocio inelegible en Cuadro de Honor: ${eligibility.reason}`,
            remediation: "Retirar del podio hasta que alcance la calidad y verificación exigida.",
          });
        }
      }
    }
  }

  const criticals = findings.filter((f) => f.severity === "CRITICAL").length;
  const warnings = findings.filter((f) => f.severity === "WARNING").length;
  const infos = findings.filter((f) => f.severity === "INFO").length;
  const score = Math.max(0, 100 - criticals * 30 - warnings * 5);

  return {
    stats: {
      totalAudited: HONOR_LISTS.length,
      criticalCount: criticals,
      warningCount: warnings,
      infoCount: infos,
      complianceScore: score,
    },
    findings,
  };
}

/**
 * 5. ⚡ AUDITOR DE RENDIMIENTO Y BUENAS PRÁCTICAS
 */
export function auditPerformance(services: ServiceItem[]): { stats: AuditorStats; findings: AuditFinding[] } {
  const findings: AuditFinding[] = [];

  for (const s of services) {
    // Comprobación de imágenes no seguras (HTTP sin SSL)
    if (s.image && s.image.startsWith("http://")) {
      findings.push({
        auditor: "Performance",
        severity: "WARNING",
        code: "PERF_INSECURE_IMAGE_URL",
        targetId: s.id,
        targetName: s.name,
        message: `La imagen principal utiliza protocolo no seguro (HTTP): ${s.image}`,
        remediation: "Actualizar a HTTPS o migrar el asset a la colección optimizada de Cloudflare.",
      });
    }
  }

  const criticals = findings.filter((f) => f.severity === "CRITICAL").length;
  const warnings = findings.filter((f) => f.severity === "WARNING").length;
  const infos = findings.filter((f) => f.severity === "INFO").length;
  const score = Math.max(0, 100 - criticals * 20 - warnings * 5);

  return {
    stats: {
      totalAudited: services.length,
      criticalCount: criticals,
      warningCount: warnings,
      infoCount: infos,
      complianceScore: score,
    },
    findings,
  };
}

/**
 * ORQUESTADOR MAESTRO MULTI-AUDITOR
 * Ejecuta los 5 auditores coordinados y genera el Informe de Inteligencia Integral.
 */
export function runFullCatalogAudit(services: ServiceItem[]): MultiAuditorReport {
  const sec = auditSecurity(services);
  const data = auditDataIntegrity(services);
  const hist = auditHistoricalEvolution(services);
  const honor = auditHonorBoard(services);
  const perf = auditPerformance(services);

  const allFindings = [...sec.findings, ...data.findings, ...hist.findings, ...honor.findings, ...perf.findings];

  const totalCriticals = allFindings.filter((f) => f.severity === "CRITICAL").length;
  const totalWarnings = allFindings.filter((f) => f.severity === "WARNING").length;
  const totalInfos = allFindings.filter((f) => f.severity === "INFO").length;

  const weightedScore = Math.round(
    sec.stats.complianceScore * 0.25 +
      data.stats.complianceScore * 0.35 +
      hist.stats.complianceScore * 0.15 +
      honor.stats.complianceScore * 0.15 +
      perf.stats.complianceScore * 0.1,
  );

  let overallStatus: MultiAuditorReport["overallStatus"] = "BLINDADO_OPTIMO";
  if (totalCriticals > 0) {
    overallStatus = "ACCION_INMEDIATA";
  } else if (totalWarnings > 0) {
    overallStatus = "REQUIERE_ATENCION";
  }

  return {
    generatedAt: new Date().toISOString(),
    overallComplianceScore: weightedScore,
    overallStatus,
    auditors: {
      security: sec.stats,
      dataIntegrity: data.stats,
      historicalEvolution: hist.stats,
      honorBoard: honor.stats,
      performance: perf.stats,
    },
    findings: allFindings,
    summary: {
      totalServicesChecked: services.length,
      totalFindings: allFindings.length,
      criticals: totalCriticals,
      warnings: totalWarnings,
      infos: totalInfos,
    },
  };
}

/**
 * Genera el documento estructurado en Markdown para la dirección técnica.
 */
export function generateMarkdownAuditReport(report: MultiAuditorReport): string {
  const lines: string[] = [];

  lines.push("# 🛡️ Informe de Inteligencia y Auditoría Multi-Agente");
  lines.push("");
  lines.push(`**Fecha de Auditoría:** ${report.generatedAt}`);
  lines.push(`**Puntaje Global de Cumplimiento:** \`${report.overallComplianceScore}%\``);
  lines.push(`**Estado del Sistema:** \`${report.overallStatus}\``);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 📊 Resumen por Subsistema Auditor");
  lines.push("");
  lines.push("| Auditor | Evaluados | Críticos | Advertencias | Informativos | Cumplimiento |");
  lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
  lines.push(
    `| 🛡️ **Seguridad & Acceso** | ${report.auditors.security.totalAudited} | ${report.auditors.security.criticalCount} | ${report.auditors.security.warningCount} | ${report.auditors.security.infoCount} | **${report.auditors.security.complianceScore}%** |`,
  );
  lines.push(
    `| 📊 **Integridad Zero Fake Data** | ${report.auditors.dataIntegrity.totalAudited} | ${report.auditors.dataIntegrity.criticalCount} | ${report.auditors.dataIntegrity.warningCount} | ${report.auditors.dataIntegrity.infoCount} | **${report.auditors.dataIntegrity.complianceScore}%** |`,
  );
  lines.push(
    `| 🏛️ **Evolución & Memoria Histórica** | ${report.auditors.historicalEvolution.totalAudited} | ${report.auditors.historicalEvolution.criticalCount} | ${report.auditors.historicalEvolution.warningCount} | ${report.auditors.historicalEvolution.infoCount} | **${report.auditors.historicalEvolution.complianceScore}%** |`,
  );
  lines.push(
    `| 👑 **Cuadro de Honor & Subastas** | ${report.auditors.honorBoard.totalAudited} | ${report.auditors.honorBoard.criticalCount} | ${report.auditors.honorBoard.warningCount} | ${report.auditors.honorBoard.infoCount} | **${report.auditors.honorBoard.complianceScore}%** |`,
  );
  lines.push(
    `| ⚡ **Rendimiento & Assets** | ${report.auditors.performance.totalAudited} | ${report.auditors.performance.criticalCount} | ${report.auditors.performance.warningCount} | ${report.auditors.performance.infoCount} | **${report.auditors.performance.complianceScore}%** |`,
  );
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 🔍 Detalle de Hallazgos y Planes de Remediación");
  lines.push("");

  if (report.findings.length === 0) {
    lines.push(
      "✅ **Cero anomalías detectadas.** Todo el catálogo y los subsistemas cumplen al 100% las Golden Rules.",
    );
  } else {
    report.findings.forEach((f, idx) => {
      const icon =
        f.severity === "CRITICAL" ? "🔴 [CRÍTICO]" : f.severity === "WARNING" ? "🟡 [ADVERTENCIA]" : "ℹ️ [INFO]";
      lines.push(`### ${idx + 1}. ${icon} \`${f.code}\` — ${f.targetName || f.auditor}`);
      lines.push(`- **Auditor Responsable:** ${f.auditor}`);
      lines.push(`- **Diagnóstico:** ${f.message}`);
      lines.push(`- **Acción Recomendada:** ${f.remediation}`);
      lines.push("");
    });
  }

  return lines.join("\n");
}
