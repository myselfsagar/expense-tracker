const User = require("../../models/User");
const ForgotPassword = require("../../models/ForgotPassword");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../../utils/errorHandler");

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  return user;
};

const createForgotPasswordRequest = async (user) => {
  return await ForgotPassword.create({ userId: user._id });
};

const findForgotPasswordById = async (resetId) => {
  const request = await ForgotPassword.findById(resetId);
  if (!request) {
    throw new ErrorHandler("Reset request not found", 404);
  }
  return request;
};

const markResetInactive = async (resetRequest) => {
  resetRequest.isActive = false;
  await resetRequest.save();
};

const updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ _id: userId }, { password: hashedPassword });
};

module.exports = {
  findUserByEmail,
  createForgotPasswordRequest,
  findForgotPasswordById,
  markResetInactive,
  updateUserPassword,
};
