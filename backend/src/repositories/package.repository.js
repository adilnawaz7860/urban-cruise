"use strict";

const Package = require("../models/Package.model");

class PackageRepository {
  async create(data) {
    return Package.create(data);
  }

  async findById(id) {
    return Package.findById(id);
  }

  async findBySlug(slug) {
    return Package.findOne({ slug });
  }

  async findAll({ filter = {}, sort = {}, skip = 0, limit = 20 }) {
    const [data, total] = await Promise.all([
      Package.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Package.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findFeatured(limit = 4) {
    return Package.find({ status: "published", featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async update(id, data) {
    return Package.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Package.findByIdAndDelete(id);
  }

  async duplicate(id) {
    const pkg = await Package.findById(id).lean();
    if (!pkg) return null;
    delete pkg._id;
    delete pkg.createdAt;
    delete pkg.updatedAt;
    pkg.title = `${pkg.title} (Copy)`;
    pkg.slug = `${pkg.slug}-copy-${Date.now()}`;
    pkg.status = "draft";
    pkg.featured = false;
    return Package.create(pkg);
  }

  async slugExists(slug, excludeId = null) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    return !!(await Package.exists(query));
  }
}

module.exports = new PackageRepository();
