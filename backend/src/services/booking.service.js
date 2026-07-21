"use strict";

const bookingRepo = require("../repositories/booking.repository");
const packageRepo = require("../repositories/package.repository");
const couponRepo = require("../repositories/coupon.repository");
const { parsePagination, buildSearch } = require("../utils/pagination");
const { sendBookingConfirmation } = require("./email.service");
const ApiError = require("../utils/ApiError");

async function create(data) {
  const pkg = await packageRepo.findById(data.package);
  if (!pkg || pkg.status !== "published") {
    throw ApiError.notFound("Package not found or unavailable");
  }

  const unitPrice = pkg.discountPrice > 0 ? pkg.discountPrice : pkg.price;
  let originalAmount = unitPrice * data.travelers;
  let discountAmount = 0;

  if (data.couponCode) {
    const coupon = await couponRepo.findByCode(data.couponCode);
    if (coupon && coupon.isValid) {
      if (coupon.minOrderAmount && originalAmount < coupon.minOrderAmount) {
        throw ApiError.badRequest(
          `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`
        );
      }
      if (coupon.discountType === "percentage") {
        discountAmount = (originalAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscount > 0) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      } else {
        discountAmount = coupon.discountValue;
      }
      await couponRepo.incrementUsage(data.couponCode);
    }
  }

  const totalAmount = Math.max(0, originalAmount - discountAmount);
  const booking = await bookingRepo.create({
    ...data,
    originalAmount,
    discountAmount,
    totalAmount,
  });

  // Populate for email
  const populated = await bookingRepo.findById(booking._id);
  await sendBookingConfirmation(populated);

  return populated;
}

async function getAll(query) {
  const { page, limit, skip, sort } = parsePagination(query);
  const filter = {};

  if (query.status && query.status !== "all") filter.status = query.status;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }
  if (query.search) {
    const searchFilter = buildSearch(["customerName", "email", "bookingId"], query.search);
    Object.assign(filter, searchFilter);
  }

  const { data, total } = await bookingRepo.findAll({ filter, sort, skip, limit });
  return { data, total, page, limit };
}

async function getById(id) {
  const booking = await bookingRepo.findById(id);
  if (!booking) throw ApiError.notFound("Booking not found");
  return booking;
}

async function updateStatus(id, statusData) {
  const booking = await bookingRepo.findById(id);
  if (!booking) throw ApiError.notFound("Booking not found");

  const updateData = { status: statusData.status };
  if (statusData.adminNotes) updateData.adminNotes = statusData.adminNotes;
  if (statusData.status === "confirmed") updateData.confirmedAt = new Date();
  if (statusData.status === "cancelled") {
    updateData.cancelledAt = new Date();
    if (statusData.cancellationReason) updateData.cancellationReason = statusData.cancellationReason;
  }

  return bookingRepo.update(id, updateData);
}

async function getStats() {
  const [statusCounts, totalRevenue] = await Promise.all([
    bookingRepo.countByStatus(),
    bookingRepo.totalRevenue(),
  ]);
  return { statusCounts, totalRevenue };
}

module.exports = { create, getAll, getById, updateStatus, getStats };
