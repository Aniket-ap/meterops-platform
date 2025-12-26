const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const userController = require("./user.controller");

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

router.post(
  "/invite",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  userController.inviteUser
);

router.post("/accept-invite", userController.acceptInvite);

module.exports = router;
