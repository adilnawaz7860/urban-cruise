import { connectDB } from "@/lib/server/db";
import { Destination } from "@/lib/server/models/Destination";
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectDB();
    const destination = await Destination.findOne({ slug, isActive: true }).lean();
    if (!destination) throw ApiError.notFound("Destination not found");
    return ok(destination);
  } catch (err) {
    return fail(err);
  }
}
