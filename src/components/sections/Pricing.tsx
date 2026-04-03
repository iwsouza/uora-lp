"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: { m: 19, y: 15 },
    desc: "Para começar a organizar suas finanças",
    features: [
      { t: "Análise com IA", ok: true },
      { t: "1 banco conectado", ok: true },
      { t: "Dashboard básico", ok: true },
      { t: "Limite de conversas", ok: true },
      { t: "Alertas inteligentes", ok: false },
      { t: "Relatórios avançados", ok: false },
    ],
    cta: "Começar agora",
    pop: false,
  },
  {
    name: "Pro",
    price: { m: 39, y: 31 },
    desc: "Conecte até 5 bancos com controle avançado",
    features: [
      { t: "Até 5 bancos conectados", ok: true },
      { t: "Conversas ilimitadas", ok: true },
      { t: "Alertas inteligentes", ok: true },
      { t: "Lembretes de pagamentos", ok: true },
      { t: "Relatórios personalizados", ok: true },
      { t: "Categorias ilimitadas", ok: true },
    ],
    cta: "Seja Pro",
    pop: true,
  },
  {
    name: "Premium",
    price: { m: 199, y: 159 },
    desc: "Bancos ilimitados e visão completa",
    features: [
      { t: "Tudo do Pro", ok: true },
      { t: "Bancos ilimitados", ok: true },
      { t: "Assessor dedicado", ok: true },
      { t: "Acesso prioritário a novidades", ok: true },
      { t: "Suporte premium", ok: true },
      { t: "Estratégia personalizada", ok: true },
    ],
    cta: "Assine o Premium",
    pop: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section className="py-24 md:py-36 bg-card" id="planos">
      <div className="container">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-display-lg text-foreground mb-3">
              Seja membro da Uora
            </h2>
            <p className="text-muted-foreground text-base">
              Selecione o plano perfeito para entender seu dinheiro
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-14">
            <button
              onClick={() => setYearly(true)}
              className={`text-sm px-4 py-2 rounded-full transition-all ${yearly ? "bg-foreground text-background font-medium" : "text-muted-foreground"}`}
            >
              Anual <span className="text-[10px] opacity-70">ATÉ 20% OFF</span>
            </button>
            <button
              onClick={() => setYearly(false)}
              className={`text-sm px-4 py-2 rounded-full transition-all ${!yearly ? "bg-foreground text-background font-medium" : "text-muted-foreground"}`}
            >
              Mensal
            </button>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div
                className={`rounded-3xl p-8 h-full flex flex-col border transition-all duration-300 ${
                  plan.pop
                    ? "bg-foreground text-background border-foreground shadow-2xl md:-mt-4 md:pb-12"
                    : "bg-background border-border"
                }`}
              >
                {plan.pop && (
                  <span className="inline-flex self-start text-[10px] font-semibold uppercase tracking-widest text-background/60 bg-background/10 px-3 py-1 rounded-full mb-4">
                    Mais Popular
                  </span>
                )}
                <h3
                  className={`font-display text-xl ${plan.pop ? "text-background" : "text-foreground"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-xs mt-1 mb-5 ${plan.pop ? "text-background/50" : "text-muted-foreground"}`}
                >
                  {plan.desc}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={yearly ? "y" : "m"}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6"
                  >
                    {plan.price.m === 0 ? (
                      <span
                        className={`text-3xl font-display ${plan.pop ? "text-background" : "text-foreground"}`}
                      >
                        Grátis
                      </span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-3xl font-display ${plan.pop ? "text-background" : "text-foreground"}`}
                        >
                          R$ {yearly ? plan.price.y : plan.price.m}
                        </span>
                        <span
                          className={`text-sm ${plan.pop ? "text-background/50" : "text-muted-foreground"}`}
                        >
                          /mês
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.t} className="flex items-start gap-2.5 text-sm">
                      {f.ok ? (
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${plan.pop ? "text-green-positive" : "text-green-positive"}`}
                        />
                      ) : (
                        <X
                          className={`w-4 h-4 mt-0.5 shrink-0 ${plan.pop ? "text-background/20" : "text-muted-foreground/30"}`}
                        />
                      )}
                      <span
                        className={
                          f.ok
                            ? plan.pop
                              ? "text-background/80"
                              : "text-foreground/80"
                            : plan.pop
                              ? "text-background/30"
                              : "text-muted-foreground/40"
                        }
                      >
                        {f.t}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className={`pill-button w-full py-3.5 text-sm font-medium ${
                    plan.pop
                      ? "bg-background text-foreground"
                      : "pill-button-outline"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
