const User = require("../models/User");

exports.createUser = async (name, email, password) => {
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    let user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw error;
  }
};
