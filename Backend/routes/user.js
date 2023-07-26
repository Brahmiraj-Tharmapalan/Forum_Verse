const express = require("express");
const User = require("../model/user");

const router = express.Router();

router.post("/user", async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    const user = new User({
      name,
      email,
      password,
      isAdmin,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.isAdmin) {
      res
        .status(200)
        .json({ isAdmin: true, message: "Redirect to approval", id: user._id });
    } else {
      res.status(200).json({
        isAdmin: false,
        message: "Redirect to dashboard",
        id: user._id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
