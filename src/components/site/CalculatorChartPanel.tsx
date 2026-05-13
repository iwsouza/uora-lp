"use client";

import { useMemo, useState } from "react";
import type { TooltipProps } from "recharts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Eye, EyeOff, GitCompareArrows, LineChart as LineChartIcon } from "lucide-react";
import type { CalcOutput, CalculatorDefinition } from "@/lib/calculators/types";
import { parseFigureValue } from "@/lib/calculators/parseFigureValue";

const BAR = "hsl(155 60% 45%)";
const BAR_DIM = "hsl(155 28% 32%)";
const BAR_ALT = "hsl(0 0% 45%)";
/** Cor de texto dos eixos alinhada ao tema (legível no fundo escuro) */
const AXIS_FILL = "hsl(var(--muted-foreground))";

/** Evita fundo/branco e texto padrão do Recharts por cima do tooltip custom. */
const tooltipChrome = {
  contentStyle: {
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
    padding: 0,
  },
  wrapperStyle: { outline: "none" as const },
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function shortenLabel(s: string, max = 22) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

type TabId = "inputs" | "timeline" | "scenario" | "resultbars";

function fmtRaw(type: string, raw: number) {
  if (type === "currency") {
    return raw.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
  }
  if (type === "percent") return `${raw.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
  return raw.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function ChartTooltipCard({ title, lines }: { title?: string; lines: { k: string; v: string }[] }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5 text-left shadow-lg">
      {title ? <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p> : null}
      <ul className="space-y-1.5">
        {lines.map((line) => (
          <li key={line.k} className="text-sm">
            <span className="text-muted-foreground">{line.k}</span>
            <span className="ml-1 font-semibold tabular-nums text-foreground">{line.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InputBarTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as { name: string; raw: number; type: string; pct: number };
  return (
    <ChartTooltipCard
      title={p.name}
      lines={[
        { k: "Valor digitado:", v: fmtRaw(p.type, p.raw) },
        {
          k: "Posição entre mín. e máx.:",
          v: `${Math.round(p.pct)}% (0% = mínimo da calculadora, 100% = máximo)`,
        },
      ]}
    />
  );
}

function LineTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value as number;
  return (
    <ChartTooltipCard
      title={String(label ?? "")}
      lines={[
        {
          k: "Valor no gráfico:",
          v: v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }),
        },
      ]}
    />
  );
}

function ScenarioTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as { name: string; A: number; B: number };
  const diff = row.B - row.A;
  const pct = row.A !== 0 ? (diff / Math.abs(row.A)) * 100 : null;
  const lines = [
    { k: "Opção A:", v: row.A.toLocaleString("pt-BR") },
    { k: "Opção B:", v: row.B.toLocaleString("pt-BR") },
    {
      k: "Diferença (B − A):",
      v: `${diff.toLocaleString("pt-BR")}${pct != null && Number.isFinite(pct) ? ` (${pct >= 0 ? "+" : ""}${pct.toFixed(0)}%)` : ""}`,
    },
  ];
  return <ChartTooltipCard title={row.name} lines={lines} />;
}

function ResultBarTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as { name: string; value: number };
  return (
    <ChartTooltipCard
      title={row.name}
      lines={[{ k: "Valor no gráfico:", v: row.value.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) }]}
    />
  );
}

export function CalculatorChartPanel({
  def,
  values,
  output,
}: {
  def: CalculatorDefinition;
  values: Record<string, number>;
  output: CalcOutput;
}) {
  const [visible, setVisible] = useState(true);
  const [tab, setTab] = useState<TabId>("inputs");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const inputNormData = useMemo(() => {
    return def.inputs.map((s) => {
      const v = values[s.key] ?? s.defaultValue;
      const span = s.max - s.min || 1;
      const pct = clamp(((v - s.min) / span) * 100, 0, 100);
      return {
        name: shortenLabel(s.label),
        fullLabel: s.label,
        pct,
        raw: v,
        type: s.type,
        min: s.min,
        max: s.max,
      };
    });
  }, [def.inputs, values]);

  const figureBarData = useMemo(() => {
    return output.figures
      .map((f) => {
        const n = parseFigureValue(f.value);
        return n == null ? null : { name: shortenLabel(f.label), fullLabel: f.label, value: Math.abs(n) };
      })
      .filter((x): x is NonNullable<typeof x> => x != null);
  }, [output.figures]);

  const seriesData = useMemo(() => {
    if (!output.series?.points.length) return [];
    return output.series.points.map((p) => ({
      name: p.x,
      valor: p.y,
    }));
  }, [output.series]);

  const compareData = useMemo(() => {
    const rows = output.scenarioCompare?.rows ?? [];
    return rows
      .map((r) => {
        const a = parseFigureValue(r.a);
        const b = r.b != null ? parseFigureValue(r.b) : null;
        if (a == null || b == null) return null;
        return { name: shortenLabel(r.label), fullLabel: r.label, A: a, B: b };
      })
      .filter((x): x is NonNullable<typeof x> => x != null);
  }, [output.scenarioCompare]);

  const hasSeries = seriesData.length >= 2;
  const hasScenario = compareData.length > 0;
  const hasResultBars = figureBarData.length >= 2;

  const safeTab: TabId =
    tab === "timeline" && !hasSeries
      ? "inputs"
      : tab === "scenario" && !hasScenario
        ? hasResultBars
          ? "resultbars"
          : "inputs"
        : tab === "resultbars" && !hasResultBars
          ? hasScenario
            ? "scenario"
            : "inputs"
          : tab;

  const setTabSafe = (t: TabId) => {
    setTab(t);
    setActiveIndex(null);
  };

  const evaluationLines = useMemo((): string[] => {
    if (safeTab === "inputs") {
      if (!inputNormData.length) return [];
      const hi = inputNormData.reduce((m, d) => (d.pct > m.pct ? d : m), inputNormData[0]);
      const lo = inputNormData.reduce((m, d) => (d.pct < m.pct ? d : m), inputNormData[0]);
      if (!hi) return [];

      const intervalo = (d: (typeof inputNormData)[0]) =>
        `entre ${fmtRaw(d.type, d.min)} e ${fmtRaw(d.type, d.max)}`;

      const intro =
        "Cada barra mostra onde o número digitado fica entre o mínimo e o máximo que esta calculadora aceita naquele campo. O eixo em % vai de 0% (no mínimo) a 100% (no máximo). Isso não julga se o valor é bom ou ruim — só a posição dentro dos limites do formulário.";

      const lines: string[] = [intro];

      if (inputNormData.length === 1) {
        lines.push(
          `«${hi.fullLabel}» está em ${Math.round(hi.pct)}% desse intervalo (${intervalo(hi)}).`,
        );
        return lines;
      }

      if (hi.fullLabel === lo.fullLabel && hi.pct === lo.pct) {
        lines.push(`Todos os campos estão na mesma posição relativa no intervalo (cerca de ${Math.round(hi.pct)}%).`);
      } else {
        lines.push(
          `Mais perto do máximo permitido no formulário: «${hi.fullLabel}» (${Math.round(hi.pct)}%; ${intervalo(hi)}).`,
        );
        if (lo.fullLabel !== hi.fullLabel) {
          lines.push(
            `Mais perto do mínimo permitido: «${lo.fullLabel}» (${Math.round(lo.pct)}%; ${intervalo(lo)}).`,
          );
        }
      }

      const avg = inputNormData.reduce((a, d) => a + d.pct, 0) / inputNormData.length;
      lines.push(
        `Média da posição no intervalo, entre todos os campos: ${avg.toFixed(0)}%. Serve para ver se você costuma preencher perto do teto ou do chão dos limites numéricos.`,
      );
      return lines;
    }
    if (safeTab === "timeline" && hasSeries) {
      const seriesTitle = output.series?.label?.trim() || "o valor da linha";
      const first = seriesData[0]?.valor;
      const last = seriesData[seriesData.length - 1]?.valor;
      if (first == null || last == null || first === 0) {
        return [
          `O gráfico mostra «${seriesTitle}» em cada ponto do eixo horizontal. Passe o mouse ou toque nos pontos para ver o número exato.`,
        ];
      }
      const chg = ((last - first) / Math.abs(first)) * 100;
      return [
        `Este gráfico é «${seriesTitle}»: cada ponto é um momento do eixo horizontal (por exemplo mês ou ano, conforme a calculadora).`,
        `Do primeiro ao último ponto, «${seriesTitle}» ${chg >= 0 ? "sobe" : "cai"} cerca de ${Math.abs(chg).toFixed(0)}% em relação ao valor inicial.`,
        "Use o toque ou o mouse em cada ponto para ver o valor exibido no tooltip.",
      ];
    }
    if (safeTab === "scenario" && hasScenario) {
      const compareTitle = output.scenarioCompare?.title?.trim();
      const head = compareTitle
        ? `Comparação «${compareTitle}»: cada par de barras é o mesmo indicador nos cenários A e B que você definiu nos campos.`
        : "Cada par de barras compara o mesmo indicador nos cenários A e B (valores que você digitou).";
      return [
        head,
        ...compareData.map((r) => {
          const diff = r.B - r.A;
          const dFmt = Math.abs(diff).toLocaleString("pt-BR");
          const relation =
            diff === 0
              ? "A e B iguais neste item."
              : diff > 0
                ? `B é maior que A em ${dFmt} (diferença bruta).`
                : `B é menor que A em ${dFmt} (diferença bruta).`;
          return `«${r.fullLabel}»: A = ${r.A.toLocaleString("pt-BR")}, B = ${r.B.toLocaleString("pt-BR")}. ${relation}`;
        }),
      ];
    }
    if (safeTab === "resultbars" && hasResultBars) {
      const sorted = [...figureBarData].sort((a, b) => b.value - a.value);
      const top = sorted[0];
      const bottom = sorted[sorted.length - 1];
      const ratio = bottom.value > 0 ? top.value / bottom.value : null;
      return [
        "Cada barra é um número principal do resultado (valor absoluto tirado do texto da calculadora), só para comparar magnitudes entre si — não substitui a leitura das linhas com contexto ao lado.",
        `Maior entre esses números: «${top.fullLabel}» (${top.value.toLocaleString("pt-BR")}).`,
        `Menor: «${bottom.fullLabel}» (${bottom.value.toLocaleString("pt-BR")}).`,
        ratio != null && Number.isFinite(ratio)
          ? `O maior é cerca de ${ratio.toFixed(1)} vezes o menor (proporção entre barras).`
          : "",
      ].filter(Boolean);
    }
    return [];
  }, [
    safeTab,
    inputNormData,
    seriesData,
    hasSeries,
    compareData,
    hasScenario,
    figureBarData,
    hasResultBars,
    output.series?.label,
    output.scenarioCompare?.title,
  ]);

  if (!visible) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-border bg-muted/20 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition active:bg-muted"
        >
          <Eye className="h-5 w-5 text-green-positive" aria-hidden />
          Mostrar gráficos
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/25 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 shrink-0 text-green-positive" aria-hidden />
          <h3 className="text-base font-semibold tracking-tight text-foreground">Gráficos</h3>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-foreground/25 hover:text-foreground sm:self-auto sm:text-sm"
        >
          <EyeOff className="h-4 w-4" aria-hidden />
          Ocultar
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border bg-background/80 p-3 sm:px-4">
        <button
          type="button"
          onClick={() => setTabSafe("inputs")}
          className={`inline-flex min-h-[40px] items-center rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
            safeTab === "inputs" ? "bg-foreground text-background" : "bg-muted/60 text-foreground hover:bg-muted"
          }`}
        >
          O que você preencheu
        </button>
        {hasSeries ? (
          <button
            type="button"
            onClick={() => setTabSafe("timeline")}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              safeTab === "timeline" ? "bg-foreground text-background" : "bg-muted/60 text-foreground hover:bg-muted"
            }`}
          >
            <LineChartIcon className="h-4 w-4 shrink-0" aria-hidden />
            Linha no tempo
          </button>
        ) : null}
        {hasScenario ? (
          <button
            type="button"
            onClick={() => setTabSafe("scenario")}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              safeTab === "scenario" ? "bg-foreground text-background" : "bg-muted/60 text-foreground hover:bg-muted"
            }`}
          >
            <GitCompareArrows className="h-4 w-4 shrink-0" aria-hidden />
            Comparar
          </button>
        ) : null}
        {hasResultBars && !hasScenario ? (
          <button
            type="button"
            onClick={() => setTabSafe("resultbars")}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              safeTab === "resultbars" ? "bg-foreground text-background" : "bg-muted/60 text-foreground hover:bg-muted"
            }`}
          >
            <GitCompareArrows className="h-4 w-4 shrink-0" aria-hidden />
            Números do resultado
          </button>
        ) : null}
      </div>

      {evaluationLines.length > 0 ? (
        <div className="border-b border-border bg-muted/15 px-4 py-4 sm:px-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Comparação e leitura</p>
          <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
            {evaluationLines.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="shrink-0 font-semibold text-green-positive">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="p-4 sm:p-5">
        <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {safeTab === "inputs"
            ? "Toque ou clique numa barra para destacar o campo. Nas outras abas, o mesmo gesto ajuda a comparar barras ou pontos."
            : "Toque ou clique nas barras ou pontos para destacar. Troque de aba para outra leitura do mesmo resultado."}
        </p>

        {safeTab === "inputs" ? (
          <div className="h-[min(320px,55vh)] w-full min-h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inputNormData} layout="vertical" margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: AXIS_FILL, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis type="category" dataKey="name" width={112} tick={{ fill: AXIS_FILL, fontSize: 11 }} interval={0} />
                <Tooltip
                  {...tooltipChrome}
                  content={<InputBarTooltip />}
                  cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
                />
                <Bar dataKey="pct" radius={[0, 6, 6, 0]} cursor="pointer" name="Preenchido">
                  {inputNormData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={activeIndex === i ? BAR : BAR_DIM}
                      stroke={activeIndex === i ? "hsl(var(--foreground))" : "none"}
                      strokeWidth={activeIndex === i ? 1.5 : 0}
                      onClick={() => setActiveIndex((x) => (x === i ? null : i))}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {safeTab === "timeline" && hasSeries ? (
          <div className="h-[min(320px,55vh)] w-full min-h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seriesData} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: AXIS_FILL, fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: AXIS_FILL, fontSize: 11 }} tickFormatter={(v) => v.toLocaleString("pt-BR")} />
                <Tooltip {...tooltipChrome} content={<LineTooltip />} />
                <Line type="monotone" dataKey="valor" stroke={BAR} strokeWidth={3} dot={{ r: 4, fill: BAR }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {safeTab === "scenario" && hasScenario ? (
          <div className="h-[min(320px,55vh)] w-full min-h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} margin={{ left: 4, right: 8, top: 8, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: AXIS_FILL, fontSize: 10 }}
                  interval={0}
                  angle={-16}
                  textAnchor="end"
                  height={52}
                />
                <YAxis tick={{ fill: AXIS_FILL, fontSize: 11 }} />
                <Tooltip {...tooltipChrome} content={<ScenarioTooltip />} />
                <Bar dataKey="A" name="A" radius={[4, 4, 0, 0]} cursor="pointer">
                  {compareData.map((_, i) => (
                    <Cell
                      key={`a-${i}`}
                      fill={activeIndex === i ? "hsl(0 0% 65%)" : BAR_ALT}
                      onClick={() => setActiveIndex((x) => (x === i ? null : i))}
                    />
                  ))}
                </Bar>
                <Bar dataKey="B" name="B" radius={[4, 4, 0, 0]} cursor="pointer">
                  {compareData.map((_, i) => (
                    <Cell
                      key={`b-${i}`}
                      fill={activeIndex === i ? "hsl(155 55% 52%)" : BAR}
                      onClick={() => setActiveIndex((x) => (x === i ? null : i))}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {safeTab === "resultbars" && hasResultBars ? (
          <div className="h-[min(320px,55vh)] w-full min-h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={figureBarData} margin={{ left: 4, right: 8, top: 8, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: AXIS_FILL, fontSize: 10 }}
                  interval={0}
                  angle={-16}
                  textAnchor="end"
                  height={52}
                />
                <YAxis tick={{ fill: AXIS_FILL, fontSize: 11 }} />
                <Tooltip {...tooltipChrome} content={<ResultBarTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} cursor="pointer" name="Valor">
                  {figureBarData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={activeIndex === i ? BAR : BAR_DIM}
                      onClick={() => setActiveIndex((x) => (x === i ? null : i))}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>
    </div>
  );
}
