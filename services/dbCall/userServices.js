const User = require("../../models/User");
const ErrorHandler = require("../../utils/errorHandler");

const createUser = (userData) => User.create(userData);

const getUserByEmail = (email) => User.findOne({ email });

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  return user;
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
