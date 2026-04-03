"use client";

import { Reveal } from "@/components/Reveal";

export function FinalCTA() {
  return (
    <section className="section-dark py-28 md:py-40 rounded-t-[2rem] mx-0">
      <div className="container text-center max-w-5xl">
        <Reveal>
          <h2 className="font-display text-display-xl text-dark-section-foreground mb-5">
            Antes de você imaginar, a Uora já sabe como te ajudar a ter mais
            dinheiro.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-dark-section-foreground/60 text-base md:text-lg mb-10">
            Escolhe o plano que faz sentido pra você. Conecte o banco em minutos
            e troque achismo por visão do que vem pela frente.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <a
            href="#planos"
            className="pill-button bg-primary-foreground text-foreground px-10 py-4 text-base font-medium"
          >
            Ser membro →
          </a>
        </Reveal>
        <Reveal delay={0.35}>
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-dark-section-foreground/40">
            {[
              "Open Finance regulado",
              "Só leitura — não move seu dinheiro",
              "LGPD",
              "Cancela quando quiser",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="text-green-positive">✓</span> {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
