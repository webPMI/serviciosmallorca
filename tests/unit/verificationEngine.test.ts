import { describe, it, expect } from "vitest";
import {
  normalizePhoneNumber,
  arePhonesMatching,
  isCoordinateWithinMallorca,
  auditBusinessData,
} from "../../src/lib/verificationEngine";

describe("Verification Engine (Multi-Source Auditor)", () => {
  describe("normalizePhoneNumber & arePhonesMatching", () => {
    it("normalizes diverse phone formats (+34, spaces, dashes)", () => {
      expect(normalizePhoneNumber("+34 971 67 77 70")).toBe("971677770");
      expect(normalizePhoneNumber("0034 971 677 770")).toBe("971677770");
      expect(normalizePhoneNumber("+34-600-112-233")).toBe("600112233");
      expect(normalizePhoneNumber("971 12 34 56")).toBe("971123456");
    });

    it("matches phone numbers across international and local formats", () => {
      expect(arePhonesMatching("+34 971 67 77 70", "971677770")).toBe(true);
      expect(arePhonesMatching("0034 674 89 12 30", "+34 674891230")).toBe(true);
      expect(arePhonesMatching("971 11 11 11", "971 22 22 22")).toBe(false);
    });
  });

  describe("isCoordinateWithinMallorca", () => {
    it("validates real Mallorca coordinates", () => {
      // Palma
      expect(isCoordinateWithinMallorca(39.5696, 2.6502)).toBe(true);
      // Alcúdia
      expect(isCoordinateWithinMallorca(39.8532, 3.1214)).toBe(true);
      // Sóller
      expect(isCoordinateWithinMallorca(39.7661, 2.7153)).toBe(true);
    });

    it("rejects coordinates outside Mallorca", () => {
      // Madrid
      expect(isCoordinateWithinMallorca(40.4168, -3.7038)).toBe(false);
      // Barcelona
      expect(isCoordinateWithinMallorca(41.3879, 2.1699)).toBe(false);
      // Ibiza
      expect(isCoordinateWithinMallorca(38.9067, 1.4206)).toBe(false);
      // Undefined
      expect(isCoordinateWithinMallorca(undefined, undefined)).toBe(false);
    });
  });

  describe("auditBusinessData", () => {
    it("computes high confidence score for triple-verified business", () => {
      const report = auditBusinessData({
        name: "DINS Santi Taura",
        category: "gastronomia-catering",
        zone: "palma",
        address: "Plaça de Llorenç Villalonga, 4, Palma, Mallorca",
        coordinates: { lat: 39.5662, lng: 2.6538 },
        website: "https://dinssantitaura.com",
        phone: "+34 971 67 77 70",
        extractedWebPhone: "971 67 77 70",
        extractedMapsPhone: "+34 971 67 77 70",
        socialLinks: {
          instagram: "https://instagram.com/dinssantitaura",
          facebook: "https://facebook.com/dinssantitaura",
          youtube: "https://youtube.com/@santitaura",
        },
        reviewCount: 460,
        rating: 4.8,
        webHttpStatus: 200,
      });

      expect(report.confidenceScore).toBeGreaterThanOrEqual(90);
      expect(report.status).toBe("verified");
      expect(report.crossReference.webPhoneMatch).toBe(true);
      expect(report.crossReference.mapsPhoneMatch).toBe(true);
      expect(report.crossReference.addressInMallorca).toBe(true);
      expect(report.crossReference.activeWeb200Ok).toBe(true);
    });

    it("flags discrepancies and assigns needs_manual_review when phones conflict", () => {
      const report = auditBusinessData({
        name: "Unverified Tattoo Studio",
        category: "arte-tatuajes",
        zone: "palma",
        address: "Palma, Mallorca",
        coordinates: { lat: 39.57, lng: 2.65 },
        website: "https://unverified.com",
        phone: "+34 600 000 000",
        extractedWebPhone: "+34 699 999 999", // Conflict!
        extractedMapsPhone: "+34 688 888 888", // Conflict!
        reviewCount: 5,
        rating: 3.5,
        webHttpStatus: 404,
      });

      expect(report.status).toBe("needs_manual_review");
      expect(report.warnings.length).toBeGreaterThan(0);
    });
  });
});
