import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Newsletter } from "@/lib/server/models/Newsletter";
import { requireAdmin, paginated, fail, parsePagination } from "@/lib/server/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin("admin");
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip, sort } = parsePagination(searchParams);

    const filter: Record<string, unknown> = {};
    const active = searchParams.get("active");
    if (active === "true" || active === "false") filter.isActive = active === "true";

    const [items, total] = await Promise.all([
      Newsletter.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Newsletter.countDocuments(filter),
    ]);

    return paginated(items, { total, page, limit });
  } catch (err) {
    return fail(err);
  }
}
