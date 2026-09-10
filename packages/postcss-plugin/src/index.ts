import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import postcss, { type Plugin } from "postcss";
import { build } from "liquidcss";

const require = createRequire(import.meta.url);

export interface LiquidcssPostcssOptions {
  /** Glob patterns for files to scan for LiquidCSS class candidates (JIT). */
  content: string[];
  /** cwd used to resolve `content` globs. Defaults to process.cwd(). */
  cwd?: string;
}

/**
 * Replaces `@liquidcss theme;` and `@liquidcss utilities;` at-rules with the
 * compiled LiquidCSS output, the same way Tailwind's `@tailwind` directives work.
 */
export default function liquidcss(options: LiquidcssPostcssOptions): Plugin {
  const cwd = options.cwd ?? process.cwd();

  return {
    postcssPlugin: "liquidcss",
    AtRule: {
      liquidcss: async (atrule) => {
        const directive = atrule.params.trim();

        if (directive === "theme") {
          const themePath = require.resolve("liquidcss/theme.css");
          const css = await readFile(themePath, "utf8");
          atrule.replaceWith(postcss.parse(css));
          return;
        }

        if (directive === "utilities") {
          const css = await build({ content: options.content, cwd });
          atrule.replaceWith(postcss.parse(css));
          return;
        }

        throw atrule.error(`Unknown @liquidcss directive "${directive}". Use "theme" or "utilities".`);
      },
    },
  };
}

liquidcss.postcss = true;
