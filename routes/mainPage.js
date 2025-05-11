// IMPORT EXPRESS
const express = require("express");

//IMPORT CONTROLLERS
const mainPageController = require("../controllers/mainPage");

//CREATE AN INSTANCE OF Router
const router = express.Router();

//CREATE A ROUTER FOR MAINPAGE
router.get("/home", mainPageController.getHomePage);
router.get("", mainPageController.getErrorPage);

module.exports = router;
