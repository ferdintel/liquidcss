import type { UtilityRegistry } from "../engine/types.js";

/**
 * CSS-only hover shine (sweeps the sheen layer on :hover) and a static tilt
 * (perspective + rotation) — no cursor tracking here, that needs the optional
 * `@ferdintel/liquidcss-interactions` package for a real mouse-following highlight.
 */
export const shineUtilities: UtilityRegistry = {
  static: {
    "lg-shine-hover": [
      { declarations: `position: relative; overflow: hidden;` },
      {
        declarations: `
          content: "";
          position: absolute;
          inset: -60% -20%;
          background: linear-gradient(var(--lg-sheen-angle), transparent 42%, rgb(var(--lg-sheen-color) / var(--lg-sheen-opacity)) 50%, transparent 58%);
          transform: translateX(-30%);
          mix-blend-mode: overlay;
          pointer-events: none;
          transition: transform var(--lg-shine-duration) ease;
        `,
        selectorSuffix: "::before",
      },
      {
        declarations: `transform: translateX(30%);`,
        selectorSuffix: ":hover::before",
      },
    ],
    "lg-tilt": [
      {
        declarations: `
          transition: transform var(--lg-shine-duration) ease;
          transform-style: preserve-3d;
          will-change: transform;
        `,
      },
      {
        declarations: `transform: perspective(var(--lg-tilt-perspective)) rotateX(var(--lg-tilt-rotate)) rotateY(var(--lg-tilt-rotate));`,
        selectorSuffix: ":hover",
      },
    ],
  },
  dynamic: [],
};
