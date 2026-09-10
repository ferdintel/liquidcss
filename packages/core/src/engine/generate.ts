import { utilityRegistry } from "../utilities/index.js";
import { parseCandidate, escapeSelector } from "./variants.js";
import type { UtilityRule } from "./types.js";

const MEDIA_RANK = [
  "(min-width: 640px)",
  "(min-width: 768px)",
  "(min-width: 1024px)",
  "(min-width: 1280px)",
  "(min-width: 1536px)",
  "(prefers-color-scheme: dark)",
];

function cleanDeclarations(declarations: string): string {
  return declarations
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}

function resolveRule(base: string): UtilityRule | null {
  const staticBlocks = utilityRegistry.static[base];
  if (staticBlocks) return { className: base, blocks: staticBlocks };
  for (const dynamic of utilityRegistry.dynamic) {
    const rule = dynamic.resolve(base);
    if (rule) return rule;
  }
  return null;
}

function mediaGroupRank(mediaQuery: string): number {
  const index = MEDIA_RANK.indexOf(mediaQuery);
  return index === -1 ? MEDIA_RANK.length : index;
}

/** Compiles a set of class-name candidates into the minimal CSS that defines them. */
export function generateCSS(candidates: Iterable<string>): string {
  const plainRules: string[] = [];
  const mediaGroups = new Map<string, string[]>();
  const seen = new Set<string>();

  for (const candidate of [...candidates].sort()) {
    if (seen.has(candidate)) continue;
    seen.add(candidate);

    const parsed = parseCandidate(candidate);
    if (!parsed) continue;
    const rule = resolveRule(parsed.base);
    if (!rule) continue;

    const mediaQueries = parsed.variantChain.filter((v) => v.media).map((v) => v.media as string);
    const pseudos = parsed.variantChain
      .filter((v) => v.pseudo)
      .map((v) => v.pseudo)
      .join("");

    const cssRules = rule.blocks.map((block) => {
      const selector = `.${escapeSelector(candidate)}${pseudos}${block.selectorSuffix ?? ""}`;
      const body = `${selector} { ${cleanDeclarations(block.declarations)} }`;
      return block.atRule ? `${block.atRule} { ${body} }` : body;
    });

    if (mediaQueries.length === 0) {
      plainRules.push(...cssRules);
    } else {
      const key = mediaQueries.join(" and ");
      const group = mediaGroups.get(key) ?? [];
      group.push(...cssRules);
      mediaGroups.set(key, group);
    }
  }

  const mediaKeys = [...mediaGroups.keys()].sort((a, b) => mediaGroupRank(a) - mediaGroupRank(b));
  const mediaBlocks = mediaKeys.map((key) => `@media ${key} {\n  ${mediaGroups.get(key)!.join("\n  ")}\n}`);

  return [...plainRules, ...mediaBlocks].join("\n");
}
