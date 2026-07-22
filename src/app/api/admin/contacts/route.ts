import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Contact } from "@/lib/server/models/Contact";
import { requireAdmin, paginated, fail, parsePagination } from "@/lib/server/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin("admin");
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip, sort } = parsePagination(searchParams);

    const filter: Record<string, unknown> = {};
    const isRead = searchParams.get("isRead");
    if (isRead === "true" || isRead === "false") filter.isRead = isRead === "true";

    const [items, total] = await Promise.all([
      Contact.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Contact.countDocuments(filter),
    ]);

    return paginated(items, { total, page, limit });
  } catch (err) {
    return fail(err);
  }
}
