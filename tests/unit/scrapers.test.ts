import { describe, it, expect } from "vitest";
import { extractBaseMetadata, generateMapUrls } from "../../src/lib/scrapers/baseScraper";
import { extractSocialLinks, generateSocialDorks } from "../../src/lib/scrapers/socialScraper";
import { scrapeRestaurantData } from "../../src/lib/scrapers/restaurantScraper";
import { scrapeArtCultureData } from "../../src/lib/scrapers/artCultureScraper";
import { detectBusinessCategory } from "../../src/lib/scrapers/orchestrator";

describe("Modular Scrapers Architecture", () => {
  describe("detectBusinessCategory", () => {
    it("detects gastronomy category", () => {
      expect(detectBusinessCategory("Restaurante Sa Caleta Palma")).toBe("gastronomia-restaurantes");
      expect(detectBusinessCategory("Santi Taura Chef")).toBe("gastronomia-restaurantes");
    });

    it("detects tattoo and art category", () => {
      expect(detectBusinessCategory("Box Tattoo Piercing Palma")).toBe("arte-tatuajes");
      expect(detectBusinessCategory("Kuyen Art Ink")).toBe("arte-tatuajes");
    });

    it("detects nautical charter category", () => {
      expect(detectBusinessCategory("Mallorca Catamaran Charter")).toBe("nautica-charter");
    });

    it("detects wellness & spa category", () => {
      expect(detectBusinessCategory("Spa & Massage Palma")).toBe("salud-bienestar");
    });
  });

  describe("baseScraper", () => {
    it("extracts phone, email and meta description correctly", () => {
      const mockHtml = `
        <html>
          <head>
            <meta name="description" content="Estudio de vanguardia en el centro de Palma.">
            <meta property="og:image" content="https://ejemplo.com/portada.jpg">
          </head>
          <body>
            <a href="tel:+34971677770">Llámanos</a>
            <a href="mailto:contacto@ejemplo.com">Email</a>
            <img src="https://ejemplo.com/foto1.jpg">
          </body>
        </html>
      `;

      const result = extractBaseMetadata(mockHtml, new URL("https://ejemplo.com"), 200);
      expect(result.metaDescription).toBe("Estudio de vanguardia en el centro de Palma.");
      expect(result.extractedPhone).toBe("+34971677770");
      expect(result.extractedEmail).toBe("contacto@ejemplo.com");
      expect(result.ogImage).toBe("https://ejemplo.com/portada.jpg");
      expect(result.galleryImages).toContain("https://ejemplo.com/foto1.jpg");
    });

    it("generates correct maps search URLs", () => {
      const maps = generateMapUrls("DINS Santi Taura");
      expect(maps.googleMapsUrl).toContain("DINS%20Santi%20Taura");
      expect(maps.appleMapsUrl).toContain("DINS%20Santi%20Taura");
      expect(maps.openStreetMapUrl).toContain("DINS%20Santi%20Taura");
    });
  });

  describe("socialScraper", () => {
    it("extracts YouTube, Instagram, Facebook and TikTok accounts", async () => {
      const mockHtml = `
        <div>
          <a href="https://instagram.com/dinssantitaura">Instagram</a>
          <a href="https://facebook.com/dinssantitaura">Facebook</a>
          <a href="https://youtube.com/@santitaura">YouTube</a>
          <a href="https://tiktok.com/@dinssantitaura">TikTok</a>
        </div>
      `;

      const socials = await extractSocialLinks(mockHtml);
      expect(socials.instagram).toBe("https://instagram.com/dinssantitaura");
      expect(socials.facebook).toBe("https://facebook.com/dinssantitaura");
      expect(socials.youtube).toBe("https://youtube.com/@santitaura");
      expect(socials.tiktok).toBe("https://tiktok.com/@dinssantitaura");
    });

    it("generates fallback social search dorks", () => {
      const dorks = generateSocialDorks("Kuyen Art Tattoo", {});
      expect(dorks.some((d) => d.platform.includes("YouTube"))).toBe(true);
      expect(dorks.some((d) => d.platform.includes("Facebook"))).toBe(true);
    });

    it("extrae enlaces de Twitter / X y canal de WhatsApp", async () => {
      const mockHtml = `
        <div>
          <a href="https://x.com/negocio_mallorca">Twitter / X</a>
          <a href="https://chat.whatsapp.com/invite123">Canal WhatsApp</a>
        </div>
      `;

      const socials = await extractSocialLinks(mockHtml);
      expect(socials.twitter).toBe("https://x.com/negocio_mallorca");
      expect(socials.whatsappChannel).toBe("https://chat.whatsapp.com/invite123");
    });
  });

  describe("restaurantScraper", () => {
    it("identifies menu url and culinary specialties", () => {
      const mockHtml = `
        <div>
          <a href="/menus/carta-2026.pdf">Descargar Menú</a>
          <p>Disfruta de nuestro arroz meloso, pescado del día y porc negre mallorquí.</p>
        </div>
      `;

      const result = scrapeRestaurantData(mockHtml, new URL("https://restaurante.com"), "Restaurante Palma");
      expect(result.menuUrl).toBe("https://restaurante.com/menus/carta-2026.pdf");
      expect(result.specialties).toContain("Pescado Fresco del Día");
      expect(result.specialties).toContain("Arroces y Paellas Tradicionales");
      expect(result.specialties).toContain("Porc Negre Mallorquí");
      expect(result.gastronomyDorks.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("artCultureScraper", () => {
    it("identifies tattoo styles, piercing materials and health certifications", () => {
      const mockHtml = `
        <div>
          <p>Especialistas en fine line, microrealismo y joyería de titanio grado implante ASTM.</p>
          <p>Esterilización con autoclave de clase B.</p>
          <p>Utilizamos exclusivamente tintas de origen vegano y vegetal.</p>
        </div>
      `;

      const result = scrapeArtCultureData(mockHtml, "Box Tattoo Palma");
      expect(result.specialties).toContain("Tatuaje Fine Line (Trazo Fino)");
      expect(result.specialties).toContain("Microrealismo & Retratos");
      expect(result.certifications).toContain("Titanio Grado Implante ASTM F-136");
      expect(result.certifications).toContain("Esterilización Autoclave Clase B & Material Desechable");
      expect(result.certifications).toContain("Tintas Orgánicas y Veganas Certificadas");
    });
  });
});
