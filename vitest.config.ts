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
        // Puerta de calidad v1.6 (31/08/2026): Cobertura de estrés 80 suites, 702 tests, cero datos falsos
        statements: 96,
        branches: 85,
        functions: 98,
        lines: 96,
      },
    },
  },
});
