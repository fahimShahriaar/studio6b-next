import { slugify } from "@/lib/utils";

/**
 * Generate a unique slug from `text`, using the provided `exists` predicate
 * to check the database. Appends -2, -3, … on collision.
 */
export async function ensureUniqueSlug(
  text: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(text) || "item";
  let slug = base;
  let i = 2;
  while (await exists(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}
