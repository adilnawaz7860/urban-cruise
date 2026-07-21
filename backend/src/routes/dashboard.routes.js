"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/dashboard.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { atLeast } = require("../middleware/rbac.middleware");

router.use(authenticate, atLeast("admin"));

router.get("/stats", ctrl.getStats);
router.get("/charts", ctrl.getCharts);

module.exports = router;
