import { describe, it, expect } from "vitest";
import { SIGNATURE_TOURS, getHydratedTourBySlug, generateDynamicTourFromAnchor } from "../../src/lib/experienceTours";

describe("Experience Tours & Dynamic Route Engine", () => {
  it("contiene rutas temáticas de autor predefinidas", () => {
    expect(SIGNATURE_TOURS.length).toBeGreaterThanOrEqual(4);
    const tramuntanaTour = SIGNATURE_TOURS.find((t) => t.id === "tour-tramuntana-vidrio-arte");
    expect(tramuntanaTour).toBeDefined();
    expect(tramuntanaTour?.title.es).toContain("Vidrio");

    const raiguerTour = SIGNATURE_TOURS.find((t) => t.id === "tour-raiguer-vinos-artesania");
    expect(raiguerTour).toBeDefined();
    expect(raiguerTour?.title.es).toContain("Binissalem");
  });

  it("hidrata correctamente una ruta de autor con negocios reales y distancias calculadas", () => {
    const tour = getHydratedTourBySlug("ruta-arte-vidrio-tradicion-tramuntana");
    expect(tour).toBeDefined();
    expect(tour?.stops.length).toBeGreaterThan(0);

    const raiguerHydrated = getHydratedTourBySlug("ruta-vinos-artesania-raiguer-pla");
    expect(raiguerHydrated).toBeDefined();
    expect(raiguerHydrated?.stops.length).toBe(3);

    const firstStop = tour?.stops[0];
    expect(firstStop?.service.id).toBe("lafiore-vidrio-artesanal");
    expect(firstStop?.role).toBe("experience_anchor");
    expect(firstStop?.stepDescription.es).toBeDefined();

    if (tour && tour.stops.length > 1) {
      expect(typeof tour.stops[0].travelDistanceToNextKm).toBe("number");
      expect(tour.stops[0].formattedDistanceToNext).toBeDefined();
    }
  });

  it("genera una ruta dinámica a partir de cualquier negocio ancla usando SmartMatch", () => {
    const dynamicTour = generateDynamicTourFromAnchor("puerto-portals-marina", 3);
    expect(dynamicTour).toBeDefined();
    expect(dynamicTour?.stops.length).toBeGreaterThan(1);
    expect(dynamicTour?.stops[0].service.slug).toBe("puerto-portals-marina");
    expect(dynamicTour?.totalDistanceKm).toBeGreaterThanOrEqual(0);
    expect(dynamicTour?.estimatedTotalHours).toBeGreaterThan(0);
  });

  it("devuelve undefined para slugs de tours o anclas inexistentes", () => {
    expect(getHydratedTourBySlug("ruta-inexistente-xyz")).toBeUndefined();
    expect(generateDynamicTourFromAnchor("slug-fantasma-123")).toBeUndefined();
  });
});
