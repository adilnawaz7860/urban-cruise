"use strict";

const bookingService = require("../services/booking.service");
const bookingRepo = require("../repositories/booking.repository");
const { sendCsv } = require("../utils/csvExport");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC — create booking
const create = asyncHandler(async (req, res) => {
  const booking = await bookingService.create(req.body);
  ApiResponse.created(res, booking, `Booking confirmed! Your ID is ${booking.bookingId}`);
});

// PUBLIC — track booking by ID
const track = asyncHandler(async (req, res) => {
  const booking = await bookingRepo.findByBookingId(req.params.bookingId);
  if (!booking) {
    return ApiResponse.ok(res, null, "No booking found with this ID");
  }
  // Return limited public fields
  const safeFields = {
    bookingId: booking.bookingId,
    customerName: booking.customerName,
    status: booking.status,
    travelDate: booking.travelDate,
    travelers: booking.travelers,
    package: booking.package ? { title: booking.package.title, destination: booking.package.destination } : null,
  };
  ApiResponse.ok(res, safeFields);
});

// ADMIN
const getAll = asyncHandler(async (req, res) => {
  const result = await bookingService.getAll(req.query);
  ApiResponse.paginated(res, result);
});

const getById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getById(req.params.id);
  ApiResponse.ok(res, booking);
});

const updateStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateStatus(req.params.id, req.body);
  ApiResponse.ok(res, booking, "Booking status updated");
});

const exportCsv = asyncHandler(async (req, res) => {
  const { data } = await bookingService.getAll({ ...req.query, limit: 10000 });
  const rows = data.map((b) => ({
    bookingId: b.bookingId,
    customerName: b.customerName,
    email: b.email,
    phone: b.phone,
    package: b.package?.title || "",
    destination: b.package?.destination || "",
    travelDate: b.travelDate ? new Date(b.travelDate).toLocaleDateString("en-IN") : "",
    travelers: b.travelers,
    totalAmount: b.totalAmount,
    status: b.status,
    paymentStatus: b.paymentStatus,
    createdAt: new Date(b.createdAt).toLocaleDateString("en-IN"),
  }));
  await sendCsv(res, rows, `bookings-${Date.now()}`);
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await bookingService.getStats();
  ApiResponse.ok(res, stats);
});

module.exports = { create, track, getAll, getById, updateStatus, exportCsv, getStats };
