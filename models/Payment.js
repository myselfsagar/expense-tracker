const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    orderId: { type: String, unique: true, required: true },
    paymentSessionId: { type: String, required: true },
    orderAmount: { type: Number, required: true },
    orderCurrency: { type: String, required: true },
    payment_status: {
      type: String,
      enum: ["Success", "Pending", "Failure"],
      default: "Pending",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
