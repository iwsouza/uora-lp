import type { CalculatorDefinition } from "./types";
import { coreCalculators } from "./definitions/core";
import { personalCalculators } from "./definitions/personal";
import { decisionCalculators } from "./definitions/decision";
import { advancedCalculators } from "./definitions/advanced";
import { automotiveCalculators } from "./definitions/automotive";

export type * from "./types";
export * from "./math";
export { validateInputs, wrapCompute } from "./validate";

export const CALCULATOR_DEFINITIONS: CalculatorDefinition[] = [
  ...coreCalculators,
  ...personalCalculators,
  ...decisionCalculators,
  ...advancedCalculators,
  ...automotiveCalculators,
];

const bySlug = new Map(CALCULATOR_DEFINITIONS.map((c) => [c.slug, c]));

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return bySlug.get(slug);
}

export function getDefaultValues(def: CalculatorDefinition): Record<string, number> {
  return Object.fromEntries(def.inputs.map((i) => [i.key, i.defaultValue]));
}
