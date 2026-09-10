# LiquidCSS

Utility-first CSS framework for interactive **Liquid Glass** surfaces — refraction, angle sheens, hover shine and ripple. Pure CSS + SVG core, tiny optional JS for cursor-tracked interactions.

## Packages

| Package | Description |
| --- | --- |
| [`liquidcss`](packages/core) | Core engine, utility classes, default theme, SVG refraction filters |
| [`@liquidcss/postcss`](packages/postcss-plugin) | PostCSS plugin: `@liquidcss theme;` / `@liquidcss utilities;` |
| [`@liquidcss/cli`](packages/cli) | Standalone CLI: `liquidcss init\|build\|watch` |
| [`@liquidcss/interactions`](packages/interactions) | Optional <3kb JS: cursor-tracked tilt, click-positioned ripple |

## Quick start (PostCSS / Vite / Next.js)

```bash
pnpm add liquidcss @liquidcss/postcss
```

```js
// postcss.config.js
import liquidcss from "@liquidcss/postcss";

export default {
  plugins: [liquidcss({ content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"] })],
};
```

```css
/* src/liquidcss.css */
@liquidcss theme;
@liquidcss utilities;
```

Include the refraction filter sprite once in your HTML (copy it with `npx liquidcss init`, or import `liquidcss/filters.svg` as raw text):

```html
<div id="liquidcss-filters" aria-hidden="true"><!-- paste liquidcss/filters.svg here --></div>
```

## Quick start (standalone CLI, no bundler)

```bash
pnpm add liquidcss @liquidcss/cli
npx liquidcss init   # scaffolds liquidcss.config.json + copies the SVG filter sprite
npx liquidcss build  # writes ./liquidcss/liquidcss.css
```

## Utilities

- `lg-glass` — base glass surface (blur + saturate + translucent border)
- `lg-blur-{sm,md,lg,xl}` — adaptive blur scale
- `lg-refract-{1..5}`, `lg-lens`, `lg-wave` — edge refraction via SVG `feDisplacementMap`
- `lg-sheen`, `lg-sheen-{deg}`, `lg-sheen-[<value>]` — angle-gradient reflection
- `lg-shine-hover` — hover sweep reflection
- `lg-tilt` — perspective tilt on hover (add `@liquidcss/interactions` for real cursor tracking via `data-lg-tilt`)
- `lg-ripple` — centered ripple on `:active` (add `@liquidcss/interactions` for a click-positioned ripple via `data-lg-ripple`)

All utilities support `hover:`, `focus:`, `active:`, `dark:` and responsive (`sm:` … `2xl:`) variant prefixes.

## Browser support

Chromium and modern Firefox render refraction (`feDisplacementMap` combined with `backdrop-filter`) correctly. Browsers that don't support the combination fall back gracefully to blur-only — no JS required, no crash.

## Development

```bash
pnpm install
pnpm --filter './packages/*' build
pnpm --filter './packages/*' test
pnpm --filter docs dev
```

## License

MIT
