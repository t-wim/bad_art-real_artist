"use client";
import Section from "./Section";
import { useViewTracker } from "@/hooks/useViewTracker";

export default function AboutShort() {
  const ref = useViewTracker("view_about");
  return (
    <Section ref={ref} id="about" className="py-10 sm:py-12 md:py-14">
      <h2 className="font-comic text-bart-black text-2xl mb-3">About</h2>
      <p className="font-comic text-bart-black">
        We celebrate the gloriously terrible, the unpolished, the real.
      </p>
      <p className="mt-2 text-bart-black">
        $BART is the unholy shrine of shitpost art, where stick figures and smudged doodles reign supreme.
        </p>
       <p className="mt-2 text-bart-black">
        No pretentious galleries here—just raw, unfiltered creativity. 
        </p>
        <p className="mt-2 text-bart-black">
          Upload your worst, vote for chaos, and join the cult of imperfection. Coming soon to ruin the internet.
      </p>
    </Section>
  );
}
