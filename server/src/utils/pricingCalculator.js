const pricing = require('../config/pricing');

/**
 * Calculates the bill based on the plan and total usage.
 * Centralized logic to ensure consistency across the application.
 * 
 * @param {string} plan - The plan name (FREE, PRO, ENTERPRISE)
 * @param {number} usageCount - The total usage count for the period
 * @returns {object} - { basePrice, overageCost, totalAmount, currency }
 */
const calculateBill = (plan, usageCount) => {
  // 1. Get pricing rules, default to FREE if invalid plan
  const rules = pricing[plan] || pricing.FREE;

  // 2. Extract values
  const basePrice = rules.basePrice;
  const included = rules.includedRequests;
  const rate = rules.overageRate;

  // 3. Calculate overage
  // If included is Infinity (Enterprise), overageCount will be 0 (Math.max handles -Infinity)
  const overageCount = Math.max(0, usageCount - included);
  
  // 4. Calculate costs
  const overageCost = overageCount * rate;
  const totalAmount = basePrice + overageCost;

  // 5. Return consistently rounded values (2 decimal places)
  return {
    basePrice: Number(basePrice.toFixed(2)),
    overageCost: Number(overageCost.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    currency: 'INR'
  };
};

module.exports = { calculateBill };
