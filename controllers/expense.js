const Expense = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../utils/dbConnect");
const { success, failure } = require("../utils/responseWrapper");

const addExpense = async (req, res) => {
  const { category, amount, description, date } = req.body;
  const userId = req.user.id;

  // Validate all required fields
  if (!category || !amount || !description || !date) {
    return res.status(400).json(failure("All fields are mandatory!"));
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Create the expense
    const expense = await Expense.create(
      {
        category,
        amount: parseFloat(amount), // Ensure numeric value
        description,
        date,
        userId,
      },
      { transaction }
    );

    // 2. Update user's total expense
    await User.increment("totalExpense", {
      by: parseFloat(amount),
      where: { id: userId },
      transaction,
    });

    // 3. Get fresh user data with updated total
    const updatedUser = await User.findByPk(userId, {
      attributes: ["totalExpense"],
      transaction,
    });

    await transaction.commit();

    return res.json(
      success({ expense, totalExpense: updatedUser.totalExpense })
    );
  } catch (err) {
    await transaction.rollback();
    console.error("Add expense error:", err);
    return res.status(500).json(failure("Failed to add expense"));
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const user = req.user;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * 5;

    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: { userId: user.id },
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    return res.send(
      success({
        expenses: expenses,
        totalExpense: user.totalExpense,
        totalCount: count,
        hasMoreExpenses: expenses.length === limit,
        hasPreviousExpenses: page > 1,
      })
    );
  } catch (err) {
    return res.send(failure(err.message));
  }
};

const getExpenseById = async (req, res) => {
  try {
    const user = req.user;
    const eID = req.params.eID;
    const expense = await user.getExpenses({ where: { id: eID } });
    return res.send(success(expense));
  } catch (err) {
    return res.send(failure(err.message));
  }
};

const deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const expenseId = req.params.dID; // Note: This should match your route parameter
    const userId = req.user.id;

    // 1. Find the expense first
    const expense = await Expense.findOne({
      where: { id: expenseId, userId },
      transaction,
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json(failure("Expense not found"));
    }

    // 2. Delete the expense
    await Expense.destroy({
      where: { id: expenseId, userId },
      transaction,
    });

    // 3. Update user's total expense
    await User.decrement("totalExpense", {
      by: expense.amount,
      where: { id: userId },
      transaction,
    });

    // 4. Get updated total
    const updatedUser = await User.findByPk(userId, {
      attributes: ["totalExpense"],
      transaction,
    });

    await transaction.commit();

    return res.send(
      success({
        totalExpense: updatedUser.totalExpense,
      })
    );
  } catch (err) {
    await transaction.rollback();
    return res.send(failure(`Error deleting expense: ${err.message}`));
  }
};

const updateExpense = async (req, res) => {
  let transaction = await sequelize.transaction();
  try {
    const uID = req.params.uID;
    const user = req.user;
    const { category, amount, description, date } = req.body;

    // 1. Get the old expense first
    const oldExpense = await Expense.findOne({
      where: { id: uID, userId: user.id },
      transaction,
    });

    if (!oldExpense) {
      await transaction.rollback();
      return res.send(failure("Expense not found"));
    }

    // 2. Update the expense
    await Expense.update(
      { category, amount, description, date },
      {
        where: { id: uID, userId: user.id },
        transaction,
      }
    );

    // 3. Get the updated expense
    const updatedExpense = await Expense.findOne({
      where: { id: uID, userId: user.id },
      transaction,
    });

    // 4. Calculate the difference and update user's total
    const amountDifference = amount - oldExpense.amount;
    await user.increment("totalExpense", {
      by: amountDifference,
      transaction,
    });

    // 5. Get the FRESH user instance with updated total
    const updatedUser = await User.findByPk(user.id, {
      attributes: ["totalExpense"],
      transaction,
    });

    await transaction.commit();

    return res.send(
      success({
        expense: updatedExpense.get(),
        totalExpense: updatedUser.totalExpense,
      })
    );
  } catch (error) {
    await transaction.rollback();
    return res.send(failure(error.message));
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpense,
  updateExpense,
};
