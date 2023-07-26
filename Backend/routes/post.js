const express = require("express");
const Post = require("../model/post");

const router = express.Router();

// Create a new post
router.post("/post", async (req, res) => {
  try {
    const { title, content, userId, approved, createdAt, feedback } = req.body;
    const post = new Post({
      title,
      content,
      userId,
      approved,
      createdAt,
      feedback,
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all posts
router.get("/post", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name"); // Populate the userId field with the name property

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get post by id
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "name"); // Populate the userId field with the name property

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update post approval status and add feedback
router.put("/post/:id", async (req, res) => {
  try {
    const { approved, feedback } = req.body;
    const updatedFields = {};

    if (approved !== undefined) {
      updatedFields.approved = approved;
    }

    if (feedback) {
      updatedFields.feedback = feedback;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a post
router.delete("/post/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
