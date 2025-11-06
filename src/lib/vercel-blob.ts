import { put, del } from "@vercel/blob";

const BLOB_STORE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_STORE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is not set in environment variables");
}

/**
 * Upload a file to Vercel Blob storage
 * @param file - File or FormData entry to upload
 * @param filename - Optional custom filename
 * @returns The URL of the uploaded file
 */
export async function uploadToBlob(
  file: File | Blob,
  filename?: string,
): Promise<string> {
  const blob = await put(filename || (file instanceof File ? file.name : "blob"), file, {
    access: "public",
    token: BLOB_STORE_TOKEN,
  });

  return blob.url;
}

/**
 * Upload a file from a base64 string
 * @param base64 - Base64 encoded file
 * @param filename - Filename for the upload
 * @param mimeType - MIME type of the file
 * @returns The URL of the uploaded file
 */
export async function uploadBase64ToBlob(
  base64: string,
  filename: string,
  mimeType: string,
): Promise<string> {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:[^;]+;base64,/, "");

  const buffer = Buffer.from(base64Data, "base64");
  const blob = new Blob([buffer], { type: mimeType });

  return uploadToBlob(blob, filename);
}

/**
 * Delete a file from Vercel Blob storage
 * @param url - URL of the file to delete
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url, {
      token: BLOB_STORE_TOKEN,
    });
  } catch (error) {
    console.error("Failed to delete blob:", error);
    // Don't throw - file might already be deleted
  }
}

/**
 * Extract filename from a blob URL for deletion
 * @param url - Blob URL
 * @returns The filename/key
 */
export function getBlobKeyFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.split("/").pop() || "";
  } catch {
    return "";
  }
}
