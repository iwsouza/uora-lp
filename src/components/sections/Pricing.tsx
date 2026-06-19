"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { landingCopy } from "@/data/landingCopy";
import { APP_SIGNUP_URL } from "@/data/urls";
import { Shell } from "@/components/ui/Shell";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const HUNDRED = 100;

/**
 * Tabela (riscado). Essencial 65: desconto percentual acima do Central (26) com os
 * mesmos R$ 39 (mensal) e R$ 32 (anual, equivalente /mês).
 */
const LIST_MONTH_CENTS = {
  central: 26 * 100,
  essential: 65 * 100,
} as const;

function listMonthCentsForPlanId(id: keyof typeof LIST_MONTH_CENTS) {
  return LIST_MONTH_CENTS[id];
}

function offPercentFor(payCents: number, listCents: number) {
  if (listCents <= 0) {
    return 0;
  }
  return Math.round((HUNDRED * (listCents - payCents)) / listCents);
}

function reaisToCents(reais: number) {
  return Math.round(reais * 100);
}

/**
 * /mês no anual: um único arred. em centavos, mesmo número no display e no riscado.
 */
function payMonthCentsForCycle(
  cycle: "annual" | "monthly",
  month: number,
  year: number,
) {
  if (cycle === "monthly") {
    return reaisToCents(month);
  }
  return Math.round((year * 100) / 12);
}

type Money = { month: number; year: number };

const AMOUNTS: Record<"central" | "essential", Money> = {
  /** Mensal: R$ 17. Anual: 12×R$ 14 = R$ 168 (parcela /mês redonda). */
  central: { month: 17, year: 168 },
  /** Mensal: R$ 39. Anual: 12×R$ 32 = R$ 384. */
  essential: { month: 39, year: 384 },
};

export function Pricing() {
  const t = landingCopy;
  const [cycle, setCycle] = useState<"annual" | "monthly">("annual");

  const plans = [
    {
      id: "central" as const,
      name: t.planCentralName,
      money: AMOUNTS.central,
      features: [
        t.planCentralF6,
        t.planCentralF2,
        t.planCentralF3,
        t.planCentralF4,
        t.planCentralF5,
      ],
      highlighted: false,
    },
    {
      id: "essential" as const,
      name: t.planEssentialName,
      money: AMOUNTS.essential,
      features: [
        t.planEssentialF0,
        t.planEssentialF1,
        t.planEssentialF2,
        t.planEssentialF3,
        t.planEssentialF4,
        t.planEssentialF5,
      ],
      highlighted: true,
    },
  ] as const;

  return (
    <section id="pricing" className="pt-24 sm:pt-32">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          {t.pricingTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/55 sm:mt-5 sm:text-xl">
          {t.pricingSubtitle}
        </p>
      </div>

      <div
        className="mx-auto mt-10 flex max-w-md justify-center rounded-full border border-white/10 bg-white/[0.04] p-1.5 sm:mt-12"
        role="group"
        aria-label="Período de cobrança"
      >
        <button
          type="button"
          onClick={() => setCycle("monthly")}
          className={cn(
            "min-w-0 flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-6 sm:py-3 sm:text-base",
            cycle === "monthly"
              ? "bg-white text-black"
              : "text-white/60 hover:text-white/85",
          )}
        >
          {t.pricingBillingMonthly}
        </button>
        <button
          type="button"
          onClick={() => setCycle("annual")}
          className={cn(
            "min-w-0 flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-6 sm:py-3 sm:text-base",
            cycle === "annual"
              ? "bg-white text-black"
              : "text-white/60 hover:text-white/85",
          )}
        >
          {t.pricingBillingAnnual}
        </button>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        {plans.map((plan) => {
          const m = plan.money;
          const payCents = payMonthCentsForCycle(cycle, m.month, m.year);
          const listCents = listMonthCentsForPlanId(plan.id);
          const offPct = offPercentFor(payCents, listCents);
          return (
            <Shell
              key={plan.id}
              className={cn(
                "relative flex min-h-[65vh] flex-col p-6 sm:p-8 lg:p-10",
                plan.highlighted && "border-white/25 ring-1 ring-white/15",
              )}
            >
              {plan.highlighted && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 sm:text-sm">
                  {t.popular}
                </div>
              )}

              <div className="shrink-0 text-center">
                <span className="inline-block rounded-full border border-white/18 bg-white/[0.08] px-3 py-1.5 text-sm font-bold tabular-nums tracking-[-0.02em] text-white/95 sm:px-4 sm:text-base">
                  {offPct}% OFF
                </span>
              </div>
              <div
                className="mt-1 shrink-0 text-center text-lg text-white/40 line-through sm:text-xl"
                aria-hidden
              >
                {BRL.format(listCents / 100)} {t.pricingPerMonth}
              </div>

              <div className="mt-5 shrink-0 text-center text-2xl font-semibold tracking-[-0.03em] text-white sm:mt-6 sm:text-3xl">
                {plan.name}
              </div>

              <div className="mt-5 shrink-0 text-center sm:mt-6">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-4xl font-semibold tabular-nums tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
                    {BRL.format(payCents / 100)}
                  </span>
                  <span className="pb-1 text-lg text-white/40 sm:text-xl">
                    {t.pricingPerMonth}
                  </span>
                </div>
              </div>

              <div className="mt-7 flex min-h-0 min-w-0 flex-1 flex-col">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/40 sm:text-sm">
                  Benefícios
                </div>
                <ul className="mt-3 min-h-0 flex-1 space-y-2.5 text-left text-base leading-snug text-white/75 sm:space-y-3 sm:text-lg sm:leading-relaxed">
                  {plan.id === "central" ? (
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                      <span className="line-through">{t.planCentralNote}</span>
                    </li>
                  ) : null}
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={APP_SIGNUP_URL}
                className={cn(
                  "mt-6 flex w-full shrink-0 items-center justify-center rounded-full px-5 py-3.5 text-base font-semibold transition sm:mt-8 sm:py-4 sm:text-lg",
                  plan.highlighted
                    ? "bg-white text-black hover:scale-[1.01]"
                    : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07]",
                )}
              >
                {t.heroCta}
              </a>
            </Shell>
          );
        })}
      </div>
    </section>
  );
}
