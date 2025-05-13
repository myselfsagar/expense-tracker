const express = require("express");
const router = express.Router();

//import all routes
const mainPageRoutes = require("./mainPage.js");
const userRoutes = require("./user.js");
const expenseRoutes = require("./expense.js");
const passwordRoutes = require("./password.js");
const paymentRoutes = require("./payment.js");
const premiumRoutes = require("./premium.js");

//use all routes
router.use(mainPageRoutes);
router.use("/user", userRoutes);
router.use("/expense", expenseRoutes);
router.use("/password", passwordRoutes);
router.use("/payment", paymentRoutes);
router.use("/premium", premiumRoutes);

module.exports = router;
