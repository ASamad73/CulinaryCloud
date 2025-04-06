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
  title: { type: String, required: true },
  steps: [StepSchema],
  image: String,
  caption: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },

    //Precomputed fields for the lieks and comments onn a post
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 }
});


module.exports = mongoose.model('Recipe', RecipeSchema);
