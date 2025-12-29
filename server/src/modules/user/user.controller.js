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

    await User.create({
      tenantId,
      email,
      role,
      status: "INVITED",
      inviteToken,
      inviteExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      password: "temporary", // will be reset on accept
    });

    // Email sending will be added later
    res.status(201).json({
      message: "User invited successfully",
      inviteToken, // for testing only
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

    res.json({ message: "Invite accepted successfully" });
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
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.disableUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "DISABLED";
    await user.save();

    res.json({ message: "User disabled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to disable user" });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findOne({ _id: userId, tenantId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role" });
  }
};
