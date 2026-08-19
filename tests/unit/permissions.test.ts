/**
 * Tests for the RBAC permission system.
 */
import { describe, it, expect } from "vitest";
import {
    can,
    canAll,
    canAny,
    getPermissionsForRole,
    PERMISSIONS,
} from "../../src/lib/permissions";

describe("RBAC Permission System", () => {
    describe("can()", () => {
        it("guest has only VIEW_PUBLIC", () => {
            expect(can("guest", PERMISSIONS.VIEW_PUBLIC)).toBe(true);
            expect(can("guest", PERMISSIONS.VIEW_DASHBOARD)).toBe(false);
            expect(can("guest", PERMISSIONS.MANAGE_USERS)).toBe(false);
        });

        it("user has dashboard, profile, edit_profile", () => {
            expect(can("user", PERMISSIONS.VIEW_DASHBOARD)).toBe(true);
            expect(can("user", PERMISSIONS.VIEW_PROFILE)).toBe(true);
            expect(can("user", PERMISSIONS.EDIT_PROFILE)).toBe(true);
            expect(can("user", PERMISSIONS.MANAGE_USERS)).toBe(false);
        });

        it("manager inherits user + manager-specific permissions", () => {
            expect(can("manager", PERMISSIONS.VIEW_DASHBOARD)).toBe(true);
            expect(can("manager", PERMISSIONS.VIEW_MANAGER_PANEL)).toBe(true);
            expect(can("manager", PERMISSIONS.MANAGE_CLIENTS)).toBe(true);
            expect(can("manager", PERMISSIONS.VIEW_REPORTS)).toBe(true);
            expect(can("manager", PERMISSIONS.VIEW_ADMIN_PANEL)).toBe(false);
            expect(can("manager", PERMISSIONS.MANAGE_USERS)).toBe(false);
        });

        it("admin has all permissions", () => {
            const allPerms = Object.values(PERMISSIONS);
            for (const perm of allPerms) {
                expect(can("admin", perm)).toBe(true);
            }
        });

        it("returns false for unknown roles", () => {
            expect(can("unknown_role" as any, PERMISSIONS.VIEW_DASHBOARD)).toBe(
                false,
            );
        });
    });

    describe("canAll()", () => {
        it("returns true when all permissions are satisfied", () => {
            expect(
                canAll("user", [
                    PERMISSIONS.VIEW_DASHBOARD,
                    PERMISSIONS.VIEW_PROFILE,
                ]),
            ).toBe(true);
        });

        it("returns false when at least one is missing", () => {
            expect(
                canAll("user", [
                    PERMISSIONS.VIEW_DASHBOARD,
                    PERMISSIONS.MANAGE_USERS,
                ]),
            ).toBe(false);
        });
    });

    describe("canAny()", () => {
        it("returns true when at least one permission matches", () => {
            expect(
                canAny("guest", [PERMISSIONS.VIEW_PUBLIC, PERMISSIONS.MANAGE_USERS]),
            ).toBe(true);
        });

        it("returns false when none match", () => {
            expect(
                canAny("guest", [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.MANAGE_USERS]),
            ).toBe(false);
        });
    });

    describe("getPermissionsForRole()", () => {
        it("returns a non-empty set for known roles", () => {
            const perms = getPermissionsForRole("user");
            expect(perms.size).toBeGreaterThan(0);
        });

        it("admin has more permissions than user", () => {
            const userPerms = getPermissionsForRole("user");
            const adminPerms = getPermissionsForRole("admin");
            expect(adminPerms.size).toBeGreaterThan(userPerms.size);
        });

        it("returns empty set for unknown roles", () => {
            const perms = getPermissionsForRole("unknown_role" as any);
            expect(perms.size).toBe(0);
        });
    });
});