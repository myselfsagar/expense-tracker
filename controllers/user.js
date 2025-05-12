const UserServices = require("../services/userServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { success, failure } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  const { name, email, password } = req.body;

  //check if all the fields are entered
  if (!name || !email || !password) {
    return res.send(failure("All fields are mandatory!", 400));
  }

  try {
    //check if the user already signedup
    const user = await UserServices.getUserByEmail(email);
    if (user) {
      return res.send(failure("User already exists", 409));
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create the new user
    await UserServices.createUser(name, email, hashedPassword);

    return res.send(success("Signup successful", 201));
  } catch (error) {
    return res.send(failure(error.message));
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  //check if sending all fields
  if (!email || !password) {
    return res.send(failure("All fields are required!", 400));
  }

  try {
    //check if the user exist if not through 404 failure
    const user = await UserServices.getUserByEmail(email);
    if (!user) {
      return res.send(failure("User not found", 404));
    }

    const matched = await bcrypt.compare(password, user.password);

    //check entered password with the actual password
    if (!matched) {
      return res.send(failure("Incorect password", 403));
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.send(success({ accessToken }));
  } catch (error) {
    return res.send(failure(error.message));
  }
};

const getCurrentUser = async (req, res) => {
  const user = req.user;
  const userData = user.toJSON();
  delete userData.password; //remove password before sending

  return res.send(success(userData));
};

const userHomePageController = (request, response, next) => {
  response.sendFile("userHome.html", { root: "views" });
};

module.exports = {
  signupController,
  loginController,
  getCurrentUser,
  userHomePageController,
};
