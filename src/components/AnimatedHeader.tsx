"use client";

import { motion } from 'framer-motion';
import copy from '@/content/copy.json';

export default function AnimatedHeader() {
  return (
    <header className="relative overflow-hidden min-h-[50vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-[var(--bart-bg)]" />
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 left-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.06)_0_2px,transparent_2px_10px)]"
      />
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h1
          className="text-6xl font-bold text-[var(--bart-accent-pink)] mix-blend-screen"
          aria-label="BART - Bad Art, Real Artists"
        >
          {copy.home.title}
        </h1>
        <p
          className="text-2xl text-[var(--bart-accent-green)] mt-4"
          aria-label="Shitpost your way to fame"
        >
          {copy.home.subtext}
        </p>
        <nav className="mt-6 flex justify-center gap-4">
          <a href="#gallery" className="text-[var(--bart-secondary-blue)] hover:text-[var(--bart-accent-pink)]">
            Gallery
          </a>
          <a href="#upload" className="text-[var(--bart-secondary-blue)] hover:text-[var(--bart-accent-pink)]">
            Upload
          </a>
          <a href="#about" className="text-[var(--bart-secondary-blue)] hover:text-[var(--bart-accent-pink)]">
            About
          </a>
        </nav>
      </motion.div>
    </header>
  );
}