import { db } from "./db";

// Turns "Kofi's Chop Bar" into "kofis-chop-bar"
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Ensures uniqueness by appending -2, -3, etc. if taken.
// Call this whenever a business is created or renamed.
export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let suffix = 2;

  while (await db.business.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix++;
  }

  return candidate;
}
