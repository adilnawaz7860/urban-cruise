"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/gallery.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");
const { uploadMultiple, multerErrorHandler } = require("../middleware/upload.middleware");
const { auditLog } = require("../middleware/audit.middleware");

// Public
router.get("/", ctrl.getAll);

// Admin
router.use(authenticate, atLeast("content_manager"));

router.get("/admin/list", ctrl.adminGetAll);
router.post(
  "/admin",
  auditLog,
  uploadMultiple("images", 20),
  multerErrorHandler,
  ctrl.upload
);
router.patch("/admin/:id", auditLog, ctrl.update);
router.delete("/admin/:id", auditLog, ctrl.remove);

module.exports = router;
