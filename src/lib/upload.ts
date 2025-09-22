// src/lib/upload.ts
// Minimal client-side upload helper used by the legacy UploadForm.

const DEFAULT_UPLOAD_ENDPOINT = "/api/artworks";

type UploadResponse = {
  url?: string;
};

function resolveUploadEndpoint(): string {
  return (
    process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    DEFAULT_UPLOAD_ENDPOINT
  );
}

export async function uploadImage(file: File): Promise<string> {
  const endpoint = resolveUploadEndpoint();
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(endpoint, { method: "POST", body });
  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  // Try to obtain a URL from the backend response. If none is provided we
  // fall back to a temporary object URL so legacy flows can still preview
  // the uploaded image.
  const json = (await response.json().catch(() => ({}))) as UploadResponse;
  if (json.url && typeof json.url === "string") {
    return json.url;
  }

  return URL.createObjectURL(file);
}

export default uploadImage;
