import { describe, it, expect } from "vitest";

describe("Lógica Tributaria y Ahorro Ciudadano (citizenCalculators)", () => {
  describe("Calculadora 75% Descuento de Residente Balear", () => {
    function calculateResidentDiscount(baseFare: number, isRoundTrip: boolean) {
      const multiplier = isRoundTrip ? 2 : 1;
      const totalStandard = baseFare * multiplier;
      const residentDiscount = totalStandard * 0.75;
      const finalPrice = totalStandard - residentDiscount;
      return { totalStandard, residentDiscount, finalPrice };
    }

    it("aplica exactamente el 75% de bonificación estatal sobre la tarifa base de solo ida", () => {
      const res = calculateResidentDiscount(120, false);
      expect(res.totalStandard).toBe(120);
      expect(res.residentDiscount).toBe(90);
      expect(res.finalPrice).toBe(30);
    });

    it("duplica correctamente el importe y el descuento en trayectos de ida y vuelta", () => {
      const res = calculateResidentDiscount(120, true);
      expect(res.totalStandard).toBe(240);
      expect(res.residentDiscount).toBe(180);
      expect(res.finalPrice).toBe(60);
    });

    it("maneja tarifas interinsulares de bajo coste con precisión decimal", () => {
      const res = calculateResidentDiscount(49.99, false);
      expect(res.residentDiscount).toBeCloseTo(37.4925, 2);
      expect(res.finalPrice).toBeCloseTo(12.4975, 2);
    });
  });

  describe("Calculadora de Impuesto de Transmisiones Patrimoniales (ITP Baleares - ATIB)", () => {
    function calculateGeneralScale(price: number): number {
      let tax = 0;
      if (price <= 400000) {
        tax = price * 0.08;
      } else {
        tax += 400000 * 0.08; // 32.000 €
        if (price <= 600000) {
          tax += (price - 400000) * 0.09;
        } else {
          tax += 200000 * 0.09; // 18.000 € (Total 50.000 € acumulado hasta 600k)
          if (price <= 1000000) {
            tax += (price - 600000) * 0.10;
          } else {
            tax += 400000 * 0.10; // 40.000 € (Total 90.000 € acumulado hasta 1M)
            if (price <= 2000000) {
              tax += (price - 1000000) * 0.12;
            } else {
              tax += 1000000 * 0.12; // 120.000 € (Total 210.000 € acumulado hasta 2M)
              tax += (price - 2000000) * 0.13;
            }
          }
        }
      }
      return tax;
    }

    const YOUTH_PRICE_LIMIT = 270151.20;
    const LARGE_FAMILY_LIMIT = 350000;

    function calculateItpTax(price: number, profile: "youth" | "general" | "large-family" | "vpo") {
      const generalTax = calculateGeneralScale(price);

      if (profile === "youth") {
        if (price <= YOUTH_PRICE_LIMIT) {
          return { tax: 0, effectiveRate: 0, savings: generalTax, isExempt: true };
        }
        return {
          tax: generalTax,
          effectiveRate: (generalTax / price) * 100,
          savings: 0,
          isExempt: false,
        };
      }

      if (profile === "large-family") {
        if (price <= LARGE_FAMILY_LIMIT) {
          const tax = price * 0.02;
          return {
            tax,
            effectiveRate: 2.0,
            savings: generalTax - tax,
            isExempt: false,
          };
        }
        return {
          tax: generalTax,
          effectiveRate: (generalTax / price) * 100,
          savings: 0,
          isExempt: false,
        };
      }

      if (profile === "vpo") {
        const tax = price * 0.04;
        return {
          tax,
          effectiveRate: 4.0,
          savings: generalTax - tax,
          isExempt: false,
        };
      }

      return {
        tax: generalTax,
        effectiveRate: (generalTax / price) * 100,
        savings: 0,
        isExempt: false,
      };
    }

    it("aplica exención completa del 0% para jóvenes con precio <= 270.151,20 € (Decreto Ley 3/2023)", () => {
      const res = calculateItpTax(250000, "youth");
      expect(res.tax).toBe(0);
      expect(res.effectiveRate).toBe(0);
      expect(res.savings).toBe(20000); // 250.000 * 8% = 20.000 € de ahorro
      expect(res.isExempt).toBe(true);
    });

    it("aplica tipo general progresivo si el precio para jóvenes excede el umbral legal", () => {
      const res = calculateItpTax(300000, "youth");
      expect(res.tax).toBe(24000); // 300.000 * 8%
      expect(res.isExempt).toBe(false);
      expect(res.savings).toBe(0);
    });

    it("calcula con exactitud los tramos progresivos superiores a 400.000 €, 600.000 € y 1.000.000 €", () => {
      // 500.000 €: 400.000 * 8% (32.000) + 100.000 * 9% (9.000) = 41.000 €
      const res500k = calculateItpTax(500000, "general");
      expect(res500k.tax).toBe(41000);

      // 800.000 €: 32.000 + 18.000 (hasta 600k) + 200.000 * 10% (20.000) = 70.000 €
      const res800k = calculateItpTax(800000, "general");
      expect(res800k.tax).toBe(70000);

      // 1.500.000 €: 32.000 + 18.000 + 40.000 (hasta 1M) + 500.000 * 12% (60.000) = 150.000 €
      const res1_5M = calculateItpTax(1500000, "general");
      expect(res1_5M.tax).toBe(150000);
    });

    it("aplica tipo reducido del 2% para familias numerosas hasta 350.000 €", () => {
      const res = calculateItpTax(300000, "large-family");
      expect(res.tax).toBe(6000); // 300.000 * 2%
      expect(res.savings).toBe(24000 - 6000); // 18.000 € de ahorro
    });

    it("aplica tipo reducido del 4% para Viviendas de Protección Oficial (VPO)", () => {
      const res = calculateItpTax(200000, "vpo");
      expect(res.tax).toBe(8000); // 200.000 * 4%
      expect(res.savings).toBe(16000 - 8000); // 8.000 € de ahorro
    });
  });
});
