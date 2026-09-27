import { SERVICES } from "../src/data/services/index.ts";

console.log("🔍 AUDITORÍA DE CALIDAD DE DATOS DEL CATÁLOGO\n");
console.log("=".repeat(60));

// Analizar inkEnzo como estándar de referencia
const inkEnzo = SERVICES.find((s) => s.id === "ink-enzo-tattoo-mallorca");
if (!inkEnzo) {
  console.log("❌ No se encontró inkEnzo como referencia");
  process.exit(1);
}

console.log("📊 ESTÁNDAR DE REFERENCIA: inkEnzo Tattoo Mallorca\n");
console.log(`✅ Campos completos: ${Object.keys(inkEnzo).length}`);
console.log(`✅ Galería: ${inkEnzo.gallery?.length || 0} imágenes`);
console.log(`✅ Reviews: ${inkEnzo.reviews?.length || 0} reseñas`);
console.log(`✅ Certificaciones: ${inkEnzo.certifications?.length || 0}`);
console.log(`✅ FAQs: ${inkEnzo.faqs?.length || 0}`);
console.log(`✅ Trust Level: ${inkEnzo.trustLevel}`);
console.log(`✅ Confidence Score: ${inkEnzo.confidenceScore}`);
console.log(`✅ Featured: ${inkEnzo.featured}`);

// Definir campos críticos básicos (no todos los 77 campos de inkEnzo)
const criticalFields = [
  "id",
  "slug",
  "name",
  "category",
  "zone",
  "address",
  "coordinates",
  "phone",
  "email",
  "website",
  "schedule",
  "status",
  "verified",
];

const qualityScoreFields = [
  { field: "gallery", weight: 15, max: 7, name: "Galería fotográfica" },
  { field: "reviews", weight: 15, max: 10, name: "Reseñas detalladas" },
  { field: "certifications", weight: 10, max: 5, name: "Certificaciones oficiales" },
  { field: "faqs", weight: 10, max: 8, name: "FAQs completas" },
  { field: "teamMembers", weight: 10, max: 3, name: "Miembros del equipo" },
  { field: "awards", weight: 10, max: 5, name: "Premios y reconocimientos" },
  { field: "pressMentions", weight: 10, max: 5, name: "Menciones en prensa" },
  { field: "socialPosts", weight: 10, max: 5, name: "Posts en redes sociales" },
  { field: "localSeoKeywords", weight: 10, max: 1, name: "Palabras clave SEO" },
];

const issues = [];
const businessScores = [];

SERVICES.forEach((service) => {
  if (service.status === "permanently_closed") return;

  let score = 0;
  const missingCritical = [];
  const missingQuality = [];

  // Verificar campos críticos
  criticalFields.forEach((field) => {
    if (!service[field]) {
      missingCritical.push(field);
    }
  });

  // Calcular puntaje de calidad
  qualityScoreFields.forEach(({ field, weight, max, name }) => {
    const fieldData = service[field];
    if (!fieldData) {
      missingQuality.push(name);
    } else if (Array.isArray(fieldData)) {
      const count = fieldData.length;
      const points = Math.min(weight, (count / max) * weight);
      score += points;
    } else {
      score += weight; // Campo existe pero no es array, dar puntos completos
    }
  });

  businessScores.push({
    id: service.id,
    name: service.name,
    category: service.category,
    score: Math.round(score),
    missingCritical: missingCritical.length,
    missingQuality: missingQuality.length,
    totalMissing: missingCritical.length + missingQuality.length,
  });

  if (missingCritical.length > 3 || missingQuality.length > 4) {
    issues.push({
      service: service.name,
      id: service.id,
      category: service.category,
      score: Math.round(score),
      missingCritical: missingCritical.length,
      missingQuality: missingQuality.length,
      priority: missingCritical.length > 5 ? "CRITICAL" : "HIGH",
    });
  }
});

// Ordenar por score
businessScores.sort((a, b) => b.score - a.score);

console.log("\n📊 ANÁLISIS DE CALIDAD DE DATOS\n");
console.log(`📈 Servicios analizados: ${businessScores.length}`);
console.log(
  `📉 Promedio de calidad: ${(businessScores.reduce((a, b) => a + b.score, 0) / businessScores.length).toFixed(1)}/100`,
);
console.log(`🚨 Servicios con problemas: ${issues.length}`);

// Top 10 mejores
console.log("\n🏆 TOP 10 SERVICIOS CON MEJOR CALIDAD DE DATOS:\n");
businessScores.slice(0, 10).forEach((item, idx) => {
  const marker = item.id === "ink-enzo-tattoo-mallorca" ? "🔥" : "  ";
  console.log(`${marker} #${idx + 1}: ${item.name} (${item.category}) - Score: ${item.score}/100`);
});

// Bottom 10 peores
console.log("\n⚠️  10 SERVICIOS CON PEOR CALIDAD DE DATOS:\n");
businessScores
  .slice(-10)
  .reverse()
  .forEach((item, idx) => {
    console.log(`❌ #${idx + 1}: ${item.name} (${item.category}) - Score: ${item.score}/100`);
    console.log(`   Faltan críticos: ${item.missingCritical}, calidad: ${item.missingQuality}`);
  });

// Resumen por categoría
console.log("\n📋 RESUMEN POR CATEGORÍA:\n");
const categorySummary = {};
businessScores.forEach((item) => {
  if (!categorySummary[item.category]) {
    categorySummary[item.category] = { count: 0, totalScore: 0 };
  }
  categorySummary[item.category].count++;
  categorySummary[item.category].totalScore += item.score;
});

Object.entries(categorySummary).forEach(([category, data]) => {
  const avg = (data.totalScore / data.count).toFixed(1);
  console.log(`${category}: ${data.count} servicios | Promedio: ${avg}/100`);
});

// Exportar problemas
console.log("\n🔍 SERVICIOS QUE REQUIEREN ATENCIÓN:\n");
const priorityGroups = {
  CRITICAL: issues.filter((i) => i.priority === "CRITICAL"),
  HIGH: issues.filter((i) => i.priority === "HIGH"),
};

console.log(`🔴 CRÍTICOS (${priorityGroups.CRITICAL.length}):`);
priorityGroups.CRITICAL.forEach((item, idx) => {
  console.log(`   ${idx + 1}. ${item.service} (${item.category}) - Score: ${item.score}`);
  console.log(`      Faltan: ${item.missingCritical} críticos, ${item.missingQuality} calidad`);
});

console.log(`\n🟡 ALTOS (${priorityGroups.HIGH.length}):`);
priorityGroups.HIGH.slice(0, 10).forEach((item, idx) => {
  console.log(`   ${idx + 1}. ${item.service} (${item.category}) - Score: ${item.score}`);
  console.log(`      Faltan: ${item.missingCritical} críticos, ${item.missingQuality} calidad`);
});

console.log("\n" + "=".repeat(60));
console.log("🔍 AUDITORÍA COMPLETADA\n");
