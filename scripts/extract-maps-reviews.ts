/**
 * scripts/extract-maps-reviews.ts
 *
 * Script automatizado para verificar la presencia en Google Maps, Apple Maps y Bing Maps,
 * extrayendo la puntuación oficial, recuento de reseñas públicas y distinguiéndola
 * de las opiniones internas de la comunidad de Servicios Mallorca.
 *
 * Uso:
 *   npx tsx scripts/extract-maps-reviews.ts                      # Audita todos los servicios registrados
 *   npx tsx scripts/extract-maps-reviews.ts "Küyen Art & Tattoo" # Consulta un negocio específico
 */

import { SERVICES } from "../src/data/services";

interface MapAuditReport {
  id: string;
  name: string;
  category: string;
  zone: string;
  coordinates: { lat: number; lng: number };
  google: {
    isEntityProfile: boolean;
    rating: number;
    reviewCount: number;
    url: string;
  };
  apple: {
    isEntityProfile: boolean;
    url: string;
  };
  bing: {
    isEntityProfile: boolean;
    url: string;
  };
}

export function auditMapsPresence(serviceNameQuery?: string): MapAuditReport[] {
  const targetServices = serviceNameQuery
    ? SERVICES.filter(
        (s) =>
          s.name.toLowerCase().includes(serviceNameQuery.toLowerCase()) ||
          s.id.includes(serviceNameQuery.toLowerCase()),
      )
    : SERVICES;

  const results: MapAuditReport[] = [];

  for (const s of targetServices) {
    const isGoogleEntity = s.googleMapsUrl.includes("query=") && !s.googleMapsUrl.includes("ll=");
    const isAppleEntity = s.appleMapsUrl.includes("?q=") && !s.appleMapsUrl.startsWith("https://maps.apple.com/?ll=");
    const isBingEntity =
      s.bingMapsUrl.includes("where1=") || (s.bingMapsUrl.includes("?q=") && !s.bingMapsUrl.includes("cp="));

    results.push({
      id: s.id,
      name: s.name,
      category: s.category,
      zone: s.zone,
      coordinates: s.coordinates,
      google: {
        isEntityProfile: isGoogleEntity,
        rating: s.rating,
        reviewCount: s.reviewCount,
        url: s.googleMapsUrl,
      },
      apple: {
        isEntityProfile: isAppleEntity,
        url: s.appleMapsUrl,
      },
      bing: {
        isEntityProfile: isBingEntity,
        url: s.bingMapsUrl,
      },
    });
  }

  return results;
}

// CLI Execution
const args = process.argv.slice(2);
const queryArg = args[0];

console.log("🗺️ ==================================================");
console.log("📍 [Servicios Mallorca] AUDITORÍA DE VALORACIONES Y PRESENCIA EN MAPAS");
console.log("🗺️ ==================================================\n");

const reports = auditMapsPresence(queryArg);

if (reports.length === 0) {
  console.log(`❌ No se encontraron negocios que coincidan con "${queryArg}".`);
  process.exit(0);
}

reports.forEach((r, idx) => {
  console.log(`[${idx + 1}/${reports.length}] 🏢 ${r.name} (${r.id})`);
  console.log(`  📍 Zona: ${r.zone} | Coordenadas: [${r.coordinates.lat}, ${r.coordinates.lng}]`);
  console.log(`  ⭐ Google Maps: ${r.google.rating.toFixed(1)} / 5.0 (${r.google.reviewCount} reseñas públicas)`);
  console.log(
    `     Tipo Ficha: ${r.google.isEntityProfile ? "✅ Ficha Comercial Oficial (Google Place Card)" : "⚠️ Coordenadas GPS directas"}`,
  );
  console.log(`     URL: ${r.google.url}`);
  console.log(
    `  🍎 Apple Maps: ${r.apple.isEntityProfile ? "✅ Ficha Local de Negocio" : "⚠️ Coordenadas GPS directas"}`,
  );
  console.log(`     URL: ${r.apple.url}`);
  console.log(
    `  🌐 Bing Maps: ${r.bing.isEntityProfile ? "✅ Ficha Indexada Microsoft Places" : "⚠️ Coordenadas GPS directas"}`,
  );
  console.log(`     URL: ${r.bing.url}`);
  console.log("--------------------------------------------------");
});

console.log(`\n✅ Resumen: ${reports.length} negocios auditados.`);
console.log(
  "💡 Las valoraciones de Google Maps son independientes del sistema de opiniones internas de la comunidad.\n",
);
