import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Package, PACKAGE_CATEGORIES } from "@/lib/server/models/Package";
import { requireAdmin, paginated, created, fail, parsePagination, buildSearch } from "@/lib/server/api-helpers";
import { makeUniqueSlug } from "@/lib/server/slug";
import { assertValidImage, fileToBuffer, uploadPackageImage } from "@/lib/server/cloudinary";

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

const itineraryDaySchema = z.object({
  day: z.coerce.number().int(),
  title: z.string().trim().min(1),
  description: z.string().min(1),
  activities: z.array(z.string().trim()).default([]),
});

const faqSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

const createPackageSchema = z.object({
  title: z.string().trim().min(3).max(200),
  titleHi: z.string().trim().optional(),
  destination: z.string().trim().min(1).max(100),
  destinationHi: z.string().trim().optional(),
  country: z.string().trim().optional(),
  shortDescription: z.string().trim().max(500).optional(),
  fullDescription: z.string().optional(),
  durationDays: z.coerce.number().int().min(1),
  durationNights: z.coerce.number().int().min(0),
  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().min(0).optional(),
  inclusions: z.array(z.string().trim()).default([]),
  exclusions: z.array(z.string().trim()).default([]),
  itinerary: z.array(itineraryDaySchema).default([]),
  faqs: z.array(faqSchema).default([]),
  categories: z.array(z.enum(PACKAGE_CATEGORIES)).default(["domestic"]),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
  bestSeller: z.coerce.boolean().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin("admin");
    await connectDB();

    const formData = await request.formData();
    const raw = formData.get("data");
    if (!raw || typeof raw !== "string") throw new Error("Missing 'data' field");
    const data = createPackageSchema.parse(JSON.parse(raw));

    const slug = await makeUniqueSlug(Package, data.title);

    const discountPercent =
      data.discountPrice && data.discountPrice > 0
        ? Math.round(((data.price - data.discountPrice) / data.price) * 100)
        : 0;

    const coverFile = formData.get("cover") as File | null;
    const galleryFiles = formData.getAll("gallery") as File[];

    let coverImage = { url: "", publicId: "" };
    if (coverFile && coverFile.size > 0) {
      assertValidImage(coverFile);
      coverImage = await uploadPackageImage(await fileToBuffer(coverFile));
    }

    const galleryImages = [];
    for (const file of galleryFiles) {
      if (file.size === 0) continue;
      assertValidImage(file);
      galleryImages.push(await uploadPackageImage(await fileToBuffer(file)));
    }

    const pkg = await Package.create({
      ...data,
      slug,
      discountPercent,
      coverImage,
      galleryImages,
      createdBy: admin._id,
    });

    return created(pkg, "Package created");
  } catch (err) {
    return fail(err);
  }
}
