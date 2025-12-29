const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes");
const usageRoutes = require("../modules/usage/usage.routes");
const billingRoutes = require("../modules/billing/billing.routes");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/usage", usageRoutes);
router.use("/billing", billingRoutes);

module.exports = router;
