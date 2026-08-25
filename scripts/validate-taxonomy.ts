/**
 * CLI de validación de la taxonomía (super-sectores, categorías, zonas y tags).
 * Uso: npm run validate:taxonomy
 * Exit code 1 si hay errores → apto para CI/pre-commit.
 */
import { validateTaxonomyIntegrity } from "../src/lib/validateTaxonomy.ts";

function main(): void {
  console.log("🗂️ [Servicios Mallorca] Validando integridad de la taxonomía...\n");

  const result = validateTaxonomyIntegrity();

  console.log("==================================================");
  console.log("📊 RESULTADOS DE LA VALIDACIÓN DE TAXONOMÍA");
  console.log("==================================================");

  if (result.valid) {
    console.log("✅ Taxonomía íntegra: sectores, categorías, zonas y tags válidos.\n");
  } else {
    console.error(`❌ ${result.errors.length} error(es) de integridad detectados:`);
    result.errors.forEach((err: string) => console.error(`  - ${err}`));
    console.log("");
  }

  if (result.warnings.length > 0) {
    console.warn(`⚠️ ${result.warnings.length} aviso(s):`);
    result.warnings.forEach((warn: string) => console.warn(`  - ${warn}`));
    console.log("");
  }

  console.log("==================================================\n");
  process.exit(result.valid ? 0 : 1);
}

main();
