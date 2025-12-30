const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const Tenant = require("./tenant.model");

// Explicitly handle OPTIONS for /me to prevent 404/405 issues
router.options("/me", (req, res) => res.sendStatus(200));

router.patch(
  "/me",
  authMiddleware,
  roleMiddleware("OWNER"),
  async (req, res) => {
    try {
      const { tenantId } = req.user;
      const name = String(req.body.name || "").trim();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Tenant name is required",
        });
      }

      const tenant = await Tenant.findByIdAndUpdate(
        tenantId,
        { name },
        { new: true }
      );

      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Tenant updated successfully",
        data: {
          id: tenant._id,
          name: tenant.name,
          domain: tenant.domain,
          plan: tenant.plan,
          status: tenant.status,
        },
      });
    } catch (error) {
      console.error("Update tenant error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update tenant",
      });
    }
  }
);

module.exports = router;
