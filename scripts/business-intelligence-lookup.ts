#!/usr/bin/env node
/**
 * scripts/business-intelligence-lookup.ts
 *
 * CLI Harvester de Inteligencia y Triple Verificación Cruzada para Negocios en Mallorca.
 * Delegado modularmente a src/lib/scrapers/ (baseScraper, socialScraper, restaurantScraper, artCultureScraper, serviceScraper).
 *
 * Uso:
 *   npx tsx scripts/business-intelligence-lookup.ts "DINS Santi Taura" --url="https://dinssantitaura.com"
 *   npx tsx scripts/business-intelligence-lookup.ts "Box Tattoo Piercing Palma" --url="https://boxtattoopiercing.com"
 */

import { harvestBusinessIntelligence } from "../src/lib/scrapers/orchestrator.ts";

async function main() {
  const rawArgs = process.argv.slice(2);
  let websiteUrl: string | undefined;
  const queryParts: string[] = [];

  for (const arg of rawArgs) {
    if (arg.startsWith("--url=")) {
      websiteUrl = arg.replace("--url=", "").trim();
    } else {
      queryParts.push(arg);
    }
  }

  const query = queryParts.join(" ").trim() || "Kuyen Art Tattoo Palma";

  console.log("=".repeat(80));
  console.log(`🔎 MINERÍA DE INTELIGENCIA EXTENDIDA, MULTI-MAPAS & REDES: "${query}"`);
  if (websiteUrl) console.log(`🌐 Website Oficial Analizado: ${websiteUrl}`);
  console.log("=".repeat(80));

  const report = await harvestBusinessIntelligence(query, websiteUrl);

  console.log(`\n📂 SECTOR DETECTADO: [${report.detectedCategory.toUpperCase()}]`);

  console.log("\n📍 1. ENLACES DIRECTOS A MAPAS Y BÚSQUEDA DE RESEÑAS:");
  console.log(`  • Google Maps Ficha:   ${report.mapsPresence.googleMapsSearchUrl}`);
  console.log(`  • Google Reviews Deep: ${report.mapsPresence.googleReviewsSearchUrl}`);
  console.log(`  • Apple Maps Ficha:    ${report.mapsPresence.appleMapsSearchUrl}`);
  console.log(`  • Bing Maps Ficha:     ${report.mapsPresence.bingMapsSearchUrl}`);

  console.log("\n📸 2. MULTIMEDIA OFICIAL DETECTADO:");
  if (report.extractedMedia.ogImage) {
    console.log(`  • Imagen Principal (OpenGraph): ${report.extractedMedia.ogImage}`);
  }
  if (report.extractedMedia.favicon) {
    console.log(`  • Logotipo / Favicon:          ${report.extractedMedia.favicon}`);
  }
  if (report.extractedMedia.galleryImages.length > 0) {
    console.log(`  • Galería de Fotos (${report.extractedMedia.galleryImages.length}):`);
    report.extractedMedia.galleryImages.forEach((img, i) => console.log(`    [${i + 1}] ${img}`));
  }

  console.log("\n📱 3. REDES SOCIALES OFICIALES DETECTADAS (Web Scrape):");
  if (Object.keys(report.detectedSocialLinks).length > 0) {
    Object.entries(report.detectedSocialLinks).forEach(([net, url]) => {
      console.log(`  • ${net.toUpperCase()}: ${url}`);
    });
  } else {
    console.log("  • (No se encontraron enlaces embebidos directos en el HTML de la web)");
  }

  console.log("\n🔎 3.1. DORKS DE BÚSQUEDA DIRECTA PARA REDES & AUTORIDAD:");
  report.socialAndAuthorityDorks.forEach((d) => {
    console.log(`  • ${d.platform}: ${d.searchUrl}`);
  });

  console.log("\n💳 4. MÉTODOS DE PAGO Y COMODIDADES DETECTADAS:");
  console.log(`  • Métodos de Pago: ${report.detectedPaymentMethods.join(", ")}`);
  console.log(`  • Comodidades:     ${report.detectedAmenities.join(", ")}`);

  if (report.curationTemplate.onlineStore) {
    console.log("\n🛍️ 4.1. TIENDA ONLINE & PRODUCTOS EXTRAÍDOS (E-Commerce):");
    console.log(`  • Plataforma: ${report.curationTemplate.onlineStore.platform.toUpperCase()}`);
    console.log(`  • URL Catálogo: ${report.curationTemplate.onlineStore.url}`);
    if (report.curationTemplate.products && report.curationTemplate.products.length > 0) {
      console.log(`  • Productos Destacados (${report.curationTemplate.products.length}):`);
      report.curationTemplate.products.forEach((p: any, idx: number) => {
        console.log(`    [${idx + 1}] ${p.name.es} (${p.price}) ➔ ${p.url || "En tienda"}`);
      });
    }
  }

  if (report.curationTemplate.menuUrl) {
    console.log("\n🍽️ 4.2. CARTA DIGITAL / MENÚ DETECTADO:");
    console.log(`  • Enlace Directo a Carta: ${report.curationTemplate.menuUrl}`);
  }

  if (report.curationTemplate.specialties && report.curationTemplate.specialties.length > 0) {
    console.log("\n⭐ 4.3. ESPECIALIDADES DETECTADAS:");
    report.curationTemplate.specialties.forEach((s: string) => console.log(`  • ${s}`));
  }

  console.log("\n🗂️ 5. INDEXACIÓN EN DIRECTORIOS Y OTRAS WEBS BALEARES:");
  report.directoryIndexingDorks.forEach((d) => {
    console.log(`  • ${d.directoryName}: ${d.searchUrl}`);
  });

  console.log("\n📰 6. PRENSA Y REPUTACIÓN BALEAR:");
  report.balearicPressDorks.forEach((p) => {
    console.log(`  • [${p.language.toUpperCase()}] ${p.mediaName}: ${p.searchUrl}`);
  });

  console.log("\n🛡️ 7. AUDITORÍA DE CONFIANZA & TRIPLE VERIFICACIÓN (Confidence Score):");
  const vr = report.verificationReport;
  const statusEmoji = vr.status === "verified" ? "✅" : vr.status === "needs_manual_review" ? "⚠️" : "⏳";
  console.log(`  • Puntaje de Confianza: ${vr.confidenceScore}% (${statusEmoji} ${vr.status.toUpperCase()})`);
  console.log(`  • Desglose de Puntos:`);
  console.log(`    - Coincidencia Telefónica: ${vr.scoreBreakdown.phoneConsistency}/25 pts`);
  console.log(`    - Precisión Geográfica Mallorca: ${vr.scoreBreakdown.geoAccuracy}/25 pts`);
  console.log(
    `    - Disponibilidad Web (HTTP ${report.extractedMedia.ogImage ? "200" : "Status"}): ${vr.scoreBreakdown.webAvailability}/20 pts`,
  );
  console.log(`    - Huella en Redes Sociales: ${vr.scoreBreakdown.socialFootprint}/15 pts`);
  console.log(`    - Reputación y Reseñas: ${vr.scoreBreakdown.reputationVolume}/15 pts`);

  if (vr.warnings.length > 0) {
    console.log(`  • Alertas / Discrepancias Detectadas:`);
    vr.warnings.forEach((w) => console.log(`    ⚠️ ${w}`));
  }
  if (vr.recommendations.length > 0) {
    console.log(`  • Recomendaciones para el Curador:`);
    vr.recommendations.forEach((r) => console.log(`    💡 ${r}`));
  }

  console.log("\n📋 8. PLANTILLA JSON ENRIQUECIDA PARA src/data/services/<sector>/<slug>.ts:");
  console.log(JSON.stringify(report.curationTemplate, null, 2));
  console.log("\n" + "=".repeat(80));
}

main();
