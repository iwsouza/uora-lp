import { landingCopy } from "@/data/landingCopy";
import { Phone } from "@/components/ui/Phone";

export function SplitEntry() {
  const t = landingCopy;

  return (
    <section className="pt-24 sm:pt-32">
      <div className="grid items-center gap-12 lg:grid-cols-[.92fr_1.08fr]">
        <div className="order-2 lg:order-1">
          <Phone variant="entry" />
        </div>
        <div className="order-1 max-w-[560px] lg:order-2">
          <div className="text-[11px] uppercase tracking-[0.34em] text-white/28">
            {t.split1Kicker}
          </div>
          <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
            {t.split1Title}
          </h3>
          <p className="mt-5 text-base leading-7 text-white/58 sm:text-lg">
            {t.split1Text}
          </p>
        </div>
      </div>
    </section>
  );
}
