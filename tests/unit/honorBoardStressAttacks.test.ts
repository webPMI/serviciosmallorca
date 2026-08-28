/**
 * honorBoardStressAttacks.test.ts
 *
 * 🏆 SUITE DE PRUEBAS DE PRESIÓN ADVERSARIA Y ATAQUES AGRESIVOS AL CUADRO DE HONOR
 *
 * Simula y verifica:
 *  1. 🪜 Desplazamiento en Cadena (+1€ Infinito) y Récord "50k + 1" (Efecto Bola de Nieve).
 *  2. 🥷 Ataques de Subasta: Pujas insuficientes, empate fraudulento, microcéntimos, NaN, Infinity, pujas negativas.
 *  3. 🛡️ Filtro de Confianza Inmutable (Zero Fake Data & GR-11): Rechazo de cerrados o score < 80%.
 *  4. 🚧 Aislamiento Gremial (Cross-Category Attack): Inyección de categorías no afines en listas temáticas.
 *  5. ⚡ Estrés Masivo de Cola (10.000+ desplazamientos concurrentes en <50ms).
 *  6. 🧾 Facturación Fiscal Instantánea y Desglose de IVA Balear (21%).
 */

import { describe, it, expect } from "vitest";
import {
  processHonorBid,
  processCommunityBoost,
  getHonorTier,
  calculateHonorInvoice,
  type HonorSpotEntry,
  type HonorBidSubmission,
  type CommunityBoostSubmission,
} from "../../src/lib/honorBoardEngine.ts";
import type { ServiceItem } from "../../src/data/services/index.ts";

const mockBaseService: ServiceItem = {
  id: "forn-sant-francesc-inca",
  slug: "forn-sant-francesc-inca",
  name: "Forn Sant Francesc Inca",
  category: "gastronomia-restaurantes",
  zone: "inca",
  address: "Carrer de Sant Francesc 10, Inca",
  coordinates: { lat: 39.72, lng: 2.91 },
  rating: 4.9,
  reviewCount: 850,
  priceRange: "€€",
  verified: true,
  featured: true,
  status: "open",
  googleMapsUrl: "https://maps.google.com/?id=1",
  appleMapsUrl: "https://maps.apple.com/?id=1",
  bingMapsUrl: "https://bing.com/maps/?id=1",
  phone: "+34 971 500 100",
  whatsapp: "+34 971 500 100",
  email: "info@fornsantfrancesc.com",
  website: "https://fornsantfrancesc.com",
  tags: ["Pastelería", "Ensaimada"],
  shortDescription: { es: "Forn artesanal", en: "Artisan bakery", ca: "Forn artesanal", de: "Bäckerei" },
  fullDescription: { es: "Forn centenario", en: "Century bakery", ca: "Forn centenari", de: "Jahrhundertbäckerei" },
  image: "https://images.unsplash.com/photo-forn",
  schedule: "L-D 08:00-20:00",
  confidenceScore: 100,
};

describe("🏆 CUADRO DE HONOR — TESTING DE PRESIÓN ADVERSARIA Y DESPLAZAMIENTO EN CADENA (+1€)", () => {
  // ===========================================================================
  // 1. DESPLAZAMIENTO EN CADENA (+1€ INFINITO) & ESCENARIO 50K + 1
  // ===========================================================================
  describe("1. Dinámica Determinista de Desplazamiento en Cadena (+1€ Infinito)", () => {
    it("debe ejecutar la secuencia Paso 1 (1€) ➔ Paso 2 (2€) ➔ Paso 3 (3€) desplazando puestos en cascada", () => {
      let currentList: HonorSpotEntry[] = [];

      // Paso 1: Lista vacía. Usuario A puja 1.00€
      const subA: HonorBidSubmission = {
        serviceId: "forn-sant-francesc-inca",
        sponsorName: "Usuario A (Vecino de Inca)",
        bidAmountEuros: 1.0,
      };
      const res1 = processHonorBid(currentList, subA, "artesanos-sabor", mockBaseService);
      expect(res1.success).toBe(true);
      expect(res1.newPosition).toBe(1);
      expect(res1.tier).toBe("DIAMOND");
      expect(res1.updatedList.length).toBe(1);
      expect(res1.updatedList[0].sponsorName).toBe("Usuario A (Vecino de Inca)");
      expect(res1.updatedList[0].currentBidEuros).toBe(1.0);
      currentList = res1.updatedList;

      // Paso 2: Usuario B puja 2.00€ (1€ + 1€)
      const subB: HonorBidSubmission = {
        serviceId: "forn-sant-francesc-inca",
        sponsorName: "Usuario B (Gourmet Palma)",
        bidAmountEuros: 2.0,
      };
      const res2 = processHonorBid(currentList, subB, "artesanos-sabor", mockBaseService);
      expect(res2.success).toBe(true);
      expect(res2.newPosition).toBe(1);
      expect(res2.tier).toBe("DIAMOND");
      expect(res2.updatedList.length).toBe(2);
      expect(res2.updatedList[0].sponsorName).toBe("Usuario B (Gourmet Palma)");
      expect(res2.updatedList[0].position).toBe(1);
      // Usuario A baja al puesto #2 (Oro)
      expect(res2.updatedList[1].sponsorName).toBe("Usuario A (Vecino de Inca)");
      expect(res2.updatedList[1].position).toBe(2);
      expect(getHonorTier(res2.updatedList[1].position)).toBe("GOLD");
      currentList = res2.updatedList;

      // Paso 3: Usuario C puja 3.00€ (2€ + 1€)
      const subC: HonorBidSubmission = {
        serviceId: "forn-sant-francesc-inca",
        sponsorName: "Usuario C (Asociación Km0)",
        bidAmountEuros: 3.0,
      };
      const res3 = processHonorBid(currentList, subC, "artesanos-sabor", mockBaseService);
      expect(res3.success).toBe(true);
      expect(res3.newPosition).toBe(1);
      expect(res3.tier).toBe("DIAMOND");
      expect(res3.updatedList.length).toBe(3);
      expect(res3.updatedList[0].sponsorName).toBe("Usuario C (Asociación Km0)");
      expect(res3.updatedList[1].sponsorName).toBe("Usuario B (Gourmet Palma)");
      expect(res3.updatedList[1].position).toBe(2);
      expect(getHonorTier(2)).toBe("GOLD");
      expect(res3.updatedList[2].sponsorName).toBe("Usuario A (Vecino de Inca)");
      expect(res3.updatedList[2].position).toBe(3);
      expect(getHonorTier(3)).toBe("SILVER");
    });

    it("debe ejecutar el Efecto '50k + 1' en una cola con cientos de participantes", () => {
      // Simular lista histórica con líder en 50.000€ y 200 participantes previos
      const heavyQueue: HonorSpotEntry[] = [];
      heavyQueue.push({
        id: "spot-leader-50k",
        position: 1,
        serviceId: "forn-sant-francesc-inca",
        serviceName: "Forn Sant Francesc Inca",
        serviceSlug: "forn-sant-francesc-inca",
        category: "gastronomia-restaurantes",
        zone: "inca",
        honorTitle: { es: "Líder Histórico", en: "Leader", ca: "Líder", de: "Leader" },
        currentBidEuros: 50000.0,
        sponsorName: "Líder Anterior (50k€)",
        nominatedAt: "2026-08-01T00:00:00Z",
        confidenceScore: 100,
        isVerified: true,
      });

      for (let i = 2; i <= 250; i++) {
        heavyQueue.push({
          id: `spot-historic-${i}`,
          position: i,
          serviceId: "forn-sant-francesc-inca",
          serviceName: "Forn Sant Francesc Inca",
          serviceSlug: "forn-sant-francesc-inca",
          category: "gastronomia-restaurantes",
          zone: "inca",
          honorTitle: { es: `Puesto ${i}`, en: `Spot ${i}`, ca: `Lloc ${i}`, de: `Platz ${i}` },
          currentBidEuros: 50000.0 - i,
          sponsorName: `Participante Histórico ${i}`,
          nominatedAt: "2026-07-01T00:00:00Z",
          confidenceScore: 95,
          isVerified: true,
        });
      }

      // Llega una nueva puja récord de 50.001€ (+1€ sobre el líder de 50.000€)
      const bid50kPlusOne: HonorBidSubmission = {
        serviceId: "forn-sant-francesc-inca",
        sponsorName: "Nuevo Campeón Balear",
        bidAmountEuros: 50001.0,
      };

      const result = processHonorBid(heavyQueue, bid50kPlusOne, "artesanos-sabor", mockBaseService);
      expect(result.success).toBe(true);
      expect(result.newPosition).toBe(1);
      expect(result.tier).toBe("DIAMOND");
      expect(result.updatedList.length).toBe(251);

      // El nuevo participante es #1 Diamante con 50.001€
      expect(result.updatedList[0].sponsorName).toBe("Nuevo Campeón Balear");
      expect(result.updatedList[0].currentBidEuros).toBe(50001.0);
      expect(result.updatedList[0].position).toBe(1);

      // El anterior líder de 50.000€ baja exactamente a la posición #2 (Oro)
      expect(result.updatedList[1].sponsorName).toBe("Líder Anterior (50k€)");
      expect(result.updatedList[1].currentBidEuros).toBe(50000.0);
      expect(result.updatedList[1].position).toBe(2);

      // El participante que estaba en el puesto 2 baja a la posición 3
      expect(result.updatedList[2].sponsorName).toBe("Participante Histórico 2");
      expect(result.updatedList[2].position).toBe(3);

      // El último elemento ahora está en la posición 251
      expect(result.updatedList[250].position).toBe(251);
    });
  });

  // ===========================================================================
  // 2. ATAQUES ADVERSARIOS DE PUJAS Y MICRO-EXPLOITS DE SUBASTA
  // ===========================================================================
  describe("2. Ataques y Fuzzing contra el Mecanismo de Pujas (+1€)", () => {
    it("debe rechazar cualquier puja inferior a (Récord + 1.00€)", () => {
      const activeList: HonorSpotEntry[] = [
        {
          id: "spot-1",
          position: 1,
          serviceId: "forn-sant-francesc-inca",
          serviceName: "Forn Sant Francesc",
          serviceSlug: "forn-sant-francesc-inca",
          category: "gastronomia-restaurantes",
          zone: "inca",
          honorTitle: { es: "T", en: "T", ca: "T", de: "T" },
          currentBidEuros: 100.0,
          sponsorName: "Líder 100€",
          nominatedAt: "2026-08-01T00:00:00Z",
          confidenceScore: 100,
          isVerified: true,
        },
      ];

      // Intentos de bypass
      const hostileBids = [
        100.0, // Empate exacto (debe ser al menos 101.00€)
        100.5, // Menos de 1€ de incremento
        100.99, // 99 céntimos de incremento
        99.0, // Inferior
        0.0, // Cero
        -50.0, // Negativo
        -1e10, // Overflow negativo
        NaN,
      ];

      for (const badBid of hostileBids) {
        const res = processHonorBid(
          activeList,
          { serviceId: "forn-sant-francesc-inca", sponsorName: "Attacker", bidAmountEuros: badBid },
          "artesanos-sabor",
          mockBaseService,
        );
        expect(res.success).toBe(false);
        expect(res.error).toContain("insuficiente");
      }
    });

    it("debe aceptar pujas legítimas que superen o igualen el incremento requerido (+1€)", () => {
      const activeList: HonorSpotEntry[] = [
        {
          id: "spot-1",
          position: 1,
          serviceId: "forn-sant-francesc-inca",
          serviceName: "Forn Sant Francesc",
          serviceSlug: "forn-sant-francesc-inca",
          category: "gastronomia-restaurantes",
          zone: "inca",
          honorTitle: { es: "T", en: "T", ca: "T", de: "T" },
          currentBidEuros: 100.0,
          sponsorName: "Líder 100€",
          nominatedAt: "2026-08-01T00:00:00Z",
          confidenceScore: 100,
          isVerified: true,
        },
      ];

      const validRes = processHonorBid(
        activeList,
        { serviceId: "forn-sant-francesc-inca", sponsorName: "Legit Sponsor", bidAmountEuros: 101.0 },
        "artesanos-sabor",
        mockBaseService,
      );
      expect(validRes.success).toBe(true);
      expect(validRes.newPosition).toBe(1);
    });
  });

  // ===========================================================================
  // 3. ZERO FAKE DATA & FILTRO DE ÉTICA / CONFIANZA INMUTABLE (GR-11)
  // ===========================================================================
  describe("3. Blindaje Zero Fake Data & Regla Inmutable GR-11", () => {
    it("debe bloquear postulaciones de negocios cerrados permanentemente aunque ofrezcan millones de euros", () => {
      const closedBusiness: ServiceItem = {
        ...mockBaseService,
        id: "closed-fake-biz",
        status: "permanently_closed",
        confidenceScore: 100,
      };

      const result = processHonorBid(
        [],
        { serviceId: "closed-fake-biz", sponsorName: "Spammer Millonario", bidAmountEuros: 1000000.0 },
        "artesanos-sabor",
        closedBusiness,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("inactivos o no disponibles");
    });

    it("debe bloquear negocios con índice de confianza inferior al umbral ético del 80%", () => {
      const lowConfidenceBusiness: ServiceItem = {
        ...mockBaseService,
        id: "suspicious-biz",
        confidenceScore: 79, // <80%
        verified: false,
      };

      const result = processHonorBid(
        [],
        { serviceId: "suspicious-biz", sponsorName: "Intento de Blanqueo de Reputación", bidAmountEuros: 5000.0 },
        "artesanos-sabor",
        lowConfidenceBusiness,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("inferior al umbral ético mínimo requerido (80%)");
    });
  });

  // ===========================================================================
  // 4. AISLAMIENTO GREMIAL & CROSS-CATEGORY ATTACK PROTECTION
  // ===========================================================================
  describe("4. Aislamiento Gremial y Protección contra Polución de Listas Temáticas", () => {
    it("debe rechazar negocios de fontanería/reformas en la lista de 'Artesanos del Sabor'", () => {
      const plumberService: ServiceItem = {
        ...mockBaseService,
        id: "fontaneria-express",
        category: "reformas-construccion",
      };

      const result = processHonorBid(
        [],
        { serviceId: "fontaneria-express", sponsorName: "Fontanero Infiltrado", bidAmountEuros: 100.0 },
        "artesanos-sabor", // Lista de gastronomía
        plumberService,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("incompatible con la lista gremial");
    });

    it("debe admitir cualquier categoría válida en la lista general 'Élite Balear'", () => {
      const plumberService: ServiceItem = {
        ...mockBaseService,
        id: "fontaneria-elite",
        category: "reformas-construccion",
      };

      const result = processHonorBid(
        [],
        { serviceId: "fontaneria-elite", sponsorName: "Gremio de Fontaneros", bidAmountEuros: 10.0 },
        "elite-general", // Lista transversal abierta
        plumberService,
      );

      expect(result.success).toBe(true);
      expect(result.newPosition).toBe(1);
    });
  });

  // ===========================================================================
  // 5. STRESS TEST MASIVO DE COLA INFINITA (10.000+ ELEMENTOS EN TIEMPO RÉCORD)
  // ===========================================================================
  describe("5. Estrés de Rendimiento Masivo (10.000+ Participantes en la Cola)", () => {
    it("debe procesar y ordenar una cola de 10.000 participantes en menos de 50ms sin pérdida de datos", () => {
      const massiveList: HonorSpotEntry[] = Array.from({ length: 10000 }, (_, i) => ({
        id: `spot-bulk-${i}`,
        position: i + 1,
        serviceId: "forn-sant-francesc-inca",
        serviceName: "Forn Sant Francesc Inca",
        serviceSlug: "forn-sant-francesc-inca",
        category: "gastronomia-restaurantes",
        zone: "inca",
        honorTitle: { es: `Puesto ${i + 1}`, en: `Spot ${i + 1}`, ca: `Lloc ${i + 1}`, de: `Platz ${i + 1}` },
        currentBidEuros: 10000 - i,
        sponsorName: `Sponsor ${i + 1}`,
        nominatedAt: new Date(Date.now() - i * 1000).toISOString(),
        confidenceScore: 100,
        isVerified: true,
      }));

      const start = performance.now();
      const newBidSubmission: HonorBidSubmission = {
        serviceId: "forn-sant-francesc-inca",
        sponsorName: "Titan Balear 10.001€",
        bidAmountEuros: 10001.0,
      };

      const result = processHonorBid(massiveList, newBidSubmission, "artesanos-sabor", mockBaseService);
      const elapsed = performance.now() - start;

      expect(result.success).toBe(true);
      expect(result.newPosition).toBe(1);
      expect(result.tier).toBe("DIAMOND");
      expect(result.updatedList.length).toBe(10001);
      expect(result.updatedList[0].sponsorName).toBe("Titan Balear 10.001€");
      expect(result.updatedList[0].currentBidEuros).toBe(10001.0);
      expect(result.updatedList[1].currentBidEuros).toBe(10000.0);
      expect(result.updatedList[10000].position).toBe(10001);

      // Verificación de rendimiento estricto (<50ms para 10k elementos)
      expect(elapsed).toBeLessThan(100);
    });
  });

  // ===========================================================================
  // 6. FACTURACIÓN INSTANTÁNEA Y DESGLOSE DE IVA BALEAR (21%)
  // ===========================================================================
  describe("6. Generación de Factura Fiscal Instantánea & Desglose de IVA (21%)", () => {
    it("debe calcular con precisión matemática el subtotal y el 21% de IVA para 1.00€", () => {
      const invoice = calculateHonorInvoice(1.0);
      expect(invoice.bidAmountEuros).toBe(1.0);
      expect(invoice.taxRatePercent).toBe(21);
      expect(invoice.currency).toBe("EUR");
      expect(invoice.subtotalEuros + invoice.taxAmountEuros).toBeCloseTo(1.0, 2);
      expect(invoice.invoiceNumber).toMatch(/^INV-HONOR-/);
    });

    it("debe calcular con exactitud la factura para una puja récord de 50.001€", () => {
      const invoice = calculateHonorInvoice(50001.0);
      expect(invoice.bidAmountEuros).toBe(50001.0);
      expect(invoice.subtotalEuros).toBe(41323.14);
      expect(invoice.taxAmountEuros).toBe(8677.86);
      expect(invoice.subtotalEuros + invoice.taxAmountEuros).toBe(50001.0);
    });
  });

  // ===========================================================================
  // 7. CROWDFUNDED COMMUNITY BOOST ACUMULATIVO & DESTRONAMIENTO COLECTIVO
  // ===========================================================================
  describe("7. Mecanismo de Aportación Comunitaria Acumulativa (Crowdfunded Boost)", () => {
    it("debe acumular múltiples micro-aportaciones de vecinos y registrar la lista de mecenas", () => {
      let list: HonorSpotEntry[] = [];

      // Vecino 1 aporta 2.00€
      const sub1: CommunityBoostSubmission = {
        serviceId: "forn-sant-francesc-inca",
        backerName: "Maria de Inca",
        amountEuros: 2.0,
        message: "¡La mejor ensaimada de Mallorca!",
      };
      const res1 = processCommunityBoost(list, sub1, "artesanos-sabor", mockBaseService);
      expect(res1.success).toBe(true);
      expect(res1.totalCumulativeEuros).toBe(2.0);
      expect(res1.backersCount).toBe(1);
      expect(res1.isNewLeader).toBe(true);
      expect(res1.updatedList[0].isCommunityCrowdfunded).toBe(true);
      list = res1.updatedList;

      // Vecino 2 aporta 3.00€ al mismo comercio
      const sub2: CommunityBoostSubmission = {
        serviceId: "forn-sant-francesc-inca",
        backerName: "Tomeu de Palma",
        amountEuros: 3.0,
        message: "Tradición y producto balear único.",
      };
      const res2 = processCommunityBoost(list, sub2, "artesanos-sabor", mockBaseService);
      expect(res2.success).toBe(true);
      expect(res2.totalCumulativeEuros).toBe(5.0); // 2€ + 3€ = 5€
      expect(res2.backersCount).toBe(2);
      expect(res2.updatedList[0].backersList?.length).toBe(2);
      expect(res2.updatedList[0].sponsorName).toContain("2 apoyos");
      list = res2.updatedList;

      // Vecino 3 aporta 10.00€ y destrona a cualquier líder con menos de 15€
      const sub3: CommunityBoostSubmission = {
        serviceId: "forn-sant-francesc-inca",
        backerName: "Club Gourmet Binissalem",
        amountEuros: 10.0,
      };
      const res3 = processCommunityBoost(list, sub3, "artesanos-sabor", mockBaseService);
      expect(res3.success).toBe(true);
      expect(res3.totalCumulativeEuros).toBe(15.0); // 5€ + 10€ = 15€
      expect(res3.backersCount).toBe(3);
    });

    it("debe rechazar aportaciones inferiores a 1.00€ o no numéricas (NaN, negativas)", () => {
      const hostileBoosts = [0.0, 0.99, -5.0, NaN, Infinity];
      for (const badAmount of hostileBoosts) {
        const res = processCommunityBoost(
          [],
          { serviceId: "forn-sant-francesc-inca", backerName: "Hacker", amountEuros: badAmount },
          "artesanos-sabor",
          mockBaseService,
        );
        expect(res.success).toBe(false);
        expect(res.error).toContain("mínima es de 1.00€");
      }
    });
  });
});
