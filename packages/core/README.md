# liquidcss

Core engine, utility classes, default theme and SVG refraction filters for [LiquidCSS](../../README.md).

```bash
pnpm add liquidcss
```

- `liquidcss/theme.css` — default `:root` theme tokens
- `liquidcss/filters.svg` — SVG refraction filter sprite (`feTurbulence` + `feDisplacementMap`)
- `build({ content, cwd })` — JIT-compile the utilities used in your `content` globs

See the [root README](../../README.md) for the full utility list and integration guides (PostCSS, CLI).
