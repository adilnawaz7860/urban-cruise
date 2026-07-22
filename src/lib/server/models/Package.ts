import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export const PACKAGE_CATEGORIES = [
  "family",
  "honeymoon",
  "group",
  "adventure",
  "domestic",
  "pilgrimage",
  "weekend",
] as const;
export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

interface PackageFaq {
  question: string;
  answer: string;
}

export interface PackageDoc extends Document {
  title: string;
  titleHi: string;
  slug: string;
  destination: string;
  destinationHi: string;
  country: string;
  shortDescription: string;
  fullDescription: string;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice: number;
  discountPercent: number;
  coverImage: { url: string; publicId: string };
  galleryImages: { url: string; publicId: string }[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  faqs: PackageFaq[];
  categories: PackageCategory[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItineraryDaySchema = new Schema<ItineraryDay>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    activities: [{ type: String, trim: true }],
  },
  { _id: false }
);

const FaqSchema = new Schema<PackageFaq>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PackageSchema = new Schema<PackageDoc>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    titleHi: { type: String, trim: true, default: "" },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    destination: { type: String, required: true, trim: true },
    destinationHi: { type: String, trim: true, default: "" },
    country: { type: String, default: "India" },
    shortDescription: { type: String, trim: true, maxlength: 500 },
    fullDescription: { type: String, default: "" },
    durationDays: { type: Number, required: true, min: 1 },
    durationNights: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    galleryImages: [
      {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
      },
    ],
    inclusions: [{ type: String, trim: true }],
    exclusions: [{ type: String, trim: true }],
    itinerary: [ItineraryDaySchema],
    faqs: [FaqSchema],
    categories: {
      type: [{ type: String, enum: PACKAGE_CATEGORIES }],
      default: ["domestic"],
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seoTitle: { type: String, maxlength: 160 },
    seoDescription: { type: String, maxlength: 320 },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

PackageSchema.index({ status: 1, featured: -1 });
PackageSchema.index({ destination: 1, status: 1 });
PackageSchema.index({ title: "text", destination: "text", shortDescription: "text" });
PackageSchema.index({ price: 1 });
PackageSchema.index({ categories: 1 });

export const Package: Model<PackageDoc> =
  mongoose.models.Package || mongoose.model<PackageDoc>("Package", PackageSchema);
