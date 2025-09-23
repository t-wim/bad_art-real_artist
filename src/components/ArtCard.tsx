// file: src/components/ArtCard.tsx
"use client";
import Image from "next/image";
import type { CSSProperties } from "react";

type Color = "duo" | "pink" | "green";

type CSSVarProperties = CSSProperties & Record<`--${string}`, string>;

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

export default function ArtCard({
  src,
  alt = "",
  color = "duo",
  tiltDeg,
  className = "",
  jitter,
}: ArtCardProps) {
  const styleVars: CSSVarProperties = {};

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
  const frameData = color === "duo" ? undefined : { "data-color": color };

  return (
    <div className={`art-card ${className}`}>
      <div className="art-card__frame" style={styleVars}>
        <div className={frameClass} {...(frameData ?? {})}>
          <div className="frame-top frame-side" />
          <div className="frame-right frame-side" />
          <div className="frame-bottom frame-side" />
          <div className="frame-left frame-side" />

          <div className="art-card__inner">
            <Image
              className="art-card__img"
              src={src}
              alt={alt}
              width={512}
              height={512}
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
