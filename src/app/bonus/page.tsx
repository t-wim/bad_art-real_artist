"use client";

import { useState } from "react";
import Link from "next/link";

export default function BonusPage() {
  const [connected, setConnected] = useState(false);

  // TODO: Replace with real wallet adapter hook (e.g. @solana/wallet-adapter-react)
  function mockConnect() {
    setConnected(true);
  }

  return (
    <main className="min-h-dvh p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Bonus Memes</h1>
        <p className="text-sm md:text-base opacity-80">
          Connect your wallet to unlock weekly bonus drops.
        </p>
      </header>

      <section className="grid gap-4 md:gap-6">
        <div className="rounded-2xl border p-4 md:p-6">
          {!connected ? (
            <button
              onClick={mockConnect}
              className="rounded-xl border px-4 py-2 text-sm md:text-base hover:shadow"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm md:text-base">
              <p className="mb-2">Wallet connected. Bonus content unlocked 🎉</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Weekly bonus memes</li>
                <li>Early access teasers</li>
                <li>Voting multipliers</li>
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-2xl border p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Explore</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/gallery" className="underline text-sm md:text-base">
              Gallery
            </Link>
            <Link href="/hall-of-fame" className="underline text-sm md:text-base">
              Hall of Fame
            </Link>
            <Link href="/submit" className="underline text-sm md:text-base">
              Submit a Meme
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
