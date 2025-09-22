"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export interface GalleryCardProps {
  src: string;
  title: string;
  artist: string;
  layoutId?: string;
}

export default function GalleryCard({ src, title, artist, layoutId }: GalleryCardProps) {
  return (
    <motion.div
      className="relative bg-white p-4 rounded-lg shadow-lg"
      style={{ border: "6px solid transparent", borderImage: "url(/textures/crayon-green.png) 30 round" }}
      initial={{ rotate: 0 }}
      whileHover={{ rotate: [0, -1, 1, -1, 0] }}
      transition={{ duration: 0.5 }}
      layoutId={layoutId ?? `card-${src}`}
    >
      <div className="relative w-full overflow-hidden rounded">
        <Image
          src={src}
          alt={title}
          width={512}
          height={512}
          className="h-auto w-full object-cover"
          sizes="(min-width: 768px) 25vw, 100vw"
        />
      </div>
      <p className="mt-2 text-sm text-[var(--bart-secondary-gray)]">
        {title}, 2025 – {artist}
      </p>
      <div className="absolute top-2 right-2 bg-[var(--bart-accent-green)] px-2 py-1 rounded-full text-white text-xs">
        +1 Sticker
      </div>
    </motion.div>
  );
}
