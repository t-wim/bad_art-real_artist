'use client';

import { useMemo } from 'react';

import { ErrorBanner } from '@/components/system/ErrorBanner';
import { Loader } from '@/components/system/Loader';
import { RetryButton } from '@/components/system/RetryButton';
import { useHealthcheck } from '@/hooks/useHealthcheck';
import { isFeatureEnabled } from '@/lib/flags';

export default function HealthcheckPage() {
  const healthcheckEnabled = isFeatureEnabled('healthcheck');
  const { status, data, error, isHealthy, lastCheckedAt, refresh } = useHealthcheck({
    enabled: healthcheckEnabled,
  });

  const statusLabel = useMemo(() => {
    if (!healthcheckEnabled) {
      return 'disabled';
    }
    if (status === 'loading') {
      return 'checking';
    }
    return status;
  }, [healthcheckEnabled, status]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">Service health</h1>
        <p className="text-sm text-neutral-600">
          Status: <span className="font-medium text-neutral-900">{statusLabel}</span>
        </p>
        <p className="text-xs text-neutral-500">
          Last checked{' '}
          {lastCheckedAt ? lastCheckedAt.toLocaleString() : 'Not checked yet'}
        </p>
      </header>

      {!healthcheckEnabled ? (
        <ErrorBanner
          title="Healthcheck disabled"
          description="Enable the healthcheck feature flag to poll the proxy endpoint."
        />
      ) : null}

      {healthcheckEnabled && status === 'loading' ? <Loader label="Checking health…" /> : null}

      {healthcheckEnabled && status === 'error' && error ? (
        <div className="flex flex-col gap-4">
          <ErrorBanner description={error.message} />
          <div>
            <RetryButton onClick={() => void refresh()} />
          </div>
        </div>
      ) : null}

      {healthcheckEnabled && status === 'success' ? (
        <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-base font-semibold text-neutral-900">
            Upstream proxy {isHealthy ? 'is healthy' : 'reported an issue'}
          </p>
          <pre className="overflow-x-auto rounded bg-neutral-900 p-4 text-xs text-neutral-100">
            {JSON.stringify(data, null, 2)}
          </pre>
          <div>
            <RetryButton onClick={() => void refresh()} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
