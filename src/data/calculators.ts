import type { ComponentType, SVGProps } from "react";
import { Calculator } from "lucide-react";
import { CALCULATOR_DEFINITIONS } from "@/lib/calculators";

export type CalculatorEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const CALCULATORS: CalculatorEntry[] = CALCULATOR_DEFINITIONS.map((c) => ({
  id: c.slug,
  title: c.title,
  description: c.shortDescription,
  href: `/calculadora/${c.slug}`,
  Icon: Calculator,
}));
