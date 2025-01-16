import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import environmentConfig from "../config/environment.config.js";

const emailRegexPattern = /^[^\s@]+@[^/s@]+\.[^/s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return this.provider === "email" || this.provider === "google";
      },
    },
    email: {
      type: String,
      required: function () {
        return this.provider === "email" || this.provider === "google";
      },
      unique: true,
      validate: {
        validator: function (value) {
          if (this.provider === "email" || this.provider === "google") {
            return emailRegexPattern.test(value);
          }
          return true;
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
      required: function () {
        return this.provider != "email" && this.provider != "crypto";
      },
    },
    provider: {
      type: String,
      enum: ["email", "google", "crypto"],
      default: "email",
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return this.provider === "crypto";
      },
      validate: {
        validator: function (value) {
          return true;
        },
        message: "Please enter a valid wallet address",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ... (rest of the schema remains the same)

// hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, environmentConfig.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, environmentConfig.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
