const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const passport = require('passport');
const User = require('../models/User'); // Adjust the path as needed

require('../middleware/passportConfig');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/* Google Authentication Routes */

// Route to start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route - Updated version: No sessions, then redirect with token
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // After successful Google authentication, generate a JWT token.
    const payload = { user: { id: req.user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    
    // Redirect the user to your frontend Dashboard with the token as a query parameter.
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    
    // Alternatively, you could return JSON if you're handling the redirect on the client.
    // res.json({ token, msg: 'Google authentication successful' });
  }
);

/* Local Registration Route */
// This route now saves the local password under `auth.local.password` per the new schema.
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { email, password } = req.body;
  // Parse dietary preferences if provided
  const dietaryPreferences = req.body.dietaryPreferences ? JSON.parse(req.body.dietaryPreferences) : [];
  // If a file is uploaded, get its path; otherwise, use an empty string.
  const profilePicture = req.file ? req.file.path : '';

  try {
    // Check if a user with the given email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the new user with the local credentials stored in `auth.local`
    user = new User({
      email,
      auth: {
        local: { password: hashedPassword }
      },
      profilePicture,
      dietaryPreferences
    });
    
    await user.save();

    // Generate a JWT for the newly registered user
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
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

/* Local Login Route */
// This route compares the provided password with the value stored in `auth.local.password`
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email. Make sure that the user has local auth data.
    const user = await User.findOne({ email });
    if (!user || !user.auth || !user.auth.local || !user.auth.local.password) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.auth.local.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create JWT payload and sign the token
    const payload = { user: { id: user._id } };
    jwt.sign(
      payload,
      JWT_SECRET,
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
