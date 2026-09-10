#!/usr/bin/env node
// Generates the LiquidCSS SVG displacement-filter sprite from fixed presets.
// Re-run with `pnpm --filter liquidcss gen:filters` after tuning presets below.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "assets");
const outFile = join(outDir, "liquidcss-filters.svg");

/** Refraction presets: baseFrequency drives the turbulence "grain", scale drives displacement strength. */
const refractPresets = [
  { id: "lg-refract-1", baseFrequency: "0.012 0.018", numOctaves: 2, scale: 6, seed: 7 },
  { id: "lg-refract-2", baseFrequency: "0.010 0.016", numOctaves: 2, scale: 12, seed: 7 },
  { id: "lg-refract-3", baseFrequency: "0.008 0.014", numOctaves: 3, scale: 20, seed: 7 },
  { id: "lg-refract-4", baseFrequency: "0.006 0.011", numOctaves: 3, scale: 32, seed: 7 },
  { id: "lg-refract-5", baseFrequency: "0.004 0.009", numOctaves: 4, scale: 48, seed: 7 },
];

const specialPresets = [
  // Lens: low-frequency turbulence, edge-weighted via larger scale = "magnifying glass" bulge.
  { id: "lg-lens", baseFrequency: "0.004 0.004", numOctaves: 2, scale: 60, seed: 3 },
  // Wave: stretched frequency on one axis for a horizontal liquid ripple.
  { id: "lg-wave", baseFrequency: "0.002 0.02", numOctaves: 2, scale: 28, seed: 11 },
];

function filterMarkup({ id, baseFrequency, numOctaves, scale, seed }) {
  return `  <filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="${numOctaves}" seed="${seed}" result="lg-noise" />
    <feGaussianBlur in="lg-noise" stdDeviation="1.5" result="lg-noise-smooth" />
    <feDisplacementMap in="SourceGraphic" in2="lg-noise-smooth" scale="${scale}" xChannelSelector="R" yChannelSelector="G" />
  </filter>`;
}

const filters = [...refractPresets, ...specialPresets].map(filterMarkup).join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <!-- LiquidCSS refraction filters — include this sprite once per page, utilities reference it via filter: url(#id) -->
  <defs>
${filters}
  </defs>
</svg>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, svg, "utf8");
console.log(`LiquidCSS: wrote ${outFile}`);
