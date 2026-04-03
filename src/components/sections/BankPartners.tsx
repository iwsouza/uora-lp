"use client";

import { InfiniteCarousel } from "@/components/ui/InfiniteCarousel";
import { Reveal } from "@/components/Reveal";

const banksRow1: { name: string; logo: string }[] = [
  { name: "Itaú", logo: "/logos/banks/itau.svg" },
  { name: "Bradesco", logo: "/logos/banks/bradesco.svg" },
  { name: "Santander", logo: "/logos/banks/santander.svg" },
  { name: "Banco do Brasil", logo: "/logos/banks/banco-do-brasil.svg" },
  { name: "Caixa", logo: "/logos/banks/caixa.svg" },
  { name: "BV", logo: "/logos/banks/bv.svg" },
  { name: "Banrisul", logo: "/logos/banks/banrisul.svg" },
  { name: "Sicoob", logo: "/logos/banks/sicoob.png" },
];

const banksRow2: { name: string; logo: string }[] = [
  { name: "Nubank", logo: "/logos/banks/nubank.svg" },
  { name: "Inter", logo: "/logos/banks/inter.svg" },
  { name: "Next", logo: "/logos/banks/next.svg" },
  { name: "Neon", logo: "/logos/banks/neon.png" },
  { name: "PicPay", logo: "/logos/banks/picpay.png" },
  { name: "Mercado Pago", logo: "/logos/banks/mercadopago.svg" },
  { name: "PagBank", logo: "/logos/banks/pagbank.png" },
  { name: "Banco Pan", logo: "/logos/banks/banco-pan.png" },
];

function BankCard({ logo }: { name: string; logo: string }) {
  return (
    <div className="w-[min(100%,260px)] shrink-0 md:w-[280px]">
      <div className="flex min-h-[88px] items-center gap-3 justify-center rounded-2xl border border-border bg-card px-4 py-3 transition-all duration-300">
        <img
          src={logo}
          alt=""
          className="max-h-10 w-full max-h-[50px] max-w-[110px] object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

export function BankPartners() {
  return (
    <section className="py-24 md:py-36 bg-background overflow-hidden">
      <div className="container mb-14">
        <Reveal>
          <h2 className="font-display text-display-lg text-foreground text-center mb-3">
            Conecte todos os seus bancos
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground text-base md:text-lg text-center max-w-xl mx-auto">
            Integração direta com os principais bancos do Brasil
          </p>
        </Reveal>
      </div>

      <div
        className="space-y-4"
        style={
          { "--fade-from": "hsl(var(--background))" } as React.CSSProperties
        }
      >
        <InfiniteCarousel speed={35} direction="left">
          {banksRow1.map((b) => (
            <BankCard key={b.name} name={b.name} logo={b.logo} />
          ))}
        </InfiniteCarousel>

        <InfiniteCarousel speed={40} direction="right">
          {banksRow2.map((b) => (
            <BankCard key={b.name} name={b.name} logo={b.logo} />
          ))}
        </InfiniteCarousel>
      </div>
    </section>
  );
}
