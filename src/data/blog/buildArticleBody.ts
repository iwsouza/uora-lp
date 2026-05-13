import type { ThemeSpec } from "./types";

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 33 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: readonly T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length]!;
}

const PAIN_OPEN: readonly string[] = [
  "Sabe quando você abre o banco no fim do mês e dá aquele aperto? Não é frescura, é falta de clareza. Trabalhar e mesmo assim não saber pra onde foi o dinheiro é mais comum do que parece.",
  "Dinheiro some quieto: assinatura que você esqueceu, pedido pequeno, taxinha. Sozinho não parece nada. Junto vira um buraco que ninguém explica direito.",
  "Não é sempre “falta de força de vontade”. Muitas vezes é falta de visão. Se você decide no escuro, o resultado costuma ser ruim mesmo.",
  "Você não precisa virar guru de finanças pra sair do caos. Precisa de um jeito simples de repetir toda semana, não um PDF de 200 páginas.",
  "O problema muitas vezes não é só gastar. É gastar sem notar o padrão. Quando você enxerga o padrão, fica mais fácil de ajustar sem sofrimento de novela.",
];

const UORA_BRIDGE: readonly string[] = [
  "A Uora nasceu pra tirar isso do papel: ou você conecta o banco (no Essencial, com Open Finance, até 5 contas), ou vai lançando no chat com texto ou voz. Daí ela vai organizando categoria, recorrência, alerta, o básico pra você não depender de cabeça.",
  "Na prática é isso: jeito fácil de botar dado pra dentro, organização por trás, e uma tela que você entende sem precisar ser contador. Gráfico, hábito, assinatura, alerta quando passa do limite.",
  "Planilha morre porque dá trabalho. Aqui o negócio é outro: ou entra automático do banco, ou você joga no chat em uns segundos. A IA ajuda a separar o que importa do ruído.",
];

const STEPS_LABEL: readonly string[] = [
  "Define o mínimo que você quer enxergar",
  "Marca um horário fixo na semana (uns 15 min)",
  "Separa o que é fixo, o que muda e o que aparece do nada",
  "Categoria com nome de gente, não de curso",
  "Alerta só onde você sempre estoura",
  "No fim do mês pergunta: o que eu repetia e o que eu cortava",
];

function clusterHint(cluster: number): string {
  const map: Record<number, string> = {
    1: "controle pessoal, organização, planejamento do dia a dia",
    2: "economizar, guardar, cortar desperdício sem pirar",
    3: "gasto demais, dívida, vermelho, ansiedade com conta",
    4: "app, celular, automação, orçamento",
    5: "IA, automação, leitura de gasto sem planilha",
    6: "organizar mês, categoria, visão geral",
    7: "patrimônio, reserva, pensar no longo prazo",
    8: "financiar, parcelar, decisão grande",
    9: "impulso, hábito, cabeça na hora de gastar",
    10: "buscas mais específicas, tipo delivery, cartão, celular",
  };
  return map[cluster] ?? "finanças pessoais, Uora";
}

function exampleBlock(seed: number, title: string): string {
  const a = 3200 + (seed % 7) * 150;
  const b = 980 + (seed % 5) * 40;
  const pct = 12 + (seed % 4);
  return `Pensa comigo: no fim do mês você vê que uns ${a.toLocaleString("pt-BR")} reais foram em coisa “pequena”, lanche, app, corrida. Parece absurdo até somar. É o tipo de coisa que aparece quando você olha linha a linha. A Uora ajuda nisso, com número na mesa, sem ficar te julgando.

Outro caso que aparece direto: a pessoa acha que gasta uns R$ ${b.toLocaleString("pt-BR")} em mercado, mas mistura mercado com conveniência e delivery na mesma conta mental. Só separar isso já muda o mês seguinte. Às vezes dá ${pct}% de diferença do que você imaginava.

O tema aqui é “${title}”. O que eu quero é que você pegue um mês real e compare com o que você acha que acontece. Histórico, busca, categoria, alerta, isso vira rotina se você deixar.`;

}

function errorsBlock(seed: number): string {
  const items = [
    "Achar que controle é ficar fazendo conta o dia todo. Não é. É decidir com dado, não sofrer com planilha infinita.",
    "Ficar esperando motivação. Motivação some. O que fica é hábito feio ou hábito bom. Escolhe o que é mais fácil de repetir.",
    "Achar que precisa cortar tudo de uma vez. Corta muito, estoura depois. Melhor apertar um pouco e manter.",
    "Deixar assinatura e gasto miúdo de lado. É aí que some grana sem drama. Na Uora isso aparece junto, recorrência e hábito.",
  ];
  const rotated = [
    items[(seed + 0) % 4],
    items[(seed + 1) % 4],
    items[(seed + 2) % 4],
    items[(seed + 3) % 4],
  ];
  return rotated.map((line) => `- ${line}`).join("\n");
}

function insightsBlock(cluster: number, seed: number): string {
  const pool = [
    "Quanto mais fácil entrar o dado, mais honesta fica a foto do mês. Open Finance com alerta no Essencial acelera isso.",
    "Categoria boa é a que muda o que você faz, não a que fica bonita num gráfico que ninguém olha.",
    "Só olhar saldo é reagir tarde. Olhar ritmo, tipo semana a semana, dá tempo de corrigir.",
    "Inteligência financeira, na prática, é repetir o que deu certo e parar de insistir no que não bate com prioridade.",
    "A Uora não inventa regra de casa. Ela mostra onde a regra tá furada, com prova no extrato.",
  ];
  return [0, 1, 2].map((j) => `- ${pick(pool, seed, j + cluster)}`).join("\n");
}

function faqBlock(title: string, cluster: number): string {
  const q1 =
    cluster >= 4 && cluster <= 5
      ? "Preciso conectar banco pra usar?"
      : "Por que eu sempre paro de usar app de finanças?";
  const a1 =
    cluster >= 4 && cluster <= 5
      ? "Não obrigatório. No Centralizador você vai na mão ou no chat e a IA tem limite. No Essencial você conecta até 5 bancos com Open Finance e aí entra automático, com análise mais completa."
      : "Porque quase todo mundo monta um negócio que depende de lembrar de lançar. Cansa. Na Uora o caminho é diminuir isso, com chat, voz, ou banco puxando sozinho no Essencial.";

  const q2 =
    cluster === 3
      ? "Como saber se tô gastando demais mesmo sem estar “ atolada de dívida”?"
      : "Isso substitui planejador financeiro?";
  const a2 =
    cluster === 3
      ? "Quando o variável sobe todo mês, quando assinatura vira peso, quando você fica nervoso antes da fatura, é sinal. Comparar mês com mês no app ajuda a ver padrão fora da curva."
      : "Não substitui profissional quando o caso é tributário ou investimento pesado. Pra execução do dia a dia, categoria, alerta, histórico, ajuda demais.";

  const q3 =
    cluster === 8
      ? "Parcelar ou à vista, como pensar sem pirar?"
      : "Quanto tempo até “sentir” que funcionou?";
  const a3 =
    cluster === 8
      ? "Soma o custo total do parcelado, vê se tem desconto à vista, e pergunta se isso aperta seu mês. O app ajuda a ver o que já tá saindo de verdade, não o que você acha que sai."
      : "Na primeira semana já melhora a consciência. Em um mês ou dois dá pra ver mudança de padrão se você olhar o painel uma vez por semana e mexer em uma coisa de cada vez.";

  const shortTitle =
    title.length > 40 ? `${title.slice(0, 37)}...` : title;
  const q4 = `Isso tem a ver com ${shortTitle}?`;
  const a4 =
    "Tem. A ideia é você sair da leitura e fazer uma ação pequena. Categoria, recorrência, alerta, e se tiver Essencial, Open Finance pra fechar o ciclo.";

  return `### ${q1}
${a1}

### ${q2}
${a2}

### ${q3}
${a3}

### ${q4}
${a4}`;
}

function ctaClosing(seed: number): string {
  const lines = pick(
    [
      "Se você quer parar de chutar e começar a ver o que acontece de verdade, vale testar a Uora no seu ritmo. Ou manual, ou com banco ligado no Essencial.",
      "Próximo passo é simples: entra, escolhe se vai começar pelo chat ou pela conta, e deixa o app mostrar o que você não tava vendo.",
      "Ninguém vira outra pessoa do dia pra noite. Mas dá pra trocar caos por visão. Chat, categoria, alerta, Open Finance no Essencial, é por aí.",
    ],
    seed,
    11,
  );
  return `${lines}

> Controle pra mim não é sofrer com planilha. É enxergar cedo o suficiente pra mudar sem drama.`;
}

export function buildArticleBody(t: ThemeSpec, index: number): string {
  const seed = hashSlug(`${t.slug}:${index}`);
  const hint = clusterHint(t.cluster);

  const intro = `${pick(PAIN_OPEN, seed, 0)}

Esse texto fala de ${t.title}. Vou tentar ser direto, com exemplo e um passo a passo que dá pra fazer. A Uora entra nessa história porque ela resolve a parte chata: lançar gasto no chat ou por voz, ver categoria e hábito, assinatura, alerta, buscar no histórico. No plano Essencial ainda dá pra ligar banco com Open Finance, até 5 contas, com IA mais solta e análise melhor. Tudo isso é o que já existe hoje, não promessa de conto de fadas.

Só pra alinhar o tema: ${hint}.`;

  const bridge = pick(UORA_BRIDGE, seed, 3);

  const bodyCore = `## Onde a maioria trava

${bridge}

### Seis passos que eu mesmo usaria

1. ${STEPS_LABEL[0]}. Fixo, variável e surpresa. Na Uora isso aparece quando você começa a alimentar dado e olhar categoria com calma.
2. ${STEPS_LABEL[1]}. Domingo à noite ou segunda cedo, uns 15 minutos. Sem herói de filme.
3. ${STEPS_LABEL[2]}. Se tudo vira “variável”, você não controla, você só apaga incêndio.
4. ${STEPS_LABEL[3]}. Mercado é uma coisa, “mercado mais conveniência mais delivery” é outra. Nome honesto ajuda.
5. ${STEPS_LABEL[4]}. Alerta não é pra te punir, é pra te avisar antes do estrago.
6. ${STEPS_LABEL[5]}. Aprendizado vem de repetir pequeno ajuste, não de revolução de uma noite só.

## Exemplo com número

${exampleBlock(seed, t.title)}

## Erro que eu vejo direto

${errorsBlock(seed)}

## Três coisas que mudam jogo

${insightsBlock(t.cluster, seed)}

## Uma semana sem frescura

1. Dia 1: monta categoria mínima e faz um lançamento teste no chat, texto ou voz.
2. Dia 2: lista assinatura e recorrência. Cancela uma que você não usa.
3. Dia 3: se for Essencial, confere se o banco importou certo e arruma umas categorias esquisitas.
4. Dia 4: um alerta só, no lugar que você sempre estoura.
5. Dia 5: olha histórico e pergunta “se o mês repetir igual, onde quebra”.
6. Dia 6: escolhe uma alavanca só, delivery, transporte ou mercado, e mexe nela.
7. Dia 7: revisa o painel e anota uma decisão pro próximo ciclo.

## Perguntas que aparecem

${faqBlock(t.title, t.cluster)}

## Pra fechar

${ctaClosing(seed)}`;

  const angle = `## ${t.title}, na prática

O erro clássico é querer mudar dez coisa ao mesmo tempo. Não precisa. Com a Uora você mexe com evidência: categoria, recorrência, alerta, histórico. Uma alavanca por vez já muda o mês.`;

  return `${intro}

${angle}

${bodyCore}`;
}
