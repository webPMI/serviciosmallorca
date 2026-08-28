/**
 * tests/unit/communityBoostEngine.test.ts
 *
 * 🧪 PRUEBAS UNITARIAS DEL MOTOR DE IMPULSO COMUNITARIO COLECTIVO (CROWDFUNDED BOOST)
 */

import { describe, it, expect } from "vitest";
import {
  processCommunityBoost,
  type CommunityBoostSubmission,
  type HonorSpotEntry,
} from "../../src/lib/honorBoardEngine.ts";
import type { ServiceItem } from "../../src/data/services/index.ts";

const mockService: ServiceItem = {
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

describe("🤝 MOTOR DE IMPULSO COMUNITARIO COLECTIVO (CROWDFUNDED BOOST)", () => {
  it("debe registrar una primera aportación comunitaria de 1.00€ y situar al negocio en la lista", () => {
    const submission: CommunityBoostSubmission = {
      serviceId: mockService.id,
      backerUid: "user-1",
      backerName: "Antònia (Vecina de Inca)",
      amountEuros: 1.0,
      message: "¡La mejor ensaimada de Mallorca!",
    };

    const result = processCommunityBoost([], submission, "artesanos-sabor", mockService);
    expect(result.success).toBe(true);
    expect(result.newPosition).toBe(1);
    expect(result.tier).toBe("DIAMOND");
    expect(result.totalCumulativeEuros).toBe(1.0);
    expect(result.backersCount).toBe(1);
    expect(result.updatedList[0].isCommunityCrowdfunded).toBe(true);
    expect(result.updatedList[0].communityBackersCount).toBe(1);
    expect(result.updatedList[0].backersList?.length).toBe(1);
  });

  it("debe acumular múltiples aportaciones vecinales sumando el total recaudado", () => {
    let currentList: HonorSpotEntry[] = [];

    // Vecino 1 aporta 5€
    const res1 = processCommunityBoost(
      currentList,
      { serviceId: mockService.id, backerUid: "u1", backerName: "Vecino 1", amountEuros: 5.0 },
      "artesanos-sabor",
      mockService,
    );
    expect(res1.success).toBe(true);
    expect(res1.totalCumulativeEuros).toBe(5.0);
    expect(res1.backersCount).toBe(1);
    currentList = res1.updatedList;

    // Vecino 2 aporta 10€
    const res2 = processCommunityBoost(
      currentList,
      { serviceId: mockService.id, backerUid: "u2", backerName: "Vecino 2", amountEuros: 10.0 },
      "artesanos-sabor",
      mockService,
    );
    expect(res2.success).toBe(true);
    expect(res2.totalCumulativeEuros).toBe(15.0); // 5 + 10 = 15€
    expect(res2.backersCount).toBe(2);
    expect(res2.updatedList[0].currentBidEuros).toBe(15.0);
    expect(res2.updatedList[0].backersList?.length).toBe(2);
    currentList = res2.updatedList;

    // Vecino 3 aporta 25€
    const res3 = processCommunityBoost(
      currentList,
      { serviceId: mockService.id, backerUid: "u3", backerName: "Vecino 3", amountEuros: 25.0 },
      "artesanos-sabor",
      mockService,
    );
    expect(res3.success).toBe(true);
    expect(res3.totalCumulativeEuros).toBe(40.0); // 15 + 25 = 40€
    expect(res3.backersCount).toBe(3);
    expect(res3.updatedList[0].currentBidEuros).toBe(40.0);
  });

  it("debe aupar al negocio a la cima superando a un líder individual cuando la suma comunitaria es mayor", () => {
    const existingQueue: HonorSpotEntry[] = [
      {
        id: "spot-solo-leader",
        position: 1,
        serviceId: "rest-palma",
        serviceName: "Restaurante Palma",
        serviceSlug: "restaurante-palma",
        category: "gastronomia-restaurantes",
        zone: "palma",
        honorTitle: { es: "Líder", en: "Leader", ca: "Líder", de: "Leader" },
        currentBidEuros: 30.0,
        sponsorName: "Patrocinador Individual (30€)",
        nominatedAt: "2026-08-01T00:00:00Z",
        confidenceScore: 95,
        isVerified: true,
      },
    ];

    // La comunidad del Forn de Inca aporta 35€ en conjunto
    const boost: CommunityBoostSubmission = {
      serviceId: mockService.id,
      backerUid: "user-inca",
      backerName: "Gremio Popular de Inca",
      amountEuros: 35.0,
    };

    const result = processCommunityBoost(existingQueue, boost, "artesanos-sabor", mockService);
    expect(result.success).toBe(true);
    expect(result.newPosition).toBe(1);
    expect(result.isNewLeader).toBe(true);
    expect(result.updatedList[0].serviceId).toBe(mockService.id);
    expect(result.updatedList[0].currentBidEuros).toBe(35.0);
    // El anterior líder individual pasa al puesto #2 (Oro)
    expect(result.updatedList[1].serviceId).toBe("rest-palma");
    expect(result.updatedList[1].position).toBe(2);
  });

  it("debe rechazar aportaciones inferiores a 1.00€ o NaN", () => {
    const badRes1 = processCommunityBoost(
      [],
      { serviceId: mockService.id, backerName: "Spammer", amountEuros: 0.5 },
      "artesanos-sabor",
      mockService,
    );
    expect(badRes1.success).toBe(false);
    expect(badRes1.error).toContain("mínima es de 1.00€");

    const badRes2 = processCommunityBoost(
      [],
      { serviceId: mockService.id, backerName: "Spammer", amountEuros: -10 },
      "artesanos-sabor",
      mockService,
    );
    expect(badRes2.success).toBe(false);
  });

  it("debe rechazar impulsos comunitarios para negocios cerrados o con score < 80% (GR-11)", () => {
    const closedBiz: ServiceItem = {
      ...mockService,
      status: "permanently_closed",
    };

    const res = processCommunityBoost(
      [],
      { serviceId: closedBiz.id, backerName: "Fan", amountEuros: 10.0 },
      "artesanos-sabor",
      closedBiz,
    );
    expect(res.success).toBe(false);
    expect(res.error).toContain("inactivos");
  });
});
