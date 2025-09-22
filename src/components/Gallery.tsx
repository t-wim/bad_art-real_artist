'use client';
import { motion } from 'framer-motion';

const mockArtworks = [
  { id: 1, src: '/images/placeholder.png', title: 'Untitled Chaos', artist: 'Bartschüler XY' },
  { id: 1, src: '/images/placeholder_1.png', title: 'Untitled Chaos', artist: 'Bartschüler XY' },
  { id: 2, src: '/images/placeholder_2.png', title: 'Neon Nightmare', artist: 'Anonymous Meme Maker' },
  { id: 3, src: '/images/placeholder_3.png', title: 'Y-Head Madness', artist: 'Grotesk Genius' },
  { id: 4, src: '/images/placeholder_4.png', title: 'Toilet Throne', artist: 'Irony Master' },
  { id: 5, src: '/images/placeholder_5.png', title: 'Scribble Frenzy', artist: 'Chaos Creator' },
];

export default function Gallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {mockArtworks.map((art) => (
        <motion.div
          key={art.id}
          className="relative bg-white p-4 rounded-lg shadow-lg transform rotate-1"
          style={{ border: '6px solid transparent', borderImage: 'url(/textures/crayon-green.png) 30 round' }}
        >
          <img src={art.src} alt={art.title} className="w-full h-auto rounded" />
          <p className="mt-2 text-[var(--bart-secondary-gray)]">
            {art.title}, 2025 – {art.artist}
          </p>
          <div className="absolute top-2 right-2 bg-[var(--bart-accent-green)] px-2 py-1 rounded-full text-white text-xs">
            +1 Sticker
          </div>
        </motion.div>
      ))}
    </div>
    
  );
}

