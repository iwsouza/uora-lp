import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { BanksMarquee } from "@/components/sections/BanksMarquee";
import { Features } from "@/components/sections/Features";
import { SplitEntry } from "@/components/sections/SplitEntry";
import { SplitInsight } from "@/components/sections/SplitInsight";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { FinalCTA } from "@/components/sections/FinalCTA";

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[140px]" />
        <div className="absolute right-0 top-[28%] h-[340px] w-[340px] rounded-full bg-white/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <Header />
        <main>
          <Hero />
          <BanksMarquee />
          <Features />
          <SplitEntry />
          <SplitInsight />
          <HowItWorks />
          <Pricing />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
