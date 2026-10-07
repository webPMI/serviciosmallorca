import { SERVICES } from "../src/data/services/index.ts";

const args = process.argv.slice(2);
const sectorFlag = args.find((a) => a.startsWith("--sector="))?.split("=")[1] || args.find((a) => !a.startsWith("--"));

let targetServices = [...SERVICES];
if (sectorFlag) {
  const norm = sectorFlag.toLowerCase();
  targetServices = targetServices.filter(
    (s) =>
      s.category.toLowerCase().includes(norm) ||
      (s.sectorId && s.sectorId.toLowerCase().includes(norm)) ||
      s.slug.toLowerCase().includes(norm),
  );
  console.log(`🔍 [Audit Fake Businesses] Filtrado por sector "${sectorFlag}": ${targetServices.length} servicios.\n`);
} else {
  console.log(`🔍 [Audit Fake Businesses] Analizando ${SERVICES.length} servicios en los 23 sectores...\n`);
}

let suspiciousCount = 0;
const sectorStats: Record<string, { total: number; suspicious: number }> = {};

for (const s of targetServices) {
  const sectorKey = s.category || s.sectorId || "otros";
  if (!sectorStats[sectorKey]) {
    sectorStats[sectorKey] = { total: 0, suspicious: 0 };
  }
  sectorStats[sectorKey].total++;

  const flags: string[] = [];

  // 1. Phone validation
  if (s.phone) {
    const p = s.phone.replace(/\D/g, "").replace(/^34/, "");
    if (p.endsWith("1234") || p.endsWith("12345")) {
      flags.push(`Teléfono dummy (1234): ${s.phone}`);
    }
    if (/(\d)\1{4,}/.test(p) && p !== "971288888") {
      flags.push(`Dígitos repetidos anormales: ${s.phone}`);
    }
  }

  // 2. Maps CID validation
  if (s.googleMapsUrl) {
    const cidMatch = s.googleMapsUrl.match(/cid=(\d+)/i);
    if (cidMatch && (cidMatch[1].length < 14 || cidMatch[1].startsWith("12007") || cidMatch[1].startsWith("13008"))) {
      flags.push(`CID de Maps fabricado: ${s.googleMapsUrl}`);
    }
  }

  // 3. Boilerplate text
  const esDesc = typeof s.fullDescription === "object" ? s.fullDescription.es : s.fullDescription || "";
  if (
    esDesc.includes("se posiciona como una de las instalaciones deportivas") ||
    esDesc.includes("se posiciona como una de las")
  ) {
    flags.push("Descripción plantilla IA");
  }

  // 4. Domains
  if (s.website) {
    const w = s.website.toLowerCase();
    if (w.includes("example.com") || w.includes("dummy.com") || w.includes("test.com")) {
      flags.push(`Dominio no verídico: ${s.website}`);
    }
  }

  if (flags.length > 0) {
    suspiciousCount++;
    sectorStats[sectorKey].suspicious++;
    console.log(`⚠️ [${s.slug}] "${s.name}" (${sectorKey})`);
    flags.forEach((f) => console.log(`   - ${f}`));
  }
}

console.log("=".repeat(55));
if (!sectorFlag) {
  console.log("📊 RESUMEN POR SECTOR:");
  Object.entries(sectorStats)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([sector, stat]) => {
      const mark = stat.suspicious === 0 ? "🟢 100% Limpio" : `🚨 ${stat.suspicious} anomalías`;
      console.log(`  ${sector.padEnd(30)} ${stat.total.toString().padStart(3, " ")} fichas | ${mark}`);
    });
  console.log("=".repeat(55));
}

if (suspiciousCount === 0) {
  console.log(`✅ ¡PERFECTO! 0 negocios falsos detectados en los ${targetServices.length} servicios evaluados.`);
} else {
  console.log(`❌ Se encontraron ${suspiciousCount} negocios con anomalías sintéticas.`);
  process.exit(1);
}
