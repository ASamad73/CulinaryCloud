const express = require('express');
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST a comment on a recipe
router.post('/:recipeId', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const recipeId = req.params.recipeId;

    const newComment = new Comment({
      recipe: recipeId,
      user: req.user.id,
      text
    });

    await newComment.save();
    await Recipe.findByIdAndUpdate(recipeId, { $inc: { commentCount: 1 } });

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET all comments for a recipe (with pagination)
router.get('/:recipeId', async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    // Pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ recipe: recipeId })
      .populate('user', 'username') // attach username to comment
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//delete the comments
router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) return res.status(404).json({ msg: 'Comment not found' });
  
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      await Comment.deleteOne({ _id: comment._id });
      await Recipe.findByIdAndUpdate(comment.recipe, { $inc: { commentCount: -1 } });
  
      res.json({ msg: 'Comment deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;
