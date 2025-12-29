const redis = require("../config/redis");

module.exports = ({ feature, limit, windowInSeconds }) => {
  return async (req, res, next) => {
    try {
      const { tenantId } = req.user;
      const key = `rate:${tenantId}:${feature}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowInSeconds);
      }

      if (current > limit) {
        return res.status(429).json({
          message: "Rate limit exceeded",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Rate limiter error",
      });
    }
  };
};
