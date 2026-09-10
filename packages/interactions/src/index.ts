import { enableTilt } from "./tilt.js";
import { enableRipple } from "./ripple.js";

export { enableTilt } from "./tilt.js";
export { enableRipple } from "./ripple.js";

/** Wires up both enhancers in one call; safe to run multiple times (e.g. after DOM updates). */
export function initLiquidInteractions(root: ParentNode = document): () => void {
  const disposeTilt = enableTilt(root);
  const disposeRipple = enableRipple(root);
  return () => {
    disposeTilt();
    disposeRipple();
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initLiquidInteractions(), { once: true });
  } else {
    initLiquidInteractions();
  }
}
