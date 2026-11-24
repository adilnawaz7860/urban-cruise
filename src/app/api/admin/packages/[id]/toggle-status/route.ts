import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Package } from "@/lib/server/models/Package";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";
import { revalidatePublicSite } from "@/lib/server/revalidation";

export async function PATCH(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("admin");
    const { id } = await params;
    await connectDB();

    const pkg = await Package.findById(id);
    if (!pkg) throw ApiError.notFound("Package not found");

    pkg.status = pkg.status === "published" ? "draft" : "published";
    await pkg.save();
    revalidatePublicSite();

    return ok(pkg, `Package ${pkg.status === "published" ? "published" : "unpublished"}`);
  } catch (err) {
    return fail(err);
  }
}
