import express from "express";
import Beauty from "../models/BeautyModel.js";
const router = express.Router();

router.get("/beauty", async (req, res) => {
  try {
    let beautyData = await Beauty.find({});
    res.status(200).json({ success: true, data: beautyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      data: "Server Error... Try Again Later!",
    });
  }
});

router.get("/skincare", (req, res) => {
  res.send("Welcome to the skincare section");
});

export default router;
