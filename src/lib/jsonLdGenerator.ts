import type { ServiceItem } from "../data/services/types";
import type { Locale } from "../i18n";

/**
 * Mapeo inteligente de categorías del catálogo a subtipos específicos de Schema.org
 */
function getSchemaTypeForCategory(category: string, sectorId?: string): string | string[] {
  switch (category) {
    case "arte-tatuajes":
      return ["LocalBusiness", "TattooParlor"];
    case "gastronomia-restaurantes":
    case "gastronomia-catering":
      return "Restaurant";
    case "inmobiliaria-villas":
      return "RealEstateAgent";
    case "motor-transporte":
      return ["LocalBusiness", "AutoRental"];
    case "servicios-profesionales":
      if (sectorId?.includes("legal")) return "LegalService";
      if (sectorId?.includes("contable") || sectorId?.includes("asesoria")) return "AccountingService";
      return "ProfessionalService";
    case "spas-bienestar":
    case "salud-bienestar":
      return ["LocalBusiness", "DaySpa", "HealthAndBeautyBusiness"];
    case "reformas-construccion":
    case "reformas-hogar":
      return ["LocalBusiness", "HomeAndConstructionBusiness", "GeneralContractor"];
    case "jardineria-piscinas":
      return ["LocalBusiness", "Florist", "HomeAndConstructionBusiness"];
    case "tecnologia-seguridad":
      return ["LocalBusiness", "SecurityService"];
    default:
      return "LocalBusiness";
  }
}

/**
 * Convierte un ServiceItem en un objeto JSON-LD estructurado de Schema.org
 * optimizado para Google Rich Snippets, Bing y Modelos de Lenguaje (AI/LLM).
 */
export function generateServiceJsonLd(
  service: ServiceItem,
  locale: Locale = "es",
  canonicalUrl?: string
): Record<string, any> {
  const schemaType = getSchemaTypeForCategory(service.category, service.sectorId);

  // Recopilar enlaces de autoridad para sameAs
  const sameAsLinks: string[] = [
    service.website,
    service.googleMapsUrl,
    service.appleMapsUrl,
    service.bingMapsUrl,
    service.socialLinks?.instagram,
    service.socialLinks?.facebook,
    service.socialLinks?.linkedin,
    service.socialLinks?.youtube,
    service.socialLinks?.tiktok,
    service.socialLinks?.twitter,
  ].filter(Boolean) as string[];

  // Lista de especialidades / servicios ofrecidos
  const specialties: string[] = Array.isArray(service.specialties)
    ? service.specialties
    : (service.specialties as any)?.[locale] || [];

  const servicesProvided: string[] = Array.isArray(service.servicesProvided)
    ? service.servicesProvided
    : (service.servicesProvided as any)?.[locale] || [];

  const offerItems = [...specialties, ...servicesProvided].filter(Boolean);

  // Serializar reseñas verificadas para Rich Snippets
  const reviewsSchema = (service.reviews || []).map((rev) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: rev.authorName,
    },
    datePublished: rev.date,
    reviewBody: rev.comment,
    reviewRating: {
      "@type": "Rating",
      ratingValue: rev.rating,
      bestRating: "5",
      worstRating: "1",
    },
  }));

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${canonicalUrl || "https://serviciosmallorca.com"}/#business`,
    name: service.name,
    description: service.shortDescription?.[locale] || service.fullDescription?.[locale],
    url: canonicalUrl || service.website || "https://serviciosmallorca.com",
    image: service.images && service.images.length > 0 ? service.images : [service.image].filter(Boolean),
    telephone: service.phone || undefined,
    email: service.email || undefined,
    priceRange: service.priceRange || "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: (service.paymentMethods || ["credit_card", "cash"]).join(", "),
    hasMap: service.googleMapsUrl || undefined,
    sameAs: sameAsLinks.length > 0 ? sameAsLinks : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: service.address,
      addressLocality: service.zone ? service.zone.replace(/-/g, " ") : "Mallorca",
      addressRegion: "Illes Balears",
      postalCode: "07001",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: service.coordinates.lat,
      longitude: service.coordinates.lng,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Mallorca, Illes Balears",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: service.rating,
      reviewCount: service.reviewCount > 0 ? service.reviewCount : 1,
      bestRating: "5",
      worstRating: "1",
    },
  };

  if (reviewsSchema.length > 0) {
    jsonLd.review = reviewsSchema;
  }

  if (offerItems.length > 0) {
    jsonLd.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: `Servicios y Especialidades de ${service.name}`,
      itemListElement: offerItems.map((item, idx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item,
        },
        position: idx + 1,
      })),
    };
  }

  if (service.founderName) {
    jsonLd.founder = {
      "@type": "Person",
      name: service.founderName,
    };
  }

  if (service.foundedYear) {
    jsonLd.foundingDate = String(service.foundedYear);
  }

  return jsonLd;
}
