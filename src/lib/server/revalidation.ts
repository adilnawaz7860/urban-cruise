import { revalidatePath } from "next/cache";

/**
 * Invalidate the public site after an admin content mutation.
 *
 * Public pages read directly from MongoDB and can be prerendered by Next.js,
 * so saving a document alone is not enough to refresh what customers see.
 */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}
