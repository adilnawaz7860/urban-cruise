import type { TourPackage, BlogPost, GalleryImage } from "@/types";
import { packages as staticPackages } from "./data/packages";
import { blogs as staticBlogs } from "./data/blogs";
import { galleryImages as staticGallery } from "./data/gallery";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const DEFAULT_IMG = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop";
const DEFAULT_BLOG_IMG = "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1000&auto=format&fit=crop";

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: 60 },
      ...init,
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function apiPost<T = unknown>(path: string, body: unknown): Promise<{ ok: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
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
  const coverUrl = p.coverImage?.url || DEFAULT_IMG;
  const originalPrice = Number(p.price) || 0;
  const discountPrice = Number(p.discountPrice) || originalPrice;
  return {
    id: String(p._id || p.id),
    slug: String(p.slug),
    title: String(p.title),
    titleHi: String(p.title),
    destination: String(p.destination),
    destinationHi: String(p.destination),
    country: "India",
    durationDays: Number(p.durationDays) || 1,
    durationNights: Number(p.durationNights) || 1,
    rating: Number(p.rating) || 4.8,
    reviewCount: Number(p.reviewCount) || 0,
    price: discountPrice,
    originalPrice,
    discountPercent: Number(p.discountPercent) || 0,
    image: coverUrl,
    categories: Array.isArray(p.categories) ? p.categories : [],
    featured: Boolean(p.featured),
    bestSeller: Boolean(p.bestSeller),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptBlog(b: any): BlogPost {
  const image = b.featuredImage?.url || b.coverImage?.url || DEFAULT_BLOG_IMG;
  return {
    id: String(b._id || b.id),
    slug: String(b.slug),
    title: String(b.title),
    titleHi: String(b.title),
    excerpt: String(b.excerpt || b.shortDescription || ""),
    excerptHi: String(b.excerpt || b.shortDescription || ""),
    image,
    category: String(b.category || "Travel"),
    categoryHi: String(b.category || "Travel"),
    date: String(b.publishedAt || b.createdAt || new Date().toISOString()),
    author: String(b.authorName || b.author || "Urban Cruise"),
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
    altHi: String(g.alt || g.caption || ""),
    category: categoryMap[g.category] || "domestic",
  };
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export async function fetchFeaturedPackages(): Promise<TourPackage[]> {
  const res = await apiFetch<{ success: boolean; data: unknown[] }>("/packages/featured?limit=8");
  if (res?.success && Array.isArray(res.data) && res.data.length) {
    return res.data.map(adaptPackage);
  }
  return staticPackages.filter((p) => p.featured).slice(0, 8);
}

export async function fetchPackages(params?: Record<string, string>): Promise<TourPackage[]> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "?limit=100";
  const res = await apiFetch<{ success: boolean; data: unknown[] }>(`/packages${qs}`);
  if (res?.success && Array.isArray(res.data) && res.data.length) {
    return res.data.map(adaptPackage);
  }
  return staticPackages;
}

export async function fetchPackageBySlug(slug: string): Promise<TourPackage | null> {
  const res = await apiFetch<{ success: boolean; data: unknown }>(`/packages/${slug}`);
  if (res?.success && res.data) return adaptPackage(res.data);
  return staticPackages.find((p) => p.slug === slug) ?? null;
}

// ─── Blogs ────────────────────────────────────────────────────────────────────

export async function fetchBlogs(): Promise<BlogPost[]> {
  const res = await apiFetch<{ success: boolean; data: unknown[] }>("/blogs?limit=50");
  if (res?.success && Array.isArray(res.data) && res.data.length) {
    return res.data.map(adaptBlog);
  }
  return staticBlogs;
}

export async function fetchBlogBySlug(slug: string): Promise<{ blog: BlogPost; related: BlogPost[] } | null> {
  const res = await apiFetch<{ success: boolean; data: { blog: unknown; related: unknown[] } }>(`/blogs/${slug}`);
  if (res?.success && res.data?.blog) {
    return {
      blog: adaptBlog(res.data.blog),
      related: (res.data.related || []).map(adaptBlog),
    };
  }
  const staticPost = staticBlogs.find((b) => b.slug === slug);
  if (!staticPost) return null;
  return {
    blog: staticPost,
    related: staticBlogs.filter((b) => b.slug !== slug).slice(0, 2),
  };
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function fetchGallery(): Promise<GalleryImage[]> {
  const res = await apiFetch<{ success: boolean; data: unknown[] }>("/gallery?limit=50&isActive=true");
  if (res?.success && Array.isArray(res.data) && res.data.length) {
    return res.data.map(adaptGallery);
  }
  return staticGallery;
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
  return apiPost("/enquiries", data);
}

export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return apiPost("/enquiries/contact", data);
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string, name?: string) {
  return apiPost("/newsletter/subscribe", { email, name });
}

// ─── Booking track ────────────────────────────────────────────────────────────

export async function trackBooking(bookingId: string) {
  return apiFetch<{
    success: boolean;
    data: {
      bookingId: string;
      customerName: string;
      status: string;
      travelDate: string;
      destination: string;
      packageTitle: string;
    } | null;
  }>(`/bookings/track/${bookingId}`);
}
