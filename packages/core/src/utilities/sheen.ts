import type { UtilityRegistry } from "../engine/types.js";

/** Angle-gradient reflections rendered as a pure-CSS `::before` layer, no extra markup needed. */
const SHEEN_ANGLE_RE = /^lg-sheen-(\d{1,3})$/;
/** Tailwind-style arbitrary value, e.g. lg-sheen-[45deg] or lg-sheen-[0.25turn] (underscores become spaces). */
const SHEEN_ARBITRARY_RE = /^lg-sheen-\[(.+)\]$/;

function sheenBeforeDeclarations(angle: string) {
  return `
    content: "";
    position: absolute;
    inset: -60% -20%;
    background: linear-gradient(${angle}, transparent 42%, rgb(var(--lg-sheen-color) / var(--lg-sheen-opacity)) 50%, transparent 58%);
    mix-blend-mode: overlay;
    pointer-events: none;
    transition: transform var(--lg-shine-duration) ease;
  `;
}

export const sheenUtilities: UtilityRegistry = {
  static: {
    "lg-sheen": [
      { declarations: `position: relative; overflow: hidden;` },
      { declarations: sheenBeforeDeclarations("var(--lg-sheen-angle)"), selectorSuffix: "::before" },
    ],
  },
  dynamic: [
    {
      resolve(className) {
        const match = SHEEN_ANGLE_RE.exec(className);
        if (!match) return null;
        return {
          className,
          blocks: [
            { declarations: `position: relative; overflow: hidden;` },
            { declarations: sheenBeforeDeclarations(`${match[1]}deg`), selectorSuffix: "::before" },
          ],
        };
      },
    },
    {
      resolve(className) {
        const match = SHEEN_ARBITRARY_RE.exec(className);
        if (!match) return null;
        const value = match[1].replace(/_/g, " ");
        return {
          className,
          blocks: [
            { declarations: `position: relative; overflow: hidden;` },
            { declarations: sheenBeforeDeclarations(value), selectorSuffix: "::before" },
          ],
        };
      },
    },
  ],
};
