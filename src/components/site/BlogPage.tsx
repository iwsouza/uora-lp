"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import { ArrowRight, Clock } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="font-display text-xl tracking-tight">
            <span className="rounded-full bg-foreground px-3 py-1.5 font-body text-sm font-medium text-background">
              uora
            </span>
          </Link>
          <Link href="/" className="pill-button-outline px-5 py-2 text-sm">
            ← Voltar ao início
          </Link>
        </div>
      </header>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Blog Uora</p>
            <h1 className="font-display mb-5 text-display-xl text-foreground">
              Educação financeira
              <br />
              <span className="text-muted-foreground/40">que faz sentido.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Artigos práticos, sem enrolação, pra você tomar decisões melhores sobre o seu dinheiro.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="container max-w-5xl">
          <div className="grid gap-5 md:grid-cols-2">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-3xl">{post.heroEmoji}</span>
                      <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {post.category}
                      </span>
                    </div>

                    <h2 className="font-display mb-3 text-xl leading-tight text-foreground transition-colors duration-300 group-hover:text-accent">
                      {post.title}
                    </h2>

                    <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{post.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-sm text-foreground/60 transition-colors group-hover:text-accent">
                        Ler <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark rounded-t-[2rem] py-20">
        <div className="container max-w-xl text-center">
          <h2 className="font-display mb-4 text-display-lg text-dark-section-foreground">
            Leitura é poder.
            <br />
            Ação é liberdade.
          </h2>
          <p className="mb-8 text-sm text-dark-section-foreground/50">Comece a organizar suas finanças agora com o Uora.</p>
          <Link href="/" className="pill-button bg-primary-foreground px-8 py-3.5 text-sm font-medium text-foreground">
            Conhecer o Uora →
          </Link>
        </div>
      </section>
    </div>
  );
}
