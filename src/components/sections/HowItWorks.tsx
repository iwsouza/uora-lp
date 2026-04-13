import { landingCopy } from "@/data/landingCopy";
import { Shell } from "@/components/ui/Shell";

export function HowItWorks() {
  const t = landingCopy;
  const steps = [
    [t.how1Title, t.how1Text],
    [t.how2Title, t.how2Text],
    [t.how3Title, t.how3Text],
  ] as const;
  const labels = ["Primeiro", "Segundo", "Terceiro"] as const;

  return (
    <section id="how" className="pt-24 sm:pt-32">
      <div className="text-center">
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t.howTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
          {t.howSubtitle}
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map(([title, text], index) => (
          <Shell key={title} className="p-6 sm:p-7">
            <div className="text-[11px] uppercase tracking-[0.28em] text-white/28">
              {labels[index]}
            </div>
            <div className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-white">
              {title}
            </div>
            <p className="mt-3 text-sm leading-6 text-white/54">{text}</p>
          </Shell>
        ))}
      </div>
    </section>
  );
}
