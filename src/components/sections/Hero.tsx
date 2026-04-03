"use client";

import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={typeof heroBg === "string" ? heroBg : heroBg.src}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/15 to-foreground/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
        <motion.h1
          className="font-display text-display-xl text-primary-foreground mb-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Nunca mais perca dinheiro
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-primary-foreground/60 max-w-md mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Você não controla seu dinheiro. A Uora te mostra como mudar isso.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <a
            href="#planos"
            className="pill-button bg-primary-foreground text-foreground px-8 py-4 text-sm font-semibold"
          >
            Começar agora →
          </a>
          <a
            href="#como-funciona"
            className="pill-button border border-primary-foreground/30 text-primary-foreground/90 hover:text-primary-foreground hover:border-primary-foreground/60 hover:bg-primary-foreground/10 px-6 py-4 text-sm transition-all duration-300 backdrop-blur-sm"
          >
            Ver como funciona
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <div className="flex -space-x-2">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-primary-foreground/20 object-cover"
              />
            ))}
          </div>
          <div className="text-left">
            <p className="text-xs text-primary-foreground/70 font-medium">
              ★★★★★
            </p>
            <p className="text-[11px] text-primary-foreground/40">
              +700 pessoas organizam suas finanças
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <motion.div className="w-5 h-8 rounded-full border border-primary-foreground/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-primary-foreground/50"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
