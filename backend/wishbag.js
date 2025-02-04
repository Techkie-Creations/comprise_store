import express from "express";
import cookieParser from "cookie-parser";
import { validateToken } from "./middlewares/tokens.js";
const router = express.Router();

router.use(cookieParser());

router.get("/", validateToken, async (req, res) => {
  const userId = req.info;
  return res
    .status(200)
    .json({ success: true, message: "This is WishBag", userId });
});

export default router;
