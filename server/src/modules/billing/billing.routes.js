const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const usageMiddleware = require("../../middlewares/usage.middleware");
const billingController = require("./billing.controller");

router.post(
  "/generate",
  authMiddleware,
  roleMiddleware("OWNER"),
  usageMiddleware("GENERATE_INVOICE"),
  billingController.generateInvoice
);

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("OWNER"),
  billingController.getBillingSummary
);

router.get(
  "/invoices",
  authMiddleware,
  roleMiddleware("OWNER"),
  billingController.getInvoices
);

module.exports = router;
