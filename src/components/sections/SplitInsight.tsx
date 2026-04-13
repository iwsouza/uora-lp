import { landingCopy } from "@/data/landingCopy";
import { Phone } from "@/components/ui/Phone";

export function SplitInsight() {
  const t = landingCopy;

  return (
    <section className="pt-24 sm:pt-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr]">
        <div className="max-w-[560px]">
          <div className="text-[11px] uppercase tracking-[0.34em] text-white/28">{t.split2Kicker}</div>
          <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
            {t.split2Title}
          </h3>
          <p className="mt-5 text-base leading-7 text-white/58 sm:text-lg">{t.split2Text}</p>
        </div>
        <div>
          <Phone variant="insight" />
        </div>
      </div>
    </section>
  );
}
