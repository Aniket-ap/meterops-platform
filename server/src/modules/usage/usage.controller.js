const Usage = require("./usage.model");

exports.getUsageSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const usage = await Usage.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: "$feature",
          total: { $sum: "$quantity" },
        },
      },
    ]);

    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: "Failed to get usage" });
  }
};
