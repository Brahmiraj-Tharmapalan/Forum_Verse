const express = require("express");
const Comment = require("../model/comment");

const router = express.Router();

// Create a new comment
router.post("/comment", async (req, res) => {
  try {
    const { content, postId, userId } = req.body;
    const comment = new Comment({
      content,
      postId,
      userId,
    });
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get comments for a specific post
router.get("/post/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId }).populate("userId", "name");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
