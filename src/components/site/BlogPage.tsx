"use client";

import Link from "next/link";
import { motion } from 'framer-motion';
import { blogPosts } from '@/data/blogPosts';
import { ArrowRight, Clock } from 'lucide-react';

const BlogPage = () => {
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
          <Link href="/" className="pill-button-outline px-5 py-2 text-sm">
            ← Voltar ao início
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">Blog Uora</p>
            <h1 className="font-display text-display-xl text-foreground mb-5">
              Educação financeira<br />
              <span className="text-muted-foreground/40">que faz sentido.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
              Artigos práticos, sem enrolação, pra você tomar decisões melhores sobre o seu dinheiro.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-24 md:pb-36">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-5">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full"
                >
                  <div className="rounded-3xl border border-border bg-card p-8 h-full flex flex-col transition-all duration-500 hover:border-foreground/15 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-3xl">{post.heroEmoji}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    <h2 className="font-display text-xl text-foreground mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <span className="text-sm text-foreground/60 group-hover:text-accent transition-colors flex items-center gap-1">
                        Ler <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-20 rounded-t-[2rem]">
        <div className="container text-center max-w-xl">
          <h2 className="font-display text-display-lg text-dark-section-foreground mb-4">
            Leitura é poder.<br />Ação é liberdade.
          </h2>
          <p className="text-dark-section-foreground/50 text-sm mb-8">
            Comece a organizar suas finanças agora com o Uora.
          </p>
          <Link href="/" className="pill-button bg-primary-foreground text-foreground px-8 py-3.5 text-sm font-medium">
            Conhecer o Uora →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
