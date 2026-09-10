import type { UtilityRegistry } from "../engine/types.js";

/** Centered ripple pulse on `:active` (pure CSS). For a ripple that starts at the
 * click point, use the optional `@liquidcss/interactions` `data-lg-ripple` enhancer. */
export const rippleUtilities: UtilityRegistry = {
  static: {
    "lg-ripple": [
      { declarations: `position: relative; overflow: hidden;` },
      {
        declarations: `
          content: "";
          position: absolute;
          inset: 0;
          margin: auto;
          width: 0;
          height: 0;
          border-radius: 999px;
          background: radial-gradient(circle, rgb(var(--lg-ripple-color) / 0.5) 0%, transparent 70%);
          opacity: 0;
          pointer-events: none;
          transition: width var(--lg-ripple-duration) ease, height var(--lg-ripple-duration) ease, opacity var(--lg-ripple-duration) ease;
        `,
        selectorSuffix: "::after",
      },
      {
        declarations: `width: 200%; height: 200%; opacity: 1; transition-duration: 0ms;`,
        selectorSuffix: ":active::after",
      },
    ],
  },
  dynamic: [],
};
