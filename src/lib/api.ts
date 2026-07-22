import type {
  TourPackage,
  BlogPost,
  GalleryImage,
  Destination,
  Testimonial,
  FaqItem,
  SiteStats,
} from "@/types";

function apiUrl(path: string) {
  if (typeof window !== "undefined") return path;
  const base = process.env.SITE_URL || "http://localhost:3000";
  return `${base}${path}`;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(apiUrl(path), {
      next: { revalidate: 60 },
      ...init,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<{ ok: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = await res.json();
    return { ok: res.ok, data: json.data, message: json.message };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptPackage(p: any): TourPackage {
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
  const res = await apiFetch<unknown[]>("/api/packages/featured?limit=8");
  return (res || []).map(adaptPackage);
}

export async function fetchPackages(params?: Record<string, string>): Promise<TourPackage[]> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "?limit=100";
  const res = await apiFetch<unknown[]>(`/api/packages${qs}`);
  return (res || []).map(adaptPackage);
}

export async function fetchPackageBySlug(slug: string): Promise<TourPackage | null> {
  const res = await apiFetch<unknown>(`/api/packages/${slug}`);
  return res ? adaptPackage(res) : null;
}

// ─── Blogs ────────────────────────────────────────────────────────────────────

export async function fetchBlogs(): Promise<BlogPost[]> {
  const res = await apiFetch<unknown[]>("/api/blogs?limit=50");
  return (res || []).map(adaptBlog);
}

export async function fetchBlogBySlug(
  slug: string
): Promise<{ blog: BlogPost; related: BlogPost[] } | null> {
  const res = await apiFetch<{ blog: unknown; related: unknown[] }>(`/api/blogs/${slug}`);
  if (!res?.blog) return null;
  return {
    blog: adaptBlog(res.blog),
    related: (res.related || []).map(adaptBlog),
  };
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function fetchGallery(): Promise<GalleryImage[]> {
  const res = await apiFetch<unknown[]>("/api/gallery?limit=50");
  return (res || []).map(adaptGallery);
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function fetchDestinations(): Promise<Destination[]> {
  const res = await apiFetch<unknown[]>("/api/destinations");
  return (res || []).map(adaptDestination);
}

export async function fetchDestinationBySlug(slug: string): Promise<Destination | null> {
  const res = await apiFetch<unknown>(`/api/destinations/${slug}`);
  return res ? adaptDestination(res) : null;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await apiFetch<unknown[]>("/api/testimonials");
  return (res || []).map(adaptTestimonial);
}

// ─── FAQs ──────────────────────────────────────────────────────────────────────

export async function fetchFaqs(): Promise<FaqItem[]> {
  const res = await apiFetch<unknown[]>("/api/faqs");
  return (res || []).map(adaptFaq);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function fetchSiteStats(): Promise<SiteStats> {
  const res = await apiFetch<{ stats?: SiteStats }>("/api/settings");
  return (
    res?.stats || { happyCustomers: 0, toursCompleted: 0, destinationsCovered: 0, yearsOfExperience: 0 }
  );
}

// ─── Enquiry / Contact ────────────────────────────────────────────────────────

export async function submitEnquiry(data: {
  name: string;
  email: string;
  phone: string;
  destination?: string;
  travelDate?: string;
  travelers?: number;
  message?: string;
}) {
  return apiPost("/api/enquiries", data);
}

export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return apiPost("/api/contact", data);
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string, name?: string) {
  return apiPost("/api/newsletter/subscribe", { email, name });
}
