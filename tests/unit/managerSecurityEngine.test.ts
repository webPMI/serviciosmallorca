import { describe, it, expect } from "vitest";
import {
  validateSpanishTaxId,
  validateBalearicPhone,
  isDisposableEmail,
  isMatchingCorporateDomain,
  evaluateClaimSecurity,
  type ClaimVerificationPayload,
} from "../../src/lib/managerSecurityEngine";
import type { ServiceItem } from "../../src/data/services";

const mockService: ServiceItem = {
  id: "puerto-portals-marina",
  slug: "puerto-portals-marina",
  name: "Puerto Portals Marina",
  category: "nautica-charter",
  zone: "calvia",
  address: "Torre de Capitanía, Portals Nous, 07181 Calvià",
  coordinates: { lat: 39.5312, lng: 2.5358 },
  rating: 4.8,
  reviewCount: 1540,
  priceRange: "€€€€",
  verified: true,
  featured: true,
  status: "open",
  googleMapsUrl: "https://maps.google.com/?cid=123",
  appleMapsUrl: "https://maps.apple.com/?id=123",
  bingMapsUrl: "https://bing.com/maps/?id=123",
  phone: "+34971675225",
  whatsapp: "+34971675225",
  email: "info@puertoportals.com",
  website: "https://www.puertoportals.com",
  tags: ["Marina", "Yachting"],
  shortDescription: { es: "Marina náutica", en: "Superyacht marina", ca: "Marina" },
  fullDescription: { es: "Descripción completa", en: "Full description", ca: "Descripció" },
  image: "/images/portals.jpg",
  schedule: "L-D 00:00-24:00",
};

describe("managerSecurityEngine · Pruebas de Seguridad Estricta", () => {
  describe("validateSpanishTaxId", () => {
    it("valida DNI español con letra de control correcta", () => {
      expect(validateSpanishTaxId("12345678Z")).toBe(true);
      expect(validateSpanishTaxId("12345678A")).toBe(false); // Letra incorrecta
    });

    it("valida CIF societario español válido", () => {
      expect(validateSpanishTaxId("B07123456")).toBe(true);
      expect(validateSpanishTaxId("A28000000")).toBe(true);
      expect(validateSpanishTaxId("Z99999999")).toBe(false); // Inválido
    });

    it("rechaza identificadores malformados o vacíos", () => {
      expect(validateSpanishTaxId("")).toBe(false);
      expect(validateSpanishTaxId("123")).toBe(false);
      expect(validateSpanishTaxId("ABCD123456")).toBe(false);
    });
  });

  describe("validateBalearicPhone", () => {
    it("valida teléfonos fijos y móviles de Baleares (+34 971 / +34 871 / +34 6xx / +34 7xx)", () => {
      expect(validateBalearicPhone("+34971675225")).toBe(true);
      expect(validateBalearicPhone("+34 871 123 456")).toBe(true);
      expect(validateBalearicPhone("612345678")).toBe(true);
      expect(validateBalearicPhone("+34612345678")).toBe(true);
    });

    it("rechaza números de longitud incorrecta o formatos internacionales no verificados", () => {
      expect(validateBalearicPhone("12345")).toBe(false);
      expect(validateBalearicPhone("+12345678901")).toBe(false);
    });
  });

  describe("isDisposableEmail", () => {
    it("detecta proveedores de correo temporal desechable", () => {
      expect(isDisposableEmail("impostor@tempmail.com")).toBe(true);
      expect(isDisposableEmail("fake@mailinator.com")).toBe(true);
      expect(isDisposableEmail("gerencia@puertoportals.com")).toBe(false);
      expect(isDisposableEmail("propietario@gmail.com")).toBe(false);
    });
  });

  describe("isMatchingCorporateDomain", () => {
    it("verifica coincidencia de dominio entre correo corporativo y web oficial", () => {
      expect(isMatchingCorporateDomain("capitania@puertoportals.com", "https://www.puertoportals.com")).toBe(true);
      expect(isMatchingCorporateDomain("admin@puertoportals.com", "http://puertoportals.com")).toBe(true);
      expect(isMatchingCorporateDomain("impostor@gmail.com", "https://www.puertoportals.com")).toBe(false);
      expect(isMatchingCorporateDomain("hacker@otherdomain.com", "https://www.puertoportals.com")).toBe(false);
    });
  });

  describe("evaluateClaimSecurity (Barrera de Control de Mando)", () => {
    it("auto-aprueba reclamación legítima con CIF válido y correo de dominio corporativo", () => {
      const claim: ClaimVerificationPayload = {
        applicantUid: "user-legit-1",
        applicantEmail: "direccion@puertoportals.com",
        applicantPhone: "+34971675225",
        applicantName: "Director Portals",
        businessTaxId: "B07123456",
        verificationMethod: "corporate_email",
        documentUrl: "https://storage.secure/doc036.pdf",
      };

      const result = evaluateClaimSecurity(claim, mockService);
      expect(result.passed).toBe(true);
      expect(result.recommendedAction).toBe("auto_approve");
      expect(result.securityScore).toBeGreaterThanOrEqual(80);
    });

    it("envía a revisión manual si tiene CIF válido pero correo genérico (Gmail) y documento adjunto", () => {
      const claim: ClaimVerificationPayload = {
        applicantUid: "user-artisan-2",
        applicantEmail: "tallerartesano@gmail.com",
        applicantPhone: "+34600112233",
        applicantName: "Maestro Artesano",
        businessTaxId: "12345678Z",
        verificationMethod: "official_document",
        documentUrl: "https://storage.secure/iae-modelo-036.pdf",
      };

      const result = evaluateClaimSecurity(claim, mockService);
      expect(result.passed).toBe(false); // No se le da el mando automáticamente
      expect(result.recommendedAction).toBe("manual_admin_review");
      expect(result.securityScore).toBeGreaterThanOrEqual(50);
    });

    it("rechaza rotundamente solicitudes con NIF falso o correo temporal", () => {
      const fakeClaim: ClaimVerificationPayload = {
        applicantUid: "hacker-99",
        applicantEmail: "intruder@tempmail.com",
        applicantPhone: "123",
        applicantName: "Fake User",
        businessTaxId: "00000000X", // Falso
        verificationMethod: "official_document",
      };

      const result = evaluateClaimSecurity(fakeClaim, mockService);
      expect(result.passed).toBe(false);
      expect(result.recommendedAction).toBe("reject_unauthorized");
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });
});
