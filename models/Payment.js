const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnect");

const Payment = sequelize.define(
  "payments",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.STRING, unique: true, allowNull: false },
    paymentSessionId: { type: DataTypes.STRING, allowNull: false },
    orderAmount: { type: DataTypes.INTEGER, allowNull: false },
    orderCurrency: { type: DataTypes.STRING, allowNull: false },
    payment_status: {
      type: DataTypes.ENUM("Success", "Pending", "Failure"),
      defaultValue: "Pending",
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
  }
);

module.exports = Payment;
