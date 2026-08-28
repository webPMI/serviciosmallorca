import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
    coverage: {
      // Medimos la capa de lógica pura y shared code del frontend
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/lib/**", "src/data/categories.ts", "src/data/zones.ts", "src/data/tags.ts", "src/i18n/**"],
      // Infraestructura externa no cubrible sin entorno Firebase real
      exclude: ["src/lib/firebase.ts", "src/lib/initAuthNavbar.ts"],
      thresholds: {
        // Puerta de calidad v1.3 (28/08/2026): campaña de cobertura telemetry/d1Logger/
        // validateServices. Anterior: 87/72/89/87 (real ~92.2L/77.5B/92.3F).
        statements: 90,
        branches: 75,
        functions: 90,
        lines: 90,
      },
    },
  },
});
