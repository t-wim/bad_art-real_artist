"use client";

import ArtCard from "@/components/ArtCard";

type Artwork = {
  id: string;
  title: string;
  mime: "image/png" | "image/jpeg" | "image/webp";
  imageBase64: string;
  author?: string;
  createdAt?: string;
};

/**
 * Legacy gallery card wrapper. We keep a lightweight implementation so future
 * migrations can reintroduce bespoke styling without breaking the build.
 */
export default function ArtworkCard({ item }: { item: Artwork }) {
  const src = `data:${item.mime};base64,${item.imageBase64}`;
  const details = [item.author, item.createdAt ? new Date(item.createdAt).getFullYear() : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <figure className="space-y-3">
      <ArtCard src={src} alt={item.title} color="pink" />
      <figcaption className="font-comic text-sm text-bart-black">
        <strong className="font-semibold">{item.title}</strong>
        {details ? <span className="ml-1 opacity-75">{details}</span> : null}
      </figcaption>
    </figure>
  );
}
