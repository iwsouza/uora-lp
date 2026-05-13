import { RAW_THEMES } from "./themeSources";
import { slugify } from "./slugify";
import { buildArticleBody } from "./buildArticleBody";
import type { BlogPost, ThemeSpec } from "./types";

const CATEGORY_BY_CLUSTER = [
  "Controle financeiro",
  "Economizar dinheiro",
  "Dores e alertas",
  "Apps e Open Finance",
  "IA e automação",
  "Organização",
  "Patrimônio e futuro",
  "Decisões",
  "Comportamento",
  "Long tail",
] as const;

const MONTH_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

function prettyTitle(raw: string): string {
  const t = raw.trim();
  if (t.length === 0) return t;
  if (t !== t.toLowerCase()) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function dateForIndex(i: number): string {
  const day = (i % 27) + 1;
  const monthIdx = Math.min(11, Math.floor(i / 9));
  return `${String(day).padStart(2, "0")} ${MONTH_PT[monthIdx]} 2026`;
}

function readTimeForIndex(i: number): string {
  return `${8 + (i % 4)} min`;
}

const DESC_TAIL = [
  "Passo a passo, erros comuns e FAQ. Uora com chat, categoria, alerta e Open Finance no Essencial.",
  "Texto direto com exemplo. Vale testar Uora no Centralizador ou no Essencial, no seu ritmo.",
  "Ideia é sair da leitura e fazer uma ação por semana dentro do app, sem complicar.",
] as const;

function buildDescription(title: string, i: number): string {
  const head = title.length > 72 ? `${title.slice(0, 69)}…` : title;
  const tail = DESC_TAIL[i % DESC_TAIL.length];
  const s = `${head}. ${tail}`;
  return s.length > 168 ? `${s.slice(0, 165)}…` : s;
}

export const blogPosts: BlogPost[] = RAW_THEMES.map((row, i) => {
  const slug = slugify(row.title);
  const title = prettyTitle(row.title);
  const theme: ThemeSpec = { title, slug, cluster: row.cluster };
  return {
    slug,
    title,
    description: buildDescription(title, i),
    category: CATEGORY_BY_CLUSTER[row.cluster - 1]!,
    readTime: readTimeForIndex(i),
    date: dateForIndex(i),
    content: buildArticleBody(theme, i),
  };
});
