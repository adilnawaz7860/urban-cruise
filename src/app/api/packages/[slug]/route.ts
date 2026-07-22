import { connectDB } from "@/lib/server/db";
import { Package } from "@/lib/server/models/Package";
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectDB();
    const pkg = await Package.findOne({ slug, status: "published" }).lean();
    if (!pkg) throw ApiError.notFound("Package not found");
    return ok(pkg);
  } catch (err) {
    return fail(err);
  }
}
