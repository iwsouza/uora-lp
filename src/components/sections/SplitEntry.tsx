import Image from "next/image";
import { landingCopy } from "@/data/landingCopy";
import newExpense from "@/assets/new-expense.png";

export function SplitEntry() {
  const t = landingCopy;

  return (
    <section className="pt-24 sm:pt-32">
      <div className="grid items-center gap-12 lg:grid-cols-[.92fr_1.08fr]">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto w-[360px] sm:w-[420px]">
            <div className="absolute z-[1] inset-0 scale-[1.06] rounded-[44px] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.18),rgba(255,255,255,0)_55%)] blur-2xl" />
            <Image
              src={newExpense}
              alt="Tela de nova despesa: salvar via chat, áudio ou manual"
              width={751}
              height={1660}
              className="relative z-[2] h-auto w-full select-none"
              sizes="(min-width: 640px) 640px, 360px"
            />
          </div>
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
