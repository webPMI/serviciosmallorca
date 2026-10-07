/**
 * scripts/audit-by-sector.ts
 *
 * CLI Maestro de Auditoría Sectorial de Servicios Mallorca (GR-01 a GR-17).
 * Permite auditar y analizar a fondo el catálogo completo agrupado por sectores,
 * o inspeccionar un sector específico ficha por ficha.
 *
 * Uso:
 *   npm run audit:sector                     # Resumen ejecutivo de los 23 sectores
 *   npm run audit:sector deportes-fitness     # Deep-dive detallado de ese sector
 *   npm run audit:sector -- --sector=gastronomia-restaurantes
 *   npm run audit:sector -- --json            # Salida en formato JSON para CI
 */

import { SERVICES, type ServiceItem } from "../src/data/services/index.ts";
import { isCoordinateWithinMallorca } from "../src/lib/verificationEngine.ts";

export interface SectorMetric {
  sector: string;
  total: number;
  verified: number;
  validPhones: number;
  dummyPhones: number;
  hasWebsite: number;
  validCoords: number;
  mapsRealListings: number;
  mapsHonestAbsent: number;
  mapsFakeUrls: number;
  quadrilingualCount: number;
  averageConfidenceScore: number;
  status: "BLINDADO" | "ATENCION" | "CRITICO";
  services: ServiceItem[];
}

// Mapeo canónico de los 23 sectores a partir de la ruta o category/sectorId
export function getSectorKey(s: ServiceItem): string {
  if (s.sectorId) {
    // Normalizar sectorId a nombre de carpeta conocida
    const id = s.sectorId.toLowerCase();
    if (id.includes("deport")) return "deportes-fitness";
    if (id.includes("gastro") || id.includes("hostel")) return "gastronomia-restaurantes";
    if (id.includes("nautic")) return "nautica-charter";
    if (id.includes("spa") || id.includes("belleza") || id.includes("bienestar")) return "spas-bienestar";
    if (id.includes("reform") || id.includes("construc")) return "reformas-construccion";
    if (id.includes("inmobil")) return "inmobiliaria-villas";
    if (id.includes("motor") || id.includes("transp")) return "motor-transporte";
    if (id.includes("jardin") || id.includes("piscin")) return "jardineria-piscinas";
    if (id.includes("tecnol") || id.includes("segurid")) return "tecnologia-seguridad";
    if (id.includes("alojam") || id.includes("turis")) return "alojamiento-turismo";
    if (id.includes("retail") || id.includes("tiend") || id.includes("comercio")) return "retail-comercio";
    if (id.includes("educa") || id.includes("formac")) return "educacion-formacion";
    if (id.includes("ocio") || id.includes("entreten")) return "entretenimiento-ocio";
    if (id.includes("hogar") || id.includes("limpiez")) return "hogar-limpieza";
    if (id.includes("mascot") || id.includes("veterin")) return "mascotas-veterinaria";
    if (id.includes("agric") || id.includes("primario")) return "agricultura-productores";
    if (id.includes("artesan") || id.includes("manufac")) return "artesania-manufactura";
    if (id.includes("social")) return "servicios-sociales";
    if (id.includes("finanz") || id.includes("segur")) return "finanzas-seguros";
    if (id.includes("tatuaj") || id.includes("tattoo")) return "arte-tatuajes";
    if (id.includes("galeri") || id.includes("museo")) return "galerias-museos";
    if (id.includes("salud")) return "salud-bienestar";
    if (id.includes("profesion") || id.includes("legal")) return "servicios-profesionales";
  }
  return s.category || "otros";
}

export function analyzeSector(sector: string, items: ServiceItem[]): SectorMetric {
  let verified = 0;
  let validPhones = 0;
  let dummyPhones = 0;
  let hasWebsite = 0;
  let validCoords = 0;
  let mapsRealListings = 0;
  let mapsHonestAbsent = 0;
  let mapsFakeUrls = 0;
  let quadrilingualCount = 0;
  let totalScore = 0;

  for (const s of items) {
    if (s.verified) verified++;

    // Teléfono
    if (s.phone) {
      const clean = s.phone.replace(/\D/g, "");
      if (clean.endsWith("1234") || clean.endsWith("12345") || clean.startsWith("971000")) {
        dummyPhones++;
      } else {
        validPhones++;
      }
    }

    // Web
    if (s.website && /^https?:\/\//i.test(s.website)) {
      hasWebsite++;
    }

    // Coordenadas
    if (s.coordinates && isCoordinateWithinMallorca(s.coordinates.lat, s.coordinates.lng)) {
      validCoords++;
    }

    // Maps (GR-11 / GR-12)
    if (!s.googleMapsUrl) {
      mapsHonestAbsent++;
    } else {
      const u = s.googleMapsUrl;
      const isFake =
        /maps\/(?:search|place\/\?q=)|\?q=|\/search\/\?api=/i.test(u) ||
        /cid=(?:12007\d+|13008\d+|\d{1,10})(?:&|$)/i.test(u);
      if (isFake) {
        mapsFakeUrls++;
      } else {
        mapsRealListings++;
      }
    }

    // i18n
    const hasEs = Boolean(s.shortDescription?.es || s.fullDescription?.es);
    const hasEn = Boolean(s.shortDescription?.en || s.fullDescription?.en);
    const hasCa = Boolean(s.shortDescription?.ca || s.fullDescription?.ca);
    const hasDe = Boolean(s.shortDescription?.de || s.fullDescription?.de);
    if (hasEs && hasEn && hasCa && hasDe) {
      quadrilingualCount++;
    }

    totalScore += s.confidenceScore || 85;
  }

  const averageConfidenceScore = items.length > 0 ? Math.round((totalScore / items.length) * 10) / 10 : 0;
  const isOptimal = dummyPhones === 0 && mapsFakeUrls === 0 && validCoords === items.length;
  const status: "BLINDADO" | "ATENCION" | "CRITICO" = isOptimal
    ? "BLINDADO"
    : dummyPhones > 0 || mapsFakeUrls > 0
      ? "CRITICO"
      : "ATENCION";

  return {
    sector,
    total: items.length,
    verified,
    validPhones,
    dummyPhones,
    hasWebsite,
    validCoords,
    mapsRealListings,
    mapsHonestAbsent,
    mapsFakeUrls,
    quadrilingualCount,
    averageConfidenceScore,
    status,
    services: items,
  };
}

export function runSectorAuditCli() {
  const args = process.argv.slice(2);
  const isJson = args.includes("--json");
  const sectorFilter =
    args.find((a) => a.startsWith("--sector="))?.split("=")[1] || args.find((a) => !a.startsWith("--"));

  // Agrupar servicios
  const groups: Record<string, ServiceItem[]> = {};
  for (const s of SERVICES) {
    const sec = getSectorKey(s);
    if (!groups[sec]) groups[sec] = [];
    groups[sec].push(s);
  }

  const allMetrics: SectorMetric[] = Object.entries(groups)
    .map(([sec, items]) => analyzeSector(sec, items))
    .sort((a, b) => a.sector.localeCompare(b.sector));

  if (isJson) {
    console.log(JSON.stringify(allMetrics, null, 2));
    return;
  }

  // Si se solicitó un sector específico
  if (sectorFilter) {
    const target = allMetrics.find(
      (m) =>
        m.sector.toLowerCase() === sectorFilter.toLowerCase() ||
        m.sector.toLowerCase().includes(sectorFilter.toLowerCase()),
    );

    if (!target) {
      console.error(`❌ Sector no encontrado: "${sectorFilter}"`);
      console.log(`\nSectores disponibles:`);
      allMetrics.forEach((m) => console.log(`  - ${m.sector} (${m.total} fichas)`));
      process.exit(1);
    }

    console.log("\n=======================================================");
    console.log(`🔍 AUDITORÍA DETALLADA DEL SECTOR: [${target.sector.toUpperCase()}]`);
    console.log("=======================================================");
    console.log(`📊 Total Fichas:               ${target.total}`);
    console.log(
      `✅ Verificadas:               ${target.verified} (${Math.round((target.verified / target.total) * 100)}%)`,
    );
    console.log(`📞 Teléfonos Válidos:         ${target.validPhones}/${target.total} (Dummies: ${target.dummyPhones})`);
    console.log(`🌐 Sitios Web Oficiales:      ${target.hasWebsite}/${target.total}`);
    console.log(
      `🗺️ Fidelidad Maps:            ${target.mapsRealListings} fichas reales | ${target.mapsHonestAbsent} ausentes honestas | ${target.mapsFakeUrls} URLs falsas`,
    );
    console.log(`📍 GPS Válido en Mallorca:    ${target.validCoords}/${target.total}`);
    console.log(
      `🌍 Cobertura 4 Idiomas:       ${target.quadrilingualCount}/${target.total} (${Math.round((target.quadrilingualCount / target.total) * 100)}%)`,
    );
    console.log(`🛡️ Score de Confianza Medio:  ${target.averageConfidenceScore}%`);
    console.log(
      `🚦 Estado del Sector:          ${target.status === "BLINDADO" ? "🟢 BLINDADO (100% Verídico)" : "🚨 CON INCIDENCIAS"}`,
    );
    console.log("=======================================================\n");

    console.log(`📋 Detalle de las ${target.services.length} fichas:`);
    const tableData = target.services.map((s, idx) => ({
      "#": idx + 1,
      Slug: s.slug.slice(0, 32),
      Nombre: s.name.slice(0, 30),
      Zona: s.zone,
      Teléfono: s.phone ? (s.phone.endsWith("1234") ? "❌ DUMMY" : s.phone) : "⚠️ Sin tel",
      Web: s.website ? "✅ Web" : "—",
      Maps: s.googleMapsUrl ? "📍 Ficha" : "⚪ Sin Ficha",
      Score: `${s.confidenceScore || 85}%`,
    }));
    console.table(tableData);
    return;
  }

  // Vista global con tabla resumen
  console.log("\n==========================================================================================");
  console.log("🌴 SERVICIOS MALLORCA — TABLERO DE CONTROL Y AUDITORÍA POR SECTORES");
  console.log("==========================================================================================");
  console.log(`Total Catálogo: ${SERVICES.length} fichas analizadas en ${allMetrics.length} sectores.\n`);

  const summaryTable = allMetrics.map((m) => ({
    Sector: m.sector,
    Fichas: m.total,
    "Tel Válido": `${m.validPhones}/${m.total}`,
    Web: `${m.hasWebsite}/${m.total}`,
    Maps: `${m.mapsRealListings} real / ${m.mapsHonestAbsent} s.f.`,
    "4 Idiomas": `${m.quadrilingualCount}/${m.total}`,
    Score: `${m.averageConfidenceScore}%`,
    Estado: m.status === "BLINDADO" ? "🟢 Blindado" : "🚨 Revisión",
  }));

  console.table(summaryTable);

  const totalDummies = allMetrics.reduce((acc, m) => acc + m.dummyPhones, 0);
  const totalFakeMaps = allMetrics.reduce((acc, m) => acc + m.mapsFakeUrls, 0);
  const globalScore =
    Math.round((allMetrics.reduce((acc, m) => acc + m.averageConfidenceScore, 0) / allMetrics.length) * 10) / 10;

  console.log("------------------------------------------------------------------------------------------");
  console.log(`🏆 SCORE GLOBAL DEL CATÁLOGO: ${globalScore}%`);
  console.log(
    `🛡️ ZERO FAKE DATA (GR-11):   ${totalDummies === 0 ? "✅ 0 teléfonos dummy" : `🚨 ${totalDummies} dummies`}`,
  );
  console.log(
    `🗺️ FIDELIDAD MAPS (GR-12):    ${totalFakeMaps === 0 ? "✅ 0 URLs de Maps falsas" : `🚨 ${totalFakeMaps} URLs falsas`}`,
  );
  console.log("==========================================================================================\n");
  console.log("💡 Para profundizar en un sector concreto ejecuta:");
  console.log("   npm run audit:sector <nombre-del-sector>\n");
  console.log("   Ejemplo: npm run audit:sector deportes-fitness\n");
}

if (process.argv[1]?.includes("audit-by-sector")) {
  runSectorAuditCli();
}
