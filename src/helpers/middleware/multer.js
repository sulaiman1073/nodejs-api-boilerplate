const multer = require("multer");
const { extname } = require("path");
const config = require("../../config");
const { ApiError } = require("../errors");

let storage;
if (config.mode === "production") {
  // S3 for production
  // https://www.npmjs.com/package/multer-s3

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.uploadsPathDev);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${extname(file.originalname)}`);
    }
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.uploadsPathDev);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${extname(file.originalname)}`);
    }
  });
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      return cb(null, true);
    }

    cb(new ApiError("Only jpg/jpeg/png image files are allowed", 400));
  },
  limits: { fileSize: 1000000 }
});

module.exports = upload;
