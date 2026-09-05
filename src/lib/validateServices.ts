import type { ServiceItem } from "../data/services/index.ts";
import { CATEGORIES } from "../data/categories.ts";
import { MALLORCA_ZONES } from "../data/zones.ts";
import { isValidTag } from "../data/tags.ts";

/**
 * Valida las referencias taxonómicas (docs/TAXONOMY.md §3.1) de un registro del
 * directorio: categoría(s) existentes en `CATEGORIES`, zona en `MALLORCA_ZONES`
 * y tags dentro del catálogo cerrado de `src/data/tags.ts`.
 *
 * Exportada de forma atómica para reutilizarla en curación (add-service),
 * auditorías y tests sin necesidad de construir un `ServiceItem` completo.
 */
export function validateTaxonomyRefs(entity: {
  name?: string;
  category: string;
  secondaryCategories?: string[];
  zone: string;
  tags?: string[];
}): string[] {
  const label = entity.name ? `en "${entity.name}"` : "(registro sin nombre)";
  const errors: string[] = [];

  if (!CATEGORIES.some((c) => c.id === entity.category)) {
    errors.push(`Categoría desconocida ${label}: "${entity.category}"`);
  }
  for (const secId of entity.secondaryCategories ?? []) {
    if (!CATEGORIES.some((c) => c.id === secId)) {
      errors.push(`Categoría secundaria desconocida ${label}: "${secId}"`);
    }
  }
  if (!MALLORCA_ZONES.some((z) => z.id === entity.zone)) {
    errors.push(`Zona desconocida ${label}: "${entity.zone}"`);
  }
  for (const tag of entity.tags ?? []) {
    if (!isValidTag(tag)) {
      errors.push(`Etiqueta fuera de catálogo o con formato inválido ${label}: "${tag}"`);
    }
  }
  return errors;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateServicesList(services: ServiceItem[]): ValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenWebsites = new Set<string>();
  const seenNames = new Set<string>();
  const seenImages = new Set<string>();

  for (const service of services) {
    // 1. Check ID uniqueness
    if (seenIds.has(service.id)) {
      errors.push(`ID duplicado detectado: "${service.id}"`);
    }
    seenIds.add(service.id);

    // 2. Check Slug uniqueness
    if (seenSlugs.has(service.slug)) {
      errors.push(`Slug duplicado detectado: "${service.slug}"`);
    }
    seenSlugs.add(service.slug);

    // 3. Check Name uniqueness (normalized)
    const normalizedName = service.name.toLowerCase().trim();
    if (seenNames.has(normalizedName)) {
      errors.push(`Nombre de servicio duplicado detectado: "${service.name}"`);
    }
    seenNames.add(normalizedName);

    // 4. Check Website / Channel uniqueness
    if (service.website && service.website.startsWith("http")) {
      try {
        const parsed = new URL(service.website);
        const domain = parsed.hostname.replace(/^www\./, "");
        const isSharedPlatform = [
          "instagram.com",
          "facebook.com",
          "google.com",
          "linktr.ee",
          "negocio.site",
          "belmond.com",
          "alcudiamar.es",
          "quironsalud.es",
          "portsdebalears.com",
          "arabellagolfmallorca.com",
          "t-golf.club",
          "illesbaleares.com",
          "vivagym.es",
          "synergym.es",
          "brooklynfitboxing.com",
          "ime.palma.cat",
          "juaneda.es",
          "marriott.com",
          "hospes.com",
          "jumeirah.com",
          "sonbrull.com",
          "boutiquehotelcanalomar.com",
          "caprocat.com",
          "canfeliu.es",
          "bodegaribas.com",
          "vinosferrer.com",
          "cancompany.es",
          "flordesaldestrenc.com",
          "sonnetluxury.com",
          "casxorc.com",
          "canvidalet.com",
          "engelvoelkers.com",
          "sonmoragues.com",
          "gordiola.com",
          "sonprim.com",
          "lafiore.com",
          "cncanpicafort.com",
          "cvpa.es",
        ].includes(domain);
        const targetIdentifier = isSharedPlatform
          ? `${domain}${parsed.pathname.toLowerCase().replace(/\/$/, "")}`
          : domain;

        if (seenWebsites.has(targetIdentifier)) {
          errors.push(`Sitio web o perfil oficial duplicado detectado: "${targetIdentifier}" en "${service.name}"`);
        }
        seenWebsites.add(targetIdentifier);
      } catch {
        errors.push(`URL de sitio web inválida en "${service.name}": "${service.website}"`);
      }
    }

    // 5. Check Image uniqueness (zero duplicate cover photos)
    if (service.image) {
      if (seenImages.has(service.image)) {
        errors.push(`Imagen de cabecera duplicada detectada en "${service.name}": ${service.image}`);
      }
      seenImages.add(service.image);
    }

    // 6. Check mandatory Google Maps and local attributes
    if (!service.phone) {
      errors.push(`Teléfono requerido ausente en "${service.name}"`);
    }
    if (!service.address) {
      errors.push(`Dirección requerida ausente en "${service.name}"`);
    }
    if (service.status !== "incomplete_admin_only") {
      if (!service.rating || service.rating < 1 || service.rating > 5) {
        errors.push(`Rating inválido en "${service.name}": ${service.rating}`);
      }
    }
    if (!service.schedule) {
      errors.push(`Horario operativo requerido ausente en "${service.name}"`);
    }

    // 7. Check Geo Coordinates (Mallorca bounding box)
    if (
      !service.coordinates ||
      typeof service.coordinates.lat !== "number" ||
      typeof service.coordinates.lng !== "number"
    ) {
      errors.push(`Coordenadas geográficas requeridas ausentes en "${service.name}"`);
    } else {
      const { lat, lng } = service.coordinates;
      if (lat < 39.0 || lat > 40.1 || lng < 2.2 || lng > 3.6) {
        errors.push(`Coordenadas fuera del rango geográfico de Mallorca en "${service.name}": [${lat}, ${lng}]`);
      }
    }

    // 8. Check Multi-Platform Maps URLs
    if (!service.googleMapsUrl || !service.googleMapsUrl.startsWith("http")) {
      errors.push(`Enlace oficial de Google Maps requerido en "${service.name}"`);
    }
    if (!service.appleMapsUrl || !service.appleMapsUrl.startsWith("http")) {
      errors.push(`Enlace oficial de Apple Maps requerido en "${service.name}"`);
    }
    if (!service.bingMapsUrl || !service.bingMapsUrl.startsWith("http")) {
      errors.push(`Enlace oficial de Bing Maps requerido en "${service.name}"`);
    }

    // 9. Taxonomía: categoría/zona/tags contra catálogos cerrados (docs/TAXONOMY.md §3.1)
    errors.push(...validateTaxonomyRefs(service));

    // 10. Regla Inmutable Zero Fake Data (GR-11): Prohibición de fotos de stock o relleno
    const FORBIDDEN_IMAGE_DOMAINS = [
      "unsplash.com",
      "pexels.com",
      "pixabay.com",
      "freepik.com",
      "placeholder",
      "dummyimage",
      "loremflickr",
      "stock.adobe.com",
      "shutterstock.com",
      "gettyimages.com",
      "istockphoto.com",
    ];

    const allImageUrls = [
      service.image,
      ...(service.images ?? []),
      ...(service.gallery ?? []),
      ...(service.socialPosts?.map((p) => p.imageUrl) ?? []),
    ].filter(Boolean) as string[];

    for (const imgUrl of allImageUrls) {
      const lower = imgUrl.toLowerCase();
      for (const forbidden of FORBIDDEN_IMAGE_DOMAINS) {
        if (lower.includes(forbidden)) {
          errors.push(
            `Foto de stock o relleno prohibida detectada en "${service.name}": "${imgUrl}" (Contiene dominio restringido: "${forbidden}")`,
          );
        }
      }
    }

    // 11. Regla Estricta HTTPS Obligatorio: Cero URLs inseguras con http://
    const allEntityUrls: Array<{ label: string; url?: string }> = [
      { label: "website", url: service.website },
      { label: "image", url: service.image },
      ...(service.images ?? []).map((img, idx) => ({ label: `images[${idx}]`, url: img })),
      ...(service.gallery ?? []).map((gal, idx) => ({ label: `gallery[${idx}]`, url: gal })),
      { label: "googleMapsUrl", url: service.googleMapsUrl },
      { label: "appleMapsUrl", url: service.appleMapsUrl },
      { label: "bingMapsUrl", url: service.bingMapsUrl },
      { label: "reputation.googleMaps", url: service.reputationBreakdown?.googleMaps?.url },
      { label: "reputation.appleMaps", url: service.reputationBreakdown?.appleMaps?.url },
      { label: "reputation.bingMaps", url: service.reputationBreakdown?.bingMaps?.url },
      ...(service.newsMentions ?? []).map((n, idx) => ({ label: `newsMentions[${idx}]`, url: n.url })),
      ...(service.pressMentions ?? []).map((p, idx) => ({ label: `pressMentions[${idx}]`, url: p.url })),
      ...(service.webDirectories ?? []).map((w, idx) => ({ label: `webDirectories[${idx}]`, url: w.url })),
      ...(service.socialLinks
        ? Object.entries(service.socialLinks).map(([k, v]) => ({ label: `socialLinks.${k}`, url: v }))
        : []),
    ];

    for (const item of allEntityUrls) {
      if (item.url && typeof item.url === "string") {
        const trimmed = item.url.trim();
        if (trimmed.startsWith("http://")) {
          errors.push(
            `Protocolo inseguro HTTP detectado en ${item.label} de "${service.name}": "${trimmed}". Debe actualizarse a HTTPS.`,
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
