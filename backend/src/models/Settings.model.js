"use strict";

const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },

    // Company
    siteName: { type: String, default: "Urban Cruise" },
    tagline: { type: String, default: "Lucknow's Most Trusted Travel Agency" },
    email: { type: String, default: "info@urbancruiselko.com" },
    phone: { type: String, default: "+91 92609 94765" },
    whatsapp: { type: String, default: "919260994765" },
    address: { type: String },

    // Branding
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    favicon: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    // Social
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    // SEO defaults
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],

    // Google
    googleAnalyticsId: { type: String },
    googleMapsApiKey: { type: String },

    // Maintenance
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

// Singleton — there's only ever one settings document
settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: "global" });
  if (!doc) {
    doc = await this.create({ key: "global" });
  }
  return doc;
};

module.exports = mongoose.model("Settings", settingsSchema);
