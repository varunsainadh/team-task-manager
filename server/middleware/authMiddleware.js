const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // Remove "Bearer "
    const cleanToken = token.split(" ")[1];

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    req.user = decoded; // attach user id

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

module.exports = authMiddleware;