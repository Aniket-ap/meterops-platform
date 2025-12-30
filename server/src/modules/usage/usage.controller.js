const Usage = require("./usage.model");
const mongoose = require("mongoose");
const Tenant = require("../tenant/tenant.model");
const plans = require("../../config/plans");

exports.getUsageSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { period = "30d" } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === "today") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { $gte: startOfDay };
    } else if (period === "7d") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { $gte: sevenDaysAgo };
    } else {
      // Default to 30d
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { $gte: thirtyDaysAgo };
    }

    const matchStage = {
      tenantId: new mongoose.Types.ObjectId(tenantId),
      createdAt: dateFilter,
    };

    const usage = await Usage.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$feature",
          total: { $sum: "$quantity" },
        },
      },
      { $sort: { total: -1 } }, // Sort by total usage descending
    ]);

    const formattedData = usage.map((u) => ({
      feature: u._id,
      total: u.total,
    }));

    // Fetch tenant and plan details for limit tracking
    const tenant = await Tenant.findById(tenantId);
    const planConfig = plans[tenant?.plan] || plans.FREE;
    const limit = planConfig.maxMonthlyRequests;

    // Calculate current calendar month usage for the limit progress bar
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const currentMonthUsage = await Usage.countDocuments({
      tenantId,
      createdAt: { $gte: startOfMonth },
    });

    res.json({
      success: true,
      data: formattedData,
      meta: {
        plan: tenant?.plan || "FREE",
        limit,
        currentMonthUsage,
      },
    });
  } catch (error) {
    console.error("Get usage summary error:", error);
    res.status(500).json({ success: false, message: "Failed to get usage" });
  }
};
