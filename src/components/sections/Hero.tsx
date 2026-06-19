import Image from "next/image";
import { landingCopy } from "@/data/landingCopy";
import { APP_SIGNUP_URL } from "@/data/urls";
import uoraHero from "@/assets/uora-hero.png";

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
            <a
              href={APP_SIGNUP_URL}
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              {t.heroCta}
            </a>
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
            <div className="absolute -translate-x-[84%] -left-[40%] top-20 z-20 hidden animate-floatSlow rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-xl sm:block">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                Open Finance
              </div>
              <div className="mt-2 text-sm text-white/70">
                Conecte contas e veja tudo em um só lugar
              </div>
            </div>
            <div className="absolute -right-[54%] translate-x-[99%] bottom-24 z-20 hidden animate-floatFast rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-xl sm:block">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                Inteligência Uora
              </div>
              <div className="mt-2 text-sm text-white/70">
                Analisa desperdícios e pontos para serem melhorados
              </div>
            </div>
            <div className="relative mx-auto w-[360px] sm:w-[640px]">
              <div className="absolute z-[1] inset-0 scale-[1.06] rounded-[44px] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.18),rgba(255,255,255,0)_55%)] blur-2xl" />
              <Image
                src={uoraHero}
                alt="Interface do painel Uora no celular, com saldo e fluxo do mês"
                width={791}
                height={1431}
                className="h-auto w-full select-none relative z-[2]"
                priority
                sizes="(min-width: 791px) 440px, 360px"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
