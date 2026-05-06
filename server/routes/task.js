const express = require("express");
const router = express.Router();

// ✅ REQUIRED IMPORTS (YOU MISSED THESE)
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");


// ================= CREATE TASK =================
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const task = await Task.create({
      title,
      userId: req.user._id
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


// ================= GET ALL TASKS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.log("GET TASK ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ================= UPDATE TASK =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      { title },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized"
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    console.log("UPDATE TASK ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ================= DELETE TASK =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized"
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.log("DELETE TASK ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


module.exports = router;