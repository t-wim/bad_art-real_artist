// ==============================
// file: src/components/Header.tsx
// simple header with anchor nav
// ==============================
import Section from "./Section";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-bart-gray/20">
      <Section className="h-14 flex items-center justify-between">
        <span className="font-marker text-bart-pink text-xl">BART</span>
        <nav className="flex items-center gap-4 font-comic text-sm">
          <a href="#gallery" className="hover:opacity-40">Gallery</a>
          <a href="#about" className="hover:opacity-40">About</a>
        </nav>
      </Section>
    </header>
  );
}
