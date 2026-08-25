/**
 * RBAC Permission System
 *
 * Role-Based Access Control with granular, namespace-scoped permissions.
 * Each role has a set of permissions. Components and pages call `can()` to
 * gate access. Adding a new role or permission requires zero UI changes.
 *
 * Usage:
 *   import { can, type Permission } from "../lib/permissions";
 *   if (can(role, "manage:users")) { ... }
 */

import type { UserRole } from "./authStore";

// ---------------------------------------------------------------------------
// Permission namespace convention: "action:resource"
// ---------------------------------------------------------------------------
export const PERMISSIONS = {
  VIEW_PUBLIC: "view:public",
  VIEW_DASHBOARD: "view:dashboard",
  VIEW_PROFILE: "view:profile",
  EDIT_PROFILE: "edit:profile",
  VIEW_MANAGER_PANEL: "view:manager",
  MANAGE_CLIENTS: "manage:clients",
  VIEW_REPORTS: "view:reports",
  VIEW_ADMIN_PANEL: "view:admin",
  MANAGE_USERS: "manage:users",
  MANAGE_SETTINGS: "manage:settings",
  VIEW_ANALYTICS: "view:analytics",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ---------------------------------------------------------------------------
// Role → permission mapping (single source of truth)
// ---------------------------------------------------------------------------
const ROLE_PERMISSIONS: Readonly<Record<UserRole, ReadonlySet<string>>> = {
  guest: new Set<Permission>([PERMISSIONS.VIEW_PUBLIC]),

  user: new Set<Permission>([PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.VIEW_PROFILE, PERMISSIONS.EDIT_PROFILE]),

  manager: new Set<Permission>([
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_MANAGER_PANEL,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_REPORTS,
  ]),

  admin: new Set<Permission>([
    // Admin inherits everything — the wildcard
    PERMISSIONS.VIEW_PUBLIC,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_MANAGER_PANEL,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ADMIN_PANEL,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_ANALYTICS,
  ]),
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check whether a given role has a specific permission.
 * Returns `false` for unknown/guest roles by default.
 */
export function can(role: UserRole, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.has(permission);
}

/**
 * Check whether a role satisfies *all* of the given permissions.
 */
export function canAll(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => can(role, p));
}

/**
 * Check whether a role satisfies *any* of the given permissions.
 */
export function canAny(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => can(role, p));
}

/**
 * Return the set of permissions for a role (read-only, for introspection).
 */
export function getPermissionsForRole(role: UserRole): ReadonlySet<string> {
  return ROLE_PERMISSIONS[role] ?? new Set();
}
