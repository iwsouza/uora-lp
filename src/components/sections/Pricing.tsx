import { cn } from "@/lib/utils";
import { landingCopy } from "@/data/landingCopy";
import { Shell } from "@/components/ui/Shell";

export function Pricing() {
  const t = landingCopy;
  const plans = [
    {
      name: t.plan1,
      price: "R$17",
      desc: t.plan1Desc,
      features: [t.plan1F1, t.plan1F2, t.plan1F3, t.plan1F4],
      highlighted: false,
    },
    {
      name: t.plan2,
      price: "R$29",
      desc: t.plan2Desc,
      features: [t.plan2F1, t.plan2F2, t.plan2F3, t.plan2F4],
      highlighted: true,
    },
    {
      name: t.plan3,
      price: "R$42",
      desc: t.plan3Desc,
      features: [t.plan3F1, t.plan3F2, t.plan3F3, t.plan3F4],
      highlighted: false,
    },
  ] as const;

  return (
    <section id="pricing" className="pt-24 sm:pt-32">
      <div className="text-center">
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t.pricingTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
          {t.pricingSubtitle}
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Shell
            key={plan.name}
            className={cn(
              "relative p-6 sm:p-7",
              plan.highlighted && "border-white/25 ring-1 ring-white/15",
            )}
          >
            {plan.highlighted && (
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-white/90 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-gray-900 backdrop-blur-xl">
                {t.popular}
              </div>
            )}
            <div className="mt-5 text-[28px] font-semibold tracking-[-0.04em] text-white">
              {plan.name}
            </div>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-5xl font-semibold tracking-[-0.06em] text-white">
                {plan.price}
              </span>
              <span className="pb-1 text-white/38">/mês</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/54">{plan.desc}</p>
            <ul className="mt-6 space-y-3 text-sm text-white/78">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/78" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={cn(
                "mt-8 w-full rounded-full px-5 py-3.5 text-sm font-semibold transition",
                plan.highlighted
                  ? "bg-white text-black hover:scale-[1.02]"
                  : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07]",
              )}
            >
              {t.heroCta}
            </button>
          </Shell>
        ))}
      </div>
    </section>
  );
}
