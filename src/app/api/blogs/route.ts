import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Blog } from "@/lib/server/models/Blog";
import { paginated, fail, parsePagination } from "@/lib/server/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip, sort } = parsePagination(searchParams);

    const filter: Record<string, unknown> = { status: "published" };
    const category = searchParams.get("category");
    if (category) filter.category = category;

    const search = searchParams.get("search");
    if (search) filter.$text = { $search: search };

    const [items, total] = await Promise.all([
      Blog.find(filter).select("-content").populate("author", "name").sort(sort).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    return paginated(items, { total, page, limit });
  } catch (err) {
    return fail(err);
  }
}
