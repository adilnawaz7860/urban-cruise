import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Destination } from "@/lib/server/models/Destination";
import { requireAdmin, ok, created, fail } from "@/lib/server/api-helpers";
import { makeUniqueSlug } from "@/lib/server/slug";
import { assertValidImage, fileToBuffer, uploadDestinationImage } from "@/lib/server/cloudinary";

export async function GET() {
  try {
    await requireAdmin("content_manager");
    await connectDB();
    const items = await Destination.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}

const createSchema = z.object({
  name: z.string().trim().min(1).max(150),
  nameHi: z.string().trim().optional(),
  country: z.string().trim().optional(),
  packageCount: z.coerce.number().int().min(0).optional(),
  startingPrice: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  descriptionHi: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
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

    const slug = await makeUniqueSlug(Destination, data.name);

    let image = { url: "", publicId: "" };
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      assertValidImage(imageFile);
      image = await uploadDestinationImage(await fileToBuffer(imageFile));
    }

    const item = await Destination.create({ ...data, slug, image });
    return created(item, "Destination created");
  } catch (err) {
    return fail(err);
  }
}
