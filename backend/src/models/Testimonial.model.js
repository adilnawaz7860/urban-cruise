"use strict";

const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, trim: true },
    avatar: { url: { type: String }, publicId: { type: String } },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, maxlength: 1000 },
    tripName: { type: String, trim: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ isPublished: 1, isFeatured: -1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
