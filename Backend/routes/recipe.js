const express = require('express');
const Recipe = require('../models/Recipe');
const Like = require('../models/Like');  // Import the Like model
const Comment = require('../models/Comment');  // Import the Like model

const authMiddleware = require('../middleware/auth'); // JWT check
const guestMiddleware = require('../middleware/guest');
const router = express.Router();

// CREATE recipe (protected)
router.post('/', authMiddleware, async (req, res) => {
  const { title, steps, image, caption } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      steps,
      image,
      caption,
      user: req.user.id
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);   //A successful creation returns status 201 with the new recipe data.
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET all recipes (public)
// router.get('/', async (req, res) => {
//   try {
//     const recipes = await Recipe.find().populate('user', 'username');
//     res.json(recipes);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GET limited recipes (public)
router.get('/', guestMiddleware, async (req, res) => {
  try {
    // If req.user exists, the user is authenticated (no limit)
    // Otherwise, limit to 5 recipes for guests
    const query = Recipe.find().populate('user', 'username');
    if (!req.user) {
      query.limit(5);
    }
    const recipes = await query;
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// GET single recipe by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'username');
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// UPDATE a recipe (only by owner)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Check if the recipe belongs to the logged-in user
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this recipe' });
    }

    // Update allowed fields
    const { title, steps, image, caption } = req.body;

    if (title !== undefined) recipe.title = title;
    if (steps !== undefined) recipe.steps = steps;
    if (image !== undefined) recipe.image = image;
    if (caption !== undefined) recipe.caption = caption;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE a recipe (only by owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Make sure the logged-in user is the owner
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this recipe' });
    }

    // Delete the recipe safely
    await Recipe.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


//we are liking a post here
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

    const existingLike = await Like.findOne({
      recipe: req.params.id,
      user: req.user.id
    });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Recipe.findByIdAndUpdate(req.params.id, { $inc: { likeCount: -1 } });
      return res.json({ msg: 'Like removed' });
    } else {
      const newLike = new Like({
        recipe: req.params.id,
        user: req.user.id
      });
      await newLike.save();
      await Recipe.findByIdAndUpdate(req.params.id, { $inc: { likeCount: 1 } });
      return res.json({ msg: 'Recipe liked successfully' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




module.exports = router;
