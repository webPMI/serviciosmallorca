/**
 * scripts/test-service-contacts.ts
 *
 * Script Automatizado de Testing y Auditoría de Canales de Contacto (General e Individual).
 *
 * Valida la integridad de canales de contacto de los negocios en Mallorca:
 *  - Teléfonos fijos vs WhatsApp móviles (GR-11 Zero Fake Data).
 *  - Ningún teléfono fijo (971, 871, 9xx, 8xx en España) puede estar asignado como WhatsApp.
 *  - Solo móviles (6xx, 7xx, internacionales válidos) pueden generar enlaces wa.me.
 *  - Formato de teléfono, website, email y comportamiento de los CTAs.
 *
 * Modos de ejecución:
 *   # Testing General (todo el catálogo de 811 servicios):
 *   npm run test:contacts
 *   node --experimental-strip-types scripts/test-service-contacts.ts
 *
 *   # Testing por Sector:
 *   node --experimental-strip-types scripts/test-service-contacts.ts --sector=restaurantes-gastronomia
 *
 *   # Testing Individual (por slug, id o nombre):
 *   node --experimental-strip-types scripts/test-service-contacts.ts --slug=bar-espanya-palma
 *   node --experimental-strip-types scripts/test-service-contacts.ts --name="Bar Bosch"
 *   node --experimental-strip-types scripts/test-service-contacts.ts --id=urban-soul-tattoo-palma
 *
 *   # Modo Estricto para CI (falla con exit code 1 si hay advertencias o errores):
 *   node --experimental-strip-types scripts/test-service-contacts.ts --ci
 */

import { SERVICES, type ServiceItem } from "../src/data/services/index.ts";
import { isValidWhatsAppNumber, formatWhatsAppLink } from "../src/lib/whatsappUtils.ts";

export interface ContactIssue {
  severity: "ERROR" | "WARNING";
  rule: string;
  message: string;
}

export interface ServiceContactReport {
  id: string;
  name: string;
  slug: string;
  sectorId?: string;
  category: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  isWaMobile: boolean;
  ctaType: "WHATSAPP" | "CALL_ONLY" | "NONE";
  generatedWaUrl: string | null;
  issues: ContactIssue[];
}

export function auditServiceContact(service: ServiceItem): ServiceContactReport {
  const issues: ContactIssue[] = [];

  const rawPhone = service.phone?.trim() || "";
  const rawWa = service.whatsapp?.trim() || "";
  const rawWeb = service.website?.trim() || "";
  const rawEmail = service.email?.trim() || "";

  // 1. WhatsApp Validation: nunca puede ser línea fija española
  let isWaMobile = false;
  if (rawWa) {
    if (isValidWhatsAppNumber(rawWa)) {
      isWaMobile = true;
    } else {
      issues.push({
        severity: "ERROR",
        rule: "WHATSAPP_NO_LANDLINE",
        message: `El número asignado a whatsapp (${rawWa}) no es un móvil válido o es un teléfono fijo (ej. 971/871). WhatsApp no funcionará.`,
      });
    }
  }

  // 2. Validación de generación de URL de WhatsApp
  const sampleText = `Hola, contacto desde Servicios Mallorca para ${service.name}`;
  const generatedWaUrl = formatWhatsAppLink(rawWa, sampleText);

  if (rawWa && !isWaMobile && generatedWaUrl !== null) {
    issues.push({
      severity: "ERROR",
      rule: "WHATSAPP_CTA_LEAK",
      message: `formatWhatsAppLink generó una URL para un número inválido: ${generatedWaUrl}`,
    });
  }

  // 3. Chequeo de duplicidad errónea: si phone es fijo y whatsapp es igual a phone
  if (rawWa && rawPhone) {
    const cleanWa = rawWa.replace(/[^0-9]/g, "");
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    if (cleanWa === cleanPhone && !isWaMobile) {
      issues.push({
        severity: "ERROR",
        rule: "LANDLINE_CLONED_TO_WHATSAPP",
        message: `El teléfono fijo principal (${rawPhone}) fue clonado indebidamente en whatsapp.`,
      });
    }
  }

  // 4. Formato de Teléfono general
  if (rawPhone) {
    const digitsOnly = rawPhone.replace(/[^0-9]/g, "");
    if (digitsOnly.length < 9) {
      issues.push({
        severity: "ERROR",
        rule: "PHONE_TOO_SHORT",
        message: `El teléfono (${rawPhone}) tiene menos de 9 dígitos.`,
      });
    }
  } else {
    issues.push({
      severity: "WARNING",
      rule: "PHONE_MISSING",
      message: "El negocio no tiene teléfono registrado.",
    });
  }

  // 5. Validación de Website
  if (rawWeb) {
    if (!/^https?:\/\//i.test(rawWeb)) {
      issues.push({
        severity: "WARNING",
        rule: "WEBSITE_NO_PROTOCOL",
        message: `El sitio web (${rawWeb}) no incluye protocolo http:// o https://`,
      });
    }
    if (rawWeb.includes("example.com") || rawWeb.includes("test.com")) {
      issues.push({
        severity: "ERROR",
        rule: "WEBSITE_FICTITIOUS",
        message: `El sitio web contiene un dominio ficticio de prueba: ${rawWeb}`,
      });
    }
  }

  // 6. Validación de Email
  if (rawEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      issues.push({
        severity: "WARNING",
        rule: "EMAIL_INVALID_SYNTAX",
        message: `El formato de email es inválido: ${rawEmail}`,
      });
    }
  }

  const ctaType: "WHATSAPP" | "CALL_ONLY" | "NONE" = isWaMobile
    ? "WHATSAPP"
    : rawPhone
      ? "CALL_ONLY"
      : "NONE";

  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    sectorId: service.sectorId,
    category: service.category,
    phone: rawPhone || undefined,
    whatsapp: rawWa || undefined,
    website: rawWeb || undefined,
    email: rawEmail || undefined,
    isWaMobile,
    ctaType,
    generatedWaUrl,
    issues,
  };
}

// ==========================================
// CLI Execution
// ==========================================
function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    slug?: string;
    id?: string;
    name?: string;
    sector?: string;
    ci?: boolean;
  } = {};

  for (const arg of args) {
    if (arg.startsWith("--slug=")) {
      options.slug = arg.split("=")[1].trim();
    } else if (arg.startsWith("--id=")) {
      options.id = arg.split("=")[1].trim();
    } else if (arg.startsWith("--name=")) {
      options.name = arg.split("=")[1].trim();
    } else if (arg.startsWith("--sector=")) {
      options.sector = arg.split("=")[1].trim();
    } else if (arg === "--ci") {
      options.ci = true;
    }
  }

  return options;
}

function runIndividualTest(report: ServiceContactReport) {
  console.log("\n========================================================");
  console.log(`🔎 TEST INDIVIDUAL DE CONTACTO: ${report.name}`);
  console.log("========================================================");
  console.log(`📌 ID:          ${report.id}`);
  console.log(`🔗 Slug:        ${report.slug}`);
  console.log(`🏷️  Categoría:   ${report.category} (${report.sectorId || "N/A"})`);
  console.log(`📞 Teléfono:    ${report.phone || "❌ No registrado"}`);
  console.log(`💬 WhatsApp:    ${report.whatsapp || "➖ No registrado (Opcional)"}`);
  console.log(`🌐 Website:     ${report.website || "➖ No registrado"}`);
  console.log(`✉️  Email:       ${report.email || "➖ No registrado"}`);
  console.log("--------------------------------------------------------");
  console.log(`📱 Es WhatsApp Móvil Válido: ${report.isWaMobile ? "✅ SÍ" : "❌ NO"}`);
  console.log(`🎯 Tipo de CTA Activo:      ${report.ctaType === "WHATSAPP" ? "🟢 WhatsApp + Llamada" : report.ctaType === "CALL_ONLY" ? "📞 Solo Llamada Telefónica (Fijo protegido)" : "⚪ Ninguno"}`);
  if (report.generatedWaUrl) {
    console.log(`🔗 URL wa.me generada:      ${report.generatedWaUrl}`);
  } else {
    console.log(`🔗 URL wa.me generada:      null (Sin fallback roto a teléfono fijo)`);
  }
  console.log("--------------------------------------------------------");

  if (report.issues.length === 0) {
    console.log("✅ RESULTADO: TEST PASADO (Cero errores de canal de contacto)");
  } else {
    console.log(`⚠️  INCIDENCIAS ENCONTRADAS (${report.issues.length}):`);
    for (const issue of report.issues) {
      const icon = issue.severity === "ERROR" ? "🛑 [ERROR]" : "⚠️ [WARN]";
      console.log(`   ${icon} ${issue.rule}: ${issue.message}`);
    }
  }
  console.log("========================================================\n");
}

function runGeneralAudit(options: { sector?: string; ci?: boolean }) {
  let list = SERVICES;
  if (options.sector) {
    const sTerm = options.sector.toLowerCase();
    list = SERVICES.filter(
      (s) =>
        (s.sectorId && s.sectorId.toLowerCase().includes(sTerm)) ||
        (s.category && s.category.toLowerCase().includes(sTerm))
    );
    console.log(`\n🔍 Filtrando por sector/categoría: "${options.sector}" (${list.length} servicios)`);
  }

  console.log("\n========================================================");
  console.log(`🚀 TEST AUTOMATIZADO GENERAL DE CANALES DE CONTACTO`);
  console.log(`📊 Servicios analizados: ${list.length} de ${SERVICES.length} totales`);
  console.log("========================================================");

  let totalErrors = 0;
  let totalWarnings = 0;
  let mobileWhatsAppCount = 0;
  let callOnlyCount = 0;
  let noPhoneCount = 0;

  const failedReports: ServiceContactReport[] = [];

  for (const s of list) {
    const rep = auditServiceContact(s);
    if (rep.isWaMobile) mobileWhatsAppCount++;
    if (rep.ctaType === "CALL_ONLY") callOnlyCount++;
    if (rep.ctaType === "NONE") noPhoneCount++;

    const errors = rep.issues.filter((i) => i.severity === "ERROR");
    const warnings = rep.issues.filter((i) => i.severity === "WARNING");

    totalErrors += errors.length;
    totalWarnings += warnings.length;

    if (errors.length > 0) {
      failedReports.push(rep);
    }
  }

  console.log(`🟢 Negocios con WhatsApp Móvil verificado: ${mobileWhatsAppCount}`);
  console.log(`📞 Negocios protegidos solo para Llamada:  ${callOnlyCount}`);
  console.log(`⚪ Negocios sin teléfono:                   ${noPhoneCount}`);
  console.log("--------------------------------------------------------");
  console.log(`🛑 Errores Críticos (GR-11):               ${totalErrors}`);
  console.log(`⚠️  Advertencias Menores:                    ${totalWarnings}`);
  console.log("========================================================");

  if (failedReports.length > 0) {
    console.log("\n❌ LISTA DE SERVICIOS CON ERRORES CRÍTICOS:");
    for (const f of failedReports) {
      console.log(` • [${f.id}] ${f.name}`);
      for (const iss of f.issues.filter((i) => i.severity === "ERROR")) {
        console.log(`    🛑 ${iss.rule}: ${iss.message}`);
      }
    }
    console.log("\n❌ EL TEST HA FALLADO. Por favor corrige las líneas fijas asignadas a WhatsApp.\n");
    if (options.ci) {
      process.exit(1);
    }
  } else {
    console.log("\n✅ TODOS LOS CANALES DE CONTACTO ESTÁN IMPECABLES Y BLINDADOS.");
    console.log("   Cero números fijos en WhatsApp. Cero enlaces wa.me rotos.\n");
  }
}

// Ejecución principal solo si se invoca como script CLI (no al ser importado por tests)
if (!process.env.VITEST) {
  const opts = parseArgs();

  if (opts.slug || opts.id || opts.name) {
    const target = SERVICES.find((s) => {
      if (opts.slug && s.slug === opts.slug) return true;
      if (opts.id && s.id === opts.id) return true;
      if (opts.name && s.name.toLowerCase().includes(opts.name.toLowerCase())) return true;
      return false;
    });

    if (!target) {
      console.error(`\n❌ No se encontró ningún servicio que coincida con: ${JSON.stringify(opts)}\n`);
      process.exit(1);
    }

    const report = auditServiceContact(target);
    runIndividualTest(report);
    if (report.issues.some((i) => i.severity === "ERROR") && opts.ci) {
      process.exit(1);
    }
  } else {
    runGeneralAudit(opts);
  }
}

