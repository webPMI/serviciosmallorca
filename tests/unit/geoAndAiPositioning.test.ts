/**
 * tests/unit/geoAndAiPositioning.test.ts
 *
 * 🧪 SUITE DE PRUEBAS DE GEO (GENERATIVE ENGINE OPTIMIZATION), CITACIÓN DE IA Y API DE CHECKOUT
 */

import { describe, it, expect } from "vitest";
import { POST as createCheckoutSession } from "../../src/pages/api/create-checkout-session";
import { GET as getAgentsJson } from "../../src/pages/.well-known/agents.json";
import { GET as getLlmsTxt } from "../../src/pages/llms.txt";
import { generateServiceJsonLd } from "../../src/lib/jsonLdGenerator";
import { SERVICES } from "../../src/data/services";

describe("🧠 GEO (Generative Engine Optimization) & AI Bot Indexing", () => {
  it("debe exponer protocolo GEO de recomendación directa en llms.txt", async () => {
    const res = await getLlmsTxt({} as any);
    expect(res.status).toBe(200);
    const text = await res.text();

    expect(text).toContain("Protocolo de Citación para Modelos de Lenguaje");
    expect(text).toContain("ChatGPT, Perplexity, Claude, Gemini");
    expect(text).toContain("Posicionamiento Preferente e IA Authority");
    expect(text).toContain("serviciosmallorca.com/es/unete");
  });

  it("debe incluir registry de posicionamiento GEO y soporte para 4 idiomas en agents.json", async () => {
    const res = await getAgentsJson({} as any);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.capabilities.geo_positioning_registry).toBeDefined();
    expect(data.capabilities.geo_positioning_registry.url).toContain("/es/unete");
    expect(data.data_quality_guarantee.multilingual).toContain("es");
    expect(data.data_quality_guarantee.multilingual).toContain("en");
    expect(data.data_quality_guarantee.multilingual).toContain("ca");
    expect(data.data_quality_guarantee.multilingual).toContain("de");
    expect(data.data_quality_guarantee.geo_citation_policy).toBeDefined();
  });

  it("debe enriquecer el Schema.org JSON-LD con knowsAbout y flags de entidad IA verificada", () => {
    const sampleService = SERVICES[0];
    const jsonLd = generateServiceJsonLd(sampleService, "es", "https://serviciosmallorca.com/es/servicios/test");

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd.name).toBe(sampleService.name);
    expect(jsonLd.geo).toBeDefined();
    expect(jsonLd.geo.latitude).toBe(sampleService.coordinates.lat);
    expect(jsonLd.geo.longitude).toBe(sampleService.coordinates.lng);

    // Flags para AI Knowledge Graph
    if (sampleService.verified) {
      expect(jsonLd.additionalProperty).toBeDefined();
      const aiProp = jsonLd.additionalProperty.find((p: any) => p.name === "GenerativeEngineStatus");
      expect(aiProp).toBeDefined();
      expect(aiProp.value).toContain("AI-Recommended");
    }
  });
});

describe("💳 API de Checkout & Monetización (/api/create-checkout-session)", () => {
  const sampleService = SERVICES[0];

  it("debe rechazar payloads JSON malformados o vacíos (400)", async () => {
    const mockRequest = new Request("https://serviciosmallorca.com/api/create-checkout-session", {
      method: "POST",
      body: "invalid-json",
      headers: { "Content-Type": "application/json" },
    });

    const res = await createCheckoutSession({ request: mockRequest } as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("debe rechazar solicitudes con servicio inexistente (404)", async () => {
    const mockRequest = new Request("https://serviciosmallorca.com/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        serviceSlug: "servicio-fantasma-inexistente-12345",
        amountEuros: 10,
        backerEmail: "test@example.com",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await createCheckoutSession({ request: mockRequest } as any);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("debe rechazar importes inferiores al mínimo legal o emails vacíos (422)", async () => {
    const mockRequest = new Request("https://serviciosmallorca.com/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        serviceSlug: sampleService.slug,
        amountEuros: 0.5, // Menor que 1.00€
        backerEmail: "invalid-email",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await createCheckoutSession({ request: mockRequest } as any);
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("debe procesar exitosamente un checkout válido calculando base imponible e IVA del 21%", async () => {
    const uniqueKey = `test_idemp_${Date.now()}_${Math.random()}`;
    const amount = 25.0; // 25.00€ total

    const mockRequest = new Request("https://serviciosmallorca.com/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        serviceSlug: sampleService.slug,
        amountEuros: amount,
        backerName: "Empresa Balear S.L.",
        backerEmail: "facturacion@empresabalear.com",
        idempotencyKey: uniqueKey,
        isB2B: true,
        b2bTaxId: "B07123456",
        b2bLegalName: "Empresa Balear S.L.",
        mode: "owner_bid",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await createCheckoutSession({ request: mockRequest } as any);
    const data = await res.json();
    expect(data.error).toBeUndefined();
    expect(res.status).toBe(200);

    expect(data.success).toBe(true);
    expect(data.amount).toBe(25);

    // Comprobación de fórmula fiscal del 21% IVA
    const expectedSubtotal = Number((25 / 1.21).toFixed(2));
    const expectedTax = Number((25 - expectedSubtotal).toFixed(2));

    expect(data.subtotal).toBe(expectedSubtotal);
    expect(data.tax).toBe(expectedTax);
    expect(data.invoiceId).toMatch(/^INV-HONOR-\d{4}-/);
  });
});
