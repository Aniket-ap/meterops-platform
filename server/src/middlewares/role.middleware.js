module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    // Allow OPTIONS requests to pass through
    if (req.method === "OPTIONS") {
      return next();
    }

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.warn(`[RoleMiddleware] Access denied for user ${req.user?.userId} (Role: ${req.user?.role}). Required: ${allowedRoles.join(", ")}`);
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
