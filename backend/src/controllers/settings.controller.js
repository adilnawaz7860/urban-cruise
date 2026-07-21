"use strict";

const settingsService = require("../services/settings.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC
const get = asyncHandler(async (req, res) => {
  const settings = await settingsService.get();
  // Strip internal fields
  const { updatedBy, __v, ...safe } = settings.toObject();
  ApiResponse.ok(res, safe);
});

// ADMIN
const update = asyncHandler(async (req, res) => {
  const logoBuffer = req.files?.logo?.[0]?.buffer;
  const faviconBuffer = req.files?.favicon?.[0]?.buffer;
  const settings = await settingsService.update(req.body, logoBuffer, faviconBuffer, req.admin._id);
  ApiResponse.ok(res, settings, "Settings updated");
});

// Testimonials
const createTestimonial = asyncHandler(async (req, res) => {
  const t = await settingsService.createTestimonial(req.body);
  ApiResponse.created(res, t, "Testimonial created");
});

const getTestimonials = asyncHandler(async (req, res) => {
  const isAdmin = !!req.admin;
  const data = await settingsService.getTestimonials(isAdmin ? { all: true } : {});
  ApiResponse.ok(res, data);
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const t = await settingsService.updateTestimonial(req.params.id, req.body);
  ApiResponse.ok(res, t, "Testimonial updated");
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  await settingsService.deleteTestimonial(req.params.id);
  ApiResponse.ok(res, null, "Testimonial deleted");
});

module.exports = { get, update, createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial };
