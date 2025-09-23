"use client";

import { useMemo } from "react";
import ArtCard from "@/components/ArtCard";
import "@/app/frames.css";

type Artwork = {
  id: string;
  title: string;
  author?: string;
  mime: "image/png" | "image/jpeg" | "image/webp";
  imageBase64: string;
  createdAt?: string;
};

type Jitter = {
  left?: string;
  right?: string;
  bottom?: string;
};

export default function ArtworkCard({ item }: { item: Artwork }) {
  const jitter = useMemo<Jitter>(
    () => ({
      right: `${randomTilt(-2, 2)}deg`,
      bottom: `${randomTilt(-2, 2)}deg`,
      left: `${randomTilt(-2, 2)}deg`,
    }),
    [],
  );

  const color = useMemo(() => (Math.random() < 0.5 ? "green" : "pink"), []);

  const src = item.imageBase64.startsWith("data:")
    ? item.imageBase64
    : `data:${item.mime};base64,${item.imageBase64}`;

  return (
    <figure className="space-y-3">
      <ArtCard src={src} alt={item.title} color={color} jitter={jitter} tiltDeg={1.8} />
      <figcaption className="px-2 font-comic text-sm text-bart-black">
        {item.title}
        {item.author ? ` — ${item.author}` : ""}
        {item.createdAt ? `, ${new Date(item.createdAt).getFullYear()}` : ""}
      </figcaption>
    </figure>
  );
}

function randomTilt(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}
