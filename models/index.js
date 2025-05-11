const User = require("./User");
const Expense = require("./Expense");

//User , Expense - One to many
User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
