"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { blogPosts } from "@/data/blogPosts";
import { CALCULATORS } from "@/data/calculators";
import { ArrowRight, ArrowUpRight, ChevronDown, Clock } from "lucide-react";
import { Shell } from "@/components/ui/Shell";
import { BlogLayout } from "@/components/site/BlogLayout";

const ACCENT = {
  text: "text-amber-400",
  textHover: "group-hover:text-amber-300",
  border: "border-amber-400/25",
  bg: "bg-amber-400",
} as const;

const LIST_PAGE_SIZE = 28;

function Breadcrumb() {
  return (
    <nav className="mb-6 text-sm text-white/45" aria-label="Navegação">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="transition hover:text-white">
            Início
          </Link>
        </li>
        <li className="text-white/25">/</li>
        <li className="text-white/70">Blog</li>
      </ol>
    </nav>
  );
}

export default function BlogPage() {
  const [listVisible, setListVisible] = useState(LIST_PAGE_SIZE);

  const { featured, gridPosts, listPosts } = useMemo(() => {
    const [f, ...r] = blogPosts;
    return {
      featured: f,
      gridPosts: r.slice(0, 6),
      listPosts: r.slice(6),
    };
  }, []);

  const total = blogPosts.length;
  const shownList = listPosts.slice(0, listVisible);
  const canLoadMore = listVisible < listPosts.length;

  return (
    <BlogLayout backHref="/" backLabel="Site Uora">
      <main>
        <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white/50 sm:text-sm">
          <span className="min-w-0 truncate">
            Conteúdo novo de finanças pessoais. Dá uma olhada nos artigos.
          </span>
          <a
            href="#artigos"
            className={`inline-flex shrink-0 items-center gap-1 font-medium ${ACCENT.text} transition hover:text-amber-300`}
          >
            Ver artigos
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>

        <Breadcrumb />

        <section
          className="relative overflow-hidden rounded-2xl border border-white/10 sm:rounded-3xl"
          aria-labelledby="blog-hero-title"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(251,191,36,0.14),transparent)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" aria-hidden />
          <div className="relative px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-400/80">
              Blog · Uora
            </p>
            <h1
              id="blog-hero-title"
              className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
            >
              Educação financeira que você consegue ler e usar no mesmo dia.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
              Sem textão acadêmico. Só ideia clara, exemplo e próximo passo.{" "}
              <span className="text-white/70">{total} textos</span> no ar, do
              básico ao tema bem específico de busca.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#artigos"
                className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-black transition ${ACCENT.bg} hover:bg-amber-300`}
              >
                Explorar artigos
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/85 transition hover:border-white/25 hover:bg-white/[0.04]"
              >
                Conhecer a Uora
              </Link>
            </div>
          </div>
        </section>

        {featured && (
          <section className="py-10 sm:py-14" aria-labelledby="destaque-heading">
            <h2 id="destaque-heading" className="sr-only">
              Destaque
            </h2>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                Destaque
              </h3>
              <span className="font-mono text-xs text-white/35">01</span>
            </div>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:border-amber-400/25 sm:rounded-3xl">
                <div className="relative aspect-[21/9] min-h-[140px] w-full overflow-hidden bg-gradient-to-br from-amber-500/15 via-white/[0.06] to-transparent sm:min-h-[180px]">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LC4wMykiLz48L2c+PC9zdmc+')] opacity-90" />
                </div>
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/45">
                    <span className="rounded border border-white/10 bg-black/30 px-2 py-0.5 font-mono uppercase tracking-wider text-white/50">
                      {featured.category}
                    </span>
                    <span>{featured.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden />
                      {featured.readTime}
                    </span>
                  </div>
                  <h4 className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.03em] text-white transition group-hover:text-amber-100 sm:text-3xl lg:max-w-4xl lg:text-[2rem]">
                    {featured.title}
                  </h4>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50 sm:text-base">
                    {featured.description}
                  </p>
                  <span
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${ACCENT.text} transition ${ACCENT.textHover}`}
                  >
                    Ler artigo completo
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </Link>
          </section>
        )}

        <section
          id="artigos"
          className="border-t border-white/10 pt-10 sm:pt-12"
          aria-labelledby="mais-artigos"
        >
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="mais-artigos"
                className="text-lg font-semibold tracking-tight text-white sm:text-xl"
              >
                Mais artigos
              </h2>
              <p className="mt-1 text-sm text-white/45">
                Seleção em cards. A lista completa vem logo abaixo.
              </p>
            </div>
            <Link
              href="#lista-completa"
              className={`inline-flex items-center gap-1 text-sm font-medium ${ACCENT.text} transition hover:text-amber-300`}
            >
              Ir pra lista completa
              <ChevronDown className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:bg-white/[0.04] hover:ring-2 hover:ring-amber-400/25"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-gradient-to-br from-white/[0.07] to-transparent" />
                  <span className="mt-4 inline-block w-fit rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/45">
                    {post.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold leading-snug tracking-[-0.02em] text-white transition group-hover:text-amber-100/90">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-white/45">
                    {post.description}
                  </p>
                  <span
                    className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${ACCENT.text} ${ACCENT.textHover}`}
                  >
                    Ler mais
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="calculadoras"
          className="border-t border-white/10 py-14 sm:py-16"
          aria-labelledby="calc-heading"
        >
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400/80">
                Ferramentas
              </p>
              <h2
                id="calc-heading"
                className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl"
              >
                Calculadoras
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
                Tudo que tá liberado no site pra você simular na hora. Quando
                surgir outra, entra aqui também.
              </p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CALCULATORS.map((calc) => (
              <li key={calc.id}>
                <Link
                  href={calc.href}
                  className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 transition hover:border-amber-400/30 sm:p-7`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${ACCENT.bg} text-black`}
                  >
                    <calc.Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                    {calc.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                    {calc.description}
                  </p>
                  <span
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${ACCENT.text} transition group-hover:text-amber-300`}
                  >
                    Abrir calculadora
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="lista-completa"
          className="pb-6 pt-4"
          aria-labelledby="lista-heading"
        >
          <div className="mb-6 flex flex-col gap-1 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="lista-heading"
              className="text-lg font-semibold tracking-tight text-white"
            >
              Lista completa
            </h2>
            <p className="font-mono text-xs text-white/40">
              {listPosts.length} artigos nesta lista
            </p>
          </div>

          <ul className="divide-y divide-white/10">
            {shownList.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-3 py-7 transition sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
                >
                  <time
                    className="shrink-0 font-mono text-xs tabular-nums text-white/40 sm:w-28 sm:text-[13px]"
                    dateTime={post.date}
                  >
                    {post.date}
                  </time>
                  <div className="min-w-0 flex-1">
                    <span className="mb-1.5 inline-block rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/45">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-white transition group-hover:text-amber-100/90 sm:text-xl">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/45">
                      {post.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/40 transition group-hover:text-amber-400">
                      Ler
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <span className="hidden shrink-0 font-mono text-xs text-white/35 sm:block">
                    {post.readTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {canLoadMore && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setListVisible((c) =>
                    Math.min(c + LIST_PAGE_SIZE, listPosts.length),
                  )
                }
                className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/80 transition hover:border-amber-400/40 hover:text-amber-200"
              >
                Carregar mais artigos (
                {Math.min(LIST_PAGE_SIZE, listPosts.length - listVisible)}{" "}
                seguintes)
              </button>
            </div>
          )}
        </section>

        <section className="pt-12 sm:pt-16">
          <Shell className="overflow-hidden p-8 text-center sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400/70">
              Uora
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              Quer organizar de verdade?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
              Volta pro site, vê plano e como a gente te ajuda no dia a dia.
            </p>
            <Link
              href="/"
              className={`mt-8 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold text-black transition ${ACCENT.bg} hover:bg-amber-300`}
            >
              Ir pro site da Uora
            </Link>
          </Shell>
        </section>
      </main>
    </BlogLayout>
  );
}
