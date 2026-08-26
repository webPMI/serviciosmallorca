import type { Locale } from "../i18n";

export interface SmartActionCtaResult {
  label: string;
  url: string;
  icon: string;
  isExternal: boolean;
  trackingEvent: string;
  waMessage?: string;
}

export function getSmartActionCta(
  category: string,
  businessName: string,
  locale: Locale = "es",
  phone?: string,
  whatsapp?: string,
  website?: string,
  menuUrl?: string,
): SmartActionCtaResult {
  const cleanWhatsApp = whatsapp?.replace(/[^0-9]/g, "") || phone?.replace(/[^0-9]/g, "") || "";

  // 1. Gastronomía & Restauración (Priorizar Carta o Reserva)
  if (category.includes("gastronomia") || category.includes("restaurante")) {
    if (menuUrl) {
      const labels = {
        es: "Ver Carta / Menú",
        en: "View Menu",
        ca: "Veure Carta",
        de: "Speisekarte ansehen",
      };
      return {
        label: labels[locale] || labels.es,
        url: menuUrl,
        icon: "🍽️",
        isExternal: true,
        trackingEvent: "cta_view_menu",
      };
    }

    if (cleanWhatsApp) {
      const msgs = {
        es: `Hola ${businessName}, me gustaría consultar disponibilidad y reservar una mesa.`,
        en: `Hello ${businessName}, I would like to check availability and book a table.`,
        ca: `Hola ${businessName}, m'agradaria consultar disponibilitat i reservar una taula.`,
        de: `Hallo ${businessName}, ich möchte gerne die Verfügbarkeit prüfen und einen Tisch reservieren.`,
      };
      const waMsg = msgs[locale] || msgs.es;
      const labels = {
        es: "Reservar Mesa",
        en: "Book a Table",
        ca: "Reservar Taula",
        de: "Tisch reservieren",
      };
      return {
        label: labels[locale] || labels.es,
        url: `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`,
        icon: "🍷",
        isExternal: true,
        trackingEvent: "cta_book_table_whatsapp",
        waMessage: waMsg,
      };
    }
  }

  // 2. Arte, Tatuaje y Piercing (Priorizar Consulta / Presupuesto)
  if (
    category.includes("tatuaje") ||
    category.includes("tattoo") ||
    category === "arte-tatuajes" ||
    category.includes("arte-")
  ) {
    if (cleanWhatsApp) {
      const msgs = {
        es: `Hola ${businessName}, me gustaría pedir presupuesto y consultar disponibilidad para un diseño de tatuaje.`,
        en: `Hello ${businessName}, I would like to request a quote and check availability for a tattoo design.`,
        ca: `Hola ${businessName}, m'agradaria demanar pressupost i consultar disponibilitat per a un tatuatge.`,
        de: `Hallo ${businessName}, ich möchte gerne ein Angebot anfordern und Termine für ein Tattoo anfragen.`,
      };
      const waMsg = msgs[locale] || msgs.es;
      const labels = {
        es: "Pedir Presupuesto",
        en: "Request a Quote",
        ca: "Demanar Pressupost",
        de: "Angebot anfordern",
      };
      return {
        label: labels[locale] || labels.es,
        url: `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`,
        icon: "✒️",
        isExternal: true,
        trackingEvent: "cta_request_quote_tattoo",
        waMessage: waMsg,
      };
    }
  }

  // 3. Spas, Salud & Bienestar (Priorizar Tratamientos / Cita)
  if (category.includes("spa") || category.includes("bienestar")) {
    if (cleanWhatsApp) {
      const msgs = {
        es: `Hola ${businessName}, quería consultar vuestra carta de tratamientos y disponibilidad para una cita.`,
        en: `Hello ${businessName}, I would like to check your treatments menu and appointment availability.`,
        ca: `Hola ${businessName}, voldria consultar els tractaments i disponibilitat per a una cita.`,
        de: `Hallo ${businessName}, ich möchte mich über Ihre Behandlungen und freie Termine erkundigen.`,
      };
      const waMsg = msgs[locale] || msgs.es;
      const labels = {
        es: "Reservar Tratamiento",
        en: "Book Treatment",
        ca: "Reservar Tractament",
        de: "Behandlung buchen",
      };
      return {
        label: labels[locale] || labels.es,
        url: `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`,
        icon: "✨",
        isExternal: true,
        trackingEvent: "cta_book_spa_treatment",
        waMessage: waMsg,
      };
    }
  }

  // 4. Náutica & Chárter (Priorizar Consulta Chárter)
  if (category.includes("nautica") || category.includes("charter")) {
    if (cleanWhatsApp) {
      const msgs = {
        es: `Hola ${businessName}, me gustaría consultar fechas disponibles y tarifas para alquilar una embarcación en Mallorca.`,
        en: `Hello ${businessName}, I would like to check available dates and charter rates in Mallorca.`,
        ca: `Hola ${businessName}, m'agradaria consultar disponibilitat i tarifes per llogar una embarcació a Mallorca.`,
        de: `Hallo ${businessName}, ich möchte Verfügbarkeiten und Charter-Preise auf Mallorca anfragen.`,
      };
      const waMsg = msgs[locale] || msgs.es;
      const labels = {
        es: "Consultar Chárter",
        en: "Charter Inquiry",
        ca: "Consultar Xàrter",
        de: "Charter anfragen",
      };
      return {
        label: labels[locale] || labels.es,
        url: `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`,
        icon: "⛵",
        isExternal: true,
        trackingEvent: "cta_charter_inquiry",
        waMessage: waMsg,
      };
    }
  }

  // 5. Deportes & Fitness
  if (category.includes("deport") || category.includes("fitness")) {
    if (cleanWhatsApp) {
      const msgs = {
        es: `Hola ${businessName}, me gustaría reservar pista / sesión deportiva o consultar pases de día.`,
        en: `Hello ${businessName}, I would like to book a court / session or inquire about day passes.`,
        ca: `Hola ${businessName}, m'agradaria reservar pista o consultar abonaments.`,
        de: `Hallo ${businessName}, ich möchte einen Platz / Kurs buchen oder Tageskarten anfragen.`,
      };
      const waMsg = msgs[locale] || msgs.es;
      const labels = {
        es: "Reservar Pista / Sesión",
        en: "Book Session",
        ca: "Reservar Pista",
        de: "Platz / Kurs buchen",
      };
      return {
        label: labels[locale] || labels.es,
        url: `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`,
        icon: "🎾",
        isExternal: true,
        trackingEvent: "cta_book_sports",
        waMessage: waMsg,
      };
    }
  }

  // Fallback General (WhatsApp directo o Web oficial)
  if (cleanWhatsApp) {
    const msgs = {
      es: `Hola ${businessName}, he visto su ficha en Servicios Mallorca y quería hacer una consulta.`,
      en: `Hello ${businessName}, I saw your profile on Servicios Mallorca and have a question.`,
      ca: `Hola ${businessName}, he vist la vostra fitxa a Serveis Mallorca i voldria fer una consulta.`,
      de: `Hallo ${businessName}, ich habe Ihren Eintrag auf Servicios Mallorca gesehen und habe eine Frage.`,
    };
    const waMsg = msgs[locale] || msgs.es;
    const labels = {
      es: "WhatsApp Directo",
      en: "Direct WhatsApp",
      ca: "WhatsApp Directe",
      de: "Direkter WhatsApp",
    };
    return {
      label: labels[locale] || labels.es,
      url: `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waMsg)}`,
      icon: "💬",
      isExternal: true,
      trackingEvent: "cta_contact_whatsapp_generic",
      waMessage: waMsg,
    };
  }

  if (website) {
    const labels = {
      es: "Visitar Web Oficial",
      en: "Visit Official Website",
      ca: "Visitar Web Oficial",
      de: "Offizielle Website besuchen",
    };
    return {
      label: labels[locale] || labels.es,
      url: website,
      icon: "🌐",
      isExternal: true,
      trackingEvent: "cta_visit_website_generic",
    };
  }

  const labels = {
    es: "Ver Detalles",
    en: "View Details",
    ca: "Veure Detalls",
    de: "Details ansehen",
  };
  return {
    label: labels[locale] || labels.es,
    url: "#",
    icon: "📍",
    isExternal: false,
    trackingEvent: "cta_view_details",
  };
}
