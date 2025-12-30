const crypto = require("crypto");
const User = require("./user.model");

exports.inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { tenantId } = req.user;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role required" });
    }

    const existingUser = await User.findOne({ tenantId, email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");

    const invited = await User.create({
      tenantId,
      email,
      role,
      status: "INVITED",
      inviteToken,
      inviteExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      password: "temporary", // will be reset on accept
    });

    let emailSent = false;
    try {
      const Tenant = require("../tenant/tenant.model");
      const tenant = await Tenant.findById(tenantId);
      const { sendInviteEmail } = require("../../services/mail.service");
      const info = await sendInviteEmail({
        to: email,
        companyName: tenant?.name || "Your Company",
        token: inviteToken,
      });
      emailSent = Boolean(info && info.messageId);
    } catch (mailError) {
      emailSent = false;
      console.error("Invite email send failed:", mailError);
    }

    res.status(201).json({
      success: true,
      message: emailSent ? "Invitation sent successfully" : "Invitation created, email sending failed",
      data: { id: invited._id, emailSent },
    });
  } catch (error) {
    res.status(500).json({ message: "Invite failed", error });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      inviteToken: token,
      inviteExpiresAt: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    user.password = password;
    user.status = "ACTIVE";
    user.inviteToken = undefined;
    user.inviteExpiresAt = undefined;

    await user.save();

    res.json({ success: true, message: "Invitation accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Invite acceptance failed", error });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const users = await User.find(
      { tenantId },
      "-password -inviteToken -inviteExpiresAt"
    ).sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.disableUser = async (req, res) => {
  try {
    const { tenantId, userId: currentUserId } = req.user;
    const { userId } = req.params;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot disable yourself" });
    }

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "OWNER" && user.status !== "DISABLED") {
      const activeOwnersCount = await User.countDocuments({
        tenantId,
        role: "OWNER",
        status: { $ne: "DISABLED" },
      });

      if (activeOwnersCount <= 1) {
        return res.status(400).json({
          message: "Cannot disable the last active owner",
        });
      }
    }

    user.status = "DISABLED";
    await user.save();

    res.json({ message: "User disabled successfully" });
  } catch (error) {
    console.error("Disable user error:", error);
    res.status(500).json({ message: "Failed to disable user" });
  }
};

exports.enableUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "ACTIVE";
    await user.save();

    res.json({ message: "User enabled successfully" });
  } catch (error) {
    console.error("Enable user error:", error);
    res.status(500).json({ message: "Failed to enable user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { tenantId, userId: currentUserId } = req.user;
    const { userId } = req.params;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "OWNER") {
      // Check 1: Ensure we don't leave 0 owners total
      const totalOwnersCount = await User.countDocuments({
        tenantId,
        role: "OWNER",
      });

      if (totalOwnersCount <= 1) {
        return res.status(400).json({
          message: "Cannot delete the last owner",
        });
      }

      // Check 2: Ensure we don't leave 0 active owners (if deleting an active one)
      if (user.status !== "DISABLED") {
        const activeOwnersCount = await User.countDocuments({
          tenantId,
          role: "OWNER",
          status: { $ne: "DISABLED" },
        });

        if (activeOwnersCount <= 1) {
          return res.status(400).json({
            message: "Cannot delete the last active owner",
          });
        }
      }
    }

    await User.deleteOne({ _id: userId });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { tenantId, userId: currentUserId } = req.user;
    const { userId } = req.params;
    const { role } = req.body;

    if (!["ADMIN", "MEMBER", "OWNER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If downgrading an OWNER, check if they are the last one
    if (user.role === "OWNER" && role !== "OWNER") {
      // Check 1: Ensure we don't leave 0 owners total
      const totalOwnersCount = await User.countDocuments({
        tenantId,
        role: "OWNER",
      });

      if (totalOwnersCount <= 1) {
        return res.status(400).json({
          message: "Cannot downgrade the last owner",
        });
      }

      // Check 2: Ensure we don't leave 0 active owners
      if (user.status !== "DISABLED") {
        const activeOwnersCount = await User.countDocuments({
          tenantId,
          role: "OWNER",
          status: { $ne: "DISABLED" },
        });

        if (activeOwnersCount <= 1) {
          return res.status(400).json({
            message: "Cannot downgrade the last active owner",
          });
        }
      }
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Change role error:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
};

exports.resendInvite = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "INVITED") {
      return res.status(400).json({ message: "User is not in INVITED status" });
    }

    // Regenerate token and expiry
    const inviteToken = crypto.randomBytes(32).toString("hex");
    user.inviteToken = inviteToken;
    user.inviteExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    let emailSent = false;
    try {
      const Tenant = require("../tenant/tenant.model");
      const tenant = await Tenant.findById(tenantId);
      const { sendInviteEmail } = require("../../services/mail.service");
      const info = await sendInviteEmail({
        to: user.email,
        companyName: tenant?.name || "Your Company",
        token: inviteToken,
      });
      emailSent = Boolean(info && info.messageId);
    } catch (mailError) {
      console.error("Resend invite email failed:", mailError);
    }

    if (emailSent) {
      res.json({ success: true, message: "Invitation resent successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send invitation email" });
    }
  } catch (error) {
    console.error("Resend invite error:", error);
    res.status(500).json({ message: "Failed to resend invitation" });
  }
};
