import { landingCopy } from "@/data/landingCopy";
import { Phone } from "@/components/ui/Phone";

export function Hero() {
  const t = landingCopy;

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-[48px] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[78px] lg:text-[92px]">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-[720px] text-[15px] leading-7 text-white/58 sm:text-[18px]">
            {t.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              {t.heroCta}
            </button>
            <a
              href="#how"
              className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.06]"
            >
              {t.heroSecondary}
            </a>
          </div>
        </div>
      </section>

      <section className="relative pt-16 sm:pt-20">
        <div className="flex justify-center">
          <div className="relative z-10">
            <div className="absolute -translate-x-[84%] -left-[84%] top-20 z-20 hidden animate-floatSlow rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-xl sm:block">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                Open Finance
              </div>
              <div className="mt-2 text-sm text-white/70">
                Conecte contas e veja tudo em um só lugar
              </div>
            </div>
            <div className="absolute -right-[99%] translate-x-[99%] bottom-24 z-20 hidden animate-floatFast rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-xl sm:block">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                IA Uora
              </div>
              <div className="mt-2 text-sm text-white/70">
                Analisa desperdícios e pontos para serem melhorados
              </div>
            </div>
            <Phone variant="dashboard" />
          </div>
        </div>
      </section>
    </>
  );
}
