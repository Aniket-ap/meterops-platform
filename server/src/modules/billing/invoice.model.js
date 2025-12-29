const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    month: {
      type: String, // YYYY-MM
      required: true,
    },

    items: [
      {
        feature: String,
        usage: Number,
        rate: Number,
        amount: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ tenantId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
