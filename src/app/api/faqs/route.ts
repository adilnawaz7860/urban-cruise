import { connectDB } from "@/lib/server/db";
import { Faq } from "@/lib/server/models/Faq";
import { ok, fail } from "@/lib/server/api-helpers";

export async function GET() {
  try {
    await connectDB();
    const items = await Faq.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}
