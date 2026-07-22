import { connectDB } from "@/lib/server/db";
import { Destination } from "@/lib/server/models/Destination";
import { ok, fail } from "@/lib/server/api-helpers";

export async function GET() {
  try {
    await connectDB();
    const items = await Destination.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}
