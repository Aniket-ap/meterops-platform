const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");

const app = express();

// Middlewares
const corsOptions = {
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));
// app.options("(.*)", cors(corsOptions)); // Removed: Redundant and causes PathError in Express 5
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
