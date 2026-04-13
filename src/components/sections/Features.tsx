import { landingCopy } from "@/data/landingCopy";
import { Shell } from "@/components/ui/Shell";

export function Features() {
  const t = landingCopy;
  const cards = [
    [t.card1Title, t.card1Text],
    [t.card2Title, t.card2Text],
    [t.card3Title, t.card3Text],
  ] as const;
  const labels = ["Primeiro", "Segundo", "Terceiro"] as const;

  return (
    <section id="features" className="pt-24 sm:pt-32">
      <div className="max-w-3xl">
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t.section1Title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
          {t.section1Text}
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map(([title, text], index) => (
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
