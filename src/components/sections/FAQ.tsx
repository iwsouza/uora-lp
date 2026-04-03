"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "O que é Open Finance e por que o Uora usa?",
    a: "É o jeito regulado pelo Banco Central de você autorizar o compartilhamento dos seus dados com apps de confiança — com segurança e rastreio. Pra gente, isso é o que permite enxergar o fluxo do seu dinheiro em tempo quase real e te cutucar antes do aperto, em vez de só mostrar extrato depois que a conta já sentiu.",
  },
  {
    q: "Dá pra conectar mais de um banco?",
    a: "Dá. No Básico é 1 banco; no Pro até 5; no Premium, ilimitado. Quanto mais contas entram, mais a foto fecha — e alertas e projeções ficam mais fiéis ao seu dia a dia.",
  },
  {
    q: "Vocês pedem senha do banco?",
    a: "Não. A autorização é feita no app do seu banco, no fluxo oficial do Open Finance. A gente não coleta senha de acesso — o que não existe aqui não vaza.",
  },
  {
    q: "O Uora movimenta dinheiro por mim?",
    a: "Não. O acesso é só leitura: saldo e movimentações pra você enxergar padrão e receber aviso no tempo certo. Pix, TED, pagamento de boleto — isso continua 100% com você, no banco.",
  },
  {
    q: "Tudo precisa ser lançado na mão?",
    a: "Não. Com o Open Finance a maior parte entra sozinha. Se pintar dinheiro vivo, gasto fora da conta ou qualquer coisa que não apareça no banco, você complementa manual — mas o foco é você gastar energia olhando pra frente, não digitando o passado.",
  },
  {
    q: "Como cancelo a assinatura?",
    a: "Pelo app, quando quiser. Sem multa e sem enrolação — a ideia é você ficar porque o produto resolve, não porque ficou preso.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-36 bg-background">
      <div className="container max-w-2xl">
        <Reveal>
          <h2 className="font-display text-display-lg text-foreground text-center mb-14">
            Perguntas frequentes
          </h2>
        </Reveal>

        <div className="space-y-2">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground pr-4">{f.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    >
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
