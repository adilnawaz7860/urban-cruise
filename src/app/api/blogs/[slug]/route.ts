import { connectDB } from "@/lib/server/db";
import { Blog } from "@/lib/server/models/Blog";
import { ok, fail, ApiError } from "@/lib/server/api-helpers";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectDB();

    const blog = await Blog.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name email avatar");
    if (!blog) throw ApiError.notFound("Blog post not found");

    const related = await Blog.find({
      category: blog.category,
      status: "published",
      _id: { $ne: blog._id },
    })
      .select("title slug excerpt featuredImage category date publishedAt readTime")
      .limit(3)
      .lean();

    return ok({ blog, related });
  } catch (err) {
    return fail(err);
  }
}
