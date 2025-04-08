const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

// Configure multer to store file in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    // If a file was uploaded, use its buffer and mimetype; otherwise use the provided field (if applicable)
    let profilePictureData;
    if (req.file) {
      profilePictureData = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    } else {
      // Optionally handle if no file is provided
      profilePictureData = req.body.profilePicture || undefined;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePicture: profilePictureData,
        dietaryPreferences: req.body.dietaryPreferences // make sure this is an array
      },
      { new: true }
    );
    
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
