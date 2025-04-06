const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registration Route
// Registration Route
router.post('/register', async (req, res) => {
  const { username, password, profilePicture, dietaryPreferences } = req.body;
  
  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create and save the new user with additional fields
    user = new User({
      username,
      password: hashedPassword,
      profilePicture: profilePicture || '',  // Use provided value or default
      dietaryPreferences: dietaryPreferences || [] // Use provided array or default to empty
    });
    
    await user.save();
    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });   //this is responding to the frontend
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });  //this is responding to the frontend
    }

    // Create payload for JWT
    const payload = { user: { id: user.id } };      // payload with user info

    // Sign the token and set an expiration (e.g., 1 hour) -- session lasts for 1 hour
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});





module.exports = router;
