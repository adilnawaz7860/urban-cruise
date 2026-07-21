"use strict";

const { z } = require("zod");

const itineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1).max(200).trim(),
  description: z.string().min(1),
  activities: z.array(z.string().trim()).optional().default([]),
});

const faqSchema = z.object({
  question: z.string().min(1).max(500).trim(),
  answer: z.string().min(1).trim(),
});

const createPackageSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  destination: z.string().min(1).max(100).trim(),
  shortDescription: z.string().max(500).trim().optional(),
  fullDescription: z.string().optional(),
  durationDays: z.coerce.number().int().positive(),
  durationNights: z.coerce.number().int().min(0),
  price: z.coerce.number().positive(),
  discountPrice: z.coerce.number().min(0).optional().default(0),
  inclusions: z.array(z.string().trim()).optional().default([]),
  exclusions: z.array(z.string().trim()).optional().default([]),
  itinerary: z.array(itineraryDaySchema).optional().default([]),
  faqs: z.array(faqSchema).optional().default([]),
  categories: z
    .array(z.enum(["family", "honeymoon", "group", "adventure", "domestic", "pilgrimage", "weekend"]))
    .optional()
    .default(["domestic"]),
  featured: z.boolean().optional().default(false),
  bestSeller: z.boolean().optional().default(false),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  seoTitle: z.string().max(160).trim().optional(),
  seoDescription: z.string().max(320).trim().optional(),
});

const updatePackageSchema = createPackageSchema.partial();

const packageQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().trim().optional(),
  destination: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(["draft", "published", "all"]).optional().default("published"),
  featured: z.enum(["true", "false"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.string().optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

module.exports = { createPackageSchema, updatePackageSchema, packageQuerySchema };
