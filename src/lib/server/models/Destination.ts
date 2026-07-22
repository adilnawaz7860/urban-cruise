import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface DestinationDoc extends Document {
  slug: string;
  name: string;
  nameHi: string;
  country: string;
  image: { url: string; publicId: string };
  packageCount: number;
  startingPrice: number;
  description: string;
  descriptionHi: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<DestinationDoc>(
  {
    slug: { type: String, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 150 },
    nameHi: { type: String, trim: true, default: "" },
    country: { type: String, default: "India" },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    packageCount: { type: Number, default: 0 },
    startingPrice: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "" },
    descriptionHi: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DestinationSchema.index({ isActive: 1, sortOrder: 1 });

export const Destination: Model<DestinationDoc> =
  mongoose.models.Destination ||
  mongoose.model<DestinationDoc>("Destination", DestinationSchema);
