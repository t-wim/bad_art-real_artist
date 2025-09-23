import { HttpMethod } from './api/types';

type UploadableFile = File | Blob;

export interface FileValidationOptions {
  maxSizeInBytes?: number;
}

export interface Base64UploadPayload {
  fileName: string;
  contentType: string;
  size: number;
  base64: string;
  metadata?: Record<string, unknown>;
}

export interface Base64UploadOptions extends FileValidationOptions {
  file: UploadableFile;
  fileName?: string;
  metadata?: Record<string, unknown>;
  send: (payload: Base64UploadPayload) => Promise<unknown> | unknown;
}

export interface SignedUrlRequestContext extends FileValidationOptions {
  fileName: string;
  contentType: string;
  size: number;
  totalChunks: number;
  metadata?: Record<string, unknown>;
}

export interface SignedUrlConfig {
  url: string;
  method?: HttpMethod;
  headers?: HeadersInit;
}

export interface SignedUrlChunkUploadContext {
  url: string;
  method: HttpMethod;
  headers: HeadersInit;
  chunk: Blob;
  chunkIndex: number;
  totalChunks: number;
}

export interface SignedUrlUploadOptions extends FileValidationOptions {
  file: UploadableFile;
  fileName?: string;
  metadata?: Record<string, unknown>;
  chunkSizeInBytes?: number;
  getSignedUrl: (context: SignedUrlRequestContext) => Promise<SignedUrlConfig>;
  uploadChunk?: (context: SignedUrlChunkUploadContext) => Promise<unknown> | unknown;
}

export interface SignedUrlUploadResult {
  totalChunks: number;
  uploadedBytes: number;
}

const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export function validateFileSize(file: UploadableFile, options: FileValidationOptions = {}): void {
  const { maxSizeInBytes } = options;
  if (typeof maxSizeInBytes === 'number' && maxSizeInBytes > 0 && file.size > maxSizeInBytes) {
    throw new Error(`File exceeds allowed size of ${maxSizeInBytes} bytes.`);
  }
}

export function* createChunkIterator(file: UploadableFile, chunkSize: number): IterableIterator<{ index: number; blob: Blob }> {
  if (chunkSize <= 0) {
    throw new Error('Chunk size must be greater than 0.');
  }

  let index = 0;
  for (let offset = 0; offset < file.size; offset += chunkSize) {
    const blob = file.slice(offset, offset + chunkSize);
    yield { index, blob };
    index += 1;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buffer).toString('base64');
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  if (typeof btoa === 'function') {
    return btoa(binary);
  }
  throw new Error('Base64 encoding is not supported in this environment.');
}

function getFileName(file: UploadableFile, fallback?: string): string {
  if (typeof fallback === 'string' && fallback.trim().length > 0) {
    return fallback;
  }

  if (typeof File !== 'undefined' && file instanceof File) {
    return file.name;
  }

  return 'upload.bin';
}

function getContentType(file: UploadableFile): string {
  return file.type || 'application/octet-stream';
}

export async function uploadAsBase64(options: Base64UploadOptions): Promise<Base64UploadPayload> {
  const { file, fileName, metadata, send, ...validation } = options;
  validateFileSize(file, validation);
  const buffer = await file.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);
  const payload: Base64UploadPayload = {
    base64,
    fileName: getFileName(file, fileName),
    contentType: getContentType(file),
    size: file.size,
    metadata,
  };
  await send(payload);
  return payload;
}

async function defaultChunkUploader(context: SignedUrlChunkUploadContext): Promise<void> {
  const { url, method, headers, chunk } = context;
  await fetch(url, {
    method,
    headers,
    body: chunk,
  });
}

export async function uploadViaSignedUrl(options: SignedUrlUploadOptions): Promise<SignedUrlUploadResult> {
  const { file, fileName, metadata, chunkSizeInBytes, getSignedUrl, uploadChunk, ...validation } = options;
  validateFileSize(file, validation);

  const chunkSize = chunkSizeInBytes ?? DEFAULT_CHUNK_SIZE;
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));

  const requestContext: SignedUrlRequestContext = {
    fileName: getFileName(file, fileName),
    contentType: getContentType(file),
    size: file.size,
    totalChunks,
    metadata,
    maxSizeInBytes: validation.maxSizeInBytes,
  };

  const signedConfig = await getSignedUrl(requestContext);
  const method: HttpMethod = signedConfig.method ?? 'PUT';
  const headers = new Headers(signedConfig.headers ?? {});
  if (!headers.has('content-type')) {
    headers.set('content-type', getContentType(file));
  }

  const performUpload = uploadChunk ?? defaultChunkUploader;
  for (const { index, blob } of createChunkIterator(file, chunkSize)) {
    await performUpload({
      url: signedConfig.url,
      method,
      headers,
      chunk: blob,
      chunkIndex: index,
      totalChunks,
    });
  }

  return {
    totalChunks,
    uploadedBytes: file.size,
  };
}
