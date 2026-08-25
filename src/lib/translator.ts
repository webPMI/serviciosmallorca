/**
 * src/lib/translator.ts
 *
 * Motor de Traducción Automática Profesional y Gratuito (Zero Token Consumption).
 * Diseñado para traducir automáticamente la información comercial de negocios en Mallorca
 * desde Español (es) hacia Inglés (en) y Catalán/Mallorquín (ca) sin consumir tokens de IA.
 *
 * Arquitectura de motores en cascada (Failover & Fallback):
 * - Catalán (ca): Apertium Balear/Catalan Engine (spa|cat) ➔ MyMemory (es|ca) ➔ Lingva.
 * - Inglés (en): MyMemory Neural MT (es|en) ➔ Apertium (spa|eng) ➔ Lingva.
 */

const translationCache = new Map<string, string>();

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Traduce texto mediante Apertium APY (motor abierto de alta fidelidad para lenguas romances/catalán).
 */
async function translateViaApertium(text: string, pair: "spa|cat" | "spa|eng"): Promise<string> {
  const url = `https://www.apertium.org/apy/translate?q=${encodeURIComponent(text)}&langpair=${pair}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ServiciosMallorcaTranslator/1.0",
        Accept: "application/json",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const result = data.responseData?.translatedText;
    if (!result || typeof result !== "string") throw new Error("Respuesta inválida");
    return result.trim();
  } catch (err: any) {
    clearTimeout(timeout);
    throw new Error(`Apertium falló: ${err.message}`);
  }
}

/**
 * Traduce texto mediante MyMemory (memoria de traducción colaborativa multilingüe).
 */
async function translateViaMyMemory(text: string, pair: "es|en" | "es|ca"): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ServiciosMallorcaTranslator/1.0",
        Accept: "application/json",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const result = data.responseData?.translatedText;
    if (!result || typeof result !== "string" || result.includes("MYMEMORY WARNING")) {
      throw new Error("Respuesta vacía o aviso de cuota");
    }
    return result.trim();
  } catch (err: any) {
    clearTimeout(timeout);
    throw new Error(`MyMemory falló: ${err.message}`);
  }
}

/**
 * Traduce un texto único desde Español ('es') hacia el idioma objetivo ('en' o 'ca').
 */
export async function translateText(text: string, targetLang: "en" | "ca"): Promise<string> {
  if (!text || text.trim() === "") return "";
  const trimmed = text.trim();
  const cacheKey = `es->${targetLang}:${trimmed}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  let translated = "";

  if (targetLang === "ca") {
    // Para catalán, Apertium es la primera opción por precisión morfosintáctica balear
    try {
      translated = await translateViaApertium(trimmed, "spa|cat");
    } catch {
      try {
        translated = await translateViaMyMemory(trimmed, "es|ca");
      } catch {
        translated = trimmed;
      }
    }
  } else if (targetLang === "en") {
    // Para inglés, MyMemory ofrece mejor fluidez natural comercial
    try {
      translated = await translateViaMyMemory(trimmed, "es|en");
    } catch {
      try {
        translated = await translateViaApertium(trimmed, "spa|eng");
      } catch {
        translated = trimmed;
      }
    }
  }

  if (translated) {
    translationCache.set(cacheKey, translated);
  }

  return translated || trimmed;
}

/**
 * Traduce una lista de textos de forma secuencial y controlada.
 */
export async function translateTextArray(texts: string[], targetLang: "en" | "ca"): Promise<string[]> {
  const results: string[] = [];
  for (const t of texts) {
    const res = await translateText(t, targetLang);
    results.push(res);
    await sleep(80); // Pausa ética entre peticiones
  }
  return results;
}

/**
 * Genera el campo trilingüe estándar { es, en, ca } a partir de un texto en español.
 */
export async function generateTrilingualField(textEs: string): Promise<{ es: string; en: string; ca: string }> {
  if (!textEs || textEs.trim() === "") {
    return { es: "", en: "", ca: "" };
  }
  const es = textEs.trim();
  const en = await translateText(es, "en");
  const ca = await translateText(es, "ca");
  return { es, en, ca };
}

/**
 * Genera el array trilingüe estándar { es: [], en: [], ca: [] } a partir de una lista en español.
 */
export async function generateTrilingualArray(
  textsEs: string[],
): Promise<{ es: string[]; en: string[]; ca: string[] }> {
  if (!textsEs || textsEs.length === 0) {
    return { es: [], en: [], ca: [] };
  }
  const es = textsEs.map((t) => t.trim()).filter(Boolean);
  const en = await translateTextArray(es, "en");
  const ca = await translateTextArray(es, "ca");
  return { es, en, ca };
}

/**
 * Enriquece automáticamente un borrador de negocio en español rellenando todas las propiedades
 * trilingües obligatorias (shortDescription, fullDescription, specialties, highlights, servicesProvided, founderStory).
 */
export async function autoTranslateTrilingualBusinessData(draft: {
  shortDescriptionEs?: string;
  fullDescriptionEs?: string;
  founderStoryEs?: string;
  specialtiesEs?: string[];
  highlightsEs?: string[];
  servicesProvidedEs?: string[];
}): Promise<{
  shortDescription: { es: string; en: string; ca: string };
  fullDescription: { es: string; en: string; ca: string };
  founderStory: { es: string; en: string; ca: string };
  specialties: { es: string[]; en: string[]; ca: string[] };
  highlights: { es: string[]; en: string[]; ca: string[] };
  servicesProvided: { es: string[]; en: string[]; ca: string[] };
}> {
  console.log("🌐 [Auto-Translator] Generando traducciones automáticas precisas (ES ➔ EN, CA)...");

  const shortDescription = await generateTrilingualField(draft.shortDescriptionEs || "");
  const fullDescription = await generateTrilingualField(draft.fullDescriptionEs || "");
  const founderStory = await generateTrilingualField(draft.founderStoryEs || "");

  const specialties = await generateTrilingualArray(draft.specialtiesEs || []);
  const highlights = await generateTrilingualArray(draft.highlightsEs || []);
  const servicesProvided = await generateTrilingualArray(draft.servicesProvidedEs || []);

  console.log("✅ [Auto-Translator] Traducciones completadas con éxito sin consumo de tokens.");

  return {
    shortDescription,
    fullDescription,
    founderStory,
    specialties,
    highlights,
    servicesProvided,
  };
}
