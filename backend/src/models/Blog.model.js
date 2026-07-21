"use strict";

const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, trim: true, maxlength: 500 },

    featuredImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      alt: { type: String, default: "" },
    },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    authorName: { type: String, trim: true },

    category: {
      type: String,
      trim: true,
      enum: [
        "Travel Guide",
        "Pilgrimage",
        "Adventure",
        "Budget Travel",
        "Honeymoon",
        "Family Travel",
        "Tips & Tricks",
        "Destination Spotlight",
      ],
      default: "Travel Guide",
    },
    tags: [{ type: String, trim: true, lowercase: true }],

    readTime: { type: Number, default: 5 },
    views: { type: Number, default: 0 },

    status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
    publishedAt: { type: Date },
    scheduledAt: { type: Date },

    seoTitle: { type: String, trim: true, maxlength: 160 },
    seoDescription: { type: String, trim: true, maxlength: 320 },
    seoKeywords: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: "text", content: "text", tags: "text" });

// Auto-set publishedAt when status goes to published
blogSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
