// app/gallery/page.tsx  (oder src/app/gallery/page.tsx – aber nur EINER der beiden Orte!)
import GalleryCard from "@/components/GalleryCard";
import StickerSheet from "@/components/StickerSheet";
import copy from "@/content/copy.json";

export default function GalleryPage() {
  const { title, subtext } = copy.gallery;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-6xl text-[var(--bart-accent-pink)] mix-blend-screen mb-8">
        {title}
      </h1>
      <p className="text-lg text-[var(--bart-secondary-gray)] mb-12">
        {subtext}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <GalleryCard src="/images/art1.png" title="Untitled Chaos"    artist="Bartschüler XY" />
        <GalleryCard src="/images/art2.png" title="Neon Nightmare"    artist="Anonymous Meme Maker" />
        <GalleryCard src="/images/art3.png" title="Y-Head Madness"    artist="Grotesk Genius" />
        <GalleryCard src="/images/art4.png" title="Toilet Throne"     artist="Irony Master" />
      </div>

      <StickerSheet className="mt-12" />
    </div>
  );
}
