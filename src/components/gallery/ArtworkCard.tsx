"use client";

import { useMemo } from "react";

import ArtCard from "@/components/ArtCard";
import type { ArtCardProps } from "@/components/ArtCard";
import type { TArtwork } from "@/lib/contracts";

const colors: ArtCardProps["color"][] = ["duo", "pink", "green"];

type ArtworkCardProps = {
  item: TArtwork;
};

function randomAngle(min: number, max: number): string {
  const value = Math.random() * (max - min) + min;
  return `${value.toFixed(1)}deg`;
}

export default function ArtworkCard({ item }: ArtworkCardProps) {
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);
  const jitter = useMemo(
    () => ({
      left: randomAngle(-2, 2),
      right: randomAngle(-2, 2),
      bottom: randomAngle(-2, 2),
    }),
    []
  );

  return (
    <figure className="space-y-2">
      <ArtCard
        src={`data:${item.mime};base64,${item.imageBase64}`}
        alt={item.title}
        color={color}
        jitter={jitter}
      />
      <figcaption className="px-4 pb-3 font-comic text-sm text-bart-black">
        {item.title}
        {item.author ? ` — ${item.author}` : ""}
        {item.createdAt ? `, ${new Date(item.createdAt).getFullYear()}` : ""}
      </figcaption>
    </figure>
  );
}
