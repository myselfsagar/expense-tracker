const { failure } = require("../utils/responseWrapper");

const premiumMiddleware = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "premium") {
      return res.send(failure("Access denied: Premium users only", 403));
    }

    next();
  } catch (err) {
    console.error("Error in premiumMiddleware:", err);
    res.send(failure(`Internal server error - ${err.message}`, 500));
  }
};

module.exports = premiumMiddleware;
