import { SERVICES } from "../src/data/services/index.ts";
import { validateImageQuality } from "../src/lib/verificationEngine.ts";

export interface ImageAuditItem {
  id: string;
  name: string;
  category: string;
  image: string;
  isValid: boolean;
  issue?: string;
  hasGallery: boolean;
  galleryCount: number;
}

export interface ImageCatalogAuditReport {
  totalServices: number;
  validImagesCount: number;
  invalidImagesCount: number;
  coveragePercentage: number;
  issuesList: ImageAuditItem[];
}

export function auditCatalogImages(): ImageCatalogAuditReport {
  const issues: ImageAuditItem[] = [];
  let validCount = 0;

  for (const service of SERVICES) {
    const quality = validateImageQuality(service.image);
    const hasGallery = Boolean(service.gallery && service.gallery.length > 0);
    const galleryCount = service.gallery?.length || 0;

    if (!quality.isValid) {
      issues.push({
        id: service.id,
        name: service.name,
        category: service.category,
        image: service.image || "(vacía)",
        isValid: false,
        issue: quality.reason || "Imagen no válida",
        hasGallery,
        galleryCount,
      });
    } else {
      validCount++;
    }
  }

  const total = SERVICES.length;
  return {
    totalServices: total,
    validImagesCount: validCount,
    invalidImagesCount: issues.length,
    coveragePercentage: total > 0 ? Number(((validCount / total) * 100).toFixed(1)) : 0,
    issuesList: issues,
  };
}

async function runImageAuditCLI() {
  console.log("📸 [Image Harvester & Quality Audit] Auditando imágenes del catálogo...");
  const report = auditCatalogImages();

  console.log("\n==================================================");
  console.log("📊 INFORME DE COBERTURA Y CALIDAD DE IMÁGENES");
  console.log("==================================================");
  console.log(`Total Negocios en Catálogo: ${report.totalServices}`);
  console.log(`Imágenes Válidas y Reales: ${report.validImagesCount}`);
  console.log(`Imágenes con Errores o Vacías: ${report.invalidImagesCount}`);
  console.log(`Cobertura de Imágenes: ${report.coveragePercentage}%`);

  if (report.invalidImagesCount > 0) {
    console.log("\n🚨 Negocios que requieren corrección de imagen:");
    report.issuesList.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. [${issue.id}] ${issue.name} (${issue.category}) ➔ ${issue.issue}`);
    });
  } else {
    console.log("\n✅ 100% de los negocios cuentan con imágenes verificadas y libres de placeholders.");
  }
  console.log("==================================================\n");
}

if (process.argv[1]?.endsWith("audit-and-harvest-images.ts")) {
  runImageAuditCLI().catch(console.error);
}
