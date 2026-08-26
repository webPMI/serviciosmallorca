/**
 * src/lib/scrapers/serviceScraper.ts
 *
 * Especialista de Dominio: Servicios Generales, Bienestar, Náutica y E-Commerce.
 * Extrae métodos de pago, comodidades, catálogo de productos Shopify/WooCommerce y directorios comerciales.
 */

export interface StoreProductItem {
  id: string;
  name: { es: string; en: string; ca: string; de?: string };
  price: string;
  imageUrl?: string;
  url?: string;
  category?: string;
  inStock?: boolean;
}

export interface ServiceScrapeResult {
  amenities: string[];
  paymentMethods: string[];
  onlineStore?: {
    hasOnlineStore: boolean;
    platform: string;
    url: string;
  };
  products: StoreProductItem[];
  generalDirectoryDorks: Array<{ directoryName: string; searchUrl: string }>;
  pressDorks: Array<{ mediaName: string; language: string; searchUrl: string }>;
}

export async function scrapeServiceData(
  html: string,
  baseUrl: URL,
  businessName: string,
): Promise<ServiceScrapeResult> {
  const encodedQuery = encodeURIComponent(businessName.trim());
  const lowerHtml = html.toLowerCase();

  // 1. Detección de Métodos de Pago
  const paymentMethods = ["credit_card", "cash"];
  if (lowerHtml.includes("bizum")) paymentMethods.push("bizum");
  if (lowerHtml.includes("apple pay") || lowerHtml.includes("applepay")) paymentMethods.push("apple_pay");
  if (lowerHtml.includes("bitcoin") || lowerHtml.includes("crypto")) paymentMethods.push("crypto");

  // 2. Detección de Comodidades
  const amenities = ["wifi", "air_conditioning"];
  if (lowerHtml.includes("parking") || lowerHtml.includes("aparcamiento")) amenities.push("parking_nearby");
  if (lowerHtml.includes("movilidad reducida") || lowerHtml.includes("accesible") || lowerHtml.includes("wheelchair")) {
    amenities.push("wheelchair_accessible");
  }
  if (lowerHtml.includes("pet friendly") || lowerHtml.includes("mascotas")) amenities.push("pet_friendly");

  // 3. E-Commerce & Shopify Extraction — con filtrado de falsos positivos
  let onlineStore: { hasOnlineStore: boolean; platform: string; url: string } | undefined;
  const products: StoreProductItem[] = [];

  if (lowerHtml.includes("shopify") || lowerHtml.includes("cdn.shopify.com")) {
    onlineStore = {
      hasOnlineStore: true,
      platform: "shopify",
      url: new URL("/collections/all", baseUrl).href,
    };

    try {
      const shopifyApiUrl = new URL("/products.json?limit=6", baseUrl).href;
      const shopifyRes = await fetch(shopifyApiUrl, {
        signal: AbortSignal.timeout(3000),
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (shopifyRes.ok) {
        const shopifyData = await shopifyRes.json();
        if (shopifyData.products && Array.isArray(shopifyData.products)) {
          for (const p of shopifyData.products.slice(0, 6)) {
            const priceVal = p.variants?.[0]?.price;
            products.push({
              id: `prod-${p.id}`,
              name: { es: p.title, en: p.title, ca: p.title, de: p.title },
              price: priceVal ? `${parseFloat(priceVal).toFixed(2)}€` : "Consultar",
              imageUrl: p.images?.[0]?.src,
              url: new URL(`/products/${p.handle}`, baseUrl).href,
              category: p.product_type || "Catálogo Oficial",
              inStock: p.variants?.[0]?.available ?? true,
            });
          }
        }
      }
    } catch {
      // Fallback
    }
  } else if (lowerHtml.includes("woocommerce") || lowerHtml.includes("wc-api")) {
    // Confirmar que no es solo una referencia en CSS/JS
    if (!lowerHtml.match(/\.(css|js|svg|png|jpg|webp|ico)/i)) {
      onlineStore = {
        hasOnlineStore: true,
        platform: "woocommerce",
        url: new URL("/shop", baseUrl).href,
      };
    }
  } else if (lowerHtml.includes("prestashop")) {
    onlineStore = {
      hasOnlineStore: true,
      platform: "prestashop",
      url: new URL("/tienda", baseUrl).href,
    };
  } else if (
    (lowerHtml.includes("/shop") ||
      lowerHtml.includes("/tienda") ||
      lowerHtml.includes("/store") ||
      lowerHtml.includes("/productos")) &&
    !lowerHtml.includes("/wp-content/") &&
    !lowerHtml.includes("/wp-includes/") &&
    !lowerHtml.includes(".min.css") &&
    !lowerHtml.includes(".min.js")
  ) {
    onlineStore = {
      hasOnlineStore: true,
      platform: "custom",
      url: new URL("/shop", baseUrl).href,
    };
  }

  // 4. Directorios Comerciales
  const generalDirectoryDorks = [
    {
      directoryName: "Páginas Amarillas Baleares",
      searchUrl: `https://www.google.com/search?q=site:paginasamarillas.es+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "Cylex España Mallorca",
      searchUrl: `https://www.google.com/search?q=site:cylex.es+${encodedQuery}+mallorca`,
    },
    {
      directoryName: "Trustpilot España",
      searchUrl: `https://www.google.com/search?q=site:trustpilot.com+${encodedQuery}`,
    },
    {
      directoryName: "Bodas.net Mallorca",
      searchUrl: `https://www.google.com/search?q=site:bodas.net+${encodedQuery}+mallorca`,
    },
  ];

  // 5. Prensa Balear
  const pressDorks = [
    {
      mediaName: "Diario de Mallorca",
      language: "es",
      searchUrl: `https://www.google.com/search?q=site:diariodemallorca.es+${encodedQuery}`,
    },
    {
      mediaName: "Última Hora Mallorca",
      language: "es",
      searchUrl: `https://www.google.com/search?q=site:ultimahora.es+${encodedQuery}`,
    },
    {
      mediaName: "Mallorca Magazin (Alemán)",
      language: "de",
      searchUrl: `https://www.google.com/search?q=site:mallorcamagazin.com+${encodedQuery}`,
    },
    {
      mediaName: "Majorca Daily Bulletin (Inglés)",
      language: "en",
      searchUrl: `https://www.google.com/search?q=site:majorcadailybulletin.com+${encodedQuery}`,
    },
    {
      mediaName: "ABC Mallorca (Lujo & Estilo)",
      language: "en / es / de",
      searchUrl: `https://www.google.com/search?q=site:abc-mallorca.com+${encodedQuery}`,
    },
    {
      mediaName: "IB3 Notícies",
      language: "ca",
      searchUrl: `https://www.google.com/search?q=site:ib3.org+${encodedQuery}`,
    },
  ];

  return {
    amenities,
    paymentMethods,
    onlineStore,
    products,
    generalDirectoryDorks,
    pressDorks,
  };
}
