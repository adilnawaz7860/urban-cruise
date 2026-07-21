"use strict";

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Tour packages — public & admin
 */

const router = require("express").Router();
const ctrl = require("../controllers/package.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");
const { validate } = require("../middleware/validate.middleware");
const { uploadFields, multerErrorHandler } = require("../middleware/upload.middleware");
const { auditLog } = require("../middleware/audit.middleware");
const v = require("../validators/package.validator");

// ─── Public ──────────────────────────────────────────────────────────────────
router.get("/", validate(v.packageQuerySchema, "query"), ctrl.getAll);
router.get("/featured", ctrl.getFeatured);
router.get("/:slug", ctrl.getBySlug);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.use(authenticate, atLeast("content_manager"));

router.get("/admin/list", validate(v.packageQuerySchema, "query"), ctrl.adminGetAll);
router.get("/admin/:id", ctrl.getById);

router.post(
  "/admin",
  atLeast("admin"),
  auditLog,
  uploadFields([{ name: "cover", maxCount: 1 }, { name: "gallery", maxCount: 10 }]),
  multerErrorHandler,
  validate(v.createPackageSchema),
  ctrl.create
);

router.put(
  "/admin/:id",
  atLeast("admin"),
  auditLog,
  uploadFields([{ name: "cover", maxCount: 1 }, { name: "gallery", maxCount: 10 }]),
  multerErrorHandler,
  validate(v.updatePackageSchema),
  ctrl.update
);

router.patch("/admin/:id/toggle-status", atLeast("admin"), auditLog, ctrl.toggleStatus);
router.post("/admin/:id/duplicate", atLeast("admin"), auditLog, ctrl.duplicate);
router.delete("/admin/:id", atLeast("admin"), auditLog, ctrl.remove);

module.exports = router;
