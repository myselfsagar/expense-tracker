const passwordService = require("../services/dbCall/passwordService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/responseWrapper");
const ErrorHandler = require("../utils/errorHandler");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
const ForgotPassword = require("../models/ForgotPassword");
const User = require("../models/User");

// Setup Sendinblue email client
const client = Sib.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SIB_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

const sendPasswordResetEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ErrorHandler("Email is mandatory", 400);
  }

  const user = await passwordService.findUserByEmail(email);

  const sender = { email: "ssahu6244@gmail.com", name: "From Sagar Tech." };
  const receivers = [{ email }];

  const resetResponse = await passwordService.createForgotPasswordRequest(user);
  const { _id } = resetResponse;

  await tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "Expense Tracker - Reset Your password",
    htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Password Reset</title>
        </head>
        <body>
            <h1>Reset Your Password</h1>
            <p>Click the button below to reset your password (Valid for 5 minute):</p><br>
            <button><a href="${process.env.WEBSITE}/password/resetPassword/${_id}">Reset Password</a></button>
        </body>
        </html>`,
    params: { role: _id },
  });

  return sendSuccess(res, {}, "Password reset email sent");
});

const verifyResetRequest = asyncHandler(async (req, res) => {
  let { resetId } = req.params;
  const passwordReset = await passwordService.findForgotPasswordById(resetId);
  if (passwordReset.isActive) {
    await passwordService.markResetInactive(passwordReset);
    return res.sendFile("resetPassword.html", { root: "views" });
  } else {
    throw new ErrorHandler("Link has expired", 403);
  }
});

const updatepassword = asyncHandler(async (req, res) => {
  const { resetId, newPassword } = req.body;
  const passwordReset = await passwordService.findForgotPasswordById(resetId);

  const currentTime = new Date();
  const createdAtTime = new Date(passwordReset.createdAt);
  const timeDifference = currentTime - createdAtTime;
  const timeLimit = 5 * 60 * 1000;

  if (timeDifference > timeLimit || passwordReset.isActive) {
    if (passwordReset.isActive) {
      await passwordService.markResetInactive(passwordReset);
    }
    throw new ErrorHandler("Link has expired or has been already used", 403);
  }

  await passwordService.updateUserPassword(passwordReset.userId, newPassword);

  sendSuccess(res, {}, "Password updated successfully.");
});

module.exports = {
  sendPasswordResetEmail,
  verifyResetRequest,
  updatepassword,
};
