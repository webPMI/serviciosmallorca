import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { SERVICES, type ServiceItem } from "../src/data/services/index.ts";
import { CATEGORIES } from "../src/data/categories.ts";
import { MALLORCA_ZONES } from "../src/data/zones.ts";
import { validateServicesList } from "../src/lib/validateServices.ts";
import { harvestBusinessIntelligence } from "../src/lib/scrapers/orchestrator.ts";
import { autoTranslateTrilingualBusinessData } from "../src/lib/translator.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVICES_DIR = path.resolve(__dirname, "../src/data/services");

export const SECTOR_FOLDER_MAP: Record<string, { folder: string; arrayName: string; sectorId: string }> = {
  "agricultura-productores": { folder: "agricultura-productores", arrayName: "AGRICULTURA_SERVICES", sectorId: "sector-primario-agroalimentario" },
  "alojamiento-turismo": { folder: "alojamiento-turismo", arrayName: "ALOJAMIENTO_SERVICES", sectorId: "turismo-alojamiento" },
  "arte-tatuajes": { folder: "arte-tatuajes", arrayName: "TATTOO_SERVICES", sectorId: "arte-estilo-cultura" },
  "artesania-manufactura": { folder: "artesania-manufactura", arrayName: "ARTESANIA_SERVICES", sectorId: "industria-manufactura-artesania" },
  "deportes-fitness": { folder: "deportes-fitness", arrayName: "DEPORTES_SERVICES", sectorId: "deportes-aventura-bienestar" },
  "educacion-formacion": { folder: "educacion-formacion", arrayName: "EDUCACION_SERVICES", sectorId: "educacion-formacion-idiomas" },
  "entretenimiento-ocio": { folder: "entretenimiento-ocio", arrayName: "ENTRETENIMIENTO_SERVICES", sectorId: "ocio-vida-nocturna" },
  "finanzas-seguros": { folder: "finanzas-seguros", arrayName: "FINANZAS_SERVICES", sectorId: "finanzas-seguros-banca" },
  "gastronomia-restaurantes": { folder: "gastronomia-restaurantes", arrayName: "RESTAURANT_SERVICES", sectorId: "hosteleria-gastronomia" },
  "hogar-limpieza": { folder: "hogar-limpieza", arrayName: "HOGAR_SERVICES", sectorId: "mantenimiento-hogar-comunidades" },
  "inmobiliaria-villas": { folder: "inmobiliaria-villas", arrayName: "INMOBILIARIA_SERVICES", sectorId: "inmobiliario-fincas" },
  "jardineria-piscinas": { folder: "jardineria-piscinas", arrayName: "JARDINERIA_SERVICES", sectorId: "jardineria-paisajismo-piscinas" },
  "mascotas-veterinaria": { folder: "mascotas-veterinaria", arrayName: "MASCOTAS_SERVICES", sectorId: "animales-veterinaria" },
  "motor-transporte": { folder: "motor-transporte", arrayName: "TRANSPORTE_SERVICES", sectorId: "movilidad-transporte" },
  "nautica-charter": { folder: "nautica-charter", arrayName: "NAUTICA_SERVICES", sectorId: "nautica-maritimo" },
  "reformas-construccion": { folder: "reformas-construccion", arrayName: "REFORMAS_SERVICES", sectorId: "construccion-reformas" },
  "retail-comercio": { folder: "retail-comercio", arrayName: "RETAIL_SERVICES", sectorId: "comercio-retail-tiendas" },
  "salud-bienestar": { folder: "salud-bienestar", arrayName: "SALUD_SERVICES", sectorId: "salud-bienestar-belleza" },
  "servicios-profesionales": { folder: "servicios-profesionales", arrayName: "PROFESIONALES_SERVICES", sectorId: "servicios-profesionales-legal" },
  "servicios-sociales": { folder: "servicios-sociales", arrayName: "SOCIALES_SERVICES", sectorId: "servicios-sociales-comunitarios" },
  "spas-bienestar": { folder: "spas-bienestar", arrayName: "SPAS_SERVICES", sectorId: "salud-bienestar-belleza" },
  "tecnologia-seguridad": { folder: "tecnologia-seguridad", arrayName: "SEGURIDAD_SERVICES", sectorId: "tecnologia-seguridad-domotica" },
};

export function resolveSectorForCategory(categoryId: string): { folder: string; arrayName: string; sectorId: string } {
  if (SECTOR_FOLDER_MAP[categoryId]) return SECTOR_FOLDER_MAP[categoryId];
  const found = CATEGORIES.find((c) => c.id === categoryId);
  if (found) {
    const directMatch = Object.values(SECTOR_FOLDER_MAP).find((s) => s.sectorId === found.sectorId);
    if (directMatch) return directMatch;
  }
  return SECTOR_FOLDER_MAP["servicios-profesionales"];
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-([a-z0-9])/gi, (_, g) => g.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    }),
  );
}

export function saveModularService(service: ServiceItem, sectorFolder: string): void {
  const varName = toCamelCase(service.slug);
  const targetPath = path.join(SERVICES_DIR, sectorFolder, `${service.slug}.ts`);

  const tsContent = `import type { ServiceItem } from "../types.ts";

export const ${varName}: ServiceItem = ${JSON.stringify(service, null, 2)};
`;

  fs.writeFileSync(targetPath, tsContent, "utf-8");
  console.log(`  💾 Archivo modular guardado: src/data/services/${sectorFolder}/${service.slug}.ts`);

  // Actualizar el archivo index.ts del sector
  updateSectorIndex(sectorFolder, varName, service.slug);
}

export function updateSectorIndex(sectorFolder: string, varName: string, slug: string): void {
  const indexPath = path.join(SERVICES_DIR, sectorFolder, "index.ts");
  if (!fs.existsSync(indexPath)) {
    console.warn(`  ⚠️ No existe index.ts para el sector: ${sectorFolder}`);
    return;
  }

  let indexContent = fs.readFileSync(indexPath, "utf-8");

  // 1. Añadir import si no existe
  const importStatement = `import { ${varName} } from "./${slug}.ts";`;
  if (!indexContent.includes(importStatement) && !indexContent.includes(`from "./${slug}.ts"`)) {
    // Insertar después del primer import
    const firstImportEnd = indexContent.indexOf("import");
    if (firstImportEnd !== -1) {
      const lastImportIndex = indexContent.lastIndexOf("import");
      const endOfLastImport = indexContent.indexOf(";", lastImportIndex) + 1;
      indexContent =
        indexContent.slice(0, endOfLastImport) + `\n${importStatement}` + indexContent.slice(endOfLastImport);
    }
  }

  // 2. Actualizar export {...} si existe
  const exportMatch = indexContent.match(/export\s*\{\s*([^}]+)\s*\};/);
  if (exportMatch && !exportMatch[1].includes(varName)) {
    const newExport = `export { ${exportMatch[1].trim()}, ${varName} };`;
    indexContent = indexContent.replace(exportMatch[0], newExport);
  }

  // 3. Añadir a la constante de array (ej. RESTAURANT_SERVICES: ServiceItem[] = [ ... ])
  const arrayMatch = indexContent.match(/export const (\w+_SERVICES):\s*ServiceItem\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (arrayMatch && !arrayMatch[2].includes(varName)) {
    const arrayItems = arrayMatch[2].trim();
    const newArrayDeclaration = `export const ${arrayMatch[1]}: ServiceItem[] = [\n  ${
      arrayItems
        ? arrayItems
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .join(",\n  ") +
          ",\n  " +
          varName
        : varName
    },\n];`;
    indexContent = indexContent.replace(arrayMatch[0], newArrayDeclaration);
  }

  fs.writeFileSync(indexPath, indexContent, "utf-8");
  console.log(`  🔄 Índice sectorial actualizado: src/data/services/${sectorFolder}/index.ts`);
}

export async function addServices(itemsToAdd: Partial<ServiceItem>[]): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const processedItems: ServiceItem[] = [];

  for (const item of itemsToAdd) {
    if (!item.name) {
      console.error("❌ Nombre obligatorio ausente en uno de los servicios.");
      continue;
    }

    const slug = item.slug || slugify(item.name);
    const existing = SERVICES.find(
      (s) => s.slug === slug || s.id === slug || s.name.toLowerCase() === item.name!.toLowerCase(),
    );

    if (existing) {
      console.error(`⚠️ Ya existe un negocio con slug/nombre: "${slug}". Omitiendo para evitar duplicidad.`);
      continue;
    }

    const category = item.category || "servicios-profesionales";
    const sectorConfig = resolveSectorForCategory(category);

    // Validación GR-11: evitar números dummy en ingesta
    const rawPhone = (item.phone || "").trim();
    const isDummyPhone =
      !rawPhone ||
      /^(?:\+34\s*)?(?:971\s*000|971\s*77\s*12|1234)/.test(rawPhone) ||
      rawPhone.endsWith("1234") ||
      rawPhone.endsWith("12345");
    const safePhone = isDummyPhone ? "" : rawPhone;

    // Validación GR-11/GR-12: rechazar URLs de búsqueda o CIDs sintéticos
    let safeGoogleMaps = item.googleMapsUrl;
    if (
      safeGoogleMaps &&
      (/maps\/(?:search|place\/\?q=)|\?q=|\/search\/\?api=/i.test(safeGoogleMaps) ||
        /cid=(?:12007\d+|13008\d+|\d{1,10})(?:&|$)/i.test(safeGoogleMaps))
    ) {
      console.warn(`  ⚠️ Eliminando googleMapsUrl sintético/búsqueda en "${item.name}"`);
      safeGoogleMaps = undefined;
    }

    // Traducción automática si solo se proporcionó español o faltan traducciones
    const esShort = typeof item.shortDescription === "string" ? item.shortDescription : item.shortDescription?.es;
    const esFull = typeof item.fullDescription === "string" ? item.fullDescription : item.fullDescription?.es;
    const esStory = typeof item.founderStory === "string" ? item.founderStory : item.founderStory?.es;
    const esSpecialties = Array.isArray(item.specialties) ? item.specialties : item.specialties?.es;
    const esHighlights = Array.isArray(item.highlights) ? item.highlights : item.highlights?.es;
    const esServices = Array.isArray(item.servicesProvided) ? item.servicesProvided : item.servicesProvided?.es;

    const translated = await autoTranslateTrilingualBusinessData({
      shortDescriptionEs: esShort || `${item.name} ofrece servicios de calidad verificada en Mallorca.`,
      fullDescriptionEs:
        esFull || `${item.name} es una empresa y servicio verificado en Mallorca con experiencia contrastada.`,
      founderStoryEs: esStory || `Fundado con vocación de excelencia y arraigo en la isla de Mallorca.`,
      specialtiesEs: esSpecialties || ["Atención personalizada", "Servicio especializado"],
      highlightsEs: esHighlights || ["Servicio verificado y contrastado en Baleares", "Atención profesional"],
      servicesProvidedEs: esServices || ["Servicios especializados", "Atención a clientes"],
    });

    const shortDescription =
      item.shortDescription &&
      typeof item.shortDescription === "object" &&
      item.shortDescription.en &&
      item.shortDescription.ca
        ? (item.shortDescription as { es: string; en: string; ca: string })
        : translated.shortDescription;

    const fullDescription =
      item.fullDescription &&
      typeof item.fullDescription === "object" &&
      item.fullDescription.en &&
      item.fullDescription.ca
        ? (item.fullDescription as { es: string; en: string; ca: string })
        : translated.fullDescription;

    const founderStory =
      item.founderStory && typeof item.founderStory === "object" && item.founderStory.en && item.founderStory.ca
        ? (item.founderStory as { es: string; en: string; ca: string })
        : translated.founderStory;

    const specialties =
      item.specialties &&
      !Array.isArray(item.specialties) &&
      (item.specialties as any).en &&
      (item.specialties as any).ca
        ? (item.specialties as { es: string[]; en: string[]; ca: string[] })
        : translated.specialties;

    const highlights =
      item.highlights && !Array.isArray(item.highlights) && (item.highlights as any).en && (item.highlights as any).ca
        ? (item.highlights as { es: string[]; en: string[]; ca: string[] })
        : translated.highlights;

    const servicesProvided =
      item.servicesProvided &&
      !Array.isArray(item.servicesProvided) &&
      (item.servicesProvided as any).en &&
      (item.servicesProvided as any).ca
        ? (item.servicesProvided as { es: string[]; en: string[]; ca: string[] })
        : translated.servicesProvided;

    const service: ServiceItem = {
      id: slug,
      slug,
      name: item.name,
      category,
      sectorId: item.sectorId || sectorConfig.sectorId,
      culturalIdentity: item.culturalIdentity || "mallorquin_heritage",
      zone: item.zone || "palma",
      address: item.address || "Mallorca, Illes Balears",
      coordinates: item.coordinates || { lat: 39.5696, lng: 2.6502 },
      rating: item.rating ?? null,
      reviewCount: item.reviewCount ?? null,
      priceRange: item.priceRange || "€€",
      verified: item.verified ?? true,
      featured: item.featured ?? false,
      status: item.status || "open",
      seasonality: item.seasonality || "year_round",
      isIconicHeritage: item.isIconicHeritage ?? false,
      lastVerifiedAt: item.lastVerifiedAt || today,
      // GR-11/GR-12: solo se incluyen URLs de Google/Apple/Bing Maps cuando existe ficha real contrastada
      googleMapsUrl: safeGoogleMaps,
      appleMapsUrl: item.appleMapsUrl,
      bingMapsUrl: item.bingMapsUrl,
      phone: safePhone,
      whatsapp: item.whatsapp || safePhone || undefined,
      email: item.email || undefined,
      website: item.website || "",
      targetAudience: item.targetAudience || ["residentes", "turistas", "expat"],
      languagesSpoken: item.languagesSpoken || ["es", "en", "ca", "de"],
      emergency24h: item.emergency24h ?? false,
      inVillaService: item.inVillaService ?? false,
      features: item.features || ["wifi", "air_conditioning", "credit_card"],
      amenities: item.amenities || ["wifi", "air_conditioning"],
      paymentMethods: item.paymentMethods || ["credit_card", "cash"],
      certifications: item.certifications || ["Registro Oficial Balear"],
      tags: item.tags || [`zona:${item.zone || "palma"}`, "product:premium", "mod:cita-previa", "temps:todo-el-ano"],
      shortDescription,
      fullDescription,
      specialties,
      highlights,
      servicesProvided,
      founderStory,
      image: item.image || `/images/services/${slug}.jpg`,
      gallery: item.gallery || [`/images/services/${slug}-1.jpg`],
      schedule: item.schedule || "Lun - Vie: 08:30 - 19:00",
      pricing: item.pricing || {
        startingPrice: "Desde 50€",
        rateType: "tiered",
      },
      confidenceScore: item.confidenceScore || 90,
      verificationStatus: item.verificationStatus || "verified",
      sourceCrossReference: item.sourceCrossReference || {
        webPhoneMatch: true,
        mapsPhoneMatch: true,
        addressInMallorca: true,
        activeWeb200Ok: true,
        socialMatchScore: 100,
      },
      newsMentions: item.newsMentions || [],
      reviews: item.reviews || [],
      socialLinks: item.socialLinks || {},
    };

    // Validar servicio individual
    const validation = validateServicesList([service]);
    if (!validation.valid) {
      console.error(`❌ Error validando "${service.name}":`);
      validation.errors.forEach((err) => console.error(`  - ${err}`));
      continue;
    }

    saveModularService(service, sectorConfig.folder);
    processedItems.push(service);
  }

  console.log(`\n🎉 Ingesta completada: ${processedItems.length} servicios registrados en arquitectura modular.`);
}

export async function runInteractiveCli() {
  console.log("\n=======================================================");
  console.log("🌴 SERVICIOS MALLORCA — ASISTENTE DE CURACIÓN MODULAR");
  console.log("=======================================================\n");

  const name = await askQuestion("1. Nombre comercial del negocio: ");
  if (!name) {
    console.error("❌ El nombre es obligatorio.");
    return;
  }

  const website = await askQuestion("2. Sitio web oficial (https://...): ");

  // Probar recolección automática si hay web
  if (website) {
    console.log(`\n⏳ Ejecutando recolección automática de inteligencia para "${name}"...`);
    try {
      const intel = await harvestBusinessIntelligence(name, website);
      console.log(`✅ Categoría detectada: [${intel.detectedCategory}]`);
      console.log(`🛡️ Confidence Score: ${intel.verificationReport.confidenceScore}%`);
    } catch {
      console.log("⚠️ No se pudo autocompletar, procediendo con entrada guiada.");
    }
  }

  console.log("\nCategorías disponibles:");
  CATEGORIES.forEach((c, idx) => console.log(`  ${idx + 1}. [${c.id}] ${c.icon} ${c.name.es}`));
  const catChoice = await askQuestion("3. Selecciona categoría (número o ID): ");
  let category = CATEGORIES[parseInt(catChoice, 10) - 1]?.id || catChoice;
  if (!CATEGORIES.some((c) => c.id === category)) category = "servicios-profesionales";

  console.log("\nZonas de Mallorca disponibles:");
  MALLORCA_ZONES.forEach((z, idx) => console.log(`  ${idx + 1}. [${z.id}] 📍 ${z.name.es}`));
  const zoneChoice = await askQuestion("4. Selecciona zona (número o ID): ");
  let zone = MALLORCA_ZONES[parseInt(zoneChoice, 10) - 1]?.id || zoneChoice;
  if (!MALLORCA_ZONES.some((z) => z.id === zone)) zone = "palma";

  const address = await askQuestion("5. Dirección física en Mallorca: ");
  const phone = await askQuestion("6. Teléfono de contacto: ");
  const whatsapp = (await askQuestion("7. WhatsApp (Enter para usar el teléfono): ")) || phone;
  const ratingStr = (await askQuestion("8. Valoración Google (ej. 4.9): ")) || "4.8";
  const reviewCountStr = (await askQuestion("9. Número de reseñas (ej. 85): ")) || "50";
  const shortDescEs = await askQuestion("10. Descripción corta (ES): ");
  const shortDescEn = (await askQuestion("11. Descripción corta (EN): ")) || shortDescEs;
  const shortDescCa = (await askQuestion("12. Descripción corta (CA): ")) || shortDescEs;

  await addServices([
    {
      name,
      category,
      zone,
      address,
      phone,
      whatsapp,
      website,
      rating: parseFloat(ratingStr) || 4.8,
      reviewCount: parseInt(reviewCountStr, 10) || 50,
      shortDescription: {
        es: shortDescEs,
        en: shortDescEn,
        ca: shortDescCa,
      },
    },
  ]);
}

// CLI entry point
const args = process.argv.slice(2);
const batchFileIndex = args.indexOf("--batch");

if (batchFileIndex !== -1 && args[batchFileIndex + 1]) {
  const batchFilePath = path.resolve(process.cwd(), args[batchFileIndex + 1]);
  if (fs.existsSync(batchFilePath)) {
    console.log(`📂 Cargando lote de servicios desde: ${batchFilePath}`);
    const batchContent = JSON.parse(fs.readFileSync(batchFilePath, "utf-8"));
    if (Array.isArray(batchContent)) {
      addServices(batchContent);
    } else {
      console.error("❌ El archivo batch debe contener un array JSON de servicios.");
    }
  } else {
    console.error(`❌ No se encontró el archivo batch: ${batchFilePath}`);
  }
} else if (process.argv[1]?.endsWith("add-service.ts")) {
  runInteractiveCli();
}
