const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");

// ================= CREATE TASK =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });

  } catch (error) {
    console.log("CREATE TASK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;