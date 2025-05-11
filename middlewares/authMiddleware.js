const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { success, failure } = require("../utils/responseWrapper");

authMiddleware = async (req, res, next) => {
  try {
    // Check if token exists and starts with "Bearer"
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      return res.send(failure("Unauthorized: No token provided", 401));
    }

    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // Check if user exists
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return ressend(failure("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.send(failure("Time out please sign in", 401));
    } else {
      console.log("Error:", error);
      response.send(failure("Internal Server Error - Please login again"));
    }
  }
};

module.exports = authMiddleware;
