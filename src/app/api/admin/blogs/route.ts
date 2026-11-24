import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Blog, BLOG_CATEGORIES } from "@/lib/server/models/Blog";
import { requireAdmin, paginated, created, fail, parsePagination, buildSearch } from "@/lib/server/api-helpers";
import { makeUniqueSlug } from "@/lib/server/slug";
import { assertValidImage, fileToBuffer, uploadBlogImage } from "@/lib/server/cloudinary";
import { revalidatePublicSite } from "@/lib/server/revalidation";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin("content_manager");
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip, sort } = parsePagination(searchParams);

    const filter: Record<string, unknown> = {};
    const status = searchParams.get("status");
    if (status && status !== "all") filter.status = status;

    const search = searchParams.get("search");
    Object.assign(filter, buildSearch(["title", "excerpt"], search));

    const [items, total] = await Promise.all([
      Blog.find(filter).populate("author", "name").sort(sort).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    return paginated(items, { total, page, limit });
  } catch (err) {
    return fail(err);
  }
}

const createBlogSchema = z.object({
  title: z.string().trim().min(5).max(300),
  titleHi: z.string().trim().optional(),
  content: z.string().min(50),
  excerpt: z.string().trim().max(500).optional(),
  excerptHi: z.string().trim().optional(),
  category: z.enum(BLOG_CATEGORIES).default("Travel Guide"),
  categoryHi: z.string().trim().optional(),
  tags: z.array(z.string().trim().toLowerCase()).default([]),
  readTime: z.coerce.number().int().min(1).default(5),
  status: z.enum(["draft", "published", "scheduled"]).default("published"),
  scheduledAt: z.coerce.date().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  seoKeywords: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin("content_manager");
    await connectDB();

    const formData = await request.formData();
    const raw = formData.get("data");
    if (!raw || typeof raw !== "string") throw new Error("Missing 'data' field");
    const data = createBlogSchema.parse(JSON.parse(raw));

    const slug = await makeUniqueSlug(Blog, data.title);

    let featuredImage = { url: "", publicId: "", alt: data.title };
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      assertValidImage(imageFile);
      const uploaded = await uploadBlogImage(await fileToBuffer(imageFile));
      featuredImage = { ...uploaded, alt: data.title };
    }

    const blog = await Blog.create({
      ...data,
      slug,
      featuredImage,
      author: admin._id,
    });

    revalidatePublicSite();
    return created(blog, "Blog post created");
  } catch (err) {
    return fail(err);
  }
}
