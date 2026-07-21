"use strict";

const Blog = require("../models/Blog.model");

class BlogRepository {
  async create(data) {
    return Blog.create(data);
  }

  async findById(id) {
    return Blog.findById(id).populate("author", "name email avatar");
  }

  async findBySlug(slug) {
    return Blog.findOne({ slug }).populate("author", "name email avatar");
  }

  async findAll({ filter = {}, sort = { publishedAt: -1 }, skip = 0, limit = 12 }) {
    const [data, total] = await Promise.all([
      Blog.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-content")
        .populate("author", "name")
        .lean(),
      Blog.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findRelated(blogId, category, limit = 3) {
    return Blog.find({ _id: { $ne: blogId }, category, status: "published" })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select("title slug featuredImage category readTime publishedAt")
      .lean();
  }

  async update(id, data) {
    return Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Blog.findByIdAndDelete(id);
  }

  async incrementViews(id) {
    return Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  async slugExists(slug, excludeId = null) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    return !!(await Blog.exists(query));
  }
}

module.exports = new BlogRepository();
