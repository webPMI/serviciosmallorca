import { SERVICES } from "../src/data/services.ts";
import { validateServicesList } from "../src/lib/validateServices.ts";

interface AuditReport {
  totalServices: number;
  openServices: number;
  seasonallyClosedServices: number;
  permanentlyClosedServices: number;
  staleVerifications: string[];
  offlineWebsites: { name: string; url: string; error: string }[];
  duplicateErrors: string[];
}

async function checkWebsiteHealth(url: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    let response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
    }

    clearTimeout(timeout);
    return { ok: response.ok || (response.status >= 200 && response.status < 400), status: response.status };
  } catch (err: any) {
    return { ok: false, error: err.name === "AbortError" ? "Timeout (>6s)" : err.message || "Fallo de conexión" };
  }
}

export async function runAudit(): Promise<AuditReport> {
  console.log("🔍 [Servicios Mallorca] Iniciando auditoría exhaustiva del catálogo...\n");

  const report: AuditReport = {
    totalServices: SERVICES.length,
    openServices: 0,
    seasonallyClosedServices: 0,
    permanentlyClosedServices: 0,
    staleVerifications: [],
    offlineWebsites: [],
    duplicateErrors: [],
  };

  // 1. Integridad y duplicados
  const validation = validateServicesList(SERVICES);
  if (!validation.valid) {
    report.duplicateErrors = validation.errors;
  }

  const now = new Date();
  const maxStaleDays = 90;

  for (const service of SERVICES) {
    // 2. Conteo de estados
    if (service.status === "open") report.openServices++;
    else if (service.status === "seasonal_closure") report.seasonallyClosedServices++;
    else if (service.status === "permanently_closed") report.permanentlyClosedServices++;

    // 3. Verificación de antigüedad (> 90 días)
    if (service.lastVerifiedAt) {
      const verifiedDate = new Date(service.lastVerifiedAt);
      const diffDays = Math.floor((now.getTime() - verifiedDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays > maxStaleDays) {
        report.staleVerifications.push(
          `${service.name} (última verificación hace ${diffDays} días: ${service.lastVerifiedAt})`,
        );
      }
    } else {
      report.staleVerifications.push(`${service.name} (sin fecha de verificación)`);
    }

    // 4. Verificación de URL oficial
    if (service.website && service.website.startsWith("http")) {
      const health = await checkWebsiteHealth(service.website);
      if (!health.ok) {
        report.offlineWebsites.push({
          name: service.name,
          url: service.website,
          error: health.error || `HTTP ${health.status}`,
        });
      }
    }
  }

  // Imprimir reporte formateado
  console.log("==================================================");
  console.log("📊 RESULTADOS DE LA AUDITORÍA DE SERVICIOS");
  console.log("==================================================");
  console.log(`📦 Total de Servicios: ${report.totalServices}`);
  console.log(`  🟢 Abiertos / Operativos: ${report.openServices}`);
  console.log(`  🟡 Cierre por Temporada:  ${report.seasonallyClosedServices}`);
  console.log(`  🔴 Cerrados Permanentemente: ${report.permanentlyClosedServices}\n`);

  if (report.duplicateErrors.length > 0) {
    console.error("❌ ERRORES DE DUPLICIDAD / CAMPOS OBLIGATORIOS:");
    report.duplicateErrors.forEach((err) => console.error(`  - ${err}`));
    console.log("");
  } else {
    console.log("✅ Cero duplicados en catálogo.");
  }

  if (report.offlineWebsites.length > 0) {
    console.warn("⚠️ SITIOS WEB OFICIALES CON ALERTAS DE DISPONIBILIDAD:");
    report.offlineWebsites.forEach((w) => console.warn(`  - ${w.name}: ${w.url} (${w.error})`));
    console.log("");
  } else {
    console.log("✅ Todos los sitios web oficiales responden correctamente.");
  }

  if (report.staleVerifications.length > 0) {
    console.warn("⚠️ SERVICIOS QUE REQUIEREN REVERIFICACIÓN (>90 días):");
    report.staleVerifications.forEach((s) => console.warn(`  - ${s}`));
    console.log("");
  } else {
    console.log("✅ Todos los servicios están verificados recientemente.");
  }

  console.log("==================================================\n");
  return report;
}

// Ejecutar si se llama directamente
if (
  import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}` ||
  process.argv[1]?.endsWith("audit-services.ts")
) {
  runAudit();
}
