// DOM Elements
const elements = {
  logoutButton: document.getElementById("logoutButton"),
  randomUserImage: document.getElementById("randomUserImage"),
  userCategoryDisplay: document.getElementById("userCategoryDisplay"),
  basicUserLogo: document.getElementById("basicUserLogo"),
  premiumUserLogo: document.getElementById("premiumUserLogo"),
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  updateBtn: document.getElementById("update-profile"),
  emailAlertMessage: document.getElementById("emailAlertMessage"),
  successMessage: document.getElementById("successMessage"),
  resetPassword: document.getElementById("reset-password"),
  resetPasswordMessage: document.getElementById("resetPasswordMessage"),
  buyPremiumButton: document.getElementById("buyPremiumButton"),
  paymentModal: document.getElementById("paymentModal"),
  confirmationText: document.getElementById("confirmationText"),
  proceedToPaymentButton: document.getElementById("proceedToPayment"),
  cancelPaymentButton: document.getElementById("cancelPayment"),
  mobileMenuToggle: document.getElementById("mobileMenuToggle"),
  navMenu: document.getElementById("navMenu"),
};

// Event Listeners
elements.buyPremiumButton.addEventListener("click", handlePremiumPurchase);
elements.logoutButton.addEventListener("click", handleLogout);
elements.proceedToPaymentButton.addEventListener("click", proceedWithPayment);
elements.cancelPaymentButton.addEventListener("click", closePaymentModal);
elements.mobileMenuToggle.addEventListener("click", toggleMobileMenu);
elements.updateBtn.addEventListener("click", updateProfile);
elements.resetPassword.addEventListener("click", passwordReset);

// Global Variables
const randomNum = Math.floor(Math.random() * 20) + 1;
let authenticatedAxios = createAuthenticatedAxios();
let currentUser = {
  name: "",
  email: "",
  role: "basic",
};
const cashfree = Cashfree({ mode: "sandbox" });

// Initialize the application
initializeApplication();

// Functions
function initializeApplication() {
  getUserProfile();
}

function createAuthenticatedAxios() {
  const token = localStorage.getItem("access_token");
  if (token) {
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    window.location.href = "../home";
    return;
  }
}

async function getUserProfile() {
  try {
    const response = await authenticatedAxios.get("currentUser");
    const { name, email, role } = response.data.data;
    currentUser = { name, email, role };

    elements.name.value = name;
    elements.email.value = email;

    if (role === "premium") {
      elements.premiumUserLogo.classList.remove("hidden");
      elements.userCategoryDisplay.textContent = "Premium User";
      elements.buyPremiumButton.classList.add("hidden");
    } else {
      elements.basicUserLogo.classList.remove("hidden");
      elements.userCategoryDisplay.textContent = "Basic User";
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    window.location.href = "/home";
  }
}

// update profile
async function updateProfile() {
  try {
    const data = {
      name: elements.name.value,
      email: elements.email.value,
    };

    await authenticatedAxios.put("updateProfile", data);

    elements.successMessage.classList.remove("hidden");
    setTimeout(() => {
      elements.successMessage.classList.add("hidden");
    }, 3000);
    getUserProfile();
  } catch (error) {
    if (error.response && error.response.status === 409) {
      elements.emailAlertMessage.classList.remove("hidden");
      setTimeout(() => {
        elements.emailAlertMessage.classList.add("hidden");
      }, 3000);
    } else {
      console.error("An error occurred:", error);
    }
  }
}

//password reset
async function passwordReset(e) {
  try {
    await authenticatedAxios.post("../../password/forgotPassword", {
      email: currentUser.email,
    });

    elements.resetPasswordMessage.classList.remove("hidden");
    setTimeout(() => {
      elements.resetPasswordMessage.classList.add("hidden");
    }, 3000);
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Could not send password reset email. Please try again later.");
  }
}

async function handleDeleteExpense(expenseId) {
  try {
    if (confirm("Are you sure you want to delete this expense?")) {
      const response = await authenticatedAxios.delete(
        `expense/deleteExpense/${expenseId}`
      );

      const row = document
        .querySelector(`[data-id="${expenseId}"]`)
        ?.closest("tr");
      if (row) {
        row.remove();
        renumberRows();

        updateTotalExpense(response.data.result.totalExpense);
        elements.lastUpdateDate.textContent = new Date().toLocaleDateString();

        if (currentUser.role === "premium") loadPremiumFeatures();
      }

      // Update the expenseSummary count
      const currentText = elements.expenseSummary.textContent;
      const matches = currentText.match(/Showing (\d+)-(\d+) of (\d+)/);
      if (matches) {
        const total = parseInt(matches[3]) - 1;
        const start = parseInt(matches[1]);
        let end = parseInt(matches[2]);

        // Adjust if we deleted the last item in the range
        if (end > total) end = total;

        elements.expenseSummary.textContent = `Showing ${start}-${end} of ${total}`;
      }
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
}

//handle payment
function handlePremiumPurchase(e) {
  e.preventDefault();
  elements.confirmationText.innerHTML = `<strong>Hi ${currentUser.name}</strong>`;
  elements.paymentModal.classList.remove("hidden");
}

async function proceedWithPayment() {
  try {
    // Fetch payment session ID from backend
    const response = await authenticatedAxios.post(`../payment/pay`, {});

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

      const response = await authenticatedAxios.get(
        `../../payment/payment-status/${orderId}`
      );

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
}

function closePaymentModal() {
  elements.paymentModal.classList.add("hidden");
}

function handleLogout() {
  localStorage.removeItem("access_token");
  window.location.href = "/home";
}

function toggleMobileMenu() {
  elements.navMenu.classList.toggle("active");
}
