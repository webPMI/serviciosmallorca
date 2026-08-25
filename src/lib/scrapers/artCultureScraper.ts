/**
 * src/lib/scrapers/artCultureScraper.ts
 *
 * Especialista de Dominio: Arte, Estudios de Tatuaje, Piercing y Galerías Culturales.
 * Extrae estilos de tatuaje, materiales de anillado, certificaciones sanitarias y dorks de convenciones.
 */

export interface ArtCultureScrapeResult {
  specialties: string[];
  certifications: string[];
  artDorks: Array<{ directoryName: string; searchUrl: string }>;
}

export function scrapeArtCultureData(html: string, businessName: string): ArtCultureScrapeResult {
  const encodedQuery = encodeURIComponent(businessName.trim());
  const lowerHtml = html.toLowerCase();

  // 1. Estilos y Especialidades
  const candidates: Array<{ keyword: string; label: string }> = [
    { keyword: "fine line", label: "Tatuaje Fine Line (Trazo Fino)" },
    { keyword: "microrealismo", label: "Microrealismo & Retratos" },
    { keyword: "blackwork", label: "Blackwork & Geometría Sagrada" },
    { keyword: "cover-up", label: "Cover-Up & Restauración de Tatuajes" },
    { keyword: "cover up", label: "Cover-Up & Restauración" },
    { keyword: "tradicional", label: "Old School / Tradicional Americano" },
    { keyword: "acuarela", label: "Acuarela & Ilustración Artística" },
    { keyword: "piercing", label: "Piercing Anatómico & Perforación de Precisión" },
    { keyword: "joyería", label: "Joyería de Titanio ASTM F-136 & Oro 14k" },
  ];

  const matched = new Set<string>();
  for (const item of candidates) {
    if (lowerHtml.includes(item.keyword)) {
      matched.add(item.label);
      if (matched.size >= 5) break;
    }
  }

  // 2. Certificaciones Sanitarias y Materiales
  const certs = new Set<string>();
  certs.add("Higiénico Sanitario Oficial del Govern Balear");

  if (lowerHtml.includes("titanio") || lowerHtml.includes("astm")) {
    certs.add("Titanio Grado Implante ASTM F-136");
  }
  if (lowerHtml.includes("autoclave") || lowerHtml.includes("clase b")) {
    certs.add("Esterilización Autoclave Clase B & Material Desechable");
  }
  if (lowerHtml.includes("vegano") || lowerHtml.includes("vegan")) {
    certs.add("Tintas Orgánicas y Veganas Certificadas");
  }

  // 3. Dorks Específicos de Arte y Tatuajes
  const artDorks = [
    {
      directoryName: "Premios y Convenciones de Tatuaje",
      searchUrl: `https://www.google.com/search?q=${encodedQuery}+"convencion"+OR+"tattoo+convention"+OR+"premio"+mallorca`,
    },
    {
      directoryName: "Gremio de Tatuadores de Baleares",
      searchUrl: `https://www.google.com/search?q=site:diariodemallorca.es+OR+site:ultimahora.es+${encodedQuery}+tatuaje`,
    },
    {
      directoryName: "Galerías y Exposiciones Palma",
      searchUrl: `https://www.google.com/search?q=site:arabalears.cat+OR+site:ultimahora.es+${encodedQuery}+exposicio`,
    },
  ];

  return {
    specialties: Array.from(matched),
    certifications: Array.from(certs),
    artDorks,
  };
}
