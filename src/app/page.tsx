// file: src/app/page.tsx  (nur relevanter Ausschnitt)
import Hero from "@/components/Hero";
import { TeaserRow, type TeaserItem } from "@/components/TeaserBanner";
import IntroBlurb from "@/components/IntroBlurb";   
import GalleryGrid from "@/components/gallery/GalleryGrid";
import AboutShort from "@/components/AboutShort";
import BelowGalleryCta from "@/components/BelowGalleryCta";
import teasers from "@/content/teasers.json";

export default function HomePage() {
  const items: TeaserItem[] = [
    {
      variant: "hof",
      title: teasers.hof.title,
      manifest: teasers.hof.manifest,
      microcopy: teasers.hof.microcopy,
      backgroundTexture: "/textures/paper_grain.png",
    },
    {
      variant: "upload",
      title: teasers.upload.title,
      manifest: teasers.upload.manifest,
      microcopy: teasers.upload.microcopy,
      backgroundTexture: "/textures/neon-swipes.png",
    },
    {
      variant: "voting",
      title: teasers.voting.title,
      manifest: teasers.voting.manifest,
      microcopy: teasers.voting.microcopy,
      backgroundTexture: "/textures/scribble.png",
    },
    {
      variant: "bonus",
      title: teasers.bonus.title,
      manifest: teasers.bonus.manifest,
      microcopy: teasers.bonus.microcopy,
      backgroundTexture: "/textures/paper_grain.png",
    },
  ];

  return (
    <main>
      <Hero />
      <AboutShort />
      <IntroBlurb />
      <section className="px-4 sm:px-6 md:px-8">
        <GalleryGrid />
      </section>
      <BelowGalleryCta />
      <TeaserRow items={items} />
    </main>
  );
}
