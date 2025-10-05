// Mobile menu toggle
document
  .querySelector(".navbar-toggler")
  .addEventListener("click", function () {
    const menu = document.querySelector(".navbar-collapse");
    menu.classList.toggle("show");
  });

// Modal functionality
const signupModal = document.getElementById("signup-modal");
const loginModal = document.getElementById("login-modal");
const premiumModal = document.getElementById("premium-modal");
const forgotModal = document.getElementById("forgot-password-modal");

// Open modal functions
function openSignupModal() {
  signupModal.classList.add("show");
}

function openloginModal() {
  loginModal.classList.add("show");
}

function openPremiumModal() {
  premiumModal.classList.add("show");
}

function openForgotModal() {
  forgotModal.classList.add("show");
}

// Close modal functions
function closeSignupModal() {
  signupModal.classList.remove("show");
}

function closeloginModal() {
  loginModal.classList.remove("show");
}

function closePremiumModal() {
  premiumModal.classList.remove("show");
}

function closeForgotModal() {
  forgotModal.classList.remove("show");
}

// Event listeners for opening modals
document.getElementById("signup-link").addEventListener("click", function (e) {
  e.preventDefault();
  openSignupModal();
});

document.getElementById("login-link").addEventListener("click", function (e) {
  e.preventDefault();
  openloginModal();
});

document
  .getElementById("signup-btn-main")
  .addEventListener("click", function (e) {
    e.preventDefault();
    openSignupModal();
  });

document.getElementById("premium-btn").addEventListener("click", function (e) {
  e.preventDefault();
  openPremiumModal();
});

document
  .getElementById("forgot-password-link")
  .addEventListener("click", function (e) {
    e.preventDefault();
    closeloginModal();
    openForgotModal();
  });

// Event listeners for closing modals
document
  .getElementById("close-signup")
  .addEventListener("click", closeSignupModal);
document
  .getElementById("close-login")
  .addEventListener("click", closeloginModal);
document
  .getElementById("close-premium")
  .addEventListener("click", closePremiumModal);
document
  .getElementById("close-forgot")
  .addEventListener("click", closeForgotModal);

// Switch between signup and login
document
  .getElementById("switch-to-login")
  .addEventListener("click", function (e) {
    e.preventDefault();
    closeSignupModal();
    openloginModal();
  });

document
  .getElementById("switch-to-signup")
  .addEventListener("click", function (e) {
    e.preventDefault();
    closeloginModal();
    openSignupModal();
  });

// Close modals when clicking outside
window.addEventListener("click", function (e) {
  if (e.target === signupModal) closeSignupModal();
  if (e.target === loginModal) closeloginModal();
  if (e.target === premiumModal) closePremiumModal();
  if (e.target === forgotModal) closeForgotModal();
});

// Alert dismiss buttons
document
  .getElementById("close-email-alert-signup")
  .addEventListener("click", function () {
    document.getElementById("email-alert-signup").style.display = "none";
  });

document
  .getElementById("close-password-alert-signup")
  .addEventListener("click", function () {
    document.getElementById("password-alert-signup").style.display = "none";
  });

document
  .getElementById("close-success-alert-signup")
  .addEventListener("click", function () {
    document.getElementById("success-alert-signup").style.display = "none";
  });

document
  .getElementById("close-email-alert-login")
  .addEventListener("click", function () {
    document.getElementById("email-alert-login").style.display = "none";
  });

document
  .getElementById("close-password-alert-login")
  .addEventListener("click", function () {
    document.getElementById("password-alert-login").style.display = "none";
  });

document
  .getElementById("close-success-alert-login")
  .addEventListener("click", function () {
    document.getElementById("success-alert-login").style.display = "none";
  });

document
  .getElementById("close-email-alert-premium")
  .addEventListener("click", function () {
    document.getElementById("email-alert-premium").style.display = "none";
  });

document
  .getElementById("close-password-alert-premium")
  .addEventListener("click", function () {
    document.getElementById("password-alert-premium").style.display = "none";
  });

document
  .getElementById("close-email-alert-forgot")
  .addEventListener("click", function () {
    document.getElementById("email-alert-forgot").style.display = "none";
  });

document
  .getElementById("close-success-alert-forgot")
  .addEventListener("click", function () {
    document.getElementById("success-alert-forgot").style.display = "none";
  });

// Form submissions (simulated)
// FOR SIGN UP
const form1 = document.querySelector("#signup-form");
const signupbtn = form1.querySelector("#signup-submit");
const emailAlertSignup = form1.querySelector("#email-alert-signup");
const successAlertSignup = form1.querySelector("#success-alert-signup");
const passwordAlertSignup = form1.querySelector("#password-alert-signup");
const Name = form1.querySelector("#Name");
const email = form1.querySelector("#email");
const password1 = form1.querySelector("#password1");
const password2 = form1.querySelector("#password2");

form1.addEventListener("submit", onSignup);

async function onSignup(e) {
  try {
    e.preventDefault();

    if (password1.value != password2.value) {
      passwordAlertSignup.style.display = "block";
      setTimeout(() => {
        passwordAlertSignup.style.display = "none";
      }, 3000);
      e.target.reset();
      return;
    }

    const data = {
      name: Name.value,
      email: email.value,
      password: password1.value,
    };

    await axios.post("user/signup", data);

    successAlertSignup.style.display = "block";

    await new Promise((resolve) => {
      setTimeout(() => {
        successAlertSignup.style.display = "none";
        resolve();
      }, 3000);
    });

    e.target.reset();
    closeSignupModal();
    openloginModal();
  } catch (error) {
    if (error.response && error.response.status === 409) {
      emailAlertSignup.style.display = "block";
      setTimeout(() => {
        emailAlertSignup.style.display = "none";
      }, 3000);
    } else {
      console.error("An error occurred:", error);
    }
  }
}

// FOR LOGIN
const form2 = document.querySelector("#login-form");
const loginBtn = form2.querySelector("#login-submit");
const emailAlertLogin = form2.querySelector("#email-alert-login");
const successAlertLogin = form2.querySelector("#success-alert-login");
const passwordAlertLogin = form2.querySelector("#password-alert-login");
const logEmail = form2.querySelector("#logEmail");
const logPassword = form2.querySelector("#logPassword");

form2.addEventListener("submit", onLogin);

async function onLogin(e) {
  try {
    e.preventDefault();

    const data = {
      email: logEmail.value,
      password: logPassword.value,
    };

    const response = await axios.post("user/login", data);
    localStorage.setItem("access_token", response.data.data);

    successAlertLogin.style.display = "block";
    setTimeout(() => {
      e.target.reset();
      successAlertLogin.style.display = "none";
      window.location.replace(`user`);
    }, 1000);
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;

      if (statusCode === 404) {
        // User not found
        emailAlertLogin.style.display = "block";
        setTimeout(() => {
          emailAlertLogin.style.display = "none";
          e.target.reset();
        }, 3000);
      } else if (statusCode === 401) {
        // Incorrect password
        passwordAlertLogin.style.display = "block";
        setTimeout(() => {
          passwordAlertLogin.style.display = "none";
          form2.querySelector("#logPassword").value = "";
        }, 3000);
      }
    } else {
      console.error("An error occurred:", error);
    }
  }
}
// FOR BUYING PREMIUM
const form3 = document.querySelector("#premium-form");
const registerBtn = form3.querySelector("#register-submit");
const emailAlertPremium = form3.querySelector("#email-alert-premium");
const successAlertPremium = form3.querySelector("#success-alert-premium");
const passwordAlertPremium = form3.querySelector("#password-alert-premium");
const rgstrName = form3.querySelector("#rgstrName");
const rgstrEmail = form3.querySelector("#rgstrEmail");
const rgstrPassword1 = form3.querySelector("#rgstrPassword1");
const rgstrPassword2 = form3.querySelector("#rgstrPassword2");
const proceedPremium = form3.querySelector("#proceed-payment");
const cancelPremium = form3.querySelector("#cancel-premium");

let userCredentials;

form3.addEventListener("submit", onRegister);
proceedPremium.addEventListener("click", proceedPayment);
cancelPremium.addEventListener("click", cancelPayment);

async function onRegister(e) {
  try {
    e.preventDefault();

    if (rgstrPassword1.value !== rgstrPassword2.value) {
      passwordAlertPremium.style.display = "block";
      setTimeout(() => {
        passwordAlertPremium.style.display = "none";
      }, 3000);
      return;
    }

    const data = {
      name: rgstrName.value,
      email: rgstrEmail.value,
      password: rgstrPassword1.value,
    };

    signupResponse = await axios.post("user/signup", data);
    if (signupResponse.data.statusCode === 409) {
      emailAlertPremium.style.display = "block";
      setTimeout(() => {
        emailAlertPremium.style.display = "none";
      }, 3000);
      e.target.reset();
      return;
    }

    //when user is going for premium directly login him after signup
    userCredentials = await axios.post("user/login", {
      email: data.email,
      password: data.password,
    });

    localStorage.setItem(
      "access_token",
      userCredentials.data.result.accessToken
    );

    successAlertPremium.style.display = "block";
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// --------------- Handle Cashfree payment ---------------
const cashfree = Cashfree({ mode: "sandbox" });

async function proceedPayment() {
  try {
    const token = localStorage.getItem("access_token");
    // Fetch payment session ID from backend
    const response = await axios.post(
      `payment/pay`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    clearFields();

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
      const response = await axios.get(`payment/payment-status/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.orderStatus === "Success") {
        localStorage.setItem("user_role", "premium");
        window.location.reload();
      }
      alert("Thanks for being a premium member.");
      window.location.replace("user");
    }
  } catch (err) {
    console.error("Error initiating payment:", err.message);
    alert("Payment error. Please try again.");
  }
}

function clearFields() {
  // Remove form elements and show success message
  const formGroups = form3.querySelectorAll(".form-group");
  formGroups.forEach((group) => {
    group.style.display = "none";
  });
  registerBtn.style.display = "none";
}

function cancelPayment() {
  alert("You are signed as Basic user");
  window.location.replace("user");
}

// FOR PASSWORD RESET
const forgotForm = document.querySelector("#forgot-password-form");
const forgotEmail = forgotForm.querySelector("#forgotEmail");
const emailAlertForgot = forgotForm.querySelector("#email-alert-forgot");
const successAlertForgot = forgotForm.querySelector("#success-alert-forgot");
const submitForgot = forgotForm.querySelector("#submit-forgot");

forgotForm.addEventListener("submit", passwordReset);

async function passwordReset(e) {
  try {
    e.preventDefault();
    const data = { email: forgotEmail.value };

    await axios.post("password/forgotPassword", data);

    successAlertForgot.style.display = "block";
    setTimeout(() => {
      successAlertForgot.style.display = "none";
      forgotForm.reset();
      closeForgotModal();
      openloginModal();
    }, 5000);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      emailAlertForgot.style.display = "block";
      setTimeout(() => {
        emailAlertForgot.style.display = "none";
      }, 3000);
    } else {
      console.error("An error occurred:", error);
    }
  }
}

// Password visibility toggle functionality
document.querySelectorAll(".password-toggle").forEach((toggle) => {
  toggle.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const passwordInput = document.getElementById(targetId);

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      this.classList.remove("fa-eye");
      this.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      this.classList.remove("fa-eye-slash");
      this.classList.add("fa-eye");
    }
  });
});
