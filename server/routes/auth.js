const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log("Auth route loaded");

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    console.log("SIGNUP API HIT");

    // ✅ GET NAME ALSO
    const { name, email, password } = req.body;

    // ✅ VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password required"
      });
    }

    // ✅ CHECK USER EXISTS
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE USER
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    // ✅ SAVE USER
    await user.save();

    // ✅ RESPONSE
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log("========== SIGNUP ERROR ==========");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN API HIT");

    const { email, password } = req.body;

    // ✅ VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    // ✅ FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ✅ GENERATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ RESPONSE
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log("========== LOGIN ERROR ==========");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;