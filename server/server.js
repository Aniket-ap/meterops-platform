require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
require("./src/modules/tenant/tenant.model");
require("./src/modules/user/user.model");

const PORT = process.env.PORT || 5000;

// Database connection logic
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      throw error;
    }
  }
};

require("./src/jobs/monthlyInvoice.job");
require("./src/jobs/usageCleanup.job");

// Start server if running directly (Local/VPS)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// Export for Vercel (Serverless)
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
