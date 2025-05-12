const User = require("./User");
const Expense = require("./Expense");
const ForgotPassword = require("./ForgotPassword");

//User , Expense - One to many
User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

//User, forgot password - one to many
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
