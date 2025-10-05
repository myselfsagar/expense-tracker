const User = require("../models/User");
const Download = require("../models/Download");
const AwsService = require("../services/awsServices");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/responseWrapper");

const showLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await User.find()
    .select("name totalExpense")
    .sort({ totalExpense: -1 })
    .limit(15);
  return sendSuccess(res, leaderboard, "Leaderboard fetched");
});

const downloadExpenses = asyncHandler(async (req, res) => {
  const user = req.user;

  const expenses = await Expense.find({ userId: user._id }).select(
    "category amount description date"
  );

  const formattedExpenses = expenses.map((expense) => {
    const formattedDate = new Date(expense.date).toISOString().split("T")[0];
    return (
      `Category: ${expense.category}\n` +
      `Amount: ${expense.amount}\n` +
      `Description: ${expense.description}\n` +
      `Date: ${formattedDate}\n`
    );
  });

  const textData = formattedExpenses.join("\n---\n\n");

  const fileName = `expense-data/user${user._id}/${
    user.name
  }-${new Date().toISOString()}.txt`;

  const URL = await AwsService.uploadToS3(textData, fileName);

  await Download.create({
    downloadUrl: URL,
    userId: user._id,
  });

  sendSuccess(res, { URL }, "Expenses file generated successfully.");
});

const getDownloadHistory = asyncHandler(async (req, res) => {
  const history = await Download.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  sendSuccess(res, history, "Download history fetched");
});

module.exports = {
  showLeaderboard,
  downloadExpenses,
  getDownloadHistory,
};
