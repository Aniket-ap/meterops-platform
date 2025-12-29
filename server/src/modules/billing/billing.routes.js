const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const billingController = require("./billing.controller");

router.post(
  "/generate",
  authMiddleware,
  roleMiddleware("OWNER"),
  billingController.generateInvoice
);

module.exports = router;
