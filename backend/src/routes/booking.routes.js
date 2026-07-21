"use strict";

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Tour booking management
 */

const router = require("express").Router();
const ctrl = require("../controllers/booking.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");
const { validate } = require("../middleware/validate.middleware");
const { formRateLimiter } = require("../middleware/rateLimit.middleware");
const { auditLog } = require("../middleware/audit.middleware");
const v = require("../validators/booking.validator");

// ─── Public ───────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking
 *     security: []
 */
router.post("/", formRateLimiter, validate(v.createBookingSchema), ctrl.create);
router.get("/track/:bookingId", ctrl.track);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.use(authenticate, atLeast("admin"));

router.get("/", validate(v.bookingQuerySchema, "query"), ctrl.getAll);
router.get("/stats", ctrl.getStats);
router.get("/export/csv", ctrl.exportCsv);
router.get("/:id", ctrl.getById);
router.patch("/:id/status", auditLog, validate(v.updateBookingStatusSchema), ctrl.updateStatus);

module.exports = router;
