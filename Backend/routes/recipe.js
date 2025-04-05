const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth'); // JWT check
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
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET all recipes (public)
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('user', 'username');
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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

module.exports = router;
