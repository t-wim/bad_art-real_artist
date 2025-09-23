'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { apiGet } from '@/lib/api/client';
import type { ApiClientError } from '@/lib/api/types';

export interface HealthcheckResponse {
  ok: boolean;
  [key: string]: unknown;
}

type HealthcheckStatus = 'idle' | 'loading' | 'success' | 'error';

interface HealthcheckState {
  status: HealthcheckStatus;
  data: HealthcheckResponse | null;
  error: ApiClientError | null;
  lastCheckedAt: Date | null;
}

export interface UseHealthcheckOptions {
  enabled?: boolean;
  pollingIntervalMs?: number;
}

const INITIAL_STATE: HealthcheckState = {
  status: 'idle',
  data: null,
  error: null,
  lastCheckedAt: null,
};

export function useHealthcheck(options: UseHealthcheckOptions = {}) {
  const { enabled = true, pollingIntervalMs } = options;
  const [state, setState] = useState<HealthcheckState>({ ...INITIAL_STATE });
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const runCheck = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setState((current) => ({
      ...current,
      status: 'loading',
      error: null,
    }));

    const result = await apiGet<HealthcheckResponse>('/api/proxy/health');

    if (!isMountedRef.current) {
      return;
    }

    const lastCheckedAt = new Date();

    if (result.error) {
      setState({
        status: 'error',
        data: null,
        error: result.error,
        lastCheckedAt,
      });
      return;
    }

    setState({
      status: 'success',
      data: result.data,
      error: null,
      lastCheckedAt,
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setState(() => ({ ...INITIAL_STATE }));
      return;
    }

    void runCheck();
  }, [enabled, runCheck]);

  useEffect(() => {
    if (!enabled || !pollingIntervalMs) {
      return undefined;
    }

    const id = setInterval(() => {
      void runCheck();
    }, pollingIntervalMs);

    return () => {
      clearInterval(id);
    };
  }, [enabled, pollingIntervalMs, runCheck]);

  return {
    ...state,
    isHealthy: state.status === 'success' && Boolean(state.data?.ok),
    refresh: runCheck,
  };
}
