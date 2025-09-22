// file: src/components/ArtCard.tsx
"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

type Color = "duo" | "pink" | "green";

export type ArtCardProps = {
  src: string;
  alt?: string;
  color?: Color;
  tiltDeg?: number;
  className?: string;
  jitter?: {
    left?: string;
    right?: string;
    bottom?: string;
  };
};

type StyleWithVars = CSSProperties & Record<string, string>;

export default function ArtCard({
  src,
  alt = "",
  color = "duo",
  tiltDeg,
  className = "",
  jitter,
}: ArtCardProps) {
  const styleVars: StyleWithVars = {};
  if (tiltDeg !== undefined) {
    styleVars["--tilt"] = `${tiltDeg}deg`;
  }
  if (jitter?.left) {
    styleVars["--jitter-left"] = jitter.left;
  }
  if (jitter?.right) {
    styleVars["--jitter-right"] = jitter.right;
  }
  if (jitter?.bottom) {
    styleVars["--jitter-bottom"] = jitter.bottom;
  }

  const frameClass = color === "duo" ? "crayon-frame duo" : "crayon-frame";
  const dataColor = color === "duo" ? undefined : { "data-color": color };

  return (
    <div className={`art-card ${className}`}>
      <div className="art-card__frame" style={styleVars}>
        <div className={frameClass} {...dataColor}>
          <div className="frame-top frame-side" />
          <div className="frame-right frame-side" />
          <div className="frame-bottom frame-side" />
          <div className="frame-left frame-side" />

          <div className="art-card__inner relative">
            <Image
              className="art-card__img"
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
