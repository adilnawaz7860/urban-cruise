"use strict";

const Gallery = require("../models/Gallery.model");

class GalleryRepository {
  async create(data) {
    return Gallery.create(data);
  }

  async findAll({ filter = { isActive: true }, sort = { sortOrder: 1 }, skip = 0, limit = 50 }) {
    const [data, total] = await Promise.all([
      Gallery.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Gallery.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id) {
    return Gallery.findById(id);
  }

  async update(id, data) {
    return Gallery.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Gallery.findByIdAndDelete(id);
  }
}

module.exports = new GalleryRepository();
