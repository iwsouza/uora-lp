"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Planos', href: '#planos' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    setScrolled(latest > 40);
    if (latest > 100) {
      setHidden(latest > previous);
    } else {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        initial={{ y: -80 }}
        animate={{ y: hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="font-display text-xl tracking-tight text-dark-section-foreground">
            <span className="bg-foreground text-background px-3 py-1.5 rounded-full text-sm font-body font-medium">
              uora
            </span>
          </Link>

          {/* Center nav (desktop) */}
          <nav className={`hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 ${scrolled ? 'bg-foreground/80 backdrop-blur-xl' : 'bg-foreground/60 backdrop-blur-md'}`}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-5 py-2 text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors rounded-full"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA (desktop) */}
          <a href="#planos" className="hidden md:flex pill-button-dark px-5 py-2.5 text-sm">
            Baixe o app
          </a>

          {/* Mobile toggle */}
          <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-display text-3xl text-primary-foreground"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a href="#planos" className="pill-button bg-primary-foreground text-foreground px-8 py-4 text-base" onClick={() => setOpen(false)}>
              Baixe o app
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
