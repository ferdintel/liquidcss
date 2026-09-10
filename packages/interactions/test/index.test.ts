import { describe, expect, it } from "vitest";
import { enableTilt, enableRipple, initLiquidInteractions } from "../src/index.js";

describe("@liquidcss/interactions exports", () => {
  it("exposes the enhancer functions", () => {
    expect(typeof enableTilt).toBe("function");
    expect(typeof enableRipple).toBe("function");
    expect(typeof initLiquidInteractions).toBe("function");
  });
});
