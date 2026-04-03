"use client";

import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  PieChart,
  Bell,
  Layers,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Controle automático",
    desc: "Registre gastos e receitas automaticamente. O Uora categoriza tudo pra você.",
  },
  {
    icon: TrendingUp,
    title: "Dashboard profissional",
    desc: "Gráficos de fluxo de caixa, organização automática e visão completa.",
  },
  {
    icon: PieChart,
    title: "Categorias personalizadas",
    desc: "Use as que já vêm prontas ou crie quantas quiser.",
  },
  {
    icon: Layers,
    title: "Conecte seus bancos",
    desc: "Integração oficial com Open Finance. Dados sincronizados.",
  },
  {
    icon: Bell,
    title: "Nunca esqueça uma conta",
    desc: "Lembretes inteligentes de contas a pagar e compromissos.",
  },
  {
    icon: Target,
    title: "Educação financeira",
    desc: "Metas de economia e dicas personalizadas para alcançá-las.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-32 md:py-44 bg-background" id="como-funciona">
      <div className="container max-w-5xl">
        <Reveal>
          <div className="text-center mb-24">
            <h2 className="font-display text-display-xl text-foreground">
              Tudo que você precisa
            </h2>
            <h2 className="font-display text-display-xl text-muted-foreground/40">
              Nada que não precisa
            </h2>
          </div>
        </Reveal>

        <div className="space-y-0">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <motion.div
                className="group grid grid-cols-[auto_1fr] md:grid-cols-[60px_240px_1fr] items-center gap-5 md:gap-8 py-7 border-b border-border/60 cursor-default"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center transition-colors duration-300 group-hover:bg-foreground group-hover:border-foreground">
                  <f.icon className="w-[18px] h-[18px] text-muted-foreground transition-colors duration-300 group-hover:text-background" />
                </div>
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed col-start-2 md:col-start-3 -mt-2 md:mt-0">
                  {f.desc}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
