"use strict";

const Settings = require("../models/Settings.model");
const Testimonial = require("../models/Testimonial.model");

class SettingsRepository {
  async get() {
    return Settings.getSingleton();
  }

  async update(data) {
    const settings = await Settings.getSingleton();
    Object.assign(settings, data);
    return settings.save();
  }

  // Testimonials
  async createTestimonial(data) {
    return Testimonial.create(data);
  }

  async findTestimonials({ filter = {}, sort = { sortOrder: 1 }, skip = 0, limit = 20 }) {
    const [data, total] = await Promise.all([
      Testimonial.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Testimonial.countDocuments(filter),
    ]);
    return { data, total };
  }

  async updateTestimonial(id, data) {
    return Testimonial.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTestimonial(id) {
    return Testimonial.findByIdAndDelete(id);
  }
}

module.exports = new SettingsRepository();
