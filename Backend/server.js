const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');     // <-- New: Session middleware
const passport = require('passport');           // <-- New: Passport middleware

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173' // allow your frontend origin
}));

// Middleware to parse JSON bodies
// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and enable session support
require('./middleware/passportConfig');  // Load passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// A simple route to test the server
app.get('/', (req, res) => res.send('API running'));

// Route imports
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const commentRoutes = require('./routes/comment');
const userRoutes = require('./routes/user');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
