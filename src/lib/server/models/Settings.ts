import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface SettingsDoc extends Document {
  key: string;
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  logo: { url: string; publicId: string };
  favicon: { url: string; publicId: string };
  social: { facebook: string; instagram: string; youtube: string; twitter: string };
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  googleAnalyticsId?: string;
  googleMapsApiKey?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  stats: {
    happyCustomers: number;
    toursCompleted: number;
    destinationsCovered: number;
    yearsOfExperience: number;
  };
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<SettingsDoc>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    siteName: { type: String, default: "Urban Cruise" },
    tagline: { type: String, default: "Lucknow's Most Trusted Travel Agency" },
    email: { type: String, default: "info@urbancruiselko.com" },
    phone: { type: String, default: "+91 92609 94765" },
    whatsapp: { type: String, default: "919260994765" },
    address: { type: String, default: "" },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    favicon: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    googleAnalyticsId: String,
    googleMapsApiKey: String,
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: String,
    stats: {
      happyCustomers: { type: Number, default: 0 },
      toursCompleted: { type: Number, default: 0 },
      destinationsCovered: { type: Number, default: 0 },
      yearsOfExperience: { type: Number, default: 0 },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

SettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: "global" });
  if (!doc) doc = await this.create({ key: "global" });
  return doc;
};

interface SettingsModel extends Model<SettingsDoc> {
  getSingleton(): Promise<SettingsDoc>;
}

export const Settings: SettingsModel =
  (mongoose.models.Settings as SettingsModel) ||
  mongoose.model<SettingsDoc, SettingsModel>("Settings", SettingsSchema);
