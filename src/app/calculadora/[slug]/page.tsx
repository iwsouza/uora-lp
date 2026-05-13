import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CalculatorRunner from "@/components/site/CalculatorRunner";
import { CALCULATOR_DEFINITIONS, getCalculatorBySlug } from "@/lib/calculators";

export function generateStaticParams() {
  return CALCULATOR_DEFINITIONS.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const def = getCalculatorBySlug(slug);
  if (!def) return { title: "Calculadora" };
  return {
    title: `${def.title} | Uora`,
    description: def.shortDescription,
  };
}

export default async function CalculadoraSlugPage({ params }: Props) {
  const { slug } = await params;
  if (!getCalculatorBySlug(slug)) notFound();
  return <CalculatorRunner slug={slug} />;
}
