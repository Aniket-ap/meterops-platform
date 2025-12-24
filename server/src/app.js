const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");

const app = express();

// Middlewares
app.use(cors({
  origin: true, // Reflects the request origin, effectively allowing all
  credentials: true // Allow cookies/auth headers
}));
app.options("*", cors()); // Handle preflight requests
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "MeterOps API is running",
  });
});

module.exports = app;
