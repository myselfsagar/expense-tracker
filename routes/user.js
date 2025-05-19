const express = require("express");
const userControllers = require("../controllers/user");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup", userControllers.signupController);
router.post("/login", userControllers.loginController);
router.get("/currentUser", authMiddleware, userControllers.getCurrentUser);
router.get("/", userControllers.userHomePageController);
router.get("/myProfile", userControllers.myProfileController);
router.put(
  "/updateProfile",
  authMiddleware,
  userControllers.updateProfileController
);

module.exports = router;
