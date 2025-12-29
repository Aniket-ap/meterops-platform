const jwt = require("jsonwebtoken");
const Tenant = require("../tenant/tenant.model");
const User = require("../user/user.model");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.registerTenant = async (req, res) => {
  try {
    const { companyName, domain, email, password } = req.body;

    if (!companyName || !domain || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTenant = await Tenant.findOne({ domain });
    if (existingTenant) {
      return res.status(409).json({ message: "Tenant already exists" });
    }

    const tenant = await Tenant.create({
      name: companyName,
      domain,
    });

    let owner;
    try {
      owner = await User.create({
        tenantId: tenant._id,
        email,
        password,
        role: "OWNER",
      });
    } catch (userError) {
      // Rollback: delete tenant if user creation fails
      await Tenant.findByIdAndDelete(tenant._id);
      throw userError;
    }

    const token = generateToken({
      userId: owner._id,
      tenantId: tenant._id,
      role: owner.role,
    });

    res.status(201).json({
      message: "Tenant registered successfully",
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user._id,
      tenantId: user.tenantId,
      role: user.role,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error });
  }
};
