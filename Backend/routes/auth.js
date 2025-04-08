const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User'); // Adjust the path as needed

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// JWT secret (should come from a config file or environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Registration Route updated for file upload
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { email, password } = req.body;
  // Dietary preferences were sent as a JSON string; parse it.
  const dietaryPreferences = req.body.dietaryPreferences ? JSON.parse(req.body.dietaryPreferences) : [];
  
  // If a file is uploaded, get its path; otherwise, default to empty string.
  const profilePicture = req.file ? req.file.path : '';

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the new user with the file path as profilePicture
    user = new User({
      email,
      password: hashedPassword,
      profilePicture,  
      dietaryPreferences
    });
    
    await user.save();

    // Generate JWT
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Return token and success message
    res.status(201).json({ msg: 'User registered successfully', token });

  } catch (err) {
    if (err.name === 'ValidationError') {
      let errorMessage = 'Validation error';
      if (err.errors && err.errors.email) {
        errorMessage = err.errors.email.message;
      }
      return res.status(400).json({ msg: errorMessage });
    }

    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  // Extract email and password from the request body.
  // We're using email since that's what our user schema uses.
  // console.log("Login request body:", req.body);
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create payload for JWT
    const payload = { user: { id: user.id } };

    // Sign the token and set an expiration (e.g., 1 hour)
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ensure you have JWT_SECRET defined in your .env file.
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
