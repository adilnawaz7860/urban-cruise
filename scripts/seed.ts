import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import mongoose from "mongoose";
import { Admin } from "../src/lib/server/models/Admin";
import { Settings } from "../src/lib/server/models/Settings";
import { Package } from "../src/lib/server/models/Package";
import { Blog } from "../src/lib/server/models/Blog";
import { Gallery, type GalleryCategory } from "../src/lib/server/models/Gallery";
import { Testimonial } from "../src/lib/server/models/Testimonial";
import { Destination } from "../src/lib/server/models/Destination";
import { Faq } from "../src/lib/server/models/Faq";
import { BLOG_CATEGORIES } from "../src/lib/server/models/Blog";

import { packages as staticPackages } from "../src/lib/data/packages";
import { blogs as staticBlogs } from "../src/lib/data/blogs";
import { galleryImages as staticGallery } from "../src/lib/data/gallery";
import { testimonials as staticTestimonials } from "../src/lib/data/testimonials";
import { destinations as staticDestinations } from "../src/lib/data/destinations";
import { faqs as staticFaqs } from "../src/lib/data/faqs";
import { siteConfig } from "../src/lib/config";

const GALLERY_CATEGORY_MAP: Record<string, GalleryCategory> = {
  domestic: "destinations",
  adventure: "activities",
  memories: "memories",
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (check .env.local)");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // ── Super admin ──────────────────────────────────────────────────────────
  let admin = await Admin.findOne({ email: process.env.SEED_ADMIN_EMAIL?.toLowerCase() });
  if (!admin) {
    admin = await Admin.create({
      name: process.env.SEED_ADMIN_NAME || "Super Admin",
      email: process.env.SEED_ADMIN_EMAIL || "admin@urbancruiselko.com",
      password: process.env.SEED_ADMIN_PASSWORD || "Admin@1234",
      role: "super_admin",
    });
    console.log(`Created super admin: ${admin.email}`);
  } else {
    console.log(`Super admin already exists: ${admin.email}`);
  }

  // ── Settings singleton ───────────────────────────────────────────────────
  const settings = await Settings.getSingleton();
  settings.siteName = settings.siteName || siteConfig.name;
  settings.email = settings.email || siteConfig.email;
  settings.phone = settings.phone || siteConfig.phone;
  settings.whatsapp = settings.whatsapp || siteConfig.whatsappNumber;
  settings.address = settings.address || siteConfig.address;
  settings.social = {
    facebook: settings.social?.facebook || siteConfig.social.facebook,
    instagram: settings.social?.instagram || siteConfig.social.instagram,
    youtube: settings.social?.youtube || siteConfig.social.youtube,
    twitter: settings.social?.twitter || siteConfig.social.twitter,
  };
  if (!settings.stats || settings.stats.happyCustomers === 0) {
    settings.stats = {
      happyCustomers: 15000,
      toursCompleted: 3200,
      destinationsCovered: 45,
      yearsOfExperience: 8,
    };
  }
  await settings.save();
  console.log("Settings upserted");

  // ── Packages ─────────────────────────────────────────────────────────────
  if ((await Package.countDocuments()) === 0) {
    await Package.insertMany(
      staticPackages.map((p) => ({
        title: p.title,
        titleHi: p.titleHi,
        slug: p.slug,
        destination: p.destination,
        destinationHi: p.destinationHi,
        country: p.country,
        durationDays: p.durationDays,
        durationNights: p.durationNights,
        price: p.originalPrice,
        discountPrice: p.price < p.originalPrice ? p.price : 0,
        discountPercent: p.discountPercent,
        coverImage: { url: p.image, publicId: "" },
        categories: p.categories,
        rating: p.rating,
        reviewCount: p.reviewCount,
        featured: Boolean(p.featured),
        bestSeller: Boolean(p.bestSeller),
        status: "published",
        createdBy: admin._id,
      }))
    );
    console.log(`Seeded ${staticPackages.length} packages`);
  } else {
    console.log("Packages already exist, skipping");
  }

  // ── Blogs ────────────────────────────────────────────────────────────────
  if ((await Blog.countDocuments()) === 0) {
    await Blog.insertMany(
      staticBlogs.map((b) => ({
        title: b.title,
        titleHi: b.titleHi,
        slug: b.slug,
        content: `${b.excerpt}\n\n${b.excerpt}`.padEnd(60, " "),
        excerpt: b.excerpt,
        excerptHi: b.excerptHi,
        featuredImage: { url: b.image, publicId: "", alt: b.title },
        author: admin._id,
        category: (BLOG_CATEGORIES as readonly string[]).includes(b.category) ? b.category : "Destination Spotlight",
        categoryHi: b.categoryHi,
        readTime: b.readTime,
        status: "published",
        publishedAt: new Date(b.date),
      }))
    );
    console.log(`Seeded ${staticBlogs.length} blog posts`);
  } else {
    console.log("Blogs already exist, skipping");
  }

  // ── Gallery ──────────────────────────────────────────────────────────────
  if ((await Gallery.countDocuments()) === 0) {
    await Gallery.insertMany(
      staticGallery.map((g, i) => ({
        url: g.src,
        publicId: "",
        alt: g.alt,
        altHi: g.altHi,
        category: GALLERY_CATEGORY_MAP[g.category] || "destinations",
        sortOrder: i,
        isActive: true,
      }))
    );
    console.log(`Seeded ${staticGallery.length} gallery images`);
  } else {
    console.log("Gallery already has items, skipping");
  }

  // ── Testimonials ─────────────────────────────────────────────────────────
  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(
      staticTestimonials.map((t, i) => ({
        name: t.name,
        location: t.location,
        locationHi: t.locationHi,
        avatar: { url: t.avatar, publicId: "" },
        rating: t.rating,
        text: t.text,
        textHi: t.textHi,
        tripName: t.tripName,
        tripNameHi: t.tripNameHi,
        isVideo: Boolean(t.isVideo),
        isPublished: true,
        isFeatured: i < 3,
        sortOrder: i,
      }))
    );
    console.log(`Seeded ${staticTestimonials.length} testimonials`);
  } else {
    console.log("Testimonials already exist, skipping");
  }

  // ── Destinations ─────────────────────────────────────────────────────────
  if ((await Destination.countDocuments()) === 0) {
    await Destination.insertMany(
      staticDestinations.map((d, i) => ({
        slug: d.slug,
        name: d.name,
        nameHi: d.nameHi,
        country: d.country,
        image: { url: d.image, publicId: "" },
        packageCount: d.packageCount,
        startingPrice: d.startingPrice,
        description: d.description,
        descriptionHi: d.descriptionHi,
        isActive: true,
        sortOrder: i,
      }))
    );
    console.log(`Seeded ${staticDestinations.length} destinations`);
  } else {
    console.log("Destinations already exist, skipping");
  }

  // ── FAQs ─────────────────────────────────────────────────────────────────
  if ((await Faq.countDocuments()) === 0) {
    await Faq.insertMany(
      staticFaqs.map((f, i) => ({
        question: f.question,
        questionHi: f.questionHi,
        answer: f.answer,
        answerHi: f.answerHi,
        sortOrder: i,
        isActive: true,
      }))
    );
    console.log(`Seeded ${staticFaqs.length} FAQs`);
  } else {
    console.log("FAQs already exist, skipping");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
