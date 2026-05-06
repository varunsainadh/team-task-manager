const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("MAIN FILE RUNNING");

// routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ================= BASIC ROUTES =================
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.get("/check", (req, res) => {
  res.send("CHECK WORKING");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
});

// ================= DB CONNECTION =================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("DB ERROR:", err);
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});