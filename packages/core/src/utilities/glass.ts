import type { UtilityRegistry } from "../engine/types.js";

/** Base glass surface + adaptive blur scale (blur and saturate move together). */
export const glassUtilities: UtilityRegistry = {
  static: {
    "lg-glass": [
      {
        declarations: `
          position: relative;
          background-color: rgb(var(--lg-tint) / var(--lg-tint-opacity));
          border: 1px solid rgb(var(--lg-tint) / var(--lg-border-opacity));
          border-radius: var(--lg-radius, 16px);
          box-shadow:
            0 1px 1px rgb(var(--lg-shadow-color) / 0.05),
            0 8px 24px rgb(var(--lg-shadow-color) / 0.12),
            inset 0 1px 0 rgb(255 255 255 / 0.25);
          backdrop-filter: blur(var(--lg-blur-md)) saturate(var(--lg-saturate-md));
          -webkit-backdrop-filter: blur(var(--lg-blur-md)) saturate(var(--lg-saturate-md));
        `,
      },
    ],
    "lg-blur-sm": [
      {
        declarations: `backdrop-filter: blur(var(--lg-blur-sm)) saturate(var(--lg-saturate-sm)); -webkit-backdrop-filter: blur(var(--lg-blur-sm)) saturate(var(--lg-saturate-sm));`,
      },
    ],
    "lg-blur-md": [
      {
        declarations: `backdrop-filter: blur(var(--lg-blur-md)) saturate(var(--lg-saturate-md)); -webkit-backdrop-filter: blur(var(--lg-blur-md)) saturate(var(--lg-saturate-md));`,
      },
    ],
    "lg-blur-lg": [
      {
        declarations: `backdrop-filter: blur(var(--lg-blur-lg)) saturate(var(--lg-saturate-lg)); -webkit-backdrop-filter: blur(var(--lg-blur-lg)) saturate(var(--lg-saturate-lg));`,
      },
    ],
    "lg-blur-xl": [
      {
        declarations: `backdrop-filter: blur(var(--lg-blur-xl)) saturate(var(--lg-saturate-xl)); -webkit-backdrop-filter: blur(var(--lg-blur-xl)) saturate(var(--lg-saturate-xl));`,
      },
    ],
  },
  dynamic: [],
};
