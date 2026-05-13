import Image from "next/image";
import { landingCopy } from "@/data/landingCopy";
import losingMoney from "@/assets/losing-money.png";

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
          <div className="relative mx-auto w-[360px] sm:w-[420px]">
            <div className="absolute z-[1] inset-0 scale-[1.06] rounded-[44px] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.18),rgba(255,255,255,0)_55%)] blur-2xl" />
            <Image
              src={losingMoney}
              alt="Tela de alerta: comparação com a média, assinaturas e economia potencial"
              width={753}
              height={1492}
              className="relative z-[2] h-auto w-full select-none"
              sizes="(min-width: 640px) 640px, 360px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
