"use strict";

const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, trim: true, default: "" },
    category: {
      type: String,
      enum: ["destinations", "tours", "hotels", "activities", "memories"],
      default: "destinations",
    },
    caption: { type: String, trim: true, maxlength: 200 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1, sortOrder: 1 });
gallerySchema.index({ isActive: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);
