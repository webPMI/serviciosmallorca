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
        // Puerta de calidad v1.2 (ronda 2 · scrapers): real ~91L/76B/92F/91S.
        // Por debajo de lo alcanzado para dar margen de refactor seguro.
        statements: 87,
        branches: 72,
        functions: 89,
        lines: 87,
      },
    },
  },
});
