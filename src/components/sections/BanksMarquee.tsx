import type { ReactNode } from "react";
import { landingCopy } from "@/data/landingCopy";

const banks = [
  { name: "Inter", src: "/banks/inter.webp" },
  { name: "XP", src: "/banks/xp.webp" },
  { name: "Nubank", src: "/banks/nubank.webp" },
  { name: "C6 Bank", src: "/banks/c6-bank.webp" },
  { name: "Banco do Brasil", src: "/banks/bb.webp" },
  { name: "PicPay", src: "/banks/picpay.webp" },
  { name: "Santander", src: "/banks/santander.webp" },
] as const;

function LogoMark({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-20 min-w-[164px] items-center justify-center rounded-[24px] border border-white/8 bg-white/[0.03] px-7 text-white/92 backdrop-blur-xl">
      {children}
    </div>
  );
}

export function BanksMarquee() {
  const t = landingCopy;
  const row = [...banks, ...banks];

  return (
    <section className="pt-24 sm:pt-32">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t.banksTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
          {t.banksSubtitle}
        </p>
      </div>
      <div className="mt-10">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#050505] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#050505] to-transparent" />
          <div className="flex w-max animate-marqueeRight gap-4 will-change-transform">
            {row.map((bank, index) => (
              <LogoMark key={`${bank.name}-${index}`}>
                <img
                  src={bank.src}
                  alt={bank.name}
                  className="max-h-11 w-auto max-w-[120px] object-contain opacity-95"
                  loading="lazy"
                />
              </LogoMark>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
