/**
 * Mobile Menu Toggle Module
 *
 * Shared logic for hamburger-menu toggling used by all navbar variants.
 * Eliminates duplicated click-handler code across NavbarPublic, NavbarUser,
 * NavbarManager, and NavbarAdmin.
 *
 * Usage:
 *   import { initMobileMenuToggle } from "../lib/toggleMobileMenu";
 *   initMobileMenuToggle("public-menu-toggle", "public-navbar-menu");
 */

const MENU_ACTIVE_CLASS = "is-active";

/**
 * Bind a hamburger toggle element to its corresponding menu element.
 * Handles `aria-expanded`, toggles `.is-active` on both the toggle and menu,
 * and returns a cleanup function.
 */
export function initMobileMenuToggle(toggleId: string, menuId: string): () => void {
  const toggleBtn = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);

  if (!toggleBtn || !menu) {
    // Silently skip when elements are not in the DOM (e.g. a different
    // navbar variant is mounted)
    return () => {};
  }

  // Narrow types for TS — after the guard both are guaranteed non-null
  const btn = toggleBtn;
  const el = menu;

  function closeMenu(): void {
    btn.setAttribute("aria-expanded", "false");
    el.classList.remove(MENU_ACTIVE_CLASS);
    btn.classList.remove(MENU_ACTIVE_CLASS);
  }

  function onClick(): void {
    const isExpanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!isExpanded));
    el.classList.toggle(MENU_ACTIVE_CLASS);
    btn.classList.toggle(MENU_ACTIVE_CLASS);
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape" && el.classList.contains(MENU_ACTIVE_CLASS)) {
      closeMenu();
    }
  }

  function onMenuClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (target && target.closest("a, button:not(.theme-toggle-btn)")) {
      closeMenu();
    }
  }

  btn.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);
  el.addEventListener("click", onMenuClick);

  return () => {
    btn.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKeyDown);
    el.removeEventListener("click", onMenuClick);
  };
}
