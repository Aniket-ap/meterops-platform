const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

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

module.exports = router;
