const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const usageController = require("./usage.controller");

router.get(
  "/summary",
  authMiddleware,
  usageController.getUsageSummary
);

module.exports = router;
