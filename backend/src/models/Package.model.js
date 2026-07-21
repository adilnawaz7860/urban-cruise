"use strict";

const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    activities: [{ type: String, trim: true }],
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
 *       type: object
 *       required: [title, destination, price, durationDays, durationNights]
 *       properties:
 *         title: { type: string }
 *         slug: { type: string }
 *         destination: { type: string }
 *         price: { type: number }
 *         discountPrice: { type: number }
 *         status: { type: string, enum: [draft, published] }
 *         featured: { type: boolean }
 */
const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    destination: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true, maxlength: 500 },
    fullDescription: { type: String },

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
        url: { type: String },
        publicId: { type: String },
      },
    ],

    inclusions: [{ type: String, trim: true }],
    exclusions: [{ type: String, trim: true }],

    itinerary: [itineraryDaySchema],
    faqs: [faqSchema],

    categories: {
      type: [String],
      enum: ["family", "honeymoon", "group", "adventure", "domestic", "pilgrimage", "weekend"],
      default: ["domestic"],
    },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },

    status: { type: String, enum: ["draft", "published"], default: "draft" },

    seoTitle: { type: String, trim: true, maxlength: 160 },
    seoDescription: { type: String, trim: true, maxlength: 320 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
packageSchema.index({ status: 1, featured: -1 });
packageSchema.index({ destination: 1, status: 1 });
packageSchema.index({ title: "text", destination: "text", shortDescription: "text" });
packageSchema.index({ price: 1 });
packageSchema.index({ categories: 1 });

// ─── Virtual: effective price ─────────────────────────────────────────────────
packageSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

module.exports = mongoose.model("Package", packageSchema);
