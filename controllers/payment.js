const cashfreeService = require("../services/cashfree");
const Payment = require("../models/Payment");
const User = require("../models/User");

const getPaymentPage = (req, res) => {
  res.sendFile("userHome.html", { root: "views" });
};

const initiatePayment = async (req, res) => {
  try {
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const orderId = `order_${Date.now()}`;
    const customerID = req.user.id;
    const customerPhone = "9999999999";

    // Call the Cashfree service function to create an order
    const paymentSessionId = await cashfreeService.createOrder(
      orderAmount,
      orderCurrency,
      orderId,
      customerID.toString(),
      customerPhone
    );

    //* Save Payment details to the database
    await Payment.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      payment_status: "PENDING",
      userId: customerID,
    });

    res.status(200).json({ paymentSessionId, orderId });
  } catch (err) {
    console.error("Error initiating payment:", err);
    res
      .status(500)
      .json({ Error: `Payment initiation failed - ${err.message}` });
  }
};

const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ Error: "Order ID is required." });
    }

    const orderStatus = await cashfreeService.getPaymentStatus(orderId);

    // Find and update the payment status in DB
    const order = await Payment.findOne({ where: { orderId } });
    if (!order) {
      return res.status(404).json({ Error: "Order not found." });
    }
    order.payment_status = orderStatus;
    await order.save();

    if (orderStatus === "Success") {
      await User.update({ role: "premium" }, { where: { id: order.userId } });
    }

    res.status(200).json({ orderAmount: order.orderAmount, orderStatus });
  } catch (err) {
    console.error("Error fetching payment status:", err);
    res
      .status(500)
      .json({ Error: "Error updating payment status", details: err.message });
  }
};

module.exports = {
  initiatePayment,
  checkPaymentStatus,
  getPaymentPage,
};
