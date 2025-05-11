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

    const response = await axios.post("user/signup", data);
    if (response.data.statusCode === 409) {
      emailAlertSignup.style.display = "block";
      setTimeout(() => {
        emailAlertSignup.style.display = "none";
      }, 3000);
      return;
    }

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
    console.error("An error occurred:", error);
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

    if (response.data && response.data.statusCode === 404) {
      emailAlertLogin.style.display = "block";
      setTimeout(() => {
        emailAlertLogin.style.display = "none";
        e.target.reset();
      }, 3000);
    } else if (response.data && response.data.statusCode === 403) {
      passwordAlertLogin.style.display = "block";
      setTimeout(() => {
        passwordAlertLogin.style.display = "none";
        e.target.logPassword.value = "";
      }, 3000);
    }

    localStorage.setItem("access_token", response.data.result.accessToken);

    successAlertLogin.style.display = "block";
    setTimeout(() => {
      e.target.reset();
      successAlertLogin.style.display = "none";
      window.location.href = `user`;
    }, 1000);
  } catch (error) {
    console.error("An error occurred:", error);
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
const cancelPremium = form3.querySelector("#cancel-premium");

let userCredentials;

form3.addEventListener("submit", onRegister);
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
    console.log(userCredentials);

    localStorage.setItem(
      "access_token",
      userCredentials.data.result.accessToken
    );

    e.target.reset();
    await purchasePremium();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function purchasePremium() {
  try {
    console.log("premium");
  } catch (error) {
    console.log(err);
  }
}

function cancelPayment() {
  alert("You are signed as Basic user");
  window.location.href = "user";
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
