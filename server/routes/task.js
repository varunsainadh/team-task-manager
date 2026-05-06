const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");


// ================= CREATE TASK =================
router.post("/create", authMiddleware, async (req, res) => {
  try {

    const {
      title,
      projectId,
      assignedTo,
      dueDate
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const task = await Task.create({
      title,
      status: "pending",
      userId: req.user._id,
      projectId,
      assignedTo,
      dueDate
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

    const tasks = await Task.find({
      userId: req.user._id
    })
    .populate("projectId")
    .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
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


// ================= DASHBOARD STATS =================
router.get("/dashboard/stats", authMiddleware, async (req, res) => {
  try {

    const totalTasks = await Task.countDocuments({
      userId: req.user._id
    });

    const completedTasks = await Task.countDocuments({
      userId: req.user._id,
      status: "completed"
    });

    const pendingTasks = await Task.countDocuments({
      userId: req.user._id,
      status: "pending"
    });

    const overdueTasks = await Task.countDocuments({
      userId: req.user._id,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" }
    });

    res.status(200).json({
      success: true,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks
    });

  } catch (error) {

    console.log("DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ================= GET SINGLE TASK =================
router.get("/:id", authMiddleware, async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
    .populate("projectId")
    .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      task
    });

  } catch (error) {

    console.log("GET SINGLE TASK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ================= UPDATE TASK =================
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {

    const {
      title,
      status,
      projectId,
      assignedTo,
      dueDate
    } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        title,
        status,
        projectId,
        assignedTo,
        dueDate
      },
      {
        new: true
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
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
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
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