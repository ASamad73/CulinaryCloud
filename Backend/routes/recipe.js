// import dotenv from "dotenv";
// const dotenv = require('dotenv');
const express = require('express');
const Recipe = require('../models/Recipe');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const uploadVideo = require('../utils/videoUpload');
const authMiddleware = require('../middleware/auth');
const guestMiddleware = require('../middleware/guest');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { calculateUserScore, determineUserRank, updateUserRankAndScore } = require('../models/Gamification'); // Import the gamification functions

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
            categories: req.body.categories ? JSON.parse(req.body.categories) : [],
            videoUrls: JSON.parse(req.body.videoUrls || '[]')
        });

        const savedRecipe = await newRecipe.save();
        res.json(savedRecipe);

        try {
          const userId = req.user.id;
          const newScore = await calculateUserScore(userId);
          const newRank = determineUserRank(newScore);
          await updateUserRankAndScore(userId, newScore, newRank);
          console.log(`User ${userId} score updated after recipe creation.`);
        } catch (error) {
            console.error('Gamification error (create recipe):', error);
        }
    } catch (err) {
        console.error('Error creating recipe:', err);
        res.status(500).send('Server error');
    }
});

router.get("/quick", guestMiddleware, async (req, res) => {
    try {
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
                                        { $ifNull: ["$$step.time.minutes", 0] },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            { $match: { totalTime: { $lte: 30 } } },
            {
                $lookup: {
                  from: "users",
                  let: { userId: "$user" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$userId"] }
                      }
                    },
                    {
                      $project: {
                        _id: 1,
                        name: 1,
                        profilePicture: 1,
                        rank: 1 // ✅ Add rank here!
                      }
                    }
                  ],
                  as: "user"
                }
            },
            {
                $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// --- UPDATED /user-ratings ROUTE ---
router.get('/user-ratings', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching user ratings for user ID:', userId);

        // Ensure userId is a valid ObjectId
        if (!userId || typeof userId !== 'string' || userId.length !== 24) {
            console.error('Invalid userId:', userId);
            return res.status(400).json({ msg: 'Invalid user ID' });
        }

        const recipes = await Recipe.find({ 'ratings.user': userId })
            .populate('ratings.user', '_id'); // Populate the user in ratings for easier comparison

        console.log('Recipes found with user ratings:', recipes);

        const userRatings = [];
        recipes.forEach(recipe => {
            const userRating = recipe.ratings.find(r => r.user._id.toString() === userId);
            if (userRating) {
                userRatings.push({
                    recipeId: recipe._id,
                    rating: userRating.value
                });
            }
        });

        console.log('User ratings array:', userRatings);
        res.json(userRatings);

    } catch (err) {
        console.error('Error fetching user ratings:', err);
        res.status(500).send('Server error');
    }
});

// GET limited recipes (public)
router.get('/', guestMiddleware, async (req, res) => {
    try {
        const query = Recipe.find().populate("user", "name profilePicture rank").sort({ createdAt: -1 });
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
            .populate("user", "name profilePicture rank")
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

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
                quantity: step.quantity,
                unit: step.unit, //ADDED BY SAMAD
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

router.get('/search', guestMiddleware, async (req, res) => {
    try {
        const { ingredient, cuisine, page = 1, limit = 10 } = req.query;
        const queryObject = {};

        if (ingredient) {
            const regex = new RegExp(ingredient, 'i');
            queryObject.$or = [
                { "steps.ingredients": regex },
                { "title": regex }
            ];
        }

        if (cuisine) {
            queryObject.categories = { $regex: cuisine, $options: "i" };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const recipes = await Recipe.find(queryObject) // Removed user-specific filtering for search
            .populate("user", "name profilePicture rank")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        res.json(recipes);
    } catch (err) {
        console.error("Error in /search:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
});

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

router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('user', 'name profilePicture rank');
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
        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to update this recipe' });
        }
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

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to delete this recipe' });
        }
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
            res.json({ msg: 'Recipe liked successfully' });
        }

        try {
          const recipeOwnerId = recipe.user;
          const newScore = await calculateUserScore(recipeOwnerId);
          const newRank = determineUserRank(newScore);
          await updateUserRankAndScore(recipeOwnerId, newScore, newRank);
          console.log(`User ${recipeOwnerId} score updated after like.`);
        } catch (error) {
            console.error('Gamification error (like recipe):', error);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



router.post('/:id/rate', authMiddleware, async (req, res) => {
    try {
        const { rating } = req.body;         // 1–5
        const userId = req.user.id;
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        recipe.ratings = recipe.ratings || [];
        const idx = recipe.ratings.findIndex(r => r.user.toString() === userId);
        if (idx !== -1) {
            recipe.ratings[idx].value = rating;
        } else {
            recipe.ratings.push({ user: userId, value: rating });
        }

        await recipe.save();
        const avg = recipe.ratings.reduce((sum, r) => sum + r.value, 0) / recipe.ratings.length;
        res.json({ averageRating: avg });

         // Gamification
         try {
          const recipeOwnerId = recipe.user;
          const newScore = await calculateUserScore(recipeOwnerId);
          const newRank = determineUserRank(newScore);
          await updateUserRankAndScore(recipeOwnerId, newScore, newRank);
          console.log(`User ${recipeOwnerId} score updated after recipe rating.`);
        } catch (error) {
            console.error('Gamification error (rate recipe):', error);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// ---------------------- VIDEO UPLOAD ENDPOINT ----------------------
router.post("/upload-video", authMiddleware, uploadVideo.single("video"), async (req, res) => {
    try {
      const videoUrl = req.file.path;
      res.status(200).json({ videoUrl });
    } catch (err) {
      console.error("Video upload failed:", err);
      res.status(500).json({ message: "Video upload failed", error: err });
    }
  });
  
  //-----------------------------------------------------------------------------------

module.exports = router;