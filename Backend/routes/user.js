const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { profilePicture, dietaryPreferences } = req.body;
    
    // Find and update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePicture: profilePicture, // could add conditional checks here if desired
        dietaryPreferences: dietaryPreferences
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
