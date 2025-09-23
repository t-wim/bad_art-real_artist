import type { HTMLAttributes } from 'react';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function Loader({ label = 'Loading…', className, ...rest }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-2 text-sm text-neutral-500 ${className ?? ''}`.trim()}
      {...rest}
    >
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}
