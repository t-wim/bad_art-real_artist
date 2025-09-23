import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { createApiClient } from './client';
import type { ApiResponse } from './types';
import { server } from '@/tests/mocks/server';

describe('api client', () => {
  it('returns parsed data for successful requests', async () => {
    server.use(
      http.get('https://api.test/items', () =>
        HttpResponse.json(
          { items: [1, 2, 3] },
          {
            headers: { 'x-request-id': 'req-123' },
          },
        ),
      ),
    );

    const client = createApiClient({ baseUrl: 'https://api.test', retries: 0, timeoutMs: 200 });
    const result = await client.get<{ items: number[] }>('/items');

    expect(result.status).toBe(200);
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ items: [1, 2, 3] });
    expect(result.requestId).toBe('req-123');
  });

  it('returns error metadata for non-2xx responses', async () => {
    server.use(
      http.get('https://api.test/items', () =>
        HttpResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Not found' } },
          { status: 404 },
        ),
      ),
    );

    const client = createApiClient({ baseUrl: 'https://api.test', retries: 0, timeoutMs: 200 });
    const result = await client.get('/items');

    expect(result.status).toBe(404);
    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();

    if (result.error) {
      expect(result.error.code).toBe('HTTP_ERROR');
      expect(result.error.status).toBe(404);
      expect(result.error.data).toMatchObject({ error: { code: 'NOT_FOUND' } });
    }
  });

  it('marks requests as timed out when exceeding the timeout', async () => {
    server.use(
      http.get('https://api.test/slow', async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createApiClient({ baseUrl: 'https://api.test', retries: 0, timeoutMs: 50 });
    const result = await client.get('/slow');

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();

    if (result.error) {
      expect(result.error.code).toBe('TIMEOUT');
    }
  });

  it('retries retryable responses before succeeding', async () => {
    let callCount = 0;
    server.use(
      http.get('https://api.test/retry', () => {
        callCount += 1;
        if (callCount < 2) {
          return HttpResponse.json({ error: { message: 'temporary failure' } }, { status: 502 });
        }
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createApiClient({ baseUrl: 'https://api.test', retries: 2, timeoutMs: 200 });
    const result: ApiResponse<{ ok: boolean }> = await client.get('/retry');

    expect(callCount).toBe(2);
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ ok: true });
  });
});
