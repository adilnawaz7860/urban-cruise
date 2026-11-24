import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Blog, BLOG_CATEGORIES } from "@/lib/server/models/Blog";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";
import { makeUniqueSlug } from "@/lib/server/slug";
import { assertValidImage, deleteResource, fileToBuffer, uploadBlogImage } from "@/lib/server/cloudinary";
import { revalidatePublicSite } from "@/lib/server/revalidation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();
    const blog = await Blog.findById(id).populate("author", "name email");
    if (!blog) throw ApiError.notFound("Blog post not found");
    return ok(blog);
  } catch (err) {
    return fail(err);
  }
}

const updateBlogSchema = z.object({
  title: z.string().trim().min(5).max(300).optional(),
  titleHi: z.string().trim().optional(),
  content: z.string().min(50).optional(),
  excerpt: z.string().trim().max(500).optional(),
  excerptHi: z.string().trim().optional(),
  category: z.enum(BLOG_CATEGORIES).optional(),
  categoryHi: z.string().trim().optional(),
  tags: z.array(z.string().trim().toLowerCase()).optional(),
  readTime: z.coerce.number().int().min(1).optional(),
  status: z.enum(["draft", "published", "scheduled"]).optional(),
  scheduledAt: z.coerce.date().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  seoKeywords: z.array(z.string()).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) throw ApiError.notFound("Blog post not found");

    const formData = await request.formData();
    const raw = formData.get("data");
    if (!raw || typeof raw !== "string") throw new Error("Missing 'data' field");
    const data = updateBlogSchema.parse(JSON.parse(raw));

    if (data.title && data.title !== blog.title) {
      blog.slug = await makeUniqueSlug(Blog, data.title, id);
    }

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      assertValidImage(imageFile);
      if (blog.featuredImage?.publicId) await deleteResource(blog.featuredImage.publicId);
      const uploaded = await uploadBlogImage(await fileToBuffer(imageFile));
      blog.featuredImage = { ...uploaded, alt: data.title || blog.title };
    }

    Object.assign(blog, data);
    await blog.save();
    revalidatePublicSite();

    return ok(blog, "Blog post updated");
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();

    const blog = await Blog.findById(id);
    if (!blog) throw ApiError.notFound("Blog post not found");

    if (blog.featuredImage?.publicId) await deleteResource(blog.featuredImage.publicId);
    await blog.deleteOne();
    revalidatePublicSite();

    return ok(null, "Blog post deleted");
  } catch (err) {
    return fail(err);
  }
}
