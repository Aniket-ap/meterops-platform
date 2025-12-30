const Usage = require("../modules/usage/usage.model");
const Tenant = require("../modules/tenant/tenant.model");
const plans = require("../config/plans");

const usageMiddleware = (feature) => {
  return async (req, res, next) => {
    if (!req.user?.tenantId) {
      return next();
    }

    const { tenantId, id: userId } = req.user;

    // 1. Enforce Limits (Blocking)
    try {
      const tenant = await Tenant.findById(tenantId);
      
      // If tenant not found, something is wrong with auth, but we should probably block or 404
      if (!tenant) {
        return res.status(401).json({ message: "Tenant not found" });
      }

      const planConfig = plans[tenant.plan] || plans.FREE;
      const limit = planConfig.maxMonthlyRequests;

      if (limit !== Infinity) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentUsage = await Usage.countDocuments({
          tenantId,
          createdAt: { $gte: startOfMonth },
        });

        if (currentUsage >= limit) {
          return res.status(403).json({
            success: false,
            message: "Usage limit exceeded. Please upgrade your plan.",
          });
        }
      }
    } catch (error) {
      console.error("Usage limit enforcement failed:", error);
      // Fail safe: if we can't check limits, we should probably block to prevent abuse, 
      // or allow if we prioritize availability. 
      // Requirement: "Usage limit check MUST block requests" implies strictness.
      return res.status(500).json({ message: "Failed to verify usage limits" });
    }

    // 2. Log Usage (Non-blocking / Fail-safe)
    // Fire-and-forget: do not await, but handle errors to prevent unhandled rejections
    Usage.create({
      tenantId,
      userId,
      feature,
      quantity: 1,
    }).catch((error) => {
      console.error("Usage logging failed:", error.message);
      // Requirement: "Usage logging failure must NOT block requests"
    });

    next();
  };
};

module.exports = usageMiddleware;