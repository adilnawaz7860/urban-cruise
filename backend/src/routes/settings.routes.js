"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/settings.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");
const { uploadFields, multerErrorHandler } = require("../middleware/upload.middleware");
const { auditLog } = require("../middleware/audit.middleware");

// Public — site settings (logo, contact, socials)
router.get("/", ctrl.get);
router.get("/testimonials", ctrl.getTestimonials);

// Admin
router.use(authenticate, atLeast("admin"));

router.put(
  "/",
  auditLog,
  uploadFields([{ name: "logo", maxCount: 1 }, { name: "favicon", maxCount: 1 }]),
  multerErrorHandler,
  ctrl.update
);

// Testimonials CRUD
router.post("/testimonials", auditLog, ctrl.createTestimonial);
router.patch("/testimonials/:id", auditLog, ctrl.updateTestimonial);
router.delete("/testimonials/:id", auditLog, ctrl.deleteTestimonial);

module.exports = router;
