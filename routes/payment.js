const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  initiatePayment,
  checkPaymentStatus,
  getPaymentPage,
} = require("../controllers/payment");

const router = express.Router();

router.get("/", authMiddleware, getPaymentPage); // home page
router.post("/pay", authMiddleware, initiatePayment); // Initiates payment
router.get("/payment-status/:orderId", authMiddleware, checkPaymentStatus); // Fetches payment status

module.exports = router;
