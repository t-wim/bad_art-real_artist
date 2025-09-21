/**
 * Placeholder upload — replace with your storage/Solana adapter.
 * Accepts a File (browser) and returns a blob URL for now.
 */
export async function uploadImage(file: File): Promise<string> {
  // Example: replace with your S3/Arweave/Pinata upload logic
  return URL.createObjectURL(file);
}
