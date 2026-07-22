import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Destination } from "@/lib/server/models/Destination";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";
import { makeUniqueSlug } from "@/lib/server/slug";
import { assertValidImage, deleteResource, fileToBuffer, uploadDestinationImage } from "@/lib/server/cloudinary";

const updateSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  nameHi: z.string().trim().optional(),
  country: z.string().trim().optional(),
  packageCount: z.coerce.number().int().min(0).optional(),
  startingPrice: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  descriptionHi: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const destination = await Destination.findById(id);
    if (!destination) throw ApiError.notFound("Destination not found");

    const formData = await request.formData();
    const raw = formData.get("data");
    if (!raw || typeof raw !== "string") throw new Error("Missing 'data' field");
    const data = updateSchema.parse(JSON.parse(raw));

    if (data.name && data.name !== destination.name) {
      destination.slug = await makeUniqueSlug(Destination, data.name, id);
    }

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      assertValidImage(imageFile);
      if (destination.image?.publicId) await deleteResource(destination.image.publicId);
      destination.image = await uploadDestinationImage(await fileToBuffer(imageFile));
    }

    Object.assign(destination, data);
    await destination.save();

    return ok(destination, "Destination updated");
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const destination = await Destination.findById(id);
    if (!destination) throw ApiError.notFound("Destination not found");

    if (destination.image?.publicId) await deleteResource(destination.image.publicId);
    await destination.deleteOne();

    return ok(null, "Destination deleted");
  } catch (err) {
    return fail(err);
  }
}
