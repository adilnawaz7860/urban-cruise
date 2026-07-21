"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/newsletter.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");
const { validate } = require("../middleware/validate.middleware");
const { formRateLimiter } = require("../middleware/rateLimit.middleware");
const v = require("../validators/newsletter.validator");

// Public
router.post("/subscribe", formRateLimiter, validate(v.subscribeSchema), ctrl.subscribe);
router.post("/unsubscribe", validate(v.subscribeSchema), ctrl.unsubscribe);

// Admin
router.use(authenticate, atLeast("admin"));

router.get("/", ctrl.getAll);
router.get("/export/csv", ctrl.exportCsv);

module.exports = router;
