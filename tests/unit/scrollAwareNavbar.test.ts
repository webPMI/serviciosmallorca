/**
 * Tests for scroll-aware navbar module.
 *
 * Uses happy-dom to simulate a browser environment so we can exercise
 * scroll-triggered class toggling on real DOM elements.
 *
 * @vitest-environment happy-dom
 */
import { describe, it, expect, afterEach, beforeAll } from "vitest";
import { initScrollAwareNavbar } from "../../src/lib/scrollAwareNavbar";

/**
 * Minimal scrolling helper: go from 0 → targetY a frames de 16ms
 * para que cada "frame" procese un rAF tick.
 */
async function scrollTo(y: number): Promise<void> {
  window.scrollY = y;
  window.dispatchEvent(new Event("scroll"));
  // Wait two animation frames: one for the event handler, one for rAF
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}

describe("initScrollAwareNavbar", () => {
  // ------------------------------------------------------------------
  // Setup: create two .navbar-header elements (simulating public + auth navbars)
  // ------------------------------------------------------------------
  beforeAll(() => {
    // Reset scroll position
    window.scrollY = 0;
  });

  afterEach(() => {
    // Clean up any navbar elements left from previous tests
    document.body.innerHTML = "";
  });

  function appendNavbar(id: string): HTMLElement {
    const el = document.createElement("header");
    el.className = "navbar-header";
    el.id = id;
    document.body.appendChild(el);
    return el;
  }

  it("adds navbar-hidden class when scrolling down past threshold", async () => {
    const navbar = appendNavbar("test-nav");
    initScrollAwareNavbar({ threshold: 20, tolerance: 5 });

    // Scroll past threshold going down
    await scrollTo(30);
    expect(navbar.classList.contains("navbar-hidden")).toBe(true);
  });

  it("removes navbar-hidden class when scrolling back up", async () => {
    const navbar = appendNavbar("test-nav");
    initScrollAwareNavbar({ threshold: 20, tolerance: 5 });

    // Scroll down → hidden
    await scrollTo(80);
    expect(navbar.classList.contains("navbar-hidden")).toBe(true);

    // Scroll up (direction change) → visible again
    await scrollTo(40);
    expect(navbar.classList.contains("navbar-hidden")).toBe(false);
  });

  it("keeps navbar visible when above threshold (top of page)", async () => {
    const navbar = appendNavbar("test-nav");
    initScrollAwareNavbar({ threshold: 50, tolerance: 5 });

    // Scroll a bit but stay under threshold
    await scrollTo(30);
    expect(navbar.classList.contains("navbar-hidden")).toBe(false);

    // Scroll to top
    await scrollTo(0);
    expect(navbar.classList.contains("navbar-hidden")).toBe(false);
  });

  it("forces navbar visible when scrolling back to very top even after being hidden", async () => {
    const navbar = appendNavbar("test-nav");
    initScrollAwareNavbar({ threshold: 30, tolerance: 5 });

    // Hide it
    await scrollTo(100);
    expect(navbar.classList.contains("navbar-hidden")).toBe(true);

    // Go to top — must be visible
    await scrollTo(0);
    expect(navbar.classList.contains("navbar-hidden")).toBe(false);
  });

  it("does not hide navbar when a mobile menu is open", async () => {
    const navbar = appendNavbar("test-nav");

    // Simulate an open mobile menu
    const menuEl = document.createElement("div");
    menuEl.className = "navbar-menu is-active";
    document.body.appendChild(menuEl);

    initScrollAwareNavbar({ threshold: 20, tolerance: 5 });

    // Scroll down — menu open, should NOT hide
    await scrollTo(80);
    expect(navbar.classList.contains("navbar-hidden")).toBe(false);

    // Close menu
    menuEl.classList.remove("is-active");

    // Now scroll up then down to trigger direction change
    await scrollTo(60); // direction up
    await scrollTo(90); // direction down — menu closed, should hide
    expect(navbar.classList.contains("navbar-hidden")).toBe(true);
  });

  it("ignores tiny scroll deltas below tolerance", async () => {
    const navbar = appendNavbar("test-nav");
    initScrollAwareNavbar({ threshold: 20, tolerance: 10 });

    // Move just 3px down — should be ignored
    await scrollTo(3);
    // We haven't crossed threshold either, so still visible
    expect(navbar.classList.contains("navbar-hidden")).toBe(false);

    // Now a real scroll down past threshold
    await scrollTo(50);
    expect(navbar.classList.contains("navbar-hidden")).toBe(true);
  });

  it("works with multiple navbar elements simultaneously", async () => {
    const nav1 = appendNavbar("nav-1");
    const nav2 = appendNavbar("nav-2");

    initScrollAwareNavbar({ threshold: 20, tolerance: 5 });

    await scrollTo(100);
    expect(nav1.classList.contains("navbar-hidden")).toBe(true);
    expect(nav2.classList.contains("navbar-hidden")).toBe(true);

    // Scroll up — both should reappear
    await scrollTo(40);
    expect(nav1.classList.contains("navbar-hidden")).toBe(false);
    expect(nav2.classList.contains("navbar-hidden")).toBe(false);
  });

  it("returns a cleanup function that removes the scroll listener", async () => {
    const navbar = appendNavbar("test-nav");
    const cleanup = initScrollAwareNavbar({ threshold: 20, tolerance: 5 });

    cleanup();

    // After cleanup, scrolling should not add the hidden class
    await scrollTo(100);
    expect(navbar.classList.contains("navbar-hidden")).toBe(false);
  });
});
