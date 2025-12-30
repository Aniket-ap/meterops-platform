module.exports = {
  FREE: {
    LIST_USERS: 1000,
    maxMonthlyRequests: 100,
  },
  PRO: {
    LIST_USERS: 10000,
    maxMonthlyRequests: 10000,
  },
  ENTERPRISE: {
    LIST_USERS: Infinity,
    maxMonthlyRequests: Infinity,
  },
};
