const User = require("../models/User");
const ForgotPassword = require("../models/ForgotPassword");
const { success, failure } = require("../utils/responseWrapper");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");

// Setup Sendinblue email client
const client = Sib.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SIB_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

const sendPasswordResetEmail = async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) {
      return res.send(failure("Email is mandatory", 400));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.send(failure("User not found", 404));
    }

    const sender = { email: "ssahu6244@gmail.com", name: "From Sagar Tech." };
    const receivers = [{ email }];

    const resetresponse = await user.createForgotPassword({});
    const { id } = resetresponse;

    const mailresponse = await tranEmailApi.sendTransacEmail({
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
                    <button><a href="${process.env.WEBSITE}/password/resetPassword/{{params.role}}">Reset Password</a></button>
                </body>
                </html>`,
      params: {
        role: id,
      },
    });

    return response.send(success("Password reset email sent"));
  } catch (error) {
    return response.send(failure(`Interenal Server Error - ${error.message}`));
  }
};

const verifyResetRequest = async (request, response) => {
  try {
    let { resetId } = request.params;
    const passwordReset = await ForgotPassword.findByPk(resetId);
    if (passwordReset.isActive) {
      passwordReset.isActive = false;
      await passwordReset.save();
      return response.sendFile("resetPassword.html", { root: "views" });
    } else {
      return response.send(failure("Link has expired", 403));
    }
  } catch (error) {
    return response.send(failure(`Interenal Server Error - ${error.message}`));
  }
};

const updatepassword = async (request, response) => {
  try {
    const { resetId, newPassword } = request.body;
    const passwordReset = await ForgotPassword.findByPk(resetId);
    const currentTime = new Date();
    const createdAtTime = new Date(passwordReset.createdAt);
    const timeDifference = currentTime - createdAtTime;
    const timeLimit = 5 * 60 * 1000;
    if (timeDifference > timeLimit || !passwordReset.isActive) {
      return response.send(failure("Link has expired", 403));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      { where: { id: passwordReset.userId } }
    );

    passwordReset.isActive = false;
    await passwordReset.save();

    response.send(success("Password updated successfully."));
  } catch (error) {
    return response.send(failure(`Interenal Server Error - ${error.message}`));
  }
};

module.exports = {
  sendPasswordResetEmail,
  verifyResetRequest,
  updatepassword,
};
