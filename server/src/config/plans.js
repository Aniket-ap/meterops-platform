module.exports = {
  FREE: {
    LIST_USERS: 1000, // Increased from 20 to prevent premature blocking during dev/testing
  },
  PRO: {
    LIST_USERS: 10000,
  },
  ENTERPRISE: {
    LIST_USERS: Infinity,
  },
};
