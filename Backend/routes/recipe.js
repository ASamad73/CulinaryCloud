// const express = require('express');
// const Recipe = require('../models/Recipe');
// const Like = require('../models/Like');  
// const Comment = require('../models/Comment');  

// const authMiddleware = require('../middleware/auth'); 
// const guestMiddleware = require('../middleware/guest');

// const multer = require('multer');
// const cloudinary = require('../utils/cloudinary');

// const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
// });


// // POST /recipes - Create a new recipe
// router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
//   try {
//     let imageUrl = req.body.existingImage || ''; 

//     if (req.file) {
//       const b64 = req.file.buffer.toString('base64');
//       const dataURI = `data:${req.file.mimetype};base64,${b64}`;

//       const result = await cloudinary.uploader.upload(dataURI, {
//         folder: 'recipes',
//         width: 800,
//         height: 600,
//         crop: 'limit'
//       });
//       imageUrl = result.secure_url;
//     }

//     const newRecipe = new Recipe({
//       title: req.body.title,
//       steps: JSON.parse(req.body.steps || '[]'), // If you're sending steps as JSON string
//       image: imageUrl,
//       caption: req.body.caption,
//       user: req.user.id,
//       // Make sure categories adhere to the limit set in your schema
//       categories: req.body.categories ? JSON.parse(req.body.categories) : []
//     });

//     const savedRecipe = await newRecipe.save();
//     res.json(savedRecipe);
//   } catch (err) {
//     console.error('Error creating recipe:', err);
//     res.status(500).send('Server error');
//   }
// });


// // // CREATE recipe (protected)
// // router.post('/', authMiddleware, async (req, res) => {
// //   const { title, steps, image, caption, categories } = req.body;

// //   // Predefined list of allowed categories (should match the schema)
// //   const ALLOWED_CATEGORIES = [
// //     "Biryani Varieties",
// //     "Nihari Delicacies",
// //     "Karahi Creations",
// //     "Korma Specialties",
// //     "Haleem Masterpieces",
// //     "Kebab Assortments",
// //     "Tandoori Treats",
// //     "Curry Classics",
// //     "Pulao Dishes",
// //     "Daal Delights",
// //     "Chaat Sensations",
// //     "Paratha Varieties",
// //     "Naan & Flatbreads",
// //     "Samosa Selections",
// //     "Pakora & Bhaji",
// //     "Pickles & Chutneys",
// //     "Raita & Yogurt Dishes",
// //     "Saag & Green Vegetable Curries",
// //     "Vegetable Curries",
// //     "Mughlai Influences",
// //     "Street Food Specialties",
// //     "Seafood Selections",
// //     "Traditional Desserts",
// //     "Rice Puddings & Kheer",
// //     "Sheer Khurma",
// //     "Lassi & Yogurt Drinks",
// //     "Chai Varieties",
// //     "Halwa Creations",
// //     "Salad & Raita Innovations",
// //     "Fusion Desi Snacks"
// //   ];

// //   // Validate that categories is an array and has at most 3 items
// //   if (!Array.isArray(categories) || categories.length > 3) {
// //     return res.status(400).json({ msg: 'Please select up to 3 categories.' });
// //   }

// //   // Validate each selected category is allowed
// //   for (let cat of categories) {
// //     if (!ALLOWED_CATEGORIES.includes(cat)) {
// //       return res.status(400).json({ msg: `Invalid category selected: ${cat}` });
// //     }
// //   }

// //   try {
// //     const newRecipe = new Recipe({
// //       title,
// //       steps,
// //       image,
// //       caption,
// //       categories,          // Saving the selected category strings
// //       user: req.user.id
// //     });

// //     await newRecipe.save();
// //     res.status(201).json(newRecipe);
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server error');
// //   }
// // });

// router.get("/quick", guestMiddleware, async (req, res) => {
//   try {
//     const recipes = await Recipe.aggregate([
//       {
//         $addFields: {
//           totalTime: {
//             $sum: {
//               $map: {
//                 input: "$steps",
//                 as: "step",
//                 in: {
//                   $add: [
//                     { $multiply: [{ $ifNull: ["$$step.time.hours", 0] }, 60] },
//                     { $ifNull: ["$$step.time.minutes", 0] },
//                   ],
//                 },
//               },
//             },
//           },
//         },
//       },
//       { $match: { totalTime: { $lte: 30 } } },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
//       },
//       {
//         $sort: { createdAt: -1 }
//       }
//     ]);
//     res.json(recipes);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });


// //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // GET limited recipes (public)
// router.get('/', guestMiddleware, async (req, res) => {
//   try {
//     // If req.user exists, the user is authenticated (no limit)
//     // Otherwise, limit to 5 recipes for guests
//     const query = Recipe.find({ user: req.user.id })
//     .populate("user", "name profilePicture").sort({ createdAt: -1 });
//     // const query = Recipe.find().populate('user', 'username');
//     if (!req.user) {
//       query.limit(5);
//     }
//     const recipes = await query;
//     res.json(recipes);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });


// // GET recipes made by the authenticated user
// router.get('/myrecipes', authMiddleware, async (req, res) => {
//   try {
//     const recipes = await Recipe.find({ user: req.user.id })
//       .populate("user", "name profilePicture")
//       .sort({ createdAt: -1 });

//     res.json(recipes);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });


// // added by Azaan ----------------------------------------------------------------------

// // Step-by-Step Cooking Mode
// router.get('/:id/step-by-step', async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);

//     if (!recipe) {
//       return res.status(404).json({ msg: 'Recipe not found' });
//     }

//     const stepByStep = {
//       title: recipe.title,
//       steps: recipe.steps.map((step, index) => ({
//         stepNumber: index + 1,
//         description: step.description,
//         ingredients: step.ingredients,
//         quantity: steps.quantity,
//         unit: steps.unit, //ADDED BY SAMAD
//         timer: step.time ? {
//           hours: step.time.hours || 0,
//           minutes: step.time.minutes || 0
//         } : null
//       }))
//     };

//     res.json(stepByStep);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // added by Azaan ----------------------------------------------------------------------


// router.get('/search', guestMiddleware, async (req, res) => {
//   try {
//     const { ingredient, cuisine, page = 1, limit = 10 } = req.query;
//     const queryObject = {};

//     if (ingredient) {
//       const regex = new RegExp(ingredient, 'i'); // 🔧 create a regex once
//       queryObject.$or = [
//         { "steps.ingredients": regex },
//         { "title": regex }
//       ];
//     }
    

//     if (cuisine) {
//       queryObject.categories = { $regex: cuisine, $options: "i" };
//     }

//     if (Object.keys(queryObject).length === 0) {
//       return res.status(400).json({ msg: "No search parameters provided." });
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     console.log("queryObject being used:", queryObject);
//     console.log("ingredient:", ingredient);
//     console.log("typeof ingredient:", typeof ingredient);
//     const recipes = await Recipe.find({ user: req.user.id })
//       .populate("user", "name profilePicture")
//       // .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     res.json(recipes);
//   } catch (err) {
//     console.error("Error in /search:", err.message);
//     res.status(500).json({ msg: "Server error" }); // 
//   }
// });

// // --------added by Azaan

// router.get('/liked', authMiddleware, async (req, res) => {
//   try {
//     const likedRecipes = await Like.find({ user: req.user.id }).select('recipe');
//     const likedIds = likedRecipes.map(like => like.recipe.toString());
//     res.json(likedIds);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });


// // --------added by Azaan

// router.get('/:id', async (req, res) => {
//   try {
//     // const recipe = await Recipe.findById(req.params.id).populate('user', 'username');
//     const recipe = await Recipe.find({ user: req.user.id })
//       .populate("user", "name profilePicture")
//       .sort({ createdAt: -1 });
//     if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
//     res.json(recipe);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);

//     if (!recipe) {
//       return res.status(404).json({ msg: 'Recipe not found' });
//     }

//     // Check if the recipe belongs to the logged-in user
//     if (recipe.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: 'Not authorized to update this recipe' });
//     }

//     // Update allowed fields
//     const { title, steps, image, caption } = req.body;

//     if (title !== undefined) recipe.title = title;
//     if (steps !== undefined) recipe.steps = steps;
//     if (image !== undefined) recipe.image = image;
//     if (caption !== undefined) recipe.caption = caption;

//     const updatedRecipe = await recipe.save();
//     res.json(updatedRecipe);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // DELETE a recipe (only by owner)
// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);

//     if (!recipe) {
//       return res.status(404).json({ msg: 'Recipe not found' });
//     }

//     if (recipe.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: 'Not authorized to delete this recipe' });
//     }

//     // Delete the recipe safely
//     await Recipe.deleteOne({ _id: req.params.id });

//     res.json({ msg: 'Recipe deleted successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });


// router.post('/:id/like', authMiddleware, async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id);
//     if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

//     const existingLike = await Like.findOne({
//       recipe: req.params.id,
//       user: req.user.id
//     });

//     if (existingLike) {
//       await Like.deleteOne({ _id: existingLike._id });
//       await Recipe.findByIdAndUpdate(req.params.id, { $inc: { likeCount: -1 } });
//       return res.json({ msg: 'Like removed' });
//     } else {
//       const newLike = new Like({
//         recipe: req.params.id,
//         user: req.user.id
//       });
//       await newLike.save();
//       await Recipe.findByIdAndUpdate(req.params.id, { $inc: { likeCount: 1 } });
//       return res.json({ msg: 'Recipe liked successfully' });
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });


// // ---added by Samad
// router.get('/user-ratings', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const recipes = await Recipe.find({ 'ratings.user': userId });

//     const userRatings = [];

//     recipes.forEach(recipe => {
//       const userRating = recipe.ratings.find(r => r.user.toString() === userId);
//       if (userRating) {
//         userRatings.push({
//           recipeId: recipe._id,
//           rating: userRating.value
//         });
//       }
//     });

//     res.json(userRatings);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.post('/:id/rate', authMiddleware, async (req, res) => {
//   try {
//     const { rating } = req.body;         // 1–5
//     const userId = req.user.id;
//     const recipe = await Recipe.findById(req.params.id);
//     if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

//     recipe.ratings = recipe.ratings || [];
//     const idx = recipe.ratings.findIndex(r => r.user.toString() === userId);
//     if (idx !== -1) {
//       recipe.ratings[idx].value = rating;
//     } else {
//       recipe.ratings.push({ user: userId, value: rating });
//     }

//     await recipe.save();
//     const avg = recipe.ratings.reduce((sum, r) => sum + r.value, 0) / recipe.ratings.length;
//     res.json({ averageRating: avg });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
const express = require('express');
const Recipe = require('../models/Recipe');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
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
            categories: req.body.categories ? JSON.parse(req.body.categories) : []
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
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
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

// GET limited recipes (public)
router.get('/', guestMiddleware, async (req, res) => {
    try {
        const query = Recipe.find().populate("user", "username profilePicture").sort({ createdAt: -1 });
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
            .populate("user", "username profilePicture")
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
            .populate("user", "username profilePicture")
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
        const recipe = await Recipe.findById(req.params.id).populate('user', 'username profilePicture');
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

module.exports = router;