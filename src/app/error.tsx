'use client';
// error.tsx 
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[40vh] grid place-items-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-semibold">Something went wrong.</h2>
        <p className="opacity-80 break-words">{error.message}</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => reset()} className="px-4 py-2 rounded-md border">
            Try again
          </button>
          <a href="/" className="px-4 py-2 rounded-md border">Go home</a>
        </div>
      </div>
    </div>
  );
}