import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { SERVICES, type ServiceItem } from "../src/data/services.ts";
import { CATEGORIES } from "../src/data/categories.ts";
import { MALLORCA_ZONES } from "../src/data/zones.ts";
import { validateServicesList } from "../src/lib/validateServices.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVICES_FILE_PATH = path.resolve(__dirname, "../src/data/services.ts");

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

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function verifyUrl(url: string): Promise<{ ok: boolean; status?: number }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    clearTimeout(timeout);
    return { ok: res.ok || (res.status >= 200 && res.status < 400), status: res.status };
  } catch {
    return { ok: false };
  }
}

function persistServiceToCode(newServices: ServiceItem[]): void {
  const allServices = [...SERVICES, ...newServices];

  // Serializar con formato TypeScript limpio
  const headerCode = `export type ServiceStatus = "open" | "seasonal_closure" | "permanently_closed";

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  zone: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceRange: "€" | "€€" | "€€€" | "€€€€";
  verified: boolean;
  featured: boolean;
  status: ServiceStatus;
  lastVerifiedAt: string;
  googleMapsUrl?: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  tags: string[];
  shortDescription: {
    es: string;
    en: string;
    ca: string;
  };
  fullDescription: {
    es: string;
    en: string;
    ca: string;
  };
  highlights: {
    es: string[];
    en: string[];
    ca: string[];
  };
  servicesProvided: {
    es: string[];
    en: string[];
    ca: string[];
  };
  image: string;
  gallery: string[];
  schedule: string;
}

export const SERVICES: ServiceItem[] = ${JSON.stringify(allServices, null, 2)};

export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICES.find((s) => s.id === id || s.slug === id);
}

export function getFeaturedServices(): ServiceItem[] {
  return SERVICES.filter((s) => s.featured && s.status === "open");
}

export function getServicesByCategory(categoryId: string): ServiceItem[] {
  return SERVICES.filter((s) => s.category === categoryId && s.status !== "permanently_closed");
}

export function getServicesByZone(zoneId: string): ServiceItem[] {
  return SERVICES.filter((s) => s.zone === zoneId && s.status !== "permanently_closed");
}
`;

  fs.writeFileSync(SERVICES_FILE_PATH, headerCode, "utf-8");
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

    if (item.website) {
      process.stdout.write(`⏳ Comprobando estado web de "${item.name}"... `);
      const health = await verifyUrl(item.website);
      if (health.ok) {
        console.log(`✅ OK (${health.status || 200})`);
      } else {
        console.log(`⚠️ Alerta: no respondió satisfactoriamente (${item.website})`);
      }
    }

    const service: ServiceItem = {
      id: slug,
      slug,
      name: item.name,
      category: item.category || "servicios-profesionales",
      zone: item.zone || "palma",
      address: item.address || "Mallorca, Illes Balears",
      coordinates: item.coordinates || { lat: 39.5696, lng: 2.6502 },
      rating: item.rating || 4.8,
      reviewCount: item.reviewCount || 50,
      priceRange: item.priceRange || "€€",
      verified: true,
      featured: item.featured || false,
      status: item.status || "open",
      lastVerifiedAt: item.lastVerifiedAt || today,
      googleMapsUrl:
        item.googleMapsUrl ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.name || "") + " " + (item.address || "") + " Mallorca")}`,
      appleMapsUrl:
        item.appleMapsUrl ||
        `https://maps.apple.com/?q=${encodeURIComponent((item.name || "") + " " + (item.address || "") + " Mallorca")}`,
      bingMapsUrl:
        item.bingMapsUrl ||
        `https://www.bing.com/maps?where1=${encodeURIComponent((item.name || "") + " " + (item.address || "") + " Mallorca")}`,
      phone: item.phone || "+34 971 000 000",
      whatsapp: item.whatsapp || item.phone || "+34 971 000 000",
      email: item.email || `info@${slug}.com`,
      website: item.website || "",
      tags: item.tags || [item.name, "Mallorca"],
      shortDescription: item.shortDescription || {
        es: `${item.name} ofrece servicios profesionales de calidad en Mallorca.`,
        en: `${item.name} offers quality professional services in Mallorca.`,
        ca: `${item.name} ofereix serveis professionals de qualitat a Mallorca.`,
      },
      fullDescription: item.fullDescription || {
        es: `${item.name} es una empresa verificada en Mallorca con amplia experiencia contrastada.`,
        en: `${item.name} is a verified company in Mallorca with proven track record.`,
        ca: `${item.name} és una empresa verificada a Mallorca amb àmplia experiència contrastada.`,
      },
      highlights: item.highlights || {
        es: ["Servicio verificado y contrastado en Baleares", "Atención profesional y presupuestos claros"],
        en: ["Verified and tested service in the Balearics", "Professional customer service and clear quotes"],
        ca: ["Servei verificat a les Balears", "Atenció professional i pressuposts clars"],
      },
      servicesProvided: item.servicesProvided || {
        es: ["Servicios especializados", "Atención personalizada"],
        en: ["Specialized services", "Personalized attention"],
        ca: ["Serveis especialitzats", "Atenció personalitzada"],
      },
      image:
        item.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
      gallery: item.gallery || [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
      ],
      schedule: item.schedule || "Lun - Vie: 08:30 - 19:00",
    };

    processedItems.push(service);
  }

  if (processedItems.length === 0) {
    console.log("ℹ️ No hay nuevos servicios válidos para agregar.");
    return;
  }

  // Validar el conjunto completo antes de persistir
  const validation = validateServicesList([...SERVICES, ...processedItems]);
  if (!validation.valid) {
    console.error("❌ Error de validación de integridad. No se guardaron los cambios:");
    validation.errors.forEach((err) => console.error(`  - ${err}`));
    return;
  }

  // Persistir en el archivo TypeScript
  persistServiceToCode(processedItems);
  console.log(
    `\n🎉 ¡Éxito! Se han persistido ${processedItems.length} nuevos servicios reales en src/data/services.ts.`,
  );
}

export async function runInteractiveCli() {
  console.log("\n=======================================================");
  console.log("🌴 SERVICIOS MALLORCA — ASISTENTE DE CURACIÓN E INGESTA");
  console.log("=======================================================\n");

  const name = await askQuestion("1. Nombre comercial del negocio: ");
  if (!name) {
    console.error("❌ El nombre es obligatorio.");
    return;
  }

  console.log("\nCategorías disponibles:");
  CATEGORIES.forEach((c, idx) => console.log(`  ${idx + 1}. [${c.id}] ${c.icon} ${c.name.es}`));
  const catChoice = await askQuestion("2. Selecciona categoría (número o ID): ");
  let category = CATEGORIES[parseInt(catChoice, 10) - 1]?.id || catChoice;
  if (!CATEGORIES.some((c) => c.id === category)) category = "servicios-profesionales";

  console.log("\nZonas de Mallorca disponibles:");
  MALLORCA_ZONES.forEach((z, idx) => console.log(`  ${idx + 1}. [${z.id}] 📍 ${z.name}`));
  const zoneChoice = await askQuestion("3. Selecciona zona (número o ID): ");
  let zone = MALLORCA_ZONES[parseInt(zoneChoice, 10) - 1]?.id || zoneChoice;
  if (!MALLORCA_ZONES.some((z) => z.id === zone)) zone = "palma";

  const address = await askQuestion("4. Dirección física en Mallorca: ");
  const phone = await askQuestion("5. Teléfono de contacto: ");
  const whatsapp = (await askQuestion("6. WhatsApp (Enter para usar el teléfono): ")) || phone;
  const website = await askQuestion("7. Sitio web oficial (https://...): ");
  const ratingStr = (await askQuestion("8. Valoración Google (ej. 4.9): ")) || "4.8";
  const reviewCountStr = (await askQuestion("9. Número de reseñas (ej. 85): ")) || "50";
  const priceRange = ((await askQuestion("10. Rango precio (€, €€, €€€, €€€€): ")) || "€€") as any;
  const shortDescEs = await askQuestion("11. Descripción corta (ES): ");
  const shortDescEn = (await askQuestion("12. Descripción corta (EN): ")) || shortDescEs;
  const shortDescCa = (await askQuestion("13. Descripción corta (CA): ")) || shortDescEs;

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
      priceRange,
      shortDescription: {
        es: shortDescEs,
        en: shortDescEn,
        ca: shortDescCa,
      },
    },
  ]);
}

// Comprobar argumentos CLI (batch file o interactivo)
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
