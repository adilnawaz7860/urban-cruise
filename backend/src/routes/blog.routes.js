"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/blog.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");
const { validate } = require("../middleware/validate.middleware");
const { uploadSingle, multerErrorHandler } = require("../middleware/upload.middleware");
const { auditLog } = require("../middleware/audit.middleware");
const v = require("../validators/blog.validator");

// Public
router.get("/", validate(v.blogQuerySchema, "query"), ctrl.getAll);
router.get("/:slug", ctrl.getBySlug);

// Admin
router.use(authenticate, atLeast("content_manager"));

router.get("/admin/list", validate(v.blogQuerySchema, "query"), ctrl.adminGetAll);
router.post(
  "/admin",
  auditLog,
  uploadSingle("image"),
  multerErrorHandler,
  validate(v.createBlogSchema),
  ctrl.create
);
router.put(
  "/admin/:id",
  auditLog,
  uploadSingle("image"),
  multerErrorHandler,
  validate(v.updateBlogSchema),
  ctrl.update
);
router.delete("/admin/:id", auditLog, ctrl.remove);

module.exports = router;
