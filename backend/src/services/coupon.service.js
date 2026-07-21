"use strict";

const couponRepo = require("../repositories/coupon.repository");
const packageRepo = require("../repositories/package.repository");
const { parsePagination } = require("../utils/pagination");
const ApiError = require("../utils/ApiError");

async function create(data, adminId) {
  const existing = await couponRepo.findByCode(data.code);
  if (existing) throw ApiError.conflict(`Coupon code '${data.code}' already exists`);
  data.createdBy = adminId;
  return couponRepo.create(data);
}

async function getAll(query) {
  const { page, limit, skip, sort } = parsePagination(query);
  const { data, total } = await couponRepo.findAll({ sort, skip, limit });
  return { data, total, page, limit };
}

async function update(id, data) {
  const coupon = await couponRepo.findById(id);
  if (!coupon) throw ApiError.notFound("Coupon not found");
  return couponRepo.update(id, data);
}

async function remove(id) {
  const coupon = await couponRepo.findById(id);
  if (!coupon) throw ApiError.notFound("Coupon not found");
  return couponRepo.delete(id);
}

/**
 * Validate coupon and return discount breakdown.
 * POST /api/v1/coupons/validate
 */
async function validate(code, packageId, travelers) {
  const pkg = await packageRepo.findById(packageId);
  if (!pkg || pkg.status !== "published") {
    throw ApiError.notFound("Package not found");
  }

  const unitPrice = pkg.discountPrice > 0 ? pkg.discountPrice : pkg.price;
  const originalAmount = unitPrice * travelers;

  const coupon = await couponRepo.findByCode(code);
  if (!coupon || !coupon.isValid) {
    throw ApiError.badRequest("Invalid, expired or exhausted coupon code");
  }

  if (
    coupon.applicablePackages.length > 0 &&
    !coupon.applicablePackages.map(String).includes(String(packageId))
  ) {
    throw ApiError.badRequest("This coupon is not applicable to the selected package");
  }

  if (coupon.minOrderAmount && originalAmount < coupon.minOrderAmount) {
    throw ApiError.badRequest(
      `Minimum order ₹${coupon.minOrderAmount} required for this coupon`
    );
  }

  let discount =
    coupon.discountType === "percentage"
      ? (originalAmount * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);

  const finalAmount = Math.max(0, originalAmount - discount);

  return {
    couponCode: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    originalAmount,
    discount: Math.round(discount),
    finalAmount: Math.round(finalAmount),
  };
}

module.exports = { create, getAll, update, remove, validate };
