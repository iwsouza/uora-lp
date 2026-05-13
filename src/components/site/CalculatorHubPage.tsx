"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  Car,
  GitCompare,
  LineChart,
  PiggyBank,
  Search,
  Sparkles,
} from "lucide-react";
import { CALCULATOR_DEFINITIONS } from "@/lib/calculators";
import type { CalculatorDefinition } from "@/lib/calculators/types";

const FEATURED_SLUGS = [
  "juros-compostos",
  "simulador-investimento",
  "financiar-vs-alugar",
  "economia-eletrico-vs-gasolina",
  "independencia-financeira",
  "parcelar-vs-pagar-vista",
] as const;

const categoryLabel: Record<CalculatorDefinition["category"], string> = {
  core: "Bases e crédito",
  personal: "Orçamento e metas",
  decision: "Comparar decisões",
  advanced: "Longo prazo e liberdade",
  auto_combustivel: "Carro — combustível",
  auto_comparacao: "Carro — comparar opções",
  auto_custo_carro: "Carro — custo total",
  auto_eletrico: "Carro — elétrico e híbrido",
  auto_simulacao: "Carro — impacto e simulações",
};

const categorySubtitle: Record<CalculatorDefinition["category"], string> = {
  core: "Juros, investimento, financiamento e empréstimo com leitura em reais.",
  personal: "Renda, poupança, planejamento mensal e projeção de saldo.",
  decision: "Financiar ou alugar, à vista ou parcelado, crédito e cartão.",
  advanced: "Patrimônio, independência, FIRE, renda passiva e metas.",
  auto_combustivel: "Consumo, custo por km, viagem e tanque.",
  auto_comparacao: "Etanol, gasolina, diesel e ranking de custo.",
  auto_custo_carro: "Mês, ano e custo total de propriedade (TCO simplificado).",
  auto_eletrico: "kWh, recarga, economia vs combustão e comparadores.",
  auto_simulacao: "Troca de carro, payback, orçamento e patrimônio.",
};

const categoryOrder: CalculatorDefinition["category"][] = [
  "core",
  "personal",
  "decision",
  "advanced",
  "auto_combustivel",
  "auto_comparacao",
  "auto_custo_carro",
  "auto_eletrico",
  "auto_simulacao",
];

function iconForCategory(cat: CalculatorDefinition["category"]) {
  if (cat === "core") return LineChart;
  if (cat === "personal") return PiggyBank;
  if (cat === "decision") return GitCompare;
  if (cat === "advanced") return Sparkles;
  return Car;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export default function CalculatorHubPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return CALCULATOR_DEFINITIONS;
    return CALCULATOR_DEFINITIONS.filter((c) => {
      const hay = `${c.title} ${c.shortDescription} ${c.slug}`.toLowerCase();
      return normalize(hay).includes(q);
    });
  }, [query]);

  const featured = useMemo(
    () =>
      FEATURED_SLUGS.map((slug) => CALCULATOR_DEFINITIONS.find((c) => c.slug === slug)).filter(
        (c): c is CalculatorDefinition => Boolean(c),
      ),
    [],
  );

  const grouped = useMemo(
    () =>
      categoryOrder.map((cat) => ({
        cat,
        title: categoryLabel[cat],
        subtitle: categorySubtitle[cat],
        items: filtered.filter((c) => c.category === cat),
      })),
    [filtered],
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            <span className="rounded-full bg-foreground px-3 py-1.5 text-sm font-medium text-background">uora</span>
          </Link>
          <Link href="/" className="pill-button-outline px-5 py-2 text-sm">
            ← Voltar ao início
          </Link>
        </div>
      </header>

      <section className="py-14 md:py-24">
        <div className="container max-w-6xl px-4 sm:px-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center md:mb-14"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Ferramentas gratuitas</p>
            <h1 className="mb-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl">
              Calculadoras e simuladores
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Explore simulações com fórmulas claras, campos validados e textos que explicam o que cada número significa.
              Uso educativo — não substitui aconselhamento personalizado.
            </p>
          </motion.div>

          <div className="relative mx-auto mb-12 max-w-xl md:mb-14">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, tema ou slug…"
              className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-4 text-base text-foreground shadow-sm outline-none ring-offset-background transition-[box-shadow,border-color] placeholder:text-muted-foreground/70 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {!query.trim() ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-14 md:mb-16"
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">Destaques</h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    Ferramentas que costumam ser o primeiro passo: juros, investimento, decisão de moradia e mobilidade.
                  </p>
                </div>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((c, i) => (
                  <motion.li
                    key={c.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.04 * i }}
                  >
                    <Link
                      href={`/calculadora/${c.slug}`}
                      className="group flex h-full min-h-[160px] flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-[border-color,box-shadow] hover:border-foreground/20 hover:shadow-md md:p-6"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="rounded-xl bg-muted/80 p-2.5 text-foreground">
                          <Calculator className="h-5 w-5 shrink-0" aria-hidden />
                        </span>
                        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-lg font-semibold tracking-tight text-foreground group-hover:text-accent">
                        {c.title}
                      </p>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.shortDescription}</p>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : null}

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center text-muted-foreground">
              Nenhuma calculadora encontrada. Tente outro termo.
            </p>
          ) : (
            <div className="space-y-14 md:space-y-16">
              {grouped
                .filter(({ items }) => items.length > 0)
                .map(({ cat, title, subtitle, items }, gi) => {
                  const Icon = iconForCategory(cat);
                  return (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.04 * gi }}
                    >
                      <div className="mb-5 border-b border-border pb-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-xl bg-muted/70 p-2 text-foreground">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <div>
                            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h2>
                            <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
                          </div>
                        </div>
                      </div>
                      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((c) => (
                          <li key={c.slug}>
                            <Link
                              href={`/calculadora/${c.slug}`}
                              className="group flex h-full min-h-[148px] flex-col rounded-2xl border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-foreground/20 hover:shadow-sm md:p-6"
                            >
                              <div className="mb-3 flex items-start justify-between gap-2">
                                <span className="rounded-lg bg-foreground/[0.06] p-2 text-foreground">
                                  <Calculator className="h-4 w-4 shrink-0" aria-hidden />
                                </span>
                                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                              </div>
                              <p className="text-base font-semibold tracking-tight text-foreground group-hover:text-accent md:text-lg">
                                {c.title}
                              </p>
                              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.shortDescription}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
