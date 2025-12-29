const { logUsage } = require("../utils/usageLogger");

module.exports = (featureName) => {
  return async (req, res, next) => {
    if (req.user) {
      logUsage({
        tenantId: req.user.tenantId,
        userId: req.user.userId,
        feature: featureName,
      });
    }
    next();
  };
};
