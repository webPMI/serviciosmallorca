/**
 * Auth Navbar Initializer
 *
 * Shared logic for all authenticated navbar variants (User, Manager, Admin).
 * Handles:
 *   1. Binding the user name & avatar to authStore
 *   2. Binding the logout button
 *
 * Eliminates ~20 duplicated lines per navbar variant.
 *
 * Usage:
 *   import { initAuthNavbar } from "../lib/initAuthNavbar";
 *   initAuthNavbar("user");
 */

import { authStore } from "./authStore";

type RolePrefix = "user" | "manager" | "admin";

const ROLE_FALLBACK: Record<RolePrefix, string> = {
    user: "Atleta",
    manager: "Manager",
    admin: "Admin",
};

export function initAuthNavbar(prefix: RolePrefix): void {
    const userNameEl = document.getElementById(`${prefix}-nav-name`);
    const userAvatarEl = document.getElementById(`${prefix}-nav-avatar`);
    const logoutBtn = document.getElementById(`${prefix}-logout-btn`);

    // 1. Reactive user info
    authStore.subscribe(({ user }) => {
        if (!user) return;

        if (userNameEl) {
            userNameEl.textContent =
                user.displayName ||
                user.email?.split("@")[0] ||
                ROLE_FALLBACK[prefix];
        }

        if (userAvatarEl && user.photoURL) {
            userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="Avatar" class="avatar-img" />`;
        }
    });

    // 2. Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await authStore.logout();
            window.location.href = "./";
        });
    }
}