module.exports = {
  FREE: {
    basePrice: 0,
    includedRequests: 100, // Hard limit enforced elsewhere
    overageRate: 0,
    unlimited: false,
  },
  PRO: {
    basePrice: 499,
    includedRequests: 5000,
    overageRate: 0.05, // ₹0.05 per request
    unlimited: false,
  },
  ENTERPRISE: {
    basePrice: 4999,
    includedRequests: Infinity,
    overageRate: 0,
    unlimited: true,
  },
};
