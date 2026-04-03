"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/data/blogPosts";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

export function BlogPostContent({ post }: { post: BlogPost }) {
  const currentIndex = blogPosts.findIndex((p) => p.slug === post.slug);
  const nextPost = blogPosts[(currentIndex + 1) % blogPosts.length];

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: ReactElement[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-2 my-6 pl-1">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground/80 leading-relaxed">
                <span className="text-accent mt-1.5 text-xs">●</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const formatInline = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={i} className="font-display text-display-md text-foreground mt-12 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={i} className="text-lg font-semibold text-foreground mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={i} className="border-l-2 border-accent pl-6 my-8 py-4">
            <p className="font-display text-lg text-foreground/80 italic leading-relaxed">
              {trimmed.replace('> ', '').replace(/"/g, '')}
            </p>
          </blockquote>
        );
      } else if (trimmed.match(/^[-•✅✗] /)) {
        listItems.push(trimmed.replace(/^[-•✅✗] /, ''));
      } else if (trimmed.match(/^\d+\. /)) {
        flushList();
        elements.push(
          <div key={i} className="flex items-start gap-4 my-4">
            <span className="w-7 h-7 rounded-full bg-foreground text-background text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
              {trimmed.match(/^(\d+)/)?.[1]}
            </span>
            <p className="text-foreground/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/^\d+\.\s*/, '')) }} />
          </div>
        );
      } else {
        flushList();
        elements.push(
          <p key={i} className="text-foreground/70 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="font-display text-xl tracking-tight">
            <span className="bg-foreground text-background px-3 py-1.5 rounded-full text-sm font-body font-medium">
              uora
            </span>
          </Link>
          <Link href="/blog" className="pill-button-outline px-5 py-2 text-sm flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Blog
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="py-16 md:py-24">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>

            <h1 className="font-display text-display-lg text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-12 pb-8 border-b border-border">
              {post.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="prose-uora"
          >
            {renderContent(post.content)}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 rounded-3xl bg-card border border-border p-8 md:p-12 text-center"
          >
            <h3 className="font-display text-xl text-foreground mb-3">
              Pronto pra colocar em prática?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Conecte seus bancos ao Uora e veja seus gastos organizados em segundos.
            </p>
            <Link href="/#planos" className="pill-button-dark px-8 py-3.5 text-sm font-medium">
              Ver planos →
            </Link>
          </motion.div>

          {/* Next post */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Próximo artigo</p>
            <Link href={`/blog/${nextPost.slug}`} className="group flex items-center justify-between">
              <div>
                <h4 className="font-display text-lg text-foreground group-hover:text-accent transition-colors">
                  {nextPost.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{nextPost.readTime}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
