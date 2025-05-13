const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnect");

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  totalExpense: { type: DataTypes.FLOAT, defaultValue: 0 },
  role: { type: DataTypes.ENUM("basic", "premium"), defaultValue: "basic" },
});

module.exports = User;
