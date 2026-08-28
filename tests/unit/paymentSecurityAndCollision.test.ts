/**
 * paymentSecurityAndCollision.test.ts
 *
 * 🔒 SUITE DE PRUEBAS DE BLINDAJE DE PAGOS, IDEMPOTENCIA Y NO-COLISIÓN DE PUJAS (2026)
 *
 * Valida:
 *  1. 🛑 Anti-Doble Clic & Mutex Locks: Prevención de transacciones duplicadas por doble clic o ráfagas.
 *  2. 🔑 Idempotencia Criptográfica: Tokens únicos y bloqueo de ataques de re-envío (Anti-Replay).
 *  3. 👑 Regla Estricta de No-Colisión: Ningún comercio puede compartir el mismo importe exacto en Cuadro de Honor.
 *  4. 💳 Validación Integral de Petición de Pago: Integridad de importes, emails, y métodos de pago.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  generatePaymentIdempotencyKey,
  acquirePaymentLock,
  releasePaymentLock,
  recordCompletedPayment,
  isPaymentAlreadyProcessed,
  validateUniqueHonorAmount,
  validatePaymentRequest,
  resetPaymentSecurityState,
} from "../../src/lib/paymentSecurityEngine.ts";
import { processHonorBid, type HonorSpotEntry } from "../../src/lib/honorBoardEngine.ts";
import type { ServiceItem } from "../../src/data/services/index.ts";

const mockServiceA: ServiceItem = {
  id: "forn-inca-tradicio",
  slug: "forn-inca-tradicio",
  name: "Forn Inca Tradició",
  category: "gastronomia-restaurantes",
  zone: "inca",
  address: "Carrer Major 12, Inca",
  coordinates: { lat: 39.72, lng: 2.91 },
  rating: 4.9,
  reviewCount: 310,
  priceRange: "€€",
  verified: true,
  featured: true,
  status: "open",
  googleMapsUrl: "https://maps.google.com/?id=forn",
  appleMapsUrl: "https://maps.apple.com/?id=forn",
  bingMapsUrl: "https://bing.com/maps/?id=forn",
  phone: "+34 971 501 020",
  whatsapp: "+34 971 501 020",
  email: "info@fornincatradicio.com",
  website: "https://fornincatradicio.com",
  tags: ["ensaimadas", "inca"],
  shortDescription: { es: "Forn tradicional", en: "Traditional bakery", ca: "Forn tradicional", de: "Bäckerei" },
  fullDescription: {
    es: "Ensaimadas artesanas",
    en: "Handmade ensaimadas",
    ca: "Ensaïmades artesanes",
    de: "Ensaimadas",
  },
  image: "/images/forn.jpg",
  schedule: "L-S 07:00-20:00",
  confidenceScore: 94,
};

describe("🔒 BLINDAJE DE PAGOS, IDEMPOTENCIA Y PREVENCIÓN DE DUPLICADOS", () => {
  beforeEach(() => {
    resetPaymentSecurityState();
  });

  // ===========================================================================
  // 1. IDEMPOTENCIA Y PROTECCIÓN CONTRA DOBLE CLIC (MUTEX LOCKS)
  // ===========================================================================
  describe("1. Idempotencia y Mutex Anti-Doble Clic", () => {
    it("debe generar claves de idempotencia únicas y no colisionantes", () => {
      const key1 = generatePaymentIdempotencyKey("forn-inca-tradicio", 5.0, "user@test.com");
      const key2 = generatePaymentIdempotencyKey("forn-inca-tradicio", 5.0, "user@test.com");

      expect(key1).toMatch(/^idemp_forn-inca-tradicio_5\.00_/);
      expect(key2).toMatch(/^idemp_forn-inca-tradicio_5\.00_/);
      expect(key1).not.toBe(key2); // Diferente salt criptográfico / timestamp
    });

    it("debe bloquear intentos concurrentes por doble clic en la misma clave de idempotencia", () => {
      const idempotencyKey = "idemp_test_lock_123";

      // 1. Primer clic adquiere el bloqueo con éxito
      const firstClick = acquirePaymentLock(idempotencyKey, 15000);
      expect(firstClick).toBe(true);

      // 2. Segundo clic inmediato (doble clic) es rechazado por el mutex
      const doubleClick = acquirePaymentLock(idempotencyKey, 15000);
      expect(doubleClick).toBe(false);

      // 3. Tras liberar el bloqueo (o completarse el pago), se permite nueva transacción
      releasePaymentLock(idempotencyKey);
      const afterRelease = acquirePaymentLock(idempotencyKey, 15000);
      expect(afterRelease).toBe(true);
    });

    it("debe registrar pagos completados e impedir ataques de re-envío (Anti-Replay)", () => {
      const idempotencyKey = "idemp_completed_order_456";

      expect(isPaymentAlreadyProcessed(idempotencyKey)).toBe(false);

      // Registrar pago completado en el libro mayor de idempotencia
      recordCompletedPayment(idempotencyKey, "forn-inca-tradicio", 10.0);

      expect(isPaymentAlreadyProcessed(idempotencyKey)).toBe(true);

      // Intento de volver a enviar la misma transacción es rechazado
      const duplicateSubmission = validatePaymentRequest({
        serviceId: "forn-inca-tradicio",
        serviceSlug: "forn-inca-tradicio",
        amountEuros: 10.0,
        backerName: "Joan",
        backerEmail: "joan@test.com",
        paymentMethod: "card",
        mode: "owner_bid",
        idempotencyKey,
        clientTimestamp: Date.now(),
      });

      expect(duplicateSubmission.allowed).toBe(false);
      expect(duplicateSubmission.error).toContain("ya fue procesado y confirmado");
    });
  });

  // ===========================================================================
  // 2. REGLA ESTRICTA DE NO-COLISIÓN EN EL CUADRO DE HONOR (NO DOS MONTOS IGUALES)
  // ===========================================================================
  describe("2. Regla Estricta de No-Colisión en el Cuadro de Honor", () => {
    const activeList: HonorSpotEntry[] = [
      {
        id: "spot-1",
        position: 1,
        serviceId: "forn-inca-tradicio",
        serviceName: "Forn Inca Tradició",
        serviceSlug: "forn-inca-tradicio",
        category: "gastronomia-restaurantes",
        zone: "inca",
        honorTitle: { es: "Líder", en: "Leader", ca: "Líder", de: "Leader" },
        currentBidEuros: 5.0,
        sponsorName: "Titular Forn",
        nominatedAt: new Date().toISOString(),
        confidenceScore: 94,
        isVerified: true,
      },
      {
        id: "spot-2",
        position: 2,
        serviceId: "pasteleria-palma-gourmet",
        serviceName: "Pastelería Palma Gourmet",
        serviceSlug: "pasteleria-palma-gourmet",
        category: "gastronomia-restaurantes",
        zone: "palma",
        honorTitle: { es: "Plata", en: "Silver", ca: "Plata", de: "Silber" },
        currentBidEuros: 3.0,
        sponsorName: "Titular Palma",
        nominatedAt: new Date().toISOString(),
        confidenceScore: 90,
        isVerified: true,
      },
    ];

    it("debe rechazar una puja si coincide exactamente con el importe de otro comercio existente", () => {
      // Intentar pujar 5.00€ (igual al líder) o 3.00€ (igual al #2)
      const collisionCheckLeader = validateUniqueHonorAmount(activeList, 5.0, "otro-comercio-calvia");
      expect(collisionCheckLeader.unique).toBe(false);
      expect(collisionCheckLeader.error).toContain("Ya existe otro comercio en esta lista con exactamente 5.00€");

      const collisionCheckSilver = validateUniqueHonorAmount(activeList, 3.0, "otro-comercio-calvia");
      expect(collisionCheckSilver.unique).toBe(false);
      expect(collisionCheckSilver.error).toContain("3.00€ (Pastelería Palma Gourmet)");
    });

    it("debe permitir un importe superior al récord actual (+1€) que no colisione", () => {
      const validBid = validateUniqueHonorAmount(activeList, 6.0, "otro-comercio-calvia");
      expect(validBid.unique).toBe(true);
    });

    it("processHonorBid debe rechazar intentos de puja que colisionen con un importe ya registrado", () => {
      const collisionResult = processHonorBid(
        activeList,
        {
          serviceId: "tercer-comercio",
          sponsorName: "Tercero",
          bidAmountEuros: 5.0, // Colisión con Forn Inca Tradició (5.00€)
        },
        "artesanos-sabor",
        { ...mockServiceA, id: "tercer-comercio" },
      );

      expect(collisionResult.success).toBe(false);
      expect(collisionResult.error).toContain("insuficiente o inválida");
    });
  });

  // ===========================================================================
  // 3. VALIDACIÓN COMPLETA DE PETICIONES DE PAGO
  // ===========================================================================
  describe("3. Validación Integral de Petición de Pago en Pasarela", () => {
    it("debe aprobar peticiones válidas y adquirir el bloqueo de seguridad", () => {
      const validPayload = {
        serviceId: "forn-inca-tradicio",
        serviceSlug: "forn-inca-tradicio",
        amountEuros: 8.0,
        backerName: "Antoni Pons",
        backerEmail: "antoni@gmail.com",
        paymentMethod: "card" as const,
        mode: "community_boost" as const,
        idempotencyKey: generatePaymentIdempotencyKey("forn-inca-tradicio", 8.0, "antoni@gmail.com"),
        clientTimestamp: Date.now(),
      };

      const result = validatePaymentRequest(validPayload, []);
      expect(result.allowed).toBe(true);
      expect(result.sanitizedAmount).toBe(8.0);
      expect(result.idempotencyKey).toBe(validPayload.idempotencyKey);
    });

    it("debe rechazar peticiones con emails inválidos o importes menores a 1€", () => {
      const badEmailPayload = {
        serviceId: "forn-inca-tradicio",
        serviceSlug: "forn-inca-tradicio",
        amountEuros: 5.0,
        backerName: "Antoni",
        backerEmail: "invalid-email-format",
        paymentMethod: "bizum" as const,
        mode: "community_boost" as const,
        idempotencyKey: "idemp_bad_email",
        clientTimestamp: Date.now(),
      };

      const res = validatePaymentRequest(badEmailPayload, []);
      expect(res.allowed).toBe(false);
      expect(res.error).toContain("correo electrónico válido");
    });

    it("debe garantizar que HonorCheckoutModal y perfil.astro preservan la navegación y parámetros de éxito", async () => {
      const fs = await import("fs");
      const path = await import("path");
      const modalContent = fs.readFileSync(
        path.resolve(process.cwd(), "src/components/HonorCheckoutModal.astro"),
        "utf-8",
      );
      const perfilContent = fs.readFileSync(path.resolve(process.cwd(), "src/pages/[...locale]/perfil.astro"), "utf-8");

      // Modal redirige a ${prefix}profile preservando idioma
      expect(modalContent).toContain("${prefix}profile?boostSuccess=1");
      // Perfil redirige a profile manteniendo query search
      expect(perfilContent).toContain("Astro.redirect(`${prefix}profile${search}`)");
    });
  });
});
