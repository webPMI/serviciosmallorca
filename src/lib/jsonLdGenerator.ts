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
    // 🏋️ Vertical Deportiva (docs/SPORTS_FITNESS_SECTION.md §3.1)
    case "gimnasios-fitness":
      return ["SportsActivityLocation", "ExerciseGym", "HealthClub"];
    case "entrenamiento-personal":
      return ["SportsActivityLocation", "PersonalTrainer"];
    case "estudios-cuerpo-mente":
      return ["HealthClub", "SportsActivityLocation"];
    case "artes-marciales-boxeo":
      return ["SportsActivityLocation"];
    case "padel-tenis-raqueta":
      return ["SportsActivityLocation", "TennisComplex"];
    case "natacion-deportes-acuaticos":
      return ["SportsActivityLocation", "SwimmingPool"];
    case "ciclismo-running-trail":
      return ["SportsActivityLocation", "LocalBusiness"];
    case "golf":
      return ["GolfCourse", "SportsActivityLocation"];
    case "equitacion-hipica":
      return ["LocalBusiness", "SportsActivityLocation"];
    case "deportes-montana-aventura":
      return ["SportsActivityLocation", "TouristInformationCenter"];
    case "clubes-escuelas-deportivas":
      return ["SportsClub", "SportsActivityLocation"];
    case "espacios-deportivos-publicos":
      return ["TouristAttraction", "SportsActivityLocation"];
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
  canonicalUrl?: string,
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
    aggregateRating: service.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: service.rating,
          reviewCount: service.reviewCount && service.reviewCount > 0 ? service.reviewCount : 1,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
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

/**
 * Genera el marcado JSON-LD completo para la página de inicio (Homepage),
 * estructurando WebSite con SearchAction, Organization e ItemList de servicios destacados.
 */
export function generateHomepageJsonLd(
  locale: Locale = "es",
  canonicalUrl = "https://serviciosmallorca.com",
): Record<string, any>[] {
  const siteNames: Record<Locale, string> = {
    es: "Servicios Mallorca - Directorio de Empresas y Profesionales",
    en: "Servicios Mallorca - Verified Businesses and Directory in Mallorca",
    ca: "Servicios Mallorca - Directori d'Empreses i Serveis a Mallorca",
  };

  const descriptions: Record<Locale, string> = {
    es: "Guía y directorio de los mejores servicios, restaurantes, náutica, spas y empresas verificadas en Mallorca.",
    en: "Premier directory and guide to top-rated verified businesses, restaurants, yacht charters, and spas in Mallorca.",
    ca: "Guia i directori dels millors serveis, restaurants, nàutica, spas i empreses verificades a Mallorca.",
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://serviciosmallorca.com/#website",
      url: canonicalUrl,
      name: siteNames[locale] || siteNames.es,
      alternateName: ["Servicios Mallorca", "ServiciosMallorca.com", "Mallorca Services Directory"],
      description: descriptions[locale] || descriptions.es,
      inLanguage: locale,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://serviciosmallorca.com/es/servicios?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://serviciosmallorca.com/#organization",
      name: "Servicios Mallorca",
      url: "https://serviciosmallorca.com",
      logo: "https://serviciosmallorca.com/favicon.svg",
      description: descriptions[locale] || descriptions.es,
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Mallorca, Illes Balears, España",
      },
      knowsAbout: [
        "Restaurantes de Alta Cocina en Mallorca",
        "Chárter Náutico y Alquiler de Barcos en Mallorca",
        "Spas y Centros de Bienestar en Mallorca",
        "Reformas y Construcción en Baleares",
        "Inmobiliaria y Villas de Lujo en Mallorca",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["Spanish", "English", "Catalan", "German"],
        areaServed: "ES-IB",
      },
    },
  ];
}
