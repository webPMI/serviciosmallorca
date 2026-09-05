import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, "../src/data/services");

// Map: folder -> export const name expected by root index.ts
const sectorExportNames: Record<string, string> = {
  "arte-tatuajes": "TATTOO_SERVICES",
  "gastronomia-restaurantes": "RESTAURANT_SERVICES",
  "nautica-charter": "NAUTICA_SERVICES",
  "spas-bienestar": "SPAS_SERVICES",
  "reformas-construccion": "REFORMAS_SERVICES",
  "servicios-profesionales": "PROFESIONALES_SERVICES",
  "inmobiliaria-villas": "INMOBILIARIA_SERVICES",
  "motor-transporte": "TRANSPORTE_SERVICES",
  "jardineria-piscinas": "JARDINERIA_SERVICES",
  "tecnologia-seguridad": "SEGURIDAD_SERVICES",
  "alojamiento-turismo": "ALOJAMIENTO_SERVICES",
  "retail-comercio": "RETAIL_SERVICES",
  "educacion-formacion": "EDUCACION_SERVICES",
  "entretenimiento-ocio": "ENTRETENIMIENTO_SERVICES",
  "deportes-fitness": "DEPORTES_SERVICES",
  "hogar-limpieza": "HOGAR_SERVICES",
  "mascotas-veterinaria": "MASCOTAS_SERVICES",
  "agricultura-productores": "AGRICULTURA_SERVICES",
  "artesania-manufactura": "ARTESANIA_SERVICES",
  "servicios-sociales": "SOCIALES_SERVICES",
  "finanzas-seguros": "FINANZAS_SERVICES",
  "salud-bienestar": "SALUD_SERVICES",
};

let totalServices = 0;

for (const [sector, arrName] of Object.entries(sectorExportNames)) {
  const sectorDir = path.join(baseDir, sector);
  if (!fs.existsSync(sectorDir)) continue;

  const files = fs.readdirSync(sectorDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");

  const imports: string[] = [];
  const exportsList: string[] = [];
  const arrayItems: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(sectorDir, file), "utf-8");
    const match = content.match(/export const (\w+): ServiceItem/);
    if (match) {
      const varName = match[1];
      imports.push(`import { ${varName} } from "./${file}";`);
      exportsList.push(`export { ${varName} } from "./${file}";`);
      arrayItems.push(`  ${varName},`);
    }
  }

  if (imports.length === 0) continue;

  const indexContent = `import type { ServiceItem } from "../types.ts";
${imports.join("\n")}

${exportsList.join("\n")}

export const ${arrName}: ServiceItem[] = [
${arrayItems.join("\n")}
];
`;

  fs.writeFileSync(path.join(sectorDir, "index.ts"), indexContent, "utf-8");
  console.log(`✅ ${sector}: ${imports.length} servicios → ${arrName}`);
  totalServices += imports.length;
}

console.log(`\n🏆 TOTAL SERVICIOS INDEXADOS: ${totalServices}`);
