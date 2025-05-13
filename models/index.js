const User = require("./User");
const Expense = require("./Expense");
const ForgotPassword = require("./ForgotPassword");
const Payment = require("./Payment");
const Download = require("./Download");

//User , Expense - One to many
User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

//User, forgot password - one to many
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

//User, Order - One to many
User.hasMany(Payment);
Payment.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

//User, download - one to many
User.hasMany(Download);
Download.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
