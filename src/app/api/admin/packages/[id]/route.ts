import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Package, PACKAGE_CATEGORIES } from "@/lib/server/models/Package";
import { requireAdmin, ok, fail, ApiError } from "@/lib/server/api-helpers";
import { makeUniqueSlug } from "@/lib/server/slug";
import { assertValidImage, deleteResource, fileToBuffer, uploadPackageImage } from "@/lib/server/cloudinary";
import { revalidatePublicSite } from "@/lib/server/revalidation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("content_manager");
    const { id } = await params;
    await connectDB();
    const pkg = await Package.findById(id);
    if (!pkg) throw ApiError.notFound("Package not found");
    return ok(pkg);
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

const updatePackageSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  titleHi: z.string().trim().optional(),
  destination: z.string().trim().min(1).max(100).optional(),
  destinationHi: z.string().trim().optional(),
  country: z.string().trim().optional(),
  shortDescription: z.string().trim().max(500).optional(),
  fullDescription: z.string().optional(),
  durationDays: z.coerce.number().int().min(1).optional(),
  durationNights: z.coerce.number().int().min(0).optional(),
  price: z.coerce.number().min(0).optional(),
  discountPrice: z.coerce.number().min(0).optional(),
  inclusions: z.array(z.string().trim()).optional(),
  exclusions: z.array(z.string().trim()).optional(),
  itinerary: z.array(itineraryDaySchema).optional(),
  faqs: z.array(faqSchema).optional(),
  categories: z.array(z.enum(PACKAGE_CATEGORIES)).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
  bestSeller: z.coerce.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("admin");
    const { id } = await params;
    await connectDB();

    const pkg = await Package.findById(id);
    if (!pkg) throw ApiError.notFound("Package not found");

    const formData = await request.formData();
    const raw = formData.get("data");
    if (!raw || typeof raw !== "string") throw new Error("Missing 'data' field");
    const data = updatePackageSchema.parse(JSON.parse(raw));

    if (data.title && data.title !== pkg.title) {
      pkg.slug = await makeUniqueSlug(Package, data.title, id);
    }

    const coverFile = formData.get("cover") as File | null;
    if (coverFile && coverFile.size > 0) {
      assertValidImage(coverFile);
      if (pkg.coverImage?.publicId) await deleteResource(pkg.coverImage.publicId);
      pkg.coverImage = await uploadPackageImage(await fileToBuffer(coverFile));
    }

    const galleryFiles = formData.getAll("gallery") as File[];
    for (const file of galleryFiles) {
      if (file.size === 0) continue;
      assertValidImage(file);
      pkg.galleryImages.push(await uploadPackageImage(await fileToBuffer(file)));
    }

    Object.assign(pkg, data);

    const newPrice = data.price ?? pkg.price;
    const newDiscountPrice = data.discountPrice ?? pkg.discountPrice;
    if (newDiscountPrice > 0) {
      pkg.discountPercent = Math.round(((newPrice - newDiscountPrice) / newPrice) * 100);
    } else if (data.discountPrice === 0) {
      pkg.discountPercent = 0;
    }

    await pkg.save();
    revalidatePublicSite();
    return ok(pkg, "Package updated");
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin("admin");
    const { id } = await params;
    await connectDB();

    const pkg = await Package.findById(id);
    if (!pkg) throw ApiError.notFound("Package not found");

    if (pkg.coverImage?.publicId) await deleteResource(pkg.coverImage.publicId);
    for (const img of pkg.galleryImages) {
      if (img.publicId) await deleteResource(img.publicId);
    }

    await pkg.deleteOne();
    revalidatePublicSite();
    return ok(null, "Package deleted");
  } catch (err) {
    return fail(err);
  }
}
