const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("MAIN FILE RUNNING");

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const projectRoutes = require("./routes/project");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

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

// ================= DATABASE CONNECTION =================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected Successfully");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

})
.catch((err) => {

  console.log("DB ERROR:", err);

});