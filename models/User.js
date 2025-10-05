const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalExpense: { type: Number, default: 0 },
    role: { type: String, enum: ["basic", "premium"], default: "basic" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
