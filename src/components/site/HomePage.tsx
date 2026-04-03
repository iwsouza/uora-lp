"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { BankPartners } from "@/components/sections/BankPartners";
import { ValueProp } from "@/components/sections/ValueProp";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { LifeOrganized } from "@/components/sections/LifeOrganized";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { SocialProof } from "@/components/sections/SocialProof";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/layout/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AppShowcase />
      <BankPartners />
      <ValueProp />
      <TrustBadges />
      <LifeOrganized />
      <FeaturesGrid />
      <SocialProof />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
