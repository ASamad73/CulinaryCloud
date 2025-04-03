const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

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
const recipeRoutes = require('./routes/recipe'); // ✅ Add this line here

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes); // This now works ✅

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
