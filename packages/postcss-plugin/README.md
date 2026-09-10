# @ferdintel/liquidcss-postcss

PostCSS plugin for [LiquidCSS](../../README.md) — expands `@liquidcss theme;` and `@liquidcss utilities;`.

```js
// postcss.config.js
import liquidcss from "@ferdintel/liquidcss-postcss";

export default {
  plugins: [liquidcss({ content: ["./index.html", "./src/**/*.{html,js,ts}"] })],
};
```

```css
@liquidcss theme;
@liquidcss utilities;
```
