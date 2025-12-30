const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const usageMiddleware = require("../../middlewares/usage.middleware");
const userController = require("./user.controller");
const rateLimit = require("../../middlewares/rateLimit.middleware");
const planLimit = require("../../middlewares/planLimit.middleware");

// Get current user
router.get(
  "/me",
  authMiddleware,
  async (req, res) => {
    try {
      const user = req.user;
      // We need to fetch the tenant details separately if they are not already populated
      // Assuming req.user is populated with tenant or we can fetch it.
      // Let's assume req.user is just the user document for now.
      
      // If req.user does not have populated tenant, we might want to fetch it
      // But for now let's construct the response based on available data
      // To match the requested structure:
      
      // We need to fetch the full tenant details
      const Tenant = require('../tenant/tenant.model');
      const tenant = await Tenant.findById(user.tenantId);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            status: user.status
          },
          tenant: tenant ? {
            id: tenant._id,
            name: tenant.name,
            domain: tenant.domain,
            plan: tenant.plan || "FREE", // Assuming default plan
            status: tenant.status || "ACTIVE" // Assuming default status
          } : null
        }
      });
    } catch (error) {
       res.status(500).json({ success: false, message: "Failed to fetch user details" });
    }
  }
);

// Admin test route
router.get(
  "/admin-only",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  (req, res) => {
    res.json({
      message: "Admin-level access granted",
    });
  }
);

// Invite user
router.post(
  "/invite",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  usageMiddleware("INVITE_USER"),
  userController.inviteUser
);

// Accept invite (Public)
router.post("/accept-invite", userController.acceptInvite);

// List users (WITH usage tracking)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  planLimit("LIST_USERS"),
  rateLimit({ feature: "LIST_USERS", limit: 10, windowInSeconds: 60 }),
  usageMiddleware("LIST_USERS"),
  userController.listUsers
);

// Disable user
router.patch(
  "/:userId/disable",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  usageMiddleware("DISABLE_USER"),
  userController.disableUser
);

// Enable user
router.patch(
  "/:userId/enable",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  usageMiddleware("ENABLE_USER"),
  userController.enableUser
);

// Delete user
router.delete(
  "/:userId",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  usageMiddleware("DELETE_USER"),
  userController.deleteUser
);

// Change user role
router.patch(
  "/:userId/role",
  authMiddleware,
  roleMiddleware("OWNER"),
  usageMiddleware("CHANGE_ROLE"),
  userController.changeRole
);

// Resend Invite
router.post(
  "/:userId/resend-invite",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  userController.resendInvite
);

module.exports = router;
