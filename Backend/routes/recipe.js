const express = require('express');
const Recipe = require('../models/Recipe');
const Like = require('../models/Like');  // Import the Like model
const Comment = require('../models/Comment');  // Import the Like model

const authMiddleware = require('../middleware/auth'); // JWT check
const guestMiddleware = require('../middleware/guest');
const router = express.Router();

// CREATE recipe (protected)
router.post('/', authMiddleware, async (req, res) => {
  const { title, steps, image, caption, categories } = req.body;

  // Predefined list of allowed categories (should match the schema)
  const ALLOWED_CATEGORIES = [
    "Biryani Varieties",
    "Nihari Delicacies",
    "Karahi Creations",
    "Korma Specialties",
    "Haleem Masterpieces",
    "Kebab Assortments",
    "Tandoori Treats",
    "Curry Classics",
    "Pulao Dishes",
    "Daal Delights",
    "Chaat Sensations",
    "Paratha Varieties",
    "Naan & Flatbreads",
    "Samosa Selections",
    "Pakora & Bhaji",
    "Pickles & Chutneys",
    "Raita & Yogurt Dishes",
    "Saag & Green Vegetable Curries",
    "Vegetable Curries",
    "Mughlai Influences",
    "Street Food Specialties",
    "Seafood Selections",
    "Traditional Desserts",
    "Rice Puddings & Kheer",
    "Sheer Khurma",
    "Lassi & Yogurt Drinks",
    "Chai Varieties",
    "Halwa Creations",
    "Salad & Raita Innovations",
    "Fusion Desi Snacks"
  ];

  // Validate that categories is an array and has at most 3 items
  if (!Array.isArray(categories) || categories.length > 3) {
    return res.status(400).json({ msg: 'Please select up to 3 categories.' });
  }

  // Validate each selected category is allowed
  for (let cat of categories) {
    if (!ALLOWED_CATEGORIES.includes(cat)) {
      return res.status(400).json({ msg: `Invalid category selected: ${cat}` });
    }
  }

  try {
    const newRecipe = new Recipe({
      title,
      steps,
      image,
      caption,
      categories,          // Saving the selected category strings
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


// added by Azaan ----------------------------------------------------------------------

// Step-by-Step Cooking Mode
router.get('/:id/step-by-step', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Extract the step-by-step data
    const stepByStep = {
      title: recipe.title,
      steps: recipe.steps.map((step, index) => ({
        stepNumber: index + 1,
        description: step.description,
        ingredients: step.ingredients,
        timer: step.time ? {
          hours: step.time.hours || 0,
          minutes: step.time.minutes || 0
        } : null
      }))
    };

    res.json(stepByStep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// added by Azaan ----------------------------------------------------------------------

// New Search & Filtering Endpoint
// Place this above the GET single recipe route (router.get('/:id', ...))
router.get('/search', guestMiddleware, async (req, res) => {
  try {
    const { ingredient, cuisine, page = 1, limit = 10 } = req.query;
    const queryObject = {};

    // If an ingredient is provided, search in both steps.ingredients and title using $or
    if (ingredient) {
      queryObject.$or = [
        { "steps.ingredients": { $regex: ingredient, $options: "i" } },
        { "title": { $regex: ingredient, $options: "i" } }
      ];
    }

    // If a cuisine is provided, filter by categories
    if (cuisine) {
      queryObject["categories"] = { $regex: cuisine, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const recipes = await Recipe.find(queryObject)
      .populate('user', 'username')
      .skip(skip)
      .limit(parseInt(limit));

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
