"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import natureBg from "@/assets/nature-bg.jpg";

const AppShowcaseWorld = dynamic(() => import("./AppShowcaseWorld"), {
  ssr: false,
});

export function AppShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scrollRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  const chatOpacity = useTransform(scrollYProgress, [0.6, 0.7], [1, 0]);
  const dashOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const chatProgress = useTransform(scrollYProgress, [0.3, 0.65], [0, 1]);
  const dashProgress = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);

  const natureBgSrc = typeof natureBg === "string" ? natureBg : natureBg.src;

  return (
    <section ref={sectionRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={natureBgSrc}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/30" />
        </div>

        <AppShowcaseWorld
          scrollRef={scrollRef}
          chatOpacity={chatOpacity}
          dashOpacity={dashOpacity}
          chatProgress={chatProgress}
          dashProgress={dashProgress}
        />
      </div>
    </section>
  );
}
