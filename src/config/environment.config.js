import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

export default {
  PORT: process.env.PORT || "8888",
  MONGODB_URI: process.env.MONGODB_URI || "",
  REDIS_URI: process.env.REDIS_URI || "",
  ACCESS_TOKEN: process.env.ACCESS_TOKEN || "",
  REFRESH_TOKEN: process.env.ACCESS_TOKEN || "",
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN || 5,
  REFRESH_TOKEN_EXPIRE: process.env.ACCESS_TOKEN || 3,
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || 0,
  SMTP_SERVICE: process.env.SMTP_SERVICE || "",
  SMTP_MAIL: process.env.SMTP_MAIL || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
  ACTIVATION_SECRET: process.env.ACTIVATION_SECRET || "",
  NODE_ENV: process.env.NODE_ENV || "production",
};
