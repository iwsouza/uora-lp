"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/data/blogPosts";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Shell } from "@/components/ui/Shell";
import { BlogLayout } from "@/components/site/BlogLayout";

function truncateTitle(title: string, max: number) {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1)}…`;
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  const currentIndex = blogPosts.findIndex((p) => p.slug === post.slug);
  const nextPost = blogPosts[(currentIndex + 1) % blogPosts.length];
  const prevPost =
    blogPosts[currentIndex <= 0 ? blogPosts.length - 1 : currentIndex - 1];

  const renderContent = (content: string) => {
    const lines = content.trim().split("\n");
    const elements: ReactElement[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="my-8 space-y-2.5 pl-0"
          >
            {listItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[15px] leading-[1.75] text-white/65"
              >
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                <span
                  dangerouslySetInnerHTML={{ __html: formatInline(item) }}
                />
              </li>
            ))}
          </ul>,
        );
        listItems = [];
      }
    };

    const formatInline = (text: string) => {
      return text
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-white">$1</strong>',
        )
        .replace(
          /\*(.*?)\*/g,
          '<em class="italic text-white/50">$1</em>',
        );
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }

      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2
            key={i}
            className="mb-4 mt-14 border-b border-white/10 pb-3 text-2xl font-semibold tracking-[-0.03em] text-white first:mt-0 sm:text-[1.65rem]"
          >
            {trimmed.replace("## ", "")}
          </h2>,
        );
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3
            key={i}
            className="mb-3 mt-10 text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            {trimmed.replace("### ", "")}
          </h3>,
        );
      } else if (trimmed.startsWith("> ")) {
        flushList();
        elements.push(
          <blockquote
            key={i}
            className="my-10 border-l-2 border-white/25 bg-white/[0.02] py-4 pl-5 pr-4 sm:pl-6"
          >
            <p className="text-[17px] italic leading-relaxed text-white/60">
              {trimmed.replace("> ", "").replace(/"/g, "")}
            </p>
          </blockquote>,
        );
      } else if (trimmed.match(/^[-•✅✗] /)) {
        listItems.push(trimmed.replace(/^[-•✅✗] /, ""));
      } else if (trimmed.match(/^\d+\. /)) {
        flushList();
        elements.push(
          <div key={i} className="my-5 flex items-start gap-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] font-mono text-xs font-semibold text-white/80">
              {trimmed.match(/^(\d+)/)?.[1]}
            </span>
            <p
              className="text-[15px] leading-[1.75] text-white/65"
              dangerouslySetInnerHTML={{
                __html: formatInline(trimmed.replace(/^\d+\.\s*/, "")),
              }}
            />
          </div>,
        );
      } else {
        flushList();
        elements.push(
          <p
            key={i}
            className="my-5 text-[15px] leading-[1.8] text-white/62 first:mt-0 sm:text-[16px]"
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />,
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <BlogLayout backHref="/blog" backLabel="Lista de artigos">
      <article>
        <nav
          className="mb-8 text-sm text-white/45"
          aria-label="Navegação do artigo"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-white">
                Início
              </Link>
            </li>
            <li className="text-white/25">/</li>
            <li>
              <Link href="/blog" className="transition hover:text-white">
                Blog
              </Link>
            </li>
            <li className="text-white/25">/</li>
            <li className="max-w-[min(100%,14rem)] truncate text-white/55 sm:max-w-md">
              {truncateTitle(post.title, 52)}
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 xl:gap-16">
          <div className="min-w-0">
            <header className="border-b border-white/10 pb-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-white/45">
                <span className="rounded border border-white/10 px-2 py-0.5 uppercase tracking-wider text-white/50">
                  {post.category}
                </span>
                <span className="text-white/35">·</span>
                <time dateTime={post.date}>{post.date}</time>
                <span className="text-white/35">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden />
                  {post.readTime}
                </span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mt-6 max-w-[40rem] text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.35rem]"
              >
                {post.title}
              </motion.h1>
              <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-white/55 sm:text-xl">
                {post.description}
              </p>
            </header>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="article-body max-w-[40rem] pt-10"
            >
              {renderContent(post.content)}
            </motion.div>

            <nav
              className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-10 sm:flex-row sm:justify-between"
              aria-label="Artigo anterior e próximo"
            >
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex max-w-md items-start gap-3 rounded-lg border border-transparent py-2 transition hover:border-white/10 hover:bg-white/[0.03] sm:pr-4"
              >
                <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 text-white/35 transition group-hover:text-white/60" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                    Anterior
                  </p>
                  <p className="mt-1 text-sm font-medium leading-snug text-white/80 transition group-hover:text-white">
                    {prevPost.title}
                  </p>
                </div>
              </Link>
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex max-w-md items-start justify-end gap-3 rounded-lg border border-transparent py-2 transition hover:border-white/10 hover:bg-white/[0.03] sm:ml-auto sm:pl-4"
              >
                <div className="min-w-0 text-right">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                    Próximo
                  </p>
                  <p className="mt-1 text-sm font-medium leading-snug text-white/80 transition group-hover:text-white">
                    {nextPost.title}
                  </p>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-white/35 transition group-hover:text-white/60" />
              </Link>
            </nav>
          </div>

          <aside className="mt-12 hidden lg:mt-0 lg:block">
            <div className="sticky top-28 space-y-6">
              <Shell className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Sobre
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Artigos da equipe Uora. A gente escreve pra você sair da teoria e
                  usar o app com intenção.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-flex text-sm font-medium text-white/70 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Site da Uora
                </Link>
              </Shell>
              <Shell className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Blog
                </p>
                <Link
                  href="/blog"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-white/70 transition hover:text-white"
                >
                  Ver todos os artigos
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Shell>
            </div>
          </aside>
        </div>

        <section className="mx-auto mt-16 max-w-[40rem] lg:max-w-none">
          <Shell className="p-7 text-center sm:p-9">
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Bora colocar em prática?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
              Lança gasto no chat, conecta banco no Essencial, vê categoria e alerta.
              É por aí.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Abrir site Uora
            </Link>
          </Shell>
        </section>
      </article>
    </BlogLayout>
  );
}
