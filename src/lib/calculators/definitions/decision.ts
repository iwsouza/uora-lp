import type { CalculatorDefinition } from "../types";
import { wrapCompute } from "../validate";
import { brl, fvCompound, loanBalanceAfterPayments, pct, pmtPrice, pvAnnuity } from "../math";

export const decisionCalculators: CalculatorDefinition[] = [
  {
    slug: "financiar-vs-alugar",
    title: "Financiar vs alugar",
    shortDescription:
      "Compare, no mesmo horizonte, patrimônio líquido do comprador (imóvel menos dívida) contra alugar e investir a diferença — visão educativa.",
    category: "decision",
    doc: {
      formula:
        "Comprador: VF_imovel = P×(1+g)^T; saldo_dívida via recorrência Price; patrimônio ≈ VF_imovel − dívida. Locatário: W_{m+1} = W_m(1+r) + max(0, PMT−aluguel).",
      variables:
        "Preço do imóvel, entrada %, taxa e prazo do financiamento, aluguel mensal, horizonte em anos, valorização anual do imóvel, retorno mensal do portfólio alternativo.",
      howToUse:
        "Defina horizonte realista (quanto tempo você ficaria no imóvel ou na cidade). Rode cenários: valorização baixa/alta e retorno conservador/agressivo. Não inclui condomínio, IPTU nem seguros.",
      useCases: "Primeiro imóvel, realocação, entender custo de oportunidade da entrada.",
      edgeCases:
        "Aluguel acima da parcela zera o aporte incremental do locatário neste modelo. Não substitui fluxo de caixa completo nem IR sobre ganho de capital.",
      oQueVoceVe: [
        "Resumo dizendo qual lado “ganha” no modelo com os números que você digitou.",
        "Patrimônio líquido comprador vs locatário, parcela e valor do imóvel projetado.",
        "Gráficos e leitura sobre sensibilidade a taxas e permanência.",
      ],
    },
    inputs: [
      { key: "price", label: "Preço do imóvel", type: "currency", min: 50_000, max: 5e8, step: 5_000, defaultValue: 450_000 },
      { key: "downPct", label: "Entrada (%)", type: "percent", min: 0, max: 90, step: 1, defaultValue: 20 },
      { key: "rateMonthlyPct", label: "Taxa financiamento (a.m.)", type: "percent", min: 0.05, max: 5, step: 0.01, defaultValue: 0.89 },
      { key: "loanMonths", label: "Prazo financiamento (meses)", type: "months", min: 12, max: 480, step: 1, defaultValue: 360 },
      { key: "rent", label: "Aluguel mensal equivalente", type: "currency", min: 0, max: 1e6, step: 100, defaultValue: 2_200 },
      { key: "years", label: "Horizonte (anos)", type: "years", min: 1, max: 30, step: 1, defaultValue: 8 },
      { key: "homeGrowthPct", label: "Valorização anual do imóvel (%)", type: "percent", min: -10, max: 30, step: 0.5, defaultValue: 3 },
      { key: "investMonthlyPct", label: "Retorno mensal alternativo (%)", type: "percent", min: 0, max: 5, step: 0.05, defaultValue: 0.45 },
    ],
    compute: wrapCompute(
      [
        { key: "price", label: "Preço do imóvel", type: "currency", min: 50_000, max: 5e8, step: 5_000, defaultValue: 450_000 },
        { key: "downPct", label: "Entrada (%)", type: "percent", min: 0, max: 90, step: 1, defaultValue: 20 },
        { key: "rateMonthlyPct", label: "Taxa financiamento (a.m.)", type: "percent", min: 0.05, max: 5, step: 0.01, defaultValue: 0.89 },
        { key: "loanMonths", label: "Prazo financiamento (meses)", type: "months", min: 12, max: 480, step: 1, defaultValue: 360 },
        { key: "rent", label: "Aluguel mensal equivalente", type: "currency", min: 0, max: 1e6, step: 100, defaultValue: 2_200 },
        { key: "years", label: "Horizonte (anos)", type: "years", min: 1, max: 30, step: 1, defaultValue: 8 },
        { key: "homeGrowthPct", label: "Valorização anual do imóvel (%)", type: "percent", min: -10, max: 30, step: 0.5, defaultValue: 3 },
        { key: "investMonthlyPct", label: "Retorno mensal alternativo (%)", type: "percent", min: 0, max: 5, step: 0.05, defaultValue: 0.45 },
      ],
      (v) => {
        const r = v.rateMonthlyPct / 100;
        const ri = v.investMonthlyPct / 100;
        const down = v.price * (v.downPct / 100);
        const pvLoan = Math.max(0, v.price - down);
        const pmt = pmtPrice(r, v.loanMonths, pvLoan);
        const H = Math.round(v.years * 12);
        const g = v.homeGrowthPct / 100;
        const homeEnd = v.price * (1 + g) ** v.years;
        const k = Math.min(H, v.loanMonths);
        const debt = loanBalanceAfterPayments(r, pvLoan, pmt, k);
        const buyerNet = homeEnd - Math.max(0, debt);
        const monthlyInvest = Math.max(0, pmt - v.rent);
        const renterNet = fvCompound(ri, H, down, monthlyInvest);
        const winner = buyerNet >= renterNet ? "comprar (no modelo)" : "alugar + investir (no modelo)";
        const warnings: string[] = [];
        if (v.rent > pmt) warnings.push("Aluguel maior que a parcela: o modelo não investe a diferença a favor do comprador.");
        return {
          summary: `Após ~${v.years} anos, patrimônio líquido comprador ${brl(buyerNet)} vs locatário ${brl(renterNet)} — favorece ${winner}.`,
          figures: [
            { label: "Patrimônio comprador (imóvel − dívida)", value: brl(buyerNet) },
            { label: "Patrimônio locatário (investido)", value: brl(renterNet) },
            { label: "Prestação", value: brl(pmt) },
            { label: "Valor do imóvel projetado", value: brl(homeEnd) },
          ],
          interpretation: [
            "Resultado sensível a valorização do imóvel, retorno alternativo e permanência no horizonte. Use três cenários (pessimista/base/otimista).",
          ],
          warnings: warnings.length ? warnings : undefined,
        };
      },
    ),
  },
  {
    slug: "comprar-vs-investir",
    title: "Comprar vs investir",
    shortDescription:
      "Veja o valor futuro do mesmo capital se aplicado na valorização de um imóvel ou em um retorno financeiro anual constante — primeiro filtro quantitativo.",
    category: "decision",
    doc: {
      formula: "FV_comprar = C×(1+g)^T; FV_investir = C×(1+r_m)^{12T} com r_m derivado de retorno anual equivalente.",
      variables: "Capital disponível, horizonte em anos, valorização anual do imóvel, retorno anual do investimento.",
      howToUse:
        "Use o capital que seria mobilizado (ex.: entrada). Compare cenários pessimistas e otimistas para g e para o retorno financeiro.",
      useCases: "Imóvel como ativo vs carteira diversificada no mesmo prazo.",
      edgeCases: "Não inclui aluguel implícito, liquidez nem risco operacional do imóvel.",
      oQueVoceVe: [
        "Patrimônio final em cada opção e a diferença em reais.",
        "Interpretação lembrando que financiamento e uso do imóvel não entram neste recorte.",
        "Visualização dos números de entrada e do resultado.",
      ],
    },
    inputs: [
      { key: "capital", label: "Capital (entrada)", type: "currency", min: 1_000, max: 5e8, step: 1_000, defaultValue: 90_000 },
      { key: "years", label: "Horizonte (anos)", type: "years", min: 1, max: 40, step: 1, defaultValue: 10 },
      { key: "homePct", label: "Valorização anual imóvel (%)", type: "percent", min: -15, max: 30, step: 0.5, defaultValue: 2.5 },
      { key: "investAnnualPct", label: "Retorno anual investimento (%)", type: "percent", min: -10, max: 30, step: 0.5, defaultValue: 9 },
    ],
    compute: wrapCompute(
      [
        { key: "capital", label: "Capital (entrada)", type: "currency", min: 1_000, max: 5e8, step: 1_000, defaultValue: 90_000 },
        { key: "years", label: "Horizonte (anos)", type: "years", min: 1, max: 40, step: 1, defaultValue: 10 },
        { key: "homePct", label: "Valorização anual imóvel (%)", type: "percent", min: -15, max: 30, step: 0.5, defaultValue: 2.5 },
        { key: "investAnnualPct", label: "Retorno anual investimento (%)", type: "percent", min: -10, max: 30, step: 0.5, defaultValue: 9 },
      ],
      (v) => {
        const g = v.homePct / 100;
        const ia = v.investAnnualPct / 100;
        const rm = (1 + ia) ** (1 / 12) - 1;
        const fvHome = v.capital * (1 + g) ** v.years;
        const fvInv = fvCompound(rm, Math.round(v.years * 12), v.capital, 0);
        const fav = fvInv >= fvHome ? "investir o capital" : "valorização do imóvel no cenário";
        return {
          summary: `FV imóvel ${brl(fvHome)} vs FV carteira ${brl(fvInv)} — no modelo, favorece ${fav}.`,
          figures: [
            { label: "Patrimônio imóvel", value: brl(fvHome) },
            { label: "Patrimônio investido", value: brl(fvInv) },
            { label: "Diferença", value: brl(fvInv - fvHome) },
          ],
          interpretation: [
            "Ignora financiamento, uso próprio (aluguel implícito) e tributação. Sirva como primeiro filtro quantitativo.",
          ],
        };
      },
    ),
  },
  {
    slug: "parcelar-vs-pagar-vista",
    title: "Parcelar vs pagar à vista",
    shortDescription:
      "Descubra se o parcelamento compensa em valor presente: compara o total das parcelas descontado pela sua taxa de oportunidade com o preço à vista.",
    category: "decision",
    doc: {
      formula: "NPV_parcelas = PMT × (1 − (1+r)^−n) / r, com PMT = total_financiado / n (parcelas iguais).",
      variables: "Preço à vista, total parcelado (soma das parcelas), número de parcelas, taxa mensal de oportunidade.",
      howToUse:
        "Informe o total que você pagaria se parcelasse (soma de todas as parcelas). A taxa de oportunidade é o que você espera ganhar com o dinheiro que ficaria investido se pagasse à vista.",
      useCases: "Desconto à vista na loja, serviços, equipamentos.",
      edgeCases: "Taxa zero faz NPV = soma das parcelas. Parcelas com juros embutidos devem usar o total real pago.",
      oQueVoceVe: [
        "Valor presente das parcelas frente ao preço à vista.",
        "Parcela média implícita e leitura de qual opção tende a ser melhor na taxa informada.",
        "Interpretação sobre custo de oportunidade do dinheiro hoje.",
      ],
    },
    inputs: [
      { key: "cash", label: "Preço à vista", type: "currency", min: 10, max: 5e8, step: 10, defaultValue: 3_600 },
      { key: "totalFinanced", label: "Total pago parcelado", type: "currency", min: 10, max: 5e8, step: 10, defaultValue: 3_960 },
      { key: "n", label: "Número de parcelas", type: "months", min: 2, max: 120, step: 1, defaultValue: 12 },
      { key: "rateMonthlyPct", label: "Taxa de oportunidade (a.m.)", type: "percent", min: 0, max: 15, step: 0.05, defaultValue: 0.8 },
    ],
    compute: wrapCompute(
      [
        { key: "cash", label: "Preço à vista", type: "currency", min: 10, max: 5e8, step: 10, defaultValue: 3_600 },
        { key: "totalFinanced", label: "Total pago parcelado", type: "currency", min: 10, max: 5e8, step: 10, defaultValue: 3_960 },
        { key: "n", label: "Número de parcelas", type: "months", min: 2, max: 120, step: 1, defaultValue: 12 },
        { key: "rateMonthlyPct", label: "Taxa de oportunidade (a.m.)", type: "percent", min: 0, max: 15, step: 0.05, defaultValue: 0.8 },
      ],
      (v) => {
        const r = v.rateMonthlyPct / 100;
        const pmt = v.totalFinanced / v.n;
        const npv = pvAnnuity(r, v.n, pmt);
        const better = npv <= v.cash ? "parcelar (VP menor ou igual ao à vista)" : "pagar à vista (VP menor)";
        return {
          summary: `VP das parcelas: ${brl(npv)} vs à vista ${brl(v.cash)} — tende a ${better} nesta taxa.`,
          figures: [
            { label: "Parcela média", value: brl(pmt) },
            { label: "VP parcelas", value: brl(npv) },
            { label: "À vista", value: brl(v.cash) },
          ],
          interpretation: [
            npv < v.cash
              ? "O desconto implícito do parcelamento supera o custo de oportunidade do dinheiro hoje."
              : "Manter o dinheiro rendendo não compensa o acréscimo do parcelamento frente ao à vista, neste modelo.",
          ],
        };
      },
    ),
  },
  {
    slug: "vale-pena-emprestimo",
    title: "Vale a pena empréstimo",
    shortDescription:
      "Compare custo mensal do crédito com o retorno esperado de aplicar o mesmo dinheiro no negócio ou investimento — spread simples para reflexão.",
    category: "decision",
    doc: {
      formula: "Spread ≈ retorno esperado anual − custo efetivo anual do crédito (aproximação).",
      variables: "Taxa de juros do empréstimo (a.m.), retorno esperado alternativo (a.m.), opcional prazo para contexto de parcela.",
      howToUse:
        "Substitua a taxa do empréstimo por uma taxa mensal próxima da CET, se disponível. O retorno esperado deve ser realista pós-risco e impostos.",
      useCases: "Giro, equipamento produtivo, decisões de alavancagem (alto risco).",
      edgeCases: "Risco de caixa e colateral não entram — spread positivo não garante decisão prudente.",
      oQueVoceVe: [
        "Custo do crédito e retorno esperado na mesma base (a.m.).",
        "Spread positivo ou negativo com leitura prudencial.",
        "Lembrete de risco operacional e de caixa.",
      ],
    },
    inputs: [
      { key: "loanRateMonthlyPct", label: "Custo do crédito (a.m.)", type: "percent", min: 0, max: 25, step: 0.05, defaultValue: 2.1 },
      { key: "useReturnMonthlyPct", label: "Retorno esperado do uso (a.m.)", type: "percent", min: 0, max: 25, step: 0.05, defaultValue: 2.8 },
    ],
    compute: wrapCompute(
      [
        { key: "loanRateMonthlyPct", label: "Custo do crédito (a.m.)", type: "percent", min: 0, max: 25, step: 0.05, defaultValue: 2.1 },
        { key: "useReturnMonthlyPct", label: "Retorno esperado do uso (a.m.)", type: "percent", min: 0, max: 25, step: 0.05, defaultValue: 2.8 },
      ],
      (v) => {
        const rl = v.loanRateMonthlyPct / 100;
        const ru = v.useReturnMonthlyPct / 100;
        const spread = ru - rl;
        const ok = spread > 0;
        return {
          summary: ok
            ? `Spread mensal positivo de ${pct(spread, 2)} — no modelo quantitativo, o uso do capital cobre o custo do crédito.`
            : `Spread negativo de ${pct(spread, 2)} — o custo do crédito supera o retorno esperado do uso.`,
          figures: [
            { label: "Custo do crédito (a.m.)", value: pct(rl, 2) },
            { label: "Retorno esperado (a.m.)", value: pct(ru, 2) },
            { label: "Spread", value: pct(spread, 2) },
          ],
          interpretation: [
            ok
              ? "Ainda avalie risco de execução, penalidades, concentração e stress de caixa."
              : "Evite alavancagem para consumo; revise se o retorno esperado é realista pós-impostos.",
          ],
        };
      },
    ),
  },
  {
    slug: "vale-pena-cartao-credito",
    title: "Vale a pena cartão de crédito",
    shortDescription:
      "Veja se cashback ou pontos compensam juros do rotativo no mês — reforça que o melhor uso do cartão é pagar a fatura integral.",
    category: "decision",
    doc: {
      formula: "Juros ~ Saldo × r (primeiro mês); benefício = compra × cashback%.",
      variables: "Saldo rotativo, taxa de juros do rotativo (a.m.), valor da compra à vista no cartão, cashback/pontos em %.",
      howToUse:
        "Simule um mês: saldo que você deixaria rolar, taxa do rotativo do contrato e benefício percentual estimado sobre compras.",
      useCases: "Entender quando o rotativo anula benefícios do programa.",
      edgeCases: "IOF e anuidade não inclusos; programa de pontos tem valor subjetivo.",
      oQueVoceVe: [
        "Juros estimados do rotativo, benefício estimado e saldo líquido.",
        "Alerta quando a taxa de rotativo é muito alta.",
        "Mensagem de boa prática: priorizar quitar fatura.",
      ],
    },
    inputs: [
      { key: "balance", label: "Saldo a rolar", type: "currency", min: 0, max: 5e6, step: 50, defaultValue: 4_000 },
      { key: "rateMonthlyPct", label: "Juros do rotativo (a.m.)", type: "percent", min: 0, max: 30, step: 0.1, defaultValue: 12 },
      { key: "purchase", label: "Compra no cartão (à vista)", type: "currency", min: 0, max: 5e6, step: 50, defaultValue: 2_500 },
      { key: "cashbackPct", label: "Benefício (cashback %)", type: "percent", min: 0, max: 30, step: 0.25, defaultValue: 1.5 },
    ],
    compute: wrapCompute(
      [
        { key: "balance", label: "Saldo a rolar", type: "currency", min: 0, max: 5e6, step: 50, defaultValue: 4_000 },
        { key: "rateMonthlyPct", label: "Juros do rotativo (a.m.)", type: "percent", min: 0, max: 30, step: 0.1, defaultValue: 12 },
        { key: "purchase", label: "Compra no cartão (à vista)", type: "currency", min: 0, max: 5e6, step: 50, defaultValue: 2_500 },
        { key: "cashbackPct", label: "Benefício (cashback %)", type: "percent", min: 0, max: 30, step: 0.25, defaultValue: 1.5 },
      ],
      (v) => {
        const r = v.rateMonthlyPct / 100;
        const interest = v.balance * r;
        const benefit = v.purchase * (v.cashbackPct / 100);
        const net = benefit - interest;
        return {
          summary:
            net >= 0
              ? `Benefício líquido simplificado ${brl(net)} neste mês (cashback − juros do rotativo).`
              : `Custo líquido ${brl(-net)} — o rotativo destrói o benefício do programa.`,
          figures: [
            { label: "Juros do rotativo (1 mês)", value: brl(interest) },
            { label: "Cashback estimado", value: brl(benefit) },
            { label: "Saldo líquido", value: brl(net) },
          ],
          interpretation: [
            "Melhor uso do cartão: pagar fatura integral; trate rotativo como última opção de liquidez.",
          ],
          warnings: v.balance > 0 && r > 0.05 ? ["Taxa de rotativo alta — priorize quitar antes de acumular benefícios."] : undefined,
        };
      },
    ),
  },
];
