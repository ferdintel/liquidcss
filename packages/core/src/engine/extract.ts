/** Extracts class-name-like candidates from arbitrary source text (HTML, JSX, templates...). */
const CANDIDATE_RE = /[^\s"'`<>=;,(){}]+/g;

export function extractCandidates(source: string): Set<string> {
  const candidates = new Set<string>();
  for (const token of source.matchAll(CANDIDATE_RE)) {
    const value = token[0];
    if (value.includes("lg-")) candidates.add(value);
  }
  return candidates;
}
