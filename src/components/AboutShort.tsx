// file: src/components/AboutShort.tsx
"use client";

import Section from "./Section";
import { useViewTracker } from "@/hooks/useViewTracker";

type AboutShortProps = {
  className?: string;
};

export default function AboutShort({ className = "" }: AboutShortProps) {
  const ref = useViewTracker("view_about");
  const sectionClassName = ["py-12 md:py-16", className]
    .filter((token): token is string => Boolean(token))
    .join(" ");

  return (
    <Section ref={ref} id="about" className={sectionClassName}>
      <h2 className="font-marker text-bart-black mb-4 text-3xl leading-tight sm:text-4xl md:text-5xl">
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

      <p className="font-comic text-bart-black text-[1.125rem] leading-relaxed sm:text-[1.25rem]">
        We celebrate the gloriously terrible, the unpolished, the real.
      </p>
      <p className="font-comic text-bart-black/90 mt-3">
        $BART is the unholy shrine of shitpost art, where stick figures and smudged
        doodles reign supreme.
      </p>
      <p className="font-comic text-bart-black/90 mt-3">
        No pretentious galleries here—just raw, unfiltered creativity.
      </p>
      <p className="font-comic text-bart-black mt-3">
        Upload your worst, vote for chaos, and join the cult of imperfection. Coming soon
        to ruin the internet.
      </p>
    </Section>
  );
}
