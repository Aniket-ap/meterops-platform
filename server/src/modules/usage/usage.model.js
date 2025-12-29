const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      index: true,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    feature: {
      type: String,
      required: true,
      index: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Compound index for analytics
usageSchema.index({ tenantId: 1, feature: 1, createdAt: 1 });

module.exports = mongoose.model("Usage", usageSchema);
