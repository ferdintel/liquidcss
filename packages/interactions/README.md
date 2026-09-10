# @liquidcss/interactions

Optional progressive-enhancement JS for [LiquidCSS](../../README.md) (<3kb gzip, zero dependencies).

```bash
pnpm add @liquidcss/interactions
```

```js
import "@liquidcss/interactions"; // auto-initializes on DOMContentLoaded
```

```html
<div class="lg-glass lg-tilt" data-lg-tilt>Follows the cursor</div>
<button class="lg-glass lg-ripple" data-lg-ripple>Ripples from the click point</button>
```

Respects `prefers-reduced-motion`. Use `enableTilt`/`enableRipple`/`initLiquidInteractions` directly for manual control (e.g. after dynamic DOM updates).
