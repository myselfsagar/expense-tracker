const User = require("../../models/User");

const createUser = async (userData) => {
  try {
    return await User.create(userData);
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    let user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }
    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async (user, { name, email }) => {
  if (email && email !== user.email) {
    const emailExist = await getUserByEmail(email);
    if (emailExist) {
      throw new ErrorHandler("Email id already registered", 409);
    }
    user.email = email;
  }
  if (name) user.name = name;
  await user.save();
  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
};
