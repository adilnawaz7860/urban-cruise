import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export const BLOG_CATEGORIES = [
  "Travel Guide",
  "Pilgrimage",
  "Adventure",
  "Budget Travel",
  "Honeymoon",
  "Family Travel",
  "Tips & Tricks",
  "Destination Spotlight",
] as const;

export interface BlogDoc extends Document {
  title: string;
  titleHi: string;
  slug: string;
  content: string;
  excerpt: string;
  excerptHi: string;
  featuredImage: { url: string; publicId: string; alt: string };
  author: Types.ObjectId;
  category: string;
  categoryHi: string;
  tags: string[];
  readTime: number;
  views: number;
  status: "draft" | "published" | "scheduled";
  publishedAt?: Date;
  scheduledAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<BlogDoc>(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    titleHi: { type: String, trim: true, default: "" },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, trim: true, maxlength: 500 },
    excerptHi: { type: String, trim: true, default: "" },
    featuredImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    author: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    category: { type: String, enum: BLOG_CATEGORIES, default: "Travel Guide" },
    categoryHi: { type: String, trim: true, default: "" },
    tags: [{ type: String, trim: true, lowercase: true }],
    readTime: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
    publishedAt: Date,
    scheduledAt: Date,
    seoTitle: { type: String, maxlength: 160 },
    seoDescription: { type: String, maxlength: 320 },
    seoKeywords: [String],
  },
  { timestamps: true }
);

BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ title: "text", content: "text", tags: "text" });

BlogSchema.pre("save", function () {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export const Blog: Model<BlogDoc> =
  mongoose.models.Blog || mongoose.model<BlogDoc>("Blog", BlogSchema);
