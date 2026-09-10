import { readFile } from "node:fs/promises";
import fg from "fast-glob";
import { extractCandidates } from "./extract.js";
import { generateCSS } from "./generate.js";

export interface BuildOptions {
  /** Glob patterns for files to scan for class-name candidates. */
  content: string[];
  /** Absolute/relative cwd used to resolve `content` globs. */
  cwd?: string;
}

/** Scans `content` globs, extracts LiquidCSS candidates and compiles them to CSS (JIT — only used classes are emitted). */
export async function build(options: BuildOptions): Promise<string> {
  const files = await fg(options.content, { cwd: options.cwd ?? process.cwd(), absolute: true });
  const candidates = new Set<string>();

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const candidate of extractCandidates(source)) candidates.add(candidate);
  }

  return generateCSS(candidates);
}
