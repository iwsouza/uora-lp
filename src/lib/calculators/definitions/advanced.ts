import type { CalculatorDefinition } from "../types";
import { wrapCompute } from "../validate";
import { brl, fvCompound, nperCompound, pct } from "../math";

function monthsToReach(
  rateMonthly: number,
  pv: number,
  pmt: number,
  target: number,
): { months: number; capped: boolean } {
  const maxN = 1200;
  if (!Number.isFinite(target) || target <= 0) return { months: 0, capped: false };
  if (target <= pv) return { months: 0, capped: false };
  if (fvCompound(rateMonthly, maxN, pv, pmt) < target - 1e-6) {
    return { months: maxN, capped: true };
  }
  const n = nperCompound(rateMonthly, pv, pmt, target, maxN);
  if (!Number.isFinite(n) || n > maxN) return { months: maxN, capped: true };
  return { months: Math.max(0, Math.ceil(n)), capped: false };
}

export const advancedCalculators: CalculatorDefinition[] = [
  {
    slug: "crescimento-patrimonio",
    title: "Crescimento de patrimônio",
    shortDescription:
      "Acompanhe a curva do patrimônio com aportes mensais e retorno médio constante — útil para marcos e conversas de planejamento.",
    category: "advanced",
    doc: {
      formula: "VF = PV(1+r)^n + PMT × ((1+r)^n − 1) / r.",
      variables: "Patrimônio inicial, fluxo de contribuição mensal, taxa mensal líquida, anos.",
      howToUse:
        "Trate taxa como média líquida de longo prazo. Separe reserva de curto prazo do “PV investido” para não misturar liquidez com horizonte longo.",
      useCases: "Marcos de patrimônio, alinhar expectativas, visão com assessor.",
      edgeCases: "Grandes aportes irregulares não são modelados; volatilidade pode desviar fortemente da curva média.",
      oQueVoceVe: [
        "Patrimônio no último ano simulado e quanto disso é contribuição vs rendimento composto.",
        "Gráfico anual do patrimônio.",
        "Interpretação sobre aceleração da curva quando r > 0.",
      ],
    },
    inputs: [
      { key: "pv", label: "Patrimônio atual", type: "currency", min: 0, max: 5e9, step: 500, defaultValue: 120_000 },
      { key: "pmt", label: "Contribuição mensal líquida", type: "currency", min: 0, max: 2e7, step: 100, defaultValue: 4_000 },
      { key: "rateMonthlyPct", label: "Retorno mensal médio", type: "percent", min: 0, max: 15, step: 0.05, defaultValue: 0.55 },
      { key: "years", label: "Horizonte (anos)", type: "years", min: 1, max: 50, step: 1, defaultValue: 20 },
    ],
    compute: wrapCompute(
      [
        { key: "pv", label: "Patrimônio atual", type: "currency", min: 0, max: 5e9, step: 500, defaultValue: 120_000 },
        { key: "pmt", label: "Contribuição mensal líquida", type: "currency", min: 0, max: 2e7, step: 100, defaultValue: 4_000 },
        { key: "rateMonthlyPct", label: "Retorno mensal médio", type: "percent", min: 0, max: 15, step: 0.05, defaultValue: 0.55 },
        { key: "years", label: "Horizonte (anos)", type: "years", min: 1, max: 50, step: 1, defaultValue: 20 },
      ],
      (v) => {
        const n = Math.round(v.years * 12);
        const r = v.rateMonthlyPct / 100;
        const fv = fvCompound(r, n, v.pv, v.pmt);
        const points: { x: string; y: number }[] = [];
        for (let y = 0; y <= v.years; y++) {
          points.push({ x: `${y}a`, y: fvCompound(r, y * 12, v.pv, v.pmt) });
        }
        return {
          summary: `Patrimônio projetado em ${v.years} anos: ${brl(fv)}.`,
          figures: [
            { label: "Contribuições acumuladas", value: brl(v.pv + v.pmt * n) },
            { label: "Ganhos compostos", value: brl(fv - (v.pv + v.pmt * n)) },
          ],
          interpretation: [
            "A curva acelera com o tempo quando r > 0: os juros passam a empurrar a maior parte do crescimento.",
          ],
          series: { label: "Patrimônio", points },
        };
      },
    ),
  },
  {
    slug: "independencia-financeira",
    title: "Independência financeira",
    shortDescription:
      "Transforme seu custo de vida mensal em meta de patrimônio (taxa de resgate segura) e veja quanto tempo leva com seus aportes.",
    category: "advanced",
    doc: {
      formula: "Alvo ≈ (Despesa mensal × 12) / SWR anual; meses até alvo com capitalização e aportes.",
      variables: "Despesas mensais totais, taxa de resgate segura anual (SWR), patrimônio hoje, aporte mensal, retorno mensal esperado.",
      howToUse:
        "SWR comum em estudos: 3% a 4% ao ano. Despesas devem refletir o estilo de vida que você quer na independência, não só o de hoje.",
      useCases: "Traduzir lifestyle em número, priorizar cortes com maior impacto no alvo.",
      edgeCases: "Mercados reais violam retorno constante; considere colchão extra e renda variável.",
      oQueVoceVe: [
        "Patrimônio-alvo implícito pelo SWR e renda anual desejada.",
        "Prazo estimado em meses e anos com os aportes e retorno assumidos.",
        "Alertas quando o alvo não fecha no horizonte máximo simulado.",
      ],
    },
    inputs: [
      { key: "expenseMonthly", label: "Despesas mensais (independência)", type: "currency", min: 500, max: 2e6, step: 100, defaultValue: 12_000 },
      { key: "swrAnnualPct", label: "Taxa de resgate anual (SWR %)", type: "percent", min: 2, max: 8, step: 0.25, defaultValue: 4 },
      { key: "pv", label: "Patrimônio investido hoje", type: "currency", min: 0, max: 5e9, step: 500, defaultValue: 350_000 },
      { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 2e7, step: 100, defaultValue: 6_000 },
      { key: "rateMonthlyPct", label: "Retorno mensal esperado", type: "percent", min: 0, max: 10, step: 0.05, defaultValue: 0.5 },
    ],
    compute: wrapCompute(
      [
        { key: "expenseMonthly", label: "Despesas mensais (independência)", type: "currency", min: 500, max: 2e6, step: 100, defaultValue: 12_000 },
        { key: "swrAnnualPct", label: "Taxa de resgate anual (SWR %)", type: "percent", min: 2, max: 8, step: 0.25, defaultValue: 4 },
        { key: "pv", label: "Patrimônio investido hoje", type: "currency", min: 0, max: 5e9, step: 500, defaultValue: 350_000 },
        { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 2e7, step: 100, defaultValue: 6_000 },
        { key: "rateMonthlyPct", label: "Retorno mensal esperado", type: "percent", min: 0, max: 10, step: 0.05, defaultValue: 0.5 },
      ],
      (v) => {
        const swr = v.swrAnnualPct / 100;
        const annualNeed = v.expenseMonthly * 12;
        const target = annualNeed / swr;
        const r = v.rateMonthlyPct / 100;
        const { months, capped } = monthsToReach(r, v.pv, v.pmt, target);
        const years = (months / 12).toFixed(1);
        return {
          summary: `Patrimônio-alvo (SWR ${pct(swr, 2)} a.a.): ${brl(target)} — prazo estimado ${years} anos (${months} meses).`,
          figures: [
            { label: "Meta de capital", value: brl(target) },
            { label: "Renda anual desejada", value: brl(annualNeed) },
            { label: "Meses para atingir (modelo)", value: String(months) },
          ],
          interpretation: [
            "SWR é heurística histórica, não promessa: combine com renda flexível, seguridade social ou trabalhos parciais.",
          ],
          warnings: capped
            ? ["Em 100 anos de simulação o alvo não foi atingido — aumente aportes, reduza despesas ou revise retorno."]
            : v.pmt === 0 && v.pv < target
              ? ["Sem aportes, o prazo pode ser muito longo ou infinito se o retorno não cobrir o alvo."]
              : undefined,
        };
      },
    ),
  },
  {
    slug: "fire",
    title: "FIRE (aposentadoria antecipada)",
    shortDescription:
      "Defina despesas mensais na aposentadoria e um múltiplo da despesa anual (ex.: 25×) para obter o patrimônio-alvo e o prazo com aportes.",
    category: "advanced",
    doc: {
      formula: "Alvo = Despesa anual × múltiplo (ex.: 25 para ~4% SWR implícito).",
      variables: "Despesa mensal desejada na aposentadoria, múltiplo anual, patrimônio atual, aporte, retorno mensal.",
      howToUse:
        "Múltiplo 25 ≈ resgatar ~4% ao ano do patrimônio; múltiplo 33 ≈ ~3% ao ano, mais conservador. Ajuste despesa ao custo de vida futuro desejado.",
      useCases: "Planejar saída antecipada do trabalho tradicional, compatibilizar com renda variável.",
      edgeCases: "Saúde, imprevistos e mudança de país alteram despesas — revise o alvo periodicamente.",
      oQueVoceVe: [
        "Meta de capital e taxa de resgate implícita a partir do múltiplo.",
        "Prazo estimado para atingir a meta com aportes e retorno assumidos.",
        "Lembrete de que FIRE envolve liquidez, seguros e imóveis além do número.",
      ],
    },
    inputs: [
      { key: "expenseMonthly", label: "Despesas mensais na FIRE", type: "currency", min: 500, max: 2e6, step: 100, defaultValue: 9_000 },
      { key: "multiplier", label: "Múltiplo da despesa anual", type: "number", min: 15, max: 50, step: 1, defaultValue: 25 },
      { key: "pv", label: "Patrimônio hoje", type: "currency", min: 0, max: 5e9, step: 500, defaultValue: 280_000 },
      { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 2e7, step: 100, defaultValue: 7_500 },
      { key: "rateMonthlyPct", label: "Retorno mensal esperado", type: "percent", min: 0, max: 10, step: 0.05, defaultValue: 0.48 },
    ],
    compute: wrapCompute(
      [
        { key: "expenseMonthly", label: "Despesas mensais na FIRE", type: "currency", min: 500, max: 2e6, step: 100, defaultValue: 9_000 },
        { key: "multiplier", label: "Múltiplo da despesa anual", type: "number", min: 15, max: 50, step: 1, defaultValue: 25 },
        { key: "pv", label: "Patrimônio hoje", type: "currency", min: 0, max: 5e9, step: 500, defaultValue: 280_000 },
        { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 2e7, step: 100, defaultValue: 7_500 },
        { key: "rateMonthlyPct", label: "Retorno mensal esperado", type: "percent", min: 0, max: 10, step: 0.05, defaultValue: 0.48 },
      ],
      (v) => {
        const target = v.expenseMonthly * 12 * v.multiplier;
        const r = v.rateMonthlyPct / 100;
        const { months, capped } = monthsToReach(r, v.pv, v.pmt, target);
        const impliedSwr = 100 / v.multiplier;
        return {
          summary: `Alvo FIRE: ${brl(target)} (~${impliedSwr.toFixed(2)}% a.a. de resgate implícito). Prazo ~${(months / 12).toFixed(1)} anos.`,
          figures: [
            { label: "Meta", value: brl(target) },
            { label: "Meses estimados", value: String(months) },
          ],
          interpretation: [
            "FIRE não é só número: liquidez, seguros, imóveis e impostos mudam o ponto de equilíbrio real.",
          ],
          warnings: capped
            ? ["Meta não atingida no horizonte máximo simulado — ajuste parâmetros."]
            : undefined,
        };
      },
    ),
  },
  {
    slug: "projecao-renda-passiva",
    title: "Projeção de renda passiva",
    shortDescription:
      "Estime renda mensal e anual a partir do capital e de um rendimento médio anual — modelo linear, como “aluguel” mental do patrimônio.",
    category: "advanced",
    doc: {
      formula: "Renda_mensal ≈ Patrimônio × (taxa_anual / 12) ou Patrimônio × taxa_mensal.",
      variables: "Capital investido, retorno anual esperado (distribuído linearmente por mês, modelo simples).",
      howToUse:
        "Informe retorno líquido de impostos se fizer sentido. Dividendos e cupons oscilam — o número é média, não piso mensal garantido.",
      useCases: "Tesouro, renda fixa, visão de dividendos como média.",
      edgeCases: "Reinvestimento altera a base de capital; aqui o capital é fixo.",
      oQueVoceVe: [
        "Renda mensal e anual estimadas a partir do capital.",
        "Taxa anual utilizada na conta.",
        "Interpretação sobre volatilidade vs média.",
      ],
    },
    inputs: [
      { key: "capital", label: "Capital", type: "currency", min: 1_000, max: 5e9, step: 500, defaultValue: 1_200_000 },
      { key: "yieldAnnualPct", label: "Rendimento anual médio (%)", type: "percent", min: 0, max: 30, step: 0.25, defaultValue: 8 },
    ],
    compute: wrapCompute(
      [
        { key: "capital", label: "Capital", type: "currency", min: 1_000, max: 5e9, step: 500, defaultValue: 1_200_000 },
        { key: "yieldAnnualPct", label: "Rendimento anual médio (%)", type: "percent", min: 0, max: 30, step: 0.25, defaultValue: 8 },
      ],
      (v) => {
        const y = v.yieldAnnualPct / 100;
        const monthly = v.capital * (y / 12);
        const annual = v.capital * y;
        return {
          summary: `Renda passiva média mensal estimada: ${brl(monthly)} (${brl(annual)} ao ano).`,
          figures: [
            { label: "Mensal", value: brl(monthly) },
            { label: "Anual", value: brl(annual) },
            { label: "Taxa usada", value: pct(y, 2) },
          ],
          interpretation: [
            "É uma média linear; volatilidade pode fazer a renda realizada ficar acima ou abaixo por longos períodos.",
          ],
        };
      },
    ),
  },
  {
    slug: "simulador-metas-financeiras",
    title: "Simulador de metas financeiras",
    shortDescription:
      "Descubra em quantos meses você chega à meta com o patrimônio atual, aportes mensais e taxa — como um “quando completo” financeiro.",
    category: "advanced",
    doc: {
      formula: "Resolve n em VF = PV(1+r)^n + PMT × ((1+r)^n − 1) / r (busca numérica).",
      variables: "Meta VF, saldo atual PV, aporte mensal, taxa mensal.",
      howToUse:
        "Se a meta já está coberta pelo saldo atual, o prazo é zero. Use meta líquida se o resgate tiver imposto relevante.",
      useCases: "Entrada de carro, educação, reserva ampliada.",
      edgeCases: "Se VF ≤ PV com taxa ≥ 0, prazo é zero. Sem aportes e retorno zero, meta pode ser inalcançável.",
      oQueVoceVe: [
        "Prazo em meses (e anos aproximados) para atingir a meta.",
        "Aporte total aproximado até a data.",
        "Alerta quando a meta não fecha no horizonte máximo simulado.",
      ],
    },
    inputs: [
      { key: "fv", label: "Valor da meta", type: "currency", min: 1_000, max: 5e9, step: 500, defaultValue: 200_000 },
      { key: "pv", label: "Patrimônio hoje", type: "currency", min: 0, max: 5e9, step: 500, defaultValue: 40_000 },
      { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 2e7, step: 100, defaultValue: 3_500 },
      { key: "rateMonthlyPct", label: "Taxa mensal", type: "percent", min: 0, max: 15, step: 0.05, defaultValue: 0.55 },
    ],
    compute: wrapCompute(
      [
        { key: "fv", label: "Valor da meta", type: "currency", min: 1_000, max: 5e9, step: 500, defaultValue: 200_000 },
        { key: "pv", label: "Patrimônio hoje", type: "currency", min: 0, max: 5e9, step: 500, defaultValue: 40_000 },
        { key: "pmt", label: "Aporte mensal", type: "currency", min: 0, max: 2e7, step: 100, defaultValue: 3_500 },
        { key: "rateMonthlyPct", label: "Taxa mensal", type: "percent", min: 0, max: 15, step: 0.05, defaultValue: 0.55 },
      ],
      (v) => {
        const r = v.rateMonthlyPct / 100;
        if (v.fv <= v.pv && r >= 0) {
          return {
            summary: "Meta já atingida ou superada com o patrimônio atual.",
            figures: [{ label: "Saldo atual", value: brl(v.pv) }, { label: "Meta", value: brl(v.fv) }],
            interpretation: ["Ajuste a meta para próximo objetivo ou confirme liquidez/tributação antes de usar o valor."],
          };
        }
        const { months, capped } = monthsToReach(r, v.pv, v.pmt, v.fv);
        return {
          summary: capped
            ? "Não foi possível atingir a meta no horizonte máximo simulado (100 anos) com esses parâmetros."
            : `Meta de ${brl(v.fv)} em ~${months} meses (~${(months / 12).toFixed(1)} anos).`,
          figures: [
            { label: "Meses", value: String(months) },
            { label: "Aporte total aproximado", value: brl(v.pmt * months) },
          ],
          interpretation: [
            "Prazo cai fortemente quando você combina aportes consistentes com taxa > 0.",
          ],
          warnings: capped ? ["Aumente aportes, prazo ou retorno esperado (com cautela)."] : undefined,
        };
      },
    ),
  },
];
