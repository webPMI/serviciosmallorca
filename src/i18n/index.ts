export type Locale = "es" | "en" | "ca" | "de";

export type I18nNamespace =
  "common" | "home" | "services" | "sports" | "heritage" | "community" | "blog" | "honor" | "auth" | "legal";

export const LOCALES: Locale[] = ["es", "en", "ca", "de"];

export const NAMESPACES: I18nNamespace[] = [
  "common",
  "home",
  "services",
  "sports",
  "heritage",
  "community",
  "blog",
  "honor",
  "auth",
  "legal",
];

export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
  ca: "Català",
  de: "Deutsch",
};

export interface Translations {
  [key: string]: string;
}

const namespaceLoaders: Record<Locale, Record<I18nNamespace, () => Promise<Translations>>> = {
  es: {
    common: () => import("./locales/es/common.json").then((m) => m.default),
    home: () => import("./locales/es/home.json").then((m) => m.default),
    services: () => import("./locales/es/services.json").then((m) => m.default),
    sports: () => import("./locales/es/sports.json").then((m) => m.default),
    heritage: () => import("./locales/es/heritage.json").then((m) => m.default),
    community: () => import("./locales/es/community.json").then((m) => m.default),
    blog: () => import("./locales/es/blog.json").then((m) => m.default),
    honor: () => import("./locales/es/honor.json").then((m) => m.default),
    auth: () => import("./locales/es/auth.json").then((m) => m.default),
    legal: () => import("./locales/es/legal.json").then((m) => m.default),
  },
  en: {
    common: () => import("./locales/en/common.json").then((m) => m.default),
    home: () => import("./locales/en/home.json").then((m) => m.default),
    services: () => import("./locales/en/services.json").then((m) => m.default),
    sports: () => import("./locales/en/sports.json").then((m) => m.default),
    heritage: () => import("./locales/en/heritage.json").then((m) => m.default),
    community: () => import("./locales/en/community.json").then((m) => m.default),
    blog: () => import("./locales/en/blog.json").then((m) => m.default),
    honor: () => import("./locales/en/honor.json").then((m) => m.default),
    auth: () => import("./locales/en/auth.json").then((m) => m.default),
    legal: () => import("./locales/en/legal.json").then((m) => m.default),
  },
  ca: {
    common: () => import("./locales/ca/common.json").then((m) => m.default),
    home: () => import("./locales/ca/home.json").then((m) => m.default),
    services: () => import("./locales/ca/services.json").then((m) => m.default),
    sports: () => import("./locales/ca/sports.json").then((m) => m.default),
    heritage: () => import("./locales/ca/heritage.json").then((m) => m.default),
    community: () => import("./locales/ca/community.json").then((m) => m.default),
    blog: () => import("./locales/ca/blog.json").then((m) => m.default),
    honor: () => import("./locales/ca/honor.json").then((m) => m.default),
    auth: () => import("./locales/ca/auth.json").then((m) => m.default),
    legal: () => import("./locales/ca/legal.json").then((m) => m.default),
  },
  de: {
    common: () => import("./locales/de/common.json").then((m) => m.default),
    home: () => import("./locales/de/home.json").then((m) => m.default),
    services: () => import("./locales/de/services.json").then((m) => m.default),
    sports: () => import("./locales/de/sports.json").then((m) => m.default),
    heritage: () => import("./locales/de/heritage.json").then((m) => m.default),
    community: () => import("./locales/de/community.json").then((m) => m.default),
    blog: () => import("./locales/de/blog.json").then((m) => m.default),
    honor: () => import("./locales/de/honor.json").then((m) => m.default),
    auth: () => import("./locales/de/auth.json").then((m) => m.default),
    legal: () => import("./locales/de/legal.json").then((m) => m.default),
  },
};

const translationCache = new Map<string, Translations>();

/**
 * Carga un namespace individual para un idioma con caché en memoria.
 */
export async function loadNamespace(locale: Locale, namespace: I18nNamespace): Promise<Translations> {
  const targetLocale = LOCALES.includes(locale) ? locale : "es";
  const cacheKey = `${targetLocale}:${namespace}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const loader = namespaceLoaders[targetLocale]?.[namespace] || namespaceLoaders["es"][namespace];
  const data = await loader();
  translationCache.set(cacheKey, data);
  return data;
}

/**
 * Carga las traducciones de un idioma fusionando los namespaces especificados (o todos por defecto).
 * Mantiene 100% de compatibilidad con llamadas previas: `await loadTranslations(locale)`.
 */
export async function loadTranslations(locale: Locale, namespaces?: I18nNamespace[]): Promise<Translations> {
  const targetLocale = LOCALES.includes(locale) ? locale : "es";
  const listToLoad = namespaces && namespaces.length > 0 ? namespaces : NAMESPACES;

  const isFull = listToLoad.length === NAMESPACES.length;
  const fullCacheKey = `${targetLocale}:__ALL__`;

  if (isFull && translationCache.has(fullCacheKey)) {
    return translationCache.get(fullCacheKey)!;
  }

  const loadedList = await Promise.all(listToLoad.map((ns) => loadNamespace(targetLocale, ns)));
  const merged: Translations = Object.assign({}, ...loadedList);

  if (isFull) {
    translationCache.set(fullCacheKey, merged);
  }

  return merged;
}

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

export function t(translations: Translations, key: string): string {
  return translations[key] ?? key;
}
