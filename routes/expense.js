const express = require("express");
const expenseControllers = require("../controllers/expense");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/addExpense", authMiddleware, expenseControllers.addExpense);
router.get("/getExpenses", authMiddleware, expenseControllers.getAllExpenses);
router.get(
  "/getExpenseById/:eID",
  authMiddleware,
  expenseControllers.getExpenseById
);
router.delete(
  "/deleteExpense/:dID",
  authMiddleware,
  expenseControllers.deleteExpense
);
router.put(
  "/updateExpense/:uID",
  authMiddleware,
  expenseControllers.updateExpense
);

module.exports = router;
