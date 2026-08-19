/**
 * Scroll-Aware Navbar Module
 *
 * Hides the navbar on scroll down, shows it on scroll up — with
 * smooth, performant animations. Designed to work with any element
 * matching the given CSS selector.
 *
 * Features:
 *   - rAF-driven logic for 60fps performance
 *   - Cached DOM references (no re-query on each tick)
 *   - Ignores mobile menu: skips hide when a .navbar-menu is open
 *   - Always visible at the top of the page
 *
 * Usage:
 *   import { initScrollAwareNavbar } from "../lib/scrollAwareNavbar";
 *   const cleanup = initScrollAwareNavbar();
 *   // call cleanup() to destroy the listener
 */

export interface ScrollAwareOptions {
    /** Minimum pixels scrolled before the hide logic activates (default 80) */
    threshold?: number;
    /** Minimum delta (px) between frames to consider a direction change (default 10) */
    tolerance?: number;
    /** CSS selector targeting the navbar container elements (default '.navbar-header') */
    selector?: string;
    /** CSS class added to hide the navbar (default 'navbar-hidden') */
    hiddenClass?: string;
    /** Selector for mobile menus that block scroll-hide (default '.navbar-menu.is-active') */
    mobileMenuSelector?: string;
}

export function initScrollAwareNavbar(
    options: ScrollAwareOptions = {},
): () => void {
    const {
        threshold = 80,
        tolerance = 10,
        selector = ".navbar-header",
        hiddenClass = "navbar-hidden",
        mobileMenuSelector = ".navbar-menu.is-active",
    } = options;

    // Cache DOM references at init time so we never re-query on scroll ticks
    const navbars: HTMLElement[] = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
    );

    if (navbars.length === 0) {
        // No matching elements — nothing to do
        return () => { };
    }

    let lastScrollY = window.scrollY;
    let direction: "up" | "down" = "up";
    let ticking = false;

    /** Returns true if any mobile menu is currently expanded (open). */
    function isMobileMenuOpen(): boolean {
        return document.querySelector(mobileMenuSelector) !== null;
    }

    function update(): void {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;

        // Always show when at the very top of the page
        if (currentScrollY <= threshold) {
            for (const navbar of navbars) {
                navbar.classList.remove(hiddenClass);
            }
            direction = "up";
            lastScrollY = currentScrollY;
            ticking = false;
            return;
        }

        // Ignore tiny scroll deltas to prevent flickering
        if (Math.abs(delta) < tolerance) {
            ticking = false;
            return;
        }

        const newDirection: "up" | "down" = delta > 0 ? "down" : "up";

        // Only act when direction changes (avoids redundant DOM writes)
        if (newDirection !== direction) {
            direction = newDirection;

            for (const navbar of navbars) {
                if (direction === "down") {
                    // Never hide while a mobile menu is open
                    if (!isMobileMenuOpen()) {
                        navbar.classList.add(hiddenClass);
                    }
                } else {
                    navbar.classList.remove(hiddenClass);
                }
            }
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function onScroll(): void {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // Return a cleanup function so callers can tear down the listener
    return () => {
        window.removeEventListener("scroll", onScroll);
    };
}
