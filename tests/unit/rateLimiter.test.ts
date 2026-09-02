import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  checkRateLimit,
  createRateLimitResponse,
  extractClientIdentifier,
  resetRateLimitsForTesting,
} from "../../src/lib/rateLimiter";

describe("🛡️ Rate Limiter Suite (Cloudflare Workers & Memory Fallback)", () => {
  beforeEach(() => {
    resetRateLimitsForTesting();
    vi.restoreAllMocks();
  });

  describe("extractClientIdentifier & GDPR Anonymization (GR-13)", () => {
    it("anonymizes IPv4 addresses to the first two octets", () => {
      const req = new Request("https://serviciosmallorca.com/api/test", {
        headers: { "cf-connecting-ip": "194.224.110.45" },
      });
      const id = extractClientIdentifier(req);
      expect(id).toBe("194.224.x.x");
    });

    it("anonymizes IPv6 addresses to first three groups", () => {
      const req = new Request("https://serviciosmallorca.com/api/test", {
        headers: { "cf-connecting-ip": "2001:0db8:85a3:0000:0000:8a2e:0370:7334" },
      });
      const id = extractClientIdentifier(req);
      expect(id).toBe("2001:0db8:85a3::x");
    });

    it("falls back to x-forwarded-for if cf-connecting-ip is absent", () => {
      const req = new Request("https://serviciosmallorca.com/api/test", {
        headers: { "x-forwarded-for": "80.25.12.99, 10.0.0.1" },
      });
      const id = extractClientIdentifier(req);
      expect(id).toBe("80.25.x.x");
    });

    it("falls back to 127.0.x.x if no headers provided", () => {
      const req = new Request("https://serviciosmallorca.com/api/test");
      const id = extractClientIdentifier(req);
      expect(id).toBe("127.0.x.x");
    });
  });

  describe("checkRateLimit with in-memory store", () => {
    it("allows initial requests within limit", async () => {
      const req = new Request("https://serviciosmallorca.com/api/test", {
        headers: { "cf-connecting-ip": "84.120.50.1" },
      });

      const res = await checkRateLimit(req, { limit: 3, windowMs: 10000 });
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(2);
      expect(res.limit).toBe(3);
    });

    it("tracks consecutive requests and blocks when limit is exceeded", async () => {
      const req = new Request("https://serviciosmallorca.com/api/test", {
        headers: { "cf-connecting-ip": "84.120.50.2" },
      });

      // 1st request
      const r1 = await checkRateLimit(req, { limit: 2, windowMs: 10000 });
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(1);

      // 2nd request
      const r2 = await checkRateLimit(req, { limit: 2, windowMs: 10000 });
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(0);

      // 3rd request (exceeds limit)
      const r3 = await checkRateLimit(req, { limit: 2, windowMs: 10000 });
      expect(r3.allowed).toBe(false);
      expect(r3.remaining).toBe(0);
      expect(r3.retryAfterSeconds).toBeGreaterThan(0);
    });

    it("isolates different key prefixes", async () => {
      const req = new Request("https://serviciosmallorca.com/api/test", {
        headers: { "cf-connecting-ip": "84.120.50.3" },
      });

      await checkRateLimit(req, { limit: 1, windowMs: 10000, keyPrefix: "endpoint-a" });
      const blockedA = await checkRateLimit(req, { limit: 1, windowMs: 10000, keyPrefix: "endpoint-a" });
      expect(blockedA.allowed).toBe(false);

      // Different prefix should still be allowed
      const allowedB = await checkRateLimit(req, { limit: 1, windowMs: 10000, keyPrefix: "endpoint-b" });
      expect(allowedB.allowed).toBe(true);
    });
  });

  describe("checkRateLimit with Cloudflare KV mock", () => {
    it("uses KV get and put when KV binding is available", async () => {
      const mockKvStore: Record<string, string> = {};
      const mockKv = {
        get: vi.fn(async (key: string) => {
          const val = mockKvStore[key];
          return val ? JSON.parse(val) : null;
        }),
        put: vi.fn(async (key: string, value: string) => {
          mockKvStore[key] = value;
        }),
      };

      const req = new Request("https://serviciosmallorca.com/api/test", {
        headers: { "cf-connecting-ip": "212.166.40.10" },
      });

      const res1 = await checkRateLimit(req, { limit: 2, windowMs: 60000, keyPrefix: "kv-test" }, mockKv);
      expect(res1.allowed).toBe(true);
      expect(mockKv.put).toHaveBeenCalledTimes(1);

      const res2 = await checkRateLimit(req, { limit: 2, windowMs: 60000, keyPrefix: "kv-test" }, mockKv);
      expect(res2.allowed).toBe(true);

      const res3 = await checkRateLimit(req, { limit: 2, windowMs: 60000, keyPrefix: "kv-test" }, mockKv);
      expect(res3.allowed).toBe(false);
      expect(res3.retryAfterSeconds).toBeGreaterThan(0);
    });
  });

  describe("createRateLimitResponse", () => {
    it("generates HTTP 429 response with correct RFC headers", async () => {
      const result = {
        allowed: false,
        remaining: 0,
        limit: 10,
        resetAt: Date.now() + 45000,
        retryAfterSeconds: 45,
      };

      const response = createRateLimitResponse(result, "Demasiadas peticiones");
      expect(response.status).toBe(429);
      expect(response.headers.get("Retry-After")).toBe("45");
      expect(response.headers.get("X-RateLimit-Limit")).toBe("10");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
      expect(response.headers.get("Content-Type")).toBe("application/json");

      const body = await response.json();
      expect(body.error).toBe("TOO_MANY_REQUESTS");
      expect(body.message).toBe("Demasiadas peticiones");
      expect(body.retryAfter).toBe(45);
    });
  });
});
