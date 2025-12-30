module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  FRONTEND_URL: process.env.FRONTEND_URL || process.env.CLIENT_URL,
  APP_URL: process.env.APP_URL || process.env.FRONTEND_URL || process.env.CLIENT_URL,
  CORS_ORIGINS: process.env.CORS_ORIGINS || process.env.FRONTEND_URL || process.env.CLIENT_URL,
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};
