import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAvatar = async (path) => {
  try {
    const results = await cloudinary.uploader.upload(path, {
      folder: "Comprise Store Avatars",
    });
    return results;
  } catch (e) {
    throw new Error("Upload failed: " + e.message);
  }
};
