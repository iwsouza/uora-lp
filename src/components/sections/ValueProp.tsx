"use client";

import { Reveal } from "@/components/Reveal";

export function ValueProp() {
  return (
    <section className="pb-28 md:pb-40 bg-background">
      <div className="container max-w-3xl text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-5">
            Por que o Uora?
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-display-lg text-foreground mb-6">
            Você ainda tá tentando lembrar tudo de cabeça ou não sabe pra onde
            está indo seu dinheiro?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            O Uora analisa seus gastos, entende seu estilo de vida, identifica
            padrões e te ajuda a construir hábitos financeiros melhores.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <a
            href="#planos"
            className="pill-button-outline px-8 py-3.5 text-sm font-medium"
          >
            Comece agora
          </a>
        </Reveal>
      </div>
    </section>
  );
}
