const { Cashfree } = require("cashfree-pg");

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

const createOrder = async (
  orderAmount,
  orderCurrency = "INR",
  orderId,
  customerID,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 30 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: {
        customer_id: customerID,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.WEBSITE}/user`,
        // payment_methods: "cc,dc,upi",
      },
      order_expiry_time: formattedExpiryDate,
    };

    const response = await Cashfree.PGCreateOrder("2025-01-01", request);

    return response.data.payment_session_id;
  } catch (err) {
    console.error("Error processing payment:", err);
    throw new Error(`Error creating order - ${err.message}`);
  }
};

const getPaymentStatus = async (orderId) => {
  try {
    const response = await Cashfree.PGOrderFetchPayments("2025-01-01", orderId);
    let getOrderResponse = response.data;
    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }
    console.log(orderStatus);

    return orderStatus;
  } catch (err) {
    console.error("Error fetching payment status:", err);
    throw new Error(`Error fetching payment status - ${err.message}`);
  }
};

module.exports = { createOrder, getPaymentStatus };
