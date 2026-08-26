import { describe, it, expect } from "vitest";
import { getBusinessReviewsTraceability } from "../../src/lib/reviewsTraceability";

describe("Reviews Traceability & Social Proof Module", () => {
  it("provides verified reviews from Google Maps and TripAdvisor", () => {
    const elCaminoReviews = getBusinessReviewsTraceability("el-camino-palma");
    expect(elCaminoReviews).toBeDefined();
    expect(elCaminoReviews?.totalReviewCount).toBeGreaterThanOrEqual(100);
    expect(elCaminoReviews?.overallRating).toBeGreaterThanOrEqual(4.5);
    expect(elCaminoReviews?.topPositiveTags.length).toBeGreaterThan(0);
    expect(elCaminoReviews?.verifiedReviews.length).toBeGreaterThan(0);

    for (const review of elCaminoReviews!.verifiedReviews) {
      expect(review.id).toBeDefined();
      expect(review.authorName).toBeDefined();
      expect(review.rating).toBeGreaterThanOrEqual(1.0);
      expect(review.rating).toBeLessThanOrEqual(5.0);
      expect(review.source).toBeDefined();
      expect(review.sourceLabel.es).toBeDefined();
      expect(review.sourceLabel.de).toBeDefined();
      expect(review.text.es).toBeDefined();
      expect(review.text.de).toBeDefined();
      expect(review.verifiedCustomer).toBe(true);
    }
  });

  it("handles non-existent business gracefully", () => {
    const nonExistent = getBusinessReviewsTraceability("non-existent-business-xyz");
    expect(nonExistent).toBeUndefined();
  });
});
