// file: src/components/SiteFooter.tsx  (UPDATE — icons included)
"use client";
import Image from "next/image";
import Section from "./Section";
import { track } from "@/lib/analytics";
import { useViewTracker } from "@/hooks/useViewTracker";

const X_MAIN = process.env.NEXT_PUBLIC_X_MAIN_URL || "#";
const X_COMMUNITY = process.env.NEXT_PUBLIC_X_COMMUNITY_URL || "#";
const DEX = process.env.NEXT_PUBLIC_DEXSCREENER_URL || "#";

export default function SiteFooter() {
  const ref = useViewTracker("view_footer");

  return (
    <footer ref={ref} className="mt-10 border-t border-bart-gray/20 bg-white/90">
      <Section className="py-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="font-comic text-bart-black">Join the chaos, spread the bad art.</p>
        </div>

        <nav className="flex items-center gap-4">
          <a
            className="footer-icon inline-flex items-center gap-2 font-comic text-bart-pink hover:opacity-80 transition"
            href={X_MAIN}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on X @sleepyofsol"
            onClick={() => track("footer_click_x_main")}
          >
            <Image
              src="/icons/x.svg"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
              className="h-16 w-16 shrink-0"
            />
            <span>Follow @sleepyofsol</span>
          </a>

          <a
            className="footer-icon inline-flex items-center gap-2 font-comic text-bart-neon hover:opacity-80 transition"
            href={X_COMMUNITY}
            target="_blank"
            rel="noopener noreferrer"
            title="Join the X Community"
            onClick={() => track("footer_click_x_community")}
          >
            <Image
              src="/icons/c.svg"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
              className="h-16 w-16 shrink-0"
            />
            <span>Join the X Community</span>
          </a>

          <a
            className="footer-icon inline-flex items-center gap-2 font-comic text-bart-black hover:opacity-80 transition"
            href={DEX}
            target="_blank"
            rel="noopener noreferrer"
            title="Track on Dexscreener"
            onClick={() => track("footer_click_dex")}
          >
            <Image
              src="/icons/dex.svg"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
              className="h-16 w-16 shrink-0"
            />
            <span>Track the madness on Dexscreener</span>
          </a>
        </nav>
      </Section>
    </footer>
  );
}
