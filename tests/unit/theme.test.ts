import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Global Theme System", () => {
  const globalCssPath = path.resolve(process.cwd(), "src/styles/global.css");
  const cssContent = fs.readFileSync(globalCssPath, "utf-8");

  it("contains :root CSS custom properties", () => {
    expect(cssContent).toContain(":root");
    expect(cssContent).toContain("--color-primary");
    expect(cssContent).toContain("--color-bg");
    expect(cssContent).toContain("--color-text");
    expect(cssContent).toContain("--font-family");
  });

  it('contains dark theme data attribute selector [data-theme="dark"]', () => {
    expect(cssContent).toContain('[data-theme="dark"]');
  });

  it("contains enhanced contrast golden theme selectors and tokens", () => {
    expect(cssContent).toContain('[data-theme="golden"]');
    expect(cssContent).toContain('[data-theme="golden-dark"]');
    expect(cssContent).toContain("--color-primary: #7a5808;");
    expect(cssContent).toContain("--color-text: #180d05;");
    expect(cssContent).toContain("--color-primary: #e6b325;");
    expect(cssContent).toContain("--color-text: #fdfaf4;");
    expect(cssContent).toContain("--color-btn-primary-text: #180d05;");
  });

  it("includes core glassmorphism and layout utility classes with dynamic button text contrast", () => {
    expect(cssContent).toContain(".card-glass");
    expect(cssContent).toContain(".btn-primary");
    expect(cssContent).toContain("color: var(--color-btn-primary-text");
    expect(cssContent).toContain(".btn-secondary");
    expect(cssContent).toContain(".badge");
    expect(cssContent).toContain(".grid-auto");
  });
});
