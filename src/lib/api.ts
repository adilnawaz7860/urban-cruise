import type {
  TourPackage,
  BlogPost,
  GalleryImage,
  Destination,
  Testimonial,
  FaqItem,
  SiteStats,
} from "@/types";
import { connectDB } from "@/lib/server/db";
import { Package } from "@/lib/server/models/Package";
import { Blog } from "@/lib/server/models/Blog";
import { Gallery } from "@/lib/server/models/Gallery";
import { Destination as DestinationModel } from "@/lib/server/models/Destination";
import { Testimonial as TestimonialModel } from "@/lib/server/models/Testimonial";
import { Faq } from "@/lib/server/models/Faq";
import { Settings } from "@/lib/server/models/Settings";
import { parsePagination, buildSearch } from "@/lib/server/api-helpers";

// This module runs Mongoose queries directly and must only ever be imported
// from Server Components / route handlers, never from a "use client" file
// (see src/lib/forms.ts for the client-safe form-submission helpers).

// ─── Adapters ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptPackage(p: any): TourPackage {
  return {
    id: String(p._id || p.id),
    slug: String(p.slug),
    title: String(p.title),
    titleHi: String(p.titleHi || p.title),
    destination: String(p.destination),
    destinationHi: String(p.destinationHi || p.destination),
    country: String(p.country || "India"),
    durationDays: Number(p.durationDays) || 1,
    durationNights: Number(p.durationNights) || 1,
    rating: Number(p.rating) || 4.8,
    reviewCount: Number(p.reviewCount) || 0,
    price: p.discountPrice > 0 ? Number(p.discountPrice) : Number(p.price),
    originalPrice: Number(p.price) || 0,
    discountPercent: Number(p.discountPercent) || 0,
    image: p.coverImage?.url || "",
    categories: Array.isArray(p.categories) ? p.categories : [],
    featured: Boolean(p.featured),
    bestSeller: Boolean(p.bestSeller),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptBlog(b: any): BlogPost {
  return {
    id: String(b._id || b.id),
    slug: String(b.slug),
    title: String(b.title),
    titleHi: String(b.titleHi || b.title),
    excerpt: String(b.excerpt || ""),
    excerptHi: String(b.excerptHi || b.excerpt || ""),
    image: b.featuredImage?.url || "",
    category: String(b.category || "Travel Guide"),
    categoryHi: String(b.categoryHi || b.category || ""),
    date: String(b.publishedAt || b.createdAt || new Date().toISOString()),
    author: String(b.author?.name || "Urban Cruise"),
    readTime: Number(b.readTime) || 5,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptGallery(g: any): GalleryImage {
  const categoryMap: Record<string, GalleryImage["category"]> = {
    destinations: "domestic",
    tours: "domestic",
    hotels: "domestic",
    activities: "adventure",
    memories: "memories",
  };
  return {
    id: String(g._id || g.id),
    src: String(g.url || ""),
    alt: String(g.alt || g.caption || "Gallery photo"),
    altHi: String(g.altHi || g.alt || ""),
    category: categoryMap[g.category] || "domestic",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptDestination(d: any): Destination {
  return {
    id: String(d._id || d.id),
    slug: String(d.slug),
    name: String(d.name),
    nameHi: String(d.nameHi || d.name),
    country: String(d.country || "India"),
    image: d.image?.url || "",
    packageCount: Number(d.packageCount) || 0,
    startingPrice: Number(d.startingPrice) || 0,
    description: String(d.description || ""),
    descriptionHi: String(d.descriptionHi || d.description || ""),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptTestimonial(t: any): Testimonial {
  return {
    id: String(t._id || t.id),
    name: String(t.name),
    location: String(t.location || ""),
    locationHi: String(t.locationHi || t.location || ""),
    avatar: t.avatar?.url || "",
    rating: Number(t.rating) || 5,
    text: String(t.text),
    textHi: String(t.textHi || t.text),
    tripName: String(t.tripName || ""),
    tripNameHi: String(t.tripNameHi || t.tripName || ""),
    isVideo: Boolean(t.isVideo),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptFaq(f: any): FaqItem {
  return {
    question: String(f.question),
    questionHi: String(f.questionHi || f.question),
    answer: String(f.answer),
    answerHi: String(f.answerHi || f.answer),
  };
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export async function fetchFeaturedPackages(): Promise<TourPackage[]> {
  await connectDB();
  const items = await Package.find({ status: "published", featured: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  return items.map(adaptPackage);
}

export async function fetchPackages(params?: Record<string, string>): Promise<TourPackage[]> {
  await connectDB();
  const searchParams = new URLSearchParams(params);
  const { skip, sort, limit } = parsePagination(searchParams);
  const effectiveLimit = params?.limit ? limit : 100;

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

  const items = await Package.find(filter).sort(sort).skip(skip).limit(effectiveLimit).lean();
  return items.map(adaptPackage);
}

export async function fetchPackageBySlug(slug: string): Promise<TourPackage | null> {
  await connectDB();
  const pkg = await Package.findOne({ slug, status: "published" }).lean();
  return pkg ? adaptPackage(pkg) : null;
}

// ─── Blogs ────────────────────────────────────────────────────────────────────

export async function fetchBlogs(): Promise<BlogPost[]> {
  await connectDB();
  const items = await Blog.find({ status: "published" })
    .select("-content")
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return items.map(adaptBlog);
}

export async function fetchBlogBySlug(
  slug: string
): Promise<{ blog: BlogPost; related: BlogPost[] } | null> {
  await connectDB();

  const blog = await Blog.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name email avatar");
  if (!blog) return null;

  const related = await Blog.find({
    category: blog.category,
    status: "published",
    _id: { $ne: blog._id },
  })
    .select("title slug excerpt featuredImage category date publishedAt readTime")
    .limit(3)
    .lean();

  return {
    blog: adaptBlog(blog),
    related: related.map(adaptBlog),
  };
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function fetchGallery(): Promise<GalleryImage[]> {
  await connectDB();
  const items = await Gallery.find({ isActive: true }).sort({ sortOrder: 1 }).limit(50).lean();
  return items.map(adaptGallery);
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function fetchDestinations(): Promise<Destination[]> {
  await connectDB();
  const items = await DestinationModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  return items.map(adaptDestination);
}

export async function fetchDestinationBySlug(slug: string): Promise<Destination | null> {
  await connectDB();
  const destination = await DestinationModel.findOne({ slug, isActive: true }).lean();
  return destination ? adaptDestination(destination) : null;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function fetchTestimonials(): Promise<Testimonial[]> {
  await connectDB();
  const items = await TestimonialModel.find({ isPublished: true }).sort({ sortOrder: 1 }).lean();
  return items.map(adaptTestimonial);
}

// ─── FAQs ──────────────────────────────────────────────────────────────────────

export async function fetchFaqs(): Promise<FaqItem[]> {
  await connectDB();
  const items = await Faq.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  return items.map(adaptFaq);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function fetchSiteStats(): Promise<SiteStats> {
  await connectDB();
  const settings = await Settings.getSingleton();
  const stats = settings.stats;
  return {
    happyCustomers: stats?.happyCustomers ?? 0,
    toursCompleted: stats?.toursCompleted ?? 0,
    destinationsCovered: stats?.destinationsCovered ?? 0,
    yearsOfExperience: stats?.yearsOfExperience ?? 0,
  };
}
