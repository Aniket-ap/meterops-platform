const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const usageMiddleware = require("../../middlewares/usage.middleware");
const userController = require("./user.controller");
const rateLimit = require("../../middlewares/rateLimit.middleware");

// Get current user
router.get(
  "/me",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Protected user route",
      user: req.user,
    });
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
  userController.inviteUser
);

// List users (WITH usage tracking)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  rateLimit({ feature: "LIST_USERS", limit: 10, windowInSeconds: 60 }),
  usageMiddleware("LIST_USERS"),
  userController.listUsers
);

// Disable user
router.patch(
  "/:userId/disable",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  userController.disableUser
);

// Change user role
router.patch(
  "/:userId/role",
  authMiddleware,
  roleMiddleware("OWNER"),
  userController.changeRole
);

// Accept invite (public)
router.post("/accept-invite", userController.acceptInvite);

module.exports = router;
