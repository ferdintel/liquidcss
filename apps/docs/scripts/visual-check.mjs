// Cross-browser visual check: boots the docs preview server and screenshots the
// Liquid Glass gallery in Chromium, WebKit and Firefox to eyeball fallback behavior
// (Firefox/older WebKit are expected to show blur without edge refraction).
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.join(__dirname, "..");
const outDir = path.join(__dirname, "screenshots");
const port = 4310;
const url = `http://localhost:${port}/`;

function waitForServer(proc) {
  return new Promise((resolve, reject) => {
    const onData = (data) => {
      if (data.toString().includes("Local:")) {
        proc.stdout.off("data", onData);
        resolve();
      }
    };
    proc.stdout.on("data", onData);
    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code !== 0) reject(new Error(`preview server exited with code ${code}`));
    });
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const server = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], {
    cwd: docsRoot,
    stdio: ["ignore", "pipe", "inherit"],
  });

  try {
    await waitForServer(server);

    const engines = { chromium, webkit, firefox };
    for (const [name, engine] of Object.entries(engines)) {
      try {
        const browser = await engine.launch();
        const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
        await page.goto(url, { waitUntil: "networkidle" });
        await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
        await browser.close();
        console.log(`liquidcss: captured ${name}.png`);
      } catch (error) {
        console.error(`liquidcss: skipped ${name} (${error.message.split("\n")[0]})`);
      }
    }
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
