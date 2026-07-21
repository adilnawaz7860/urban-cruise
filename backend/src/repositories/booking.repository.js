"use strict";

const Booking = require("../models/Booking.model");

class BookingRepository {
  async create(data) {
    return Booking.create(data);
  }

  async findById(id) {
    return Booking.findById(id).populate("package", "title destination coverImage price").populate("assignedTo", "name email");
  }

  async findByBookingId(bookingId) {
    return Booking.findOne({ bookingId }).populate("package", "title destination coverImage price");
  }

  async findAll({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 }) {
    const [data, total] = await Promise.all([
      Booking.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("package", "title destination coverImage price")
        .lean(),
      Booking.countDocuments(filter),
    ]);
    return { data, total };
  }

  async update(id, data) {
    return Booking.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  // Revenue stats
  async revenueByMonth(year) {
    return Booking.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "completed"] },
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async countByStatus() {
    return Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
  }

  async totalRevenue() {
    const result = await Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    return result[0]?.total || 0;
  }
}

module.exports = new BookingRepository();
