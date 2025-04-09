const express = require('express');
const Recipe = require('../models/Recipe');
const Like = require('../models/Like');  
const Comment = require('../models/Comment');  

const authMiddleware = require('../middleware/auth'); 
const guestMiddleware = require('../middleware/guest');


const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});


// POST /recipes - Create a new recipe
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.existingImage || ''; 

    if (req.file) {
      const b64 = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'recipes',
        width: 800,
        height: 600,
        crop: 'limit'
      });
      imageUrl = result.secure_url;
    }

    const newRecipe = new Recipe({
      title: req.body.title,
      steps: JSON.parse(req.body.steps || '[]'), // If you're sending steps as JSON string
      image: imageUrl,
      caption: req.body.caption,
      user: req.user.id,
      // Make sure categories adhere to the limit set in your schema
      categories: req.body.categories ? JSON.parse(req.body.categories) : []
    });

    const savedRecipe = await newRecipe.save();
    res.json(savedRecipe);
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).send('Server error');
  }
});


// // CREATE recipe (protected)
// router.post('/', authMiddleware, async (req, res) => {
//   const { title, steps, image, caption, categories } = req.body;

//   // Predefined list of allowed categories (should match the schema)
//   const ALLOWED_CATEGORIES = [
//     "Biryani Varieties",
//     "Nihari Delicacies",
//     "Karahi Creations",
//     "Korma Specialties",
//     "Haleem Masterpieces",
//     "Kebab Assortments",
//     "Tandoori Treats",
//     "Curry Classics",
//     "Pulao Dishes",
//     "Daal Delights",
//     "Chaat Sensations",
//     "Paratha Varieties",
//     "Naan & Flatbreads",
//     "Samosa Selections",
//     "Pakora & Bhaji",
//     "Pickles & Chutneys",
//     "Raita & Yogurt Dishes",
//     "Saag & Green Vegetable Curries",
//     "Vegetable Curries",
//     "Mughlai Influences",
//     "Street Food Specialties",
//     "Seafood Selections",
//     "Traditional Desserts",
//     "Rice Puddings & Kheer",
//     "Sheer Khurma",
//     "Lassi & Yogurt Drinks",
//     "Chai Varieties",
//     "Halwa Creations",
//     "Salad & Raita Innovations",
//     "Fusion Desi Snacks"
//   ];

//   // Validate that categories is an array and has at most 3 items
//   if (!Array.isArray(categories) || categories.length > 3) {
//     return res.status(400).json({ msg: 'Please select up to 3 categories.' });
//   }

//   // Validate each selected category is allowed
//   for (let cat of categories) {
//     if (!ALLOWED_CATEGORIES.includes(cat)) {
//       return res.status(400).json({ msg: `Invalid category selected: ${cat}` });
//     }
//   }

//   try {
//     const newRecipe = new Recipe({
//       title,
//       steps,
//       image,
//       caption,
//       categories,          // Saving the selected category strings
//       user: req.user.id
//     });

//     await newRecipe.save();
//     res.status(201).json(newRecipe);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

router.get('/quick', guestMiddleware, async (req, res) => {
  try {
    // Use aggregation to compute the total time in minutes for each recipe
    const recipes = await Recipe.aggregate([
      {
        $addFields: {
          totalTime: {
            $sum: {
              $map: {
                input: "$steps",
                as: "step",
                in: {
                  $add: [
                    { $multiply: [{ $ifNull: ["$$step.time.hours", 0] }, 60] },
                    { $ifNull: ["$$step.time.minutes", 0] }
                  ]
                }
              }
            }
          }
        }
      },
      { $match: { totalTime: { $lte: 30 } } },
      {
        $lookup: {
          from: "users",            // collection name for User documents
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
      }
    ]);
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


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


// GET recipes made by the authenticated user
router.get('/myrecipes', authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });  

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

    const stepByStep = {
      title: recipe.title,
      steps: recipe.steps.map((step, index) => ({
        stepNumber: index + 1,
        description: step.description,
        ingredients: step.ingredients,
        quantity: steps.quantity,
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


router.get('/search', guestMiddleware, async (req, res) => {
  try {
    const { ingredient, cuisine, page = 1, limit = 10 } = req.query;
    const queryObject = {};

    if (ingredient) {
      const regex = new RegExp(ingredient, 'i'); // 🔧 create a regex once
      queryObject.$or = [
        { "steps.ingredients": regex },
        { "title": regex }
      ];
    }
    

    if (cuisine) {
      queryObject.categories = { $regex: cuisine, $options: "i" };
    }

    if (Object.keys(queryObject).length === 0) {
      return res.status(400).json({ msg: "No search parameters provided." });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log("queryObject being used:", queryObject);
    console.log("ingredient:", ingredient);
    console.log("typeof ingredient:", typeof ingredient);
    const recipes = await Recipe.find(queryObject)
      .populate("user", "username")
      .skip(skip)
      .limit(parseInt(limit));

    res.json(recipes);
  } catch (err) {
    console.error("Error in /search:", err.message);
    res.status(500).json({ msg: "Server error" }); // 
  }
});

// --------added by Azaan

router.get('/liked', authMiddleware, async (req, res) => {
  try {
    const likedRecipes = await Like.find({ user: req.user.id }).select('recipe');
    const likedIds = likedRecipes.map(like => like.recipe.toString());
    res.json(likedIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// --------added by Azaan

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
