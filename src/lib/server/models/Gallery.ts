import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export const GALLERY_CATEGORIES = [
  "destinations",
  "tours",
  "hotels",
  "activities",
  "memories",
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface GalleryDoc extends Document {
  url: string;
  publicId: string;
  alt: string;
  altHi: string;
  category: GalleryCategory;
  caption: string;
  sortOrder: number;
  isActive: boolean;
  uploadedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<GalleryDoc>(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    alt: { type: String, trim: true, default: "" },
    altHi: { type: String, trim: true, default: "" },
    category: { type: String, enum: GALLERY_CATEGORIES, default: "destinations" },
    caption: { type: String, trim: true, maxlength: 200 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

GallerySchema.index({ category: 1, sortOrder: 1 });
GallerySchema.index({ isActive: 1 });

export const Gallery: Model<GalleryDoc> =
  mongoose.models.Gallery || mongoose.model<GalleryDoc>("Gallery", GallerySchema);
