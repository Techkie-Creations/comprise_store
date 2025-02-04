import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { env } from "../utils/env.js";

dotenv.config();

export const generateToken = (userId) => {
  let accessToken = jwt.sign({ id: userId }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "15s",
    issuer: `http://localhost:${process.env.PORT || 3000}`,
  });
  console.log(typeof userId, "USER OBJ:", userId);
  return accessToken;
};

export const generateRefreshToken = (userId) => {
  let refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_JWT_TOKEN, {
    expiresIn: "7h",
    issuer: `http://localhost:${process.env.PORT || 3000}`,
  });
  return refreshToken;
};

export const refreshAccessToken = async (userId, refreshToken) => {
  // const userInfo = await User.findById(userId, "refreshToken");
  // if (!userInfo) return null;
  let refreshedAccess;
  jwt.verify(refreshToken, process.env.REFRESH_JWT_TOKEN, (err, _) => {
    if (err) return null;
    refreshedAccess = generateToken(userId);
  });
  return refreshedAccess;
};

export const validateToken = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  const decoded = jwt.decode(accessToken);
  if (!accessToken || !refreshToken)
    return res.status(403).json({ message: "Unauthorized Access" });
  jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET, async (err, _) => {
    if (err) {
      const refreshedToken = await refreshAccessToken(decoded.id, refreshToken);
      if (!refreshedToken)
        return res.status(401).json({ message: "Unauthorized Access" });
    }
  });
  req.info = decoded.id;
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
