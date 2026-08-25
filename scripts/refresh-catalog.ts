import { SERVICES } from "../src/data/services/index.ts";
import { auditBusinessData, isCoordinateWithinMallorca } from "../src/lib/verificationEngine.ts";

interface HealthCheckResult {
  id: string;
  name: string;
  category: string;
  website: string;
  webStatus: "200_OK" | "UNREACHABLE" | "REDIRECT" | "ERROR";
  phone: string;
  coordinatesValid: boolean;
  confidenceScore: number;
  lastVerifiedAt: string;
  needsRefresh: boolean;
  warnings: string[];
}

/**
 * Script de refresco automático y auditoría de salud del catálogo de negocios.
 */
async function runCatalogRefreshAudit() {
  console.log("\n=======================================================");
  console.log("🔄 [SERVICIOS MALLORCA] CICLO DE REFRESCO Y SALUD DEL CATÁLOGO");
  console.log("=======================================================\n");

  const results: HealthCheckResult[] = [];
  const now = new Date();

  for (const service of SERVICES) {
    const warnings: string[] = [];

    // 1. Verificación de antigüedad de verificación
    let needsRefresh = false;
    if (service.lastVerifiedAt) {
      const verifiedDate = new Date(service.lastVerifiedAt);
      const diffDays = Math.round((now.getTime() - verifiedDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays > 30) {
        needsRefresh = true;
        warnings.push(`Datos no verificados desde hace ${diffDays} días.`);
      }
    } else {
      needsRefresh = true;
      warnings.push("Falta fecha de última verificación (lastVerifiedAt).");
    }

    // 2. Verificación de coordenadas dentro de Mallorca
    const { lat, lng } = service.coordinates;
    const coordinatesValid = isCoordinateWithinMallorca(lat, lng);
    if (!coordinatesValid) {
      warnings.push(`Coordenadas fuera del polígono insular de Mallorca: (${lat}, ${lng})`);
    }

    // 3. Verificación de disponibilidad de sitio web oficial
    let webStatus: "200_OK" | "UNREACHABLE" | "REDIRECT" | "ERROR" = "ERROR";
    if (service.website) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(service.website, {
          method: "HEAD",
          signal: controller.signal,
          headers: {
            "User-Agent": "ServiciosMallorcaAudit/1.0",
          },
        });
        clearTimeout(timeout);

        if (res.status >= 200 && res.status < 300) {
          webStatus = "200_OK";
        } else if (res.status >= 300 && res.status < 400) {
          webStatus = "REDIRECT";
        } else {
          webStatus = "ERROR";
          warnings.push(`Sitio web respondió con status HTTP ${res.status}`);
        }
      } catch (err: any) {
        webStatus = "UNREACHABLE";
        warnings.push(`No se pudo conectar a la web: ${err.message || "Timeout"}`);
      }
    } else {
      warnings.push("No tiene sitio web oficial configurado.");
    }

    // 4. Cálculo de Confidence Score actualizado
    const auditRes = auditBusinessData({
      name: service.name,
      category: service.category,
      zone: service.zone,
      address: service.address,
      website: service.website,
      phone: service.phone,
      coordinates: service.coordinates,
      socialLinks: service.socialLinks,
      rating: service.rating ?? undefined,
      reviewCount: service.reviewCount ?? undefined,
    });

    results.push({
      id: service.id,
      name: service.name,
      category: service.category,
      website: service.website,
      webStatus,
      phone: service.phone || "N/A",
      coordinatesValid,
      confidenceScore: auditRes.confidenceScore,
      lastVerifiedAt: service.lastVerifiedAt || "Desconocida",
      needsRefresh,
      warnings,
    });
  }

  // Resumen del reporte
  console.table(
    results.map((r) => ({
      Negocio: r.name.slice(0, 26),
      Web: r.webStatus,
      Score: `${r.confidenceScore}%`,
      GPS: r.coordinatesValid ? "✅ OK" : "❌ OUT",
      "Últ. Verif.": r.lastVerifiedAt,
      Estado: r.warnings.length === 0 ? "🟢 100% OK" : `⚠️ ${r.warnings.length} Alertas`,
    })),
  );

  const total = results.length;
  const greenCount = results.filter((r) => r.warnings.length === 0).length;
  const warningCount = total - greenCount;

  console.log("\n-------------------------------------------------------");
  console.log(`📊 TOTAL AUDITADOS: ${total} negocios`);
  console.log(`✅ EN PERFECTO ESTADO: ${greenCount} (${Math.round((greenCount / total) * 100)}%)`);
  console.log(`⚠️ CON ALERTAS DE MANTENIMIENTO: ${warningCount}`);
  console.log("=======================================================\n");

  return results;
}

if (process.argv[1]?.includes("refresh-catalog")) {
  runCatalogRefreshAudit().catch(console.error);
}

export { runCatalogRefreshAudit };
