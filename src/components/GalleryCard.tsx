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
      <Image src={src} alt={title} width={600} height={600} className="w-full h-auto rounded" />
      <p className="mt-2 text-sm text-[var(--bart-secondary-gray)]">
        {title}, 2025 – {artist}
      </p>
      <div className="absolute top-2 right-2 bg-[var(--bart-accent-green)] px-2 py-1 rounded-full text-white text-xs">
        +1 Sticker
      </div>
    </motion.div>
  );
}
