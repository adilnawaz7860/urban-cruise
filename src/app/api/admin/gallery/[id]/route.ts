import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Gallery, GALLERY_CATEGORIES } from "@/lib/server/models/Gallery";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";
import { deleteResource } from "@/lib/server/cloudinary";
import { revalidatePublicSite } from "@/lib/server/revalidation";

const updateSchema = z.object({
  alt: z.string().trim().optional(),
  altHi: z.string().trim().optional(),
  caption: z.string().trim().max(200).optional(),
  category: z.enum(GALLERY_CATEGORIES).optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const data = updateSchema.parse(await request.json());
    const item = await Gallery.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!item) throw ApiError.notFound("Gallery item not found");
    revalidatePublicSite();

    return ok(item, "Gallery item updated");
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const item = await Gallery.findById(id);
    if (!item) throw ApiError.notFound("Gallery item not found");

    if (item.publicId) await deleteResource(item.publicId);
    await item.deleteOne();
    revalidatePublicSite();

    return ok(null, "Gallery item deleted");
  } catch (err) {
    return fail(err);
  }
}
