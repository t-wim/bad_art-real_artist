import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t py-6 text-xs md:text-sm">
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} BART — Bad Art Real Artist</p>
        <nav className="flex gap-3">
          <Link className="underline" href="/about">About</Link>
          <Link className="underline" href="/legal/terms">Terms</Link>
          <Link className="underline" href="/legal/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
