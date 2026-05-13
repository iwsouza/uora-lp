import CalculatorHubPage from "@/components/site/CalculatorHubPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadoras | Uora",
  description:
    "Juros compostos, financiamento, FIRE, financiar vs alugar e outras simulações financeiras com interpretação dos resultados.",
};

export default function Page() {
  return <CalculatorHubPage />;
}
