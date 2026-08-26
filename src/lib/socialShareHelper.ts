/**
 * src/lib/socialShareHelper.ts
 *
 * 📱 Generador Inteligente de Enlaces, Textos y Hashtags para Compartir en Redes Sociales.
 * Formatea contenido optimizado para WhatsApp, X/Twitter, Telegram, LinkedIn, Facebook e Instagram.
 *
 * Cumple con GR-04 (i18n en 4 idiomas) y GR-11 (Zero Fake Data).
 */

import type { ServiceItem } from "../data/services/types";
import { CATEGORIES } from "../data/categories";
import { MALLORCA_ZONES } from "../data/zones";
import type { Locale } from "../i18n";

export interface SocialShareData {
  title: string;
  shortDescription: string;
  ratingText: string;
  locationText: string;
  hashtags: string[];
  hashtagsString: string;
  fullShareText: string;
  shareUrls: {
    whatsapp: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    telegram: string;
    email: string;
  };
  nativeSharePayload: {
    title: string;
    text: string;
    url: string;
  };
}

/**
 * Normaliza un texto para convertirlo en hashtag válido de redes sociales (sin espacios ni caracteres especiales).
 */
export function formatToHashtag(text: string): string {
  if (!text) return "";
  const cleaned = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
    .replace(/[^a-zA-Z0-9]/g, " ") // Caracteres no alfanuméricos a espacios
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");

  return cleaned ? `#${cleaned}` : "";
}

/**
 * Mapeo de hashtags temáticos por categoría de negocio en Mallorca.
 */
const CATEGORY_HASHTAGS_MAP: Record<string, string[]> = {
  "gastronomia-restaurantes": [
    "#GastronomiaMallorca",
    "#RestaurantesMallorca",
    "#MallorcaFood",
    "#MallorcaGastronomy",
    "#MallorcaEats",
  ],
  "spas-bienestar": ["#SpasMallorca", "#WellnessMallorca", "#BienestarMallorca", "#MallorcaSpa", "#RelaxMallorca"],
  "nautica-charter": [
    "#NauticaMallorca",
    "#BoatRentalMallorca",
    "#CharterMallorca",
    "#SailingMallorca",
    "#YachtMallorca",
  ],
  "reformas-construccion": ["#ReformasMallorca", "#ConstruccionMallorca", "#ArquitecturaMallorca", "#MallorcaHomes"],
  "salud-medicina": ["#SaludMallorca", "#MedicinaMallorca", "#ClinicaMallorca", "#HealthcareMallorca"],
  "motor-transporte": ["#MotorMallorca", "#TransporteMallorca", "#TallerMallorca", "#RentACarMallorca"],
  "inmobiliaria-vivienda": ["#InmobiliariaMallorca", "#MallorcaRealEstate", "#MallorcaProperty", "#VillasMallorca"],
  "arte-estilo-cultura": ["#ArteMallorca", "#CulturaMallorca", "#TattooMallorca", "#MallorcaArt"],
  "ocio-experiencias": ["#ExperienciasMallorca", "#MallorcaActivities", "#QueHacerEnMallorca", "#MallorcaExperience"],
  "deportes-fitness": ["#DeporteMallorca", "#FitnessMallorca", "#PadelMallorca", "#MallorcaSport"],
};

/**
 * Genera el paquete completo de datos de compartición social.
 */
export function generateSocialShareData(
  service: ServiceItem,
  locale: Locale = "es",
  pageUrl: string = "",
): SocialShareData {
  const category = CATEGORIES.find((c) => c.id === service.category);
  const zone = MALLORCA_ZONES.find((z) => z.id === service.zone);

  const categoryName = category?.name[locale] || service.category;
  const zoneName = zone?.name[locale] || service.zone || "Mallorca";
  const categoryIcon = category?.icon || "🌴";

  // Descripción localizada y limpia
  const rawDesc =
    service.shortDescription?.[locale] ||
    service.shortDescription?.es ||
    service.fullDescription?.[locale] ||
    service.fullDescription?.es ||
    "";
  const cleanDesc = rawDesc.replace(/\s+/g, " ").trim();
  const truncatedDesc = cleanDesc.length > 160 ? `${cleanDesc.slice(0, 157)}...` : cleanDesc;

  // Rating
  const ratingText = service.rating
    ? `⭐ ${service.rating.toFixed(1)}/5${service.reviewCount ? ` (${service.reviewCount} ${locale === "de" ? "Bewertungen" : locale === "en" ? "reviews" : locale === "ca" ? "ressenyes" : "reseñas"})` : ""}`
    : "";

  // Ubicación
  const locationText = `📍 ${zoneName}, Mallorca`;

  // Construcción de Hashtags Inteligentes
  const baseHashtags = ["#Mallorca", "#ServiciosMallorca"];
  const categorySpecific = CATEGORY_HASHTAGS_MAP[service.category] || [
    formatToHashtag(`${categoryName} Mallorca`),
    formatToHashtag(categoryName),
  ];
  const zoneHashtag = formatToHashtag(`${zoneName} Mallorca`);

  const rawHashtagsList = [...baseHashtags, ...categorySpecific, zoneHashtag].filter(Boolean);
  // Eliminar duplicados
  const hashtags = Array.from(new Set(rawHashtagsList)).slice(0, 6);
  const hashtagsString = hashtags.join(" ");

  // Título enriquecido
  const title = `${categoryIcon} ${service.name} | ${zoneName}`;

  // Encabezados y llamadas por idioma
  const discoverHeaders: Record<Locale, string> = {
    es: "Descubre este servicio verificado en Mallorca:",
    en: "Discover this verified business in Mallorca:",
    ca: "Descobreix aquest servei verificat a Mallorca:",
    de: "Entdecke dieses verifizierte Unternehmen auf Mallorca:",
  };

  const ctaLine: Record<Locale, string> = {
    es: "👉 Consulta detalles, horarios y contacto directo aquí:",
    en: "👉 Check details, opening hours and direct contact here:",
    ca: "👉 Consulta detalls, horaris i contacte directe aquí:",
    de: "👉 Hier Details, Öffnungszeiten und direkten Kontakt ansehen:",
  };

  // Texto completo estructurado para compartir / copiar
  const lines: string[] = [
    `${categoryIcon} *${service.name}*`,
    locationText,
    ...(ratingText ? [ratingText] : []),
    "",
    discoverHeaders[locale] || discoverHeaders.es,
    truncatedDesc ? `"${truncatedDesc}"` : "",
    "",
    ctaLine[locale] || ctaLine.es,
    pageUrl,
    "",
    hashtagsString,
  ].filter((line) => line !== undefined);

  const fullShareText = lines.join("\n").trim();

  // Texto para Twitter / X (más conciso con límite de caracteres)
  const twitterCore = `${categoryIcon} ${service.name} (${zoneName}, Mallorca)${ratingText ? ` ${ratingText}` : ""}\n\n${truncatedDesc ? `${truncatedDesc.slice(0, 110)}...\n\n` : ""}`;
  const twitterTags = hashtags
    .map((h) => h.replace(/^#/, ""))
    .slice(0, 4)
    .join(",");

  // Enlaces de compartir para cada plataforma
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedFullText = encodeURIComponent(fullShareText);
  const encodedTwitterText = encodeURIComponent(twitterCore);
  const encodedEmailSubject = encodeURIComponent(`${service.name} (${zoneName}, Mallorca) - Servicios Mallorca`);
  const encodedEmailBody = encodeURIComponent(
    `${discoverHeaders[locale]}\n\n${service.name}\n${locationText}\n${ratingText}\n\n${truncatedDesc}\n\n${ctaLine[locale]}\n${pageUrl}\n\n${hashtagsString}`,
  );

  const shareUrls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedFullText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTwitterText}&url=${encodedUrl}&hashtags=${encodeURIComponent(twitterTags)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(`${service.name} - ${truncatedDesc}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`${categoryIcon} ${service.name} (${zoneName})\n${truncatedDesc}\n${hashtagsString}`)}`,
    email: `mailto:?subject=${encodedEmailSubject}&body=${encodedEmailBody}`,
  };

  const nativeSharePayload = {
    title: `${service.name} - ${zoneName}, Mallorca`,
    text: `${truncatedDesc ? `${truncatedDesc}\n\n` : ""}${hashtagsString}`,
    url: pageUrl,
  };

  return {
    title,
    shortDescription: truncatedDesc,
    ratingText,
    locationText,
    hashtags,
    hashtagsString,
    fullShareText,
    shareUrls,
    nativeSharePayload,
  };
}
