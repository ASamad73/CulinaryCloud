const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // your existing Cloudinary config

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "recipe_videos",
    resource_type: "video",
    format: async (req, file) => "mp4", // you can adjust if needed
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const uploadVideo = multer({ storage: storage });

module.exports = uploadVideo;