import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// Swap this file's implementation for an S3/Cloudinary adapter when
// you deploy — nothing outside this file needs to change, since
// every caller only ever sees `saveUpload()` and gets back a URL.

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveUpload(file: File): Promise<string> {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Only JPEG, PNG, or WebP images are allowed");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be under 5MB");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.type.split("/")[1];
  const filename = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  // In production, replace the two lines above with an S3 putObject
  // (or Cloudinary upload) call and return that provider's public URL
  // instead of this local path. Everything else in the app just
  // stores/reads whatever string comes back from this function.
  return `/uploads/${filename}`;
}
