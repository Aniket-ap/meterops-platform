const Usage = require("../usage/usage.model");
const Invoice = require("./invoice.model");
const pricing = require("../../config/pricing");
const Tenant = require("../tenant/tenant.model");

exports.generateMonthlyInvoice = async (tenantId, month) => {
  const tenant = await Tenant.findById(tenantId);
  const plan = tenant.plan;

  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const usage = await Usage.aggregate([
    {
      $match: {
        tenantId,
        createdAt: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: "$feature",
        totalUsage: { $sum: "$quantity" },
      },
    },
  ]);

  let totalAmount = 0;
  const items = [];

  usage.forEach((u) => {
    const rate = pricing[u._id]?.[plan] || 0;
    const amount = u.totalUsage * rate;
    totalAmount += amount;

    items.push({
      feature: u._id,
      usage: u.totalUsage,
      rate,
      amount,
    });
  });

  return Invoice.create({
    tenantId,
    month,
    items,
    totalAmount,
  });
};
