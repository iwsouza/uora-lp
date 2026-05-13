export type CalcInputType =
  | "currency"
  | "percent"
  | "months"
  | "years"
  | "number"
  | "distanceKm"
  | "efficiencyKml"
  | "liters"
  | "energyKwhPer100km";

export type CalcInputSpec = {
  key: string;
  label: string;
  type: CalcInputType;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  help?: string;
};

export type CalcFigure = { label: string; value: string; hint?: string };

export type CalcScenarioRow = { label: string; a: string; b?: string; winner?: "a" | "b" | "tie" };

export type CalcOutput = {
  /** Linha principal para o usuário */
  summary: string;
  figures: CalcFigure[];
  interpretation: string[];
  warnings?: string[];
  /** Opcional: pequena tabela ou série para gráfico */
  series?: { label: string; points: { x: string; y: number }[] };
  /** Tom Uora: leituras curtas, provocativas, acionáveis */
  insights?: string[];
  /** Comparação explícita de cenários (A vs B ou A vs B vs C) */
  scenarioCompare?: { title: string; rows: CalcScenarioRow[] };
  /** Impacto financeiro resumido */
  impacts?: {
    monthly?: string;
    annual?: string;
    patrimony?: string;
  };
};

export type CalcResult =
  | { ok: true; output: CalcOutput }
  | { ok: false; fieldErrors: Record<string, string>; message?: string };

export type CalculatorDefinition = {
  slug: string;
  title: string;
  shortDescription: string;
  category:
    | "core"
    | "personal"
    | "decision"
    | "advanced"
    | "auto_combustivel"
    | "auto_comparacao"
    | "auto_custo_carro"
    | "auto_eletrico"
    | "auto_simulacao";
  /** Documentação sucinta para UI / SEO */
  doc: {
    formula: string;
    variables: string;
    howToUse: string;
    useCases: string;
    edgeCases: string;
    /** Métricas e leituras que o resultado e o gráfico mostram (orientação ao usuário). */
    oQueVoceVe?: string[];
  };
  inputs: CalcInputSpec[];
  compute: (values: Record<string, number>) => CalcResult;
};
