/** One CSS block a utility contributes, e.g. the base rule or its `::before` companion. */
export interface RuleBlock {
  /** CSS declarations only (no selector), e.g. "backdrop-filter: blur(4px);" */
  declarations: string;
  /** Appended right after the class selector (and after any pseudo-class variant), e.g. "::before". */
  selectorSuffix?: string;
  /** Extra at-rule the rule must be nested in, e.g. "@supports (backdrop-filter: blur(1px))". */
  atRule?: string;
}

export interface UtilityRule {
  /** Raw class name as it must appear in the compiled selector, e.g. "lg-blur-md" (without variant prefixes). */
  className: string;
  blocks: RuleBlock[];
}

export interface DynamicUtility {
  /** Matches a full class name (without variants) and returns its rule, or null if it doesn't apply. */
  resolve(className: string): UtilityRule | null;
}

export interface UtilityRegistry {
  /** Classes with a fixed, precomputed set of blocks. */
  static: Record<string, RuleBlock[]>;
  /** Parametric classes resolved via regex, e.g. lg-refract-{1..5}. */
  dynamic: DynamicUtility[];
}
