const Expense = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../utils/dbConnect");
const { success, failure } = require("../utils/responseWrapper");

const addExpense = async (req, res) => {
  const { category, amount, description, date } = req.body;
  const userId = req.user.id;

  //check if all fields are entered
  if (!category || !amount || !description || !date) {
    return res.send(failure("All fields are mandatory!", 400));
  }

  const transaction = await sequelize.transaction();

  try {
    //create the expense in expense table
    const expense = await Expense.create(
      { category, amount, description, date, userId },
      { transaction }
    );

    //update the totalExpense in user table
    await User.increment("totalExpense", {
      by: amount,
      where: { id: userId },
      transaction,
    });

    await transaction.commit();
    return res.send(success(expense));
  } catch (err) {
    await transaction.rollback();
    return res.send(failure(err.message));
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: { userId: req.user.id },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return res.send(
      success({
        expenses,
        pagination: {
          totalRecords: count,
          totalPages,
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          pages: [...Array(totalPages).keys()].map((i) => i + 1),
        },
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
  try {
    const transaction = await sequelize.transaction();

    const expenseId = req.params.dID;
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id },
      transaction,
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ Error: "Expense not found" });
    }

    await Expense.destroy({ where: { id: expenseId }, transaction });
    await User.decrement("totalExpense", {
      by: expense.amount,
      where: { id: req.user.id },
      transaction,
    });

    await transaction.commit();
    return res.send(success("Expense deleted successfully"));
  } catch (err) {
    await transaction.rollback();
    return res.send(failure(`Error while deleting expense - ${err.message}`));
  }
};

const updateExpense = async (req, res) => {
  let transaction = await sequelize.transaction();
  try {
    const uID = req.params.uID;
    const user = req.user;
    const { category, amount, description, date } = req.body;
    const up = await Expense.update(
      {
        category,
        amount,
        description,
        date,
      },
      { where: { id: uID, userId: req.user.id } },
      { transaction }
    );
    if (up[0] === 0) {
      return res.send(failure("Expense not found"));
    }

    const totalExpenses = await Expense.sum(
      "amount",
      { where: { UserId: user.id } },
      { transaction }
    );
    if (totalExpenses)
      await user.update({ totalexpenses: totalExpenses }, { transaction });
    else await user.update({ totalexpenses: 0 });
    await transaction.commit();
    return res.send(success("Successfully updated"));
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
