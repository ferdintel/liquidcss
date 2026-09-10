#!/usr/bin/env node
import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { cac } from "cac";
import chokidar from "chokidar";
import { build } from "@ferdintel/liquidcss";

const require = createRequire(import.meta.url);

interface LiquidConfig {
  content: string[];
  output: string;
  theme?: string;
}

const CONFIG_CANDIDATES = ["liquidcss.config.js", "liquidcss.config.mjs", "liquidcss.config.json"];

async function loadConfig(cwd: string): Promise<{ config: LiquidConfig; configPath: string }> {
  for (const candidate of CONFIG_CANDIDATES) {
    const configPath = path.join(cwd, candidate);
    if (!existsSync(configPath)) continue;

    if (candidate.endsWith(".json")) {
      return { config: JSON.parse(await readFile(configPath, "utf8")), configPath };
    }
    const module = await import(`${pathToFileURL(configPath).href}?t=${Date.now()}`);
    return { config: module.default ?? module.config, configPath };
  }
  throw new Error(
    `No liquidcss.config.{js,mjs,json} found. Run \`liquidcss init\` first.`,
  );
}

function resolvePackageFile(relative: string): string {
  const packageJsonPath = require.resolve("@ferdintel/liquidcss/package.json");
  return path.join(path.dirname(packageJsonPath), relative);
}

async function runBuild(cwd: string) {
  const { config } = await loadConfig(cwd);
  const themePath = config.theme ? path.join(cwd, config.theme) : resolvePackageFile("theme.default.css");
  const [themeCss, utilitiesCss] = await Promise.all([
    readFile(themePath, "utf8"),
    build({ content: config.content, cwd }),
  ]);
  const outPath = path.join(cwd, config.output);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${themeCss}\n\n${utilitiesCss}\n`, "utf8");
  console.log(`liquidcss: wrote ${config.output}`);
}

const cli = cac("liquidcss");

cli
  .command("init", "Scaffold a liquidcss.config.json and copy the SVG refraction filters")
  .action(async () => {
    const cwd = process.cwd();
    const configPath = path.join(cwd, "liquidcss.config.json");
    if (!CONFIG_CANDIDATES.some((candidate) => existsSync(path.join(cwd, candidate)))) {
      const config: LiquidConfig = {
        content: ["./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}"],
        output: "./liquidcss/liquidcss.css",
      };
      await writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
      console.log(`liquidcss: created ${path.basename(configPath)}`);
    }
    const filtersSrc = resolvePackageFile("assets/liquidcss-filters.svg");
    const filtersDest = path.join(cwd, "liquidcss", "liquidcss-filters.svg");
    await mkdir(path.dirname(filtersDest), { recursive: true });
    await cp(filtersSrc, filtersDest);
    console.log(`liquidcss: copied refraction filters to ${path.relative(cwd, filtersDest)}`);
    console.log(`liquidcss: include this SVG sprite once in your HTML (e.g. right after <body>).`);
  });

cli.command("build", "Compile the CSS once").action(async () => {
  await runBuild(process.cwd());
});

cli.command("watch", "Rebuild the CSS on every content change").action(async () => {
  const cwd = process.cwd();
  const { config, configPath } = await loadConfig(cwd);
  await runBuild(cwd);
  const watcher = chokidar.watch([...config.content, configPath], { cwd, ignoreInitial: true });
  watcher.on("all", async () => {
    try {
      await runBuild(cwd);
    } catch (error) {
      console.error(error);
    }
  });
  console.log("liquidcss: watching for changes…");
});

cli.help();
cli.parse();
