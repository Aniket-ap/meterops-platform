const Usage = require("../modules/usage/usage.model");

exports.logUsage = async ({
  tenantId,
  userId,
  feature,
  quantity = 1,
}) => {
  try {
    await Usage.create({
      tenantId,
      userId,
      feature,
      quantity,
    });
  } catch (err) {
    console.error("Usage logging failed", err);
  }
};
