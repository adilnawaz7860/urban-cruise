"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/enquiry.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");
const { validate } = require("../middleware/validate.middleware");
const { formRateLimiter } = require("../middleware/rateLimit.middleware");
const { auditLog } = require("../middleware/audit.middleware");
const v = require("../validators/enquiry.validator");

// Public
router.post("/", formRateLimiter, validate(v.createEnquirySchema), ctrl.create);
router.post("/contact", formRateLimiter, validate(v.createContactSchema), ctrl.createContact);

// Admin — enquiries
router.use(authenticate, atLeast("admin"));

router.get("/", validate(v.enquiryQuerySchema, "query"), ctrl.getAll);
router.get("/export/csv", ctrl.exportCsv);
router.get("/:id", ctrl.getById);
router.patch("/:id", auditLog, ctrl.updateStatus);
router.delete("/:id", auditLog, ctrl.remove);

// Admin — contact messages
router.get("/contacts/all", ctrl.getAllContacts);
router.patch("/contacts/:id/read", ctrl.markContactRead);

module.exports = router;
