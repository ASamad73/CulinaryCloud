const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "recipe_videos",
    resource_type: "video",
    format: async (req, file) => "mp4",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});


const videoFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Only MP4 videos are allowed"), false);
  }
};

const uploadVideo = multer({
  storage: storage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, 
});

module.exports = uploadVideo;