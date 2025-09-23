// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[40vh] grid place-items-center p-8 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">404 — Not found</h1>
        <p className="opacity-70">Die Seite existiert nicht oder wurde verschoben.</p>
        <Link href="/" className="inline-block px-4 py-2 rounded-md border">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
