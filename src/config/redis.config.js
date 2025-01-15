import { Redis } from "ioredis";
import environmentConfig from "./environment.config.js";

const redisClient = () => {
  if (environmentConfig.REDIS_URI) {
    console.log(`Redis connected`);
    return environmentConfig.REDIS_URI;
  }
  throw new Error("Redis connection failed");
};

export const redis = new Redis(redisClient())