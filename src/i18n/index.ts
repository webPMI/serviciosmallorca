export type Locale = "es" | "en" | "ca" | "de";

export const LOCALES: Locale[] = ["es", "en", "ca", "de"];
export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
  ca: "Català",
  de: "Deutsch",
};

export interface Translations {
  [key: string]: string;
}

const translations: Record<Locale, () => Promise<Translations>> = {
  es: () => import("./es.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
  ca: () => import("./ca.json").then((m) => m.default),
  de: () => import("./de.json").then((m) => m.default),
};

/**
 * Detecta el idioma preferido del usuario en cascada estricta:
 * 1. Cookie explícita 'locale' (elección previa del usuario)
 * 2. Geo-Targeting por cabecera IP de país (Cloudflare 'cf-ipcountry' o 'x-country-code'):
 *    - DACH (DE, AT, CH, LI) ➔ 'de'
 *    - Anglo (GB, US, IE, AU, CA, NZ) ➔ 'en'
 *    - Baleares/Cataluña (ES con locale catalán) ➔ 'ca'
 * 3. Cabecera Accept-Language del navegador (de, en, ca, es)
 * 4. Default 'es'
 */
export function detectUserLocale(request: Request): Locale {
  // 1. Cookie (prioridad máxima: el usuario ya eligió manualmente)
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  if (match) {
    const cookieLocale = match[1] as Locale;
    if (LOCALES.includes(cookieLocale)) return cookieLocale;
  }

  // 2. Geo-Targeting por IP (Cloudflare Edge / Proxy headers)
  const country = (request.headers.get("cf-ipcountry") || request.headers.get("x-country-code") || "").toUpperCase();

  if (["DE", "AT", "CH", "LI"].includes(country)) {
    return "de";
  }
  if (["GB", "US", "IE", "AU", "CA", "NZ"].includes(country)) {
    return "en";
  }

  // 3. Accept-Language del navegador
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferred = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tag, q = "q=1"] = entry.trim().split(";");
      const quality = parseFloat(q.replace("q=", ""));
      return { tag: tag.split("-")[0].toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality)
    .find((l) => LOCALES.includes(l.tag as Locale));

  if (preferred) return preferred.tag as Locale;

  // 4. Default
  return "es";
}

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split("/").filter(Boolean);
  const first = segments[0] as Locale | undefined;
  if (first && LOCALES.includes(first)) {
    return first;
  }
  return "es";
}

export function getLangPrefix(locale: Locale): string {
  return `/${locale}/`;
}

export function getLocalizedUrl(locale: Locale, _currentUrl?: URL): string {
  return getLangPrefix(locale);
}

export async function loadTranslations(locale: Locale): Promise<Translations> {
  const loader = translations[locale];
  if (!loader) {
    const fallback = translations["es"];
    return fallback();
  }
  return loader();
}

export function t(translations: Translations, key: string): string {
  return translations[key] ?? key;
}
