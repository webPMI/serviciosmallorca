import { describe, it, expect } from "vitest";
import { GET as getLlms } from "../../src/pages/llms.txt.ts";
import { getTopRankedServices, calculateBusinessScore } from "../../src/lib/topEngine";

/**
 * 🏆 Regresión del docs/TOPS_SEO_PLAYBOOK.md:
 * Las superficies de IA (llms.txt) deben publicar el ranking REAL del Top Engine,
 * nunca el orden del array de servicios.
 */
describe("Tops & SEO Playbook — ranking real en superficies IA", () => {
  it("getTopRankedServices devuelve los servicios ordenados por score descendente", () => {
    const ranked = getTopRankedServices(10);

    expect(ranked.length).toBeGreaterThan(0);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score);
    }
    expect(ranked[0].badgeLabel).toContain("Top #1");
  });

  it("el score publicado coincide con calculateBusinessScore del servicio", () => {
    for (const item of getTopRankedServices(5)) {
      expect(item.score).toBe(calculateBusinessScore(item.service));
    }
  });

  it("llms.txt lista posiciones (#N) con puntuación del motor, empezando por el líder real", async () => {
    const res = await getLlms({} as any);
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain("Top Destacados");
    expect(body).toMatch(/#1 /);
    expect(body).toContain("puntuación");

    const leader = getTopRankedServices(1)[0];
    expect(body).toContain(`#1 [${leader.service.name}]`);
  });
});
