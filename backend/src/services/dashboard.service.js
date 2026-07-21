"use strict";

const Package = require("../models/Package.model");
const Booking = require("../models/Booking.model");
const Enquiry = require("../models/Enquiry.model");
const Blog = require("../models/Blog.model");
const Newsletter = require("../models/Newsletter.model");
const cache = require("../config/redis");

async function getStats() {
  const cacheKey = "dashboard:stats";
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const [
    totalPackages,
    publishedPackages,
    totalBookings,
    pendingBookings,
    totalEnquiries,
    unreadEnquiries,
    totalBlogs,
    publishedBlogs,
    totalSubscribers,
    revenueData,
  ] = await Promise.all([
    Package.countDocuments(),
    Package.countDocuments({ status: "published" }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ isRead: false }),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Newsletter.countDocuments({ isActive: true }),
    Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const totalRevenue = revenueData[0]?.total || 0;

  const stats = {
    packages: { total: totalPackages, published: publishedPackages },
    bookings: { total: totalBookings, pending: pendingBookings },
    enquiries: { total: totalEnquiries, unread: unreadEnquiries },
    blogs: { total: totalBlogs, published: publishedBlogs },
    subscribers: totalSubscribers,
    revenue: totalRevenue,
  };

  await cache.set(cacheKey, stats, 120); // cache 2 min
  return stats;
}

async function getMonthlyCharts(year = new Date().getFullYear()) {
  const cacheKey = `dashboard:charts:${year}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const [bookingsByMonth, revenueByMonth, packagePopularity] = await Promise.all([
    Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
        },
      },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Booking.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "completed"] },
          createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
        },
      },
      { $group: { _id: { $month: "$createdAt" }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { _id: 1 } },
    ]),
    Booking.aggregate([
      { $group: { _id: "$package", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "packages",
          localField: "_id",
          foreignField: "_id",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $project: { title: "$pkg.title", destination: "$pkg.destination", count: 1 } },
    ]),
  ]);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const bookingsChart = months.map((m, i) => ({
    month: m,
    bookings: bookingsByMonth.find((b) => b._id === i + 1)?.count || 0,
  }));
  const revenueChart = months.map((m, i) => ({
    month: m,
    revenue: revenueByMonth.find((r) => r._id === i + 1)?.revenue || 0,
  }));

  const charts = { bookingsChart, revenueChart, packagePopularity };
  await cache.set(cacheKey, charts, 300);
  return charts;
}

module.exports = { getStats, getMonthlyCharts };
