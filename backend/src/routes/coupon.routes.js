"use strict";

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon code validation and management
 */

const router = require("express").Router();
const ctrl = require("../controllers/coupon.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");
const { validate } = require("../middleware/validate.middleware");
const { auditLog } = require("../middleware/audit.middleware");
const v = require("../validators/coupon.validator");

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     tags: [Coupons]
 *     summary: Validate a coupon and get discount breakdown
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, packageId, travelers]
 *             properties:
 *               code: { type: string }
 *               packageId: { type: string }
 *               travelers: { type: integer }
 *     responses:
 *       200:
 *         description: Returns originalAmount, discount, finalAmount, couponCode
 */
router.post("/validate", validate(v.validateCouponSchema), ctrl.validate);

// Admin
router.use(authenticate, atLeast("admin"));

router.get("/", ctrl.getAll);
router.post("/", auditLog, validate(v.createCouponSchema), ctrl.create);
router.put("/:id", auditLog, validate(v.updateCouponSchema), ctrl.update);
router.delete("/:id", auditLog, ctrl.remove);

module.exports = router;
