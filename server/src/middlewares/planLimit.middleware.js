const Usage = require("../modules/usage/usage.model");
const plans = require("../config/plans");

module.exports = (feature) => {
  return async (req, res, next) => {
    try {
      const { tenantId } = req.user;

      const Tenant = require("../modules/tenant/tenant.model");
      const tenant = await Tenant.findById(tenantId);

      const plan = tenant.plan || "FREE";
      const limit = plans[plan][feature];

      if (limit === Infinity) return next();

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const usageCount = await Usage.countDocuments({
        tenantId,
        feature,
        createdAt: { $gte: startOfDay },
      });

      if (usageCount >= limit) {
        return res.status(403).json({
          message: `Daily ${feature} limit exceeded for ${plan} plan`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Plan limit check failed" });
    }
  };
};
