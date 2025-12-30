const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    billingMonth: {
      type: String, // YYYY-MM
      required: true,
    },

    usageSummary: {
      type: Map,
      of: Number, // feature -> quantity
      default: {},
    },

    plan: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ tenantId: 1, billingMonth: 1 }, { unique: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
