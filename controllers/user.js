const userServices = require("../services/dbCall/userServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const { sendSuccess } = require("../utils/responseWrapper");

const signupController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ErrorHandler("All fields are mandatory!", 400);
  }
  const user = await userServices.getUserByEmail(email);
  if (user) {
    throw new ErrorHandler(
      "An account with this email address already exists.",
      409
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await userServices.createUser({ name, email, password: hashedPassword });
  return sendSuccess(res, {}, "Signup successful", 201);
});

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorHandler("All fields are required!", 400);
  }
  const user = await userServices.getUserByEmail(email);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new ErrorHandler("Incorrect password", 401);
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "1d" }
  );

  return sendSuccess(res, accessToken, "Login successful");
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const userData = user.toJSON();
  delete userData.password;

  return sendSuccess(res, userData, "Current user fetched");
});

const userHomePageController = (req, res, next) => {
  res.sendFile("userHome.html", { root: "views" });
};

const myProfileController = (req, res, next) => {
  res.sendFile("myProfile.html", { root: "views" });
};

const updateProfileController = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name, email } = req.body;

  await userServices.updateUserProfile(user, { name, email });

  return sendSuccess(res, {}, "Successfully updated");
});

module.exports = {
  signupController,
  loginController,
  getCurrentUser,
  userHomePageController,
  myProfileController,
  updateProfileController,
};
