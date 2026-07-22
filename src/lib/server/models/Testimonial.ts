import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface TestimonialDoc extends Document {
  name: string;
  location: string;
  locationHi: string;
  avatar: { url: string; publicId: string };
  rating: number;
  text: string;
  textHi: string;
  tripName: string;
  tripNameHi: string;
  isVideo: boolean;
  package?: Types.ObjectId;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<TestimonialDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, trim: true, default: "" },
    locationHi: { type: String, trim: true, default: "" },
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, maxlength: 1000 },
    textHi: { type: String, default: "" },
    tripName: { type: String, trim: true, default: "" },
    tripNameHi: { type: String, trim: true, default: "" },
    isVideo: { type: Boolean, default: false },
    package: { type: Schema.Types.ObjectId, ref: "Package" },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ isPublished: 1, isFeatured: -1 });

export const Testimonial: Model<TestimonialDoc> =
  mongoose.models.Testimonial ||
  mongoose.model<TestimonialDoc>("Testimonial", TestimonialSchema);
