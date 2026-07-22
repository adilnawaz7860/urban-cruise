import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Package } from "@/lib/server/models/Package";
import { paginated, fail, parsePagination, buildSearch } from "@/lib/server/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip, sort } = parsePagination(searchParams);

    const filter: Record<string, unknown> = { status: "published" };

    const destination = searchParams.get("destination");
    if (destination) filter.destination = new RegExp(destination, "i");

    const category = searchParams.get("category");
    if (category) filter.categories = category;

    if (searchParams.get("featured") === "true") filter.featured = true;

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filter.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    const search = searchParams.get("search");
    Object.assign(filter, buildSearch(["title", "destination", "shortDescription"], search));

    const [items, total] = await Promise.all([
      Package.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Package.countDocuments(filter),
    ]);

    return paginated(items, { total, page, limit });
  } catch (err) {
    return fail(err);
  }
}
