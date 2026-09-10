import { describe, expect, it } from "vitest";
import { extractCandidates } from "../src/engine/extract.js";
import { generateCSS } from "../src/engine/generate.js";

describe("extractCandidates", () => {
  it("pulls only lg- prefixed tokens from markup", () => {
    const html = `<div class="lg-glass lg-blur-md hover:lg-shine-hover flex items-center">`;
    const candidates = extractCandidates(html);
    expect([...candidates].sort()).toEqual(["hover:lg-shine-hover", "lg-blur-md", "lg-glass"]);
  });
});

describe("generateCSS", () => {
  it("generates the base glass rule", () => {
    const css = generateCSS(["lg-glass"]);
    expect(css).toContain(".lg-glass {");
    expect(css).toContain("backdrop-filter");
  });

  it("resolves dynamic refraction classes", () => {
    const css = generateCSS(["lg-refract-3"]);
    expect(css).toContain(".lg-refract-3 {");
    expect(css).toContain("url(#lg-refract-3)");
  });

  it("wraps responsive variants in a media query", () => {
    const css = generateCSS(["md:lg-glass"]);
    expect(css).toContain("@media (min-width: 768px)");
    expect(css).toContain(".md\\:lg-glass {");
  });

  it("applies pseudo-class variants before pseudo-element suffixes", () => {
    const css = generateCSS(["hover:lg-sheen"]);
    expect(css).toContain(".hover\\:lg-sheen:hover::before {");
  });

  it("supports arbitrary sheen angle values", () => {
    const css = generateCSS(["lg-sheen-[0.25turn]"]);
    expect(css).toContain("linear-gradient(0.25turn,");
  });

  it("ignores unknown classes", () => {
    const css = generateCSS(["flex", "not-a-real-lg-class"]);
    expect(css).toBe("");
  });
});
