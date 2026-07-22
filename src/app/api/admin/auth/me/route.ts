import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin, ok, fail } from "@/lib/server/api-helpers";
import { assertValidImage, deleteResource, fileToBuffer, uploadAvatar } from "@/lib/server/cloudinary";

export async function GET() {
  try {
    const admin = await requireAdmin();
    return ok(admin.toSafeObject());
  } catch (err) {
    return fail(err);
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  email: z.string().email().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const formData = await request.formData();
    const raw = {
      name: formData.get("name") as string | null,
      email: formData.get("email") as string | null,
    };
    const data = updateProfileSchema.parse({
      name: raw.name || undefined,
      email: raw.email || undefined,
    });

    const file = formData.get("avatar") as File | null;
    if (file && file.size > 0) {
      assertValidImage(file);
      if (admin.avatar?.publicId) await deleteResource(admin.avatar.publicId);
      const buffer = await fileToBuffer(file);
      const uploaded = await uploadAvatar(buffer);
      admin.avatar = uploaded;
    }

    if (data.name) admin.name = data.name;
    if (data.email) admin.email = data.email.toLowerCase();
    await admin.save();

    return ok(admin.toSafeObject(), "Profile updated");
  } catch (err) {
    return fail(err);
  }
}
