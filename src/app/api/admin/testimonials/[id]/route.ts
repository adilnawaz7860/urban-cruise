import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Testimonial } from "@/lib/server/models/Testimonial";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";
import { assertValidImage, deleteResource, fileToBuffer, uploadAvatar } from "@/lib/server/cloudinary";
import { revalidatePublicSite } from "@/lib/server/revalidation";

const updateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  location: z.string().trim().optional(),
  locationHi: z.string().trim().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  text: z.string().min(1).max(1000).optional(),
  textHi: z.string().optional(),
  tripName: z.string().trim().optional(),
  tripNameHi: z.string().trim().optional(),
  isVideo: z.coerce.boolean().optional(),
  isPublished: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) throw ApiError.notFound("Testimonial not found");

    const formData = await request.formData();
    const raw = formData.get("data");
    const data = raw && typeof raw === "string" ? updateSchema.parse(JSON.parse(raw)) : {};

    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile && avatarFile.size > 0) {
      assertValidImage(avatarFile);
      if (testimonial.avatar?.publicId) await deleteResource(testimonial.avatar.publicId);
      testimonial.avatar = await uploadAvatar(await fileToBuffer(avatarFile));
    }

    Object.assign(testimonial, data);
    await testimonial.save();
    revalidatePublicSite();

    return ok(testimonial, "Testimonial updated");
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) throw ApiError.notFound("Testimonial not found");

    if (testimonial.avatar?.publicId) await deleteResource(testimonial.avatar.publicId);
    await testimonial.deleteOne();
    revalidatePublicSite();

    return ok(null, "Testimonial deleted");
  } catch (err) {
    return fail(err);
  }
}
