"use client";

import { Reveal } from "@/components/Reveal";
import { InfiniteCarousel } from "@/components/ui/InfiniteCarousel";
import {
  Shield,
  Brain,
  BarChart3,
  Bell,
  Sparkles,
  TrendingUp,
  PieChart,
  Zap,
} from "lucide-react";

const capabilities = [
  {
    icon: Shield,
    title: "Criptografia de Ponta a Ponta",
    desc: "Seus dados protegidos com segurança de nível bancário.",
    accent: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-600",
  },
  {
    icon: Brain,
    title: "99.9% de Precisão",
    desc: "IA que entende português e categoriza gastos automaticamente.",
    accent: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-600",
  },
  {
    icon: BarChart3,
    title: "Dashboard Profissional",
    desc: "Gráficos e relatórios inteligentes sobre todas as suas transações.",
    accent: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-600",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    desc: "Lembretes de contas, metas e gastos fora do padrão.",
    accent: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-600",
  },
  {
    icon: Sparkles,
    title: "Insights Personalizados",
    desc: "A IA aprende seus hábitos e sugere melhorias reais.",
    accent: "from-rose-500/10 to-rose-500/5",
    iconColor: "text-rose-600",
  },
  {
    icon: TrendingUp,
    title: "Evolução Patrimonial",
    desc: "Acompanhe o crescimento do seu dinheiro ao longo do tempo.",
    accent: "from-teal-500/10 to-teal-500/5",
    iconColor: "text-teal-600",
  },
  {
    icon: PieChart,
    title: "Categorias Automáticas",
    desc: "Use as que já vêm prontas ou crie quantas quiser.",
    accent: "from-indigo-500/10 to-indigo-500/5",
    iconColor: "text-indigo-600",
  },
  {
    icon: Zap,
    title: "Open Finance",
    desc: "Conecte seus bancos de forma segura e automática.",
    accent: "from-orange-500/10 to-orange-500/5",
    iconColor: "text-orange-600",
  },
];

function CapabilityCard({
  icon: Icon,
  title,
  desc,
  accent,
  iconColor,
}: (typeof capabilities)[0]) {
  return (
    <div className="w-[280px] md:w-[320px] group">
      <div
        className={`relative rounded-3xl p-7 h-full bg-gradient-to-br ${accent} border border-dark-section-foreground/[0.06] backdrop-blur-sm transition-all duration-500 hover:border-dark-section-foreground/15 hover:scale-[1.02]`}
      >
        <div
          className={`w-11 h-11 rounded-2xl bg-dark-section-foreground/[0.06] flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110`}
        >
          <Icon className={`w-5 h-5 ${iconColor} opacity-80`} />
        </div>
        <h3 className="font-semibold text-[15px] text-dark-section-foreground mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-[13px] text-dark-section-foreground/50 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function TrustBadges() {
  return (
    <section
      className="section-dark py-24 md:py-36 rounded-[2rem] mx-3 md:mx-5"
      id="funcionalidades"
    >
      <div className="text-center mb-16 px-5">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-dark-section-foreground/40 mb-4">
            Pare de perder dinheiro
          </p>
          <h2 className="font-display text-display-lg text-dark-section-foreground">
            24 horas trabalhando pra você
          </h2>
        </Reveal>
      </div>

      <div
        className="mb-5"
        style={
          { "--fade-from": "hsl(var(--dark-section))" } as React.CSSProperties
        }
      >
        <InfiniteCarousel speed={40} direction="left">
          {capabilities.slice(0, 4).map((c) => (
            <CapabilityCard key={c.title} {...c} />
          ))}
        </InfiniteCarousel>
      </div>

      <div
        style={
          { "--fade-from": "hsl(var(--dark-section))" } as React.CSSProperties
        }
      >
        <InfiniteCarousel speed={45} direction="right">
          {capabilities.slice(4).map((c) => (
            <CapabilityCard key={c.title} {...c} />
          ))}
        </InfiniteCarousel>
      </div>

      <Reveal delay={0.3}>
        <div className="flex justify-center mt-14 px-5">
          <a
            href="#planos"
            className="pill-button bg-primary-foreground text-foreground px-8 py-3.5 text-sm font-medium"
          >
            Quero mudar minha vida financeira →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
