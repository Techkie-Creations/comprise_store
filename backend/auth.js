import express from "express";
import bcrypt from "bcrypt";
import User from "./models/UserModel.js";
import ForgotPassword from "./models/ForgotPassword.js";
import jwt from "jsonwebtoken";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshAccess,
  updateRefreshToken,
} from "./middlewares/tokens.js";
import { upload } from "./middlewares/multer.js";
// import { uploadAvatar } from "./cloud-config.js";
import { v2 as cloudinary } from "cloudinary";
import { fullName } from "./utils/formatters.js";
import { codeGenerator } from "./utils/codeGenerator.js";
import cookieParser from "cookie-parser";
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// /api/auth

router.use(cookieParser());

// register
router.post("/register", upload.single("avatar"), async (req, res) => {
  const { firstName, lastName, email, password, defaultAvatar } = req.body;

  console.log("AVATAR", req.file);
  // Check if required fields are provided
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ level: "root", message: "Please provide all required fields" });
  }

  // Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      level: "email",
      message: "Email already exists",
    });
  }

  // Upload avatar and get the secure url
  let avatarUrl =
    "https://res.cloudinary.com/dz6l4si8o/image/upload/v1727288194/Comprise%20Store%20Avatars/etgiuox9g1pwei4qo6w0.png";
  if (defaultAvatar === "false") {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const clouded = await cloudinary.uploader.upload(dataURI, {
        folder: "Comprise Store Avatars",
      });
      console.log(clouded, "CLOUDED");
      avatarUrl = clouded.secure_url;
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Failed to create user", err: err.message });
    }
  }

  // Create a new user instance with hashed password and save to the database
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
    refreshToken: "",
    avatar: avatarUrl,
  });

  // Save the user to the database and send a success response with the user object
  try {
    await newUser.save();

    // Create refresh token and update in database
    // let refreshToken = jwt.sign(
    //   { id: newUser._id },
    //   process.env.REFRESH_JWT_TOKEN,
    //   {
    //     expiresIn: '3h',
    //     issuer: `http://localhost:${process.env.PORT || 3000}`,
    //   }
    // );

    let refreshToken = generateRefreshToken(newUser._id);

    const updatedToken = await updateRefreshToken(newUser._id, refreshToken);
    if (!updatedToken)
      return res
        .status(500)
        .json({ success: false, message: "Failed to update refresh token" });

    res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 7 * 60 * 60 * 1000),
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .cookie("accessToken", generateToken(newUser._id), {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        domain: "localhost",
        path: "/",
      });
    res.status(201).json({
      userId: newUser._id,
      success: true,
      message: "Logged in successfully",
      avatarUrl: newUser.avatar,
      name: fullName(newUser.firstName, newUser.lastName),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error... Try Again Later!",
      error: error.message,
    });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if required fields are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  // Check if user exists in the database and if the password matches the hashed password stored in the database
  try {
    const userDetails = await User.findOne(
      { email: email },
      "firstName lastName email password avatar"
    );

    // Verify if user exists in the database
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        level: "root",
        message: "Invalid Email or Password!",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, userDetails.password);
    if (!isMatch) {
      return res.status(401).json({
        level: "root",
        success: false,
        message: "Invalid Email or Password!",
      });
    }

    // Generate an access token using JWT
    let refreshToken = generateRefreshToken(userDetails._id);

    const updatedToken = await updateRefreshToken(
      userDetails._id,
      refreshToken
    );
    if (!updatedToken) {
      // console.log("Failed to create token!", updatedToken);
      return res.status(403).json({
        success: false,
        level: "root",
        message: "Server Error... Please Try Again Later!",
      });
    }
    // console.log(userDetails._id.toString());
    res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 7 * 60 * 60 * 1000),
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .cookie("accessToken", generateToken(userDetails._id), {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        domain: "localhost",
        path: "/",
      });
    res.status(200).json({
      userId: userDetails._id.toString(),
      success: true,
      message: "Logged in successfully",
      avatarUrl: userDetails.avatar,
      name: fullName(userDetails.firstName, userDetails.lastName),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, level: "root", error: "Server error" });
  }
});

// Forgot Password

router.post("/resetPassword", async (req, res) => {
  const { id, data, email } = req.body;
  console.log(id);
  console.log(email);
  console.log(data);
  // console.log(codeGenerator());
  if (id === "email") {
    const userDetails = await User.findOne({ email: data });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        level: "email",
        message: "Email Does Not Exist! Sign Up!!",
      });
    }
    const exsitingResetUser = await ForgotPassword.findOne({ email: data });
    const randomCode = codeGenerator();
    console.log(randomCode);
    if (!exsitingResetUser) {
      const forgotUser = new ForgotPassword({
        email: data,
        code: randomCode,
        usedCode: false,
        passwdResetCount: 0,
      });
      try {
        await forgotUser.save();
      } catch (err) {
        return res.status(500).json({
          success: false,
          level: "root",
          message: "Server Error... Try Again Later!",
          error: err,
        });
      }
      return res
        .status(201)
        .json({ success: true, level: "email", message: "Valid Email!" });
    }
    try {
      const returned = await ForgotPassword.findOneAndUpdate(
        { email: data },
        { code: randomCode, usedCode: false },
        { new: true }
      );
      console.log(returned, "RETURNED");
      return res
        .status(200)
        .json({ success: true, message: "Forgot Password Initialized!" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error... Try Again Later!" });
    }
  }
  if (id === "code") {
    const userCode = await ForgotPassword.findOne(
      { email: email },
      "code usedCode"
    );
    if (!userCode)
      return res.status(500).json({
        success: false,
        level: "root",
        message: "Server Error... Try Again Later!",
      });
    if (userCode.usedCode) {
      return res.status(404).json({
        success: false,
        level: "root",
        message: "Follow The Proper Reset Process!",
      });
    }
    if (data !== userCode.code)
      return res
        .status(406)
        .json({ success: false, level: "code", message: "Code is invalid" });
    return res.status(200).json({ success: true, message: "Code is valid!" });
  }

  if (id === "password") {
    const cryptedPassword = await bcrypt.hash(data, 10);
    try {
      const userReturn = await User.findOneAndUpdate(
        { email: email },
        { password: cryptedPassword },
        { new: true }
      );
      console.log(userReturn, "updated");
      await ForgotPassword.findOneAndUpdate(
        { email: email },
        {
          usedCode: true,
          $inc: { passwdResetCount: 1 },
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        level: "root",
        message: "Password is updated!!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        level: "root",
        message: "Server Error... Try Again!",
        error: err,
      });
    }
  }
});

//
router.post("/token", async (req, res) => {
  const { userId } = req.body;
  let refreshedToken = await verifyRefreshAccess(userId);
  if (!refreshedToken)
    return res
      .status(403)
      .json({ success: false, message: "Failed to create token!" });
  res.status(201).json({ success: true, refreshedToken });
});

// logout
router.post("/logout", async (req, res) => {
  const { accessToken } = req.cookies;
  // Delete the refresh token from the database
  const userId = jwt.decode(accessToken);
  await updateRefreshToken(userId.id, "");
  // Delete cookies on client's session
  res.clearCookie("accessToken", {
    path: "/",
    domain: "localhost",
  });
  res.clearCookie("refreshToken", {
    path: "/",
    domain: "localhost",
    httpOnly: true,
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

export default router;
