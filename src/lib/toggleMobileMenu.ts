/**
 * Mobile Menu Toggle Module
 *
 * Shared logic for hamburger-menu toggling used by all navbar variants.
 * Eliminates duplicated click-handler code across NavbarPublic, NavbarUser,
 * NavbarCoach, and NavbarAdmin.
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
export function initMobileMenuToggle(
    toggleId: string,
    menuId: string,
): () => void {
    const toggleBtn = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);

    if (!toggleBtn || !menu) {
        // Silently skip when elements are not in the DOM (e.g. a different
        // navbar variant is mounted)
        return () => { };
    }

    // Narrow types for TS — after the guard both are guaranteed non-null
    const btn = toggleBtn;
    const el = menu;

    function onClick(): void {
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isExpanded));
        el.classList.toggle(MENU_ACTIVE_CLASS);
        btn.classList.toggle(MENU_ACTIVE_CLASS);
    }

    btn.addEventListener("click", onClick);

    return () => {
        btn.removeEventListener("click", onClick);
    };
}
