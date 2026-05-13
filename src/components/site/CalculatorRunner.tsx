"use client";

import { useMemo, useState, useCallback, useId } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft } from "lucide-react";
import { CalculatorChartPanel } from "@/components/site/CalculatorChartPanel";
import {
  CALCULATOR_DEFINITIONS,
  getCalculatorBySlug,
  getDefaultValues,
} from "@/lib/calculators";
import type {
  CalcInputSpec,
  CalcInputType,
  CalcScenarioRow,
  CalculatorDefinition,
} from "@/lib/calculators/types";

function ScenarioComparePanel({
  title,
  rows,
}: {
  title: string;
  rows: CalcScenarioRow[];
}) {
  const hasB = rows.some((r) => r.b != null);
  return (
    <div className="rounded-2xl border-2 border-green-positive/25 bg-green-positive/[0.06] p-5 shadow-sm sm:rounded-3xl sm:p-6">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-green-positive">
        Análise comparativa
      </p>
      <p className="mb-4 text-sm font-semibold text-foreground">{title}</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[280px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
              <th className="px-3 py-2.5 font-medium sm:px-4">Indicador</th>
              <th className="px-3 py-2.5 font-medium sm:px-4">Cenário A</th>
              {hasB ? (
                <th className="px-3 py-2.5 font-medium sm:px-4">Cenário B</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-3 py-3 text-foreground/90 sm:px-4">
                  {row.label}
                </td>
                <td
                  className={`px-3 py-3 font-semibold tabular-nums sm:px-4 ${
                    row.winner === "a"
                      ? "text-green-positive"
                      : row.winner === "b"
                        ? "text-muted-foreground"
                        : "text-foreground"
                  }`}
                >
                  {row.a}
                </td>
                {hasB && row.b != null ? (
                  <td
                    className={`px-3 py-3 font-semibold tabular-nums sm:px-4 ${
                      row.winner === "b"
                        ? "text-green-positive"
                        : row.winner === "a"
                          ? "text-muted-foreground"
                          : "text-foreground"
                    }`}
                  >
                    {row.b}
                  </td>
                ) : hasB ? (
                  <td className="px-3 py-3 text-muted-foreground sm:px-4">—</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        O “vencedor” em cada linha segue a regra da própria calculadora (ex.:
        menor gasto). Confira sempre os números absolutos na tabela.
      </p>
    </div>
  );
}

function isAutoCategory(cat: CalculatorDefinition["category"]): boolean {
  return cat.startsWith("auto_");
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Parse digitos com vírgula ou ponto decimal (sem separador de milhar). */
function parseDecimalInput(raw: string): number | null {
  const t = raw
    .trim()
    .replace(/\s/g, "")
    .replace(/^R\$\s?/i, "");
  if (t === "" || t === "-" || t === "," || t === ".") return null;
  const normalized = t.replace(",", ".");
  if (normalized.split(".").length > 2) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function decimalsFromStep(step: number): number {
  if (!Number.isFinite(step) || step >= 1) return 0;
  const s = step.toString();
  const i = s.indexOf("e-");
  if (i >= 0) return Math.max(0, parseInt(s.slice(i + 2), 10));
  const p = s.split(".")[1];
  return p ? Math.min(6, p.length) : 2;
}

function formatEditValue(n: number, step: number): string {
  const d = decimalsFromStep(step);
  if (d === 0) return String(Math.round(n));
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: d,
    useGrouping: false,
  });
}

function inputModeForType(type: CalcInputType): "decimal" | "numeric" {
  if (type === "months") return "numeric";
  return "decimal";
}

const inputBaseClass =
  "w-full min-h-[48px] rounded-xl border border-input bg-background px-3.5 py-3 font-body text-base leading-tight text-foreground tabular-nums shadow-sm transition-[color,box-shadow,border-color] duration-200 touch-manipulation placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:opacity-50";

function Field({
  spec,
  value,
  onChange,
  error,
}: {
  spec: CalcInputSpec;
  value: number;
  onChange: (n: number) => void;
  error?: string;
}) {
  const hintId = useId();
  const errId = useId();
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  const committed = useMemo(() => formatEditValue(value, spec.step), [value, spec.step]);
  const inputValue = focused && draft !== null ? draft : committed;

  const handleBlur = useCallback(() => {
    const raw = draft ?? committed;
    const parsed = parseDecimalInput(raw);
    if (parsed === null) {
      setFocused(false);
      setDraft(null);
      return;
    }
    const next = clamp(parsed, spec.min, spec.max);
    onChange(next);
    setFocused(false);
    setDraft(null);
  }, [committed, draft, onChange, spec.max, spec.min]);

  const suffix =
    spec.type === "percent"
      ? "%"
      : spec.type === "distanceKm"
        ? "km"
        : spec.type === "efficiencyKml"
          ? "km/l"
          : spec.type === "liters"
            ? "l"
            : spec.type === "energyKwhPer100km"
              ? "kWh/100"
              : spec.type === "months"
                ? "meses"
                : spec.type === "years"
                  ? "anos"
                  : null;

  const showCurrencyPrefix = spec.type === "currency";

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <label
          htmlFor={spec.key}
          className="font-body text-sm font-medium text-foreground/90"
        >
          {spec.label}
        </label>
        <p
          id={hintId}
          className="font-body text-[11px] text-muted-foreground tabular-nums"
        >
          min {spec.min.toLocaleString("pt-BR")} · max{" "}
          {spec.max.toLocaleString("pt-BR")}
        </p>
      </div>
      <div className="relative flex items-stretch">
        {showCurrencyPrefix ? (
          <span
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 font-body text-base text-muted-foreground"
            aria-hidden
          >
            R$
          </span>
        ) : null}
        <input
          id={spec.key}
          name={spec.key}
          type="text"
          inputMode={inputModeForType(spec.type)}
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error ? errId : null, hintId].filter(Boolean).join(" ") ||
            undefined
          }
          className={`${inputBaseClass} ${showCurrencyPrefix ? "pl-10 pr-10" : suffix ? "pr-12" : ""}`}
          value={inputValue}
          onFocus={() => {
            setFocused(true);
            setDraft(formatEditValue(value, spec.step));
          }}
          onBlur={handleBlur}
          onChange={(e) => {
            const v = e.target.value;
            setDraft(v);
            const p = parseDecimalInput(v);
            if (p !== null) {
              const next = clamp(p, spec.min, spec.max);
              onChange(next);
            }
          }}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {spec.help ? (
        <p className="font-body text-xs text-muted-foreground">{spec.help}</p>
      ) : null}
      {error ? (
        <p
          id={errId}
          className="font-body text-xs text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CalculatorTopCtaBar({ automotive }: { automotive: boolean }) {
  return (
    <div
      className={`w-full border-b bg-muted/40 ${
        automotive ? "border-green-positive/50" : "border-border"
      }`}
    >
      <div className="mx-auto flex w-full max-w-none flex-col items-stretch gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 md:py-7 md:pl-10 md:pr-10 lg:pl-14 lg:pr-14">
        <p className="max-w-3xl text-left text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg md:text-xl">
          {automotive ? (
            <>
              Conecte suas contas no Uora e acompanhe{" "}
              <span className="text-green-positive">
                combustível, parcela e manutenção do carro
              </span>{" "}
              no mesmo lugar, todo mês.
            </>
          ) : (
            <>
              Leve essas simulações para o dia a dia: no Uora você organiza{" "}
              <span className="text-green-positive">
                renda, metas e gastos recorrentes
              </span>{" "}
              com uma visão completa.
            </>
          )}
        </p>
        <Link
          href="/"
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-foreground px-8 py-3.5 text-center text-base font-semibold text-background transition hover:opacity-90 active:scale-[0.98] sm:min-w-[200px]"
        >
          Começar no Uora
        </Link>
      </div>
    </div>
  );
}

export default function CalculatorRunner({ slug }: { slug: string }) {
  const def = getCalculatorBySlug(slug);
  const [values, setValues] = useState<Record<string, number>>(() =>
    def ? getDefaultValues(def) : {},
  );

  const setField = useCallback((key: string, n: number) => {
    setValues((prev) => ({ ...prev, [key]: n }));
  }, []);

  const result = useMemo(() => {
    if (!def) return null;
    return def.compute(values);
  }, [def, values]);

  if (!def) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <p className="font-body text-muted-foreground">
          Calculadora não encontrada.
        </p>
      </div>
    );
  }

  const ok = result?.ok === true ? result.output : null;
  const errs = result?.ok === false ? result.fieldErrors : {};

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
        <div className="container flex items-center justify-between gap-3 py-3.5 sm:py-4">
          <Link
            href="/"
            className="shrink-0 text-xl font-semibold tracking-tight"
          >
            <span className="rounded-full bg-foreground px-3 py-1.5 text-sm font-medium text-background">
              uora
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2 text-sm">
            <Link
              href="/calculadora"
              className="pill-button-outline px-3 py-2.5 font-body sm:px-4"
            >
              Todas
            </Link>
            <Link
              href="/"
              className="pill-button-outline hidden px-4 py-2.5 font-body sm:inline-flex"
            >
              Início
            </Link>
          </div>
        </div>
      </header>

      <CalculatorTopCtaBar automotive={isAutoCategory(def.category)} />

      <section className="py-10 sm:py-14 md:py-20">
        <div className="container max-w-6xl px-4 sm:px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 sm:mb-10"
          >
            <Link
              href="/calculadora"
              className="mb-5 inline-flex min-h-[44px] items-center gap-1 font-body text-xs text-muted-foreground active:text-foreground sm:mb-6"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
              Calculadoras
            </Link>
            <p className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-accent sm:text-xs">
              Ferramenta gratuita
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl md:text-5xl">
              {def.title}
            </h1>
            <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
              {def.shortDescription}
            </p>
          </motion.div>

          <div className="mb-8 rounded-2xl border border-border bg-muted/15 p-5 sm:mb-10 sm:p-6 md:rounded-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Guia rápido
            </h2>
            {def.doc.oQueVoceVe?.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold text-foreground">
                  O que você vai ver
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-foreground/85">
                  {def.doc.oQueVoceVe.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="shrink-0 font-semibold text-green-positive">
                        •
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div
              className={
                def.doc.oQueVoceVe?.length
                  ? "mt-5 border-t border-border/70 pt-5"
                  : "mt-4"
              }
            >
              <p className="text-xs font-semibold text-foreground">
                Como preencher
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {def.doc.howToUse}
              </p>
              <p className="mt-3 text-xs font-semibold text-foreground">
                Quando usar
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {def.doc.useCases}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/80">
                  Limites do modelo:{" "}
                </span>
                {def.doc.edgeCases}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.04 }}
                className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 md:rounded-3xl md:p-8"
              >
                <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Valores
                </h2>
                <p className="-mt-4 mb-6 text-sm text-muted-foreground">
                  Digite os números. O resultado atualiza na hora. Use vírgula
                  ou ponto para decimais.
                </p>
                <div className="flex flex-col gap-6 sm:gap-7">
                  {def.inputs.map((spec) => (
                    <Field
                      key={spec.key}
                      spec={spec}
                      value={values[spec.key] ?? spec.defaultValue}
                      onChange={(n) => setField(spec.key, n)}
                      error={errs[spec.key]}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="flex min-w-0 flex-col gap-5 sm:gap-6"
              >
                {ok ? (
                  <>
                    {ok.warnings?.length ? (
                      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-100/95">
                        <p className="mb-1 font-semibold">Atenção</p>
                        {ok.warnings.map((w) => (
                          <p key={w}>{w}</p>
                        ))}
                      </div>
                    ) : null}

                    <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-7">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Em uma frase
                      </p>
                      <p className="text-lg font-semibold leading-relaxed text-foreground sm:text-xl md:text-2xl">
                        {ok.summary}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Abaixo da grelha, o painel de gráficos usa a largura
                        total. À direita (no desktop) ficam os principais
                        números em lista.
                      </p>
                    </div>

                    {ok.scenarioCompare?.rows.length ? (
                      <ScenarioComparePanel
                        title={ok.scenarioCompare.title}
                        rows={ok.scenarioCompare.rows}
                      />
                    ) : null}

                    {ok.impacts &&
                    (ok.impacts.monthly ||
                      ok.impacts.annual ||
                      ok.impacts.patrimony) ? (
                      <div className="space-y-2 rounded-2xl border border-green-positive/25 bg-green-positive/[0.07] p-4 sm:p-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-green-positive">
                          Impacto no bolso
                        </p>
                        {ok.impacts.monthly ? (
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {ok.impacts.monthly}
                          </p>
                        ) : null}
                        {ok.impacts.annual ? (
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {ok.impacts.annual}
                          </p>
                        ) : null}
                        {ok.impacts.patrimony ? (
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {ok.impacts.patrimony}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                        Os números da conta
                      </h3>
                      <dl className="divide-y divide-border">
                        {ok.figures.map((f) => (
                          <div key={f.label} className="py-4 first:pt-0">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                              <dt className="text-sm text-muted-foreground sm:max-w-[58%]">
                                {f.label}
                              </dt>
                              <dd className="text-lg font-semibold tabular-nums text-foreground sm:text-right">
                                {f.value}
                              </dd>
                            </div>
                            {f.hint ? (
                              <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
                                {f.hint}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </dl>
                    </div>

                    <details className="group rounded-2xl border border-border bg-muted/20 p-1 sm:rounded-3xl">
                      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 font-semibold text-foreground transition hover:bg-muted/50 sm:px-5 [&::-webkit-details-marker]:hidden">
                        <span>Mais detalhes</span>
                        <span className="text-xs font-normal text-muted-foreground group-open:hidden">
                          Abrir
                        </span>
                        <span className="hidden text-xs font-normal text-muted-foreground group-open:inline">
                          Fechar
                        </span>
                      </summary>
                      <div className="space-y-6 border-t border-border/80 px-4 py-5 sm:px-5">
                        {ok.insights?.length ? (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Dicas rápidas
                            </p>
                            <ul className="space-y-2 text-sm leading-relaxed text-foreground/85">
                              {ok.insights.map((line) => (
                                <li key={line} className="flex gap-2">
                                  <span
                                    className="text-green-positive"
                                    aria-hidden
                                  >
                                    •
                                  </span>
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            O que isso quer dizer
                          </p>
                          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/80">
                            {ok.interpretation.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </details>
                  </>
                ) : (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm sm:text-base">
                    <p className="font-semibold text-destructive">
                      Ajuste os valores
                    </p>
                    {result?.ok === false && result.message ? (
                      <p className="mt-2 text-foreground/80">
                        {result.message}
                      </p>
                    ) : null}
                  </div>
                )}
              </motion.div>
            </div>

            {ok ? (
              <div className="w-full min-w-0 shrink-0">
                <CalculatorChartPanel def={def} values={values} output={ok} />
              </div>
            ) : null}
          </div>

          <motion.details
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="group mt-12 rounded-2xl border border-border bg-card/60 p-5 sm:mt-16 sm:rounded-3xl sm:p-6 md:p-8"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl [&::-webkit-details-marker]:hidden">
              <BookOpen
                className="h-5 w-5 shrink-0 text-green-positive"
                aria-hidden
              />
              Documentação
              <span className="ml-auto font-body text-xs text-muted-foreground group-open:hidden">
                Expandir
              </span>
              <span className="ml-auto hidden font-body text-xs text-muted-foreground group-open:inline">
                Recolher
              </span>
            </summary>
            <div className="mt-6 space-y-5 font-body text-sm leading-relaxed text-foreground/80 sm:text-base">
              {def.doc.oQueVoceVe?.length ? (
                <div>
                  <p className="mb-1.5 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
                    O que você vai ver
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5">
                    {def.doc.oQueVoceVe.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <p className="mb-1.5 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
                  Fórmula
                </p>
                <p>{def.doc.formula}</p>
              </div>
              <div>
                <p className="mb-1.5 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
                  Variáveis
                </p>
                <p>{def.doc.variables}</p>
              </div>
              <div>
                <p className="mb-1.5 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
                  Como usar
                </p>
                <p>{def.doc.howToUse}</p>
              </div>
              <div>
                <p className="mb-1.5 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
                  Casos de uso
                </p>
                <p>{def.doc.useCases}</p>
              </div>
              <div>
                <p className="mb-1.5 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
                  Edge cases
                </p>
                <p>{def.doc.edgeCases}</p>
              </div>
            </div>
          </motion.details>

          <div className="mt-10 flex flex-wrap justify-center gap-2 sm:mt-12 sm:gap-2.5">
            {CALCULATOR_DEFINITIONS.filter((c) => c.slug !== slug)
              .slice(0, 8)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/calculadora/${c.slug}`}
                  className="min-h-[44px] rounded-full border border-border px-3.5 py-2.5 font-body text-xs text-muted-foreground transition-colors active:border-foreground/30 active:text-foreground sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs md:hover:border-foreground/30 md:hover:text-foreground"
                >
                  {c.title}
                </Link>
              ))}
          </div>

          <div className="mt-10 text-center sm:mt-12">
            <Link
              href="/"
              className="pill-button-dark inline-flex min-h-[52px] items-center justify-center px-8 py-3.5 font-body text-sm font-medium sm:min-h-0 sm:text-base"
            >
              Organizar minhas finanças com o Uora →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
