/**
 * tests/unit/responsiveBreakpoints.test.ts
 *
 * 🧪 SUITE DE PRUEBAS DE RESPONSIVIDAD Y BREAKPOINTS (GR-02)
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("📱 RESPONSIVE DESIGN & MOBILE VIEWPORTS (GR-02)", () => {
  const globalCss = fs.readFileSync(path.resolve(process.cwd(), "src/styles/global.css"), "utf-8");
  const cuadroHonorAstro = fs.readFileSync(
    path.resolve(process.cwd(), "src/pages/[...locale]/cuadro-de-honor.astro"),
    "utf-8",
  );
  const uneteAstro = fs.readFileSync(path.resolve(process.cwd(), "src/pages/[...locale]/unete.astro"), "utf-8");
  const memoriaAstro = fs.readFileSync(
    path.resolve(process.cwd(), "src/pages/[...locale]/memoria-historica.astro"),
    "utf-8",
  );
  const favoritosAstro = fs.readFileSync(path.resolve(process.cwd(), "src/pages/[...locale]/favoritos.astro"), "utf-8");
  const matrixAstro = fs.readFileSync(path.resolve(process.cwd(), "src/components/ComparisonMatrix.astro"), "utf-8");

  it("debe definir .services-grid y .grid-auto con fluid minmax en global.css", () => {
    expect(globalCss).toContain(".services-grid");
    expect(globalCss).toContain("minmax(min(100%");
    expect(globalCss).toContain(".grid-auto");
  });

  it("debe garantizar grid fluido y media queries móviles en cuadro-de-honor.astro", () => {
    expect(cuadroHonorAstro).toContain("minmax(min(100%, 290px), 1fr)");
    expect(cuadroHonorAstro).toContain("@media (max-width: 768px)");
    expect(cuadroHonorAstro).toContain("@media (max-width: 480px)");
  });

  it("debe incluir media queries completas (992px, 640px, 480px) en unete.astro", () => {
    expect(uneteAstro).toContain("@media (max-width: 992px)");
    expect(uneteAstro).toContain("@media (max-width: 640px)");
    expect(uneteAstro).toContain("@media (max-width: 480px)");
    expect(uneteAstro).toContain(".hero-cta-group");
  });

  it("debe usar minmax móvil seguro para stats y cards en memoria-historica.astro", () => {
    expect(memoriaAstro).toContain("minmax(min(100%, 150px), 1fr)");
    expect(memoriaAstro).toContain("minmax(min(100%, 280px), 1fr)");
  });

  it("debe contener estilos responsivos dedicados para favoritos.astro", () => {
    expect(favoritosAstro).toContain(".service-card");
    expect(favoritosAstro).toContain("@media (max-width: 640px)");
  });

  it("debe tener layout fluido y adaptativo para la matriz comparativa", () => {
    expect(matrixAstro).toContain("minmax(min(100%, 280px), 1fr)");
    expect(matrixAstro).toContain("@media (max-width: 480px)");
  });
});
