import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import postcss from "postcss";
import { describe, expect, it, afterEach } from "vitest";
import liquidcss from "../src/index.js";

describe("@liquidcss/postcss", () => {
  let dir: string;

  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
  });

  it("expands @liquidcss theme; and @liquidcss utilities;", async () => {
    dir = await mkdtemp(path.join(tmpdir(), "liquidcss-postcss-"));
    const htmlPath = path.join(dir, "index.html");
    await writeFile(htmlPath, `<div class="lg-glass hover:lg-sheen"></div>`, "utf8");

    const input = `@liquidcss theme;\n@liquidcss utilities;\n.app { color: red; }`;
    const result = await postcss([liquidcss({ content: [htmlPath] })]).process(input, { from: undefined });

    expect(result.css).toContain(":root {");
    expect(result.css).toContain("--lg-tint:");
    expect(result.css).toContain(".lg-glass {");
    expect(result.css).toContain(".hover\\:lg-sheen:hover::before {");
    expect(result.css).toContain(".app { color: red; }");
  });

  it("rejects unknown directives", async () => {
    const input = `@liquidcss bogus;`;
    await expect(
      postcss([liquidcss({ content: [] })]).process(input, { from: undefined }).then((r) => r.css),
    ).rejects.toThrow(/Unknown @liquidcss directive/);
  });
});
