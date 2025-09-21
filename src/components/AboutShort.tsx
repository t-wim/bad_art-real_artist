// file: src/components/AboutShort.tsx
"use client";

import Section from "./Section";
import { useViewTracker } from "@/hooks/useViewTracker";

export default function AboutShort() {
  const ref = useViewTracker("view_about");

  return (
    <Section ref={ref as any} id="about" className="py-12 md:py-16">
      <h2 className="font-marker text-3xl sm:text-4xl md:text-5xl leading-tight text-bart-black mb-4">
        About $BART
      </h2>

      {/* Video mit Poster + Abstand zum Text */}
      <div className="mb-8">
        <video
          src="/Introduce.mp4"
          poster="/intro-poster.jpg"
          controls
          preload="metadata"
          className="w-full rounded-xl shadow-sm"
        >
          Sorry, your browser can’t play this video.
        </video>
      </div>

      <p className="font-comic text-bart-black text-[1.125rem] sm:text-[1.25rem] leading-relaxed">
        We celebrate the gloriously terrible, the unpolished, the real.
      </p>
      <p className="mt-3 font-comic text-bart-black/90">
        $BART is the unholy shrine of shitpost art, where stick figures and smudged doodles reign supreme.
      </p>
      <p className="mt-3 font-comic text-bart-black/90">
        No pretentious galleries here—just raw, unfiltered creativity.
      </p>
      <p className="mt-3 font-comic text-bart-black">
        Upload your worst, vote for chaos, and join the cult of imperfection. Coming soon to ruin the internet.
      </p>
    </Section>
  );
}
