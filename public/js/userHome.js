const token = localStorage.getItem("access_token");

// --------------- Handle Cashfree payment ---------------
const cashfree = Cashfree({ mode: "sandbox" });

document.getElementById("payButton").addEventListener("click", async () => {
  try {
    // Fetch payment session ID from backend
    const response = await axios.post(
      `payment/pay`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { paymentSessionId, orderId } = response.data;

    // Initialize checkout options
    let checkoutOptions = {
      paymentSessionId,
      // redirectTarget: "_self",
      //? Modal payment options
      redirectTarget: "_modal",
      //? Inline payment options
      // redirectTarget: document.getElementById("cf_checkout"),
      // appearance: {
      //   width: "425px",
      //   height: "700px",
      // },
    };

    // Start the checkout process
    const result = await cashfree.checkout(checkoutOptions);

    if (result.error) {
      // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
      console.log(
        "User has closed the popup or there is some payment error, Check for Payment Status"
      );
      console.log(result.error);
    }
    if (result.redirect) {
      // This will be true when the payment redirection page couldn't be opened in the same window
      // This is an exceptional case only when the page is opened inside an inAppBrowser
      // In this case the customer will be redirected to return url once payment is completed
      console.log("Payment will be redirected");
    }
    if (result.paymentDetails) {
      // This will be called whenever the payment is completed irrespective of transaction status
      console.log("Payment has been completed, Check for Payment Status");
      console.log(result.paymentDetails.paymentMessage);

      const response = await axios.get(`payment/payment-status/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.orderStatus === "Success") {
        localStorage.setItem("user_role", "premium");
        window.location.reload();
      }
      alert("Your payment is " + response.data.orderStatus);
    }
  } catch (err) {
    console.error("Error initiating payment:", err.message);
    alert("Payment error. Please try again.");
  }
});
