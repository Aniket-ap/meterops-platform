const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Request Logger for Debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

const { CORS_ORIGINS, FRONTEND_URL } = require("./config");
const originsList = (CORS_ORIGINS || FRONTEND_URL || "").split(",").map((o) => o.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!originsList.length) return callback(null, true);
    if (originsList.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Force Preflight Handling - Regex for all paths
app.options(/(.*)/, cors(corsOptions));

// Body parser
app.use(express.json());

// Logger
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "MeterOps API is running" });
});

// ❗ Error middleware LAST
app.use(errorMiddleware);

module.exports = app;
