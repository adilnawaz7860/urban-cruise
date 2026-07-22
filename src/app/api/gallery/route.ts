import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Gallery } from "@/lib/server/models/Gallery";
import { ok, fail } from "@/lib/server/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const category = request.nextUrl.searchParams.get("category");
    const limit = Number(request.nextUrl.searchParams.get("limit")) || 50;

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;

    const items = await Gallery.find(filter).sort({ sortOrder: 1 }).limit(limit).lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}
