// file: src/components/gallery/ArtworkCard.tsx  (frame wrapper for single artwork)
"use client";

import { useMemo } from "react";
import ArtCard from "@/components/ArtCard";

import type { ArtCardProps } from "@/components/ArtCard";

type Artwork = {
  id: string;
  title: string;
  author?: string;
  mime: "image/png" | "image/jpeg" | "image/webp";
  imageBase64: string;
  createdAt?: string;
};

function randomDeg(min: number, max: number) {
  const value = Math.random() * (max - min) + min;
  return `${Math.round(value * 10) / 10}deg`;
}

export default function ArtworkCard({ item }: { item: Artwork }) {
  const src = useMemo(() => `data:${item.mime};base64,${item.imageBase64}`, [item.imageBase64, item.mime]);

  const frameProps = useMemo<Pick<ArtCardProps, "color" | "tiltDeg" | "jitter">>(() => {
    const color = Math.random() < 0.5 ? "green" : "pink";
    return {
      color,
      tiltDeg: Math.random() * 2 + 1.2,
      jitter: {
        left: randomDeg(-2, 2),
        right: randomDeg(-2, 2),
        bottom: randomDeg(-2, 2),
      },
    };
  }, []);

  const year = useMemo(() => {
    if (!item.createdAt) return "";
    const date = new Date(item.createdAt);
    return Number.isNaN(date.getTime()) ? "" : date.getFullYear().toString();
  }, [item.createdAt]);

  return (
    <figure className="flex flex-col items-center gap-3">
      <ArtCard src={src} alt={item.title} {...frameProps} />
      <figcaption className="px-4 pb-3 font-comic text-sm text-bart-black text-center">
        {item.title}
        {item.author ? ` — ${item.author}` : ""}
        {year ? `, ${year}` : ""}
      </figcaption>
    </figure>
  );
}
