const mongoose = require("mongoose");
const { Schema } = mongoose;

const forgotPasswordSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForgotPassword", forgotPasswordSchema);
