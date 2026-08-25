/**
 * Eje geográfico de la taxonomía (ortogonal al eje de servicio — docs/TAXONOMY.md §3.1).
 * Cada negocio referencia exactamente 1 zona; las etiquetas geo finas (`zona:<slug>`)
 * se derivan de `popularAreas` mediante `normalizeToKebabAscii()` (src/data/tags.ts).
 *
 * GR-04: todos los nombres visibles llevan traducción es/en/ca.
 */
export interface LocalizedText {
  es: string;
  en: string;
  ca: string;
}

export interface MallorcaZone {
  id: string;
  name: LocalizedText;
  popularAreas: string[];
}

export const MALLORCA_ZONES: MallorcaZone[] = [
  {
    id: "palma",
    name: { es: "Palma & Bahía", en: "Palma & Bay", ca: "Palma & Badia" },
    popularAreas: ["Palma Centro", "Santa Catalina", "Portixol", "Son Vida", "Casco Antiguo"],
  },
  {
    id: "calvia-andratx",
    name: {
      es: "Calvià & Andratx (Suroeste)",
      en: "Calvià & Andratx (Southwest)",
      ca: "Calvià & Andratx (Sud-oest)",
    },
    popularAreas: ["Puerto Portals", "Port Adriano", "Santa Ponsa", "Palmanova", "Port d'Andratx"],
  },
  {
    id: "tramuntana",
    name: { es: "Serra de Tramuntana", en: "Serra de Tramuntana", ca: "Serra de Tramuntana" },
    popularAreas: ["Sóller", "Port de Sóller", "Valldemossa", "Deià", "Esporles", "Fornalutx"],
  },
  {
    id: "alcudia-pollensa",
    name: {
      es: "Alcúdia & Pollença (Norte)",
      en: "Alcúdia & Pollença (North)",
      ca: "Alcúdia & Pollença (Nord)",
    },
    popularAreas: ["Port de Pollença", "Port d'Alcúdia", "Playa de Muro", "Can Picafort"],
  },
  {
    id: "manacor-llevant",
    name: { es: "Manacor & Llevant (Este)", en: "Manacor & Llevant (East)", ca: "Manacor & Llevant (Est)" },
    popularAreas: ["Manacor", "Porto Cristo", "Cala Millor", "Cala Ratjada", "Artà"],
  },
  {
    id: "santanyi-migjorn",
    name: {
      es: "Santanyí & Migjorn (Sureste)",
      en: "Santanyí & Migjorn (Southeast)",
      ca: "Santanyí & Migjorn (Sud-est)",
    },
    popularAreas: ["Santanyí", "Cala d'Or", "Porto Petro", "Ses Salines", "Campos", "Llucmajor"],
  },
  {
    id: "raiguer-pla",
    name: {
      es: "Es Raiguer & Es Pla (Centro)",
      en: "Es Raiguer & Es Pla (Centre)",
      ca: "Es Raiguer & Es Pla (Centre)",
    },
    popularAreas: ["Inca", "Binissalem", "Santa Maria del Camí", "Alaró", "Sineu"],
  },
];

/** Resuelve una zona por id (kebab-case estable). */
export function getZoneById(id: string): MallorcaZone | undefined {
  return MALLORCA_ZONES.find((z) => z.id === id);
}
