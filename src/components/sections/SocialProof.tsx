"use client";

import { Reveal } from "@/components/Reveal";
import { InfiniteCarousel } from "@/components/ui/InfiniteCarousel";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

function Counter({
  to,
  suffix = "",
  prefix = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / 2000, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

const testimonials = [
  {
    quote:
      "Eu jurava que gastava uns R$ 200 com delivery. Deu quase R$ 450 no mês passado. Foi meio péssimo de ver, mas pelo menos parou de ser achismo.",
    name: "Ricardo M.",
    role: "Engenheiro, 34 anos",
    stars: 5,
  },
  {
    quote:
      "Não é aquele app que manda 'cuide dos seus gastos'. Foi mais tipo: esse padrão aqui te empurra X dias pra longe da meta. Aí eu levei a sério.",
    name: "Fernanda A.",
    role: "Analista, 29 anos",
    stars: 5,
  },
  {
    quote:
      "Tinha duas assinaturas iguais rodando e eu nem lembrava. Um absurdo. O alerta veio com data e valor — não teve como fingir que não vi.",
    name: "Carlos B.",
    role: "Empresário, 47 anos",
    stars: 5,
  },
  {
    quote:
      "Conectei dois bancos em tipo cinco minutos. O desconforto bom foi ver tudo num lugar só e perceber onde eu tava vazando dinheiro sem notar.",
    name: "Ana L.",
    role: "Designer, 31 anos",
    stars: 5,
  },
  {
    quote:
      "Antes eu fechava o mês no escuro. Agora quando vem a mensagem eu já sei se é besteira ou se vai doer de verdade no bolso. Mudou o jogo pra mim.",
    name: "Pedro S.",
    role: "Médico, 38 anos",
    stars: 5,
  },
  {
    quote:
      "O que me pegou foi a projeção: não é 'você gasta muito', é 'se continuar assim, isso aqui acontece em tantos dias'. Aí não dá pra ignorar.",
    name: "Juliana R.",
    role: "Advogada, 42 anos",
    stars: 5,
  },
];

function TestimonialCard({
  quote,
  name,
  role,
  stars,
}: (typeof testimonials)[0]) {
  return (
    <div className="w-[320px] md:w-[380px]">
      <div className="bg-card rounded-3xl p-7 h-full min-h-[244px] border border-border hover:border-foreground/10 transition-all duration-300 hover:shadow-lg">
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: stars }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
          ))}
        </div>
        <p className="text-sm text-foreground leading-relaxed mb-6">{quote}</p>
        <div className="flex items-center gap-3 h-full">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-peach to-peach-muted" />
          <div>
            <p className="text-[13px] font-medium text-foreground">{name}</p>
            <p className="text-[11px] text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const stats = [
  {
    kind: "counter" as const,
    to: 700,
    suffix: "+",
    label: "pessoas já estão aqui",
  },
  {
    kind: "static" as const,
    text: "4,7 ★",
    label: "nota média",
  },
  {
    kind: "counter" as const,
    to: 23,
    suffix: "",
    label: "bancos",
  },
];

export function SocialProof() {
  return (
    <section className="py-24 md:py-36 bg-background overflow-hidden">
      <div className="container mb-14">
        <Reveal>
          <h2 className="font-display text-display-lg text-foreground text-center mb-4">
            Quem já testou não
            <br />
            perde mais dinheiro
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mt-10">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="text-center">
                <p className="font-display text-2xl md:text-4xl text-foreground">
                  {s.kind === "counter" ? (
                    <Counter to={s.to} suffix={s.suffix} />
                  ) : (
                    <span>{s.text}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-snug px-1">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div
        style={
          { "--fade-from": "hsl(var(--background))" } as React.CSSProperties
        }
      >
        <InfiniteCarousel speed={50} direction="left">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name + t.quote.slice(0, 20)} {...t} />
          ))}
        </InfiniteCarousel>
      </div>
    </section>
  );
}
