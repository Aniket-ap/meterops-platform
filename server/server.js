require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
require("./src/modules/tenant/tenant.model");
require("./src/modules/user/user.model");

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
