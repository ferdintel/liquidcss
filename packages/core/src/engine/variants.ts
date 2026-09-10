export interface Variant {
  name: string;
  /** Wraps the rule in a media query, e.g. responsive breakpoints and dark mode. */
  media?: string;
  /** Appended to the selector right before any pseudo-element suffix, e.g. ":hover". */
  pseudo?: string;
}

export const variants: Record<string, Variant> = {
  hover: { name: "hover", pseudo: ":hover" },
  focus: { name: "focus", pseudo: ":focus-visible" },
  active: { name: "active", pseudo: ":active" },
  dark: { name: "dark", media: "(prefers-color-scheme: dark)" },
  sm: { name: "sm", media: "(min-width: 640px)" },
  md: { name: "md", media: "(min-width: 768px)" },
  lg: { name: "lg", media: "(min-width: 1024px)" },
  xl: { name: "xl", media: "(min-width: 1280px)" },
  "2xl": { name: "2xl", media: "(min-width: 1536px)" },
};

/** Splits a candidate like "md:hover:lg-glass" into its variant chain + base class. */
export function parseCandidate(candidate: string): { base: string; variantChain: Variant[] } | null {
  const parts = candidate.split(":");
  const base = parts.pop();
  if (!base) return null;
  const variantChain: Variant[] = [];
  for (const part of parts) {
    const variant = variants[part];
    if (!variant) return null; // unknown prefix — not a LiquidCSS candidate
    variantChain.push(variant);
  }
  return { base, variantChain };
}

/** Escapes a class name for use inside a CSS selector (colons, brackets, etc.). */
export function escapeSelector(className: string): string {
  return className.replace(/([:.[\]/%#])/g, "\\$1");
}
