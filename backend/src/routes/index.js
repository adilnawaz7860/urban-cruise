"use strict";

const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/packages", require("./package.routes"));
router.use("/bookings", require("./booking.routes"));
router.use("/blogs", require("./blog.routes"));
router.use("/enquiries", require("./enquiry.routes"));
router.use("/coupons", require("./coupon.routes"));
router.use("/gallery", require("./gallery.routes"));
router.use("/newsletter", require("./newsletter.routes"));
router.use("/settings", require("./settings.routes"));
router.use("/dashboard", require("./dashboard.routes"));

module.exports = router;
