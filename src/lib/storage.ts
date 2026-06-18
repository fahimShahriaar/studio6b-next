import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Media storage abstraction.
 *
 * Currently writes to /public/uploads and returns a public URL path.
 * To switch to Cloudinary / S3 later, only this file needs to change:
 * keep `saveUpload` returning a public URL string and `deleteUpload`
 * accepting that URL.
 */

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_SUBDIR = "uploads";
const UPLOAD_DIR = path.join(PUBLIC_DIR, UPLOAD_SUBDIR);

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
export const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

export class UploadError extends Error {}

export async function saveUpload(file: File): Promise<string> {
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new UploadError("Unsupported file type. Use JPG, PNG, WebP, AVIF or GIF.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError("File is too large (max 8 MB).");
  }

  const ext = EXT_BY_MIME[file.type] ?? (path.extname(file.name) || ".bin");
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  return `/${UPLOAD_SUBDIR}/${filename}`;
}

/** Best-effort delete of a previously uploaded local file. Ignores remote URLs. */
export async function deleteUpload(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith(`/${UPLOAD_SUBDIR}/`)) return;
  try {
    await unlink(path.join(PUBLIC_DIR, url));
  } catch {
    // ignore missing files
  }
}
