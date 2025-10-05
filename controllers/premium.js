const User = require("../models/User");
const AwsService = require("../services/awsServices");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/responseWrapper");

const showLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await User.findAll({
    attributes: ["id", "name", "totalExpense"],
    order: [["totalExpense", "DESC"]],
    limit: 15,
  });
  return sendSuccess(res, leaderboard, "Leaderboard fetched");
});

const downloadExpenses = asyncHandler(async (req, res) => {
  const user = req.user;
  const expenses = await user.getExpenses({
    attributes: ["category", "amount", "description", "date"],
  });

  const formattedExpenses = expenses.map((expense) => {
    return `Category: ${expense.category}
            Amount: ${expense.amount}
            Description: ${expense.description}
            Date: ${expense.date}`;
  });

  const textData = formattedExpenses.join("\n");
  const fileName = `expense-data/user${user.id}/${user.name}-${new Date()}.txt`;

  const URL = await AwsService.uploadToS3(textData, fileName);
  await user.createDownload({
    downloadUrl: URL,
  });

  sendSuccess(res, { URL }, "Expenses downloaded");
});

const getDownloadHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const history = await user.getDownloads({ order: [["createdAt", "DESC"]] });
  sendSuccess(res, history, "Download history fetched");
});

module.exports = {
  showLeaderboard,
  downloadExpenses,
  getDownloadHistory,
};
