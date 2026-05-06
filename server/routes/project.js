const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Project = require("../models/Project");


// CREATE PROJECT
router.post("/create", authMiddleware, async (req, res) => {
  try {

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });

  } catch (error) {

    console.log("CREATE PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// GET ALL PROJECTS
router.get("/", authMiddleware, async (req, res) => {
  try {

    const projects = await Project.find({
      createdBy: req.user._id
    });

    res.status(200).json({
      success: true,
      projects
    });

  } catch (error) {

    console.log("GET PROJECT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;