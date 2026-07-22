import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Package } from "@/lib/server/models/Package";
import { requireAdmin, created, fail, ApiError } from "@/lib/server/api-helpers";
import { makeUniqueSlug } from "@/lib/server/slug";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin("admin");
    const { id } = await params;
    await connectDB();

    const original = await Package.findById(id).lean();
    if (!original) throw ApiError.notFound("Package not found");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, ...rest } = original;
    const title = `${rest.title} (Copy)`;
    const slug = await makeUniqueSlug(Package, title);

    const duplicate = await Package.create({
      ...rest,
      title,
      slug,
      status: "draft",
      featured: false,
      createdBy: admin._id,
    });

    return created(duplicate, "Package duplicated");
  } catch (err) {
    return fail(err);
  }
}
