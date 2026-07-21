"use strict";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication & profile management
 */

const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/rbac.middleware");
const { validate } = require("../middleware/validate.middleware");
const { uploadSingle, multerErrorHandler } = require("../middleware/upload.middleware");
const { authRateLimiter } = require("../middleware/rateLimit.middleware");
const { auditLog } = require("../middleware/audit.middleware");
const v = require("../validators/auth.validator");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful — returns access token + sets refresh cookie
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authRateLimiter, validate(v.loginSchema), ctrl.login);

router.post("/logout", authenticate, ctrl.logout);
router.post("/refresh", ctrl.refresh);
router.post("/forgot-password", authRateLimiter, validate(v.forgotPasswordSchema), ctrl.forgotPassword);
router.post("/reset-password", validate(v.resetPasswordSchema), ctrl.resetPassword);

router.patch("/change-password", authenticate, validate(v.changePasswordSchema), ctrl.changePassword);
router.get("/me", authenticate, ctrl.getProfile);
router.patch(
  "/me",
  authenticate,
  uploadSingle("avatar"),
  multerErrorHandler,
  validate(v.updateProfileSchema, "body"),
  ctrl.updateProfile
);

// Admin management (super_admin only)
router.post(
  "/admins",
  authenticate,
  authorize("super_admin"),
  auditLog,
  validate(v.createAdminSchema),
  ctrl.createAdmin
);
router.get("/admins", authenticate, authorize("super_admin"), ctrl.listAdmins);
router.delete("/admins/:id", authenticate, authorize("super_admin"), auditLog, ctrl.deleteAdmin);

module.exports = router;
