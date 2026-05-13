import type { CalculatorDefinition } from "../types";
import { wrapCompute } from "../validate";
import { brl, fvCompound, fvSimple, pct, pmtPrice } from "../math";

const docCore = {
  edgeCases:
    "Taxa zero: montante cresce só com aportes lineares. Valores muito altos podem estourar precisão de ponto flutuante — use ordens de grandeza realistas.",
};

export const coreCalculators: CalculatorDefinition[] = [
  {
    slug: "juros-compostos",
    title: "Juros compostos",
    shortDescription:
      "Veja quanto seu dinheiro pode crescer com capital inicial, aportes mensais e taxa constante — projeção educativa em reais.",
    category: "core",
    doc: {
      formula: "VF = PV(1+r)^n + PMT × ((1+r)^n − 1) / r, com aportes no fim de cada período.",
      variables: "PV: capital inicial; PMT: aporte por período; r: taxa por período (decimal); n: número de períodos.",
      howToUse:
        "Use taxa mensal coerente com aportes mensais (ex.: 0,8% a.m. ≈ 0,008 em decimal). Prazo em anos é convertido para meses. Ajuste taxa em cenários separados (conservador vs otimista).",
      useCases: "Planejar reserva, objetivo de compra ou aposentadoria com contribuição recorrente.",
      edgeCases: docCore.edgeCases,
      oQueVoceVe: [
        "Resumo em uma frase com o saldo projetado no prazo escolhido.",
        "Total investido (inicial + aportes), juros acumulados e taxa usada.",
        "Gráfico de linha do saldo ao longo do tempo (eixo em meses).",
      ],
    },
    inputs: [
      { key: "pv", label: "Capital inicial", type: "currency", min: 0, max: 1e9, step: 100, defaultValue: 10_000 },
      { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 1e7, step: 50, defaultValue: 500 },
      { key: "rateMonthlyPct", label: "Taxa mensal", type: "percent", min: 0, max: 30, step: 0.05, defaultValue: 0.8 },
      { key: "years", label: "Prazo (anos)", type: "years", min: 0.25, max: 80, step: 0.25, defaultValue: 10 },
    ],
    compute: wrapCompute(
      [
        { key: "pv", label: "Capital inicial", type: "currency", min: 0, max: 1e9, step: 100, defaultValue: 10_000 },
        { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 1e7, step: 50, defaultValue: 500 },
        { key: "rateMonthlyPct", label: "Taxa mensal", type: "percent", min: 0, max: 30, step: 0.05, defaultValue: 0.8 },
        { key: "years", label: "Prazo (anos)", type: "years", min: 0.25, max: 80, step: 0.25, defaultValue: 10 },
      ],
      (v) => {
        const n = Math.round(v.years * 12);
        const r = v.rateMonthlyPct / 100;
        const fv = fvCompound(r, n, v.pv, v.pmt);
        const invested = v.pv + v.pmt * n;
        const interest = fv - invested;
        const points: { x: string; y: number }[] = [];
        const step = Math.max(1, Math.floor(n / 24));
        for (let m = 0; m <= n; m += step) {
          points.push({ x: `${m}m`, y: fvCompound(r, m, v.pv, v.pmt) });
        }
        if (points[points.length - 1]?.y !== fv) {
          points.push({ x: `${n}m`, y: fv });
        }
        const warnings: string[] = [];
        if (r === 0 && v.pmt === 0 && v.pv === 0) {
          warnings.push("Sem capital, taxa ou aportes, o saldo permanece zero.");
        }
        return {
          summary: `Em ${v.years} ano(s), o saldo projetado é ${brl(fv)}.`,
          figures: [
            { label: "Total investido", value: brl(invested) },
            { label: "Juros acumulados", value: brl(interest), hint: "Diferença entre saldo e aportes." },
            { label: "Taxa mensal usada", value: pct(r, 3) },
          ],
          interpretation: [
            interest >= 0
              ? "Quanto maior o prazo e a taxa, maior a parcela do saldo final explicada por juros compostos sobre aportes e capital inicial."
              : "Cenário com saldo final abaixo dos aportes acumulados não é típico com taxa não negativa — revise entradas.",
          ],
          warnings: warnings.length ? warnings : undefined,
          series: { label: "Saldo", points },
        };
      },
    ),
  },
  {
    slug: "juros-simples",
    title: "Juros simples",
    shortDescription:
      "Calcule montante final quando os juros incidem só sobre o principal — útil para contratos e simulações de curto prazo.",
    category: "core",
    doc: {
      formula: "VF = PV × (1 + i × n), onde i é a taxa por período e n o número de períodos.",
      variables: "PV: principal; i: taxa por período (ex.: ao mês); n: períodos na mesma base de i.",
      howToUse:
        "Mantenha a mesma base: taxa ao mês com prazo em meses. Se tiver taxa anual, converta antes (ex.: dividir por 12 só é aproximação linear; aqui o campo já é ao mês).",
      useCases: "Contratos em juros simples, linhas de crédito com regra linear, comparação rápida com juros compostos.",
      edgeCases:
        "Grandes n com i altos podem subestimar frente ao composto real; taxa zero retorna apenas o principal.",
      oQueVoceVe: [
        "Montante final e total de juros simples no período.",
        "Principal e taxa por período utilizada na conta.",
        "Gráficos para comparar visualmente os números que você digitou.",
      ],
    },
    inputs: [
      { key: "pv", label: "Principal", type: "currency", min: 0, max: 1e9, step: 100, defaultValue: 50_000 },
      { key: "ratePct", label: "Taxa ao mês", type: "percent", min: 0, max: 50, step: 0.01, defaultValue: 1.2 },
      { key: "months", label: "Prazo (meses)", type: "months", min: 1, max: 600, step: 1, defaultValue: 24 },
    ],
    compute: wrapCompute(
      [
        { key: "pv", label: "Principal", type: "currency", min: 0, max: 1e9, step: 100, defaultValue: 50_000 },
        { key: "ratePct", label: "Taxa ao mês", type: "percent", min: 0, max: 50, step: 0.01, defaultValue: 1.2 },
        { key: "months", label: "Prazo (meses)", type: "months", min: 1, max: 600, step: 1, defaultValue: 24 },
      ],
      (v) => {
        const i = v.ratePct / 100;
        const fv = fvSimple(i, v.months, v.pv);
        const juros = fv - v.pv;
        return {
          summary: `Montante final: ${brl(fv)} (${brl(juros)} de juros simples).`,
          figures: [
            { label: "Principal", value: brl(v.pv) },
            { label: "Juros totais", value: brl(juros) },
            { label: "Taxa por período", value: pct(i, 3) },
          ],
          interpretation: [
            `Juro linear: em cada período incide ${brl(v.pv * i)} sobre o principal (aprox.), totalizando ${brl(juros)} em ${v.months} períodos.`,
          ],
        };
      },
    ),
  },
  {
    slug: "simulador-investimento",
    title: "Simulador de investimento",
    shortDescription:
      "Projete patrimônio com aportes mensais e retorno médio constante — entenda quanto vem de contribuição e quanto de rendimento (modelo educativo).",
    category: "core",
    doc: {
      formula: "Mesma da capitalização composta com aportes no fim do período.",
      variables: "Saldo inicial, aporte, taxa esperada por período, horizonte.",
      howToUse:
        "Faça uma simulação com taxa conservadora e repita com taxa maior ou menor para ver sensibilidade. Não misture taxa real pós-inflação com nominal sem critério.",
      useCases: "Objetivos de compra, reserva, visão de longo prazo com disciplina de aporte.",
      edgeCases: docCore.edgeCases,
      oQueVoceVe: [
        "Saldo projetado no horizonte e quanto disso é aporte acumulado vs ganho de capital/juros.",
        "Interpretação sobre limites do modelo (sem taxas, impostos ou volatilidade).",
        "Série temporal do saldo para acompanhar a curva.",
      ],
    },
    inputs: [
      { key: "pv", label: "Patrimônio hoje", type: "currency", min: 0, max: 1e9, step: 100, defaultValue: 5_000 },
      { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 1e7, step: 50, defaultValue: 800 },
      { key: "rateMonthlyPct", label: "Retorno médio mensal", type: "percent", min: 0, max: 25, step: 0.05, defaultValue: 0.6 },
      { key: "years", label: "Horizonte (anos)", type: "years", min: 1, max: 50, step: 1, defaultValue: 15 },
    ],
    compute: wrapCompute(
      [
        { key: "pv", label: "Patrimônio hoje", type: "currency", min: 0, max: 1e9, step: 100, defaultValue: 5_000 },
        { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 1e7, step: 50, defaultValue: 800 },
        { key: "rateMonthlyPct", label: "Retorno médio mensal", type: "percent", min: 0, max: 25, step: 0.05, defaultValue: 0.6 },
        { key: "years", label: "Horizonte (anos)", type: "years", min: 1, max: 50, step: 1, defaultValue: 15 },
      ],
      (v) => {
        const n = Math.round(v.years * 12);
        const r = v.rateMonthlyPct / 100;
        const fv = fvCompound(r, n, v.pv, v.pmt);
        const invested = v.pv + v.pmt * n;
        return {
          summary: `Projeção: ${brl(fv)} após ${v.years} anos com retorno médio de ${pct(r, 2)} ao mês (hipótese constante).`,
          figures: [
            { label: "Contribuições acumuladas", value: brl(invested) },
            { label: "Ganho de capital + juros", value: brl(fv - invested) },
          ],
          interpretation: [
            "Este modelo não inclui inflação, impostos, taxas de custódia ou volatilidade — trate como referência pedagógica.",
          ],
        };
      },
    ),
  },
  {
    slug: "simulador-financiamento",
    title: "Simulador de financiamento",
    shortDescription:
      "Estime prestação fixa (Sistema Price), total pago e custo financeiro — base para comparar ofertas antes da assinatura.",
    category: "core",
    doc: {
      formula: "PMT = PV × r(1+r)^n / ((1+r)^n − 1), pagamentos no fim do período.",
      variables: "PV: valor financiado; r: taxa a.m.; n: parcelas.",
      howToUse:
        "Informe o valor líquido financiado (após entrada). Prefira taxa efetiva mensal próxima da CET; o simulador não inclui IOF, seguros nem TAC.",
      useCases: "Imóvel, veículo, consignado com parcela estável.",
      edgeCases: "Taxa ~0 aproxima PMT = PV/n. n muito grande aumenta sensibilidade a pequenas mudanças de taxa.",
      oQueVoceVe: [
        "Valor da parcela, total desembolsado e juros totais no modelo Price.",
        "Leitura da participação dos juros no total pago.",
        "Aviso de que a CET real do contrato pode ser maior.",
      ],
    },
    inputs: [
      { key: "pv", label: "Valor financiado", type: "currency", min: 1_000, max: 5e7, step: 500, defaultValue: 300_000 },
      { key: "rateMonthlyPct", label: "Taxa de juros (a.m.)", type: "percent", min: 0.01, max: 15, step: 0.01, defaultValue: 0.99 },
      { key: "months", label: "Parcelas", type: "months", min: 6, max: 480, step: 1, defaultValue: 360 },
    ],
    compute: wrapCompute(
      [
        { key: "pv", label: "Valor financiado", type: "currency", min: 1_000, max: 5e7, step: 500, defaultValue: 300_000 },
        { key: "rateMonthlyPct", label: "Taxa de juros (a.m.)", type: "percent", min: 0.01, max: 15, step: 0.01, defaultValue: 0.99 },
        { key: "months", label: "Parcelas", type: "months", min: 6, max: 480, step: 1, defaultValue: 360 },
      ],
      (v) => {
        const r = v.rateMonthlyPct / 100;
        const pmt = pmtPrice(r, v.months, v.pv);
        const total = pmt * v.months;
        const juros = total - v.pv;
        return {
          summary: `Prestação estimada: ${brl(pmt)}; custo financeiro total: ${brl(juros)}.`,
          figures: [
            { label: "Prestação", value: brl(pmt) },
            { label: "Total pago", value: brl(total) },
            { label: "Juros + encargos implícitos no modelo", value: brl(juros), hint: "Sem IOF/tac aqui." },
          ],
          interpretation: [
            `Ao longo de ${v.months} meses você desembolsa ${brl(total)}, sendo ${pct(juros / total, 1)} do total em juros no modelo Price puro.`,
          ],
          warnings: ["CET real do contrato pode ser maior por seguros, TAC e IOF."],
        };
      },
    ),
  },
  {
    slug: "simulador-emprestimo",
    title: "Simulador de empréstimo",
    shortDescription:
      "Descubra parcela aproximada, total a pagar e juros — use o valor líquido que cai na conta e a taxa efetiva mensal.",
    category: "core",
    doc: {
      formula: "Mesma estrutura de financiamento: PV líquido creditado, taxa efetiva, n parcelas.",
      variables: "Principal líquido, taxa mensal efetiva, número de parcelas.",
      howToUse:
        "Informe o crédito líquido após tarifas descontadas na origem. Compare sempre a CET entre bancos; aqui o modelo é fluxo fixo tipo Price.",
      useCases: "Empréstimo pessoal, refinanciamento, consignado.",
      edgeCases: "Descontos upfront reduzem PV efetivo — ajuste manualmente o principal se necessário.",
      oQueVoceVe: [
        "Parcela estimada, juros totais e principal tomado.",
        "Indicador simples de quanto você devolve por R$ 1,00 tomado no fluxo nominal.",
        "Gráficos para visualizar entradas e magnitudes do resultado.",
      ],
    },
    inputs: [
      { key: "pv", label: "Valor líquido do crédito", type: "currency", min: 500, max: 2e7, step: 100, defaultValue: 20_000 },
      { key: "rateMonthlyPct", label: "Taxa a.m.", type: "percent", min: 0.05, max: 25, step: 0.05, defaultValue: 2.5 },
      { key: "months", label: "Parcelas", type: "months", min: 3, max: 120, step: 1, defaultValue: 24 },
    ],
    compute: wrapCompute(
      [
        { key: "pv", label: "Valor líquido do crédito", type: "currency", min: 500, max: 2e7, step: 100, defaultValue: 20_000 },
        { key: "rateMonthlyPct", label: "Taxa a.m.", type: "percent", min: 0.05, max: 25, step: 0.05, defaultValue: 2.5 },
        { key: "months", label: "Parcelas", type: "months", min: 3, max: 120, step: 1, defaultValue: 24 },
      ],
      (v) => {
        const r = v.rateMonthlyPct / 100;
        const pmt = pmtPrice(r, v.months, v.pv);
        const total = pmt * v.months;
        const juros = total - v.pv;
        return {
          summary: `Parcela ${brl(pmt)}; você devolve ${brl(total)} no total.`,
          figures: [
            { label: "Parcela", value: brl(pmt) },
            { label: "Juros pagos (modelo)", value: brl(juros) },
            { label: "Principal", value: brl(v.pv) },
          ],
          interpretation: [
            `Custo relativo: para cada R$ 1,00 tomado, você paga cerca de R$ ${(total / v.pv).toFixed(2)} no fluxo nominal simulado.`,
          ],
        };
      },
    ),
  },
];
