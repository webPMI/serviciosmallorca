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

  it("closes the menu on Escape key when menu is open", () => {
    const { toggle, menu } = appendToggleAndMenu("tgl", "mnu");
    initMobileMenuToggle("tgl", "mnu");

    // Open menu
    toggle.click();
    expect(menu.classList.contains("is-active")).toBe(true);

    // Press Escape
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(escapeEvent);

    expect(menu.classList.contains("is-active")).toBe(false);
    expect(toggle.classList.contains("is-active")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    // Pressing another key when open
    toggle.click();
    expect(menu.classList.contains("is-active")).toBe(true);
    const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
    document.dispatchEvent(enterEvent);
    expect(menu.classList.contains("is-active")).toBe(true);
  });

  it("closes menu when clicking an anchor or regular button inside the menu, but keeps open on theme toggle button", () => {
    const { toggle, menu } = appendToggleAndMenu("tgl", "mnu");

    const link = document.createElement("a");
    link.href = "/es/contacto";
    link.textContent = "Contacto";
    menu.appendChild(link);

    const normalBtn = document.createElement("button");
    normalBtn.textContent = "Action";
    menu.appendChild(normalBtn);

    const themeBtn = document.createElement("button");
    themeBtn.className = "theme-toggle-btn";
    themeBtn.textContent = "🌙";
    menu.appendChild(themeBtn);

    initMobileMenuToggle("tgl", "mnu");

    // Open menu
    toggle.click();
    expect(menu.classList.contains("is-active")).toBe(true);

    // Clicking theme toggle should NOT close menu
    themeBtn.click();
    expect(menu.classList.contains("is-active")).toBe(true);

    // Clicking link should close menu
    link.click();
    expect(menu.classList.contains("is-active")).toBe(false);

    // Reopen and test normal button click
    toggle.click();
    expect(menu.classList.contains("is-active")).toBe(true);
    normalBtn.click();
    expect(menu.classList.contains("is-active")).toBe(false);
  });
});
