import type { CalculatorDefinition } from "../types";
import { wrapCompute } from "../validate";
import { brl, fvCompound, pmtToReachFv } from "../math";

export const personalCalculators: CalculatorDefinition[] = [
  {
    slug: "quanto-gastar-mes",
    title: "Quanto posso gastar por mês",
    shortDescription:
      "Defina um teto realista para gastos variáveis: renda líquida menos obrigações fixas e a meta mínima de poupança.",
    category: "personal",
    doc: {
      formula: "Gasto disponível = Renda − Custos fixos − (Renda × % poupança obrigatória).",
      variables: "Renda líquida, despesas fixas contratadas, percentual mínimo a guardar.",
      howToUse:
        "Liste só o fixo inevitável (moradia, escola, transporte essencial). A meta de poupança é um “pagamento a você mesmo” antes do variável.",
      useCases: "Evitar estourar cartão, negociar moradia ou planejar troca de carro com teto claro.",
      edgeCases: "Se fixos + poupança ≥ renda, o disponível zera ou fica negativo — sinal de ajuste estrutural.",
      oQueVoceVe: [
        "Teto sugerido para gastos variáveis (lazer, consumo, imprevistos fora do fixo).",
        "Quanto sobra para poupança planejada e quanto está comprometido em fixos.",
        "Alerta quando o orçamento não fecha.",
      ],
    },
    inputs: [
      { key: "income", label: "Renda líquida mensal", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 8_000 },
      { key: "fixed", label: "Custos fixos essenciais", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 4_200 },
      { key: "savePct", label: "Meta mínima de poupança (%)", type: "percent", min: 0, max: 80, step: 1, defaultValue: 15 },
    ],
    compute: wrapCompute(
      [
        { key: "income", label: "Renda líquida mensal", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 8_000 },
        { key: "fixed", label: "Custos fixos essenciais", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 4_200 },
        { key: "savePct", label: "Meta mínima de poupança (%)", type: "percent", min: 0, max: 80, step: 1, defaultValue: 15 },
      ],
      (v) => {
        const save = v.income * (v.savePct / 100);
        const disc = v.income - v.fixed - save;
        const warnings: string[] = [];
        if (disc < 0) warnings.push("Despesas fixas + poupança excedem a renda — revise fixos ou meta de poupança.");
        return {
          summary:
            disc >= 0
              ? `Teto sugerido para gastos variáveis: ${brl(disc)} por mês.`
              : `Déficit de ${brl(-disc)} após compromissos — não há folga para gastos discricionários.`,
          figures: [
            { label: "Poupança planejada", value: brl(save) },
            { label: "Fixos", value: brl(v.fixed) },
            { label: "Variável disponível", value: brl(disc) },
          ],
          interpretation: [
            disc >= 0
              ? "Use esse valor como limite para lazer, consumo e imprevistos não cobertos pelos fixos."
              : "Priorize reduzir fixos, aumentar renda ou temporariamente reduzir a meta de poupança até equilibrar.",
          ],
          warnings: warnings.length ? warnings : undefined,
        };
      },
    ),
  },
  {
    slug: "quanto-guardar-mes",
    title: "Quanto posso guardar por mês",
    shortDescription:
      "Saiba quanto precisa poupar por mês para chegar à meta no prazo, com taxa de retorno constante (referência, não garantia).",
    category: "personal",
    doc: {
      formula: "PMT = VF × r / ((1+r)^n − 1), com aportes no fim do mês e VF alvo.",
      variables: "Meta em dinheiro, prazo em meses, taxa mensal esperada.",
      howToUse:
        "Use taxa líquida conservadora. Se quiser pensar em valor real, desconte inflação da taxa de forma aproximada.",
      useCases: "Reserva de emergência, entrada de imóvel, viagem, fundo para reforma.",
      edgeCases: "Taxa zero implica PMT = VF/n. Metas muito agressivas com prazo curto elevam o aporte.",
      oQueVoceVe: [
        "Valor do aporte mensal necessário para atingir a meta.",
        "Total aportado bruto e quanto dos juros ajudam a fechar o alvo.",
        "Interpretação sobre o papel da taxa assumida.",
      ],
    },
    inputs: [
      { key: "fv", label: "Meta (valor futuro)", type: "currency", min: 1_000, max: 5e8, step: 500, defaultValue: 60_000 },
      { key: "months", label: "Prazo (meses)", type: "months", min: 1, max: 600, step: 1, defaultValue: 36 },
      { key: "rateMonthlyPct", label: "Taxa mensal líquida", type: "percent", min: 0, max: 15, step: 0.05, defaultValue: 0.45 },
    ],
    compute: wrapCompute(
      [
        { key: "fv", label: "Meta (valor futuro)", type: "currency", min: 1_000, max: 5e8, step: 500, defaultValue: 60_000 },
        { key: "months", label: "Prazo (meses)", type: "months", min: 1, max: 600, step: 1, defaultValue: 36 },
        { key: "rateMonthlyPct", label: "Taxa mensal líquida", type: "percent", min: 0, max: 15, step: 0.05, defaultValue: 0.45 },
      ],
      (v) => {
        const r = v.rateMonthlyPct / 100;
        const pmt = pmtToReachFv(r, v.months, v.fv);
        return {
          summary: `Guarde cerca de ${brl(pmt)} por mês para chegar a ${brl(v.fv)} em ${v.months} meses.`,
          figures: [
            { label: "Aporte mensal", value: brl(pmt) },
            { label: "Total aportado (sem juros)", value: brl(pmt * v.months) },
            { label: "Juros embutidos no alvo", value: brl(v.fv - pmt * v.months) },
          ],
          interpretation: [
            r > 0
              ? "Parte do alvo vem dos juros sobre aportes — quanto maior a taxa assumida, menor o aporte necessário (atenção: taxa não é garantida)."
              : "Sem retorno, o aporte é simplesmente a meta dividida pelo número de meses.",
          ],
        };
      },
    ),
  },
  {
    slug: "planejamento-financeiro-mensal",
    title: "Planejamento financeiro mensal",
    shortDescription:
      "Distribua percentuais da renda entre moradia, alimentação, transporte e poupança — veja o que sobra para o restante.",
    category: "personal",
    doc: {
      formula: "Alocação_i = Renda × (%_i / 100); sobra = Renda − Σ alocações − poupança explícita.",
      variables: "Renda e percentuais de moradia, alimentação, transporte; poupança explícita em %.",
      howToUse:
        "A soma dos percentuais não deve passar de 100%. Ajuste categorias até fechar; use como teto, não como gasto real automático.",
      useCases: "Orçamento familiar, comparar com regra 50/30/20, onboarding financeiro.",
      edgeCases: "Percentuais >100% indicam inconsistência; moradia alta pode sinalizar endividamento.",
      oQueVoceVe: [
        "Valores em reais por categoria e a sobra (ou déficit) após aplicar os percentuais.",
        "Alerta quando a soma dos percentuais ultrapassa 100%.",
        "Leitura para acompanhar extratos e ver desvio real mês a mês.",
      ],
    },
    inputs: [
      { key: "income", label: "Renda mensal", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 10_000 },
      { key: "housingPct", label: "Moradia (%)", type: "percent", min: 0, max: 80, step: 1, defaultValue: 30 },
      { key: "foodPct", label: "Alimentação (%)", type: "percent", min: 0, max: 60, step: 1, defaultValue: 20 },
      { key: "transportPct", label: "Transporte (%)", type: "percent", min: 0, max: 40, step: 1, defaultValue: 15 },
      { key: "savePct", label: "Poupança/investimento (%)", type: "percent", min: 0, max: 80, step: 1, defaultValue: 20 },
    ],
    compute: wrapCompute(
      [
        { key: "income", label: "Renda mensal", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 10_000 },
        { key: "housingPct", label: "Moradia (%)", type: "percent", min: 0, max: 80, step: 1, defaultValue: 30 },
        { key: "foodPct", label: "Alimentação (%)", type: "percent", min: 0, max: 60, step: 1, defaultValue: 20 },
        { key: "transportPct", label: "Transporte (%)", type: "percent", min: 0, max: 40, step: 1, defaultValue: 15 },
        { key: "savePct", label: "Poupança/investimento (%)", type: "percent", min: 0, max: 80, step: 1, defaultValue: 20 },
      ],
      (v) => {
        const sumPct = v.housingPct + v.foodPct + v.transportPct + v.savePct;
        const moradia = v.income * (v.housingPct / 100);
        const alim = v.income * (v.foodPct / 100);
        const transp = v.income * (v.transportPct / 100);
        const poupa = v.income * (v.savePct / 100);
        const allocated = moradia + alim + transp + poupa;
        const rest = v.income - allocated;
        const warnings: string[] = [];
        if (sumPct > 100) warnings.push(`Soma dos percentuais (${sumPct.toFixed(0)}%) ultrapassa 100% — recalibração necessária.`);
        return {
          summary:
            rest >= 0
              ? `Sobra aproximadamente ${brl(rest)} para demais categorias (lazer, saúde, educação).`
              : `Orçamento excede a renda em ${brl(-rest)} com esses percentuais.`,
          figures: [
            { label: "Moradia", value: brl(moradia) },
            { label: "Alimentação", value: brl(alim) },
            { label: "Transporte", value: brl(transp) },
            { label: "Poupança", value: brl(poupa) },
            { label: "Sobra / déficit", value: brl(rest) },
          ],
          interpretation: [
            sumPct <= 100
              ? "Trate os valores como teto por categoria; acompanhe extratos para ver desvio real."
              : "Reduza percentuais ou aumente renda até a soma fechar em 100% ou menos.",
          ],
          warnings: warnings.length ? warnings : undefined,
        };
      },
    ),
  },
  {
    slug: "projecao-saldo-futuro",
    title: "Projeção de saldo futuro",
    shortDescription:
      "Projeta saldo daqui a X meses com o que você tem hoje, aportes mensais e taxa constante — útil para metas e reserva.",
    category: "personal",
    doc: {
      formula: "Mesma capitalização composta com PV inicial e PMT periódico.",
      variables: "Saldo hoje, aporte mensal, taxa mensal, meses.",
      howToUse:
        "Some reserva líquida + investimentos de curto prazo se quiser um “saldo único” conservador. Taxa deve refletir liquidez e risco.",
      useCases: "Cobertura de meses de despesa, meta de fundo, acompanhamento de marcos.",
      edgeCases: "Inflação não modelada — para saldo real, desconte inflação da taxa.",
      oQueVoceVe: [
        "Saldo projetado na data escolhida.",
        "Quanto veio de aportes acumulados e quanto de rendimento no modelo.",
        "Série temporal para ver a curva.",
      ],
    },
    inputs: [
      { key: "pv", label: "Saldo hoje", type: "currency", min: 0, max: 5e8, step: 100, defaultValue: 25_000 },
      { key: "pmt", label: "Aporte mensal líquido", type: "currency", min: 0, max: 2e7, step: 50, defaultValue: 1_200 },
      { key: "rateMonthlyPct", label: "Taxa mensal", type: "percent", min: 0, max: 20, step: 0.05, defaultValue: 0.5 },
      { key: "months", label: "Meses à frente", type: "months", min: 1, max: 480, step: 1, defaultValue: 60 },
    ],
    compute: wrapCompute(
      [
        { key: "pv", label: "Saldo hoje", type: "currency", min: 0, max: 5e8, step: 100, defaultValue: 25_000 },
        { key: "pmt", label: "Aporte mensal líquido", type: "currency", min: 0, max: 2e7, step: 50, defaultValue: 1_200 },
        { key: "rateMonthlyPct", label: "Taxa mensal", type: "percent", min: 0, max: 20, step: 0.05, defaultValue: 0.5 },
        { key: "months", label: "Meses à frente", type: "months", min: 1, max: 480, step: 1, defaultValue: 60 },
      ],
      (v) => {
        const r = v.rateMonthlyPct / 100;
        const fv = fvCompound(r, v.months, v.pv, v.pmt);
        const invested = v.pv + v.pmt * v.months;
        return {
          summary: `Saldo projetado em ${v.months} meses: ${brl(fv)}.`,
          figures: [
            { label: "Aportes acumulados", value: brl(invested) },
            { label: "Ganhos financeiros", value: brl(fv - invested) },
          ],
          interpretation: [
            "Compare com suas despesas mensais para ver cobertura aproximada (sem ajuste por inflação).",
          ],
        };
      },
    ),
  },
  {
    slug: "simulador-economia-mensal",
    title: "Simulador de economia mensal",
    shortDescription:
      "Simule quanto a sobra mensal melhora se você reduzir um valor fixo de gastos — ideal para cortar desperdício com meta.",
    category: "personal",
    doc: {
      formula: "Economia = Renda − Gastos atuais; Cenário = Renda − (Gastos − Redução).",
      variables: "Renda, gasto total atual, valor a cortar de gastos variáveis.",
      howToUse:
        "Informe só o corte que é factível (assinaturas, delivery, lazer). O simulador limita o corte ao gasto total para não superestimar.",
      useCases: "Hábitos, meta de dívida zero, acelerar reserva.",
      edgeCases: "Redução maior que gastos variáveis leva a superestimar economia possível.",
      oQueVoceVe: [
        "Economia hoje vs economia após o corte planejado.",
        "Novo gasto mensal implícito após o corte.",
        "Sugestão de destino para o valor incremental (dívida ou reserva).",
      ],
    },
    inputs: [
      { key: "income", label: "Renda líquida", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 7_500 },
      { key: "spend", label: "Gasto total mensal", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 6_800 },
      { key: "cut", label: "Redução planejada em gastos", type: "currency", min: 0, max: 5e6, step: 50, defaultValue: 600 },
    ],
    compute: wrapCompute(
      [
        { key: "income", label: "Renda líquida", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 7_500 },
        { key: "spend", label: "Gasto total mensal", type: "currency", min: 0, max: 5e6, step: 100, defaultValue: 6_800 },
        { key: "cut", label: "Redução planejada em gastos", type: "currency", min: 0, max: 5e6, step: 50, defaultValue: 600 },
      ],
      (v) => {
        const currentSave = v.income - v.spend;
        const effectiveCut = Math.min(v.cut, Math.max(0, v.spend));
        const newSpend = v.spend - effectiveCut;
        const newSave = v.income - newSpend;
        const warnings: string[] = [];
        if (v.cut > v.spend) warnings.push("Redução maior que o gasto total — limitamos ao gasto atual.");
        if (currentSave < 0) warnings.push("Hoje o orçamento já está negativo antes da redução.");
        return {
          summary: `Economia mensal passa de ${brl(currentSave)} para ${brl(newSave)} com o corte de ${brl(effectiveCut)}.`,
          figures: [
            { label: "Economia hoje", value: brl(currentSave) },
            { label: "Novo gasto", value: brl(newSpend) },
            { label: "Nova economia", value: brl(newSave) },
          ],
          interpretation: [
            newSave > currentSave
              ? "Direcione o incremental prioritariamente para dívidas caras ou reserva de emergência."
              : "Sem corte efetivo, a economia não melhora.",
          ],
          warnings: warnings.length ? warnings : undefined,
        };
      },
    ),
  },
];
