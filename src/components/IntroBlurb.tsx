// file: src/components/IntroBlurb.tsx
import Section from "./Section";

export default function IntroBlurb() {
  return (
    <Section className="py-6 md:py-8">
      <h2 className="font-marker text-3xl sm:text-4xl md:text-5xl leading-tight text-bart-black mb-3">
        Introduction
      </h2>

      <div className="space-y-4 md:space-y-5 font-comic text-[1.0625rem] sm:text-[1.1875rem] md:text-[1.3125rem] leading-relaxed text-bart-black/90">
        <p>
          Ah, my dear degens and dilettantes of the digital canvas! Behold what we have here:
          <span className="font-marker"> $BART</span> — the ultimate masterpiece of mishaps, where
          the crookedest lines alchemize into cryptogold. It’s a Mona Lisa on acid, grinning
          sideways at the bull market.
          <strong> Bad Art, Good Vibes, fam!</strong> This isn’t just a coin — it’s a revolution in
          pixels and pumps, where your bags don’t just moon, they get catapulted straight into the
          Hall of Fame of hideousness.
        </p>

        <p>
          Imagine this: from the chaos of scribbles, culture is born. Pure degen Dadaism flipping
          the bird at polished AI-art fakery. Every holder becomes a Curator of Chaos, deciding
          which meme monstrosities ascend into the eternal gallery — because let’s be real, bad art
          from a real artist like
          <span className="font-marker"> @SleepyOfSol</span> still beats those soulless algorithmic
          “masterpieces.”
        </p>

        <p>
          The dev? Grinding daily, streaming from the trenches like a true starving artist —
          building a community that doesn’t rug, but rocks.
        </p>

        <p className="text-bart-black">
          <strong>This is $BART.</strong> Bad Art, Good Vibes. Eternal chaos on-chain.
        </p>
      </div>
    </Section>
  );
}
