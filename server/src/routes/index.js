const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes");
const usageRoutes = require("../modules/usage/usage.routes");
const billingRoutes = require("../modules/billing/billing.routes");
const tenantRoutes = require("../modules/tenant/tenant.routes");
const contactRoutes = require("../modules/contact/contact.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/usage", usageRoutes);
router.use("/billing", billingRoutes);
router.use("/tenants", tenantRoutes);
router.use("/contact", contactRoutes);

module.exports = router;
