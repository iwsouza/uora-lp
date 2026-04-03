"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InfiniteCarouselProps {
  children: ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  pauseOnHover?: boolean;
}

export function InfiniteCarousel({
  children,
  speed = 30,
  direction = 'left',
  className = '',
  pauseOnHover = true,
}: InfiniteCarouselProps) {
  // Duplicate items for seamless loop
  const items = [...children, ...children];

  return (
    <div
      className={`overflow-hidden relative ${className}`}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-inherit" style={{ background: 'linear-gradient(to right, var(--fade-from, transparent), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--fade-from, transparent), transparent)' }} />

      <motion.div
        className={`flex gap-5 w-max ${pauseOnHover ? '[&:hover]:animation-play-state-paused' : ''}`}
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={pauseOnHover ? {} : undefined}
      >
        {items.map((child, i) => (
          <div key={i} className="shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
