"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

const CalculatorPage = () => {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(300);
  const [rate, setRate] = useState(1);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const months = years * 12;
    const r = rate / 100;
    let total = initial;
    let totalInvested = initial;
    const chartData: { month: number; total: number; invested: number }[] = [];

    for (let m = 1; m <= months; m++) {
      total = total * (1 + r) + monthly;
      totalInvested += monthly;
      if (m % Math.max(1, Math.floor(months / 24)) === 0 || m === months) {
        chartData.push({ month: m, total: Math.round(total), invested: Math.round(totalInvested) });
      }
    }

    return {
      finalAmount: total,
      totalInvested,
      totalInterest: total - totalInvested,
      chartData,
    };
  }, [initial, monthly, rate, years]);

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
  const maxChart = Math.max(...result.chartData.map((d) => d.total));

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="font-display text-xl tracking-tight">
            <span className="bg-foreground text-background px-3 py-1.5 rounded-full text-sm font-body font-medium">
              uora
            </span>
          </Link>
          <Link href="/" className="pill-button-outline px-5 py-2 text-sm">
            ← Voltar ao início
          </Link>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">Ferramenta gratuita</p>
            <h1 className="font-display text-display-xl text-foreground mb-4">
              Calculadora de<br />
              <span className="text-muted-foreground/40">Juros Compostos</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Descubra quanto seu dinheiro pode render com o poder dos juros compostos. Simule agora e veja o impacto no seu futuro.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-border bg-card p-8"
            >
              <h2 className="font-display text-lg text-foreground mb-8">Simule seu investimento</h2>

              <div className="space-y-8">
                <InputSlider
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Investimento inicial"
                  value={initial}
                  onChange={setInitial}
                  min={0}
                  max={100000}
                  step={500}
                  format={fmt}
                />
                <InputSlider
                  icon={<Calendar className="w-4 h-4" />}
                  label="Aporte mensal"
                  value={monthly}
                  onChange={setMonthly}
                  min={0}
                  max={10000}
                  step={50}
                  format={fmt}
                />
                <InputSlider
                  icon={<Percent className="w-4 h-4" />}
                  label="Taxa de juros (mensal)"
                  value={rate}
                  onChange={setRate}
                  min={0.1}
                  max={3}
                  step={0.1}
                  format={(v) => `${v.toFixed(1)}%`}
                />
                <InputSlider
                  icon={<TrendingUp className="w-4 h-4" />}
                  label="Período (anos)"
                  value={years}
                  onChange={setYears}
                  min={1}
                  max={40}
                  step={1}
                  format={(v) => `${v} anos`}
                />
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-5"
            >
              {/* Summary cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-3xl bg-foreground text-background p-8">
                  <p className="text-xs text-background/50 uppercase tracking-widest mb-1">Montante final</p>
                  <p className="font-display text-3xl md:text-4xl tracking-tight">{fmt(result.finalAmount)}</p>
                  <p className="text-xs text-green-positive mt-2 font-medium">
                    +{((result.finalAmount / result.totalInvested - 1) * 100).toFixed(0)}% de retorno total
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Total investido</p>
                    <p className="font-display text-lg text-foreground">{fmt(result.totalInvested)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Juros ganhos</p>
                    <p className="font-display text-lg text-green-positive">{fmt(result.totalInterest)}</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">Evolução do patrimônio</p>
                <div className="flex items-end gap-[2px] h-[180px]">
                  {result.chartData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-[1px] group relative">
                      {/* Interest portion */}
                      <motion.div
                        className="w-full bg-accent/60 rounded-t-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${((d.total - d.invested) / maxChart) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.02 }}
                      />
                      {/* Invested portion */}
                      <motion.div
                        className="w-full bg-foreground/20 rounded-b-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.invested / maxChart) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.02 }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-foreground text-background text-[9px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {fmt(d.total)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-[9px] text-muted-foreground">Hoje</span>
                  <span className="text-[9px] text-muted-foreground">{years} anos</span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-foreground/20" />
                    <span className="text-[10px] text-muted-foreground">Investido</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-accent/60" />
                    <span className="text-[10px] text-muted-foreground">Juros</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Educational content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <h2 className="font-display text-display-md text-foreground text-center mb-8">
              O que são juros compostos?
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              <p>
                Juros compostos são os <strong className="text-foreground">juros sobre juros</strong>. 
                Diferente dos juros simples, que incidem apenas sobre o valor inicial, os juros compostos 
                são calculados sobre o valor acumulado — fazendo seu dinheiro crescer exponencialmente.
              </p>
              <p>
                Albert Einstein supostamente chamou os juros compostos de{' '}
                <em>&ldquo;a oitava maravilha do mundo&rdquo;</em>. 
                Quanto mais cedo você começa, maior o efeito. O tempo é o ingrediente mais poderoso.
              </p>
              <p>
                Com o <strong className="text-foreground">Uora</strong>, você acompanha a evolução do seu patrimônio 
                em tempo real e recebe insights da IA sobre como otimizar seus investimentos.
              </p>
            </div>

            <div className="mt-10 text-center">
              <Link href="/" className="pill-button-dark px-8 py-3.5 text-sm font-medium">
                Organizar minhas finanças com o Uora →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

function InputSlider({
  icon,
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm font-semibold text-foreground tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-foreground [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
      />
    </div>
  );
}

export default CalculatorPage;
