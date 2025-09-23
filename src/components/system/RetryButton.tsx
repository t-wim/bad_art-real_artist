import type { ButtonHTMLAttributes } from 'react';

interface RetryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function RetryButton({ label = 'Retry', className, ...rest }: RetryButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 ${className ?? ''}`.trim()}
      {...rest}
    >
      {label}
    </button>
  );
}
