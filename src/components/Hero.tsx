// ==============================
// file: src/components/Hero.tsx (unchanged from previous delivery)
// ==============================
"use client";
import { track } from "@/lib/analytics";
import Section from "./Section";


export default function Hero() {
  const onHover = () => track("tooltip_seen_soon", { source: "hero_cta" });
  return (
    <div className="relative z-[1]">
      <Section className="py-10 sm:py-14 md:py-16">
        <p className="font-comic text-bart-black text-base sm:text-lg mb-2">
          Bad Art, Real Artist — where chaos creates truth.
        </p>
        <h1 className="font-marker text-bart-pink drop-shadow-[0_0_8px_rgba(255,44,163,0.35)] leading-tight text-[clamp(2rem,6vw,3.75rem)]">
          BART — Bad Art, Real Artist.
        </h1>
        <p className="font-comic text-bart-black text-[clamp(1rem,2.6vw,1.125rem)] mt-3">
          Truth lies in imperfection – Bad Art wins.
        </p>
        <div className="mt-6">
        </div>
      </Section>
    </div>
  );
}
