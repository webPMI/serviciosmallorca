/**
 * src/lib/scrapers/restaurantScraper.ts
 *
 * Especialista de Dominio: Gastronomía, Restauración, Bodegas y Beach Clubs.
 * Extrae cartas digitales, especialidades culinarias y dorks gastronómicos (Michelin, Repsol, TheFork).
 */

export interface RestaurantScrapeResult {
  menuUrl?: string;
  specialties: string[];
  gastronomyDorks: Array<{ directoryName: string; searchUrl: string }>;
}

export function scrapeRestaurantData(html: string, baseUrl: URL, businessName: string): RestaurantScrapeResult {
  const encodedQuery = encodeURIComponent(businessName.trim());
  let menuUrl: string | undefined;

  // 1. Detección Inteligente de Carta / Menú
  const cleanedHtml = html.replace(/\\\//g, "/");
  const hrefMatches = Array.from(cleanedHtml.matchAll(/href=["']([^"']+)["']/gi)).map((m) => m[1]);
  const rawUrlMatches = cleanedHtml.match(/(?:https?:)?\/\/[^\s"'<>()\\]+/gi) || [];
  const allCandidateUrls = [...hrefMatches, ...rawUrlMatches];

  for (const rawUrl of allCandidateUrls) {
    const lowerU = rawUrl.toLowerCase();
    if (
      (lowerU.includes("/menu") ||
        lowerU.includes("/carta") ||
        lowerU.includes("/carta-digital") ||
        lowerU.includes("/food") ||
        lowerU.includes("/speisekarte") ||
        (lowerU.endsWith(".pdf") && (lowerU.includes("menu") || lowerU.includes("carta")))) &&
      !menuUrl &&
      // Excluir rutas de WordPress/plugins/CSS/JS (falso positivo)
      !lowerU.includes("/wp-content/") &&
      !lowerU.includes("/wp-includes/") &&
      !lowerU.includes(".min.css") &&
      !lowerU.includes(".min.js") &&
      !lowerU.includes("/tags/") &&
      !lowerU.includes("/category/") &&
      !lowerU.includes("?ver=") &&
      !lowerU.includes("/feed/") &&
      !lowerU.includes("/comments/") &&
      !lowerU.includes("/rtl/") &&
      !lowerU.includes("/images/") &&
      !lowerU.includes("/css/") &&
      !lowerU.includes("/js/")
    ) {
      try {
        menuUrl = new URL(rawUrl, baseUrl).href;
      } catch {
        menuUrl = rawUrl;
      }
    }
  }

  // 2. Extracción de Especialidades Culinarias
  const lowerHtml = html.toLowerCase();
  const candidates: Array<{ keyword: string; label: string }> = [
    { keyword: "pescado del día", label: "Pescado Fresco del Día" },
    { keyword: "pescado de lonja", label: "Pescado de Lonja Balear" },
    { keyword: "marisco", label: "Marisco Fresco" },
    { keyword: "arroz meloso", label: "Arroces y Paellas Tradicionales" },
    { keyword: "paella", label: "Paella Mallorquina" },
    { keyword: "tapas", label: "Tapas Caseras y Platillos" },
    { keyword: "degustación", label: "Menú Degustación de Autor" },
    { keyword: "degustacio", label: "Menú Degustació" },
    { keyword: "cocina mallorquina", label: "Cocina Tradicional Balear" },
    { keyword: "porc negre", label: "Porc Negre Mallorquí" },
    { keyword: "lechona", label: "Lechona Asada Tradicional" },
    { keyword: "gamba roja", label: "Gamba Roja de Sóller" },
    { keyword: "brunch", label: "Brunch & Desayunos Especiales" },
    { keyword: "maridaje", label: "Maridaje con Vinos de la Tierra" },
    { keyword: "coctelería", label: "Coctelería de Autor" },
    { keyword: "cocktails", label: "Cocktails de Autor" },
    { keyword: "postres caseros", label: "Repostería Casera & Ensaimadas" },
  ];

  const matched = new Set<string>();
  for (const item of candidates) {
    if (lowerHtml.includes(item.keyword)) {
      matched.add(item.label);
      if (matched.size >= 5) break;
    }
  }

  // 3. Dorks Específicos de Gastronomía
  const gastronomyDorks = [
    {
      directoryName: "Guía Michelin España (Estrellas / Bib Gourmand)",
      searchUrl: `https://www.google.com/search?q=site:guide.michelin.com+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "Guía Repsol (Soles & Soletes)",
      searchUrl: `https://www.google.com/search?q=site:guiarepsol.com+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "TheFork / ElTenedor Reservas",
      searchUrl: `https://www.google.com/search?q=site:thefork.es+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "TripAdvisor Gastronomía Mallorca",
      searchUrl: `https://www.google.com/search?q=site:tripadvisor.es+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "ABC Mallorca Gastronomía",
      searchUrl: `https://www.google.com/search?q=site:abc-mallorca.com+${encodedQuery}`,
    },
  ];

  return {
    menuUrl,
    specialties: Array.from(matched),
    gastronomyDorks,
  };
}
