"use strict";

const { z } = require("zod");

const createBlogSchema = z.object({
  title: z.string().min(5).max(300).trim(),
  content: z.string().min(50),
  excerpt: z.string().max(500).trim().optional(),
  category: z
    .enum([
      "Travel Guide",
      "Pilgrimage",
      "Adventure",
      "Budget Travel",
      "Honeymoon",
      "Family Travel",
      "Tips & Tricks",
      "Destination Spotlight",
    ])
    .optional()
    .default("Travel Guide"),
  tags: z.array(z.string().trim().toLowerCase()).optional().default([]),
  status: z.enum(["draft", "published", "scheduled"]).optional().default("draft"),
  scheduledAt: z.coerce.date().optional(),
  seoTitle: z.string().max(160).trim().optional(),
  seoDescription: z.string().max(320).trim().optional(),
  seoKeywords: z.array(z.string().trim()).optional().default([]),
  readTime: z.coerce.number().int().positive().optional().default(5),
});

const updateBlogSchema = createBlogSchema.partial();

const blogQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  status: z.enum(["draft", "published", "all"]).optional().default("published"),
  sortBy: z.string().optional().default("publishedAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

module.exports = { createBlogSchema, updateBlogSchema, blogQuerySchema };
