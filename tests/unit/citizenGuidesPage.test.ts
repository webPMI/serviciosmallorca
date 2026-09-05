import { describe, expect, it } from "vitest";
import { CITIZEN_GUIDES, getGuideBySlug, getGuidesByCategory, type GuideCategory } from "../../src/data/citizenGuides";

describe("🏛️ Citizen Guides Page & Routing Suite (/guias)", () => {
  it("recupera correctamente las 6 guías canónicas por su slug", () => {
    const canonicalSlugs = [
      "empadronamiento-palma",
      "tarjeta-ciudadana-palma",
      "itv-cita-previa-mallorca",
      "descuento-residente-balear",
      "tarjeta-sanitaria-ibsalut",
      "nie-tie-extranjeria-palma",
    ];

    canonicalSlugs.forEach((slug) => {
      const guide = getGuideBySlug(slug);
      expect(guide).toBeDefined();
      expect(guide?.slug).toBe(slug);
      expect(guide?.title.es).toBeTruthy();
      expect(guide?.title.ca).toBeTruthy();
      expect(guide?.title.en).toBeTruthy();
      expect(guide?.title.de).toBeTruthy();
    });
  });

  it("retorna undefined para slugs inexistentes evitando caídas del sistema", () => {
    expect(getGuideBySlug("tramite-inexistente-123")).toBeUndefined();
    expect(getGuideBySlug("")).toBeUndefined();
  });

  it("filtra guías correctamente por categoría administrativa sin duplicados", () => {
    const categories: GuideCategory[] = ["padron", "transporte", "salud", "extranjeria", "vehiculos"];

    categories.forEach((cat) => {
      const filtered = getGuidesByCategory(cat);
      expect(filtered.length).toBeGreaterThanOrEqual(1);
      filtered.forEach((g) => {
        expect(g.category).toBe(cat);
      });
    });
  });

  it(
    "cada guía posee categorías canónicas existentes en CATEGORIES y servicios reales contrastados",
    async () => {
    const { CATEGORIES } = await import("../../src/data/categories");
    const { getServiceById } = await import("../../src/data/services");
    const validCategoryIds = new Set(CATEGORIES.map((c) => c.id));

    CITIZEN_GUIDES.forEach((guide) => {
      expect(guide.relatedServiceCategories.length).toBeGreaterThanOrEqual(1);
      guide.relatedServiceCategories.forEach((cat) => {
        expect(validCategoryIds.has(cat)).toBe(true);
      });

      // Validar servicios recomendados
      expect(guide.recommendedServiceSlugs).toBeDefined();
      expect(guide.recommendedServiceSlugs?.length).toBeGreaterThanOrEqual(3);

      guide.recommendedServiceSlugs?.forEach((slug) => {
        const service = getServiceById(slug);
        expect(service, `Servicio recomendado no encontrado: ${slug}`).toBeDefined();
        expect(service?.status).not.toBe("permanently_closed");
      });

      // Validar encabezado contextual trilingüe/cuatrilingüe
      if (guide.assistanceHeader) {
        expect(guide.assistanceHeader.title.es.length).toBeGreaterThan(10);
        expect(guide.assistanceHeader.title.ca.length).toBeGreaterThan(10);
        expect(guide.assistanceHeader.title.en.length).toBeGreaterThan(10);
        expect(guide.assistanceHeader.title.de.length).toBeGreaterThan(10);

        expect(guide.assistanceHeader.body.es.length).toBeGreaterThan(20);
        expect(guide.assistanceHeader.body.ca.length).toBeGreaterThan(20);
        expect(guide.assistanceHeader.body.en.length).toBeGreaterThan(20);
        expect(guide.assistanceHeader.body.de.length).toBeGreaterThan(20);
      }
    });
  }, 15000);

  it("genera la estructura correcta de Schema.org HowTo y FAQPage para SEO institucional", () => {
    const guide = getGuideBySlug("empadronamiento-palma");
    expect(guide).toBeDefined();

    if (guide) {
      const prefix = "/es/";
      const schemaOrg = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "HowTo",
            name: guide.title.es,
            description: guide.summary.es,
            totalTime: "P1D",
            step: guide.steps.map((step) => ({
              "@type": "HowToStep",
              position: step.stepNumber,
              name: step.title.es,
              text: step.description.es,
              url: `https://serviciosmallorca.com${prefix}guias/${guide.slug}#paso-${step.stepNumber}`,
            })),
          },
          {
            "@type": "FAQPage",
            mainEntity: guide.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question.es,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer.es,
              },
            })),
          },
        ],
      };

      const graph = schemaOrg["@graph"] as [
        { "@type": string; step: unknown[] },
        { "@type": string; mainEntity: unknown[] },
      ];
      expect(graph.length).toBe(2);
      expect(graph[0]["@type"]).toBe("HowTo");
      expect(graph[0].step.length).toBe(guide.steps.length);
      expect(graph[1]["@type"]).toBe("FAQPage");
      expect(graph[1].mainEntity.length).toBe(guide.faqs.length);
    }
  });

  it("todas las oficinas asociadas a las guías tienen URLs de cita previa válidas HTTPS (GR-11)", () => {
    CITIZEN_GUIDES.forEach((guide) => {
      guide.offices.forEach((office) => {
        expect(office.appointmentUrl).toMatch(/^https:\/\//);
        expect(office.phone.length).toBeGreaterThanOrEqual(9);
      });
    });
  });
});
