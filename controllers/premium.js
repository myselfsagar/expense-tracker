const User = require("../models/User");
const AwsService = require("../services/awsServices");
const { success, failure } = require("../utils/responseWrapper");

const showLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["id", "name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
      limit: 15,
    });
    return res.send(success(leaderboard));
  } catch (err) {
    return res.send(failure(`Error fetching leaderboard - ${err.message}`));
  }
};

const downloadExpenses = async (req, res) => {
  try {
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
    const fileName = `expense-data/user${user.id}/${
      user.name
    }${new Date()}.txt`;

    const URL = await AwsService.uploadToS3(textData, fileName);
    await user.createDownload({
      downloadUrl: URL,
    });

    res.send(success(URL));
  } catch (error) {
    res.send(failure(`Unable to generate URL - ${error.message}`));
  }
};

const getDownloadHistory = async (req, res) => {
  try {
    const user = req.user;
    const history = await user.getDownloads();
    res.send(history);
  } catch (error) {
    return res.send(failure(`Unable to fetch history - ${error.message}`));
  }
};

module.exports = {
  showLeaderboard,
  downloadExpenses,
  getDownloadHistory,
};
