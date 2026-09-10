import type { UtilityRegistry } from "../engine/types.js";

/**
 * Edge refraction: combines the adaptive blur with an SVG feDisplacementMap filter
 * (see assets/liquidcss-filters.svg). Browsers that don't render displacement filters
 * on backdrop content (older Firefox/Safari) gracefully degrade to blur-only — no
 * crash, just a flatter edge — since `filter: url(#missing)` is a no-op there.
 */
const REFRACT_RE = /^lg-refract-([1-5])$/;

function refractDeclarations(level: string) {
  return `
    backdrop-filter: blur(var(--lg-blur-md)) saturate(var(--lg-saturate-md)) url(#lg-refract-${level});
    -webkit-backdrop-filter: blur(var(--lg-blur-md)) saturate(var(--lg-saturate-md));
    filter: url(#lg-refract-${level});
  `;
}

export const refractUtilities: UtilityRegistry = {
  static: {
    "lg-lens": [
      {
        declarations: `
          backdrop-filter: blur(var(--lg-blur-lg)) saturate(var(--lg-saturate-lg)) url(#lg-lens);
          -webkit-backdrop-filter: blur(var(--lg-blur-lg)) saturate(var(--lg-saturate-lg));
          filter: url(#lg-lens);
        `,
      },
    ],
    "lg-wave": [
      {
        declarations: `
          backdrop-filter: blur(var(--lg-blur-md)) saturate(var(--lg-saturate-md)) url(#lg-wave);
          -webkit-backdrop-filter: blur(var(--lg-blur-md)) saturate(var(--lg-saturate-md));
          filter: url(#lg-wave);
        `,
      },
    ],
  },
  dynamic: [
    {
      resolve(className) {
        const match = REFRACT_RE.exec(className);
        if (!match) return null;
        return { className, blocks: [{ declarations: refractDeclarations(match[1]) }] };
      },
    },
  ],
};
