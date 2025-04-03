const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  ingredients: [String],
  description: String,
  time: {
    hours: Number,
    minutes: Number
  }
});

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  steps: [StepSchema],
  image: String, // store image URL or filename
  caption: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
