import { describe, it, expect } from "vitest";
import type { ForumCategory, ForumTopic, ServiceReview } from "../../src/lib/community";

describe("Community & Reviews Module", () => {
  describe("Type Definitions & Validations", () => {
    it("validates ForumCategory types", () => {
      const validCategories: ForumCategory[] = ["todas", "recomendaciones", "preguntas", "experiencias", "guias"];
      expect(validCategories.length).toBe(5);
    });

    it("verifies ServiceReview data structure", () => {
      const mockReview: ServiceReview = {
        id: "rev-123",
        serviceId: "good-luck-tattoo-palma",
        authorUid: "user-abc",
        authorName: "Maria Garcia",
        authorAvatar: "🎨",
        rating: 5,
        comment: "Excelente experiencia, muy higiénico y profesional.",
        createdAt: "2026-08-25T10:00:00.000Z",
        helpfulCount: 3,
        helpfulUsers: ["user-1", "user-2", "user-3"],
      };

      expect(mockReview.rating).toBeGreaterThanOrEqual(1);
      expect(mockReview.rating).toBeLessThanOrEqual(5);
      expect(mockReview.helpfulCount).toBe(3);
      expect(mockReview.helpfulUsers.length).toBe(3);
    });

    it("verifies ForumTopic data structure and counters", () => {
      const mockTopic: ForumTopic = {
        id: "topic-456",
        slug: "mejores-estudios-tatuaje-palma",
        title: "¿Recomendaciones de tatuajes fine line en Palma?",
        content: "Hola a todos, busco un estudio para un diseño minimalista...",
        category: "preguntas",
        authorUid: "user-xyz",
        authorName: "Carlos R.",
        authorAvatar: "🌴",
        createdAt: "2026-08-25T11:00:00.000Z",
        repliesCount: 4,
        likesCount: 8,
        likedUsers: ["user-a", "user-b"],
      };

      expect(mockTopic.slug).toBeDefined();
      expect(mockTopic.category).toBe("preguntas");
      expect(mockTopic.repliesCount).toBeGreaterThanOrEqual(0);
      expect(mockTopic.likesCount).toBeGreaterThanOrEqual(0);
    });
  });
});
