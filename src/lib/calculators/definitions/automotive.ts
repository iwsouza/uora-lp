import type { CalculatorDefinition, CalcOutput } from "../types";
import { wrapCompute } from "../validate";
import { brl } from "../math";

function money(n: number): string {
  return brl(n);
}

function num(n: number, d = 1): string {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: d, minimumFractionDigits: d });
}

function costPerKm(pricePerLiter: number, kmPerLiter: number): number {
  if (kmPerLiter <= 0) return NaN;
  return pricePerLiter / kmPerLiter;
}

function fuelCostMonthly(kmMonth: number, kmPerLiter: number, pricePerLiter: number): number {
  if (kmPerLiter <= 0) return NaN;
  return (kmMonth / kmPerLiter) * pricePerLiter;
}

function withAutoLayer(
  out: CalcOutput,
  opts: {
    monthlySpend?: number;
    annualSpend?: number;
    /** Sobrescreve o texto padrão de impacto anual */
    annualImpactText?: string;
    patrimonyNote?: string;
    insights?: string[];
    scenarios?: CalcOutput["scenarioCompare"];
  },
): CalcOutput {
  const impacts: NonNullable<CalcOutput["impacts"]> = {};
  if (opts.monthlySpend != null && Number.isFinite(opts.monthlySpend)) {
    impacts.monthly = `No ritmo atual, isso pesa ${money(opts.monthlySpend)} por mês no seu bolso.`;
  }
  if (opts.annualImpactText) {
    impacts.annual = opts.annualImpactText;
  } else if (opts.annualSpend != null && Number.isFinite(opts.annualSpend)) {
    impacts.annual = `Se nada mudar, são ${money(opts.annualSpend)} em 12 meses nessa linha de despesa.`;
  }
  if (opts.patrimonyNote) {
    impacts.patrimony = opts.patrimonyNote;
  }
  return {
    ...out,
    insights: [...(out.insights ?? []), ...(opts.insights ?? [])],
    scenarioCompare: opts.scenarios ?? out.scenarioCompare,
    impacts: Object.keys(impacts).length ? { ...out.impacts, ...impacts } : out.impacts,
  };
}

export const automotiveCalculators: CalculatorDefinition[] = [
  {
    slug: "km-por-litro-calculo",
    title: "Consumo (km por litro)",
    shortDescription:
      "Saia do chute: transforme km rodados e litros abastecidos em consumo km/l e l/100 km — base para custo e comparações.",
    category: "auto_combustivel",
    doc: {
      formula: "km/l = distância (km) ÷ litros abastecidos.",
      variables: "Distância desde o último abastecimento completo; litros colocados no tanque.",
      howToUse:
        "Método cheio a cheio: encha, zere o odômetro, rode, encha de novo; use os litros desta segunda parada e a distância percorrida.",
      useCases: "Checar consumo real, comparar cidade e estrada.",
      edgeCases: "Tanque pela metade distorce o número; prefira ciclo cheio a cheio.",
      oQueVoceVe: [
        "Consumo em km/l e equivalente em litros a cada 100 km.",
        "Dicas rápidas conforme o resultado (consumo alto ou moderado).",
        "Gráficos dos valores informados.",
      ],
    },
    inputs: [
      { key: "km", label: "Distância rodada (km)", type: "distanceKm", min: 1, max: 5_000, step: 10, defaultValue: 420 },
      { key: "liters", label: "Litros abastecidos", type: "liters", min: 1, max: 200, step: 0.5, defaultValue: 38 },
    ],
    compute: wrapCompute(
      [
        { key: "km", label: "Distância rodada (km)", type: "distanceKm", min: 1, max: 5_000, step: 10, defaultValue: 420 },
        { key: "liters", label: "Litros abastecidos", type: "liters", min: 1, max: 200, step: 0.5, defaultValue: 38 },
      ],
      (v) => {
        const kml = v.km / v.liters;
        const out: CalcOutput = {
          summary: `Seu consumo médio nesse trecho foi de ${num(kml, 2)} km/l.`,
          figures: [
            { label: "km/l", value: `${num(kml, 2)} km/l` },
            { label: "Litros/100 km", value: `${num((100 * v.liters) / v.km, 1)} l/100 km` },
          ],
          interpretation: [
            "Quanto maior o km/l, menos litros você queima por quilômetro — é o alavancador nº1 para baratear o custo por km.",
          ],
          insights: [
            kml < 9
              ? "Consumo baixo para o segmento? Vale revisar calibragem, pneus ou estilo de pé — ou aceitar que o carro é sedento."
              : "Bom consumo relativo — agora o vilão costuma ser preço do litro, não o carro.",
          ],
        };
        return withAutoLayer(out, {});
      },
    ),
  },
  {
    slug: "custo-por-km-combustivel",
    title: "Custo por km (combustível)",
    shortDescription:
      "Veja quanto cada km custa só em combustível (R$/km e R$/100 km) — compare com outros modais e com elétrico depois.",
    category: "auto_combustivel",
    doc: {
      formula: "R$/km = preço do litro ÷ (km/l).",
      variables: "Preço por litro; consumo médio em km/l.",
      howToUse:
        "Use o preço médio que você paga e o consumo que você mediu (cheio a cheio ou média de meses). Referência urbana comum: 8–14 km/l em carros compactos.",
      useCases: "Uber vs carro próprio, decisão de rota, sensibilidade a preço do litro.",
      edgeCases: "km/l muito otimista subestima o custo real.",
      oQueVoceVe: [
        "Custo por km e por 100 km só de combustível.",
        "Impacto mensal e anual ilustrativo para ~1.200 km/mês (ajuste nos campos para seu caso).",
        "Lembrete de que seguro, IPVA e desvalorização não entram aqui.",
      ],
    },
    inputs: [
      { key: "priceLiter", label: "Preço do litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.89 },
      { key: "kml", label: "Consumo (km/l)", type: "efficiencyKml", min: 4, max: 25, step: 0.1, defaultValue: 11.5 },
    ],
    compute: wrapCompute(
      [
        { key: "priceLiter", label: "Preço do litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.89 },
        { key: "kml", label: "Consumo (km/l)", type: "efficiencyKml", min: 4, max: 25, step: 0.1, defaultValue: 11.5 },
      ],
      (v) => {
        const cpk = costPerKm(v.priceLiter, v.kml);
        const kmMonth = 1200;
        const monthly = fuelCostMonthly(kmMonth, v.kml, v.priceLiter);
        const annual = monthly * 12;
        const out: CalcOutput = {
          summary: `Cada km custa cerca de ${money(cpk)} só em combustível.`,
          figures: [
            { label: "R$/km (combustível)", value: money(cpk) },
            { label: "R$/100 km", value: money(cpk * 100) },
          ],
          interpretation: [
            "Esse número não inclui seguro, desvalorização nem pneu — é só o que some na bomba.",
          ],
        };
        return withAutoLayer(out, {
          monthlySpend: monthly,
          annualSpend: annual,
          patrimonyNote: `Só combustível: em 5 anos são ~${money(annual * 5)} — sem contar IPVA, revisão nem multa.`,
          insights: [
            cpk > 0.85
              ? "Caro por km: ou o litro está salgado, ou o carro bebe, ou os dois — alguém está te roubando silenciosamente."
              : "Custo por km ok para o cenário — o próximo passo é somar seguro e manutenção para ver o carro inteiro.",
          ],
        });
      },
    ),
  },
  {
    slug: "gasto-combustivel-mensal",
    title: "Quanto gasto de combustível por mês",
    shortDescription:
      "Estime litros e reais no mês com km rodados, consumo e preço do litro — orçamento de mobilidade na prática.",
    category: "auto_combustivel",
    doc: {
      formula: "Gasto = (km no mês ÷ km/l) × preço/litro.",
      variables: "Km rodados no mês; km/l médio; preço médio do litro.",
      howToUse:
        "Use km do odômetro ou app; média de 2–3 meses reduz ruído. Referência Brasil: muitos motoristas ficam entre 12.000 e 20.000 km/ano.",
      useCases: "Orçamento doméstico, comparar mês normal e mês de viagem.",
      edgeCases: "Viagens longas distorcem um único mês.",
      oQueVoceVe: [
        "Litros estimados no mês e gasto em reais.",
        "Projeção de gasto anual só de combustível.",
        "Dicas conforme o valor mensal.",
      ],
    },
    inputs: [
      { key: "kmMonth", label: "Km rodados no mês", type: "distanceKm", min: 50, max: 8_000, step: 50, defaultValue: 1_400 },
      { key: "kml", label: "Consumo médio (km/l)", type: "efficiencyKml", min: 4, max: 25, step: 0.1, defaultValue: 11 },
      { key: "priceLiter", label: "Preço do litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
    ],
    compute: wrapCompute(
      [
        { key: "kmMonth", label: "Km rodados no mês", type: "distanceKm", min: 50, max: 8_000, step: 50, defaultValue: 1_400 },
        { key: "kml", label: "Consumo médio (km/l)", type: "efficiencyKml", min: 4, max: 25, step: 0.1, defaultValue: 11 },
        { key: "priceLiter", label: "Preço do litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      ],
      (v) => {
        const liters = v.kmMonth / v.kml;
        const monthly = liters * v.priceLiter;
        const annual = monthly * 12;
        const out: CalcOutput = {
          summary: `No mês, você deve queimar ~${num(liters, 0)} litros — cerca de ${money(monthly)} na bomba.`,
          figures: [
            { label: "Litros/mês", value: `${num(liters, 1)} l` },
            { label: "Gasto mensal", value: money(monthly) },
            { label: "Gasto anual (projeção)", value: money(annual) },
          ],
          interpretation: [
            `Se você continuar nesse ritmo, são ${money(annual)} só de combustível em 12 meses — dinheiro que não volta nem com o retrovisor.`,
          ],
          insights: [
            monthly > 900
              ? "Desperdício invisível: revisar rota, carona ou um carro mais econômico pode valer mais que 'caçar' 10 centavos no posto."
              : "Gasto controlado — mantenha pneu calibrado; isso sozinho às vezes dá 1 km/l de graça.",
          ],
        };
        return withAutoLayer(out, { monthlySpend: monthly, annualSpend: annual });
      },
    ),
  },
  {
    slug: "gasto-combustivel-viagem",
    title: "Gasto de combustível na viagem",
    shortDescription:
      "Planeje a viagem: informe km totais (ida e volta), consumo e preço do litro — litros e custo só de combustível.",
    category: "auto_combustivel",
    doc: {
      formula: "Custo = (km da viagem ÷ km/l) × preço/litro.",
      variables: "Distância total; consumo; preço do litro.",
      howToUse:
        "Some ida e volta no km. Em trecho misto, use consumo médio realista (cidade costuma puxar o consumo para baixo).",
      useCases: "Dividir carona, comparar com avião ou ônibus, orçamento de feriado.",
      edgeCases: "Subidas, ar ligado e carga aumentam consumo.",
      oQueVoceVe: [
        "Litros estimados e custo total de combustível da viagem.",
        "Custo por km só de combustível.",
        "Lembrete de somar pedágio e estacionamento fora desta conta.",
      ],
    },
    inputs: [
      { key: "tripKm", label: "Km da viagem (total)", type: "distanceKm", min: 10, max: 6_000, step: 10, defaultValue: 520 },
      { key: "kml", label: "Consumo (km/l)", type: "efficiencyKml", min: 4, max: 25, step: 0.1, defaultValue: 10.5 },
      { key: "priceLiter", label: "Preço do litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.85 },
    ],
    compute: wrapCompute(
      [
        { key: "tripKm", label: "Km da viagem (total)", type: "distanceKm", min: 10, max: 6_000, step: 10, defaultValue: 520 },
        { key: "kml", label: "Consumo (km/l)", type: "efficiencyKml", min: 4, max: 25, step: 0.1, defaultValue: 10.5 },
        { key: "priceLiter", label: "Preço do litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.85 },
      ],
      (v) => {
        const liters = v.tripKm / v.kml;
        const cost = liters * v.priceLiter;
        const out: CalcOutput = {
          summary: `Essa viagem consome ~${num(liters, 1)} litros — uns ${money(cost)} só de combustível.`,
          figures: [
            { label: "Litros estimados", value: `${num(liters, 1)} l` },
            { label: "Custo combustível", value: money(cost) },
            { label: "R$/km", value: money(cost / v.tripKm) },
          ],
          interpretation: ["Some pedágio, estacionamento e desgaste — o combustível é só a parte que grita no cartão."],
          insights: [
            cost > 400
              ? "Viagem cara na bomba: vale simular dividir com alguém — meio tanque já paga um lanche de estrada."
              : "Custo moderado — a decisão real costuma ser tempo vs conforto, não só reais.",
          ],
        };
        return withAutoLayer(out, {
          insights: [],
        });
      },
    ),
  },
  {
    slug: "custo-encher-tanque",
    title: "Quanto custa encher o tanque",
    shortDescription:
      "Multiplique litros do tanque (ou do abastecimento) pelo preço do litro — saiba o impacto de uma parada no posto.",
    category: "auto_combustivel",
    doc: {
      formula: "Custo = litros × preço/litro.",
      variables: "Capacidade ou litros abastecidos; preço por litro.",
      howToUse:
        "Use litros que cabem na prática (reserva da bomba). Compare bandeiras e formas de pagamento com desconto.",
      useCases: "Planejar viagem, choque de realidade no posto, orçamento semanal.",
      edgeCases: "Preço varia por bandeira, cidade e data.",
      oQueVoceVe: [
        "Total pago na bomba para o volume informado.",
        "Preço por litro utilizado.",
        "Referência de impacto mensal ilustrativa.",
      ],
    },
    inputs: [
      { key: "tankLiters", label: "Litros (tanque cheio)", type: "liters", min: 20, max: 120, step: 1, defaultValue: 52 },
      { key: "priceLiter", label: "Preço do litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.92 },
    ],
    compute: wrapCompute(
      [
        { key: "tankLiters", label: "Litros (tanque cheio)", type: "liters", min: 20, max: 120, step: 1, defaultValue: 52 },
        { key: "priceLiter", label: "Preço do litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.92 },
      ],
      (v) => {
        const total = v.tankLiters * v.priceLiter;
        const out: CalcOutput = {
          summary: `Encher esses ${num(v.tankLiters, 0)} litros sai por ~${money(total)}.`,
          figures: [
            { label: "Total na bomba", value: money(total) },
            { label: "Por litro", value: money(v.priceLiter) },
          ],
          interpretation: ["Se o valor te assusta, lembre: o carro não economiza sozinho — quem economiza é o pé e o planejamento de rota."],
          insights: [
            total > 450
              ? "Tanque grande + gasolina cara = mini-boleto mensal. Programar posto e forma de pagamento às vezes dá desconto real."
              : "Valor dentro do esperado — compare com seu orçamento de mobilidade, não com o Instagram.",
          ],
        };
        return withAutoLayer(out, { monthlySpend: total, annualSpend: total * 3 });
      },
    ),
  },
  {
    slug: "etanol-ou-gasolina",
    title: "Etanol ou gasolina: qual compensa",
    shortDescription:
      "No flex, compare custo por km com preços e consumos reais de etanol e gasolina — inclui cenário mensal típico.",
    category: "auto_comparacao",
    doc: {
      formula: "Melhor custo/km = menor entre P_et/km/l_et e P_gas/km/l_gas.",
      variables: "Preço etanol; preço gasolina; km/l com etanol; km/l com gasolina.",
      howToUse:
        "Meça consumo em trechos parecidos para cada combustível. Regra prática: etanol tende a compensar quando (P_etanol ÷ P_gasolina) < (km/l_etanol ÷ km/l_gasolina).",
      useCases: "Decisão no posto, comparar calor e altitude.",
      edgeCases: "Motor mal regulado ou combustível fora de especificação distorce o resultado.",
      oQueVoceVe: [
        "Custo por km de cada opção e qual está mais barata hoje.",
        "Tabela comparativa de gasto mensal em um cenário de km (ex.: 1.200 km).",
        "Interpretação com a razão de preços e a razão de consumos.",
      ],
    },
    inputs: [
      { key: "priceEth", label: "Preço etanol (l)", type: "currency", min: 2, max: 16, step: 0.05, defaultValue: 3.89 },
      { key: "priceGas", label: "Preço gasolina (l)", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      { key: "kmlEth", label: "Km/l com etanol", type: "efficiencyKml", min: 3, max: 18, step: 0.1, defaultValue: 7.8 },
      { key: "kmlGas", label: "Km/l com gasolina", type: "efficiencyKml", min: 4, max: 22, step: 0.1, defaultValue: 11.2 },
    ],
    compute: wrapCompute(
      [
        { key: "priceEth", label: "Preço etanol (l)", type: "currency", min: 2, max: 16, step: 0.05, defaultValue: 3.89 },
        { key: "priceGas", label: "Preço gasolina (l)", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
        { key: "kmlEth", label: "Km/l com etanol", type: "efficiencyKml", min: 3, max: 18, step: 0.1, defaultValue: 7.8 },
        { key: "kmlGas", label: "Km/l com gasolina", type: "efficiencyKml", min: 4, max: 22, step: 0.1, defaultValue: 11.2 },
      ],
      (v) => {
        const cpkE = costPerKm(v.priceEth, v.kmlEth);
        const cpkG = costPerKm(v.priceGas, v.kmlGas);
        const ratio = v.priceEth / v.priceGas;
        const ratioNeed = v.kmlEth / v.kmlGas;
        const pickEth = cpkE < cpkG;
        const winner = pickEth ? "Etanol" : "Gasolina";
        const kmMonth = 1200;
        const saveMonth = Math.abs(fuelCostMonthly(kmMonth, v.kmlEth, v.priceEth) - fuelCostMonthly(kmMonth, v.kmlGas, v.priceGas));
        const out: CalcOutput = {
          summary: `Hoje, por km, ${winner} ganha — custo/km etanol ${money(cpkE)} vs gasolina ${money(cpkG)}.`,
          figures: [
            { label: "R$/km etanol", value: money(cpkE) },
            { label: "R$/km gasolina", value: money(cpkG) },
            { label: "Preço etanol ÷ gasolina", value: num(ratio, 3) },
            { label: "Razão km/l (et÷gas)", value: num(ratioNeed, 3) },
          ],
          interpretation: [
            `Regra prática: etanol tende a compensar quando (P_etanol ÷ P_gas) < (km/l_et ÷ km/l_gas). Aqui: ${num(ratio, 3)} vs ${num(ratioNeed, 3)}.`,
          ],
          scenarioCompare: {
            title: "Cenário: 1.200 km no mês",
            rows: [
              {
                label: "Gasto mensal na bomba",
                a: money(fuelCostMonthly(kmMonth, v.kmlEth, v.priceEth)),
                b: money(fuelCostMonthly(kmMonth, v.kmlGas, v.priceGas)),
                winner: pickEth ? "a" : "b",
              },
            ],
          },
          insights: [
            pickEth
              ? "Gasolina está no banco: hoje o etanol paga o jantar do posto."
              : "Etanol perdeu a briga hoje — a menos que você goste de pagar para ser eco-chique no bolso.",
            `Trocar de opção nesse perfil mexe ~${money(saveMonth)} por mês — pequeno no posto, grande no ano.`,
          ],
        };
        return withAutoLayer(out, {
          monthlySpend: Math.min(fuelCostMonthly(kmMonth, v.kmlEth, v.priceEth), fuelCostMonthly(kmMonth, v.kmlGas, v.priceGas)),
          annualSpend: Math.min(fuelCostMonthly(kmMonth, v.kmlEth, v.priceEth), fuelCostMonthly(kmMonth, v.kmlGas, v.priceGas)) * 12,
        });
      },
    ),
  },
  {
    slug: "gasolina-ou-diesel",
    title: "Gasolina ou diesel",
    shortDescription:
      "Compare custo mensal na bomba (e um extra de manutenção típico no diesel) no mesmo perfil de km — visão parcial de TCO.",
    category: "auto_comparacao",
    doc: {
      formula: "Custo/km = P/litro ÷ km/l; some manutenção extra diesel se quiser comparar TCO parcial.",
      variables: "Preços, consumos, extra mensal médio diesel (filtros, Arla, oficina).",
      howToUse:
        "Diesel costuma render mais em estrada; em cidade curta a vantagem de consumo some. Ajuste o extra mensal conforme sua oficina.",
      useCases: "SUV, picape, uso misto.",
      edgeCases: "Política de emissões e revenda mudam o jogo fora da conta da bomba.",
      oQueVoceVe: [
        "Custo mensal comparado e custo por km (com extra diesel rateado no km).",
        "Cenário com km mensal fixo para comparar lados.",
        "Leitura sobre manutenção e perfil de uso.",
      ],
    },
    inputs: [
      { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      { key: "kmlGas", label: "Km/l gasolina", type: "efficiencyKml", min: 4, max: 22, step: 0.1, defaultValue: 10.5 },
      { key: "priceDie", label: "Preço diesel", type: "currency", min: 3, max: 18, step: 0.05, defaultValue: 5.49 },
      { key: "kmlDie", label: "Km/l diesel", type: "efficiencyKml", min: 6, max: 22, step: 0.1, defaultValue: 13.2 },
      { key: "dieselExtraMonth", label: "Extra mensal diesel (manut.)", type: "currency", min: 0, max: 2_000, step: 20, defaultValue: 120 },
    ],
    compute: wrapCompute(
      [
        { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
        { key: "kmlGas", label: "Km/l gasolina", type: "efficiencyKml", min: 4, max: 22, step: 0.1, defaultValue: 10.5 },
        { key: "priceDie", label: "Preço diesel", type: "currency", min: 3, max: 18, step: 0.05, defaultValue: 5.49 },
        { key: "kmlDie", label: "Km/l diesel", type: "efficiencyKml", min: 6, max: 22, step: 0.1, defaultValue: 13.2 },
        { key: "dieselExtraMonth", label: "Extra mensal diesel (manut.)", type: "currency", min: 0, max: 2_000, step: 20, defaultValue: 120 },
      ],
      (v) => {
        const kmMonth = 1400;
        const gasMonth = fuelCostMonthly(kmMonth, v.kmlGas, v.priceGas);
        const dieFuel = fuelCostMonthly(kmMonth, v.kmlDie, v.priceDie);
        const dieMonth = dieFuel + v.dieselExtraMonth;
        const pickDie = dieMonth < gasMonth;
        const cpkG = costPerKm(v.priceGas, v.kmlGas);
        const cpkD = costPerKm(v.priceDie, v.kmlDie) + v.dieselExtraMonth / kmMonth;
        const out: CalcOutput = {
          summary: pickDie
            ? `No bolso mensal (combustível + extra), diesel leva vantagem: ${money(dieMonth)} vs ${money(gasMonth)}.`
            : `Gasolina fica mais barata no mês: ${money(gasMonth)} vs ${money(dieMonth)} (com extra diesel).`,
          figures: [
            { label: "Mês gasolina", value: money(gasMonth) },
            { label: "Mês diesel (comb+extra)", value: money(dieMonth) },
            { label: "R$/km gasolina", value: money(cpkG) },
            { label: "R$/km diesel ajustado", value: money(cpkD) },
          ],
          interpretation: [
            "Diesel pode economizar combustível e torque; gasolina simplifica manutenção e revenda em alguns mercados.",
          ],
          scenarioCompare: {
            title: "Cenário: 1.400 km/mês",
            rows: [
              {
                label: "Total mensal estimado",
                a: money(gasMonth),
                b: money(dieMonth),
                winner: pickDie ? "b" : "a",
              },
            ],
          },
          insights: [
            pickDie
              ? "Diesel ganhou na conta — mas se você só anda 300 km/mês na cidade, talvez esteja pagando caminhão para ir na padaria."
              : "Gasolina na frente — diesel precisa de km alto para amortizar o drama de oficina e preço.",
          ],
        };
        return withAutoLayer(out, { monthlySpend: Math.min(gasMonth, dieMonth), annualSpend: Math.min(gasMonth, dieMonth) * 12 });
      },
    ),
  },
  {
    slug: "combustivel-menor-custo-km",
    title: "Combustível ideal (menor custo por km)",
    shortDescription:
      "Coloque etanol, gasolina e diesel na mesma régua: menor R$/km com os preços e consumos que você informar.",
    category: "auto_comparacao",
    doc: {
      formula: "Para cada opção: R$/km = preço ÷ km/l; escolha o menor.",
      variables: "Três preços e três consumos em km/l.",
      howToUse: "Use consumos medidos no mesmo tipo de uso (cidade ou estrada) para comparação justa.",
      useCases: "Frota pequena, viagem interestadual, decisão no posto.",
      edgeCases: "Nem todo veículo de passeio aceita diesel.",
      oQueVoceVe: [
        "Ranking de custo por km e destaque do vencedor.",
        "Comparação de gasto mensal em cenário fixo de km.",
        "Gráfico de barras entre opções.",
      ],
    },
    inputs: [
      { key: "pE", label: "Preço etanol", type: "currency", min: 2, max: 16, step: 0.05, defaultValue: 3.79 },
      { key: "pG", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.69 },
      { key: "pD", label: "Preço diesel", type: "currency", min: 3, max: 18, step: 0.05, defaultValue: 5.39 },
      { key: "kE", label: "Km/l etanol", type: "efficiencyKml", min: 3, max: 18, step: 0.1, defaultValue: 7.5 },
      { key: "kG", label: "Km/l gasolina", type: "efficiencyKml", min: 4, max: 22, step: 0.1, defaultValue: 11 },
      { key: "kD", label: "Km/l diesel", type: "efficiencyKml", min: 6, max: 24, step: 0.1, defaultValue: 13 },
    ],
    compute: wrapCompute(
      [
        { key: "pE", label: "Preço etanol", type: "currency", min: 2, max: 16, step: 0.05, defaultValue: 3.79 },
        { key: "pG", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.69 },
        { key: "pD", label: "Preço diesel", type: "currency", min: 3, max: 18, step: 0.05, defaultValue: 5.39 },
        { key: "kE", label: "Km/l etanol", type: "efficiencyKml", min: 3, max: 18, step: 0.1, defaultValue: 7.5 },
        { key: "kG", label: "Km/l gasolina", type: "efficiencyKml", min: 4, max: 22, step: 0.1, defaultValue: 11 },
        { key: "kD", label: "Km/l diesel", type: "efficiencyKml", min: 6, max: 24, step: 0.1, defaultValue: 13 },
      ],
      (v) => {
        const cpkE = costPerKm(v.pE, v.kE);
        const cpkG = costPerKm(v.pG, v.kG);
        const cpkD = costPerKm(v.pD, v.kD);
        const best = Math.min(cpkE, cpkG, cpkD);
        const name = best === cpkE ? "Etanol" : best === cpkG ? "Gasolina" : "Diesel";
        const out: CalcOutput = {
          summary: `Menor custo por km hoje: ${name} (${money(best)} / km).`,
          figures: [
            { label: "R$/km etanol", value: money(cpkE) },
            { label: "R$/km gasolina", value: money(cpkG) },
            { label: "R$/km diesel", value: money(cpkD) },
          ],
          interpretation: ["Isso é só bomba — carro diesel ainda tem custos fixos que às vezes comem a vantagem."],
          scenarioCompare: {
            title: "Ranking custo/km (menor vence)",
            rows: [
              { label: "Etanol", a: money(cpkE) },
              { label: "Gasolina", a: money(cpkG) },
              { label: "Diesel", a: money(cpkD) },
            ],
          },
          insights: [
            `A diferença entre o melhor e o pior aqui é ${money(Math.max(cpkE, cpkG, cpkD) - best)} por km — parece troco, vira aluguel em um ano.`,
          ],
        };
        return withAutoLayer(out, {});
      },
    ),
  },
  {
    slug: "custo-mensal-carro",
    title: "Custo mensal do carro",
    shortDescription:
      "Some combustível, seguro (rateado), manutenção, financiamento e extras — veja quanto o carro pesa no mês.",
    category: "auto_custo_carro",
    doc: {
      formula: "Custo mensal ≈ combustível + seguro/12 + manutenção média + financiamento + estacionamento.",
      variables: "Km/mês, km/l, preço/litro, seguro anual, manutenção mensal média, parcela, extras.",
      howToUse:
        "Use médias de 12 meses para manutenção (inclui pneu amortizado, revisões). IPVA e multas podem ser somados à parte em uma planilha anual.",
      useCases: "Troca de carro, vender segundo carro, comparar com app.",
      edgeCases: "Multas e IPVA concentrados distorcem um único mês.",
      oQueVoceVe: [
        "Total mensal estimado e destaque do maior componente.",
        "Composição do custo (combustível, seguro, manutenção, parcela, extras).",
        "Impacto anual e lembretes sobre o que ficou de fora.",
      ],
    },
    inputs: [
      { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 100, max: 6_000, step: 50, defaultValue: 1_200 },
      { key: "kml", label: "Km/l", type: "efficiencyKml", min: 4, max: 22, step: 0.1, defaultValue: 10.5 },
      { key: "priceLiter", label: "Preço litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      { key: "insuranceYear", label: "Seguro (ano)", type: "currency", min: 0, max: 50_000, step: 100, defaultValue: 4_800 },
      { key: "maintMonth", label: "Manutenção (mês)", type: "currency", min: 0, max: 5_000, step: 50, defaultValue: 350 },
      { key: "financeMonth", label: "Financiamento (mês)", type: "currency", min: 0, max: 8_000, step: 50, defaultValue: 1_890 },
      { key: "extraMonth", label: "Estacionamento/outros (mês)", type: "currency", min: 0, max: 3_000, step: 20, defaultValue: 200 },
    ],
    compute: wrapCompute(
      [
        { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 100, max: 6_000, step: 50, defaultValue: 1_200 },
        { key: "kml", label: "Km/l", type: "efficiencyKml", min: 4, max: 22, step: 0.1, defaultValue: 10.5 },
        { key: "priceLiter", label: "Preço litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
        { key: "insuranceYear", label: "Seguro (ano)", type: "currency", min: 0, max: 50_000, step: 100, defaultValue: 4_800 },
        { key: "maintMonth", label: "Manutenção (mês)", type: "currency", min: 0, max: 5_000, step: 50, defaultValue: 350 },
        { key: "financeMonth", label: "Financiamento (mês)", type: "currency", min: 0, max: 8_000, step: 50, defaultValue: 1_890 },
        { key: "extraMonth", label: "Estacionamento/outros (mês)", type: "currency", min: 0, max: 3_000, step: 20, defaultValue: 200 },
      ],
      (v) => {
        const fuel = fuelCostMonthly(v.kmMonth, v.kml, v.priceLiter);
        const ins = v.insuranceYear / 12;
        const total = fuel + ins + v.maintMonth + v.financeMonth + v.extraMonth;
        const annual = total * 12;
        const out: CalcOutput = {
          summary: `Seu carro custa ~${money(total)} por mês nesse cenário — dá para sentir no PIX.`,
          figures: [
            { label: "Combustível", value: money(fuel) },
            { label: "Seguro (prorrata)", value: money(ins) },
            { label: "Manutenção", value: money(v.maintMonth) },
            { label: "Financiamento", value: money(v.financeMonth) },
            { label: "Extras", value: money(v.extraMonth) },
            { label: "Total mensal", value: money(total) },
          ],
          interpretation: [
            `Em 12 meses são ${money(annual)} — antes de trocar de carro, olhe para esse número, não só para a parcela.`,
          ],
          insights: [
            fuel > total * 0.45
              ? "O vilão é a bomba: rotas e consumo drenam mais que muita parcela 'barata'."
              : "Custos fixos pesam — às vezes quitar financiamento vale mais que trocar por 'economia' de 0,5 km/l.",
          ],
        };
        return withAutoLayer(out, {
          monthlySpend: total,
          annualSpend: annual,
          patrimonyNote: `Em 5 anos, ~${money(annual * 5)} saem da sua vida — sem contar desvalorização do carro.`,
        });
      },
    ),
  },
  {
    slug: "custo-anual-carro",
    title: "Custo anual do carro",
    shortDescription:
      "Multiplique o custo mensal típico por 12 e some eventuais anuais (ex.: IPVA) — visão de envelope anual.",
    category: "auto_custo_carro",
    doc: {
      formula: "Custo anual ≈ 12 × (combustível + seguro/12 + manutenção + financiamento + extras).",
      variables: "Mesmos do custo mensal, agregados.",
      howToUse: "Confronte com extratos e boletos do ano anterior para calibrar manutenção e seguro.",
      useCases: "Planejamento anual, metas de renda, cortar segundo carro.",
      edgeCases: "IPVA e licenciamento concentrados em um mês — some separado se quiser precisão fiscal.",
      oQueVoceVe: [
        "Total anual a partir do mês típico mais IPVA informado.",
        "Composição aproximada dos gastos.",
        "Projeção de impacto no bolso em 12 meses.",
      ],
    },
    inputs: [
      { key: "monthlyTotal", label: "Custo mensal típico (tudo)", type: "currency", min: 200, max: 25_000, step: 50, defaultValue: 3_400 },
      { key: "ipvaYear", label: "IPVA + licença (ano)", type: "currency", min: 0, max: 30_000, step: 100, defaultValue: 2_400 },
    ],
    compute: wrapCompute(
      [
        { key: "monthlyTotal", label: "Custo mensal típico (tudo)", type: "currency", min: 200, max: 25_000, step: 50, defaultValue: 3_400 },
        { key: "ipvaYear", label: "IPVA + licença (ano)", type: "currency", min: 0, max: 30_000, step: 100, defaultValue: 2_400 },
      ],
      (v) => {
        const annual = v.monthlyTotal * 12 + v.ipvaYear;
        const out: CalcOutput = {
          summary: `No ano, prepare ~${money(annual)} para manter o carro — é quase um 13º salário só dele.`,
          figures: [
            { label: "12× custo mensal", value: money(v.monthlyTotal * 12) },
            { label: "IPVA + licença", value: money(v.ipvaYear) },
            { label: "Total anual", value: money(annual) },
          ],
          interpretation: ["Se esse valor passa de 20–25% da sua renda, o carro está disputando o trono com a moradia."],
          insights: [
            annual > 40_000
              ? "Carro premium de custos: ou você usa muito a vantagem (tempo, conforto), ou está financiando ego."
              : "Patamar razoável para muitas famílias — o risco é subestimar desvalorização.",
          ],
        };
        return withAutoLayer(out, { monthlySpend: v.monthlyTotal, annualSpend: annual });
      },
    ),
  },
  {
    slug: "custo-total-propriedade-carro",
    title: "Custo total de propriedade (TCO simplificado)",
    shortDescription:
      "Depreciação simplificada (compra menos revenda) mais custos operacionais no tempo — compare carros no longo prazo.",
    category: "auto_custo_carro",
    doc: {
      formula: "TCO ≈ preço de compra − valor de revenda + (custo mensal × meses).",
      variables: "Valor pago no carro, % de revenda ao final, custo mensal médio, anos de posse.",
      howToUse:
        "Estime revenda como % do que você pagou (ex.: 55% após 5 anos). Faça cenário pessimista e otimista porque o mercado de usados oscila.",
      useCases: "Zero km vs seminovo, carro A vs B.",
      edgeCases: "Mercado de usados oscila; use faixa pessimista e otimista.",
      oQueVoceVe: [
        "Custo total estimado no período e custo médio por mês.",
        "Depreciação aproximada e custos operacionais acumulados.",
        "Interpretação sobre liquidez e revisões.",
      ],
    },
    inputs: [
      { key: "purchase", label: "Valor pago no carro", type: "currency", min: 5_000, max: 800_000, step: 500, defaultValue: 95_000 },
      { key: "residualPct", label: "Revenda ao final (% do pago)", type: "percent", min: 10, max: 95, step: 1, defaultValue: 52 },
      { key: "monthlyOp", label: "Custo operacional/mês", type: "currency", min: 200, max: 15_000, step: 50, defaultValue: 2_800 },
      { key: "years", label: "Anos de posse", type: "years", min: 1, max: 12, step: 1, defaultValue: 5 },
    ],
    compute: wrapCompute(
      [
        { key: "purchase", label: "Valor pago no carro", type: "currency", min: 5_000, max: 800_000, step: 500, defaultValue: 95_000 },
        { key: "residualPct", label: "Revenda ao final (% do pago)", type: "percent", min: 10, max: 95, step: 1, defaultValue: 52 },
        { key: "monthlyOp", label: "Custo operacional/mês", type: "currency", min: 200, max: 15_000, step: 50, defaultValue: 2_800 },
        { key: "years", label: "Anos de posse", type: "years", min: 1, max: 12, step: 1, defaultValue: 5 },
      ],
      (v) => {
        const months = Math.round(v.years * 12);
        const resale = v.purchase * (v.residualPct / 100);
        const dep = v.purchase - resale;
        const op = v.monthlyOp * months;
        const tco = dep + op;
        const out: CalcOutput = {
          summary: `Em ${v.years} anos, o TCO simplificado fica ~${money(tco)} (depreciação ${money(dep)} + operação ${money(op)}).`,
          figures: [
            { label: "Depreciação líquida", value: money(dep) },
            { label: "Operação acumulada", value: money(op) },
            { label: "TCO total", value: money(tco) },
            { label: "Custo médio/mês", value: money(tco / months) },
          ],
          interpretation: [
            "TCO ignora juros de oportunidade do capital — mas já dá uma lapada suficiente na fantasia de 'parcela baixa'.",
          ],
          insights: [
            dep > op * 0.6
              ? "Quem come seu bolso é a desvalorização — combustível é figurante."
              : "Operação pesa: talvez você rode demais para o carro que tem.",
          ],
        };
        return withAutoLayer(out, {
          monthlySpend: tco / months,
          annualSpend: (tco / months) * 12,
          patrimonyNote: `TCO ~${money(tco)} no período — dinheiro que não voltou nem como carro novo.`,
        });
      },
    ),
  },
  {
    slug: "custo-km-eletrico",
    title: "Custo por km (carro elétrico)",
    shortDescription:
      "Converta consumo em kWh/100 km e tarifa de energia em R$/km — compare com combustão no mesmo uso.",
    category: "auto_eletrico",
    doc: {
      formula: "R$/km = (kWh/100km ÷ 100) × preço do kWh.",
      variables: "Consumo médio kWh/100 km; preço kWh; opcional perdas de recarga.",
      howToUse:
        "Em casa use média da conta (R$/kWh). Em recarga rápida na rua, o kWh costuma ser mais caro. Tarifas brancas mudam o preço por horário.",
      useCases: "Comparar com combustão no mesmo trajeto.",
      edgeCases: "Picos de demanda e horários tarifários mudam o número.",
      oQueVoceVe: [
        "Custo por km só de energia.",
        "Impacto mensal ilustrativo para um km/mês de referência.",
        "Lembrete de perdas de recarga e diferença AC vs DC.",
      ],
    },
    inputs: [
      { key: "kwh100", label: "Consumo (kWh/100 km)", type: "energyKwhPer100km", min: 10, max: 35, step: 0.5, defaultValue: 17 },
      { key: "priceKwh", label: "Preço do kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.85 },
    ],
    compute: wrapCompute(
      [
        { key: "kwh100", label: "Consumo (kWh/100 km)", type: "energyKwhPer100km", min: 10, max: 35, step: 0.5, defaultValue: 17 },
        { key: "priceKwh", label: "Preço do kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.85 },
      ],
      (v) => {
        const kwhPerKm = v.kwh100 / 100;
        const cpk = kwhPerKm * v.priceKwh;
        const kmMonth = 1200;
        const monthly = cpk * kmMonth;
        const out: CalcOutput = {
          summary: `Energia na tomada: ~${money(cpk)} por km rodado.`,
          figures: [
            { label: "R$/km (energia)", value: money(cpk) },
            { label: "kWh/km", value: num(kwhPerKm, 3) },
          ],
          interpretation: ["Compare sempre com combustão no mesmo km/mês — a vitória do elétrico costuma ser mensal, não no preço da loja."],
          insights: [
            cpk < 0.12
              ? "Barato por km na energia — se a conta ainda doer, o problema pode ser financiamento ou seguro, não a tomada."
              : "Tarifa alta ou carro sedento — vale simular horário tarifário ou painel solar no médio prazo.",
          ],
        };
        return withAutoLayer(out, { monthlySpend: monthly, annualSpend: monthly * 12 });
      },
    ),
  },
  {
    slug: "economia-eletrico-vs-gasolina",
    title: "Economia: elétrico vs gasolina",
    shortDescription:
      "No mesmo km/mês, compare gasto com gasolina e com energia — diferença mensal, anual e percentual aproximada.",
    category: "auto_eletrico",
    doc: {
      formula: "Economia = custo_gas − custo_el, cada um com seu R$/km × km/mês.",
      variables: "Km/mês; km/l gasolina; preço gasolina; kWh/100km; preço kWh.",
      howToUse:
        "Mantenha o mesmo perfil de km. Ajuste preço do kWh ao seu caso (conta residencial vs rede). Não inclui seguro, IPVA nem desvalorização.",
      useCases: "Decidir troca, pedir reembolso de energia na empresa, conversa com dados.",
      edgeCases: "Híbrido plug-in mistura os dois mundos.",
      oQueVoceVe: [
        "Gasto mensal de cada lado e economia mensal/anual.",
        "Percentual aproximado de economia e custo por km de cada tecnologia.",
        "Tabela comparativa e gráficos.",
      ],
    },
    inputs: [
      { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 6_000, step: 50, defaultValue: 1_400 },
      { key: "kmlGas", label: "Km/l (gasolina)", type: "efficiencyKml", min: 5, max: 22, step: 0.1, defaultValue: 11 },
      { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      { key: "kwh100", label: "kWh/100 km (elétrico)", type: "energyKwhPer100km", min: 10, max: 35, step: 0.5, defaultValue: 16.5 },
      { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.82 },
    ],
    compute: wrapCompute(
      [
        { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 6_000, step: 50, defaultValue: 1_400 },
        { key: "kmlGas", label: "Km/l (gasolina)", type: "efficiencyKml", min: 5, max: 22, step: 0.1, defaultValue: 11 },
        { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
        { key: "kwh100", label: "kWh/100 km (elétrico)", type: "energyKwhPer100km", min: 10, max: 35, step: 0.5, defaultValue: 16.5 },
        { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.82 },
      ],
      (v) => {
        const gasMonth = fuelCostMonthly(v.kmMonth, v.kmlGas, v.priceGas);
        const cpkE = (v.kwh100 / 100) * v.priceKwh;
        const evMonth = cpkE * v.kmMonth;
        const save = gasMonth - evMonth;
        const out: CalcOutput = {
          summary:
            save > 0
              ? `Só energia vs gasolina: ~${money(save)} a menos por mês (${money(save * 12)} no ano).`
              : `No cenário, gasolina sai ${money(-save)} mais barata por mês — elétrico precisa de tarifa melhor ou carro mais eficiente.`,
          figures: [
            { label: "Mês gasolina", value: money(gasMonth) },
            { label: "Mês elétrico (energia)", value: money(evMonth) },
            { label: "Diferença", value: money(save) },
          ],
          interpretation: ["Não inclui depreciação nem seguro — é a briga da energia vs combustível no bolso do dia a dia."],
          scenarioCompare: {
            title: "Mesmo km/mês",
            rows: [{ label: "Gasto mensal", a: money(gasMonth), b: money(evMonth), winner: save > 0 ? "b" : "a" }],
          },
          insights: [
            save > 200
              ? "Economia real na conta — o próximo passo é ver se cobre financiamento e seguro mais caros do EV."
              : "Margem apertada: o 'vale a pena' vai morar no preço do carro e na sua paciência com recarga.",
          ],
        };
        return withAutoLayer(out, {
          monthlySpend: Math.min(gasMonth, evMonth),
          annualImpactText:
            save > 0
              ? `Só energia vs gasolina: ~${money(save * 12)} a menos por ano nesse km.`
              : `Gasolina ainda vence por ~${money(-save * 12)} no ano — revise tarifa ou consumo do EV.`,
          patrimonyNote:
            save > 0
              ? `Em 8 anos, só essa diferença na bomba soma ~${money(save * 12 * 8)} — antes de falar em ROI do elétrico.`
              : undefined,
        });
      },
    ),
  },
  {
    slug: "payback-troca-eletrico",
    title: "Tempo para compensar o elétrico (payback)",
    shortDescription:
      "Estime quantos meses o custo extra do elétrico leva para ser compensado pela economia mensal de energia vs gasolina.",
    category: "auto_eletrico",
    doc: {
      formula: "Meses ≈ custo_extra ÷ economia_mensal; custo_extra = preço_EV − valor_venda_atual.",
      variables: "Preço do elétrico, valor de venda do carro atual, economia mensal estimada na mobilidade.",
      howToUse:
        "Calcule antes a economia mensal com a calculadora elétrico vs gasolina no seu km. O payback ignora diferenças de seguro e manutenção.",
      useCases: "Frota, decisão de troca com horizonte de permanência.",
      edgeCases: "Seguro e manutenção diferentes do EV não entram — subestima ou superestima o payback.",
      oQueVoceVe: [
        "Custo líquido da troca e economia mensal assumida.",
        "Meses estimados para ‘pagar’ o custo extra.",
        "Alerta sobre limitações do modelo.",
      ],
    },
    inputs: [
      { key: "priceEv", label: "Preço elétrico (à vista)", type: "currency", min: 40_000, max: 600_000, step: 1_000, defaultValue: 189_000 },
      { key: "sellCurrent", label: "Venda do carro atual", type: "currency", min: 0, max: 400_000, step: 500, defaultValue: 72_000 },
      { key: "saveMonth", label: "Economia mensal (energia vs gas)", type: "currency", min: 50, max: 8_000, step: 20, defaultValue: 420 },
    ],
    compute: wrapCompute(
      [
        { key: "priceEv", label: "Preço elétrico (à vista)", type: "currency", min: 40_000, max: 600_000, step: 1_000, defaultValue: 189_000 },
        { key: "sellCurrent", label: "Venda do carro atual", type: "currency", min: 0, max: 400_000, step: 500, defaultValue: 72_000 },
        { key: "saveMonth", label: "Economia mensal (energia vs gas)", type: "currency", min: 50, max: 8_000, step: 20, defaultValue: 420 },
      ],
      (v) => {
        const extra = Math.max(0, v.priceEv - v.sellCurrent);
        const months = v.saveMonth > 0 ? extra / v.saveMonth : Infinity;
        const years = months / 12;
        const out: CalcOutput = {
          summary:
            Number.isFinite(months) && months < 600
              ? `Payback simplificado: ~${Math.ceil(months)} meses (~${num(years, 1)} anos) só na economia de combustível vs energia.`
              : "Economia mensal muito baixa ou zero — payback explode ou nem existe.",
          figures: [
            { label: "Custo líquido de troca", value: money(extra) },
            { label: "Economia/mês assumida", value: money(v.saveMonth) },
          ],
          interpretation: [
            "ROI real inclui seguro, financiamento, recarga pública e revenda — aqui é só o filtro 'vale a pena sonhar?'.",
          ],
          insights: [
            Number.isFinite(months) && months > 120
              ? "Payback longo: você pode estar trocando carro por estética tech, não por matemática."
              : "Payback curto na energia ainda não paga o mundo — mas destrava a conversa com a planilha.",
          ],
        };
        return withAutoLayer(out, {
          annualImpactText: `Economia anual assumida: ${money(v.saveMonth * 12)} — se cair pela metade, dobre o tempo na cabeça.`,
        });
      },
    ),
  },
  {
    slug: "custo-recarga-eletrico",
    title: "Custo de recarga (elétrico)",
    shortDescription:
      "Multiplique kWh recarregados pela tarifa — útil para comparar recarga em casa, shopping ou eletroposto.",
    category: "auto_eletrico",
    doc: {
      formula: "Custo = kWh recarregados × preço/kWh.",
      variables: "kWh do SOC inicial ao final; tarifa média.",
      howToUse:
        "Em AC em casa use o kWh da conta. Em DC na rua use o preço do provedor. Valores residenciais no Brasil costumam variar bastante por distribuidora.",
      useCases: "Orçamento de viagem, comparar horário tarifário.",
      edgeCases: "Perdas entre rede e bateria aumentam kWh cobrados.",
      oQueVoceVe: [
        "Custo total da recarga informada.",
        "Tarifa usada e kWh.",
        "Gráfico dos insumos.",
      ],
    },
    inputs: [
      { key: "kwh", label: "kWh recarregados", type: "number", min: 5, max: 120, step: 1, defaultValue: 45 },
      { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 4, step: 0.02, defaultValue: 1.15 },
    ],
    compute: wrapCompute(
      [
        { key: "kwh", label: "kWh recarregados", type: "number", min: 5, max: 120, step: 1, defaultValue: 45 },
        { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 4, step: 0.02, defaultValue: 1.15 },
      ],
      (v) => {
        const cost = v.kwh * v.priceKwh;
        const out: CalcOutput = {
          summary: `Essa recarga custa ~${money(cost)} — menos que muitos acham, mais que deveria se você carrega em DC caro sem pressa.`,
          figures: [
            { label: "Total", value: money(cost) },
            { label: "Por kWh", value: money(v.priceKwh) },
          ],
          interpretation: ["Combine com consumo kWh/100 km para estimar custo por viagem completa."],
          insights: [
            v.priceKwh > 1.4
              ? "Tarifa de shopping/DC está comendo a vantagem do elétrico — casa dormindo carregando é outro jogo."
              : "Tarifa ok — agora o drama é hábito: carregar fora de pico pesa no bolso menos que café de aeroporto.",
          ],
        };
        return withAutoLayer(out, {});
      },
    ),
  },
  {
    slug: "comparador-eletrico-hibrido-gasolina",
    title: "Comparador: elétrico × híbrido × gasolina",
    shortDescription:
      "No mesmo km/mês, compare custo mensal de energia ou combustível entre elétrico, híbrido e gasolina — visão lado a lado.",
    category: "auto_eletrico",
    doc: {
      formula: "Gasolina: km/km/l×P; Híbrido: mesma lógica com km/l maior; Elétrico: kWh/km×P_kWh.",
      variables: "Km/mês; consumos; preços.",
      howToUse:
        "Ajuste o km/l do híbrido ao seu trânsito. Plug-in com muita tomada precisa de km/l “efetivo” maior — aqui é média simplificada.",
      useCases: "Próximo carro, educação, frota.",
      edgeCases: "Híbrido plug-in depende de % elétrico — aqui é média simplificada.",
      oQueVoceVe: [
        "Gasto mensal de cada tecnologia e ranking.",
        "Tabela comparativa e gráfico de barras.",
        "Interpretação sobre perfil de uso.",
      ],
    },
    inputs: [
      { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 5_000, step: 50, defaultValue: 1_500 },
      { key: "kmlGas", label: "Km/l gasolina pura", type: "efficiencyKml", min: 5, max: 20, step: 0.1, defaultValue: 10.5 },
      { key: "kmlHybrid", label: "Km/l híbrido (média)", type: "efficiencyKml", min: 6, max: 28, step: 0.1, defaultValue: 15 },
      { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      { key: "kwh100", label: "kWh/100 km elétrico", type: "energyKwhPer100km", min: 12, max: 32, step: 0.5, defaultValue: 16 },
      { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.84 },
    ],
    compute: wrapCompute(
      [
        { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 5_000, step: 50, defaultValue: 1_500 },
        { key: "kmlGas", label: "Km/l gasolina pura", type: "efficiencyKml", min: 5, max: 20, step: 0.1, defaultValue: 10.5 },
        { key: "kmlHybrid", label: "Km/l híbrido (média)", type: "efficiencyKml", min: 6, max: 28, step: 0.1, defaultValue: 15 },
        { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
        { key: "kwh100", label: "kWh/100 km elétrico", type: "energyKwhPer100km", min: 12, max: 32, step: 0.5, defaultValue: 16 },
        { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.84 },
      ],
      (v) => {
        const g = fuelCostMonthly(v.kmMonth, v.kmlGas, v.priceGas);
        const h = fuelCostMonthly(v.kmMonth, v.kmlHybrid, v.priceGas);
        const e = (v.kwh100 / 100) * v.priceKwh * v.kmMonth;
        const best = Math.min(g, h, e);
        const label = best === e ? "Elétrico (energia)" : best === h ? "Híbrido" : "Gasolina";
        const out: CalcOutput = {
          summary: `No bolso da mobilidade (só energia/combustível), quem manda hoje: ${label} com ~${money(best)}/mês.`,
          figures: [
            { label: "Gasolina", value: money(g) },
            { label: "Híbrido", value: money(h) },
            { label: "Elétrico", value: money(e) },
          ],
          interpretation: ["Híbrido costura bem cidade; elétrico depende da tarifa; gasolina é o baseline teimoso."],
          scenarioCompare: {
            title: "Mesmo km/mês",
            rows: [
              { label: "Gasolina", a: money(g) },
              { label: "Híbrido", a: money(h) },
              { label: "Elétrico", a: money(e) },
            ],
          },
          insights: [
            `Spread máximo entre os três: ${money(Math.max(g, h, e) - best)}/mês — multiplique por 12 antes de se emocionar no showroom.`,
          ],
        };
        return withAutoLayer(out, { monthlySpend: best, annualSpend: best * 12 });
      },
    ),
  },
  {
    slug: "hibrido-ou-eletrico",
    title: "Híbrido ou elétrico",
    shortDescription:
      "Compare custo mensal de gasolina no híbrido com custo de energia no elétrico no mesmo km — útil quem não tem tomada em casa.",
    category: "auto_eletrico",
    doc: {
      formula: "Compara custo mensal de combustível (híbrido) vs energia (elétrico).",
      variables: "Km/mês; km/l híbrido; preço gasolina; kWh/100 km; preço kWh.",
      howToUse:
        "Ajuste o km/l do híbrido ao trânsito real. Plug-in com muita recarga elétrica exige km/l efetivo maior do que um híbrido comum.",
      useCases: "Ponte entre combustão pura e elétrico, decisão de garagem.",
      edgeCases: "Híbrido plug-in com muita tomada vira quase EV — km/l sobe demais na média.",
      oQueVoceVe: [
        "Gasto mensal de cada lado e qual sai mais barato na energia/combustível.",
        "Cenário fixo de km para comparar.",
        "Gráficos e leitura curta.",
      ],
    },
    inputs: [
      { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 5_000, step: 50, defaultValue: 1_400 },
      { key: "kmlHyb", label: "Km/l (híbrido)", type: "efficiencyKml", min: 7, max: 28, step: 0.1, defaultValue: 16 },
      { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      { key: "kwh100", label: "kWh/100 km (elétrico)", type: "energyKwhPer100km", min: 12, max: 32, step: 0.5, defaultValue: 16 },
      { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.88 },
    ],
    compute: wrapCompute(
      [
        { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 5_000, step: 50, defaultValue: 1_400 },
        { key: "kmlHyb", label: "Km/l (híbrido)", type: "efficiencyKml", min: 7, max: 28, step: 0.1, defaultValue: 16 },
        { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
        { key: "kwh100", label: "kWh/100 km (elétrico)", type: "energyKwhPer100km", min: 12, max: 32, step: 0.5, defaultValue: 16 },
        { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.88 },
      ],
      (v) => {
        const hCost = fuelCostMonthly(v.kmMonth, v.kmlHyb, v.priceGas);
        const eCost = (v.kwh100 / 100) * v.priceKwh * v.kmMonth;
        const evWins = eCost < hCost;
        const out: CalcOutput = {
          summary: evWins
            ? `Elétrico na frente: ${money(eCost)}/mês vs ${money(hCost)}/mês do híbrido (só energia vs combustível).`
            : `Híbrido ganha hoje: ${money(hCost)}/mês vs ${money(eCost)}/mês do elétrico — tarifa ou carro sedento.`,
          figures: [
            { label: "Híbrido (comb.)", value: money(hCost) },
            { label: "Elétrico (energia)", value: money(eCost) },
          ],
          interpretation: ["Se não tem onde carregar barato, o híbrido continua sendo adulto na sala."],
          scenarioCompare: {
            title: "Mesmo km/mês",
            rows: [{ label: "Gasto mensal", a: money(hCost), b: money(eCost), winner: evWins ? "b" : "a" }],
          },
          insights: [
            Math.abs(hCost - eCost) < 80
              ? "Empate técnico no bolso — a decisão vira praticidade (tomada, viagem longa, revenda)."
              : evWins
                ? "Elétrico manda na conta — agora sobreviva à conversa do seguro e da revisão."
                : "Híbrido paga as contas de mobilidade — elétrico pode esperar tarifa melhor ou carro mais eficiente.",
          ],
        };
        return withAutoLayer(out, { monthlySpend: Math.min(hCost, eCost), annualSpend: Math.min(hCost, eCost) * 12 });
      },
    ),
  },
  {
    slug: "simulador-troca-carro",
    title: "Simulador: trocar de carro (gasolina → elétrico)",
    shortDescription:
      "Some o custo líquido da troca (novo menos valor de venda) à diferença mensal entre gasolina e energia — visão de fluxo.",
    category: "auto_simulacao",
    doc: {
      formula: "Saída líquida = preço_novo − venda_atual; compare gasto mensal combustível vs energia.",
      variables: "Preços, consumos, km/mês, tarifa kWh.",
      howToUse:
        "Use economia mensal conservadora. Se houver financiamento, some entrada e parcela fora deste modelo simplificado.",
      useCases: "Decidir troca com números, não só com lista de desejos.",
      edgeCases: "Financiamento com entrada embutida muda fluxo de caixa.",
      oQueVoceVe: [
        "Saída de caixa líquida da troca e economia mensal na ‘tanque’.",
        "Meses para compensar o custo líquido com a economia (ordem de grandeza).",
        "Comparação lado a lado e gráficos.",
      ],
    },
    inputs: [
      { key: "newPrice", label: "Preço novo (EV)", type: "currency", min: 50_000, max: 500_000, step: 1_000, defaultValue: 175_000 },
      { key: "sellOld", label: "Venda do atual", type: "currency", min: 0, max: 300_000, step: 500, defaultValue: 65_000 },
      { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 5_000, step: 50, defaultValue: 1_400 },
      { key: "kmlOld", label: "Km/l carro atual", type: "efficiencyKml", min: 5, max: 18, step: 0.1, defaultValue: 9.5 },
      { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      { key: "kwh100", label: "kWh/100 km (EV)", type: "energyKwhPer100km", min: 12, max: 32, step: 0.5, defaultValue: 15.5 },
      { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.85 },
    ],
    compute: wrapCompute(
      [
        { key: "newPrice", label: "Preço novo (EV)", type: "currency", min: 50_000, max: 500_000, step: 1_000, defaultValue: 175_000 },
        { key: "sellOld", label: "Venda do atual", type: "currency", min: 0, max: 300_000, step: 500, defaultValue: 65_000 },
        { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 5_000, step: 50, defaultValue: 1_400 },
        { key: "kmlOld", label: "Km/l carro atual", type: "efficiencyKml", min: 5, max: 18, step: 0.1, defaultValue: 9.5 },
        { key: "priceGas", label: "Preço gasolina", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
        { key: "kwh100", label: "kWh/100 km (EV)", type: "energyKwhPer100km", min: 12, max: 32, step: 0.5, defaultValue: 15.5 },
        { key: "priceKwh", label: "Preço kWh", type: "currency", min: 0.2, max: 3, step: 0.02, defaultValue: 0.85 },
      ],
      (v) => {
        const net = Math.max(0, v.newPrice - v.sellOld);
        const oldFuel = fuelCostMonthly(v.kmMonth, v.kmlOld, v.priceGas);
        const newEn = (v.kwh100 / 100) * v.priceKwh * v.kmMonth;
        const save = oldFuel - newEn;
        const out: CalcOutput = {
          summary: `Troca líquida na ponta do lápis: ~${money(net)} para subir no EV; ‘tanque’ mensal cai ~${money(save)} vs o carro a gasolina.`,
          figures: [
            { label: "Saída líquida (novo − venda)", value: money(net) },
            { label: "Combustível/mês (atual)", value: money(oldFuel) },
            { label: "Energia/mês (EV)", value: money(newEn) },
            { label: "Economia mensal energia", value: money(save) },
          ],
          interpretation: [],
          insights: [
            save > 300
              ? "Economia mensal interessante — divide o custo líquido da troca por ela e vê se aguenta o riso."
              : "Economia fraca: talvez o gargalo seja consumo do carro velho ou tarifa, não a tecnologia do EV.",
          ],
        };
        const payM = save > 0 ? net / save : Infinity;
        out.interpretation = [
          Number.isFinite(payM) && payM < 400
            ? `Só na diferença de ‘tanque’, o payback grosseiro seria ~${Math.ceil(payM)} meses — finanças e seguro podem empurrar isso.`
            : "Payback longo ou inexistente na energia — revise preços ou km antes de assinar o EV.",
        ];
        return withAutoLayer(out, {
          monthlySpend: newEn,
          annualImpactText: `Economia anual na bomba vs tomada: ~${money(save * 12)} (se o cenário se mantiver).`,
          patrimonyNote:
            save > 0 ? `Em 5 anos, ~${money(save * 12 * 5)} de diferença só de combustível vs energia — ainda não paga o carro, mas ajuda a dormir.` : undefined,
        });
      },
    ),
  },
  {
    slug: "projecao-economia-combustivel",
    title: "Projeção: economizar combustível",
    shortDescription:
      "Veja quanto economiza no ano ao melhorar o consumo (km/l) ou ao rodar menos km — mesmo preço do litro.",
    category: "auto_simulacao",
    doc: {
      formula: "Economia = (custo_base − custo_novo) × 12, com custo = (km/km/l)×preço.",
      variables: "Km/mês atual, km/l atual e meta, preço litro.",
      howToUse:
        "Meta de km/l pode vir de pneu calibrado, manutenção em dia e estilo de condução. Reduzir km pode cortar renda se você é motorista de app.",
      useCases: "Meta de eficiência, educação de frota.",
      edgeCases: "Reduzir km pode significar menos renda se você é motorista de app.",
      oQueVoceVe: [
        "Economia anual projetada e diferença mensal.",
        "Comparação entre cenário atual e cenário meta.",
        "Gráfico e interpretação.",
      ],
    },
    inputs: [
      { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 6_000, step: 50, defaultValue: 1_800 },
      { key: "kmlNow", label: "Km/l hoje", type: "efficiencyKml", min: 4, max: 20, step: 0.1, defaultValue: 9.2 },
      { key: "kmlTarget", label: "Km/l meta", type: "efficiencyKml", min: 5, max: 22, step: 0.1, defaultValue: 10.8 },
      { key: "priceLiter", label: "Preço litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
    ],
    compute: wrapCompute(
      [
        { key: "kmMonth", label: "Km/mês", type: "distanceKm", min: 200, max: 6_000, step: 50, defaultValue: 1_800 },
        { key: "kmlNow", label: "Km/l hoje", type: "efficiencyKml", min: 4, max: 20, step: 0.1, defaultValue: 9.2 },
        { key: "kmlTarget", label: "Km/l meta", type: "efficiencyKml", min: 5, max: 22, step: 0.1, defaultValue: 10.8 },
        { key: "priceLiter", label: "Preço litro", type: "currency", min: 3, max: 20, step: 0.05, defaultValue: 5.79 },
      ],
      (v) => {
        const now = fuelCostMonthly(v.kmMonth, v.kmlNow, v.priceLiter);
        const tgt = fuelCostMonthly(v.kmMonth, v.kmlTarget, v.priceLiter);
        const saveM = now - tgt;
        const out: CalcOutput = {
          summary:
            saveM > 0
              ? `Melhorar consumo de ${num(v.kmlNow, 1)} para ${num(v.kmlTarget, 1)} km/l libera ~${money(saveM)}/mês (${money(saveM * 12)}/ano).`
              : "Sua ‘meta’ está pior ou igual ao hoje — ajuste o pé direito, não só o Excel.",
          figures: [
            { label: "Gasto hoje", value: money(now) },
            { label: "Gasto na meta", value: money(tgt) },
            { label: "Economia/mês", value: money(saveM) },
          ],
          interpretation: ["Pequenos km/l somam — principalmente quem roda 2k+ km/mês."],
          scenarioCompare: {
            title: "Cenário mensal",
            rows: [{ label: "Na bomba", a: money(now), b: money(tgt), winner: saveM > 0 ? "b" : "a" }],
          },
          insights: [
            saveM > 150
              ? "Desperdício real: calibragem e pneu costumam pagar o café da oficina sozinhos."
              : "Ganho modesto — talvez o maior inimigo seja km desnecessário, não o motor.",
          ],
        };
        return withAutoLayer(out, {
          annualImpactText: `Impacto anual projetado: ${money(saveM * 12)}.`,
        });
      },
    ),
  },
  {
    slug: "impacto-orcamento-carro",
    title: "Impacto no orçamento (carro)",
    shortDescription:
      "Transforme o custo mensal total do carro em percentual da renda líquida — enxergue o peso relativo do automóvel.",
    category: "auto_simulacao",
    doc: {
      formula: "% = (gasto mensal com carro ÷ renda líquida) × 100.",
      variables: "Custo mensal total do carro; renda líquida.",
      howToUse:
        "Inclua financiamento, combustível, seguro rateado, manutenção média e estacionamento. Com renda variável, use média de 3–6 meses.",
      useCases: "Reunião de orçamento, priorizar quitação ou troca.",
      edgeCases: "Renda variável: use média de 3–6 meses.",
      oQueVoceVe: [
        "Percentual da renda comprometido com o carro.",
        "Sobra teórica de renda após o gasto mensal com o carro.",
        "Interpretação e dicas conforme a faixa do percentual.",
      ],
    },
    inputs: [
      { key: "carMonth", label: "Gasto mensal com carro", type: "currency", min: 200, max: 20_000, step: 50, defaultValue: 3_200 },
      { key: "income", label: "Renda líquida mensal", type: "currency", min: 1_500, max: 80_000, step: 100, defaultValue: 9_500 },
    ],
    compute: wrapCompute(
      [
        { key: "carMonth", label: "Gasto mensal com carro", type: "currency", min: 200, max: 20_000, step: 50, defaultValue: 3_200 },
        { key: "income", label: "Renda líquida mensal", type: "currency", min: 1_500, max: 80_000, step: 100, defaultValue: 9_500 },
      ],
      (v) => {
        const pctVal = (v.carMonth / v.income) * 100;
        const out: CalcOutput = {
          summary: `O carro come ~${num(pctVal, 1)}% da sua renda líquida — ${money(v.carMonth)} de ${money(v.income)}.`,
          figures: [
            { label: "% da renda", value: `${num(pctVal, 1)}%` },
            { label: "Sobra teórica sem o carro", value: money(v.income - v.carMonth) },
          ],
          interpretation: [
            pctVal > 25
              ? "Acima de cerca de um quarto da renda, o carro passa a competir com moradia e reserva — vale revisar financiamento e uso."
              : "Faixa comum em muitas cidades; o risco é o percentual subir com prazo longo de financiamento ou seguro.",
          ],
          insights: [
            pctVal > 30
              ? "Percentual elevado: combine com extrato e metas (reserva, dívidas) antes de novos compromissos."
              : "Acompanhe o percentual ao longo dos meses; pequenos aumentos de parcela ou combustível somam rápido.",
          ],
        };
        return withAutoLayer(out, {
          monthlySpend: v.carMonth,
          annualImpactText: `Só o carro: ${money(v.carMonth * 12)} por ano — ${num(pctVal, 1)}% da renda em cada mês típico.`,
        });
      },
    ),
  },
  {
    slug: "impacto-patrimonio-gastos-carro",
    title: "Impacto no patrimônio (gastos com carro)",
    shortDescription:
      "Se o valor que você gasta com o carro fosse aportado todo mês a uma taxa, quanto de patrimônio deixaria de acumular?",
    category: "auto_simulacao",
    doc: {
      formula: "FV de aportes mensais = PMT × ((1+r)^n − 1) / r (fim de período).",
      variables: "Gasto mensal que poderia virar aporte; taxa mensal; anos.",
      howToUse:
        "Use taxa conservadora líquida (ex.: 0,35% a 0,5% a.m.) para não superestimar o resultado. Nem todo gasto com carro é evitável.",
      useCases: "Conectar custo do carro com metas de independência ou reserva.",
      edgeCases: "Nem todo gasto de carro é evitável — mas parte quase sempre é.",
      oQueVoceVe: [
        "Patrimônio que deixaria de acumular no horizonte informado.",
        "Total aportado no cenário alternativo.",
        "Interpretação sobre custo de oportunidade.",
      ],
    },
    inputs: [
      { key: "carMonth", label: "Gasto mensal com carro", type: "currency", min: 200, max: 15_000, step: 50, defaultValue: 2_800 },
      { key: "rateMonthlyPct", label: "Taxa mensal (oportunidade)", type: "percent", min: 0, max: 3, step: 0.05, defaultValue: 0.45 },
      { key: "years", label: "Anos", type: "years", min: 1, max: 25, step: 1, defaultValue: 10 },
    ],
    compute: wrapCompute(
      [
        { key: "carMonth", label: "Gasto mensal com carro", type: "currency", min: 200, max: 15_000, step: 50, defaultValue: 2_800 },
        { key: "rateMonthlyPct", label: "Taxa mensal (oportunidade)", type: "percent", min: 0, max: 3, step: 0.05, defaultValue: 0.45 },
        { key: "years", label: "Anos", type: "years", min: 1, max: 25, step: 1, defaultValue: 10 },
      ],
      (v) => {
        const n = Math.round(v.years * 12);
        const r = v.rateMonthlyPct / 100;
        const fv =
          Math.abs(r) < 1e-12
            ? v.carMonth * n
            : v.carMonth * ((1 + r) ** n - 1) / r;
        const paid = v.carMonth * n;
        const out: CalcOutput = {
          summary: `Se ${money(v.carMonth)}/mês rendesse a ${num(v.rateMonthlyPct, 2)}% a.m. em ${v.years} anos, viraria ~${money(fv)} — em vez de virar asfalto e IPVA.`,
          figures: [
            { label: "Total desembolsado", value: money(paid) },
            { label: "Patrimônio alternativo (FV)", value: money(fv) },
            { label: "Juros embutidos no cenário", value: money(fv - paid) },
          ],
          interpretation: [
            "Provocativo de propósito: carro dá mobilidade; a pergunta é se você está pagando o preço certo pela liberdade que realmente usa.",
          ],
          insights: [
            fv > paid * 1.35
              ? "Cada mês no trânsito custa não só o combustível, mas o ‘eu poderia ter comprado calma no futuro’."
              : "Taxa baixa = menos drama patrimonial — ainda assim, some tudo no ano e sinta na pele.",
          ],
        };
        return withAutoLayer(out, {
          monthlySpend: v.carMonth,
          patrimonyNote: `Oportunidade de patrimônio no horizonte: ~${money(fv)} no modelo — não é promessa de mercado, é contrafactual educativo.`,
        });
      },
    ),
  },
];
