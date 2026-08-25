/**
 * Tests for the mobile menu toggle module.
 *
 * @vitest-environment happy-dom
 */
import { describe, it, expect, afterEach } from "vitest";
import { initMobileMenuToggle } from "../../src/lib/toggleMobileMenu";

describe("initMobileMenuToggle", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  function appendToggleAndMenu(toggleId: string, menuId: string): { toggle: HTMLElement; menu: HTMLElement } {
    const toggle = document.createElement("button");
    toggle.id = toggleId;
    toggle.setAttribute("aria-expanded", "false");
    document.body.appendChild(toggle);

    const menu = document.createElement("div");
    menu.id = menuId;
    document.body.appendChild(menu);

    return { toggle, menu };
  }

  it("toggles is-active on both toggle and menu when clicked", () => {
    const { toggle, menu } = appendToggleAndMenu("tgl", "mnu");
    initMobileMenuToggle("tgl", "mnu");

    // First click — open
    toggle.click();
    expect(menu.classList.contains("is-active")).toBe(true);
    expect(toggle.classList.contains("is-active")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    // Second click — close
    toggle.click();
    expect(menu.classList.contains("is-active")).toBe(false);
    expect(toggle.classList.contains("is-active")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("syncs aria-expanded with toggle state", () => {
    const { toggle } = appendToggleAndMenu("tgl", "mnu");
    initMobileMenuToggle("tgl", "mnu");

    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("returns a no-op cleanup when elements are missing", () => {
    const cleanup = initMobileMenuToggle("nonexistent", "nope");
    expect(() => cleanup()).not.toThrow();
  });

  it("returns a cleanup function that removes the click listener", () => {
    const { toggle, menu } = appendToggleAndMenu("tgl", "mnu");
    const cleanup = initMobileMenuToggle("tgl", "mnu");

    cleanup();

    // Click after cleanup — should do nothing
    toggle.click();
    expect(menu.classList.contains("is-active")).toBe(false);
    expect(toggle.classList.contains("is-active")).toBe(false);
  });

  it("handles rapid repeated clicks without breaking state", () => {
    const { toggle, menu } = appendToggleAndMenu("tgl", "mnu");
    initMobileMenuToggle("tgl", "mnu");

    toggle.click(); // open
    toggle.click(); // close
    toggle.click(); // open again

    expect(menu.classList.contains("is-active")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });
});
