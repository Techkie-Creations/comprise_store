import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { env } from "../utils/env.js";

dotenv.config();

export const generateToken = (userId) => {
  let accessToken = jwt.sign({ id: userId }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "2h",
    issuer: `http://localhost:${process.env.PORT || 3000}`,
  });
  return accessToken;
};

export const generateRefreshToken = (userId) => {
  let refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_JWT_TOKEN, {
    expiresIn: "5h",
    issuer: `http://localhost:${process.env.PORT || 3000}`,
  });
  return refreshToken;
};

export const verifyRefreshAccess = async (userId, refreshToken) => {
  // const userInfo = await User.findById(userId, "refreshToken");
  // if (!userInfo) return null;
  let refreshedAccess = await jwt.verify(
    refreshToken,
    process.env.REFRESH_JWT_TOKEN,
    (err, _) => {
      if (err) {
        return null;
      }
      return generateToken(userId);
    }
  );
  if (!refreshedAccess) {
    return null;
  }
  return refreshedAccess;
};

export const validateToken = async (req, res, next) => {
  let { accessToken, refreshToken } = req.cookies;
  if (!refreshToken) {
    res.clearCookie("accessToken", {
      path: "/",
      domain: "localhost",
    });
    res.clearCookie("refreshToken", {
      path: "/",
      domain: "localhost",
      httpOnly: true,
    });
    return res.status(403).json({ message: "Unauthorized Access" });
  }
  const decoded = jwt.decode(refreshToken);
  const token = await jwt.verify(
    accessToken,
    process.env.ACCESS_JWT_SECRET,
    async (err, _) => {
      if (err) {
        const refreshedToken = await verifyRefreshAccess(
          decoded.id,
          refreshToken
        );
        if (!refreshedToken) return null;
        return refreshedToken;
      }
      return accessToken;
    }
  );
  if (!token) {
    res.clearCookie("accessToken", {
      path: "/",
      domain: "localhost",
    });
    res.clearCookie("refreshToken", {
      path: "/",
      domain: "localhost",
      httpOnly: true,
    });
    return res.status(403).json({ message: "Session Expired!!" });
  }
  req.info = { userId: decoded.id, token };
  next();
};

export const updateRefreshToken = async (id, token) => {
  try {
    if (
      !(await User.findByIdAndUpdate(
        { _id: id },
        { refreshToken: token },
        { new: true }
      ))
    ) {
      console.log("Failed to Update Refresh Token");
      return false;
    }
    return true;
  } catch (error) {
    console.log("Server Error:", error.message);
    return false;
  }
};
