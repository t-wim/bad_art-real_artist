// file: src/components/gallery/ArtworkCard.tsx  (UPDATE – ImageStatus + Fallback)
"use client";
import Image from "next/image";
import { useMemo, useState, useEffect, type CSSProperties } from "react";
import { base64ToObjectUrl } from "@/lib/utils/image";
import { useImageStatus } from "@/hooks/useImageStatus";
import "@/app/frames.css";

type Artwork = {
  id: string;
  title: string;
  author?: string;
  mime: "image/png" | "image/jpeg" | "image/webp";
  imageBase64: string;
  createdAt?: string;
};

type CSSVarProperties = CSSProperties & Record<`--${string}`, string>;

export default function ArtworkCard({ item }: { item: Artwork }) {
  const [url, setUrl] = useState<string>("");
  const { failed, onLoad, onError } = useImageStatus(item.id);
  const color = useMemo<"green" | "pink">(
    () => (Math.random() < 0.5 ? "green" : "pink"),
    [],
  );
  const jitter = useMemo<CSSVarProperties>(
    () => ({
      "--jitter-bottom": `${rand(-2, 2)}deg`,
      "--jitter-left": `${rand(-2, 2)}deg`,
      "--jitter-right": `${rand(-2, 2)}deg`,
    }),
    [],
  );

  useEffect(() => {
    const u = base64ToObjectUrl(item.imageBase64);
    setUrl(u);
    return () => {
      if (u) URL.revokeObjectURL(u);
    };
  }, [item.imageBase64]);

  const tiltStyle = useMemo<CSSVarProperties>(() => ({ "--tilt": "1.8deg" }), []);

  const imageSrc = url || `data:${item.mime};base64,${item.imageBase64}`;

  return (
    <figure
      className="crayon-frame group relative rounded-xl bg-white shadow-sm transition will-change-transform hover:shadow-md"
      data-color={color}
      style={jitter}
      data-failed={failed || undefined}
    >
      <span className="frame-side frame-top" />
      <span className="frame-side frame-right" />
      <span className="frame-side frame-bottom" />
      <span className="frame-side frame-left" />
      <i className="tape tl" aria-hidden />
      <i className="tape tr" aria-hidden />
      <i className="tape bl" aria-hidden />
      <i className="tape br" aria-hidden />
      <div className="art-card">
        <div className="art-card__frame crayon-pink" style={tiltStyle}>
          <div className="art-card__tape">{/* optional: Tape-Dekor */}</div>

          <div className="art-card__inner relative">
            <Image
              className="art-card__img object-cover"
              alt={item.title}
              src={imageSrc}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 40vw, 80vw"
              onLoad={onLoad}
              onError={onError}
            />
          </div>
        </div>
      </div>
      <figcaption className="font-comic text-bart-black px-4 pb-3 text-sm">
        {item.title}
        {item.author ? ` — ${item.author}` : ""}
        {item.createdAt ? `, ${new Date(item.createdAt).getFullYear()}` : ""}
      </figcaption>
    </figure>
  );
}
function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}
