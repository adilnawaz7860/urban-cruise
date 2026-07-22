import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Enquiry } from "@/lib/server/models/Enquiry";
import { requireAdmin, paginated, fail, parsePagination, buildSearch } from "@/lib/server/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin("admin");
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip, sort } = parsePagination(searchParams);

    const filter: Record<string, unknown> = {};
    const status = searchParams.get("status");
    if (status && status !== "all") filter.status = status;

    const search = searchParams.get("search");
    Object.assign(filter, buildSearch(["name", "email", "phone"], search));

    const [items, total] = await Promise.all([
      Enquiry.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Enquiry.countDocuments(filter),
    ]);

    return paginated(items, { total, page, limit });
  } catch (err) {
    return fail(err);
  }
}
