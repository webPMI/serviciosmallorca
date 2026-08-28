/**
 * firestoreRulesStatic.test.ts
 *
 * 🛡️ ANÁLISIS ESTÁTICO DE FIRESTORE SECURITY RULES (GR-13 / SECURITY.md §2)
 *
 * Sin emulador (no requiere Java/Firebase CLI), verifica en CI que las invariantes
 * críticas de firestore.rules siguen presentes tras cualquier edición:
 *  1. rules_version 2 + fallback global deny-all.
 *  2. Inmutabilidad de rol y email en users/{uid}; create fuerza role 'user'.
 *  3. photoURL solo https:// o null; límites de longitud por campo.
 *  4. Escrituras de servicios reservadas a manager/admin.
 *  5. Aislamiento por UID (claims/submissions/deletion), ratings acotados [1..5].
 *  6. Bids del Cuadro de Honor ≥ 1.00 €; foro anclado a authorUid.
 *  7. Prohibición total de escrituras públicas (write: if true).
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RULES_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "firestore.rules");
const RULES = readFileSync(RULES_PATH, "utf8");

describe("🛡️ Firestore Security Rules — invariantes críticas (GR-13)", () => {
  it("usa rules_version 2 y declara el fallback global deny-all", () => {
    expect(RULES).toContain("rules_version = '2'");
    expect(RULES).toMatch(/match\s+\/\{document=\*\*\}\s*\{[\s\S]*allow\s+read,\s*write:\s*if\s+false/);
  });

  it("users: inmutabilidad de rol y email; el registro fuerza role 'user'", () => {
    expect(RULES).toContain("request.resource.data.role == resource.data.role");
    expect(RULES).toContain("request.resource.data.role == 'user'");
    expect(RULES).toContain("request.resource.data.email == resource.data.email");
  });

  it("users: photoURL solo https:// o null; límites displayName 120 y email 254", () => {
    expect(RULES).toContain("val.matches('https://.*')");
    expect(RULES).toMatch(/withinLength\(request\.resource\.data\.displayName,\s*120\)/);
    expect(RULES).toMatch(/withinLength\(request\.resource\.data\.email,\s*254\)/);
  });

  it("borrado de usuarios exclusivo de admin; helper de roles presente", () => {
    expect(RULES).toMatch(/allow delete: if isSignedIn\(\) && getUserRole\(\) == 'admin';/);
    expect(RULES).toContain("function getUserRole()");
  });

  it("services: escritura reservada a manager/admin (lectura pública OK)", () => {
    const block = RULES.match(/match \/services\/\{serviceId\}\s*\{[\s\S]*?\n    \}/);
    expect(block).toBeTruthy();
    expect(block?.[0]).toContain("getUserRole() == 'manager'");
    expect(block?.[0]).toContain("getUserRole() == 'admin'");
  });

  it("aislamiento por UID en solicitudes (applicantUid == request.auth.uid)", () => {
    expect(RULES).toMatch(/applicantUid\s*==\s*request\.auth\.uid/);
    expect(RULES).toMatch(/withinLength\([^)]*2000\)/); // verificationProof ≤ 2000
    expect(RULES).toMatch(/withinLength\([^)]*5000\)/); // description ≤ 5000
  });

  it("reseñas: rating acotado [1..5] y autoría anclada al usuario autenticado", () => {
    expect(RULES).toMatch(/rating\s*>=\s*1/);
    expect(RULES).toMatch(/rating\s*<=\s*5/);
    expect(RULES).toMatch(/authorUid\s*==\s*request\.auth\.uid/);
  });

  it("Cuadro de Honor: bid numérica ≥ 1.00 € y edición solo admin", () => {
    expect(RULES).toMatch(/bidAmount is number/);
    expect(RULES).toMatch(/bidAmount\s*>=\s*1\.0/);
    const block = RULES.match(/match \/honor_nominations\/\{nominationId\}\s*\{[\s\S]*?\n    \}/);
    expect(block?.[0]).toContain("getUserRole() == 'admin'");
  });

  it("foro: creación anclada a authorUid y límites de longitud en contenido", () => {
    expect(RULES).toMatch(/match \/forum_topics\/\{topicId\}\s*\{[\s\S]*?authorUid\s*==\s*request\.auth\.uid/);
    expect(RULES).toMatch(/withinLength\([^)]*10000\)/);
  });

  it("prohibición total de escrituras públicas (nunca 'write: if true')", () => {
    expect(RULES).not.toMatch(/write:\s*if\s+true/i);
  });
});
