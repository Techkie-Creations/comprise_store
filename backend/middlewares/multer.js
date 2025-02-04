import multer from "multer";
import path from "path";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./avatar/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

export const storage = new multer.memoryStorage();

export const upload = multer({ storage: storage });
