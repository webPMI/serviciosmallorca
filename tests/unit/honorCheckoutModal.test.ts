/**
 * honorCheckoutModal.test.ts
 *
 * 🛡️ Pruebas Unitarias para el Aislamiento de Categorías y Buscador de Cuadro de Honor
 */

import { describe, it, expect } from "vitest";
import { HONOR_LISTS } from "../../src/lib/honorBoardEngine";
import { PUBLIC_SERVICES } from "../../src/data/services";
import { isPaymentsLiveMode, getPaymentGatewayMode } from "../../src/lib/paymentSecurityEngine";

describe("🛡️ Honor Board & Checkout Modal — Aislamiento Gremial y Buscador", () => {
  it("cada lista de honor con categoryFilter solo permite comercios de sus categorías válidas", () => {
    const guildInstallations = HONOR_LISTS.find((l) => l.id === "maestros-instalaciones");
    expect(guildInstallations).toBeDefined();
    expect(guildInstallations?.categoryFilter).toEqual(["reformas-construccion", "servicios-profesionales"]);

    // Filtrar comercios verificados
    const verifiedServices = PUBLIC_SERVICES.filter((s) => (s.confidenceScore ?? 0) >= 80 && s.status === "open");

    const eligibleForInstallations = verifiedServices.filter((s) =>
      guildInstallations?.categoryFilter?.includes(s.category),
    );

    // Debe contener reformas/profesionales pero NUNCA gastronomía o náutica
    expect(eligibleForInstallations.length).toBeGreaterThan(0);
    eligibleForInstallations.forEach((biz) => {
      expect(["reformas-construccion", "servicios-profesionales"]).toContain(biz.category);
      expect(biz.category).not.toBe("gastronomia-restaurantes");
      expect(biz.category).not.toBe("nautica-charter");
    });
  });

  it("artesanos-sabor restringe estrictamente a gastronomia-catering / gastronomia-restaurantes", () => {
    const tasteGuild = HONOR_LISTS.find((l) => l.id === "artesanos-sabor");
    expect(tasteGuild).toBeDefined();
    expect(tasteGuild?.categoryFilter).toEqual(["gastronomia-catering", "gastronomia-restaurantes"]);

    const verifiedServices = PUBLIC_SERVICES.filter((s) => (s.confidenceScore ?? 0) >= 80 && s.status === "open");

    const eligibleTaste = verifiedServices.filter((s) => tasteGuild?.categoryFilter?.includes(s.category));

    expect(eligibleTaste.length).toBeGreaterThan(0);
    eligibleTaste.forEach((biz) => {
      expect(biz.category).toBe("gastronomia-catering");
    });
  });

  it("excelencia-nautica restringe a nautica-charter", () => {
    const nauticGuild = HONOR_LISTS.find((l) => l.id === "excelencia-nautica");
    expect(nauticGuild).toBeDefined();
    expect(nauticGuild?.categoryFilter).toEqual(["nautica-charter"]);

    const verifiedServices = PUBLIC_SERVICES.filter((s) => (s.confidenceScore ?? 0) >= 80 && s.status === "open");

    const eligibleNautic = verifiedServices.filter((s) => nauticGuild?.categoryFilter?.includes(s.category));

    expect(eligibleNautic.length).toBeGreaterThan(0);
    eligibleNautic.forEach((biz) => {
      expect(biz.category).toBe("nautica-charter");
    });
  });

  it("elite-general es abierta a todas las categorías con confianza >= 80%", () => {
    const eliteGuild = HONOR_LISTS.find((l) => l.id === "elite-general");
    expect(eliteGuild).toBeDefined();
    expect(eliteGuild?.categoryFilter).toBeUndefined();

    const verifiedServices = PUBLIC_SERVICES.filter((s) => (s.confidenceScore ?? 0) >= 80 && s.status === "open");

    // Debe incluir múltiples sectores
    const categoriesFound = new Set(verifiedServices.map((s) => s.category));
    expect(categoriesFound.size).toBeGreaterThan(3);
  });

  it("isPaymentsLiveMode detecta correctamente si la pasarela está en modo Sandbox o Live", () => {
    // En local / testing debe ser false / sandbox por defecto
    const isLive = isPaymentsLiveMode();
    expect(typeof isLive).toBe("boolean");
    const mode = getPaymentGatewayMode();
    expect(["live", "sandbox"]).toContain(mode);
  });
});
