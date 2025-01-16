import jwt from "jsonwebtoken";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import environmentConfig from "../config/environment.config.js";
import { getUserById } from "../services/user.service.js";
import { redis } from "../config/redis.config.js";
import { CatchAsyncError } from "../middleware/catchAsyncError.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../config/jwt.config.js";
import ErrorHandler from "../config/ErrorHandler.config.js";
import UserModel from "../models/user.model.js";
import sendMail from "../config/sendMail.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    environmentConfig.ACTIVATION_SECRET,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// register user
export const registrationUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const isEmailExist = await UserModel.findOne({ email });

    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user = {
      name,
      email,
      password,
    };

    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail.ejs"),
      data
    );

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
        activationToken: activationToken.token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// login user
export const loginUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid password", 400));
    }

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// logout user
export const logoutUser = CatchAsyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    const userId = req.user?._id;

    if (userId) await redis.del(userId);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update access token
export const updateAccessToken = CatchAsyncError(async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      return next(new ErrorHandler("Refresh token not provided", 400));
    }

    const decoded = jwt.verify(refresh_token, environmentConfig.REFRESH_TOKEN);
    if (!decoded) {
      return next(new ErrorHandler("Invalid refresh token", 400));
    }

    const session = await redis.get(decoded.id);
    if (!session) {
      return next(
        new ErrorHandler("Session expired. Please log in again.", 400)
      );
    }

    const user = JSON.parse(session);

    const accessToken = jwt.sign(
      { id: user._id },
      environmentConfig.ACCESS_TOKEN,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      environmentConfig.REFRESH_TOKEN,
      { expiresIn: "3d" }
    );

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get user info
export const getUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    getUserById(userId, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// activate user
export const activateUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { activation_token, activation_code } = req.body;

    console.log("ACTIVATION_TOKEN ===>", activation_token)
    console.log("ACTIVATION_CODE ===>", activation_code)

    const newUser = jwt.verify(
      activation_token,
      environmentConfig.ACTIVATION_SECRET
    );

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const existUser = await UserModel.findOne({ email });

    if (existUser) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// social auth
export const socialAuth = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email, provider } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      sendToken(user, 200, res);
    } else {
      const newUser = await UserModel.create({ email, name, provider });
      sendToken(newUser, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// crypto auth
export const cryptoAuth = CatchAsyncError(async (req, res, next) => {
  try {
    const { walletAddress, provider } = req.body;

    const user = await UserModel.findOne({ walletAddress });

    if (user) {
      sendToken(user, 200, res);
    } else {
      const newUser = await UserModel.create({ walletAddress, provider });
      sendToken(newUser, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
