"use strict";

const Coupon = require("../models/Coupon.model");

class CouponRepository {
  async create(data) {
    return Coupon.create(data);
  }

  async findByCode(code) {
    return Coupon.findOne({ code: code.toUpperCase() });
  }

  async findById(id) {
    return Coupon.findById(id);
  }

  async findAll({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 }) {
    const [data, total] = await Promise.all([
      Coupon.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(filter),
    ]);
    return { data, total };
  }

  async update(id, data) {
    return Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async incrementUsage(code) {
    return Coupon.findOneAndUpdate({ code }, { $inc: { usedCount: 1 } });
  }

  async delete(id) {
    return Coupon.findByIdAndDelete(id);
  }
}

module.exports = new CouponRepository();
