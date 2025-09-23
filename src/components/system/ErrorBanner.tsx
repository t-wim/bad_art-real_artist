import type { HTMLAttributes } from 'react';

interface ErrorBannerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function ErrorBanner({
  title = 'Something went wrong',
  description,
  className,
  ...rest
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={`w-full rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm ${className ?? ''}`.trim()}
      {...rest}
    >
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-1 text-red-600">{description}</p> : null}
    </div>
  );
}
