/**
 * scripts/validate-sports.ts
 *
 * CLI de Validación Estricta para la Vertical de Deportes e Instalaciones Deportivas.
 * Aplica los mismos estándares inmutables de calidad (GR-01 a GR-17, GR-11 Zero Fake Data):
 *  - Unicidad de IDs, slugs, nombres e imágenes.
 *  - Bounding Box geográfico de Mallorca.
 *  - Integridad de Zonas contra MALLORCA_ZONES.
 *  - Existencia real de ficheros de imagen en disco (/public).
 *  - Ausencia de teléfonos sintéticos/secuenciales falsos (GR-11).
 *  - URLs con HTTPS obligatorio.
 *
 * Uso: npm run validate:sports
 * Exit code 1 si hay errores -> apto para CI/CD y prepush.
 */

import fs from "node:fs";
import path from "node:path";
import { SPORTS_FACILITIES } from "../src/data/sports/facilities.ts";
import { validateSportsFacilitiesList } from "../src/lib/validateSportsFacilities.ts";
import { SERVICES } from "../src/data/services/index.ts";

function main(): void {
  console.log("⚡ [Servicios Mallorca] Validando integridad de la Vertical de Deportes...\n");

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validar lista de instalaciones deportivas
  const facilityResult = validateSportsFacilitiesList(SPORTS_FACILITIES);
  errors.push(...facilityResult.errors);
  warnings.push(...facilityResult.warnings);

  // 2. Validar existencia física de imágenes en disco para cada instalación deportiva
  const publicDir = path.resolve(process.cwd(), "public");
  for (const facility of SPORTS_FACILITIES) {
    if (facility.image && facility.image.startsWith("/")) {
      const relPath = facility.image.replace(/^\//, "");
      const fullPath = path.join(publicDir, relPath);
      if (!fs.existsSync(fullPath)) {
        errors.push(`Imagen no encontrada en disco para "${facility.name}": "${facility.image}"`);
      }
    }
    for (const galImg of facility.gallery ?? []) {
      if (galImg && galImg.startsWith("/")) {
        const relPath = galImg.replace(/^\//, "");
        const fullPath = path.join(publicDir, relPath);
        if (!fs.existsSync(fullPath)) {
          warnings.push(`Imagen de galería no encontrada en disco para "${facility.name}": "${galImg}"`);
        }
      }
    }
  }

  // 3. Validar cross-sell references de instalaciones a servicios comerciales
  const knownServiceSlugs = new Set(SERVICES.map((s) => s.slug));
  for (const facility of SPORTS_FACILITIES) {
    for (const rec of facility.crossSellRecommendations ?? []) {
      if (!knownServiceSlugs.has(rec.serviceSlug)) {
        warnings.push(`Recomendación cross-sell en "${facility.name}" apunta a slug desconocido: "${rec.serviceSlug}"`);
      }
    }
  }

  // 4. Reporte por consola
  console.log("==================================================");
  console.log("📊 RESULTADOS DE LA VALIDACIÓN DE DEPORTES");
  console.log("==================================================");
  console.log(`🏟️ Total de instalaciones auditadas: ${SPORTS_FACILITIES.length}`);

  if (errors.length === 0) {
    console.log("✅ Cero discrepancias: Todas las instalaciones son 100% verídicas y cumplen los estándares.\n");
  } else {
    console.error(`❌ ${errors.length} error(es) detectados:`);
    errors.forEach((err) => console.error(`  - ${err}`));
    console.log("");
  }

  if (warnings.length > 0) {
    console.warn(`⚠️ ${warnings.length} aviso(s):`);
    warnings.forEach((warn) => console.warn(`  - ${warn}`));
    console.log("");
  }

  console.log("==================================================\n");
  process.exit(errors.length === 0 ? 0 : 1);
}

main();
