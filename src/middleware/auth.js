import jwt from "jsonwebtoken";

import environmentConfig from "../config/environment.config.js";
import ErrorHandler from "../config/ErrorHandler.config.js";
import { redis } from "../config/redis.config.js";
import { CatchAsyncError } from "./catchAsyncError.js";

// authenticated user
export const isAutheticated = CatchAsyncError(async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource!", 400));
  }

  const decoded = jwt.verify(access_token, environmentConfig.ACCESS_TOKEN);

  if (!decoded) {
    return next(new ErrorHandler("Access token is not valid", 400));
  }

  const user = await redis.get(decoded.id);

  if (!user) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  req.user = JSON.parse(user);

  next();
});
