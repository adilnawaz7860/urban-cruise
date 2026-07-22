import slugifyLib from "slugify";
import type { Model } from "mongoose";

export function slugify(text: string) {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
}

export async function makeUniqueSlug(
  model: Model<{ slug: string }>,
  title: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let counter = 1;
  while (true) {
    const filter: Record<string, unknown> = { slug };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await model.exists(filter);
    if (!exists) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}
