// file: src/components/ArtCard.tsx
"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

type Color = "duo" | "pink" | "green";

type CSSCustomProperties = CSSProperties & Record<`--${string}`, string>;

export type ArtCardProps = {
  src: string;
  alt?: string;
  color?: Color; // "duo" | "pink" | "green"
  tiltDeg?: number; // überschreibt --frame-tilt
  className?: string; // zusätzliche Wrapper-Klassen
  jitter?: {
    left?: string; // z.B. "0.6deg"
    right?: string;
    bottom?: string;
  };
};

export default function ArtCard({
  src,
  alt = "",
  color = "duo",
  tiltDeg,
  className = "",
  jitter,
}: ArtCardProps) {
  const styleVars: CSSCustomProperties = {};

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
  const dataColor = color === "duo" ? {} : { "data-color": color };
  const isOptimizable = !(src.startsWith("data:") || src.startsWith("blob:"));

  return (
    <div className={`art-card ${className}`}>
      <div className="art-card__frame" style={styleVars}>
        <div className={frameClass} {...dataColor}>
          {/* ======= Das eigentliche Markup der vier Rahmen-Seiten ======= */}
          <div className="frame-top frame-side" />
          <div className="frame-right frame-side" />
          <div className="frame-bottom frame-side" />
          <div className="frame-left frame-side" />

          {/* ======= Bild (gegenrotiert) ======= */}
          <div className="art-card__inner">
            <Image
              src={src}
              alt={alt}
              width={800}
              height={800}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
              className="art-card__img h-auto w-full object-cover"
              unoptimized={!isOptimizable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
