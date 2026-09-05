import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 25000,
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
        // Puerta de calidad v1.7 (31/08/2026): Cobertura masiva 81 suites, 709 tests, cero datos falsos
        statements: 97,
        branches: 86,
        functions: 98,
        lines: 97,
      },
    },
  },
});
