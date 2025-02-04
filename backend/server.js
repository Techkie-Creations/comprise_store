import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DBconfig/dbconfig.js";

import authRouter from "./auth.js";
import wishbagRouter from "./wishbag.js";
import { validateToken } from "./middlewares/tokens.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import User from "./models/UserModel.js";
import { fullName } from "./utils/formatters.js";
// import beautyRouter from "./misc/beauty.js";
import fs from "fs";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://127.0.0.1:5173",
  optionsSuccessStatus: 200,
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/avatar", express.static("avatar"));

app.post("/api/test", validateToken, async (req, res) => {
  const userId = req.info;
  const validUser = await User.findById(userId, "firstName lastName avatar");
  const name = fullName(validUser.firstName, validUser.lastName);
  return res.status(200).json({
    userId: validUser._id,
    success: true,
    message: "Valid refresh token!!",
    avatarUrl: validUser.avatar,
    name,
  });
});

app.post("/api/products", (req, res) => {
  const { data } = req.body;
  console.log(data);
  res.status(200).json({ success: true, message: "completed!" });
  fs.writeFile("skincare.json", JSON.stringify(data), function (err) {
    if (err) {
      console.log(err);
    }
  });
});

app.use("/api/auth", authRouter);
app.use("/api/wishbag", wishbagRouter);
// app.use("/api/derma", beautyRouter);

// tester();

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});
