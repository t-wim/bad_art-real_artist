import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function ensureBaseUrl(): string {
  const baseUrl = process.env.API_SERVER_BASE;
  if (!baseUrl) {
    throw new Error('API_SERVER_BASE is not configured.');
  }
  return baseUrl;
}

function buildUpstreamUrl(baseUrl: string, request: NextRequest, pathSegments: string[]): URL {
  const sanitizedPath = pathSegments
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  const upstreamUrl = new URL(sanitizedPath || '', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.append(key, value);
  });
  return upstreamUrl;
}

function createUpstreamHeaders(baseUrl: string, request: NextRequest, requestId: string): Headers {
  const headers = new Headers(request.headers);
  headers.set('x-forwarded-host', request.headers.get('host') ?? '');
  headers.set('x-request-id', requestId);
  headers.delete('content-length');
  headers.delete('connection');

  try {
    const targetHost = new URL(baseUrl).host;
    if (targetHost) {
      headers.set('host', targetHost);
    }
  } catch {
    // ignore invalid host formatting
  }

  const apiKey = process.env.API_KEY;
  if (apiKey && !headers.has('authorization')) {
    headers.set('authorization', `Bearer ${apiKey}`);
  }

  return headers;
}

async function proxyRequest(
  request: NextRequest,
  context: { params: { path?: string[] } },
): Promise<NextResponse> {
  if (!ALLOWED_METHODS.has(request.method)) {
    return NextResponse.json(
      { error: { message: `Method ${request.method} is not allowed.` } },
      {
        status: 405,
        headers: { Allow: Array.from(ALLOWED_METHODS).join(', ') },
      },
    );
  }

  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  const startedAt = Date.now();

  try {
    const baseUrl = ensureBaseUrl();
    const upstreamUrl = buildUpstreamUrl(baseUrl, request, context.params.path ?? []);
    const headers = createUpstreamHeaders(baseUrl, request, requestId);
    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: 'manual',
    };

    if (!['GET', 'HEAD'].includes(request.method)) {
      init.body = request.body;
      if (typeof ReadableStream !== 'undefined' && request.body instanceof ReadableStream) {
        (init as { duplex?: 'half' }).duplex = 'half';
      }
    }

    const upstreamResponse = await fetch(upstreamUrl, init);
    const durationMs = Date.now() - startedAt;
    console.info(
      `[proxy] ${requestId} ${request.method} ${upstreamUrl.pathname}${upstreamUrl.search} -> ${upstreamResponse.status} (${durationMs}ms)`,
    );

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set('x-proxy-request-id', requestId);

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
      statusText: upstreamResponse.statusText,
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    console.error(`[proxy] ${requestId} failed after ${durationMs}ms`, error);
    const message = error instanceof Error ? error.message : 'Unexpected proxy error.';
    return NextResponse.json(
      { error: { message } },
      {
        status: error instanceof Error && error.message.includes('not configured') ? 500 : 502,
        headers: { 'x-proxy-request-id': requestId },
      },
    );
  }
}

export function GET(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, context);
}

export function POST(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, context);
}

export function PUT(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, context);
}

export function PATCH(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, context);
}

export function DELETE(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, context);
}
