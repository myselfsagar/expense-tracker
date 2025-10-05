const Expense = require("../../models/Expense");
const User = require("../../models/User");
const sequelize = require("../../utils/dbConnect");
const ErrorHandler = require("../../utils/errorHandler");

const addExpense = async ({ category, amount, description, date, userId }) => {
  const transaction = await sequelize.transaction();
  try {
    const expense = await Expense.create(
      { category, amount: parseFloat(amount), description, date, userId },
      { transaction }
    );
    await User.increment("totalExpense", {
      by: parseFloat(amount),
      where: { id: userId },
      transaction,
    });
    const updatedUser = await User.findByPk(userId, {
      attributes: ["totalExpense"],
      transaction,
    });
    await transaction.commit();
    return { expense, totalExpense: updatedUser.totalExpense };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const getAllExpenses = async ({ userId, page = 1, limit = 5 }) => {
  const offset = (page - 1) * limit;
  const user = await User.findByPk(userId);
  const { count, rows: expenses } = await Expense.findAndCountAll({
    where: { userId },
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });
  return {
    expenses,
    totalExpense: user.totalExpense,
    totalCount: count,
    hasMoreExpenses: expenses.length === limit,
    hasPreviousExpenses: page > 1,
  };
};

const getExpenseById = async ({ userId, expenseId }) => {
  const expense = await Expense.findOne({ where: { id: expenseId, userId } });
  if (!expense) throw new ErrorHandler("Expense not found", 404);
  return expense;
};

const deleteExpense = async ({ userId, expenseId }) => {
  const transaction = await sequelize.transaction();
  try {
    const expense = await Expense.findOne({
      where: { id: expenseId, userId },
      transaction,
    });
    if (!expense) {
      await transaction.rollback();
      throw new ErrorHandler("Expense not found", 404);
    }
    await Expense.destroy({ where: { id: expenseId, userId }, transaction });
    await User.decrement("totalExpense", {
      by: expense.amount,
      where: { id: userId },
      transaction,
    });
    const updatedUser = await User.findByPk(userId, {
      attributes: ["totalExpense"],
      transaction,
    });
    await transaction.commit();
    return { totalExpense: updatedUser.totalExpense };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const updateExpense = async ({
  userId,
  expenseId,
  category,
  amount,
  description,
  date,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const oldExpense = await Expense.findOne({
      where: { id: expenseId, userId },
      transaction,
    });
    if (!oldExpense) {
      await transaction.rollback();
      throw new ErrorHandler("Expense not found", 404);
    }
    await Expense.update(
      { category, amount, description, date },
      { where: { id: expenseId, userId }, transaction }
    );
    const updatedExpense = await Expense.findOne({
      where: { id: expenseId, userId },
      transaction,
    });
    const amountDifference = amount - oldExpense.amount;
    await User.increment("totalExpense", {
      by: amountDifference,
      where: { id: userId },
      transaction,
    });
    const updatedUser = await User.findByPk(userId, {
      attributes: ["totalExpense"],
      transaction,
    });
    await transaction.commit();
    return { expense: updatedExpense, totalExpense: updatedUser.totalExpense };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpense,
  updateExpense,
};
