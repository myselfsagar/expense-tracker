const Expense = require("../../models/Expense");
const User = require("../../models/User");
const ErrorHandler = require("../../utils/errorHandler");

const addExpense = async ({ category, amount, description, date, userId }) => {
  const expense = await Expense.create({
    category,
    amount,
    description,
    date,
    userId,
  });
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { totalExpense: parseFloat(amount) } },
    { new: true }
  );
  return { expense, totalExpense: updatedUser.totalExpense };
};

const getAllExpenses = async ({ userId, page = 1, limit = 5 }) => {
  const skip = (page - 1) * limit;
  const user = await User.findById(userId);

  const totalCount = await Expense.countDocuments({ userId });
  const expenses = await Expense.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    expenses,
    totalExpense: user.totalExpense,
    totalCount,
    hasMoreExpenses: skip + expenses.length < totalCount,
    hasPreviousExpenses: page > 1,
  };
};

const getExpenseById = async ({ userId, expenseId }) => {
  const expense = await Expense.findOne({ _id: expenseId, userId: userId });
  if (!expense) {
    throw new ErrorHandler("Expense not found", 404);
  }
  return expense;
};

const deleteExpense = async ({ userId, expenseId }) => {
  const expense = await Expense.findOne({ _id: expenseId, userId });
  if (!expense) {
    throw new ErrorHandler("Expense not found", 404);
  }
  await Expense.deleteOne({ _id: expenseId });
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { totalExpense: -expense.amount } },
    { new: true }
  );
  return { totalExpense: updatedUser.totalExpense };
};

const updateExpense = async ({
  userId,
  expenseId,
  category,
  amount,
  description,
  date,
}) => {
  const oldExpense = await Expense.findOne({ _id: expenseId, userId: userId });
  if (!oldExpense) {
    throw new ErrorHandler("Expense not found", 404);
  }

  const amountDifference = parseFloat(amount) - oldExpense.amount;

  const updatedExpense = await Expense.findByIdAndUpdate(
    expenseId,
    { category, amount, description, date },
    { new: true } // This option returns the document after it has been updated
  );

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { totalExpense: amountDifference } },
    { new: true }
  );

  return { expense: updatedExpense, totalExpense: updatedUser.totalExpense };
};

module.exports = {
  addExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpense,
  updateExpense,
};
