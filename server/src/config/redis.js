const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    // Retry with exponential backoff, max 2 seconds
    return Math.min(times * 50, 2000);
  },
});

redis.on("connect", () => {
  console.log("Redis connected");
});

let loggedError = false;

redis.on("error", (err) => {
  if (err.code === "ECONNREFUSED" && !loggedError) {
    console.warn(
      "Redis connection failed. Rate limiting will be disabled. (Suppressing further errors)"
    );
    loggedError = true;
  } else if (err.code !== "ECONNREFUSED") {
    console.error("Redis error", err);
  }
});

module.exports = redis;
