// utils/videoUpload.js

const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

// Configure Cloudinary (you can keep your existing './cloudinary' file if you prefer)
cloudinary.config({
  cloud_name:    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:       process.env.CLOUDINARY_API_KEY,
  api_secret:    process.env.CLOUDINARY_API_SECRET,
  secure:        true,
});
// In-memory storage engine
const storage = multer.memoryStorage();

// Allow only MP4 videos and limit to 50 MB
const videoFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Only MP4 videos are allowed"), false);
  }
};

const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Middleware: take the buffer from multer, stream it to Cloudinary
function uploadVideoToCloudinary(req, res, next) {
  if (!req.file) return next();

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "recipe_videos",
      resource_type: "video",
      format: "mp4",
      public_id: req.file.originalname.split(".")[0],
    },
    (err, result) => {
      if (err) return next(err);
      // attach Cloudinary info to req.file
      req.file.cloudinary = result;
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
}

module.exports = {
  uploadVideo,           // use as middleware: uploadVideo.single('video')
  uploadVideoToCloudinary,
};
