"use client";

import { Reveal } from "@/components/Reveal";
import { InfiniteCarousel } from "@/components/ui/InfiniteCarousel";
import lifestyle1 from "@/assets/lifestyle-1.jpg";

const insightExamples = [
  "R$ 396 em delivery este mês. Mantendo o ritmo, quase R$ 4.700 no ano",
  "Esse padrão está empurrando sua meta 18 dias pra trás",
  "Gastos 31% acima do mês passado, sem você ter notado",
  "Três assinaturas duplicadas: R$ 47/mês indo pro ralo",
  "Se repetir o que fez em março, fica R$ 620 no vermelho",
  "Pix duplicado detectado — você já tinha pago essa conta",
];

export function LifeOrganized() {
  return (
    <section className="pt-24 md:pt-36 bg-background overflow-hidden">
      <div className="container">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="font-display text-display-lg text-foreground mb-4">
              Pare de errar com o seu dinheiro
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              A Uora mostra onde você está errando, o que acontece se continuar
              assim e como te fazer ganhar dinheiro.
            </p>
          </div>
        </Reveal>

        <div
          className="my-12"
          style={
            { "--fade-from": "hsl(var(--background))" } as React.CSSProperties
          }
        >
          <InfiniteCarousel speed={35} direction="left">
            {insightExamples.map((insight) => (
              <div
                key={insight}
                className="bg-card border border-border rounded-full px-6 py-3 whitespace-nowrap"
              >
                <span className="text-sm text-foreground/80">{insight}</span>
              </div>
            ))}
          </InfiniteCarousel>
        </div>

        {/* Two cards side by side */}
        <div className="grid md:grid-cols-2 gap-4 mt-12">
          <Reveal delay={0.1}>
            <div className="rounded-3xl overflow-hidden relative h-[480px] group">
              <img
                src={
                  typeof lifestyle1 === "string" ? lifestyle1 : lifestyle1.src
                }
                alt="Pessoa usando o app Uora"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-xl text-primary-foreground mb-2">
                  Você no controle com mais dinheiro
                </h3>
                <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
                  O Uora acompanha seus gastos, ajuda a definir metas e se
                  adapta ao seu estilo de vida.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-3xl overflow-hidden relative h-[480px] bg-gradient-to-br from-peach-muted to-muted group">
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl text-foreground mb-2">
                    Enquanto você não olha, o padrão continua.
                  </h3>{" "}
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <div className="self-start bg-foreground/5 backdrop-blur-sm rounded-2xl rounded-bl-md px-5 py-3 max-w-[95%]">
                    <p className="text-sm text-foreground leading-relaxed">
                      Você já gastou{" "}
                      <span className="font-semibold">R$ 396</span> com delivery
                      este mês. Mantendo esse ritmo, são{" "}
                      <span className="font-semibold">
                        quase R$ 4.700 no ano.
                      </span>
                    </p>
                  </div>
                  <div className="self-start bg-foreground/5 backdrop-blur-sm rounded-2xl rounded-bl-md px-5 py-3 max-w-[95%]">
                    <p className="text-sm text-foreground leading-relaxed">
                      Esse padrão está{" "}
                      <span className="font-semibold">
                        atrasando sua meta em 18 dias
                      </span>
                      . Isso é uma projeção com o que você gastou nas últimas
                      semanas.
                    </p>
                  </div>
                  <div className="self-start bg-foreground/5 backdrop-blur-sm rounded-2xl rounded-bl-md px-5 py-3 max-w-[95%]">
                    <p className="text-sm text-foreground leading-relaxed">
                      Seus gastos subiram{" "}
                      <span className="font-semibold">31%</span> em relação ao
                      mês passado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
