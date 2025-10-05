const expenseServices = require("../services/dbCall/expenseServices");
const { sendSuccess } = require("../utils/responseWrapper");
const asyncHandler = require("../utils/asyncHandler");

const addExpense = asyncHandler(async (req, res) => {
  const { category, amount, description, date } = req.body;
  const userId = req.user.id;
  if (!category || !amount || !description || !date) {
    throw new ErrorHandler("All fields are mandatory!", 400);
  }
  const result = await expenseServices.addExpense({
    category,
    amount,
    description,
    date,
    userId,
  });
  return sendSuccess(res, result, "Expense added");
});

const getAllExpenses = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const userId = req.user.id;
  const result = await expenseServices.getAllExpenses({ userId, page, limit });
  return sendSuccess(res, result, "Expenses fetched");
});

const getExpenseById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.eID;
  const expense = await expenseServices.getExpenseById({ userId, expenseId });
  return sendSuccess(res, expense, "Expense fetched");
});

const deleteExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.dID;
  const result = await expenseServices.deleteExpense({ userId, expenseId });
  return sendSuccess(res, result, "Expense deleted");
});

const updateExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.uID;
  const { category, amount, description, date } = req.body;
  const result = await expenseServices.updateExpense({
    userId,
    expenseId,
    category,
    amount,
    description,
    date,
  });
  return sendSuccess(res, result, "Expense updated");
});

module.exports = {
  addExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpense,
  updateExpense,
};
