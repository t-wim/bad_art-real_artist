// file: src/app/page.tsx  (nur relevanter Ausschnitt)
import Hero from "@/components/Hero";
import { TeaserRow } from "@/components/TeaserBanner";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import AboutShort from "@/components/AboutShort";
import BelowGalleryCta from "@/components/BelowGalleryCta";
import teasers from "@/content/teasers.json";

export default function HomePage() {
  const items = [
    { variant: "hof",    title: teasers.hof.title,    manifest: teasers.hof.manifest,    microcopy: teasers.hof.microcopy,    icon: "/icons/spotlight.svg",    backgroundTexture: "/textures/paper_grain.png" },
    { variant: "upload", title: teasers.upload.title, manifest: teasers.upload.manifest, microcopy: teasers.upload.microcopy, icon: "/icons/upload.svg",       backgroundTexture: "/textures/neon-swipes.png" },
    { variant: "voting", title: teasers.voting.title, manifest: teasers.voting.manifest, microcopy: teasers.voting.microcopy, icon: "/icons/sticker-plus.svg", backgroundTexture: "/textures/scribble.png" },
    { variant: "bonus",  title: teasers.bonus.title,  manifest: teasers.bonus.manifest,  microcopy: teasers.bonus.microcopy,  icon: "/icons/lock-glitch.svg",  backgroundTexture: "/textures/paper_grain.png" }
  ] as const;

  return (
    <main>
      <Hero />
      <AboutShort />
      <section className="px-4 sm:px-6 md:px-8">
        <GalleryGrid />
      </section>
      <BelowGalleryCta />
      <TeaserRow items={items as any} />
    </main>
  );
}
