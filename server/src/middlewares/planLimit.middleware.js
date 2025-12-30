const Usage = require("../modules/usage/usage.model");
const plans = require("../config/plans");

module.exports = (feature) => {
  return async (req, res, next) => {
    try {
      const { tenantId } = req.user;

      const Tenant = require("../modules/tenant/tenant.model");
      const tenant = await Tenant.findById(tenantId);

      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }

      const plan = tenant.plan || "FREE";
      
      if (!plans[plan]) {
        console.error(`Unknown plan: ${plan} for tenant: ${tenantId}`);
        return res.status(500).json({ message: "Invalid plan configuration" });
      }

      const limit = plans[plan][feature];

      if (limit === undefined) {
         // If feature not defined in plan, assume 0 or Infinity? 
         // Usually implies feature not available.
         return res.status(403).json({ message: `Feature ${feature} not available on ${plan} plan` });
      }

      if (limit === Infinity) return next();

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const usageCount = await Usage.countDocuments({
        tenantId,
        feature,
        createdAt: { $gte: startOfDay },
      });

      if (usageCount >= limit) {
        console.warn(`[PlanLimit] Limit exceeded for tenant ${tenantId}. Plan: ${plan}, Feature: ${feature}, Usage: ${usageCount}/${limit}`);
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
