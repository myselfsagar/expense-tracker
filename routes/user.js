const express = require("express");
const userControllers = require("../controllers/user");
const router = express.Router();

router.post("/signup", userControllers.signupController);
router.post("/login", userControllers.loginController);

module.exports = router;
