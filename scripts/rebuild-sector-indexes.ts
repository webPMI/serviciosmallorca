import fs from "node:fs";
import path from "node:path";

const SECTORS: { dir: string; arrayName: string; alias: string }[] = [
  { dir: "arte-tatuajes", arrayName: "TATTOO_SERVICES", alias: "TATTOO_SERVICES" },
  { dir: "gastronomia-restaurantes", arrayName: "GASTRONOMIA_SERVICES", alias: "RESTAURANT_SERVICES" },
  { dir: "nautica-charter", arrayName: "NAUTICA_SERVICES", alias: "NAUTICA_SERVICES" },
  { dir: "spas-bienestar", arrayName: "SPAS_SERVICES", alias: "SPAS_SERVICES" },
  { dir: "reformas-construccion", arrayName: "REFORMAS_SERVICES", alias: "REFORMAS_SERVICES" },
  { dir: "servicios-profesionales", arrayName: "PROFESIONALES_SERVICES", alias: "PROFESIONALES_SERVICES" },
  { dir: "inmobiliaria-villas", arrayName: "INMOBILIARIA_SERVICES", alias: "INMOBILIARIA_SERVICES" },
  { dir: "motor-transporte", arrayName: "TRANSPORTE_SERVICES", alias: "TRANSPORTE_SERVICES" },
  { dir: "jardineria-piscinas", arrayName: "JARDINERIA_SERVICES", alias: "JARDINERIA_SERVICES" },
  { dir: "tecnologia-seguridad", arrayName: "SEGURIDAD_SERVICES", alias: "SEGURIDAD_SERVICES" },
];

async function main() {
  const servicesBase = path.resolve("src", "data", "services");

  for (const sector of SECTORS) {
    const sectorPath = path.join(servicesBase, sector.dir);
    if (!fs.existsSync(sectorPath)) continue;

    const files = fs
      .readdirSync(sectorPath)
      .filter((f) => f.endsWith(".ts") && f !== "index.ts")
      .sort();

    const imports: string[] = [];
    const exports: string[] = [];
    const items: string[] = [];

    for (const file of files) {
      const fullPath = path.join(sectorPath, file);
      const content = fs.readFileSync(fullPath, "utf8");
      const exportMatch = content.match(/export\s+const\s+([a-zA-Z0-9_$]+)\s*:\s*ServiceItem/);
      if (exportMatch) {
        const varName = exportMatch[1];
        imports.push(`import { ${varName} } from "./${file}";`);
        exports.push(`  ${varName},`);
        items.push(`  ${varName},`);
      }
    }

    const indexContent = `import type { ServiceItem } from "../types.ts";
${imports.join("\n")}

export {
${exports.join("\n")}
};

export const ${sector.arrayName}: ServiceItem[] = [
${items.join("\n")}
];

${sector.alias !== sector.arrayName ? `export { ${sector.arrayName} as ${sector.alias} };\n` : ""}`;

    const indexPath = path.join(sectorPath, "index.ts");
    fs.writeFileSync(indexPath, indexContent, "utf8");
    console.log(`✅ Rebuilt ${sector.dir}/index.ts (${items.length} services)`);
  }
}

main().catch(console.error);
