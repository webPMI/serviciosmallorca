/**
 * Eje geográfico de la taxonomía (ortogonal al eje de servicio — docs/TAXONOMY.md §3.1).
 * Cada negocio referencia exactamente 1 zona; las etiquetas geo finas (`zona:<slug>`)
 * se derivan de `popularAreas` mediante `normalizeToKebabAscii()` (src/data/tags.ts).
 *
 * GR-04: todos los nombres visibles llevan traducción es/en/ca/de.
 */

export interface LocalizedText {
  es: string;
  en: string;
  ca: string;
  de: string;
}

export interface MallorcaZone {
  id: string;
  name: LocalizedText;
  popularAreas: string[];
}

export const MALLORCA_ZONES: MallorcaZone[] = [
  {
    id: "palma",
    name: {
      es: "Palma & Bahía",
      en: "Palma & Bay",
      ca: "Palma & Badia",
      de: "Palma & Bucht",
    },
    popularAreas: [
      "Palma Centro",
      "Santa Catalina",
      "Portixol",
      "Son Vida",
      "Casco Antiguo",
      "Ciutat Jardí",
      "Platja de Palma",
      "Cala Gamba",
      "Coll d'en Rabassa",
      "Can Pastilla",
      "Paseo Marítimo",
    ],
  },
  {
    id: "calvia-andratx",
    name: {
      es: "Calvià & Andratx (Suroeste)",
      en: "Calvià & Andratx (Southwest)",
      ca: "Calvià & Andratx (Sud-oest)",
      de: "Calvià & Andratx (Südwesten)",
    },
    popularAreas: [
      "Puerto Portals",
      "Port Adriano",
      "Santa Ponsa",
      "Palmanova",
      "Peguera",
      "Port d'Andratx",
      "Andratx",
      "Es Capdellà",
    ],
  },
  {
    id: "tramuntana",
    name: {
      es: "Serra de Tramuntana",
      en: "Serra de Tramuntana",
      ca: "Serra de Tramuntana",
      de: "Serra de Tramuntana",
    },
    popularAreas: [
      "Sóller",
      "Port de Sóller",
      "Valldemossa",
      "Deià",
      "Esporles",
      "Fornalutx",
      "Escorca",
      "Banyalbufar",
      "Estellencs",
      "Puigpunyent",
    ],
  },
  {
    id: "alcudia-pollensa",
    name: {
      es: "Alcúdia & Pollença (Norte)",
      en: "Alcúdia & Pollença (North)",
      ca: "Alcúdia & Pollença (Nord)",
      de: "Alcúdia & Pollença (Norden)",
    },
    popularAreas: [
      "Port de Pollença",
      "Port d'Alcúdia",
      "Alcúdia",
      "Alcanada",
      "Playa de Muro",
      "Can Picafort",
      "Pollença",
      "Muro",
    ],
  },
  {
    id: "manacor-llevant",
    name: {
      es: "Manacor & Llevant (Este)",
      en: "Manacor & Llevant (East)",
      ca: "Manacor & Llevant (Est)",
      de: "Manacor & Llevant (Osten)",
    },
    popularAreas: [
      "Manacor",
      "Porto Cristo",
      "Cala Millor",
      "Cala Ratjada",
      "Artà",
      "Capdepera",
      "Canyamel",
      "Son Servera",
      "Cala Bona",
      "Colònia de Sant Pere",
    ],
  },
  {
    id: "santanyi-migjorn",
    name: {
      es: "Santanyí & Migjorn (Sureste)",
      en: "Santanyí & Migjorn (Southeast)",
      ca: "Santanyí & Migjorn (Sud-est)",
      de: "Santanyí & Migjorn (Südosten)",
    },
    popularAreas: [
      "Santanyí",
      "Cala d'Or",
      "Porto Petro",
      "Ses Salines",
      "Campos",
      "Llucmajor",
      "Colònia de Sant Jordi",
      "Cala Figuera",
      "Portocolom",
      "S'Arenal",
      "Felanitx",
      "Sa Ràpita",
      "S'Estanyol",
    ],
  },
  {
    id: "raiguer-pla",
    name: {
      es: "Es Raiguer & Es Pla (Centro)",
      en: "Es Raiguer & Es Pla (Centre)",
      ca: "Es Raiguer & Es Pla (Centre)",
      de: "Es Raiguer & Es Pla (Inselmitte)",
    },
    popularAreas: [
      "Inca",
      "Binissalem",
      "Santa Maria del Camí",
      "Alaró",
      "Sineu",
      "Selva",
      "Sencelles",
      "Santa Eugènia",
      "Algaida",
      "Llubí",
      "Sant Joan",
      "Porreres",
      "Lloseta",
      "Costitx",
    ],
  },
];

/** Resuelve una zona por id (kebab-case estable). */
export function getZoneById(id: string): MallorcaZone | undefined {
  return MALLORCA_ZONES.find((z) => z.id === id);
}
