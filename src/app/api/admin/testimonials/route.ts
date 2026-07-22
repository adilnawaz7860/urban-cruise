import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Testimonial } from "@/lib/server/models/Testimonial";
import { requireAdmin, ok, created, fail } from "@/lib/server/api-helpers";
import { assertValidImage, fileToBuffer, uploadAvatar } from "@/lib/server/cloudinary";

export async function GET() {
  try {
    await requireAdmin("content_manager");
    await connectDB();
    const items = await Testimonial.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}

const createSchema = z.object({
  name: z.string().trim().min(1).max(100),
  location: z.string().trim().optional(),
  locationHi: z.string().trim().optional(),
  rating: z.coerce.number().min(1).max(5),
  text: z.string().min(1).max(1000),
  textHi: z.string().optional(),
  tripName: z.string().trim().optional(),
  tripNameHi: z.string().trim().optional(),
  isVideo: z.coerce.boolean().optional(),
  isPublished: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin("content_manager");
    await connectDB();

    const formData = await request.formData();
    const raw = formData.get("data");
    if (!raw || typeof raw !== "string") throw new Error("Missing 'data' field");
    const data = createSchema.parse(JSON.parse(raw));

    let avatar = { url: "", publicId: "" };
    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile && avatarFile.size > 0) {
      assertValidImage(avatarFile);
      avatar = await uploadAvatar(await fileToBuffer(avatarFile));
    }

    const item = await Testimonial.create({ ...data, avatar });
    return created(item, "Testimonial created");
  } catch (err) {
    return fail(err);
  }
}
