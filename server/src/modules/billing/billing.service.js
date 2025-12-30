const Usage = require("../usage/usage.model");
const Invoice = require("./invoice.model");
const pricing = require("../../config/pricing");
const Tenant = require("../tenant/tenant.model");
const mongoose = require("mongoose");
const { calculateBill } = require("../../utils/pricingCalculator");

exports.generateMonthlyInvoice = async (tenantId, month) => {
  // Check if invoice already exists
  const existingInvoice = await Invoice.findOne({ tenantId, billingMonth: month });
  if (existingInvoice) {
    return existingInvoice;
  }

  const tenant = await Tenant.findById(tenantId);
  const plan = tenant.plan;


  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const usage = await Usage.aggregate([
    {
      $match: {
        tenantId: new mongoose.Types.ObjectId(tenantId),
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

  let totalUsageCount = 0;
  const usageSummary = {};

  usage.forEach((u) => {
    totalUsageCount += u.totalUsage;
    usageSummary[u._id] = u.totalUsage;
  });

  // Calculate bill using centralized logic
  const { totalAmount } = calculateBill(plan, totalUsageCount);

  return Invoice.create({
    tenantId,
    billingMonth: month,
    usageSummary,
    plan,
    totalAmount,
    generatedAt: new Date(),
  });
};

exports.getTenantBillingSummary = async (tenantId) => {
  const tenant = await Tenant.findById(tenantId);
  const plan = tenant?.plan || "FREE";

  // 1. Calculate current month usage
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const usageAggregation = await Usage.aggregate([
    {
      $match: {
        tenantId: new mongoose.Types.ObjectId(tenantId),
        createdAt: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: "$feature",
        totalUsage: { $sum: "$quantity" },
      },
    },
  ]);

  const currentUsage = {};
  let totalUsageCount = 0;
  usageAggregation.forEach((u) => {
    currentUsage[u._id] = u.totalUsage;
    totalUsageCount += u.totalUsage;
  });

  // 2. Get latest invoice
  const latestInvoice = await Invoice.findOne({ tenantId })
    .sort({ billingMonth: -1 })
    .lean();

  // 3. Calculate total amount due (all PENDING invoices)
  const pendingInvoices = await Invoice.find({
    tenantId,
    status: "PENDING",
  });
  
  const totalAmountDue = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // 4. Estimate current month cost (Unbilled)
  const planPricing = pricing[plan] || pricing.FREE;
  const { totalAmount: estimatedCost } = calculateBill(plan, totalUsageCount);

  // Transform breakdown for API contract
  const usageBreakdown = Object.entries(currentUsage).map(([feature, total]) => ({
    feature,
    total
  }));

  return {
    plan,
    usageThisMonth: {
      total: totalUsageCount,
      breakdown: usageBreakdown
    },
    latestInvoice,
    totalAmountDue, // Keeping extra fields as they are useful
    estimatedCost,
    limit: planPricing.includedRequests // Keeping for UI progress bars
  };
};

exports.getTenantInvoices = async (tenantId) => {
  return Invoice.find({ tenantId })
    .sort({ billingMonth: -1 }) // Newest first
    .lean();
};
