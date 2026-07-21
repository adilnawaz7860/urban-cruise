"use strict";

const couponService = require("../services/coupon.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC — validate coupon
const validate = asyncHandler(async (req, res) => {
  const { code, packageId, travelers } = req.body;
  const result = await couponService.validate(code, packageId, travelers);
  ApiResponse.ok(res, result, "Coupon applied successfully");
});

// ADMIN
const create = asyncHandler(async (req, res) => {
  const coupon = await couponService.create(req.body, req.admin._id);
  ApiResponse.created(res, coupon, "Coupon created");
});

const getAll = asyncHandler(async (req, res) => {
  const result = await couponService.getAll(req.query);
  ApiResponse.paginated(res, result);
});

const update = asyncHandler(async (req, res) => {
  const coupon = await couponService.update(req.params.id, req.body);
  ApiResponse.ok(res, coupon, "Coupon updated");
});

const remove = asyncHandler(async (req, res) => {
  await couponService.remove(req.params.id);
  ApiResponse.ok(res, null, "Coupon deleted");
});

module.exports = { validate, create, getAll, update, remove };
