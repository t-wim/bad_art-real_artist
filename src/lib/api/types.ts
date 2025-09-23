export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiErrorDetail {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface ApiErrorPayload {
  error?: ApiErrorDetail;
  requestId?: string;
  [key: string]: unknown;
}

export type ApiErrorCode =
  | 'HTTP_ERROR'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'PARSING_ERROR';

export class ApiClientError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;
  readonly data?: unknown;
  readonly requestId?: string | null;
  readonly isRetryable: boolean;

  constructor(params: {
    message: string;
    code: ApiErrorCode;
    status: number | null;
    data?: unknown;
    requestId?: string | null;
    cause?: unknown;
    isRetryable?: boolean;
  }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.code = params.code;
    this.status = params.status;
    this.data = params.data;
    this.requestId = params.requestId;
    this.isRetryable = params.isRetryable ?? false;
    if (params.cause !== undefined) {
      (this as { cause?: unknown }).cause = params.cause;
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      requestId: this.requestId,
      isRetryable: this.isRetryable,
    } satisfies Record<string, unknown>;
  }
}

export interface ApiClientConfig {
  baseUrl?: string;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  fetchFn?: typeof fetch;
  defaultHeaders?: HeadersInit;
  retryStrategy?: RetryStrategy;
}

export interface ApiRequestOptions<TBody> {
  path: string;
  method: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  searchParams?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
  parseAs?: 'json' | 'text' | 'blob';
}

export interface ApiSuccessResponse<TData> {
  data: TData;
  status: number;
  headers: Headers;
  requestId?: string | null;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  status: number | null;
  headers?: Headers;
  requestId?: string | null;
  error: ApiClientError;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

export type ApiResult<TData> = Promise<ApiResponse<TData>>;

export interface RetryContext {
  attempt: number;
  error: ApiClientError;
}

export type RetryStrategy = (context: RetryContext) => number | null;
