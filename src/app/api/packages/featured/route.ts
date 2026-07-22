import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Package } from "@/lib/server/models/Package";
import { ok, fail } from "@/lib/server/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const limit = Number(request.nextUrl.searchParams.get("limit")) || 4;
    const items = await Package.find({ status: "published", featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return ok(items);
  } catch (err) {
    return fail(err);
  }
}
