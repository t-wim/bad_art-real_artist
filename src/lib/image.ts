// ==============================
// file: src/lib/image.ts
// Base64 → Blob → ObjectURL helper (safe & reusable)
// ==============================
export function base64ToObjectUrl(dataUri: string): string {
  try {
    // supports both "data:mime;base64,..." and raw base64 (png/jpg/webp assumed)
    const hasPrefix = dataUri.startsWith("data:");
    const [mime, b64] = hasPrefix
      ? [dataUri.substring(5, dataUri.indexOf(";")), dataUri.split(",")[1] ?? ""]
      : ["image/png", dataUri];
    const byteStr = atob(b64);
    const bytes = new Uint8Array(byteStr.length);
    for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
    const blob = new Blob([bytes], { type: mime || "image/png" });
    return URL.createObjectURL(blob);
  } catch {
    return "";
  }
}
