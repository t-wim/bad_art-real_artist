import {
  ApiClientConfig,
  ApiClientError,
  ApiErrorPayload,
  ApiRequestOptions,
  ApiResponse,
  HttpMethod,
  RetryContext,
  RetryStrategy,
} from './types';

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;
const DEFAULT_TIMEOUT_MS = 10000;
const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

function normalizePath(path: string): string {
  if (!path) {
    return '/';
  }

  if (ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }

  return path.startsWith('/') ? path : `/${path}`;
}

function buildQueryString(
  params?: Record<string, string | number | boolean | null | undefined>,
): string {
  if (!params) {
    return '';
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    searchParams.append(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

function buildUrl(baseUrl: string | undefined, path: string, query: string): string {
  if (ABSOLUTE_URL_REGEX.test(path)) {
    return query ? `${path}${path.includes('?') ? '&' : '?'}${query.slice(1)}` : path;
  }

  if (baseUrl) {
    const url = new URL(path, baseUrl.endsWith('/') || path.startsWith('/') ? baseUrl : `${baseUrl}/`);
    if (query) {
      const [, queryValue] = query.split('?');
      if (queryValue) {
        for (const [key, value] of new URLSearchParams(queryValue)) {
          url.searchParams.append(key, value);
        }
      }
    }
    return url.toString();
  }

  const normalized = normalizePath(path);
  if (!query) {
    return normalized;
  }
  return normalized.includes('?') ? `${normalized}&${query.slice(1)}` : `${normalized}${query}`;
}

function mergeHeaders(...inputs: Array<HeadersInit | undefined>): Headers {
  const headers = new Headers();
  for (const init of inputs) {
    if (!init) {
      continue;
    }
    const iterable = new Headers(init);
    iterable.forEach((value, key) => {
      headers.set(key, value);
    });
  }
  return headers;
}

function shouldRetry(status: number | null, errorCode: ApiClientError['code']): boolean {
  if (status === null) {
    return errorCode === 'NETWORK_ERROR' || errorCode === 'TIMEOUT';
  }

  return RETRYABLE_STATUS.has(status);
}

async function parseJsonSafe(response: Response): Promise<ApiErrorPayload | Record<string, unknown> | null> {
  try {
    const text = await response.text();
    if (!text) {
      return null;
    }
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function parseSuccessBody<T>(response: Response, mode: 'json' | 'text' | 'blob'): Promise<T> {
  if (response.status === 204 || response.status === 205) {
    return null as T;
  }

  if (mode === 'blob') {
    const blob = await response.blob();
    return blob as T;
  }

  if (mode === 'text') {
    const text = await response.text();
    return text as T;
  }

  const clone = response.clone();
  const text = await response.text();
  if (!text) {
    return null as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new ApiClientError({
      message: 'Failed to parse response body as JSON',
      code: 'PARSING_ERROR',
      status: response.status,
      data: await parseJsonSafe(clone),
      requestId: response.headers.get('x-request-id'),
      cause: error,
    });
  }
}

function createTimeoutSignal({
  timeoutMs,
  signal,
}: {
  timeoutMs: number | undefined;
  signal: AbortSignal | undefined;
}): { signal: AbortSignal; didTimeout: () => boolean; cleanup: () => void } {
  const controller = new AbortController();
  let timedOut = false;
  const { signal: timeoutSignal } = controller;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  if (typeof timeoutMs === 'number' && timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort(new Error('Request timed out'));
    }, timeoutMs);
  }

  const abortListener = () => {
    controller.abort(signal?.reason);
  };

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      signal.addEventListener('abort', abortListener, { once: true });
    }
  }

  return {
    signal: timeoutSignal,
    didTimeout: () => timedOut,
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (signal) {
        signal.removeEventListener('abort', abortListener);
      }
    },
  };
}

function resolveBody(body: unknown, headers: Headers): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (
    typeof body === 'string' ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
  ) {
    return body as BodyInit;
  }

  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  return JSON.stringify(body);
}

function defaultRetryStrategy(context: RetryContext, baseDelay: number): number | null {
  if (!context.error.isRetryable) {
    return null;
  }

  const delay = Math.min(baseDelay * 2 ** context.attempt, 5000);
  return delay;
}

export interface ApiClient {
  request: <TResponse, TBody = unknown>(options: ApiRequestOptions<TBody>) => Promise<ApiResponse<TResponse>>;
  get: <TResponse>(path: string, options?: Omit<ApiRequestOptions<undefined>, 'path' | 'method'>) => Promise<ApiResponse<TResponse>>;
  post: <TResponse, TBody = unknown>(path: string, body?: TBody, options?: Omit<ApiRequestOptions<TBody>, 'path' | 'method' | 'body'>) => Promise<ApiResponse<TResponse>>;
  put: <TResponse, TBody = unknown>(path: string, body?: TBody, options?: Omit<ApiRequestOptions<TBody>, 'path' | 'method' | 'body'>) => Promise<ApiResponse<TResponse>>;
  patch: <TResponse, TBody = unknown>(path: string, body?: TBody, options?: Omit<ApiRequestOptions<TBody>, 'path' | 'method' | 'body'>) => Promise<ApiResponse<TResponse>>;
  del: <TResponse>(path: string, options?: Omit<ApiRequestOptions<undefined>, 'path' | 'method'>) => Promise<ApiResponse<TResponse>>;
}

export function createApiClient(config: ApiClientConfig = {}): ApiClient {
  const {
    baseUrl,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = 2,
    retryDelayMs = 250,
    fetchFn = fetch,
    defaultHeaders,
    retryStrategy,
  } = config;

  const totalAttempts = Math.max(1, retries + 1);
  const resolvedBaseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE;
  const strategy: RetryStrategy = retryStrategy ?? ((context) => defaultRetryStrategy(context, retryDelayMs));

  const request = async <TResponse, TBody = unknown>(
    options: ApiRequestOptions<TBody>,
  ): Promise<ApiResponse<TResponse>> => {
    const query = buildQueryString(options.searchParams);
    const url = buildUrl(resolvedBaseUrl, normalizePath(options.path), query);
    let attempt = 0;
    let lastError: ApiClientError | null = null;

    while (attempt < totalAttempts) {
      const headers = mergeHeaders(defaultHeaders, options.headers);
      const { signal, didTimeout, cleanup } = createTimeoutSignal({ timeoutMs, signal: options.signal });
      const requestInit: RequestInit = {
        method: options.method,
        headers,
        signal,
      };

      try {
        const requestBody = resolveBody(options.body, headers);
        if (requestBody !== undefined) {
          requestInit.body = requestBody;
          if (requestBody instanceof ReadableStream) {
            (requestInit as unknown as { duplex?: 'half' }).duplex = 'half';
          }
        }

        const response = await fetchFn(url, requestInit);
        const requestId = response.headers.get('x-request-id') ?? response.headers.get('x-requestid');

        if (response.ok) {
          try {
            const data = await parseSuccessBody<TResponse>(response, options.parseAs ?? 'json');
            cleanup();
            return {
              data,
              status: response.status,
              headers: new Headers(response.headers),
              requestId,
              error: null,
            };
          } catch (error) {
            cleanup();
            if (error instanceof ApiClientError) {
              lastError = error;
            } else {
              lastError = new ApiClientError({
                message: error instanceof Error ? error.message : 'Unknown parsing error',
                code: 'PARSING_ERROR',
                status: response.status,
                requestId,
                cause: error,
              });
            }
          }
        } else {
          const cloned = response.clone();
          const payload = await parseJsonSafe(cloned);
          const message =
            (payload as ApiErrorPayload | null)?.error?.message || response.statusText || 'Request failed';
          const error = new ApiClientError({
            message,
            code: 'HTTP_ERROR',
            status: response.status,
            data: payload,
            requestId,
            isRetryable: shouldRetry(response.status, 'HTTP_ERROR'),
          });
          cleanup();
          if (attempt < totalAttempts - 1 && error.isRetryable) {
            lastError = error;
            const delay = strategy({ attempt, error });
            if (delay !== null) {
              await new Promise((resolve) => setTimeout(resolve, delay));
              attempt += 1;
              continue;
            }
          }
          return {
            data: null,
            status: response.status,
            headers: new Headers(response.headers),
            requestId,
            error,
          };
        }
      } catch (error) {
        cleanup();
        const isAbortError =
          typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError';
        const baseMessage = error instanceof Error ? error.message : 'Request failed';
        const errorCode: ApiClientError['code'] = didTimeout()
          ? 'TIMEOUT'
          : isAbortError
            ? 'NETWORK_ERROR'
            : 'NETWORK_ERROR';
        const derivedError =
          error instanceof ApiClientError
            ? error
            : new ApiClientError({
                message: didTimeout() ? 'Request timed out' : baseMessage,
                code: errorCode,
                status: null,
                isRetryable: didTimeout() || (!isAbortError && errorCode === 'NETWORK_ERROR'),
                cause: error,
              });
        lastError = derivedError;
      }

      if (lastError) {
        const retryDelay = attempt < totalAttempts - 1 ? strategy({ attempt, error: lastError }) : null;
        if (retryDelay !== null) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          attempt += 1;
          continue;
        }
        break;
      }

      break;
    }

    return {
      data: null,
      status: lastError?.status ?? null,
      requestId: lastError?.requestId ?? undefined,
      error:
        lastError ??
        new ApiClientError({
          message: 'Unknown API error',
          code: 'NETWORK_ERROR',
          status: null,
        }),
    };
  };

  const call = <TResponse, TBody = unknown>(
    method: HttpMethod,
    path: string,
    body?: TBody,
    options?: Omit<ApiRequestOptions<TBody>, 'path' | 'method' | 'body'>,
  ) =>
    request<TResponse, TBody>({
      ...(options ?? {}),
      method,
      path,
      body,
    });

  return {
    request,
    get: (path, options) => call('GET', path, undefined, options),
    post: (path, body, options) => call('POST', path, body, options),
    put: (path, body, options) => call('PUT', path, body, options),
    patch: (path, body, options) => call('PATCH', path, body, options),
    del: (path, options) => call('DELETE', path, undefined, options),
  } satisfies ApiClient;
}

export const apiClient = createApiClient();

export const apiGet: ApiClient['get'] = (path, options) => apiClient.get(path, options);
export const apiPost: ApiClient['post'] = (path, body, options) => apiClient.post(path, body, options);
export const apiPut: ApiClient['put'] = (path, body, options) => apiClient.put(path, body, options);
export const apiPatch: ApiClient['patch'] = (path, body, options) => apiClient.patch(path, body, options);
export const apiDelete: ApiClient['del'] = (path, options) => apiClient.del(path, options);
