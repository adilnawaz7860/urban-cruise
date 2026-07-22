import { connectDB } from "@/lib/server/db";
import { Testimonial } from "@/lib/server/models/Testimonial";
import { ok, fail } from "@/lib/server/api-helpers";

export async function GET() {
  try {
    await connectDB();
    const items = await Testimonial.find({ isPublished: true }).sort({ sortOrder: 1 }).lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}
