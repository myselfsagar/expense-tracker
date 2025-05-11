const express = require("express");
const router = express.Router();

//import all routes
const userRoutes = require("./user.js");
const mainPageRoutes = require("./mainPage.js");

//use all routes
router.use(mainPageRoutes);
router.use("/user", userRoutes);

//Not found page
router.use((req, res) => {
  res.status(404).sendFile("notFound.html", { root: "views" });
});

module.exports = router;
