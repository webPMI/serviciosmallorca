import { SERVICES } from "../src/data/services/index.ts";

console.log(`🔍 [Deep Data Scrubbing] Auditando ${SERVICES.length} negocios en el catálogo...\n`);

let suspiciousWebsites = 0;
let shortDescriptions = 0;
let missingImages = 0;
let lowConfidence = 0;

const issues: string[] = [];

for (const s of SERVICES) {
  // Check image
  if (!s.image || s.image.trim() === "" || s.image.includes("placeholder") || s.image.includes("dummy")) {
    missingImages++;
    issues.push(`[${s.slug}] Imagen inválida o ausente: "${s.image}"`);
  }

  // Check fullDescription length in ES
  const esDesc = typeof s.fullDescription === "object" ? s.fullDescription.es : s.fullDescription || "";
  if (!esDesc || esDesc.length < 150) {
    shortDescriptions++;
    issues.push(`[${s.slug}] Descripción corta (${esDesc.length} chars): "${esDesc.substring(0, 50)}..."`);
  }

  // Check confidenceScore
  const conf = s.confidenceScore ?? 100;
  if (conf < 80) {
    lowConfidence++;
    issues.push(`[${s.slug}] Confidence score bajo: ${conf}%`);
  }

  // Check website pattern
  if (s.website) {
    const url = s.website.toLowerCase();
    if (url.includes("example.com") || url.includes("test.com") || url.includes("dummy.com")) {
      suspiciousWebsites++;
      issues.push(`[${s.slug}] Dominio dummy: ${s.website}`);
    }
  }
}

console.log("==================================================");
console.log(`📊 RESULTADOS DE LA AUDITORÍA DE DATOS (${SERVICES.length} NEGOCIOS)`);
console.log("==================================================");
console.log(`- Dominios sospechosos/dummy: ${suspiciousWebsites}`);
console.log(`- Imágenes inválidas/ausentes: ${missingImages}`);
console.log(`- Descripciones < 150 caracteres: ${shortDescriptions}`);
console.log(`- Negocios con Confidence Score < 80%: ${lowConfidence}`);
console.log("==================================================");

if (issues.length > 0) {
  console.log("\n⚠️ DETALLE DE INCIDENCIAS ENCONTRADAS:");
  issues.forEach((iss) => console.log(`  - ${iss}`));
} else {
  console.log("\n✅ ¡EXCELENTE! El catálogo cumple 100% con los Hard Gates de Calidad.");
}
