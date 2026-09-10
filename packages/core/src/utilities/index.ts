import type { UtilityRegistry } from "../engine/types.js";
import { glassUtilities } from "./glass.js";
import { refractUtilities } from "./refract.js";
import { sheenUtilities } from "./sheen.js";
import { shineUtilities } from "./shine.js";
import { rippleUtilities } from "./ripple.js";

const registries = [glassUtilities, refractUtilities, sheenUtilities, shineUtilities, rippleUtilities];

export const utilityRegistry: UtilityRegistry = {
  static: Object.assign({}, ...registries.map((r) => r.static)),
  dynamic: registries.flatMap((r) => r.dynamic),
};
