# @liquidcss/cli

Standalone CLI for [LiquidCSS](../../README.md), for projects without a PostCSS pipeline.

```bash
npx liquidcss init   # scaffolds liquidcss.config.{json} + copies the SVG filter sprite
npx liquidcss build   # writes the compiled CSS once
npx liquidcss watch   # rebuilds on every content change
```

Config file (`liquidcss.config.js`, `.mjs` or `.json`):

```js
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  output: "./liquidcss/liquidcss.css",
  theme: "./liquidcss/theme.css", // optional override
};
```
