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

router.get(
  "/",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  userController.listUsers
);

router.patch(
  "/:userId/disable",
  authMiddleware,
  roleMiddleware("OWNER", "ADMIN"),
  userController.disableUser
);

router.patch(
  "/:userId/role",
  authMiddleware,
  roleMiddleware("OWNER"),
  userController.changeRole
);


router.post("/accept-invite", userController.acceptInvite);

module.exports = router;
