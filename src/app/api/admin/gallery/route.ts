import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Gallery, GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/server/models/Gallery";
import { requireAdmin, ok, created, fail, ApiError } from "@/lib/server/api-helpers";
import { assertValidImage, fileToBuffer, uploadGalleryImage } from "@/lib/server/cloudinary";
import { revalidatePublicSite } from "@/lib/server/revalidation";

export async function GET() {
  try {
    await requireAdmin("content_manager");
    await connectDB();
    const items = await Gallery.find({}).sort({ createdAt: -1 }).lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin("content_manager");
    await connectDB();

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    if (files.length === 0 || files.every((f) => f.size === 0)) {
      throw ApiError.badRequest("At least one image is required");
    }
    if (files.length > 20) throw ApiError.badRequest("Maximum 20 images per upload");

    const rawCategory = (formData.get("category") as string) || "destinations";
    if (!GALLERY_CATEGORIES.includes(rawCategory as GalleryCategory)) {
      throw ApiError.badRequest("Invalid category");
    }
    const category = rawCategory as GalleryCategory;
    const alts = JSON.parse((formData.get("alts") as string) || "[]") as string[];
    const captions = JSON.parse((formData.get("captions") as string) || "[]") as string[];

    const created_: unknown[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size === 0) continue;
      assertValidImage(file);
      const uploaded = await uploadGalleryImage(await fileToBuffer(file));
      const item = await Gallery.create({
        ...uploaded,
        category,
        alt: alts[i] || "",
        caption: captions[i] || "",
        uploadedBy: admin._id,
      });
      created_.push(item);
    }

    revalidatePublicSite();
    return created(created_, "Images uploaded");
  } catch (err) {
    return fail(err);
  }
}
